import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogPost, BLOG_POSTS } from '../../data/blogData';
import { blogService, isAdminAuthorized } from '../../services/blogService';
import { useToast } from '../../context/ToastContext';
import DOMPurify from 'dompurify';
import { Button } from '../ui/Button';
import {
  ArrowLeft,
  Save,
  Eye,
  Columns,
  Edit3,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  User,
  Calendar,
  Globe,
  Share2,
  Copy,
  RotateCcw,
  Heading2,
  Heading3,
  Heading4,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Smartphone,
  Monitor,
  Check,
  Trash2,
  Tag,
  RefreshCw,
  Link as LinkIcon,
  Underline,
  Strikethrough,
  Table as TableIcon,
  Minus,
  Undo2,
  Redo2,
  Type,
  ListTree,
  ExternalLink,
  Bookmark,
  ShieldCheck,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  History,
  BookOpen,
  Layers,
  Link2,
  Code,
  ChevronDown
} from 'lucide-react';

import { InternalLinkModal } from './article-editor/InternalLinkModal';
import { ArticleStructureModal } from './article-editor/ArticleStructureModal';
import { VersionHistoryModal, ArticleVersionSnapshot } from './article-editor/VersionHistoryModal';
import { MediaManagerModal, ManagedImageItem } from './article-editor/MediaManagerModal';
import { ArticleQualityAssistant } from './article-editor/ArticleQualityAssistant';
import { PrePublishReviewModal } from './article-editor/PrePublishReviewModal';

const DRAFT_STORAGE_KEY = 'biodatacraft_article_editor_draft_v1';

// Existing & suggested categories without duplicates
const DEFAULT_CATEGORIES = [
  'Guides',
  'Culture & Tradition',
  'Biodata Tips',
  'Marriage Advice',
  'Tips & Etiquette',
  'Astrology & Kundali',
  'Family & Matrimony',
  'Regional Formats'
];

const AUTHOR_PRESETS = [
  'BiodataCraft Editorial Team',
  'Cultural Heritage Desk',
  'Astrology & Kundali Council',
  'Matrimonial Etiquette Advisor'
];

// Curated royalty-free Auspicious Indian Matrimonial presets from Unsplash
const AUSPICIOUS_IMAGE_PRESETS = [
  {
    title: 'Royal Mandap & Floral Heritage',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    category: 'Guides'
  },
  {
    title: 'Traditional Wedding Ceremony & Diyas',
    url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&q=80&w=1200',
    category: 'Culture & Tradition'
  },
  {
    title: 'Auspicious Kalash & Marigold Garlands',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
    category: 'Astrology & Kundali'
  },
  {
    title: 'Golden Indian Matrimonial Elegance',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    category: 'Tips & Etiquette'
  }
];

const MATRIMONIAL_KEYWORD_CHIPS = [
  'Gotra',
  'Kundali',
  'Mosal',
  'Manglik Dosha',
  'Shubh Muhurat',
  'Nakshatra',
  'Rashi',
  'Devak'
];

interface CreateArticleEditorProps {
  initialPost?: BlogPost | null;
  existingPosts: BlogPost[];
  onBack: () => void;
  onSaveSuccess: () => void;
}

export const CreateArticleEditor: React.FC<CreateArticleEditorProps> = ({
  initialPost,
  existingPosts,
  onBack,
  onSaveSuccess
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Editor View Modes: 'editor' | 'split' | 'preview'
  const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('editor');
  const [sidebarTab, setSidebarTab] = useState<'publish' | 'seo' | 'quality' | 'media' | 'social'>('publish');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Form State
  const [title, setTitle] = useState(initialPost?.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [isManuallyEditedSlug, setIsManuallyEditedSlug] = useState(Boolean(initialPost));
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [category, setCategory] = useState(
    initialPost?.category && DEFAULT_CATEGORIES.includes(initialPost.category)
      ? initialPost.category
      : initialPost?.category
      ? 'Custom'
      : 'Guides'
  );
  const [customCategory, setCustomCategory] = useState(
    initialPost?.category && !DEFAULT_CATEGORIES.includes(initialPost.category)
      ? initialPost.category
      : ''
  );
  const [author, setAuthor] = useState(initialPost?.author || 'BiodataCraft Editorial Team');
  const [readTime, setReadTime] = useState(initialPost?.readTime || '5 min read');
  const [isManualReadTime, setIsManualReadTime] = useState(Boolean(initialPost?.readTime));
  const [publishedDate, setPublishedDate] = useState(
    initialPost?.publishedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );
  const [featuredImage, setFeaturedImage] = useState(initialPost?.featuredImage || '');
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialPost?.featuredImageAlt || '');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [imageFileSize, setImageFileSize] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageLoadError, setImageLoadError] = useState(false);

  // Automatically extract image dimensions when featuredImage updates (Phase 6 & 18)
  useEffect(() => {
    if (!featuredImage) {
      setImageDimensions(null);
      setImageLoadError(false);
      return;
    }
    setImageLoadError(false);
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoadError(false);
    };
    img.onerror = () => {
      setImageDimensions(null);
      setImageLoadError(true);
    };
    img.src = featuredImage;
  }, [featuredImage]);
  const initialArticleBody = initialPost
    ? Array.isArray(initialPost.content)
      ? initialPost.content.join('\n\n')
      : String(initialPost.content || '')
    : '';

  const [contentBody, setContentBody] = useState(initialArticleBody);

  // Undo / Redo History Stack (Phase 8)
  const [history, setHistory] = useState<string[]>([initialArticleBody]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modals for Rich Content Insertion
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkType, setLinkType] = useState<'custom' | 'article' | 'template' | 'maker'>('custom');

  const [showImageModal, setShowImageModal] = useState(false);
  const [bodyImageUrl, setBodyImageUrl] = useState('');
  const [bodyImageAlt, setBodyImageAlt] = useState('');
  const [bodyImageCaption, setBodyImageCaption] = useState('');
  const [bodyImageInputMode, setBodyImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isUploadingBodyImage, setIsUploadingBodyImage] = useState(false);
  const bodyFileInputRef = useRef<HTMLInputElement>(null);

  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [tablePreset, setTablePreset] = useState<'kundali' | 'gotra' | 'blank'>('kundali');

  const [seoTitle, setSeoTitle] = useState(initialPost?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || '');
  const [canonicalUrlOverride, setCanonicalUrlOverride] = useState(initialPost?.canonicalUrl || '');
  const [showCustomCanonical, setShowCustomCanonical] = useState(Boolean(initialPost?.canonicalUrl));
  const [enableTableOfContents, setEnableTableOfContents] = useState<boolean>(initialPost?.enableTableOfContents ?? false);
  const [isPublished, setIsPublished] = useState(initialPost ? initialPost.isPublished !== false : true);
  const [focusKeyword, setFocusKeyword] = useState('');

  // Active saved draft / article tracking to prevent duplicate creation (Phase 12)
  const [activePostId, setActivePostId] = useState<string | null>(initialPost?.id || null);
  const [activePostSlug, setActivePostSlug] = useState<string | null>(initialPost?.slug || null);

  // Unsaved changes & modal states (Phases 11 & 12)
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Publish confirmation & success modals (Phase 13)
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState(false);
  const [publishedSuccessPost, setPublishedSuccessPost] = useState<{
    title: string;
    slug: string;
    url: string;
  } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Destructive action confirmation dialogs (Phase 16)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [showRemoveImageConfirm, setShowRemoveImageConfirm] = useState(false);

  // Execution states
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hasAutosaveDraft, setHasAutosaveDraft] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Advanced Features State (Sections 1-11)
  const [isFullWidthEditor, setIsFullWidthEditor] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showInternalLinkModal, setShowInternalLinkModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [showMediaManagerModal, setShowMediaManagerModal] = useState(false);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');

  // Active cursor & highlighted text tracking for modal insertions
  const [savedSelectionRange, setSavedSelectionRange] = useState<{
    start: number;
    end: number;
    selectedText: string;
  } | null>(null);
  const [internalLinkInitialQuery, setInternalLinkInitialQuery] = useState('');
  const [internalLinkInitialAnchor, setInternalLinkInitialAnchor] = useState('');

  // Media Library Session items (seeded with initial featured image & Auspicious presets)
  const [sessionMediaList, setSessionMediaList] = useState<ManagedImageItem[]>(() => {
    const list: ManagedImageItem[] = [];
    if (initialPost?.featuredImage) {
      list.push({
        id: 'initial-featured',
        url: initialPost.featuredImage,
        name: 'Featured Banner',
        alt: initialPost.featuredImageAlt || initialPost.title,
        uploadedAt: 'Active'
      });
    }
    AUSPICIOUS_IMAGE_PRESETS.forEach((p, idx) => {
      list.push({
        id: `preset-${idx}`,
        url: p.url,
        name: p.title,
        alt: p.title,
        uploadedAt: 'Preset',
        isPreset: true
      });
    });
    return list;
  });

  // Version Snapshots Stack
  const [versionSnapshots, setVersionSnapshots] = useState<ArticleVersionSnapshot[]>(() => [
    {
      id: `v-initial-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: initialPost ? 'Initial Loaded Article' : 'Initial Blank Draft',
      author: initialPost?.author || 'BiodataCraft Editorial Team',
      title: initialPost?.title || 'Untitled',
      excerpt: initialPost?.excerpt || '',
      content: initialArticleBody,
      wordCount: initialArticleBody.trim() ? initialArticleBody.trim().split(/\s+/).length : 0,
      charCount: initialArticleBody.length
    }
  ]);

  // Track unsaved changes for accident prevention (Phase 12)
  useEffect(() => {
    const hasModifications = Boolean(
      (title.trim() && title !== (initialPost?.title || '')) ||
      (contentBody.trim() && contentBody !== initialArticleBody) ||
      (excerpt.trim() && excerpt !== (initialPost?.excerpt || '')) ||
      (featuredImage && featuredImage !== (initialPost?.featuredImage || ''))
    );
    if (hasModifications) {
      setIsDirty(true);
    }
  }, [title, contentBody, excerpt, featuredImage, initialPost, initialArticleBody]);

  // Prevent accidental loss of unsaved content on browser tab close/reload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Keyboard Navigation: Escape key automatically closes any active modal dialog (Phase 16)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPreviewModal) setShowPreviewModal(false);
        else if (showPublishConfirmModal) setShowPublishConfirmModal(false);
        else if (showUnsavedConfirm) setShowUnsavedConfirm(false);
        else if (showDiscardConfirm) setShowDiscardConfirm(false);
        else if (showRemoveImageConfirm) setShowRemoveImageConfirm(false);
        else if (publishedSuccessPost) setPublishedSuccessPost(null);
        else if (showLinkModal) setShowLinkModal(false);
        else if (showImageModal) setShowImageModal(false);
        else if (showTableModal) setShowTableModal(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    showPreviewModal,
    showPublishConfirmModal,
    showUnsavedConfirm,
    showDiscardConfirm,
    showRemoveImageConfirm,
    publishedSuccessPost,
    showLinkModal,
    showImageModal,
    showTableModal
  ]);

  // Phase 9: Table of Contents Extractor & Slugifier
  const slugifyHeadingText = (text: string): string => {
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip markdown links
      .replace(/[*_~`]/g, '')                   // strip markdown formatting
      .replace(/<[^>]+>/g, '')                  // strip inline HTML
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  };

  interface TocHeadingItem {
    id: string;
    text: string;
    level: 2 | 3;
    children: TocHeadingItem[];
  }

  const { tocItems, flatHeadings, h2Count, h3Count } = React.useMemo(() => {
    const lines = contentBody.split('\n');
    const idCountMap = new Map<string, number>();
    const flat: Array<{ id: string; text: string; level: 2 | 3 }> = [];
    const tree: TocHeadingItem[] = [];
    let currentH2: TocHeadingItem | null = null;
    let count2 = 0;
    let count3 = 0;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      const isH2 = line.startsWith('## ') && !line.startsWith('### ');
      const isH3 = line.startsWith('### ') && !line.startsWith('#### ');

      if (isH2 || isH3) {
        const level: 2 | 3 = isH2 ? 2 : 3;
        const rawText = isH2 ? line.slice(3) : line.slice(4);
        const cleanText = rawText.replace(/[*_~`]/g, '').trim();
        if (!cleanText) continue;

        const baseSlug = slugifyHeadingText(cleanText);
        const seenCount = idCountMap.get(baseSlug) || 0;
        idCountMap.set(baseSlug, seenCount + 1);
        const uniqueId = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount}`;

        const item: TocHeadingItem = {
          id: uniqueId,
          text: cleanText,
          level,
          children: []
        };

        flat.push({ id: uniqueId, text: cleanText, level });

        if (level === 2) {
          count2++;
          tree.push(item);
          currentH2 = item;
        } else {
          count3++;
          if (currentH2) {
            currentH2.children.push(item);
          } else {
            tree.push(item);
          }
        }
      }
    }

    return {
      tocItems: tree,
      flatHeadings: flat,
      h2Count: count2,
      h3Count: count3
    };
  }, [contentBody]);

  // Helper to convert title into clean slug
  const generateSlugFromTitle = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove special characters
      .replace(/\s+/g, '-')     // convert spaces to hyphens
      .replace(/-+/g, '-')      // collapse multiple hyphens
      .replace(/^-+|-+$/g, ''); // trim hyphens
  };

  // Handle Title Change & Automatic Slug Generation
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (formErrors.title) {
      setFormErrors((prev) => ({ ...prev, title: '' }));
    }
    // Automatically generate slug from title unless user manually edited it
    if (!isManuallyEditedSlug && !initialPost) {
      setSlug(generateSlugFromTitle(newTitle));
      if (formErrors.slug) {
        setFormErrors((prev) => ({ ...prev, slug: '' }));
      }
    }
  };

  // Handle Manual Slug Editing
  const handleSlugChange = (newSlug: string) => {
    setIsManuallyEditedSlug(true);
    const sanitized = newSlug
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(sanitized);
    if (formErrors.slug) {
      setFormErrors((prev) => ({ ...prev, slug: '' }));
    }
  };

  // Manually Regenerate Slug from current Title
  const handleRegenerateSlug = () => {
    const generated = generateSlugFromTitle(title);
    setSlug(generated);
    setIsManuallyEditedSlug(false);
    if (formErrors.slug) {
      setFormErrors((prev) => ({ ...prev, slug: '' }));
    }
    toast.success('Slug regenerated from title.');
  };

  // Real-time metrics (memoized for performance - Phase 14 & 18)
  const wordCount = useMemo(() => {
    return contentBody.trim() ? contentBody.trim().split(/\s+/).length : 0;
  }, [contentBody]);

  const charCount = contentBody.length;

  const paragraphCount = useMemo(() => {
    return contentBody
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean).length;
  }, [contentBody]);

  // Configurable reading speed of approximately 200–220 words per minute (210 wpm)
  const autoMinutes = Math.max(1, Math.round(wordCount / 210));
  const autoComputedReadTime = `${autoMinutes} min read`;

  // Auto-update read time unless user manually overrides it
  useEffect(() => {
    if (!isManualReadTime) {
      setReadTime(autoComputedReadTime);
    }
  }, [autoComputedReadTime, isManualReadTime]);

  // Check for existing autosaved draft on mount (only for new articles)
  useEffect(() => {
    if (!initialPost) {
      try {
        const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.title && parsed.title.trim()) {
            setHasAutosaveDraft(true);
          }
        }
      } catch {
        // Ignore storage parsing issues
      }
    }
  }, [initialPost]);

  // Autosave to localStorage every 2.5 seconds if changed (Section 7)
  useEffect(() => {
    if (initialPost) return;
    if (isDirty && (title.trim() || contentBody.trim())) {
      setAutosaveStatus('saving');
    }
    const timer = setTimeout(() => {
      if (title.trim() || contentBody.trim()) {
        try {
          const draftPayload = {
            title,
            slug,
            excerpt,
            category,
            customCategory,
            author,
            readTime,
            isManualReadTime,
            featuredImage,
            featuredImageAlt,
            contentBody,
            seoTitle,
            seoDescription,
            canonicalUrlOverride,
            enableTableOfContents,
            isPublished,
            focusKeyword,
            savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
          setLastSavedTime(draftPayload.savedAt);
          setAutosaveStatus('saved');
        } catch {
          setAutosaveStatus('failed');
        }
      } else {
        setAutosaveStatus('idle');
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, [
    title,
    slug,
    excerpt,
    category,
    customCategory,
    author,
    readTime,
    isManualReadTime,
    featuredImage,
    featuredImageAlt,
    contentBody,
    seoTitle,
    seoDescription,
    canonicalUrlOverride,
    enableTableOfContents,
    isPublished,
    focusKeyword,
    initialPost,
    isDirty
  ]);

  // Prevent accidental loss of unsaved content via beforeunload listener (Section 7)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleRestoreDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.slug) {
          setSlug(parsed.slug);
          setIsManuallyEditedSlug(true);
        }
        if (parsed.excerpt) setExcerpt(parsed.excerpt);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.customCategory) setCustomCategory(parsed.customCategory);
        if (parsed.author) setAuthor(parsed.author);
        if (parsed.readTime) setReadTime(parsed.readTime);
        if (typeof parsed.isManualReadTime === 'boolean') setIsManualReadTime(parsed.isManualReadTime);
        if (parsed.featuredImage) setFeaturedImage(parsed.featuredImage);
        if (parsed.featuredImageAlt) setFeaturedImageAlt(parsed.featuredImageAlt);
        if (parsed.contentBody) setContentBody(parsed.contentBody);
        if (parsed.seoTitle) setSeoTitle(parsed.seoTitle);
        if (parsed.seoDescription) setSeoDescription(parsed.seoDescription);
        if (parsed.canonicalUrlOverride) {
          setCanonicalUrlOverride(parsed.canonicalUrlOverride);
          setShowCustomCanonical(true);
        }
        if (typeof parsed.enableTableOfContents === 'boolean') {
          setEnableTableOfContents(parsed.enableTableOfContents);
        }
        if (typeof parsed.isPublished === 'boolean') setIsPublished(parsed.isPublished);
        if (parsed.focusKeyword) setFocusKeyword(parsed.focusKeyword);
        setHasAutosaveDraft(false);
        toast.success('Autosaved draft restored successfully!');
      }
    } catch {
      toast.error('Failed to restore draft.');
    }
  };

  const handlePromptDiscardDraft = () => {
    setShowDiscardConfirm(true);
  };

  const handleConfirmDiscardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasAutosaveDraft(false);
      setLastSavedTime(null);
      setIsDirty(false);
      setShowDiscardConfirm(false);
      toast.info('Autosaved draft discarded.');
    } catch {
      // Ignore
    }
  };

  // Handle breadcrumb / back navigation with unsaved changes prompt (Phase 12)
  const handleBackClick = () => {
    if (isDirty) {
      setShowUnsavedConfirm(true);
    } else {
      onBack();
    }
  };

  // HTML Sanitization for Security (Phase 8 & 18: DOMPurify Defense-in-Depth)
  const sanitizeArticleHtml = (rawText: string): string => {
    if (!rawText) return '';
    return DOMPurify.sanitize(rawText, {
      ALLOWED_TAGS: [
        'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'u', 's', 'strong', 'em', 'strike',
        'ul', 'ol', 'li', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tr',
        'th', 'td', 'a', 'img', 'figure', 'figcaption', 'code', 'pre', 'span', 'br', 'div'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'width', 'height', 'loading', 'decoding'
      ],
      ALLOW_DATA_ATTR: false
    });
  };

  // Push into Undo/Redo history stack
  const recordHistory = (newVal: string) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      if (trimmed[trimmed.length - 1] === newVal) return prev;
      const next = [...trimmed, newVal];
      if (next.length > 50) next.shift();
      return next;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setContentBody(history[nextIndex]);
      toast.info('Undo action performed.');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setContentBody(history[nextIndex]);
      toast.info('Redo action performed.');
    }
  };

  // Text insertion helper with history recording
  const insertFormatting = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = contentBody.substring(start, end);
    const textToInsert = selected || defaultPlaceholder;
    const replacement = `${prefix}${textToInsert}${suffix}`;

    const newContent =
      contentBody.substring(0, start) + replacement + contentBody.substring(end);
    setContentBody(newContent);
    recordHistory(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + prefix.length + textToInsert.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Section 1: Heading Dropdown selector handler
  const applyHeading = (level: 2 | 3 | 4 | 'p') => {
    if (level === 'p') {
      insertFormatting('', '', 'Paragraph text');
    } else if (level === 2) {
      insertFormatting('\n\n## ', '\n\n', 'Section Title');
    } else if (level === 3) {
      insertFormatting('\n\n### ', '\n\n', 'Subsection Title');
    } else if (level === 4) {
      insertFormatting('\n\n#### ', '\n\n', 'Minor Heading');
    }
    setShowHeadingMenu(false);
  };

  // Section 1: Text alignment styling helper
  const applyAlignment = (align: 'left' | 'center' | 'right') => {
    if (align === 'center') {
      insertFormatting('<div class="text-center">\n\n', '\n\n</div>', 'Centered text or matrimonial note');
    } else if (align === 'right') {
      insertFormatting('<div class="text-right">\n\n', '\n\n</div>', 'Right aligned content');
    } else {
      insertFormatting('<div class="text-left">\n\n', '\n\n</div>', 'Left aligned content');
    }
  };

  // Dedicated Markdown link insertion helper that handles cursor restoration and saved range
  const insertMarkdownLink = (
    anchorText: string,
    url: string,
    targetRange?: { start: number; end: number; selectedText?: string } | null
  ) => {
    const textarea = textareaRef.current;
    const finalUrl = url.trim();
    const finalAnchor = anchorText.trim() || finalUrl;

    if (!finalUrl) {
      toast.error('Destination URL cannot be empty.');
      return;
    }

    const markdownSnippet = `[${finalAnchor}](${finalUrl})`;

    // Determine target range: saved range, or active textarea selection, or end of body
    let start = contentBody.length;
    let end = contentBody.length;

    if (targetRange && typeof targetRange.start === 'number' && typeof targetRange.end === 'number') {
      start = Math.max(0, Math.min(targetRange.start, contentBody.length));
      end = Math.max(start, Math.min(targetRange.end, contentBody.length));
    } else if (textarea) {
      start = textarea.selectionStart ?? contentBody.length;
      end = textarea.selectionEnd ?? contentBody.length;
    }

    const newContent =
      contentBody.substring(0, start) + markdownSnippet + contentBody.substring(end);

    setContentBody(newContent);
    recordHistory(newContent);
    setIsDirty(true);
    setSavedSelectionRange(null);

    // Refocus and position cursor immediately after inserted link
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = start + markdownSnippet.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 50);

    toast.success(`Inserted link: "${finalAnchor}"`);
  };

  // Section 3: Internal link insertion handler
  const handleOpenInternalLinkModal = (prefillQuery?: string, prefillAnchor?: string) => {
    const textarea = textareaRef.current;
    let start = 0;
    let end = 0;
    let selected = '';
    if (textarea) {
      start = textarea.selectionStart;
      end = textarea.selectionEnd;
      selected = contentBody.substring(start, end);
    }
    setSavedSelectionRange({ start, end, selectedText: selected });

    const query = prefillQuery !== undefined ? prefillQuery : selected;
    const anchor = prefillAnchor !== undefined ? prefillAnchor : selected;

    setInternalLinkInitialQuery(query);
    setInternalLinkInitialAnchor(anchor);
    setShowInternalLinkModal(true);
  };

  const handleInsertInternalLink = (anchorText: string, url: string) => {
    insertMarkdownLink(anchorText, url, savedSelectionRange);
    setShowInternalLinkModal(false);
  };

  // One-click linking opportunity applicator from ArticleQualityAssistant
  const handleApplyLinkingOpportunity = (keyword: string, route: string, pageName: string) => {
    const cleanKw = keyword.toLowerCase().split('/')[0].trim();
    const lowerBody = contentBody.toLowerCase();
    const kwIdx = lowerBody.indexOf(cleanKw);

    if (kwIdx !== -1) {
      const before = contentBody.substring(0, kwIdx);
      const after = contentBody.substring(kwIdx + cleanKw.length);
      const matchedText = contentBody.substring(kwIdx, kwIdx + cleanKw.length);
      const linkedSnippet = `[${matchedText}](${route})`;
      const newContent = `${before}${linkedSnippet}${after}`;

      setContentBody(newContent);
      recordHistory(newContent);
      setIsDirty(true);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursorPos = kwIdx + linkedSnippet.length;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 50);

      toast.success(`Linked "${matchedText}" to ${pageName} (${route})`);
    } else {
      insertMarkdownLink(pageName, route, savedSelectionRange);
    }
  };

  // Section 4: Educational structure insertion handler (preserves existing text)
  const handleInsertStructure = (markdownSnippet: string, mode: 'cursor' | 'append') => {
    const textarea = textareaRef.current;
    if (mode === 'cursor' && textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        contentBody.substring(0, start) + '\n\n' + markdownSnippet + '\n\n' + contentBody.substring(end);
      setContentBody(newContent);
      recordHistory(newContent);
    } else {
      const newContent = contentBody.trim() ? `${contentBody}\n\n${markdownSnippet}` : markdownSnippet;
      setContentBody(newContent);
      recordHistory(newContent);
    }
    toast.success('Structure blueprint inserted into article canvas.');
  };

  // Section 2: Session media library management
  const handleAddMediaItem = (item: ManagedImageItem) => {
    setSessionMediaList((prev) => [item, ...prev]);
  };

  const handleRemoveMediaItem = (id: string) => {
    setSessionMediaList((prev) => prev.filter((img) => img.id !== id));
  };

  const handleInsertInlineFromMedia = (url: string, alt: string, caption?: string) => {
    const snippet = caption
      ? `\n\n![${alt}](${url} "${caption}")\n\n`
      : `\n\n![${alt}](${url})\n\n`;
    insertFormatting(snippet, '', '');
  };

  // Section 8: Article version snapshots
  const createVersionSnapshot = (customLabel?: string) => {
    const now = new Date();
    const snapWords = contentBody.trim() ? contentBody.trim().split(/\s+/).length : 0;
    const newSnapshot: ArticleVersionSnapshot = {
      id: `v-${Date.now()}`,
      timestamp: now.toISOString(),
      dateFormatted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      label: customLabel || `Milestone #${versionSnapshots.length + 1} (${snapWords} words)`,
      author: author.trim() || 'BiodataCraft Editorial Team',
      title: title.trim() || 'Untitled Article',
      excerpt: excerpt.trim(),
      content: contentBody,
      wordCount: snapWords,
      charCount: contentBody.length
    };
    setVersionSnapshots((prev) => [newSnapshot, ...prev]);
    toast.success('Version milestone snapshot captured.');
  };

  const handleRestoreVersionSnapshot = (snapshot: ArticleVersionSnapshot) => {
    createVersionSnapshot(`Auto-backup before restore (${title || 'Untitled'})`);
    setTitle(snapshot.title);
    setExcerpt(snapshot.excerpt);
    setContentBody(snapshot.content);
    recordHistory(snapshot.content);
    toast.success(`Restored version: "${snapshot.label}"`);
  };

  // Link Insertion Handlers (Phase 8 & Fix)
  const handleOpenLinkModal = () => {
    const textarea = textareaRef.current;
    let start = 0;
    let end = 0;
    let selected = '';
    if (textarea) {
      start = textarea.selectionStart;
      end = textarea.selectionEnd;
      selected = contentBody.substring(start, end);
    }
    setSavedSelectionRange({ start, end, selectedText: selected });
    setLinkText(selected || '');
    setLinkUrl('');
    setLinkType('custom');
    setShowLinkModal(true);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) {
      toast.error('Please enter or select a valid destination URL.');
      return;
    }
    const label = linkText.trim() || linkUrl.trim();
    insertMarkdownLink(label, linkUrl.trim(), savedSelectionRange);
    setShowLinkModal(false);
  };

  // Image Insertion Handlers (Phase 8)
  const handleOpenImageModal = () => {
    setBodyImageUrl('');
    setBodyImageAlt('');
    setBodyImageCaption('');
    setBodyImageInputMode('upload');
    setShowImageModal(true);
  };

  const handleUploadBodyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdminAuthorized()) {
      toast.error('Unauthorized: Administrator clearance required to upload images.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const validExts = /\.(jpe?g|png|webp)$/i;
    if (!validMimes.includes(file.type.toLowerCase()) && !validExts.test(file.name.toLowerCase())) {
      toast.error('Invalid image format. Supported formats: JPG, JPEG, PNG, WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file exceeds the allowed 5MB size limit.');
      return;
    }

    setIsUploadingBodyImage(true);
    try {
      const url = await blogService.uploadBlogImage(file);
      setBodyImageUrl(url);
      if (!bodyImageAlt) {
        setBodyImageAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      toast.success('Image uploaded successfully.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload image.');
    } finally {
      setIsUploadingBodyImage(false);
    }
  };

  const handleInsertBodyImage = () => {
    if (!bodyImageUrl.trim()) {
      toast.error('Please upload an image or provide an image URL.');
      return;
    }
    const alt = bodyImageAlt.trim() || 'BiodataCraft Matrimonial Illustration';
    const caption = bodyImageCaption.trim();
    const md = `\n\n![${alt}](${bodyImageUrl.trim()}${caption ? ` "${caption}"` : ''})\n\n`;
    insertFormatting(md, '');
    setShowImageModal(false);
    toast.success('Image inserted into article body.');
  };

  // Table Insertion Handlers (Phase 8)
  const handleOpenTableModal = () => {
    setTablePreset('kundali');
    setTableRows(3);
    setTableCols(3);
    setShowTableModal(true);
  };

  const handleInsertTable = () => {
    let tableMarkdown = '';
    if (tablePreset === 'kundali') {
      tableMarkdown = `\n\n| Astrological Factor (Koota) | Max Gunas | Significance in Marriage Matching |\n| :--- | :---: | :--- |\n| Varna | 1 | Spiritual ego & mutual mental harmony |\n| Vashya | 2 | Mutual attraction & power balance |\n| Tara | 3 | Longevity & health alignment of couple |\n| Yoni | 4 | Physical & biological compatibility |\n| Graha Maitri | 5 | Psychological friendship & family cordiality |\n| Gana | 6 | Temperament & behavioral balance |\n| Bhakoot | 7 | Family welfare & financial prosperity |\n| Nadi | 8 | Genetic health & lineage continuation (Dosha check) |\n\n`;
    } else if (tablePreset === 'gotra') {
      tableMarkdown = `\n\n| Lineage / Gotra Category | Ancestral Relationship | Matrimonial Custom / Rule |\n| :--- | :--- | :--- |\n| Self / Father's Gotra | Paternal Lineage | Strictly prohibited to avoid consanguinity |\n| Mother's Gotra (Mosal) | Maternal Lineage | Avoided in North & West Indian traditions |\n| Grandmother's Gotra | Maternal Paternal Lineage | Observed in traditional orthodox matching |\n\n`;
    } else {
      const rows = Math.max(1, Math.min(10, tableRows));
      const cols = Math.max(1, Math.min(6, tableCols));
      const headers = Array.from({ length: cols }, (_, i) => `Column ${i + 1}`).join(' | ');
      const separators = Array.from({ length: cols }, () => '---').join(' | ');
      const dataRows = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => `Data ${r + 1}-${c + 1}`).join(' | ')
      ).map((r) => `| ${r} |`).join('\n');
      tableMarkdown = `\n\n| ${headers} |\n| ${separators} |\n${dataRows}\n\n`;
    }

    insertFormatting(tableMarkdown, '');
    setShowTableModal(false);
    toast.success('Table inserted into article.');
  };

  // Keyboard Shortcuts Handler (Phase 8)
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        insertFormatting('**', '**', 'bold text');
      } else if (key === 'i') {
        e.preventDefault();
        insertFormatting('*', '*', 'italic text');
      } else if (key === 'u') {
        e.preventDefault();
        insertFormatting('<u>', '</u>', 'underlined text');
      } else if (key === 'k') {
        e.preventDefault();
        handleOpenLinkModal();
      } else if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    }
  };

  // Insert BiodataCraft CTA Widget
  const insertCtaBlock = () => {
    const ctaMarkdown = `\n\n> **Ready to create your marriage biodata?** Use BiodataCraft to design publication-grade Hindu, Marathi, Jain, and Muslim matrimonial biodatas with authentic Vedic borders and zero customer data storage.\n\n`;
    insertFormatting(ctaMarkdown, '');
    toast.success('BiodataCraft conversion callout inserted.');
  };

  // Auto-generate excerpt from first paragraph
  const handleAutoExcerpt = () => {
    const paragraphs = contentBody
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p && !p.startsWith('#') && !p.startsWith('>'));
    if (paragraphs.length > 0) {
      const cleanFirst = paragraphs[0].replace(/[*_#`[\]]/g, '');
      const trimmed = cleanFirst.length > 160 ? `${cleanFirst.slice(0, 157)}...` : cleanFirst;
      setExcerpt(trimmed);
      if (!seoDescription) {
        setSeoDescription(trimmed);
      }
      toast.success('Excerpt generated from the first paragraph.');
    } else {
      toast.error('Write at least one paragraph in the article body first.');
    }
  };

  // Supported image formats for Phase 6
  const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
  const ALLOWED_IMAGE_EXTS = /\.(jpe?g|png|webp)$/i;
  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit

  // Process and upload image file using existing blogService
  const processImageFile = async (file: File) => {
    if (!isAdminAuthorized()) {
      toast.error('Unauthorized: Administrator clearance required to upload images.');
      return;
    }
    const isMimeValid = ALLOWED_IMAGE_MIMES.includes(file.type.toLowerCase());
    const isExtValid = ALLOWED_IMAGE_EXTS.test(file.name.toLowerCase());

    if (!isMimeValid && !isExtValid) {
      toast.error('Invalid image format. Supported formats: JPG, JPEG, PNG, WebP.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('Image file exceeds the allowed 5MB size limit.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await blogService.uploadBlogImage(file);
      setFeaturedImage(url);
      setImageFileName(file.name);
      const sizeStr =
        file.size < 1024 * 1024
          ? `${Math.round(file.size / 1024)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      setImageFileSize(sizeStr);
      if (formErrors.featuredImage) {
        setFormErrors((prev) => ({ ...prev, featuredImage: '' }));
      }
      toast.success('Featured image uploaded successfully.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Click to browse files
  const handleTriggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Destructive action: Open confirmation before removing featured image (Phase 16)
  const handlePromptRemoveFeaturedImage = () => {
    setShowRemoveImageConfirm(true);
  };

  const handleConfirmRemoveFeaturedImage = () => {
    setFeaturedImage('');
    setFeaturedImageAlt('');
    setImageDimensions(null);
    setImageFileSize(null);
    setImageFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowRemoveImageConfirm(false);
    toast.info('Featured image removed.');
  };

  // Phase 13 & 15: Pre-publish validation with exact human-friendly error messages
  const validatePublishFields = (): { valid: boolean; errors: Record<string, string>; cleanSlug: string } => {
    const errors: Record<string, string> = {};
    const trimmedTitle = title.trim();

    // 1. Article title validation
    if (!trimmedTitle) {
      errors.title = 'Article title is required.';
    }

    // 2. Slug validation
    let cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '');
    if (!cleanSlug) {
      if (trimmedTitle) {
        cleanSlug = generateSlugFromTitle(trimmedTitle);
      }
    }
    if (!cleanSlug) {
      errors.slug = 'Slug is required.';
    } else if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens.';
    } else {
      const currentDocId = activePostId || initialPost?.id;
      const currentDocSlug = activePostSlug || initialPost?.slug;
      const duplicate = existingPosts.find(
        (p) =>
          p.slug === cleanSlug &&
          (!currentDocId || p.id !== currentDocId) &&
          (!currentDocSlug || p.slug !== currentDocSlug)
      );
      if (duplicate) {
        errors.slug = `Slug "${cleanSlug}" is already in use by article "${duplicate.title}". Please choose a unique slug.`;
      }
    }

    // 3. Article body validation
    if (!contentBody.trim()) {
      errors.content = 'Article content cannot be empty.';
    }

    // 4. Excerpt validation
    if (!excerpt.trim()) {
      errors.excerpt = 'Article excerpt (catalog summary) is required.';
    }

    // 5. Featured image validation (if provided)
    if (featuredImage.trim()) {
      const isHttp = /^https?:\/\/.+/i.test(featuredImage.trim());
      const isDataImg = /^data:image\/(jpeg|png|webp|svg\+xml);base64,/i.test(featuredImage.trim());
      const isPath = /^\/[a-zA-Z0-9_\-\.\/]+$/i.test(featuredImage.trim());
      if (!isHttp && !isDataImg && !isPath) {
        errors.featuredImage = 'Invalid image format. Supported formats: JPG, JPEG, PNG, WebP.';
      }
      if (/javascript:/i.test(featuredImage) || /<script/i.test(featuredImage)) {
        errors.featuredImage = 'Invalid image format. Supported formats: JPG, JPEG, PNG, WebP.';
      }
    }

    // 6. SEO title length validation (Phase 15: SEO title is too long.)
    if (seoTitle.trim() && seoTitle.trim().length > 60) {
      errors.seoTitle = 'SEO title is too long (recommended max 60 characters).';
    }

    // 7. SEO meta description length validation (Phase 15: Meta description is too long.)
    if (seoDescription.trim() && seoDescription.trim().length > 160) {
      errors.seoDescription = 'Meta description is too long (recommended max 160 characters).';
    }

    // 8. Canonical URL validation (if provided)
    if (canonicalUrlOverride.trim()) {
      const isHttp = /^https?:\/\/.+/i.test(canonicalUrlOverride.trim());
      if (!isHttp) {
        errors.canonicalUrl = 'Canonical URL must be a valid URL starting with http:// or https://';
      }
    }

    return { valid: Object.keys(errors).length === 0, errors, cleanSlug };
  };

  // Phase 13 & 18: Initiate Publish (Admin Protected, Validates first, then opens Confirmation Step)
  const handleInitiatePublish = () => {
    if (!isAdminAuthorized()) {
      toast.error('Unauthorized: Administrator clearance required to publish articles.');
      return;
    }
    const { valid, errors, cleanSlug } = validatePublishFields();
    if (!valid) {
      setFormErrors(errors);
      const priorityOrder = ['title', 'slug', 'content', 'excerpt', 'featuredImage', 'seoTitle', 'seoDescription', 'canonicalUrl'];
      const firstErrorKey = priorityOrder.find((k) => errors[k]) || Object.keys(errors)[0];
      toast.error(errors[firstErrorKey]);
      return;
    }
    setFormErrors({});
    if (cleanSlug && cleanSlug !== slug) {
      setSlug(cleanSlug);
    }
    setShowPublishConfirmModal(true);
  };

  // Phase 13: Confirm and execute publishing after backend confirmation
  const executePublish = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const trimmedTitle = title.trim();
    let cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '');
    if (!cleanSlug) {
      cleanSlug = generateSlugFromTitle(trimmedTitle);
    }

    try {
      const cleanBody = sanitizeArticleHtml(contentBody);
      const paragraphs = cleanBody
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const finalExcerpt = excerpt.trim();
      const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category;

      const postPayload: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
        title: trimmedTitle,
        slug: cleanSlug,
        excerpt: finalExcerpt,
        category: finalCategory,
        author: author.trim() || 'BiodataCraft Editorial Team',
        readTime: readTime.trim() || autoComputedReadTime,
        publishedDate: publishedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        featuredImage: featuredImage.trim(),
        featuredImageAlt: featuredImageAlt.trim(),
        content: paragraphs.length > 0 ? paragraphs : [cleanBody || 'Draft in progress...'],
        seoTitle: seoTitle.trim() || `${trimmedTitle} | BiodataCraft Guides`,
        seoDescription: seoDescription.trim() || finalExcerpt.slice(0, 160),
        canonicalUrl: canonicalUrlOverride.trim() ? canonicalUrlOverride.trim() : undefined,
        enableTableOfContents: enableTableOfContents,
        isPublished: true
      };

      const targetSlug = activePostSlug || initialPost?.slug;

      if (targetSlug) {
        await blogService.updatePost(targetSlug, postPayload);
        setActivePostSlug(cleanSlug);
      } else {
        const created = await blogService.createPost(postPayload);
        setActivePostId(created.id || null);
        setActivePostSlug(created.slug);
        if (created.featuredImage && created.featuredImage !== featuredImage) {
          setFeaturedImage(created.featuredImage);
        }
      }

      // ONLY AFTER backend confirms publishing succeeded:
      setIsPublished(true);
      setIsDirty(false);
      const savedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(savedTime);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setShowPublishConfirmModal(false);

      const publicArticleUrl = `${window.location.origin}/blog/${cleanSlug}`;
      setPublishedSuccessPost({
        title: trimmedTitle,
        slug: cleanSlug,
        url: publicArticleUrl
      });
    } catch (err: any) {
      // Never show success if backend fails!
      console.error('Failed to publish article:', err);
      toast.error(err?.message || 'Failed to publish article.');
    } finally {
      setIsSaving(false);
    }
  };

  // Phase 12, 15 & 18: Save Draft without publishing (Admin Protected)
  const handleSaveDraft = async () => {
    if (!isAdminAuthorized()) {
      toast.error('Unauthorized: Administrator clearance required to save draft articles.');
      return;
    }
    if (isSaving) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormErrors((prev) => ({ ...prev, title: 'Article title is required.' }));
      toast.error('Article title is required.');
      return;
    }

    let cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '');
    if (!cleanSlug) {
      cleanSlug = generateSlugFromTitle(trimmedTitle) || `draft-${Date.now()}`;
      setSlug(cleanSlug);
    }

    setIsSaving(true);
    setFormErrors({});

    try {
      const cleanBody = sanitizeArticleHtml(contentBody);
      const paragraphs = cleanBody
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const finalExcerpt = excerpt.trim();
      const finalCategory = category === 'Custom' ? customCategory.trim() || 'General' : category;

      const postPayload: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
        title: trimmedTitle,
        slug: cleanSlug,
        excerpt: finalExcerpt,
        category: finalCategory,
        author: author.trim() || 'BiodataCraft Editorial Team',
        readTime: readTime.trim() || autoComputedReadTime,
        publishedDate: publishedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        featuredImage: featuredImage.trim(),
        featuredImageAlt: featuredImageAlt.trim(),
        content: paragraphs.length > 0 ? paragraphs : [cleanBody || 'Draft in progress...'],
        seoTitle: seoTitle.trim() || `${trimmedTitle} | BiodataCraft Guides`,
        seoDescription: seoDescription.trim() || (finalExcerpt ? finalExcerpt.slice(0, 160) : ''),
        canonicalUrl: canonicalUrlOverride.trim() ? canonicalUrlOverride.trim() : undefined,
        enableTableOfContents: enableTableOfContents,
        isPublished: false
      };

      const targetSlug = activePostSlug || initialPost?.slug;

      if (targetSlug) {
        await blogService.updatePost(targetSlug, postPayload);
        setActivePostSlug(cleanSlug);
      } else {
        const created = await blogService.createPost(postPayload);
        setActivePostId(created.id || null);
        setActivePostSlug(created.slug);
        if (created.featuredImage && created.featuredImage !== featuredImage) {
          setFeaturedImage(created.featuredImage);
        }
      }

      setIsPublished(false);
      setIsDirty(false);
      const savedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(savedTime);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      toast.success(`Draft "${trimmedTitle}" saved successfully!`);
    } catch (err: any) {
      console.error('Failed to save article draft:', err);
      toast.error(err?.message || 'Failed to save article.');
    } finally {
      setIsSaving(false);
    }
  };

  // Compatibility wrapper for callers of handleSave
  const handleSave = async (forcePublishState?: boolean) => {
    if (forcePublishState === true) {
      handleInitiatePublish();
    } else {
      await handleSaveDraft();
    }
  };

  // SEO Checklist Analysis (memoized for performance - Phase 10 & 18)
  const seoChecklist = useMemo(() => ({
    titleLength: seoTitle.length >= 45 && seoTitle.length <= 65,
    descLength: seoDescription.length >= 120 && seoDescription.length <= 165,
    keywordInTitle: focusKeyword ? title.toLowerCase().includes(focusKeyword.toLowerCase()) : false,
    keywordInSlug: focusKeyword ? slug.toLowerCase().includes(focusKeyword.toLowerCase().replace(/\s+/g, '-')) : false,
    keywordInDesc: focusKeyword ? seoDescription.toLowerCase().includes(focusKeyword.toLowerCase()) : false,
    wordCountPass: wordCount >= 300,
    hasFeaturedImage: Boolean(featuredImage.trim())
  }), [seoTitle, seoDescription, focusKeyword, title, slug, wordCount, featuredImage]);

  // Preview Renderer for Article Content (Memoized for high performance - Phase 18)
  const renderedArticlePreview = useMemo(() => {
    const cleanContent = sanitizeArticleHtml(contentBody);
    const paragraphs = cleanContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) {
      return (
        <div className="py-20 text-center text-stone-400">
          <Edit3 className="w-8 h-8 mx-auto mb-2 opacity-30 text-stone-400" />
          <p className="text-sm font-medium text-stone-600">The article canvas is currently empty.</p>
          <p className="text-xs mt-1 text-stone-400">Write paragraphs, insert tables, and craft rich guides to see your reader view.</p>
        </div>
      );
    }

    const previewIdCountMap = new Map<string, number>();

    const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const renderFormattedText = (text: string): React.ReactNode => {
      if (!text) return null;

      // Handle hyperlinks [label](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      const parseInlineStyles = (subText: string, keyPrefix: string): React.ReactNode[] => {
        const pattern = /(\*\*[^*]+\*\*|<u>[^<]+<\/u>|~~[^~]+~~|<s>[^<]+<\/s>|\*[^*]+\*|`[^`]+`)/g;
        const subParts = subText.split(pattern);
        return subParts.map((subPart, i) => {
          const subKey = `${keyPrefix}-${i}`;
          if (subPart.startsWith('**') && subPart.endsWith('**')) {
            return <strong key={subKey} className="font-bold text-stone-900">{subPart.slice(2, -2)}</strong>;
          }
          if (subPart.startsWith('<u>') && subPart.endsWith('</u>')) {
            return <u key={subKey} className="underline decoration-amber-800/60 underline-offset-2">{subPart.slice(3, -4)}</u>;
          }
          if ((subPart.startsWith('~~') && subPart.endsWith('~~')) || (subPart.startsWith('<s>') && subPart.endsWith('</s>'))) {
            const rawInner = subPart.startsWith('~~') ? subPart.slice(2, -2) : subPart.slice(3, -4);
            return <s key={subKey} className="line-through text-stone-400">{rawInner}</s>;
          }
          if (subPart.startsWith('*') && subPart.endsWith('*')) {
            return <em key={subKey} className="italic text-stone-800">{subPart.slice(1, -1)}</em>;
          }
          if (subPart.startsWith('`') && subPart.endsWith('`')) {
            return <code key={subKey} className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono text-[11px]">{subPart.slice(1, -1)}</code>;
          }
          return subPart;
        });
      };

      while ((match = linkRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(...parseInlineStyles(text.substring(lastIndex, match.index), `txt-${match.index}`));
        }
        const linkLabel = match[1];
        const linkHref = match[2];
        const isInternal = linkHref.startsWith('/') || linkHref.includes('biodata-craft');
        parts.push(
          <a
            key={`link-${match.index}`}
            href={linkHref}
            target={isInternal ? '_self' : '_blank'}
            rel={isInternal ? undefined : 'noopener noreferrer'}
            className="text-amber-800 font-semibold underline decoration-amber-800/40 hover:text-amber-950 transition-colors cursor-pointer"
          >
            {linkLabel}
          </a>
        );
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push(...parseInlineStyles(text.substring(lastIndex), `tail-${lastIndex}`));
      }

      return parts;
    };

    const renderedParagraphs = paragraphs.map((paragraph, idx) => {
      // Horizontal Rule / Divider
      if (/^---+|\*\*\*+$/.test(paragraph.trim())) {
        return <hr key={idx} className="my-8 border-t border-stone-200/80" />;
      }

      // Inline Image ![alt](url "caption") or ![alt](url)
      const imgMatch = paragraph.trim().match(/^!\[([^\]]*)\]\(([^"\s)]+)(?:\s+"([^"]*)")?\)$/);
      if (imgMatch) {
        const alt = imgMatch[1];
        const src = imgMatch[2];
        const caption = imgMatch[3];
        return (
          <figure key={idx} className="my-6 rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-50 shadow-2xs">
            <div className="max-h-[440px] overflow-hidden flex items-center justify-center bg-stone-100">
              <img
                src={src}
                alt={alt || 'Article visual'}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover max-h-[440px]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            {(caption || alt) && (
              <figcaption className="p-2.5 text-center text-xs text-stone-500 italic bg-stone-50 border-t border-stone-200/60 font-serif">
                {caption || alt}
              </figcaption>
            )}
          </figure>
        );
      }

      // Markdown Table
      if (paragraph.trim().startsWith('|') && paragraph.includes('|')) {
        const rows = paragraph
          .trim()
          .split('\n')
          .map((r) => r.trim())
          .filter((r) => r.startsWith('|'));
        if (rows.length >= 2) {
          const parseRow = (rowStr: string) =>
            rowStr
              .slice(1, rowStr.endsWith('|') ? -1 : undefined)
              .split('|')
              .map((c) => c.trim());
          const headerCols = parseRow(rows[0]);
          const isSep = /^\|[\s-:]+\|/.test(rows[1]);
          const bodyRows = rows.slice(isSep ? 2 : 1).map(parseRow);

          return (
            <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-stone-200/90 shadow-2xs bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-50/80 border-b border-stone-200 text-amber-950 font-bold uppercase tracking-wider text-[11px]">
                    {headerCols.map((h, hIdx) => (
                      <th key={hIdx} className="p-3">
                        {renderFormattedText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {bodyRows.map((r, rIdx) => (
                    <tr key={rIdx} className="hover:bg-stone-50/60 transition-colors">
                      {r.map((c, cIdx) => (
                        <td key={cIdx} className="p-3 leading-relaxed">
                          {renderFormattedText(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Headings: H2, H3, H4 with unique anchor IDs
      if (paragraph.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm sm:text-base font-bold font-cinzel text-amber-950 mt-5 mb-2">
            {renderFormattedText(paragraph.slice(5))}
          </h4>
        );
      }
      if (paragraph.startsWith('### ')) {
        const rawText = paragraph.slice(4);
        const cleanText = rawText.replace(/[*_~`]/g, '').trim();
        const baseSlug = slugifyHeadingText(cleanText);
        const seenCount = previewIdCountMap.get(baseSlug) || 0;
        previewIdCountMap.set(baseSlug, seenCount + 1);
        const headingId = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount}`;
        return (
          <h3 id={headingId} key={idx} className="scroll-mt-8 text-base sm:text-lg font-bold font-cinzel text-amber-950 mt-6 mb-2 flex items-center justify-between group">
            <span>{renderFormattedText(rawText)}</span>
            <a
              href={`#${headingId}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(headingId);
              }}
              className="text-stone-300 opacity-0 group-hover:opacity-100 hover:text-amber-800 transition-opacity text-xs font-mono ml-2"
              title="Section permalink"
            >
              #
            </a>
          </h3>
        );
      }
      if (paragraph.startsWith('## ')) {
        const rawText = paragraph.slice(3);
        const cleanText = rawText.replace(/[*_~`]/g, '').trim();
        const baseSlug = slugifyHeadingText(cleanText);
        const seenCount = previewIdCountMap.get(baseSlug) || 0;
        previewIdCountMap.set(baseSlug, seenCount + 1);
        const headingId = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount}`;
        return (
          <h2 id={headingId} key={idx} className="scroll-mt-8 text-lg sm:text-xl font-bold font-cinzel text-amber-950 mt-7 mb-3 border-b border-stone-200/60 pb-2 flex items-center justify-between group">
            <span>{renderFormattedText(rawText)}</span>
            <a
              href={`#${headingId}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(headingId);
              }}
              className="text-stone-300 opacity-0 group-hover:opacity-100 hover:text-amber-800 transition-opacity text-xs font-mono ml-2"
              title="Section permalink"
            >
              #
            </a>
          </h2>
        );
      }

      // Blockquote
      if (paragraph.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-amber-800 pl-4 py-2 italic text-stone-700 bg-amber-50/60 rounded-r-xl my-4 text-sm leading-relaxed">
            {renderFormattedText(paragraph.slice(2))}
          </blockquote>
        );
      }

      // Bullet List
      if (paragraph.startsWith('- ') || paragraph.startsWith('• ') || paragraph.startsWith('* ')) {
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-2 text-sm leading-relaxed text-stone-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-800 mt-2 shrink-0" />
            <span>{renderFormattedText(paragraph.replace(/^[-•*]\s*/, ''))}</span>
          </div>
        );
      }

      // Numbered List
      if (/^\d+\.\s+/.test(paragraph.trim())) {
        const numMatch = paragraph.trim().match(/^(\d+)\.\s+(.*)$/);
        return (
          <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-2 text-sm leading-relaxed text-stone-700">
            <span className="font-semibold text-amber-800 font-mono text-xs mt-0.5 shrink-0 min-w-[18px]">
              {numMatch ? numMatch[1] : '1'}.
            </span>
            <span>{renderFormattedText(numMatch ? numMatch[2] : paragraph)}</span>
          </div>
        );
      }

      // Standard Paragraph
      return (
        <p key={idx} className="text-sm sm:text-base leading-relaxed text-stone-700 my-3">
          {renderFormattedText(paragraph)}
        </p>
      );
    });

    return (
      <div className="space-y-4">
        {enableTableOfContents && flatHeadings.length >= 2 && (
          <nav aria-label="Table of Contents" className="mb-6 p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs font-sans not-prose">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-200/60">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm sm:text-base font-cinzel">
                <ListTree className="w-4 h-4 text-amber-800" />
                <span>Table of Contents</span>
              </div>
              <span className="text-[11px] font-medium text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                {flatHeadings.length} Sections
              </span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              {tocItems.map((h2Item) => (
                <li key={h2Item.id} className="space-y-1.5">
                  <a
                    href={`#${h2Item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(h2Item.id);
                    }}
                    className="text-stone-800 font-semibold hover:text-amber-900 transition-colors flex items-center gap-2 group cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-800 group-hover:scale-125 transition-transform shrink-0" />
                    <span className="hover:underline">{h2Item.text}</span>
                  </a>
                  {h2Item.children && h2Item.children.length > 0 && (
                    <ul className="pl-5 space-y-1 border-l border-amber-200/70 ml-1.5 mt-1">
                      {h2Item.children.map((h3Item) => (
                        <li key={h3Item.id}>
                          <a
                            href={`#${h3Item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection(h3Item.id);
                            }}
                            className="text-stone-600 hover:text-amber-950 transition-colors flex items-center gap-1.5 py-0.5 text-xs group cursor-pointer"
                          >
                            <span className="text-amber-800/60 font-mono text-[10px]">↳</span>
                            <span className="hover:underline">{h3Item.text}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
        {renderedParagraphs}
      </div>
    );
  }, [contentBody, enableTableOfContents, flatHeadings, tocItems]);

  const renderPreviewContent = () => renderedArticlePreview;

  return (
    <div className={`space-y-6 mx-auto overflow-x-hidden transition-all duration-150 ${isFullWidthEditor ? 'w-full px-2 sm:px-4' : 'max-w-7xl'}`}>
      {/* Draft Notification Banner */}
      {hasAutosaveDraft && !initialPost && (
        <div className="bg-amber-50/80 border border-amber-200/80 text-amber-950 px-4 py-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
            <span>
              <strong>Unsaved Draft Detected:</strong> You have an autosaved article from a previous session.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRestoreDraft}
              className="px-3 py-1.5 rounded-lg bg-amber-800 text-white font-medium hover:bg-amber-900 transition-colors cursor-pointer min-h-[36px]"
            >
              Restore Draft
            </button>
            <button
              onClick={handlePromptDiscardDraft}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer min-h-[36px]"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 3: PROFESSIONAL PAGE HEADER */}
      {/* ============================================================== */}
      <header className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Breadcrumb Navigation: Admin / Blog / Create Article */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
            <button
              type="button"
              onClick={handleBackClick}
              className="hover:text-stone-900 transition-colors cursor-pointer font-medium"
            >
              Admin
            </button>
            <span className="text-stone-300">/</span>
            <button
              type="button"
              onClick={handleBackClick}
              className="hover:text-stone-900 transition-colors cursor-pointer font-medium"
            >
              Blog
            </button>
            <span className="text-stone-300">/</span>
            <span className="font-semibold text-stone-900">
              {initialPost ? 'Edit Article' : 'Create Article'}
            </span>
          </nav>

          {/* Quick Metrics & Autosave Tag (Phase 14 & Section 7) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            {/* Dynamic Autosave Status */}
            {autosaveStatus === 'saving' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                <RefreshCw className="w-2.5 h-2.5 animate-spin text-amber-700" />
                <span>Saving draft...</span>
              </span>
            ) : autosaveStatus === 'failed' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-800 border border-red-200 shadow-2xs">
                <AlertCircle className="w-2.5 h-2.5 text-red-600" />
                <span>Save failed</span>
              </span>
            ) : isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Unsaved changes</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>All changes saved</span>
              </span>
            )}

            <span className="text-stone-300 hidden sm:inline">·</span>

            {/* Total Word Count & Character Count */}
            <span className="inline-flex items-center gap-1 font-mono text-xs text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
              <strong>{wordCount}</strong> words
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full hidden sm:inline-flex">
              <strong>{charCount}</strong> chars
            </span>

            {/* Estimated Reading Time */}
            <span className="inline-flex items-center gap-1 text-xs text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3 text-amber-800" />
              <span>{readTime}</span>
            </span>

            {/* Last saved status */}
            {lastSavedTime ? (
              <>
                <span className="text-stone-300 hidden sm:inline">·</span>
                <span className="text-stone-500 text-[11px] hidden sm:inline flex items-center gap-1">
                  <span>Saved {lastSavedTime}</span>
                </span>
              </>
            ) : (
              <>
                <span className="text-stone-300 hidden sm:inline">·</span>
                <span className="text-stone-400 text-[11px] hidden sm:inline">Not saved yet</span>
              </>
            )}
          </div>
        </div>

        {/* Header Main: Title, Subtitle, and Actual Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div className="space-y-1 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel tracking-tight">
              {initialPost ? `Edit Article: ${title || 'Untitled'}` : 'Create New Article'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 leading-normal">
              Craft matrimonial guides, configure SEO metadata, and publish professional articles.
            </p>
          </div>

          {/* Actual Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            {/* Save Draft Button (Phase 12: Saves in-place without publishing) */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveDraft}
              isLoading={isSaving && !isPublished}
              disabled={isSaving}
              leftIcon={<FileText className="w-3.5 h-3.5 text-stone-600" />}
              className="rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer min-h-[40px] px-4 font-medium"
            >
              {isSaving && !isPublished ? 'Saving Draft...' : 'Save Draft'}
            </Button>

            {/* Preview Article Button (Phase 11: Opens authentic public reader template preview) */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPreviewModal(true)}
              leftIcon={<Eye className="w-3.5 h-3.5 text-amber-800" />}
              className="rounded-xl min-h-[40px] px-4 font-medium border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              Preview Article
            </Button>

            {/* Publish Article Button (Phase 13: Validates and initiates confirmation before publish) */}
            <Button
              size="sm"
              variant="primary"
              onClick={handleInitiatePublish}
              isLoading={isSaving && isPublished}
              disabled={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
              className="rounded-xl min-h-[40px] px-5 font-semibold bg-amber-800 hover:bg-amber-900 text-white shadow-2xs cursor-pointer"
            >
              {isSaving && isPublished
                ? 'Publishing...'
                : initialPost
                ? 'Update Article'
                : 'Publish Article'}
            </Button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* PHASE 4: RESPONSIVE TWO-COLUMN LAYOUT (70% Main, 30% Sidebar) */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full overflow-x-hidden">
        {/* -------------------------------------------------------------- */}
        {/* MAIN COLUMN: Approximately 70% */}
        {/* -------------------------------------------------------------- */}
        <main
          className={`${
            viewMode === 'preview' ? 'w-full' : 'w-full lg:w-[70%]'
          } min-w-0 space-y-5 transition-all`}
        >
          {viewMode !== 'preview' ? (
            <>
              {/* ========================================================== */}
              {/* PHASE 5: ARTICLE INFORMATION SECTION CARD */}
              {/* ========================================================== */}
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 font-cinzel flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-800" />
                    <span>Article Information</span>
                  </h2>
                  <span className="text-[11px] text-stone-400">Core publication details</span>
                </div>

                {/* A. Article Title * */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="article-title-input" className="block text-xs font-semibold text-stone-700">
                      Article Title <span className="text-red-500">*</span>
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        title.length >= 50 && title.length <= 70
                          ? 'text-emerald-700 font-medium'
                          : title.length > 70
                          ? 'text-amber-700 font-medium'
                          : 'text-stone-400'
                      }`}
                    >
                      {title.length} chars {title.length >= 50 && title.length <= 70 ? '· (Optimal for SEO)' : ''}
                    </span>
                  </div>
                  <input
                    id="article-title-input"
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter your article title..."
                    className="w-full text-lg sm:text-xl font-bold font-cinzel text-stone-900 placeholder:text-stone-300 px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-colors min-h-[44px]"
                    required
                  />
                  {formErrors.title && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* B. Slug (URL Path) * */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="article-slug-input" className="block text-xs font-semibold text-stone-700">
                      Slug (URL Path) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {isManuallyEditedSlug && (
                        <button
                          type="button"
                          onClick={handleRegenerateSlug}
                          className="text-[11px] font-medium text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer hover:underline"
                          title="Regenerate slug automatically from current title"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Regenerate from Title</span>
                        </button>
                      )}
                      <span className="text-[11px] text-stone-400 font-mono">{slug.length} chars</span>
                    </div>
                  </div>

                  {/* Slug Input Box */}
                  <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50/70 overflow-hidden focus-within:border-stone-400 focus-within:bg-white transition-colors">
                    <span className="px-3 py-2.5 text-xs text-stone-400 font-mono bg-stone-100/70 border-r border-stone-200 select-none shrink-0">
                      /blog/
                    </span>
                    <input
                      id="article-slug-input"
                      type="text"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="your-article-slug"
                      className="w-full text-xs font-medium text-stone-900 font-mono px-3 py-2.5 bg-transparent focus:outline-hidden min-h-[40px]"
                      required
                    />
                  </div>

                  {/* URL Preview */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-stone-50/70 p-2.5 rounded-xl border border-stone-200/60">
                    <div className="flex items-center gap-1.5 text-stone-500 font-mono text-[11px] overflow-hidden min-w-0">
                      <Globe className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-stone-400 shrink-0">URL Preview:</span>
                      <span className="text-stone-700 font-medium truncate">
                        /blog/{slug || 'your-article-slug'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(`https://biodata-craft.vercel.app/blog/${slug || ''}`);
                        toast.success('Canonical URL copied!');
                      }}
                      className="text-[11px] text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer shrink-0 self-end sm:self-auto"
                    >
                      <Copy className="w-3 h-3 text-stone-400" />
                      <span>Copy URL</span>
                    </button>
                  </div>

                  {formErrors.slug && (
                    <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.slug}
                    </p>
                  )}
                </div>

                {/* Responsive 3-Column Grid: C. Category, D. Author, E. Estimated Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {/* C. Category */}
                  <div className="space-y-1.5">
                    <label htmlFor="article-category-select" className="block text-xs font-semibold text-stone-700">
                      Category
                    </label>
                    <select
                      id="article-category-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                    >
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Custom">+ Custom Category</option>
                    </select>

                    {category === 'Custom' && (
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Enter custom category..."
                        className="w-full text-xs py-2 px-3 mt-1.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-hidden focus:bg-white focus:border-stone-400 min-h-[36px]"
                      />
                    )}
                  </div>

                  {/* D. Author */}
                  <div className="space-y-1.5">
                    <label htmlFor="article-author-input" className="block text-xs font-semibold text-stone-700">
                      Author
                    </label>
                    <input
                      id="article-author-input"
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="BiodataCraft Editorial Team"
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                    />
                  </div>

                  {/* E. Estimated Read Time */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="article-read-time-input" className="block text-xs font-semibold text-stone-700">
                        Estimated Read Time
                      </label>
                      {isManualReadTime && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualReadTime(false);
                            setReadTime(autoComputedReadTime);
                            toast.info('Read time reset to automatic calculation.');
                          }}
                          className="text-[10px] text-amber-800 hover:underline font-medium cursor-pointer"
                          title="Reset to 210 wpm auto-calculation"
                        >
                          Auto (210 wpm)
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        id="article-read-time-input"
                        type="text"
                        value={readTime}
                        onChange={(e) => {
                          setIsManualReadTime(true);
                          setReadTime(e.target.value);
                        }}
                        placeholder="e.g. 5 min read"
                        className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                      />
                    </div>
                    <p className="text-[10px] text-stone-400">
                      {isManualReadTime ? 'Manual override active' : `Calculated at ~210 wpm (${wordCount} words)`}
                    </p>
                  </div>
                </div>
              </div>

              {/* ========================================================== */}
              {/* PHASE 6: FEATURED IMAGE SECTION CARD */}
              {/* ========================================================== */}
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 font-cinzel flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-800" />
                      <span>Featured Image</span>
                    </h2>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Primary visual displayed on catalog cards, social previews, and article banner header.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200/60">
                      Recommended Ratio: 16:9
                    </span>
                  </div>
                </div>

                {/* Hidden File Input for click-to-browse */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isUploadingImage}
                  onChange={handleFileInputChange}
                />

                {/* If no image selected yet */}
                {!featuredImage ? (
                  <div className="space-y-4">
                    {/* Choice mode selector: Upload / Drop vs Image URL */}
                    <div className="flex items-center gap-4 border-b border-stone-100 pb-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`pb-1.5 px-1 font-semibold transition-colors cursor-pointer border-b-2 -mb-[9px] ${
                          imageInputMode === 'upload'
                            ? 'border-amber-800 text-amber-900'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        Upload / Drag & Drop
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`pb-1.5 px-1 font-semibold transition-colors cursor-pointer border-b-2 -mb-[9px] ${
                          imageInputMode === 'url'
                            ? 'border-amber-800 text-amber-900'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        Image URL & Presets
                      </button>
                    </div>

                    {imageInputMode === 'upload' ? (
                      /* Drag and Drop Zone */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleTriggerFileSelect}
                        className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                          isDraggingOver
                            ? 'border-amber-700 bg-amber-50/70 scale-[0.99]'
                            : 'border-stone-300 hover:border-amber-700/60 hover:bg-stone-50/70 bg-stone-50/30'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shadow-2xs">
                          {isUploadingImage ? (
                            <RefreshCw className="w-6 h-6 animate-spin text-amber-800" />
                          ) : (
                            <Upload className="w-6 h-6 text-amber-800" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-stone-800">
                            {isUploadingImage
                              ? 'Uploading image to secure storage...'
                              : isDraggingOver
                              ? 'Drop image here to upload'
                              : 'Drag and drop your image here, or click to browse files'}
                          </p>
                          <p className="text-xs text-stone-500">
                            Supported formats: <strong>JPG, JPEG, PNG, WebP</strong> (Max 5MB)
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTriggerFileSelect();
                          }}
                          className="mt-1 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer min-h-[36px]"
                        >
                          Browse Files
                        </button>
                      </div>
                    ) : (
                      /* Image URL Input & Auspicious Presets */
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label htmlFor="featured-image-url-input" className="block text-xs font-semibold text-stone-700">
                            Direct Image URL
                          </label>
                          <div className="flex items-center rounded-xl border border-stone-200 bg-white overflow-hidden focus-within:border-stone-400">
                            <span className="px-3 text-stone-400">
                              <LinkIcon className="w-4 h-4" />
                            </span>
                            <input
                              id="featured-image-url-input"
                              type="text"
                              value={featuredImage}
                              onChange={(e) => setFeaturedImage(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full text-xs font-mono py-2.5 pr-3 text-stone-800 focus:outline-hidden min-h-[40px]"
                            />
                          </div>
                          <p className="text-[11px] text-stone-400">
                            Paste a public HTTPS image URL from Unsplash or your CDN.
                          </p>
                        </div>

                        <div className="space-y-2 pt-1">
                          <span className="text-xs font-semibold text-stone-700 block">
                            Or pick an Auspicious Indian Matrimonial Preset:
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {AUSPICIOUS_IMAGE_PRESETS.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setFeaturedImage(preset.url)}
                                className="rounded-xl border border-stone-200 p-1.5 text-left bg-white hover:border-amber-700 transition-all cursor-pointer group"
                              >
                                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-stone-100 mb-1.5">
                                  <img
                                    src={preset.url}
                                    alt={preset.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <span className="text-[10px] font-medium text-stone-700 block truncate">
                                  {preset.title}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Image Preview & Management (Phase 6 & 18) */
                  <div className="space-y-4">
                    {/* 16:9 Image Preview Box */}
                    <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-2xs group">
                      <div className="aspect-[16/9] w-full flex items-center justify-center overflow-hidden">
                        {imageLoadError ? (
                          <div className="flex flex-col items-center justify-center p-6 text-center text-stone-300 space-y-2">
                            <AlertCircle className="w-8 h-8 text-amber-400" />
                            <p className="text-xs font-semibold">Image Preview Unavailable</p>
                            <p className="text-[11px] text-stone-400 max-w-xs">
                              The specified image could not be loaded. Please verify the URL or upload a fresh file.
                            </p>
                          </div>
                        ) : (
                          <img
                            src={featuredImage}
                            alt={featuredImageAlt || title || 'Featured Banner Preview'}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            onError={() => setImageLoadError(true)}
                          />
                        )}
                      </div>

                      {/* Top-Right Control Actions */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleTriggerFileSelect}
                          className="px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer min-h-[36px]"
                          title="Replace current image"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </button>
                        <button
                          type="button"
                          onClick={handlePromptRemoveFeaturedImage}
                          className="p-2 rounded-xl bg-black/75 hover:bg-red-600 text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center backdrop-blur-xs"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Badge Bar */}
                      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {imageDimensions && (
                            <span className="px-2.5 py-1 rounded-lg bg-black/75 text-white text-[11px] font-mono backdrop-blur-xs">
                              {imageDimensions.width} × {imageDimensions.height} px
                            </span>
                          )}
                          {imageDimensions && (
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold backdrop-blur-xs ${
                                Math.abs(imageDimensions.width / imageDimensions.height - 16 / 9) <= 0.08
                                  ? 'bg-emerald-600/90 text-white'
                                  : 'bg-amber-600/90 text-white'
                              }`}
                            >
                              {Math.abs(imageDimensions.width / imageDimensions.height - 16 / 9) <= 0.08
                                ? '16:9 Optimal Ratio'
                                : `${(imageDimensions.width / imageDimensions.height).toFixed(2)} Ratio`}
                            </span>
                          )}
                          {imageFileSize && (
                            <span className="px-2.5 py-1 rounded-lg bg-black/75 text-white text-[11px] font-mono backdrop-blur-xs">
                              {imageFileSize}
                            </span>
                          )}
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-white/90 text-stone-800 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-xs">
                          16:9 Live Preview
                        </span>
                      </div>
                    </div>

                    {/* Image ALT Text & Details */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label htmlFor="article-image-alt-input" className="block text-xs font-semibold text-stone-700">
                          Image ALT Text (Accessibility & SEO)
                        </label>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {featuredImageAlt.length} chars
                        </span>
                      </div>
                      <input
                        id="article-image-alt-input"
                        type="text"
                        value={featuredImageAlt}
                        onChange={(e) => setFeaturedImageAlt(e.target.value)}
                        placeholder="e.g. Traditional Hindu matrimonial mandap with auspicious Vedic decorations"
                        className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                      />
                      <p className="text-[11px] text-stone-500">
                        Screen readers and search engines use this text to understand image context. Improves Google Discover rankings.
                      </p>
                    </div>
                  </div>
                )}

                {formErrors.featuredImage && (
                  <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {formErrors.featuredImage}
                  </p>
                )}
              </div>

              {/* ========================================================== */}
              {/* PHASE 7: ARTICLE EXCERPT SECTION (Catalog Summary) */}
              {/* ========================================================== */}
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 font-cinzel flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-800" />
                      <span>Article Excerpt (Catalog Summary) <span className="text-red-500">*</span></span>
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Write a short 2–3 sentence summary displayed in the blog directory and article preview.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoExcerpt}
                    className="text-xs font-medium text-amber-800 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer hover:underline self-start sm:self-auto py-1"
                    title="Extract summary from article first paragraph"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                    <span>Generate from paragraph</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400">
                      Recommended length: <strong>120–160 characters</strong>
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        excerpt.length >= 120 && excerpt.length <= 160
                          ? 'text-emerald-700 font-semibold'
                          : excerpt.length > 160
                          ? 'text-amber-700 font-medium'
                          : 'text-stone-400'
                      }`}
                    >
                      {excerpt.length} characters {excerpt.length >= 120 && excerpt.length <= 160 ? '· (Optimal)' : ''}
                    </span>
                  </div>
                  <textarea
                    id="article-excerpt-input"
                    aria-label="Article excerpt catalog summary"
                    aria-required="true"
                    aria-invalid={Boolean(formErrors.excerpt)}
                    rows={3}
                    value={excerpt}
                    onChange={(e) => {
                      setExcerpt(e.target.value);
                      if (formErrors.excerpt) {
                        setFormErrors((prev) => ({ ...prev, excerpt: '' }));
                      }
                    }}
                    placeholder="Write a compelling 2-3 sentence overview that informs readers and encourages them to read your complete matrimonial guide..."
                    className={`w-full text-xs p-3.5 rounded-xl border ${
                      formErrors.excerpt ? 'border-red-400 bg-red-50/20' : 'border-stone-200 bg-white'
                    } text-stone-800 focus:outline-hidden focus:border-stone-400 transition-colors leading-relaxed`}
                    required
                  />
                  {formErrors.excerpt && (
                    <p className="text-xs text-red-600 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.excerpt}
                    </p>
                  )}
                </div>
              </div>

              {/* ========================================================== */}
              {/* ARTICLE BODY & WRITING CANVAS */}
              {/* ========================================================== */}
              {/* ========================================================== */}
              {/* PHASE 8: PROFESSIONAL RICH TEXT ARTICLE EDITOR */}
              {/* ========================================================== */}
              <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
                {/* Clean Professional Formatting Toolbar */}
                <div className="px-3 sm:px-4 py-2 bg-stone-50/80 border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-1.5 text-xs select-none">
                  <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
                    {/* Undo / Redo */}
                    <div className="flex items-center gap-0.5 pr-1 border-r border-stone-200/80">
                      <button
                        type="button"
                        onClick={handleUndo}
                        disabled={historyIndex <= 0}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Undo (Ctrl+Z)"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleRedo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Redo (Ctrl+Y)"
                      >
                        <Redo2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Headings & Paragraph Controls */}
                    <div className="flex items-center gap-0.5 px-1 border-r border-stone-200/80">
                      <button
                        type="button"
                        onClick={() => insertFormatting('', '', 'Paragraph text')}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors cursor-pointer font-medium flex items-center gap-0.5 min-h-[32px] min-w-[32px] justify-center"
                        title="Normal Paragraph"
                      >
                        <Type className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('## ', '', 'Section Heading')}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors font-bold cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Heading 2 (##)"
                      >
                        <Heading2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('### ', '', 'Sub-heading')}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors font-bold cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Heading 3 (###)"
                      >
                        <Heading3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('#### ', '', 'Minor Topic Heading')}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 transition-colors font-bold text-[11px] cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Heading 4 (####)"
                      >
                        <Heading4 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Text Formatting: Bold, Italic, Underline, Strikethrough, Inline Code */}
                    <div className="flex items-center gap-0.5 px-1 border-r border-stone-200/80">
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**', 'bold text')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Bold (Ctrl+B)"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('*', '*', 'italic text')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Italic (Ctrl+I)"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('<u>', '</u>', 'underlined text')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Underline (Ctrl+U)"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('~~', '~~', 'strikethrough text')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Strikethrough (~~text~~)"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('`', '`', 'term')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Inline Code / Auspicious Vedic Term"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Text Alignment (Left, Center, Right) */}
                    <div className="flex items-center gap-0.5 px-1 border-r border-stone-200/80">
                      <button
                        type="button"
                        onClick={() => applyAlignment('left')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Align Left"
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyAlignment('center')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Align Center (e.g. Matrimonial Shlok / Blessing)"
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => applyAlignment('right')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Align Right"
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Lists, Quote & Divider */}
                    <div className="flex items-center gap-0.5 px-1 border-r border-stone-200/80">
                      <button
                        type="button"
                        onClick={() => insertFormatting('- ', '', 'Bullet point item')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Bullet List (- item)"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('1. ', '', 'Numbered step item')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Numbered List (1. item)"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('> ', '', 'Cultural advice or auspicious matrimonial note.')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Blockquote (> quote)"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('\n\n---\n\n', '')}
                        className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Horizontal Divider (---)"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Advanced Content & Navigation Helpers */}
                    <div className="flex items-center gap-1 pl-1">
                      {/* External / Custom Link */}
                      <button
                        type="button"
                        onClick={handleOpenLinkModal}
                        className="px-2 py-1.5 rounded-lg hover:bg-stone-200/70 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer min-h-[32px]"
                        title="Insert Custom Link (Ctrl+K)"
                      >
                        <LinkIcon className="w-3.5 h-3.5 text-amber-800" />
                        <span className="text-[11px] font-medium hidden sm:inline">Link</span>
                      </button>

                      {/* Internal Website Route Linker */}
                      <button
                        type="button"
                        onClick={() => handleOpenInternalLinkModal()}
                        className="px-2 py-1.5 rounded-lg hover:bg-amber-100/70 text-amber-900 transition-colors flex items-center gap-1 cursor-pointer min-h-[32px]"
                        title="Search & Link to BiodataCraft Templates, Formats & Articles"
                      >
                        <Link2 className="w-3.5 h-3.5 text-amber-800" />
                        <span className="text-[11px] font-semibold hidden md:inline">Internal Link</span>
                      </button>

                      {/* Inline Image Modal */}
                      <button
                        type="button"
                        onClick={handleOpenImageModal}
                        className="px-2 py-1.5 rounded-lg hover:bg-stone-200/70 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer min-h-[32px]"
                        title="Insert Image inside Body"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
                        <span className="text-[11px] font-medium hidden sm:inline">Image</span>
                      </button>

                      {/* Article Media Manager */}
                      <button
                        type="button"
                        onClick={() => setShowMediaManagerModal(true)}
                        className="px-2 py-1.5 rounded-lg hover:bg-stone-200/70 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer min-h-[32px]"
                        title="Open Media Library & Manage Uploads"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-800" />
                        <span className="text-[11px] font-medium hidden lg:inline">Media Library</span>
                      </button>

                      {/* Table Modal */}
                      <button
                        type="button"
                        onClick={handleOpenTableModal}
                        className="px-2 py-1.5 rounded-lg hover:bg-stone-200/70 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer min-h-[32px]"
                        title="Insert Comparison Table"
                      >
                        <TableIcon className="w-3.5 h-3.5 text-amber-800" />
                        <span className="text-[11px] font-medium hidden sm:inline">Table</span>
                      </button>

                      {/* Structure Assistant */}
                      <button
                        type="button"
                        onClick={() => setShowStructureModal(true)}
                        className="px-2 py-1.5 rounded-lg hover:bg-stone-200/70 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer min-h-[32px]"
                        title="Insert Educational Guide Structure & Outlines"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                        <span className="text-[11px] font-medium hidden xl:inline">Structure</span>
                      </button>

                      {/* Version History */}
                      <button
                        type="button"
                        onClick={() => setShowVersionHistoryModal(true)}
                        className="px-2 py-1.5 rounded-lg hover:bg-stone-200/70 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer min-h-[32px]"
                        title="View Article Version History Snapshots"
                      >
                        <History className="w-3.5 h-3.5 text-stone-600" />
                        <span className="text-[11px] font-medium hidden xl:inline">History</span>
                      </button>

                      {/* CTA Conversion Box */}
                      <button
                        type="button"
                        onClick={insertCtaBlock}
                        className="px-2 py-1.5 rounded-lg hover:bg-amber-100 text-[11px] font-semibold text-amber-900 transition-colors flex items-center gap-1 cursor-pointer min-h-[32px]"
                        title="Insert BiodataCraft Conversion Callout"
                      >
                        <Sparkles className="w-3 h-3 text-amber-800" />
                        <span className="hidden md:inline">+ CTA Box</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Action Tools: Full-Width Toggle & Split View Toggle */}
                  <div className="flex items-center gap-1.5">
                    {/* Full-Width Canvas Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsFullWidthEditor((prev) => !prev)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center ${
                        isFullWidthEditor
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                      title={isFullWidthEditor ? 'Exit Full Width (Center Content)' : 'Full Width Editor Mode'}
                    >
                      {isFullWidthEditor ? (
                        <Minimize2 className="w-3.5 h-3.5" />
                      ) : (
                        <Maximize2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* View Mode Toggle (Single Editor vs Split View) */}
                    <button
                      type="button"
                      onClick={() => setViewMode(viewMode === 'split' ? 'editor' : 'split')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer min-h-[34px] ${
                        viewMode === 'split'
                          ? 'bg-amber-50 text-amber-950 border-amber-300 font-semibold'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                      title="Toggle Side-by-Side Split View"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{viewMode === 'split' ? 'Single Editor' : 'Split View'}</span>
                    </button>
                  </div>
                </div>

                {/* Text Area & Split View Canvas */}
                <div className={viewMode === 'split' ? 'grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200/80' : ''}>
                  {/* Editor Textarea */}
                  <div className="p-5 sm:p-6 space-y-2">
                    <textarea
                      id="article-body-textarea"
                      aria-label="Article content rich text body"
                      aria-required="true"
                      aria-invalid={Boolean(formErrors.content)}
                      ref={textareaRef}
                      rows={viewMode === 'split' ? 24 : 20}
                      value={contentBody}
                      onKeyDown={handleEditorKeyDown}
                      onChange={(e) => {
                        setContentBody(e.target.value);
                        if (formErrors.content) {
                          setFormErrors((prev) => ({ ...prev, content: '' }));
                        }
                      }}
                      placeholder={`Start writing your matrimonial guide here...\n\nExample Outline:\n## Astrological Compatibility in Arranged Marriage\nIn Vedic matchmaking, Kundali matching (Guna Milan) evaluates 36 Gunas to ensure harmony between the prospective bride and groom.\n\n### Essential Guna Categories:\n- Varna (Spiritual ego)\n- Yoni (Biological balance)\n- Nadi (Genetic lineage)\n\n> "Kundali matching is intended to guide harmony, while mutual understanding and respect remain the cornerstones of marriage."\n\nUse the toolbar above or shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+K) to format.`}
                      className="w-full text-stone-800 placeholder:text-stone-300 font-sans text-sm sm:text-base leading-relaxed focus:outline-hidden resize-y min-h-[380px]"
                    />
                    {formErrors.content && (
                      <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formErrors.content}
                      </p>
                    )}

                    {/* Word, Character & Shortcuts Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-stone-100 text-xs text-stone-400 font-mono">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-stone-600">{wordCount} words</span>
                        <span>·</span>
                        <span>{charCount} chars</span>
                        <span>·</span>
                        <span>{paragraphCount} blocks</span>
                      </div>
                      <div className="flex items-center gap-3 font-sans text-stone-500">
                        <span className="text-[11px] text-stone-400 hidden lg:inline">
                          Ctrl+B: Bold · Ctrl+I: Italic · Ctrl+U: Underline · Ctrl+K: Link · Ctrl+Z: Undo
                        </span>
                        <div className="flex items-center gap-1 text-stone-600 font-medium">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Split Reader Pane */}
                  {viewMode === 'split' && (
                    <div className="p-5 sm:p-6 bg-stone-50/40 max-h-[680px] overflow-y-auto space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200/70 text-xs font-semibold text-stone-400">
                        <span>Live Reader Preview</span>
                        <span className="font-cinzel text-amber-950 font-bold">BiodataCraft</span>
                      </div>
                      <div className="prose prose-stone max-w-none text-stone-800 font-sans">
                        {renderPreviewContent()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Phase 9: Table of Contents Settings & Document Outline */}
              <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-800">
                      <ListTree className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 font-cinzel">Table of Contents Support</h3>
                      <p className="text-xs text-stone-500">
                        Automatic hierarchical jump navigation derived from H2 and H3 headings.
                      </p>
                    </div>
                  </div>

                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-stone-700">
                      {enableTableOfContents ? 'TOC Enabled' : 'TOC Disabled'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer min-h-[36px]">
                      <input
                        type="checkbox"
                        checked={enableTableOfContents}
                        onChange={(e) => setEnableTableOfContents(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[8px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-800"></div>
                    </label>
                  </div>
                </div>

                {/* Status & Outline Display */}
                {enableTableOfContents ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {flatHeadings.length} Headings Detected
                        </span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-600 font-medium">{h2Count} H2 Sections</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-600 font-medium">{h3Count} H3 Subsections</span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        Unique anchor IDs generated
                      </span>
                    </div>

                    {flatHeadings.length < 2 ? (
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">Notice: Fewer than 2 headings detected</p>
                          <p className="text-[11px] text-amber-800/80 mt-0.5">
                            To display an automated Table of Contents in the reader view, add at least two H2 (##) or H3 (###) headings to your article body.
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Hierarchical Document Outline Tree */
                      <div className="bg-stone-50/60 rounded-xl border border-stone-200/70 p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
                          <span>Document Outline (Hierarchy & Jump Anchors)</span>
                          <span className="text-stone-400 font-mono text-[10px]">Real-time Auto-Sync</span>
                        </div>
                        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 font-sans">
                          {tocItems.map((h2) => (
                            <div key={h2.id} className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-semibold text-stone-800 bg-white p-2 rounded-lg border border-stone-200/60 shadow-2xs">
                                <div className="flex items-center gap-2 truncate">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">H2</span>
                                  <span className="truncate">{h2.text}</span>
                                </div>
                                <code className="text-[10px] text-stone-400 font-mono ml-2 shrink-0">#{h2.id}</code>
                              </div>
                              {h2.children && h2.children.length > 0 && (
                                <div className="pl-5 space-y-1">
                                  {h2.children.map((h3) => (
                                    <div key={h3.id} className="flex items-center justify-between text-xs text-stone-600 bg-white/70 p-1.5 rounded-md border border-stone-200/50">
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="text-[10px] px-1 py-0.2 rounded bg-stone-100 text-stone-600 font-mono">H3</span>
                                        <span className="truncate text-[11px]">{h3.text}</span>
                                      </div>
                                      <code className="text-[9px] text-stone-400 font-mono ml-2 shrink-0">#{h3.id}</code>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/60 text-xs text-stone-500">
                    <p>
                      Table of Contents is currently <strong>disabled</strong> for this article. Shorter matrimonial posts and single-topic announcements do not require a TOC. Enable this toggle when authoring comprehensive guides with multiple distinct sub-sections.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Full Reader Simulation */
            <article className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-12 shadow-2xs space-y-8 max-w-4xl mx-auto">
              <header className="border-b border-stone-100 pb-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-amber-900">
                    {category === 'Custom' ? customCategory || 'General' : category}
                  </span>
                  <span>·</span>
                  <span>{publishedDate}</span>
                  <span>·</span>
                  <span>{readTime}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-cinzel text-stone-900 leading-tight">
                  {title || 'Article Title Preview'}
                </h1>
                <div className="flex items-center gap-2 text-xs text-stone-600 pt-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>By <strong>{author}</strong></span>
                </div>
              </header>

              {featuredImage && (
                <div className="space-y-2">
                  <div className="rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-100 aspect-video max-h-96">
                    <img
                      src={featuredImage}
                      alt={featuredImageAlt || title || 'Featured Banner Preview'}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  {featuredImageAlt && (
                    <p className="text-[11px] text-stone-400 italic text-center font-serif">
                      Photo: {featuredImageAlt}
                    </p>
                  )}
                </div>
              )}

              {excerpt && (
                <div className="bg-amber-50/60 border-l-4 border-amber-800 rounded-r-2xl p-5 border border-amber-200/60">
                  <p className="text-base text-stone-800 font-medium italic leading-relaxed">
                    {excerpt}
                  </p>
                </div>
              )}

              <div className="space-y-4 pt-2">
                {renderPreviewContent()}
              </div>

              <footer className="p-6 bg-stone-50 border border-stone-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-stone-900 font-cinzel text-base">
                    Ready to format your marriage biodata?
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Create publication-grade Indian matrimonial biodatas with authentic borders in minutes.
                  </p>
                </div>
                <Button size="sm" variant="primary" className="shrink-0 pointer-events-none rounded-xl bg-amber-800 text-white">
                  Create Free Biodata
                </Button>
              </footer>
            </article>
          )}
        </main>

        {/* -------------------------------------------------------------- */}
        {/* SIDEBAR: Approximately 30% (Publishing and SEO settings) */}
        {/* -------------------------------------------------------------- */}
        {viewMode !== 'preview' && (
          <aside className="w-full lg:w-[30%] shrink-0 space-y-4">
            <div className="bg-white border border-stone-200/80 rounded-2xl shadow-2xs overflow-hidden">
              {/* Sidebar Segment Tabs */}
              <div className="grid grid-cols-5 border-b border-stone-100 p-1 bg-stone-50/60 text-xs">
                <button
                  type="button"
                  onClick={() => setSidebarTab('publish')}
                  className={`py-2 px-0.5 text-center font-medium rounded-xl transition-all cursor-pointer min-h-[36px] ${
                    sidebarTab === 'publish'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('seo')}
                  className={`py-2 px-0.5 text-center font-medium rounded-xl transition-all cursor-pointer min-h-[36px] ${
                    sidebarTab === 'seo'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  SEO
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('quality')}
                  className={`py-2 px-0.5 text-center font-medium rounded-xl transition-all cursor-pointer min-h-[36px] flex items-center justify-center gap-1 ${
                    sidebarTab === 'quality'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <span>Quality</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('media')}
                  className={`py-2 px-0.5 text-center font-medium rounded-xl transition-all cursor-pointer min-h-[36px] ${
                    sidebarTab === 'media'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Media
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('social')}
                  className={`py-2 px-0.5 text-center font-medium rounded-xl transition-all cursor-pointer min-h-[36px] ${
                    sidebarTab === 'social'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Social
                </button>
              </div>

              {/* TAB 1: PUBLISH & TAXONOMY SETTINGS */}
              {sidebarTab === 'publish' && (
                <div className="p-4 sm:p-5 space-y-4 text-xs">
                  {/* Status Box */}
                  <div className="bg-stone-50/70 p-3.5 rounded-xl border border-stone-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-800">Publish Immediately</span>
                      <label className="relative inline-flex items-center cursor-pointer min-h-[40px]">
                        <input
                          type="checkbox"
                          checked={isPublished}
                          onChange={(e) => setIsPublished(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-800"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      {isPublished
                        ? 'Article will be publicly visible and indexed on /blog.'
                        : 'Saved as draft. Hidden from the public directory.'}
                    </p>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-stone-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                    >
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Custom">+ Custom Category</option>
                    </select>

                    {category === 'Custom' && (
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Anand Karaj Sikh Guides"
                        className="w-full text-xs py-2.5 px-3 mt-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 focus:outline-hidden focus:bg-white focus:border-stone-400 min-h-[40px]"
                      />
                    )}
                  </div>

                  {/* Author Presets */}
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-stone-700">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. BiodataCraft Editorial Team"
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {AUTHOR_PRESETS.map((ap) => (
                        <button
                          key={ap}
                          type="button"
                          onClick={() => setAuthor(ap)}
                          className={`text-[10px] px-2 py-1 rounded-md border transition-colors cursor-pointer min-h-[28px] ${
                            author === ap
                              ? 'bg-stone-200/80 border-stone-300 text-stone-900 font-semibold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {ap.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Read Time & Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-semibold text-stone-700">Read Time</label>
                      <input
                        type="text"
                        value={readTime}
                        onChange={(e) => {
                          setIsManualReadTime(true);
                          setReadTime(e.target.value);
                        }}
                        placeholder="5 min read"
                        className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-semibold text-stone-700">Display Date</label>
                      <input
                        type="text"
                        value={publishedDate}
                        onChange={(e) => setPublishedDate(e.target.value)}
                        placeholder="October 2026"
                        className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                      />
                    </div>
                  </div>

                  {/* Sidebar Publish Action Buttons */}
                  <div className="pt-3 border-t border-stone-200/60 space-y-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleInitiatePublish}
                      isLoading={isSaving && isPublished}
                      disabled={isSaving}
                      leftIcon={<Save className="w-3.5 h-3.5" />}
                      className="w-full rounded-xl bg-amber-800 hover:bg-amber-900 text-white min-h-[40px] font-semibold cursor-pointer shadow-2xs"
                    >
                      {initialPost ? 'Update & Publish' : 'Publish Article'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveDraft}
                      isLoading={isSaving && !isPublished}
                      disabled={isSaving}
                      leftIcon={<FileText className="w-3.5 h-3.5 text-stone-600" />}
                      className="w-full rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 min-h-[40px] font-medium cursor-pointer"
                    >
                      Save Draft
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 2: SEO SETTINGS (Phase 10) */}
              {sidebarTab === 'seo' && (
                <div className="p-4 sm:p-5 space-y-4 text-xs">
                  {/* Google SERP Snippet Preview (Phase 10-D) */}
                  <div className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-200/60 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-600 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-800" />
                        <span>Google Search Snippet Preview</span>
                      </div>
                      <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-stone-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setSerpDevice('desktop')}
                          className={`p-1 rounded cursor-pointer transition-colors ${
                            serpDevice === 'desktop' ? 'bg-stone-200 text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                          }`}
                          title="Desktop Search Snippet"
                        >
                          <Monitor className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSerpDevice('mobile')}
                          className={`p-1 rounded cursor-pointer transition-colors ${
                            serpDevice === 'mobile' ? 'bg-stone-200 text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                          }`}
                          title="Mobile Search Snippet"
                        >
                          <Smartphone className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Google SERP Card */}
                    <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs space-y-1.5 font-sans">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <div className="w-4 h-4 rounded-full bg-amber-800 text-white flex items-center justify-center text-[9px] font-cinzel font-bold shrink-0">
                          B
                        </div>
                        <div className="flex items-center gap-1 truncate text-stone-600">
                          <span className="font-medium text-stone-800">BiodataCraft</span>
                          <span>›</span>
                          <span>blog</span>
                          <span>›</span>
                          <span className="text-stone-500 truncate">{slug.trim() || 'your-article-slug'}</span>
                        </div>
                      </div>
                      <h4 className="text-sm sm:text-base font-medium text-blue-700 hover:underline cursor-pointer truncate leading-snug">
                        {seoTitle.trim() || (title.trim() ? `${title.trim()} | BiodataCraft` : 'Article Title Preview | BiodataCraft')}
                      </h4>
                      <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                        {seoDescription.trim() || excerpt.trim() || 'Craft comprehensive Indian matrimonial biodatas, explore Kundali and Gotra guides, and download free marriage templates.'}
                      </p>
                    </div>

                    <p className="text-[10px] text-stone-400 leading-normal italic">
                      Google Snippet Simulation: Preview demonstrates standard Google SERP appearance. BiodataCraft does not guarantee search rankings or rich results; organic rank is determined independently by search engine indexing and content relevance.
                    </p>
                  </div>

                  {/* SEO Title Tag (Phase 10-A) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-stone-700 flex items-center gap-1">
                        <span>SEO Title Tag</span>
                        <span className="text-amber-800">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                            seoTitle.length >= 50 && seoTitle.length <= 60
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : seoTitle.length > 60
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {seoTitle.length}/60 chars
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => {
                          setSeoTitle(e.target.value);
                          if (formErrors.seoTitle) {
                            setFormErrors((prev) => ({ ...prev, seoTitle: '' }));
                          }
                        }}
                        placeholder={`${title || 'Article Title'} | BiodataCraft Guides`}
                        className={`w-full text-xs py-2.5 px-3 rounded-xl border bg-white text-stone-800 focus:outline-hidden min-h-[40px] ${
                          formErrors.seoTitle ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-stone-400'
                        }`}
                      />
                    </div>
                    {formErrors.seoTitle && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.seoTitle}</span>
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5">
                      <span>Recommended: 50–60 characters</span>
                      {title.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setSeoTitle(`${title.trim()} | BiodataCraft`);
                            if (formErrors.seoTitle) {
                              setFormErrors((prev) => ({ ...prev, seoTitle: '' }));
                            }
                          }}
                          className="text-amber-800 hover:text-amber-950 font-medium cursor-pointer"
                        >
                          Auto-fill from Title
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SEO Meta Description (Phase 10-B) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-stone-700 flex items-center gap-1">
                        <span>SEO Meta Description</span>
                        <span className="text-amber-800">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                            seoDescription.length >= 120 && seoDescription.length <= 160
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : seoDescription.length > 160
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {seoDescription.length}/160 chars
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={seoDescription}
                      onChange={(e) => {
                        setSeoDescription(e.target.value);
                        if (formErrors.seoDescription) {
                          setFormErrors((prev) => ({ ...prev, seoDescription: '' }));
                        }
                      }}
                      placeholder="Comprehensive matrimonial guidance for prospective brides, grooms, and parents..."
                      className={`w-full text-xs p-3 rounded-xl border bg-white text-stone-800 focus:outline-hidden leading-relaxed ${
                        formErrors.seoDescription ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-stone-400'
                      }`}
                    />
                    {formErrors.seoDescription && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.seoDescription}</span>
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5">
                      <span>Recommended: 120–160 characters</span>
                      {excerpt.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setSeoDescription(excerpt.trim());
                            if (formErrors.seoDescription) {
                              setFormErrors((prev) => ({ ...prev, seoDescription: '' }));
                            }
                          }}
                          className="text-amber-800 hover:text-amber-950 font-medium cursor-pointer"
                        >
                          Auto-fill from Excerpt
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Canonical URL Section (Phase 10-C) */}
                  <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                        <span className="font-semibold text-stone-700">Canonical URL</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const target = canonicalUrlOverride.trim() || `https://biodata-craft.vercel.app/blog/${slug.trim() || 'your-article-slug'}`;
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(target);
                            toast.success('Canonical URL copied to clipboard!');
                          }
                        }}
                        className="text-[11px] text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 cursor-pointer"
                        title="Copy Canonical URL"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </button>
                    </div>

                    {/* Default Canonical URL Display */}
                    <div className="p-2 bg-white rounded-lg border border-stone-200 font-mono text-[11px] text-stone-600 break-all select-all">
                      {canonicalUrlOverride.trim() || `https://biodata-craft.vercel.app/blog/${slug.trim() || 'your-article-slug'}`}
                    </div>

                    {/* Safe Override Toggle */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showCustomCanonical}
                          onChange={(e) => {
                            setShowCustomCanonical(e.target.checked);
                            if (!e.target.checked) {
                              setCanonicalUrlOverride('');
                            }
                          }}
                          className="rounded text-amber-800 focus:ring-amber-800/20"
                        />
                        <span className="text-[11px] text-stone-600 font-medium">
                          Custom Canonical URL Override (for syndicated content)
                        </span>
                      </label>

                      {showCustomCanonical && (
                        <div className="mt-2 space-y-1">
                          <input
                            type="url"
                            value={canonicalUrlOverride}
                            onChange={(e) => setCanonicalUrlOverride(e.target.value)}
                            placeholder="https://example.com/original-article"
                            className="w-full text-xs py-2 px-3 rounded-lg border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 font-mono"
                          />
                          {formErrors.canonicalUrl && (
                            <p className="text-[10px] text-red-600 font-medium">
                              {formErrors.canonicalUrl}
                            </p>
                          )}
                          <p className="text-[10px] text-stone-400">
                            Preserves default canonical URL to protect search indexing. Only set this if this article was syndicated from another publication.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Focus Target Keyword */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block font-semibold text-stone-700">
                      Focus Target Keyword (Audit)
                    </label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        placeholder="e.g. kundali in marriage biodata"
                        className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[40px]"
                      />
                    </div>
                  </div>

                  {/* On-Page SEO Audit Checklist */}
                  <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/60 space-y-1.5">
                    <span className="font-semibold text-stone-700 block text-[11px] mb-1">
                      On-Page SEO Audit Checklist:
                    </span>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        {seoTitle.length >= 50 && seoTitle.length <= 60 ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className={seoTitle.length >= 50 && seoTitle.length <= 60 ? 'text-stone-700 font-medium' : 'text-stone-500'}>
                          Title Tag Length ({seoTitle.length}/50–60 chars)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {seoDescription.length >= 120 && seoDescription.length <= 160 ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className={seoDescription.length >= 120 && seoDescription.length <= 160 ? 'text-stone-700 font-medium' : 'text-stone-500'}>
                          Meta Description Length ({seoDescription.length}/120–160 chars)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {seoChecklist.wordCountPass ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className={seoChecklist.wordCountPass ? 'text-stone-700 font-medium' : 'text-stone-500'}>
                          Content Length ({wordCount}/300+ words)
                        </span>
                      </div>

                      {focusKeyword && (
                        <>
                          <div className="flex items-center gap-2">
                            {seoChecklist.keywordInTitle ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span className={seoChecklist.keywordInTitle ? 'text-stone-700 font-medium' : 'text-stone-500'}>
                              Keyword in Article Title
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {seoChecklist.keywordInSlug ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span className={seoChecklist.keywordInSlug ? 'text-stone-700 font-medium' : 'text-stone-500'}>
                              Keyword in URL Slug
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {seoChecklist.keywordInDesc ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span className={seoChecklist.keywordInDesc ? 'text-stone-700 font-medium' : 'text-stone-500'}>
                              Keyword in Meta Description
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-2">
                        {seoChecklist.hasFeaturedImage ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className={seoChecklist.hasFeaturedImage ? 'text-stone-700 font-medium' : 'text-stone-500'}>
                          Featured Image Configured
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ARTICLE QUALITY & SEO WRITING ASSISTANT */}
              {sidebarTab === 'quality' && (
                <ArticleQualityAssistant
                  title={title}
                  slug={slug}
                  excerpt={excerpt}
                  contentBody={contentBody}
                  featuredImage={featuredImage}
                  featuredImageAlt={featuredImageAlt}
                  seoTitle={seoTitle}
                  seoDescription={seoDescription}
                  focusKeyword={focusKeyword}
                  onApplyTitleSuggestion={(newTitle) => {
                    setSeoTitle(newTitle);
                    toast.success('Applied suggested title to SEO Title tag.');
                  }}
                  onApplyDescriptionSuggestion={(newDesc) => {
                    setSeoDescription(newDesc);
                    toast.success('Applied suggested description to Meta Description.');
                  }}
                  onApplyExcerptSuggestion={(newExcerpt) => {
                    setExcerpt(newExcerpt);
                    toast.success('Applied suggested excerpt to Catalog Summary.');
                  }}
                  onOpenInternalLinksModal={() => handleOpenInternalLinkModal()}
                  onOpenInternalLinksModalWithQuery={(query, anchor) => handleOpenInternalLinkModal(query, anchor)}
                  onApplyInternalLinkOpportunity={handleApplyLinkingOpportunity}
                  onOpenStructureModal={() => setShowStructureModal(true)}
                />
              )}

              {/* TAB 3: FEATURED MEDIA */}
              {sidebarTab === 'media' && (
                <div className="p-4 sm:p-5 space-y-4 text-xs">
                  {featuredImage ? (
                    <div className="space-y-2">
                      <div className="rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 relative group">
                        <img
                          src={featuredImage}
                          alt="Featured Banner"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-36 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handlePromptRemoveFeaturedImage}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer min-h-[32px] min-w-[32px]"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-400 font-mono truncate">{featuredImage}</p>
                    </div>
                  ) : (
                    <div className="py-6 border border-dashed border-stone-200 rounded-xl text-center text-stone-400 space-y-1">
                      <ImageIcon className="w-7 h-7 mx-auto opacity-40 text-stone-400" />
                      <p className="font-semibold text-stone-600 text-xs">No Image Selected</p>
                      <p className="text-[11px]">Upload or select a preset below.</p>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div>
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-medium cursor-pointer shadow-2xs transition-colors min-h-[40px]">
                      <Upload className="w-4 h-4 text-stone-600" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload Image (Max 5MB)'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={isUploadingImage}
                        onChange={handleFileInputChange}
                      />
                    </label>
                  </div>

                  {/* Custom URL Input */}
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Image URL</label>
                    <input
                      type="text"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 font-mono min-h-[40px]"
                    />
                  </div>

                  {/* Auspicious Presets Gallery */}
                  <div className="space-y-2 pt-1">
                    <span className="font-semibold text-stone-700 block text-[11px]">
                      Auspicious Indian Wedding Presets:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {AUSPICIOUS_IMAGE_PRESETS.map((preset, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFeaturedImage(preset.url)}
                          className={`rounded-xl border p-1 text-left transition-all cursor-pointer group min-h-[44px] ${
                            featuredImage === preset.url
                              ? 'border-amber-800 ring-2 ring-amber-800/15 bg-amber-50/40'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="h-14 rounded-lg overflow-hidden bg-stone-100 mb-1">
                            <img
                              src={preset.url}
                              alt={preset.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <span className="text-[10px] font-medium text-stone-700 block truncate">
                            {preset.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SOCIAL SHARE CARD PREVIEW */}
              {sidebarTab === 'social' && (
                <div className="p-4 sm:p-5 space-y-4 text-xs">
                  <div className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
                      <span>Social Sharing Preview</span>
                      <Share2 className="w-3.5 h-3.5 text-stone-400" />
                    </div>
                    <p className="text-[11px] text-stone-500 leading-normal">
                      Preview for WhatsApp, Facebook, and Twitter/X link cards.
                    </p>

                    <div className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-2xs">
                      {featuredImage ? (
                        <img
                          src={featuredImage}
                          alt="Social preview banner"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-24 bg-stone-100 flex items-center justify-center text-stone-400">
                          <ImageIcon className="w-6 h-6 opacity-30" />
                        </div>
                      )}
                      <div className="p-3 space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                          biodata-craft.vercel.app
                        </span>
                        <h4 className="font-semibold text-stone-900 text-xs line-clamp-1">
                          {title || 'Article Title'}
                        </h4>
                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                          {excerpt || 'Read this complete matrimonial guide on BiodataCraft.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* -------------------------------------------------------------- */}
      {/* LINK INSERTION MODAL (Phase 8) */}
      {/* -------------------------------------------------------------- */}
      {showLinkModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="insert-link-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 id="insert-link-dialog-title" className="font-bold text-stone-900 font-cinzel text-base flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-amber-800" />
                <span>Insert Hyperlink</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Display Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Free Marriage Biodata Maker"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[38px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Quick Matrimonial Destinations</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLinkUrl('/create');
                      if (!linkText) setLinkText('BiodataCraft Biodata Maker');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Biodata Maker (/create)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkUrl('/templates');
                      if (!linkText) setLinkText('Matrimonial Biodata Templates');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Templates (/templates)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkUrl('/samples');
                      if (!linkText) setLinkText('Biodata Formats & Samples');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Samples (/samples)
                  </button>
                </div>
              </div>

              {existingPosts.length > 0 && (
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Internal Article Link</label>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        const target = existingPosts.find((p) => p.slug === e.target.value);
                        setLinkUrl(`/blog/${e.target.value}`);
                        if (!linkText && target) setLinkText(target.title);
                      }
                    }}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400 min-h-[38px]"
                  >
                    <option value="">-- Choose published guide --</option>
                    {existingPosts.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Destination URL *</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://... or /create"
                  className="w-full text-xs py-2.5 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 font-mono focus:outline-hidden focus:border-stone-400 min-h-[38px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowLinkModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleInsertLink}
                className="rounded-xl bg-amber-800 hover:bg-amber-900 text-white"
              >
                Insert Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* BODY IMAGE INSERTION MODAL (Phase 8) */}
      {/* -------------------------------------------------------------- */}
      {showImageModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="insert-body-image-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 id="insert-body-image-dialog-title" className="font-bold text-stone-900 font-cinzel text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-800" />
                <span>Insert Image into Article Body</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={bodyFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={isUploadingBodyImage}
              onChange={handleUploadBodyImage}
            />

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-4 border-b border-stone-100 pb-2">
                <button
                  type="button"
                  onClick={() => setBodyImageInputMode('upload')}
                  className={`pb-1 font-semibold transition-colors cursor-pointer border-b-2 -mb-[9px] ${
                    bodyImageInputMode === 'upload'
                      ? 'border-amber-800 text-amber-900'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={() => setBodyImageInputMode('url')}
                  className={`pb-1 font-semibold transition-colors cursor-pointer border-b-2 -mb-[9px] ${
                    bodyImageInputMode === 'url'
                      ? 'border-amber-800 text-amber-900'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Image Web URL
                </button>
              </div>

              {bodyImageInputMode === 'upload' ? (
                <div>
                  <button
                    type="button"
                    disabled={isUploadingBodyImage}
                    onClick={() => bodyFileInputRef.current?.click()}
                    className="w-full py-6 border-2 border-dashed border-stone-300 hover:border-amber-700 rounded-xl bg-stone-50/50 flex flex-col items-center justify-center gap-2 text-stone-600 cursor-pointer transition-colors"
                  >
                    {isUploadingBodyImage ? (
                      <RefreshCw className="w-6 h-6 animate-spin text-amber-800" />
                    ) : (
                      <Upload className="w-6 h-6 text-amber-800" />
                    )}
                    <span className="font-semibold text-xs text-stone-800">
                      {isUploadingBodyImage ? 'Uploading image...' : 'Click to select and upload image'}
                    </span>
                    <span className="text-[11px] text-stone-400">Supported: JPG, JPEG, PNG, WebP (Max 5MB)</span>
                  </button>
                  {bodyImageUrl && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-1 truncate">
                      ✓ Ready: {bodyImageUrl}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Image Web URL *</label>
                  <input
                    type="text"
                    value={bodyImageUrl}
                    onChange={(e) => setBodyImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 font-mono focus:outline-hidden focus:border-stone-400"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">ALT Text (Accessibility & SEO) *</label>
                <input
                  type="text"
                  value={bodyImageAlt}
                  onChange={(e) => setBodyImageAlt(e.target.value)}
                  placeholder="e.g. Traditional Hindu kundali chart illustration"
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Image Caption (Optional)</label>
                <input
                  type="text"
                  value={bodyImageCaption}
                  onChange={(e) => setBodyImageCaption(e.target.value)}
                  placeholder="e.g. Figure 1: Ashtakoot Guna Milan criteria in marriage matching"
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-hidden focus:border-stone-400"
                />
              </div>

              {bodyImageUrl && (
                <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                  <div className="w-16 h-12 rounded-lg bg-stone-200 overflow-hidden shrink-0">
                    <img
                      src={bodyImageUrl}
                      alt="Preview"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-stone-600 truncate">
                    <span className="font-semibold block truncate">{bodyImageAlt || 'No ALT set'}</span>
                    <span className="text-stone-400 italic truncate block">{bodyImageCaption || 'No caption'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowImageModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleInsertBodyImage}
                disabled={!bodyImageUrl.trim()}
                className="rounded-xl bg-amber-800 hover:bg-amber-900 text-white"
              >
                Insert Image
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------- */}
      {/* TABLE INSERTION MODAL (Phase 8) */}
      {/* -------------------------------------------------------------- */}
      {showTableModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="insert-table-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 id="insert-table-dialog-title" className="font-bold text-stone-900 font-cinzel text-base flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-amber-800" />
                <span>Insert Comparison Table</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Choose Table Template</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setTablePreset('kundali')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      tablePreset === 'kundali'
                        ? 'border-amber-800 bg-amber-50/70 text-amber-950 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-bold">Kundali Koota Matching Table</div>
                    <div className="text-[11px] text-stone-500 font-normal">
                      Includes all 8 Vedic Ashtakoot factors (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTablePreset('gotra')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      tablePreset === 'gotra'
                        ? 'border-amber-800 bg-amber-50/70 text-amber-950 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-bold">Gotra & Ancestral Lineage Table</div>
                    <div className="text-[11px] text-stone-500 font-normal">
                      Rules for Self Gotra, Mother's Gotra (Mosal), and Grandmother's lineage
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTablePreset('blank')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      tablePreset === 'blank'
                        ? 'border-amber-800 bg-amber-50/70 text-amber-950 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-bold">Custom Blank Table</div>
                    <div className="text-[11px] text-stone-500 font-normal">
                      Specify rows and columns for custom comparisons
                    </div>
                  </button>
                </div>
              </div>

              {tablePreset === 'blank' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Columns (1–6)</label>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={tableCols}
                      onChange={(e) => setTableCols(Number(e.target.value))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Rows (1–10)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={tableRows}
                      onChange={(e) => setTableRows(Number(e.target.value))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-stone-200 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowTableModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleInsertTable}
                className="rounded-xl bg-amber-800 hover:bg-amber-900 text-white"
              >
                Insert Table
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 12: Unsaved Changes Confirmation Modal */}
      {showUnsavedConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="unsaved-changes-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 id="unsaved-changes-dialog-title" className="font-bold text-stone-900 font-cinzel text-base">Unsaved Changes</h3>
                <p className="text-xs text-stone-500">
                  You have unsaved edits in this article. What would you like to do before leaving?
                </p>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 text-xs text-stone-600 space-y-1">
              <div className="flex justify-between font-medium">
                <span>Article:</span>
                <span className="text-stone-900 font-semibold truncate max-w-[200px]">{title || 'Untitled Draft'}</span>
              </div>
              <div className="flex justify-between">
                <span>Word Count:</span>
                <span>{wordCount} words</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowUnsavedConfirm(false)}
                className="w-full sm:w-auto rounded-xl order-3 sm:order-1 min-h-[38px]"
              >
                Keep Editing
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowUnsavedConfirm(false);
                  setIsDirty(false);
                  onBack();
                }}
                className="w-full sm:w-auto rounded-xl text-red-700 border-red-200 hover:bg-red-50 order-2 min-h-[38px]"
              >
                Discard & Leave
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={async () => {
                  setShowUnsavedConfirm(false);
                  await handleSave(false);
                  onBack();
                }}
                className="w-full sm:w-auto rounded-xl bg-amber-800 hover:bg-amber-900 text-white order-1 sm:order-3 min-h-[38px]"
              >
                Save Draft & Exit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 16: Discard Autosaved Draft Confirmation Modal */}
      {showDiscardConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="discard-draft-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 id="discard-draft-dialog-title" className="font-bold text-stone-900 font-cinzel text-base">
                  Discard Autosaved Draft?
                </h3>
                <p className="text-xs text-stone-500">
                  This action is destructive and cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/70 leading-relaxed">
              Your previously autosaved work will be permanently removed from this browser. Are you sure you want to discard it?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDiscardConfirm(false)}
                className="w-full sm:w-auto rounded-xl order-2 sm:order-1 min-h-[38px]"
              >
                Keep Draft
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleConfirmDiscardDraft}
                className="w-full sm:w-auto rounded-xl bg-red-600 hover:bg-red-700 text-white border-transparent order-1 sm:order-2 min-h-[38px] font-semibold"
              >
                Yes, Discard Draft
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 16: Remove Featured Image Confirmation Modal */}
      {showRemoveImageConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-image-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 id="remove-image-dialog-title" className="font-bold text-stone-900 font-cinzel text-base">
                  Remove Featured Image?
                </h3>
                <p className="text-xs text-stone-500">
                  Detach the image from this article.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/70 leading-relaxed">
              Are you sure you want to remove the current featured banner? You can always upload a new image or pick a matrimonial preset.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRemoveImageConfirm(false)}
                className="w-full sm:w-auto rounded-xl order-2 sm:order-1 min-h-[38px]"
              >
                Keep Image
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleConfirmRemoveFeaturedImage}
                className="w-full sm:w-auto rounded-xl bg-red-600 hover:bg-red-700 text-white border-transparent order-1 sm:order-2 min-h-[38px] font-semibold"
              >
                Yes, Remove Image
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Phase 11: Public Article Template Preview Modal */}
      {showPreviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Public Article Template Preview"
          className="fixed inset-0 z-50 flex flex-col bg-stone-950/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
        >
          {/* Top Control Bar */}
          <div className="h-14 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 flex items-center justify-between shrink-0 text-white z-10 shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Secure Draft Preview</span>
              </span>
              <span className="text-xs text-stone-400 hidden lg:inline">
                Simulating public article template · Unpublished & safe
              </span>
            </div>

            {/* Viewport Device Switcher */}
            <div className="flex items-center gap-1 bg-stone-800 p-0.5 rounded-xl border border-stone-700">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  previewDevice === 'desktop' ? 'bg-stone-700 text-white font-semibold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Desktop View (Full Width)"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  previewDevice === 'tablet' ? 'bg-stone-700 text-white font-semibold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Tablet View (768px)"
              >
                <Smartphone className="w-3.5 h-3.5 rotate-90" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  previewDevice === 'mobile' ? 'bg-stone-700 text-white font-semibold' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-200 text-xs font-medium cursor-pointer transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Return to Editor</span>
                <span className="sm:hidden">Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleSave(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title="Close Preview (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Preview Canvas reproducing exact BlogPostPage layout */}
          <div className="flex-1 overflow-y-auto bg-stone-900/60 p-2 sm:p-6 md:p-8 flex justify-center">
            <div
              className={`bg-stone-50 min-h-screen transition-all shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 my-2 ${
                previewDevice === 'mobile'
                  ? 'w-[390px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px]'
                  : 'w-full max-w-4xl'
              }`}
            >
              {/* Simulated Public Navigation Bar */}
              <div className="bg-white border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center font-cinzel font-bold text-sm shadow-2xs">
                    BC
                  </div>
                  <span className="font-bold text-stone-900 font-cinzel text-base tracking-tight">
                    BiodataCraft
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                  <span className="hidden sm:inline hover:text-stone-900 cursor-pointer">Templates</span>
                  <span className="hidden sm:inline hover:text-stone-900 cursor-pointer">Samples</span>
                  <span className="text-amber-800 font-semibold cursor-pointer">Blog</span>
                  <span className="px-3 py-1 rounded-xl bg-amber-800 text-white font-medium text-xs">
                    Create Biodata
                  </span>
                </div>
              </div>

              {/* Exact Public Article Template Container */}
              <div className="py-8 sm:py-12 px-4 sm:px-8 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
                {/* Navigation Breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <span className="hover:text-stone-900 cursor-pointer">Blog</span>
                    <span>›</span>
                    <span className="text-stone-800 font-medium truncate max-w-[240px]">
                      {title || 'Article Title Preview'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-800 font-bold text-xs cursor-pointer">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to All Articles</span>
                  </div>
                </div>

                {/* Article Header Card */}
                <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-500">
                    <span className="font-bold text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px]">
                      {category === 'Custom' ? customCategory || 'General' : category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{publishedDate}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{readTime}</span>
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-cinzel leading-tight tracking-tight">
                    {title || 'Article Title Preview'}
                  </h1>

                  <div className="pt-3 flex items-center justify-between border-t border-stone-100 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs shadow-2xs">
                        ✍️
                      </div>
                      <span className="font-semibold text-stone-700">{author}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toast.info('Preview Mode: Share link simulated.')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer transition-colors"
                      title="Share link simulation"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Featured Image */}
                {featuredImage && (
                  <div className="rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs bg-stone-100">
                    <img
                      src={featuredImage}
                      alt={featuredImageAlt || title || 'Featured Article Banner'}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-56 sm:h-80 md:h-96 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {featuredImageAlt && (
                      <div className="p-2.5 text-center text-xs text-stone-500 italic bg-stone-50 border-t border-stone-200/60 font-serif">
                        {featuredImageAlt}
                      </div>
                    )}
                  </div>
                )}

                {/* Article Introduction / Excerpt */}
                {excerpt && (
                  <div className="bg-amber-50/60 border-l-4 border-amber-800 rounded-2xl p-5 sm:p-6 shadow-2xs border border-amber-200/70">
                    <p className="text-base sm:text-lg font-medium text-stone-800 leading-relaxed italic font-serif">
                      {excerpt}
                    </p>
                  </div>
                )}

                {/* Simulated Blog Top Advertisement Placement */}
                <div className="p-4 rounded-2xl border border-dashed border-stone-300 bg-stone-100/70 text-center text-xs text-stone-400">
                  <span className="font-mono text-[10px] tracking-wider uppercase">Advertisement Placeholder (BiodataCraft Services)</span>
                </div>

                {/* Article Body Content */}
                <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs font-sans">
                  {renderPreviewContent()}

                  {/* Simulated In-Article Conversion Callout */}
                  <div className="mt-8 p-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-amber-950 font-cinzel text-base">
                        Ready to format your marriage biodata?
                      </h3>
                      <p className="text-xs text-amber-900 mt-1">
                        Create authentic Indian matrimonial biodatas with religious headers and elegant borders in minutes.
                      </p>
                    </div>
                    <Button size="sm" variant="primary" className="shrink-0 rounded-xl bg-amber-800 text-white pointer-events-none">
                      Create Free Biodata
                    </Button>
                  </div>
                </div>

                {/* Related Articles Preview */}
                <div className="space-y-3 pt-4">
                  <h3 className="text-base font-bold text-stone-900 font-cinzel">
                    More Matrimonial Guides & Articles
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {BLOG_POSTS.slice(0, 2).map((rel) => (
                      <div key={rel.slug} className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                          {rel.category}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 font-cinzel line-clamp-1">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Public Footer */}
                <footer className="pt-8 pb-4 text-center text-xs text-stone-400 border-t border-stone-200/80 space-y-1">
                  <p className="font-cinzel font-semibold text-stone-600">BiodataCraft — Indian Marriage Biodata Maker</p>
                  <p className="text-[11px]">100% Free · No Login Required · Zero-Storage Privacy</p>
                </footer>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* PHASE 13 & 19: PRE-PUBLISH REVIEW MODAL */}
      {/* ============================================================== */}
      <PrePublishReviewModal
        isOpen={showPublishConfirmModal}
        onClose={() => setShowPublishConfirmModal(false)}
        onConfirmPublish={executePublish}
        isPublishing={isSaving}
        title={title}
        slug={slug}
        category={category === 'Custom' ? customCategory || 'General' : category}
        author={author}
        readTime={readTime}
        excerpt={excerpt}
        contentBody={contentBody}
        featuredImage={featuredImage}
        featuredImageAlt={featuredImageAlt}
        seoTitle={seoTitle}
        seoDescription={seoDescription}
        enableTableOfContents={enableTableOfContents}
      />

      {/* ============================================================== */}
      {/* PHASE 3: INTERNAL LINK SEARCH & INSERT MODAL */}
      {/* ============================================================== */}
      <InternalLinkModal
        isOpen={showInternalLinkModal}
        onClose={() => {
          setShowInternalLinkModal(false);
          setInternalLinkInitialQuery('');
          setInternalLinkInitialAnchor('');
        }}
        onInsertLink={handleInsertInternalLink}
        existingPosts={existingPosts}
        initialSearchQuery={internalLinkInitialQuery}
        initialAnchorText={internalLinkInitialAnchor}
      />

      {/* ============================================================== */}
      {/* PHASE 4: ARTICLE STRUCTURE BLUEPRINT ASSISTANT */}
      {/* ============================================================== */}
      <ArticleStructureModal
        isOpen={showStructureModal}
        onClose={() => setShowStructureModal(false)}
        onInsertStructure={handleInsertStructure}
        currentArticleTitle={title}
      />

      {/* ============================================================== */}
      {/* PHASE 8: ARTICLE VERSION HISTORY SNAPSHOTS */}
      {/* ============================================================== */}
      <VersionHistoryModal
        isOpen={showVersionHistoryModal}
        onClose={() => setShowVersionHistoryModal(false)}
        versions={versionSnapshots}
        currentContent={contentBody}
        currentTitle={title}
        onRestoreVersion={handleRestoreVersionSnapshot}
        onCreateManualSnapshot={() => createVersionSnapshot()}
      />

      {/* ============================================================== */}
      {/* PHASE 2: ARTICLE MEDIA MANAGER */}
      {/* ============================================================== */}
      <MediaManagerModal
        isOpen={showMediaManagerModal}
        onClose={() => setShowMediaManagerModal(false)}
        mediaList={sessionMediaList}
        onAddImage={handleAddMediaItem}
        onRemoveImage={handleRemoveMediaItem}
        featuredImageUrl={featuredImage}
        onSetFeaturedImage={(url, alt) => {
          setFeaturedImage(url);
          setFeaturedImageAlt(alt);
          toast.success('Updated featured image & ALT text.');
        }}
        onInsertInlineImage={handleInsertInlineFromMedia}
      />

      {/* ============================================================== */}
      {/* PHASE 13: PUBLISHED SUCCESS NOTIFICATION MODAL */}
      {/* ============================================================== */}
      {publishedSuccessPost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="published-success-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-center">
            {/* Celebration Icon */}
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 id="published-success-dialog-title" className="text-xl sm:text-2xl font-bold text-stone-900 font-cinzel">
                Article Published Live!
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
                Your article is now live on the public BiodataCraft blog directory and accessible to readers worldwide.
              </p>
            </div>

            {/* Live Article URL Card */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 text-left space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Published Article URL
              </span>
              <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                <span className="font-mono text-xs text-amber-900 truncate">
                  {publishedSuccessPost.url}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(publishedSuccessPost.url);
                    setCopiedUrl(true);
                    toast.success('Published article link copied to clipboard!');
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Copy link to clipboard"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons: View Published Article, Dashboard, Create Another */}
            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                size="md"
                variant="primary"
                onClick={() => {
                  window.open(publishedSuccessPost.url, '_blank', 'noopener,noreferrer');
                }}
                leftIcon={<ExternalLink className="w-4 h-4" />}
                className="w-full rounded-xl bg-amber-800 hover:bg-amber-900 text-white min-h-[44px] font-semibold cursor-pointer shadow-2xs"
              >
                View Published Article
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPublishedSuccessPost(null);
                    onSaveSuccess();
                  }}
                  className="w-full rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 min-h-[40px] font-medium cursor-pointer"
                >
                  Blog Dashboard
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPublishedSuccessPost(null);
                    setTitle('');
                    setSlug('');
                    setExcerpt('');
                    setContentBody('');
                    setFeaturedImage('');
                    setFeaturedImageAlt('');
                    setSeoTitle('');
                    setSeoDescription('');
                    setActivePostId(null);
                    setActivePostSlug(null);
                    setIsDirty(false);
                    setLastSavedTime(null);
                  }}
                  className="w-full rounded-xl border-stone-200 text-stone-700 hover:bg-stone-50 min-h-[40px] font-medium cursor-pointer"
                >
                  + New Article
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
