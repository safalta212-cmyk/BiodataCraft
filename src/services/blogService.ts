import { BlogPost, BLOG_POSTS } from '../data/blogData';
import { db, isConfigured, getStorageInstance, auth } from '../config/firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestoreError';

const BLOG_COLLECTION = 'blog_posts';
const BLOG_STORAGE_KEY = 'biodatacraft_admin_blog_posts_v2';

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
    throw new Error('Unauthorized: Administrator clearance required to modify blog publications.');
  }
}

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

class BlogService {
  private posts: BlogPost[] = [...BLOG_POSTS];
  private cachedTime: number = 0;
  private readonly CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

  constructor() {
    this.loadLocalPosts();
  }

  private loadLocalPosts(): void {
    try {
      const stored = localStorage.getItem(BLOG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customOnly = parsed.filter(
            (p: BlogPost) => !BLOG_POSTS.some((init) => init.slug === p.slug || (init.id && init.id === p.id))
          );
          this.posts = [...BLOG_POSTS, ...customOnly];
          return;
        }
      }
    } catch {
      // Ignore parse or storage errors
    }
    this.posts = [...BLOG_POSTS];
  }

  private saveLocalPosts(postsList: BlogPost[]): void {
    try {
      const customOnly = postsList.filter(
        (p) => !BLOG_POSTS.some((init) => init.slug === p.slug || (init.id && init.id === p.id))
      );
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(customOnly));
    } catch {
      // Ignore quota errors
    }
  }

  public invalidateCache(): void {
    this.cachedTime = 0;
  }

  /**
   * Synchronous getter for instant page rendering
   */
  public getPostsSync(options?: {
    includeUnpublished?: boolean;
    category?: string;
    search?: string;
  }): BlogPost[] {
    this.loadLocalPosts();
    return this.applyFilters([...this.posts], options);
  }

  /**
   * Synchronous getter for single post
   */
  public getPostBySlugSync(slug: string, includeUnpublished = false): BlogPost | null {
    this.loadLocalPosts();
    const clean = slug.trim().toLowerCase();
    const match = this.posts.find(
      (p) => p.slug.toLowerCase() === clean || (p.id && p.id.toLowerCase() === clean)
    );
    if (!match) return null;
    if (!includeUnpublished && match.isPublished === false) return null;
    return match;
  }

  /**
   * Retrieves posts asynchronously from Firestore with local fallback
   */
  public async getPosts(options?: {
    includeUnpublished?: boolean;
    category?: string;
    search?: string;
  }): Promise<BlogPost[]> {
    const now = Date.now();
    if (now - this.cachedTime < this.CACHE_TTL_MS && this.posts.length > 0) {
      return this.applyFilters([...this.posts], options);
    }

    this.loadLocalPosts();
    let firestorePosts: BlogPost[] = [];

    if (isConfigured && db) {
      try {
        const colRef = collection(db, BLOG_COLLECTION);
        const q = query(colRef, orderBy('createdAt', 'desc'));
        const snapshot = await withTimeout(getDocs(q), 8000, 'Firestore blog posts query');

        if (!snapshot.empty) {
          firestorePosts = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              slug: data.slug || docSnap.id,
              title: data.title || 'Untitled Article',
              excerpt: data.excerpt || '',
              category: data.category || 'Guides',
              publishedDate: data.publishedDate || 'Recent',
              readTime: data.readTime || '5 min read',
              author: data.author || 'Editorial Team',
              content: Array.isArray(data.content) ? data.content : [data.content || ''],
              featuredImage: data.featuredImage || '',
              seoTitle: data.seoTitle || data.title,
              seoDescription: data.seoDescription || data.excerpt,
              isPublished: data.isPublished !== false,
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt || new Date().toISOString()
            } as BlogPost;
          });
        }
      } catch (err: any) {
        console.warn('Firestore blog query notice, falling back to local posts:', err);
      }
    }

    // Merge: start with default & local posts, overlay Firestore records
    const postMap = new Map<string, BlogPost>();
    for (const p of this.posts) {
      postMap.set(p.slug, p);
    }
    for (const fp of firestorePosts) {
      postMap.set(fp.slug, fp);
    }

    this.posts = Array.from(postMap.values());
    this.saveLocalPosts(this.posts);
    this.cachedTime = now;

    return this.applyFilters([...this.posts], options);
  }

  /**
   * Retrieves single post by slug asynchronously from Firestore
   */
  public async getPostBySlug(slug: string, includeUnpublished = false): Promise<BlogPost | null> {
    const all = await this.getPosts({ includeUnpublished: true });
    const clean = slug.trim().toLowerCase();
    const match = all.find(
      (p) => p.slug.toLowerCase() === clean || (p.id && p.id.toLowerCase() === clean)
    );
    if (!match) return null;
    if (!includeUnpublished && match.isPublished === false) return null;
    return match;
  }

  private applyFilters(
    list: BlogPost[],
    options?: {
      includeUnpublished?: boolean;
      category?: string;
      search?: string;
    }
  ): BlogPost[] {
    let result = list;

    if (!options?.includeUnpublished) {
      result = result.filter((p) => p.isPublished !== false);
    }

    if (options?.category && options.category !== 'All') {
      result = result.filter((p) => p.category === options.category);
    }

    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }

  private sanitizeContent(text: string): string {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  /**
   * Creates a new blog article and persists it directly into Firestore & local cache
   */
  public async createPost(
    data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BlogPost> {
    verifyAdminAuthorization();
    this.loadLocalPosts();

    const cleanSlug = data.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!cleanSlug) {
      throw new Error('A valid slug identifier is required.');
    }

    const existing = this.posts.find((p) => p.slug === cleanSlug);
    if (existing) {
      throw new Error(`An article with slug "${cleanSlug}" already exists.`);
    }

    if (!data.content || data.content.length === 0 || data.content.every((c) => !c.trim())) {
      throw new Error('Article content cannot be empty.');
    }

    const sanitizedContent = (Array.isArray(data.content) ? data.content : [data.content])
      .map((c) => this.sanitizeContent(c))
      .filter((c) => c.trim().length > 0);

    const id = `post-${Date.now()}`;
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...data,
      id,
      slug: cleanSlug,
      title: this.sanitizeContent(data.title.trim()),
      excerpt: this.sanitizeContent(data.excerpt.trim()),
      content: sanitizedContent,
      createdAt: now,
      updatedAt: now,
      isPublished: data.isPublished !== false
    };

    if (isConfigured && db) {
      const docRef = doc(db, BLOG_COLLECTION, id);
      try {
        await withTimeout(setDoc(docRef, newPost), 15000, 'Firestore blog post creation');
      } catch (err: any) {
        if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
          handleFirestoreError(err, OperationType.CREATE, `${BLOG_COLLECTION}/${id}`);
        }
        throw err;
      }
    }

    this.posts = [newPost, ...this.posts];
    this.saveLocalPosts(this.posts);
    this.invalidateCache();
    return newPost;
  }

  /**
   * Updates existing blog article in Firestore & local cache
   */
  public async updatePost(slugOrId: string, updates: Partial<BlogPost>): Promise<boolean> {
    verifyAdminAuthorization();
    this.loadLocalPosts();

    const idx = this.posts.findIndex((p) => p.slug === slugOrId || p.id === slugOrId);
    if (idx === -1) {
      throw new Error(`Article "${slugOrId}" not found.`);
    }

    const currentPost = this.posts[idx];
    const docId = currentPost.id || `post-${currentPost.slug}`;
    const now = new Date().toISOString();

    const cleanUpdates: Partial<BlogPost> = {
      ...updates,
      updatedAt: now
    };

    if (updates.slug) {
      const cleanSlug = updates.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const duplicate = this.posts.find((p) => p.slug === cleanSlug && p.id !== currentPost.id);
      if (duplicate) {
        throw new Error(`An article with slug "${cleanSlug}" already exists.`);
      }
      cleanUpdates.slug = cleanSlug;
    }

    if (updates.content) {
      if (updates.content.length === 0 || updates.content.every((c) => !c.trim())) {
        throw new Error('Article content cannot be empty.');
      }
      cleanUpdates.content = updates.content
        .map((c) => this.sanitizeContent(c))
        .filter((c) => c.trim().length > 0);
    }

    if (updates.title) {
      cleanUpdates.title = this.sanitizeContent(updates.title.trim());
    }
    if (updates.excerpt) {
      cleanUpdates.excerpt = this.sanitizeContent(updates.excerpt.trim());
    }

    if (isConfigured && db) {
      const docRef = doc(db, BLOG_COLLECTION, docId);
      try {
        await withTimeout(updateDoc(docRef, cleanUpdates), 15000, 'Firestore blog post update');
      } catch (err: any) {
        // If document doesn't exist yet in Firestore, create it with setDoc
        if (err?.code === 'not-found' || err?.message?.includes('No document to update')) {
          await withTimeout(setDoc(docRef, { ...currentPost, ...cleanUpdates }), 15000, 'Firestore blog post set');
        } else {
          if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
            handleFirestoreError(err, OperationType.UPDATE, `${BLOG_COLLECTION}/${docId}`);
          }
          throw err;
        }
      }
    }

    this.posts[idx] = {
      ...this.posts[idx],
      ...cleanUpdates
    };
    this.saveLocalPosts(this.posts);
    this.invalidateCache();
    return true;
  }

  /**
   * Permanently deletes blog article from Firestore & local cache
   */
  public async deletePost(slugOrId: string): Promise<boolean> {
    verifyAdminAuthorization();
    this.loadLocalPosts();

    const target = this.posts.find((p) => p.slug === slugOrId || p.id === slugOrId);
    if (!target) return false;

    const docId = target.id || `post-${target.slug}`;

    if (isConfigured && db) {
      const docRef = doc(db, BLOG_COLLECTION, docId);
      try {
        await withTimeout(deleteDoc(docRef), 15000, 'Firestore blog post deletion');
      } catch (err: any) {
        if (err?.message?.includes('permission') || err?.code?.includes('permission')) {
          handleFirestoreError(err, OperationType.DELETE, `${BLOG_COLLECTION}/${docId}`);
        }
        console.warn('Firestore blog deletion notice:', err);
      }
    }

    this.posts = this.posts.filter((p) => p.slug !== slugOrId && p.id !== slugOrId);
    this.saveLocalPosts(this.posts);
    this.invalidateCache();
    return true;
  }

  /**
   * Uploads blog featured imagery to Firebase Storage or persistent Data URL
   */
  public async uploadBlogImage(file: File, assetName?: string): Promise<string> {
    verifyAdminAuthorization();
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and SVG images are allowed.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds the 5MB maximum limit.');
    }

    const safeName = (assetName || file.name || 'blog-image').replace(/[^a-zA-Z0-9._-]/g, '_');
    let finalUrl = '';

    if (isConfigured) {
      try {
        const storageInstance = await getStorageInstance();
        if (storageInstance) {
          const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
          const storageRef = ref(storageInstance, `template-assets/blog_${Date.now()}_${safeName}`);
          const snapshot = await withTimeout(
            uploadBytes(storageRef, file, { contentType: file.type }),
            12000,
            'Firebase Storage blog image upload'
          );
          finalUrl = await getDownloadURL(snapshot.ref);
        }
      } catch (err: any) {
        console.warn('Firebase Storage blog upload notice, falling back to persistent data URL:', err);
      }
    }

    if (!finalUrl) {
      finalUrl = await fileToDataUrl(file);
    }

    // Record upload metadata in uploads collection
    if (isConfigured && db) {
      const uploadId = `upl-${Date.now()}`;
      try {
        await withTimeout(
          setDoc(doc(db, 'uploads', uploadId), {
            fileName: safeName,
            url: finalUrl,
            mimeType: file.type,
            size: file.size,
            createdAt: new Date().toISOString()
          }),
          8000,
          'Firestore upload record'
        );
      } catch {
        // Non-fatal
      }
    }

    return finalUrl;
  }

  public getCategories(): string[] {
    const set = new Set<string>();
    this.posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }
}

export const blogService = new BlogService();
