export type ReligionType = 'Hindu' | 'Muslim' | 'Jain' | 'Sikh' | 'Christian' | 'Universal';
export type RegionType = 'North India' | 'South India' | 'West India' | 'East India' | 'Central India' | 'NRI / Global';
export type LanguageFilterType = 'English' | 'Hindi' | 'Bilingual' | 'Any';
export type GenderFilterType = 'Groom' | 'Bride' | 'Unisex';
export type StyleType = 'Royal' | 'Vedic' | 'Contemporary' | 'Floral' | 'Minimalist' | 'Classic' | 'Traditional';

export interface TemplateConfig {
  primaryColor: string;
  secondaryColor: string;
  accentBg: string;
  cardBorder: string;
  fontFamily: 'cinzel' | 'playfair' | 'rozha' | 'sans';
  borderStyle: 'ornate' | 'double' | 'floral' | 'mandap' | 'clean' | 'classic';
  cornerStyle: 'fluted' | 'sharp' | 'rounded' | 'arch';
  headerStyle: 'traditional' | 'modern' | 'minimal' | 'royal';
  defaultSymbol: string;
  defaultHeaderTitle: string;
  photoFrameStyle: 'arch' | 'oval' | 'rounded' | 'classic';
  columns: 1 | 2;
  watermarkOpacity?: number;
}

export interface TemplateCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName?: string;
  sortOrder: number;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string; // e.g., 'traditional', 'modern', 'minimal', 'premium', 'hindu', 'muslim', 'regional', 'professional'
  categoryName?: string;
  religion: ReligionType;
  region: RegionType;
  language: LanguageFilterType;
  gender: GenderFilterType;
  style: StyleType;
  thumbnail: string;
  previewImage: string;
  templateConfig: TemplateConfig;
  isFree: boolean;
  isPremium: boolean;
  isPublished: boolean;
  sortOrder: number;
  popularFor: string;
  tagline: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilterParams {
  search?: string;
  categoryId?: string;
  religion?: string;
  region?: string;
  language?: string;
  tier?: 'all' | 'free' | 'premium';
  status?: 'all' | 'published' | 'draft';
  includeUnpublished?: boolean;
  sortBy?: 'popular' | 'newest' | 'name' | 'sortOrder';
  forceRefresh?: boolean;
}
