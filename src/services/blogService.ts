import { BlogPost, BLOG_POSTS } from '../data/blogData';

const BLOG_STORAGE_KEY = 'biodatacraft_admin_blog_posts_v1';

function verifyAdminAuthorization(): void {
  if (typeof window === 'undefined') return;
  const isAuthed = Boolean(
    sessionStorage.getItem('biodatacraft_admin_token') ||
    sessionStorage.getItem('biodatacraft_admin_session_token') ||
    sessionStorage.getItem('biodatacraft_admin_auth_user')
  );
  if (!isAuthed) {
    throw new Error('Unauthorized: Administrator clearance required to modify blog publications.');
  }
}

class BlogService {
  private posts: BlogPost[] = [];

  constructor() {
    this.loadPosts();
  }

  private loadPosts(): void {
    try {
      const stored = localStorage.getItem(BLOG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.posts = parsed;
          return;
        }
      }
    } catch {
      // Ignore
    }
    this.posts = [...BLOG_POSTS];
  }

  private savePosts(): void {
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(this.posts));
    } catch {
      // Ignore
    }
  }

  /**
   * Retrieves posts with optional category, search, and unpublished inclusion filters
   */
  public getPosts(options?: {
    includeUnpublished?: boolean;
    category?: string;
    search?: string;
  }): BlogPost[] {
    let result = [...this.posts];

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

  /**
   * Retrieves single post by slug
   */
  public getPostBySlug(slug: string, includeUnpublished = false): BlogPost | null {
    const post = this.posts.find((p) => p.slug === slug);
    if (!post) return null;
    if (!includeUnpublished && post.isPublished === false) return null;
    return post;
  }

  /**
   * Cleans text from malicious script tags or dangerous schemes
   */
  private sanitizeContent(text: string): string {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  /**
   * Creates a new blog article
   */
  public createPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
    verifyAdminAuthorization();
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

    const now = new Date().toISOString();
    const id = `post-${Date.now()}`;
    const newPost: BlogPost = {
      ...data,
      id,
      slug: cleanSlug,
      title: this.sanitizeContent(data.title.trim()),
      excerpt: this.sanitizeContent(data.excerpt.trim()),
      content: sanitizedContent,
      createdAt: now,
      updatedAt: now
    };

    this.posts = [newPost, ...this.posts];
    this.savePosts();
    return newPost;
  }

  /**
   * Updates existing blog article
   */
  public updatePost(slugOrId: string, updates: Partial<BlogPost>): boolean {
    verifyAdminAuthorization();
    const idx = this.posts.findIndex((p) => p.slug === slugOrId || p.id === slugOrId);
    if (idx === -1) return false;

    if (updates.slug) {
      const cleanSlug = updates.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const duplicate = this.posts.find((p) => p.slug === cleanSlug && p.id !== this.posts[idx].id);
      if (duplicate) {
        throw new Error(`An article with slug "${cleanSlug}" already exists.`);
      }
      updates.slug = cleanSlug;
    }

    if (updates.content) {
      if (updates.content.length === 0 || updates.content.every((c) => !c.trim())) {
        throw new Error('Article content cannot be empty.');
      }
      updates.content = updates.content
        .map((c) => this.sanitizeContent(c))
        .filter((c) => c.trim().length > 0);
    }

    this.posts[idx] = {
      ...this.posts[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.savePosts();
    return true;
  }

  /**
   * Toggles publication status
   */
  public togglePublish(slugOrId: string): boolean {
    verifyAdminAuthorization();
    const post = this.posts.find((p) => p.slug === slugOrId || p.id === slugOrId);
    if (!post) return false;
    post.isPublished = !post.isPublished;
    post.updatedAt = new Date().toISOString();
    this.savePosts();
    return true;
  }

  /**
   * Permanently deletes blog article
   */
  public deletePost(slugOrId: string): boolean {
    verifyAdminAuthorization();
    const initialLen = this.posts.length;
    this.posts = this.posts.filter((p) => p.slug !== slugOrId && p.id !== slugOrId);
    if (this.posts.length !== initialLen) {
      this.savePosts();
      return true;
    }
    return false;
  }

  /**
   * Retrieves all unique category names
   */
  public getCategories(): string[] {
    const set = new Set<string>();
    this.posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }
}

export const blogService = new BlogService();
