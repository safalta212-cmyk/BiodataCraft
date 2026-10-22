export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  readTime: string;
  author: string;
  content: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-01',
    slug: 'how-to-write-indian-marriage-biodata',
    title: 'How to Write a Perfect Marriage Biodata: Complete Guide for Indian Weddings',
    excerpt:
      'Learn what details to include, how to present education and packages respectfully, and how to format family details for Indian matrimonial proposals.',
    category: 'Guides',
    publishedDate: 'October 2026',
    readTime: '6 min read',
    author: 'Editorial Team',
    featuredImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    seoTitle: 'How to Write an Indian Marriage Biodata: 2026 Complete Guide',
    seoDescription: 'Expert tips on writing a dignified Indian matrimonial biodata, including Kundali, family background, and photo guidelines.',
    isPublished: true,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
    content: [
      'In Indian arranged and semi-arranged marriages, a biodata is far more than a corporate resume: it is a dignified first introduction of the candidate and their family lineage.',
      'A distinguished marriage biodata balances personal accomplishments, astrological information, and family background with clarity and respect.',
      'Key sections to include: Personal Details (Height, DOB, Birth Time, Complexion), Astrological data (Gotra, Rashi, Nakshatra, Manglik status), Educational degrees, Profession & Employer, and Family background including Father, Mother, Siblings, and Maternal Uncle (Mosal).',
      'Always use a clear, high-resolution portrait photograph and ensure typography is legible when printed or viewed on mobile messaging applications like WhatsApp.'
    ]
  },
  {
    id: 'post-02',
    slug: 'importance-of-gotra-and-kundali-in-biodata',
    title: 'Understanding Gotra, Mosal, and Kundali Details in Marriage Biodatas',
    excerpt:
      'Why ancestral lineage and maternal uncle gotra matter in North and West Indian matrimonial traditions, and how to represent them accurately.',
    category: 'Culture & Tradition',
    publishedDate: 'September 2026',
    readTime: '5 min read',
    author: 'Cultural Heritage Desk',
    featuredImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&q=80&w=800',
    seoTitle: 'Gotra, Mosal & Kundali in Marriage Biodata Explained | BiodataCraft',
    seoDescription: 'Complete cultural guide to Gotra rules, Maternal Uncle (Mosal) significance, and Kundali horoscope matching for Indian marriages.',
    isPublished: true,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-15T10:00:00Z',
    content: [
      'The Indian matrimonial tradition places great emphasis on ancestral gotra to prevent consanguinity and respect ancestral lineages.',
      'Many communities, including Marwari, Rajput, Agarwal, and Brahmin families, check not only the candidate’s self-gotra (father’s gotra), but also the mother’s gotra and maternal grandmother’s gotra.',
      'The Maternal Uncle (मामा का परिवार एवं गोत्र / Mosal) field is customary because it provides insight into the family’s roots on the maternal side.',
      'BiodataCraft includes dedicated fields for Gotra, Mosal, Rashi, and Manglik status, ensuring your document satisfies family elders while looking modern.'
    ]
  },
  {
    id: 'post-03',
    slug: 'top-marriage-biodata-mistakes-to-avoid',
    title: '7 Common Marriage Biodata Mistakes Indian Families Make (And How to Fix Them)',
    excerpt:
      'From low-resolution photos and spelling errors to cluttered formatting, avoid these common pitfalls when creating your marriage proposal document.',
    category: 'Tips & Etiquette',
    publishedDate: 'August 2026',
    readTime: '4 min read',
    author: 'Matrimonial Consultants',
    featuredImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    seoTitle: '7 Common Marriage Biodata Mistakes to Avoid | Indian Matrimony Tips',
    seoDescription: 'Avoid these critical mistakes in your marriage biodata: poor photos, incorrect astrological data, and cluttered formatting.',
    isPublished: true,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
    content: [
      'Mistake 1: Uploading a cropped group photo or casual selfie. Always use a well-lit, dignified portrait with a pleasant smile.',
      'Mistake 2: Missing birth time or place. For families consulting astrologers for horoscope matching, accurate birth time and coordinates are essential.',
      'Mistake 3: Overly demanding expectations. Keep partner preferences warm, positive, and values-oriented rather than overly restrictive.',
      'Mistake 4: Disorganized formatting. Using a structured template with clear section dividers creates an instant impression of elegance and family care.'
    ]
  }
];
