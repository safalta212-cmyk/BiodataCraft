import { db, isConfigured, getStorageInstance, auth } from '../config/firebase';
import {
  Template,
  TemplateCategory,
  TemplateFilterParams
} from '../types/template';
import { INITIAL_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templateData';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';

// Dynamically load Firestore functions only when needed, keeping initial client bundle lightweight
const loadFirestore = async () => {
  const { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } = await import('firebase/firestore');
  return { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy };
};

const TEMPLATES_COLLECTION = 'templates';
const CATEGORIES_COLLECTION = 'categories';
const LOCAL_STORAGE_CUSTOM_TEMPLATES = 'biodatacraft_admin_custom_templates';

// Backward compatibility alias map for historical/regional template slug references
const SLUG_ALIASES: Record<string, string> = {
  'vedic-crimson': 'vedic-aura',
  'emerald-islamic': 'emerald-royalty',
  'marigold-bliss': 'blush-serenade',
  'ivory-classic': 'executive-ivory',
  'sapphire-grandeur': 'peacock-glory',
  'rose-romance': 'blush-serenade'
};

function verifyAdminAuthorization(): void {
  if (typeof window === 'undefined') return;
  const isAuthed = Boolean(
    sessionStorage.getItem('biodatacraft_admin_token') ||
    sessionStorage.getItem('biodatacraft_admin_session_token') ||
    sessionStorage.getItem('biodatacraft_admin_auth_user') ||
    localStorage.getItem('biodatacraft_admin_token') ||
    auth?.currentUser
  );
  if (!isAuthed) {
    throw new Error('Unauthorized: Administrator clearance required to modify template catalog.');
  }
}

/**
 * Ensures asynchronous Firestore/Storage promises reject with clear messages instead of hanging indefinitely
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const timer = setTimeout(() => {
        reject(
          new Error(
            `${operationName} timed out after ${timeoutMs / 1000}s. Please check network connectivity and Firebase permissions.`
          )
        );
      }, timeoutMs);
      if (typeof timer === 'object' && timer !== null && 'unref' in timer) {
        (timer as any).unref();
      }
    })
  ]);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses and scales an image down using HTML5 canvas
 * Produces lightweight (<75KB) images that fit safely in Firestore (1MB limit)
 * and render instantly without lag.
 */
export function compressImageFile(
  file: File,
  maxWidth = 600,
  maxHeight = 850,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type.toLowerCase().includes('svg')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
      return;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      fileToDataUrl(file).then(resolve).catch(reject);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        fileToDataUrl(file).then(resolve).catch(reject);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG with controlled quality for tiny payload
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback to raw data url if canvas decode fails
      fileToDataUrl(file).then(resolve).catch(reject);
    };

    img.src = objectUrl;
  });
}


/**
 * Template Service provides secure CRUD and querying for Template Metadata (Firestore)
 * and Template Assets (Firebase Storage).
 *
 * Strictly follows Core Principle: ZERO customer biodatas are ever stored.
 * Only platform template metadata is handled here.
 */
class TemplateService {
  private localTemplates: Template[] = [...INITIAL_TEMPLATES];
  private cachedCategories: TemplateCategory[] | null = null;
  private categoriesCacheTime: number = 0;
  private cachedAllTemplates: Template[] | null = null;
  private templatesCacheTime: number = 0;
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

  constructor() {
    this.loadLocalCustomTemplates();
  }

  public invalidateCache(): void {
    this.cachedCategories = null;
    this.categoriesCacheTime = 0;
    this.cachedAllTemplates = null;
    this.templatesCacheTime = 0;
  }

  public getAllTemplatesSync(): Template[] {
    this.loadLocalCustomTemplates();
    return [...this.localTemplates];
  }

  public getTemplateSync(idOrSlug: string): Template | undefined {
    this.loadLocalCustomTemplates();
    const clean = idOrSlug.trim();
    const effectiveSlug = SLUG_ALIASES[clean.toLowerCase()] || clean;
    return this.localTemplates.find(
      (t) => t.id === clean || t.slug === clean || t.id === effectiveSlug || t.slug === effectiveSlug
    );
  }

  private loadLocalCustomTemplates() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TEMPLATES);
      if (stored) {
        const custom: Template[] = JSON.parse(stored);
        if (Array.isArray(custom)) {
          const customFiltered = custom.filter(
            (c) => !INITIAL_TEMPLATES.some((init) => init.id === c.id)
          );
          this.localTemplates = [...INITIAL_TEMPLATES, ...customFiltered];
          return;
        }
      }
    } catch {
      // Ignore
    }
    this.localTemplates = [...INITIAL_TEMPLATES];
  }

  private saveLocalCustomTemplates(templates: Template[]) {
    const customOnly = templates.filter(
      (t) => !INITIAL_TEMPLATES.some((init) => init.id === t.id)
    );
    try {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_TEMPLATES, JSON.stringify(customOnly));
    } catch {
      // Quota exceeded fallback: strip base64 image data URIs to preserve template metadata
      try {
        const lightweight = customOnly.map((t) => ({
          ...t,
          thumbnail: t.thumbnail?.startsWith('data:') ? '' : t.thumbnail,
          previewImage: t.previewImage?.startsWith('data:') ? '' : t.previewImage
        }));
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_TEMPLATES, JSON.stringify(lightweight));
      } catch {
        // Ignore if storage is completely full
      }
    }
    this.invalidateCache();
  }

  /**
   * Retrieves categories (merging default taxonomy with Firestore categories)
   */
  async getCategories(forceRefresh = false): Promise<TemplateCategory[]> {
    const now = Date.now();
    if (!forceRefresh && this.cachedCategories && now - this.categoriesCacheTime < this.CACHE_TTL_MS) {
      return this.cachedCategories;
    }

    const categoryMap = new Map<string, TemplateCategory>();
    for (const cat of TEMPLATE_CATEGORIES) {
      categoryMap.set(cat.id, cat);
    }

    // Load any custom categories from localStorage
    try {
      const stored = localStorage.getItem('biodatacraft_admin_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          for (const c of parsed) {
            categoryMap.set(c.id, c);
          }
        }
      }
    } catch {
      // Ignore
    }

    if (isConfigured && db) {
      try {
        const { collection, getDocs } = await loadFirestore();
        const catCol = collection(db, CATEGORIES_COLLECTION);
        const snapshot = await withTimeout(getDocs(catCol), 10000, 'Firestore categories query');
        if (!snapshot.empty) {
          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data() as TemplateCategory;
            categoryMap.set(data.id || docSnap.id, {
              ...data,
              id: data.id || docSnap.id
            });
          });
        }
      } catch (err) {
        console.warn('Firestore categories query notice:', err);
      }
    }

    const allCategories = Array.from(categoryMap.values()).sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
    this.cachedCategories = allCategories;
    this.categoriesCacheTime = now;
    return allCategories;
  }

  /**
   * Admin CRUD: Create a new category in Firestore & local cache
   */
  async createCategory(categoryData: Omit<TemplateCategory, 'id'> & { id?: string }): Promise<TemplateCategory> {
    verifyAdminAuthorization();
    const cleanSlug = categoryData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const id = categoryData.id || `cat-${cleanSlug || Date.now()}`;
    const newCategory: TemplateCategory = {
      ...categoryData,
      id,
      slug: cleanSlug || id,
      sortOrder: categoryData.sortOrder || 99
    };

    if (isConfigured && db) {
      const { doc, setDoc } = await loadFirestore();
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      try {
        await withTimeout(setDoc(docRef, newCategory), 15000, 'Firestore category creation');
      } catch (err: any) {
        if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
          handleFirestoreError(err, OperationType.CREATE, `${CATEGORIES_COLLECTION}/${id}`);
        }
        throw err;
      }
    }

    // Persist to local storage custom categories cache
    try {
      const stored = localStorage.getItem('biodatacraft_admin_categories');
      const existing: TemplateCategory[] = stored ? JSON.parse(stored) : [];
      const updated = [...existing.filter((c) => c.id !== id), newCategory];
      localStorage.setItem('biodatacraft_admin_categories', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    this.invalidateCache();
    return newCategory;
  }

  /**
   * Admin CRUD: Update category in Firestore & local cache
   */
  async updateCategory(id: string, updates: Partial<TemplateCategory>): Promise<boolean> {
    verifyAdminAuthorization();
    if (isConfigured && db) {
      const { doc, updateDoc } = await loadFirestore();
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      try {
        await withTimeout(updateDoc(docRef, updates), 15000, 'Firestore category update');
      } catch (err: any) {
        if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
          handleFirestoreError(err, OperationType.UPDATE, `${CATEGORIES_COLLECTION}/${id}`);
        }
        throw err;
      }
    }

    this.invalidateCache();
    return true;
  }

  /**
   * Admin CRUD: Delete category from Firestore & local cache
   */
  async deleteCategory(id: string): Promise<boolean> {
    verifyAdminAuthorization();
    if (isConfigured && db) {
      const { doc, deleteDoc } = await loadFirestore();
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      try {
        await withTimeout(deleteDoc(docRef), 15000, 'Firestore category deletion');
      } catch (err: any) {
        if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
          handleFirestoreError(err, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${id}`);
        }
        throw err;
      }
    }

    try {
      const stored = localStorage.getItem('biodatacraft_admin_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((c) => c.id !== id);
          localStorage.setItem('biodatacraft_admin_categories', JSON.stringify(filtered));
        }
      }
    } catch {
      // Ignore
    }

    this.invalidateCache();
    return true;
  }

  /**
   * Retrieves templates with multi-criteria filtering and sorting
   */
  async getTemplates(filters?: TemplateFilterParams): Promise<Template[]> {
    let results: Template[] = [];
    const now = Date.now();

    if (!filters?.forceRefresh && this.cachedAllTemplates && now - this.templatesCacheTime < this.CACHE_TTL_MS) {
      results = [...this.cachedAllTemplates];
    } else {
      this.loadLocalCustomTemplates();
      let firestoreTemplates: Template[] = [];

      if (isConfigured && db) {
        try {
          const { collection, getDocs } = await loadFirestore();
          const templatesCol = collection(db, TEMPLATES_COLLECTION);
          // Direct collection query avoids silently dropping documents with missing/unindexed fields
          const snapshot = await withTimeout(getDocs(templatesCol), 15000, 'Firestore templates query');

          if (!snapshot.empty) {
            firestoreTemplates = snapshot.docs.map((docSnap) => ({
              ...docSnap.data(),
              id: docSnap.id
            } as Template));
          }
        } catch (err) {
          console.warn('Firestore templates query notice, falling back to local inventory:', err);
        }
      }

      // Merge: start with all local templates (INITIAL + localStorage custom)
      const templateMap = new Map<string, Template>();
      for (const t of this.localTemplates) {
        templateMap.set(t.id, t);
      }
      // Overlay Firestore documents (cloud truth)
      for (const ft of firestoreTemplates) {
        templateMap.set(ft.id, ft);
      }

      results = Array.from(templateMap.values());
      // Sort by sortOrder ascending
      results.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));

      this.localTemplates = [...results];
      this.cachedAllTemplates = [...results];
      this.templatesCacheTime = now;
    }

    // Apply Client-Side Filtering
    if (filters) {
      // By default, if includeUnpublished is not true, only show published
      if (!filters.includeUnpublished && !filters.status) {
        results = results.filter((t) => t.isPublished);
      }

      // Status filter
      if (filters.status && filters.status !== 'all') {
        if (filters.status === 'published') {
          results = results.filter((t) => t.isPublished);
        } else if (filters.status === 'draft') {
          results = results.filter((t) => !t.isPublished);
        }
      }

      // Search
      if (filters.search && filters.search.trim()) {
        const term = filters.search.toLowerCase().trim();
        results = results.filter(
          (t) =>
            t.name.toLowerCase().includes(term) ||
            t.slug.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term) ||
            t.popularFor.toLowerCase().includes(term) ||
            t.tagline.toLowerCase().includes(term) ||
            (t.categoryName && t.categoryName.toLowerCase().includes(term))
        );
      }

      // Category
      if (filters.categoryId && filters.categoryId !== 'all') {
        if (filters.categoryId === 'premium') {
          results = results.filter(
            (t) =>
              t.isPremium ||
              t.categoryId === 'premium' ||
              t.style === 'Royal' ||
              (t.categoryName && t.categoryName.toLowerCase().includes('premium'))
          );
        } else if (filters.categoryId === 'royal') {
          results = results.filter(
            (t) =>
              t.style === 'Royal' ||
              t.categoryId === 'royal' ||
              t.categoryId === 'traditional' ||
              t.isPremium
          );
        } else {
          results = results.filter((t) => t.categoryId === filters.categoryId);
        }
      }

      // Religion
      if (filters.religion && filters.religion !== 'all') {
        results = results.filter(
          (t) => t.religion === filters.religion || t.religion === 'Universal'
        );
      }

      // Region
      if (filters.region && filters.region !== 'all') {
        results = results.filter(
          (t) => t.region === filters.region || t.region === 'NRI / Global'
        );
      }

      // Language
      if (filters.language && filters.language !== 'all') {
        results = results.filter(
          (t) =>
            t.language === filters.language ||
            t.language === 'Bilingual' ||
            t.language === 'Any'
        );
      }

      // Free / Premium Tier
      if (filters.tier && filters.tier !== 'all') {
        if (filters.tier === 'free') {
          results = results.filter((t) => t.isFree && !t.isPremium);
        } else if (filters.tier === 'premium') {
          results = results.filter(
            (t) =>
              t.isPremium ||
              t.style === 'Royal' ||
              t.categoryId === 'premium' ||
              (t.categoryName && t.categoryName.toLowerCase().includes('premium'))
          );
        }
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'name':
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'newest':
            results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'popular':
          case 'sortOrder':
          default:
            results.sort((a, b) => a.sortOrder - b.sortOrder);
            break;
        }
      }
    } else {
      // Default: only published
      results = results.filter((t) => t.isPublished);
    }

    return results;
  }

  /**
   * Retrieves single template by slug
   */
  async getTemplateBySlug(slug: string, allowUnpublished: boolean = false): Promise<Template | null> {
    const effectiveSlug = SLUG_ALIASES[slug.toLowerCase()] || slug;
    const all = await this.getTemplates({ includeUnpublished: true });
    const match = all.find(
      (t) => t.slug === effectiveSlug || t.id === effectiveSlug || t.slug === slug || t.id === slug
    );
    if (!match) return null;
    if (!allowUnpublished && !match.isPublished) return null;
    return match;
  }

  /**
   * Admin CRUD: Create a new template metadata entry in Firestore & Local Storage
   */
  async createTemplate(
    data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Template> {
    verifyAdminAuthorization();
    this.loadLocalCustomTemplates();
    const cleanSlug = data.slug.trim().toLowerCase();
    const existing = this.localTemplates.find((t) => t.slug === cleanSlug);
    if (existing) {
      throw new Error(`A template with slug "${cleanSlug}" already exists.`);
    }

    const id = `tmpl-${Date.now()}`;
    const now = new Date().toISOString();
    const newTemplate: Template = {
      ...data,
      slug: cleanSlug,
      id,
      createdAt: now,
      updatedAt: now
    };

    if (!isConfigured || !db) {
      throw new Error('Firestore database is not configured. Please check firebase-applet-config.json.');
    }

    // Await confirmation of actual write to Firestore - DO NOT swallow errors
    const { doc, setDoc } = await loadFirestore();
    const docRef = doc(db, TEMPLATES_COLLECTION, id);
    try {
      await withTimeout(setDoc(docRef, newTemplate), 15000, 'Firestore template creation');
    } catch (err: any) {
      if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
        handleFirestoreError(err, OperationType.CREATE, `${TEMPLATES_COLLECTION}/${id}`);
      }
      throw err;
    }

    // Only after Firestore confirms the write, update cache and local state
    this.localTemplates.push(newTemplate);
    this.saveLocalCustomTemplates(this.localTemplates);
    this.invalidateCache();
    return newTemplate;
  }

  /**
   * Admin CRUD: Update existing template metadata in Firestore & Local Storage
   */
  async updateTemplate(id: string, updates: Partial<Template>): Promise<boolean> {
    verifyAdminAuthorization();
    this.loadLocalCustomTemplates();
    const now = new Date().toISOString();
    const cleanUpdates = { ...updates, updatedAt: now };

    if (!isConfigured || !db) {
      throw new Error('Firestore database is not configured.');
    }

    const { doc, updateDoc } = await loadFirestore();
    const docRef = doc(db, TEMPLATES_COLLECTION, id);
    try {
      await withTimeout(updateDoc(docRef, cleanUpdates), 15000, 'Firestore template update');
    } catch (err: any) {
      if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
        handleFirestoreError(err, OperationType.UPDATE, `${TEMPLATES_COLLECTION}/${id}`);
      }
      throw err;
    }

    const idx = this.localTemplates.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.localTemplates[idx] = { ...this.localTemplates[idx], ...cleanUpdates };
      this.saveLocalCustomTemplates(this.localTemplates);
      this.invalidateCache();
    }
    return true;
  }

  /**
   * Admin CRUD: Delete template metadata from Firestore & Local Storage
   */
  async deleteTemplate(id: string): Promise<boolean> {
    verifyAdminAuthorization();
    this.loadLocalCustomTemplates();
    if (!isConfigured || !db) {
      throw new Error('Firestore database is not configured.');
    }

    const { doc, deleteDoc } = await loadFirestore();
    const docRef = doc(db, TEMPLATES_COLLECTION, id);
    try {
      await withTimeout(deleteDoc(docRef), 15000, 'Firestore template deletion');
    } catch (err: any) {
      if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
        handleFirestoreError(err, OperationType.DELETE, `${TEMPLATES_COLLECTION}/${id}`);
      }
      throw err;
    }

    this.localTemplates = this.localTemplates.filter((t) => t.id !== id);
    this.saveLocalCustomTemplates(this.localTemplates);
    this.invalidateCache();
    return true;
  }

  /**
   * Admin CRUD: Duplicate an existing template
   */
  async duplicateTemplate(id: string): Promise<Template | null> {
    this.loadLocalCustomTemplates();
    const source = (await this.getTemplateBySlug(id, true)) || this.localTemplates.find((t) => t.id === id);
    if (!source) return null;

    const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;
    const cloneData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
      ...source,
      name: `${source.name} (Copy)`,
      slug: newSlug,
      isPublished: false, // Default duplicated templates to Draft
      sortOrder: (source.sortOrder || 1) + 1,
      tagline: source.tagline || '',
      popularFor: source.popularFor || ''
    };

    return await this.createTemplate(cloneData);
  }

  /**
   * Admin CRUD: Reorder templates by list of IDs
   */
  async reorderTemplates(orderedIds: string[]): Promise<boolean> {
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      await this.updateTemplate(id, { sortOrder: i + 1 });
    }
    return true;
  }

  /**
   * Admin Storage & Uploads: Upload template visual asset to Firebase Storage & record upload metadata
   */
  async uploadTemplateAsset(
    file: File,
    assetName: string,
    type: 'thumbnail' | 'preview' = 'thumbnail'
  ): Promise<string> {
    verifyAdminAuthorization();
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and SVG images are allowed.');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds the 10MB maximum limit.');
    }

    const safeName = assetName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Pre-compress and optimize client-side to ensure lightweight data payload (<75KB)
    const maxWidth = type === 'thumbnail' ? 600 : 1000;
    const maxHeight = type === 'thumbnail' ? 840 : 1400;
    const compressedDataUrl = await compressImageFile(file, maxWidth, maxHeight, 0.82);

    let finalUrl = '';

    // Attempt Firebase Storage bucket upload with sensible 4s timeout
    if (isConfigured) {
      try {
        const storageInstance = await getStorageInstance();
        if (storageInstance) {
          const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
          const storageRef = ref(storageInstance, `template-assets/${Date.now()}_${safeName}`);
          const snapshot = await withTimeout(
            uploadBytes(storageRef, file, { contentType: file.type }),
            4000,
            'Firebase Storage asset upload'
          );
          finalUrl = await getDownloadURL(snapshot.ref);
        }
      } catch (err: any) {
        console.warn('Firebase Storage asset upload notice, using persistent web-optimized asset URL:', err);
      }
    }

    // If storage is unavailable or timed out, use the optimized compressed image data URL
    if (!finalUrl) {
      finalUrl = compressedDataUrl;
    }

    // Record upload document in Firestore uploads collection
    if (isConfigured && db) {
      const uploadId = `upl-${Date.now()}`;
      try {
        const { doc, setDoc } = await loadFirestore();
        await withTimeout(
          setDoc(doc(db, 'uploads', uploadId), {
            fileName: safeName,
            url: finalUrl.startsWith('data:') ? finalUrl.slice(0, 120) + '...' : finalUrl,
            mimeType: file.type,
            size: file.size,
            type,
            createdAt: new Date().toISOString()
          }),
          5000,
          'Firestore upload record creation'
        );
      } catch (err: any) {
        if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
          handleFirestoreError(err, OperationType.CREATE, `uploads/${uploadId}`);
        }
        console.warn('Firestore upload tracking record notice:', err);
      }
    }

    return finalUrl;
  }
}

export const templateService = new TemplateService();

