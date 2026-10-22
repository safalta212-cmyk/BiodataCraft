export interface CustomField {
  id: string;
  name: string; // User requested: "Field name:"
  value: string; // User requested: "Value:"
  section?: 'personal' | 'horoscope' | 'education' | 'family' | 'contact' | 'preferences' | 'custom';
  label?: string; // Backward compatibility
}

export type TemplateId =
  | 'royal-heritage'
  | 'modern-elegance'
  | 'vedic-aura'
  | 'emerald-royalty'
  | 'blush-serenade'
  | 'peacock-glory'
  | 'executive-ivory'
  | 'anand-karaj';

export type PhotoFrameStyle = 'arch' | 'oval' | 'rounded' | 'classic';

export interface SiblingEntry {
  id: string;
  name: string;
  maritalStatus: 'Unmarried' | 'Married' | 'Engaged' | 'Not Disclosed' | string;
  occupation: string;
  relationType?: 'Elder' | 'Younger' | string;
}

export interface PhotoConfig {
  zoom: number; // 0.5 to 2.0
  rotate: number; // 0, 90, 180, 270 degrees
  frameStyle: PhotoFrameStyle;
  cropAspect: 'square' | 'portrait' | 'classic' | 'free';
}

export interface BiodataData {
  // Metadata & Design Customization
  templateId: TemplateId | string;
  language: 'en' | 'hi' | 'bilingual';
  headerSymbol: string;
  customHeaderTitle: string;
  themeColor: string;
  fontFamily: 'cinzel' | 'playfair' | 'rozha' | 'sans';
  photoFrameStyle: PhotoFrameStyle;
  showWatermark: boolean;

  // STEP 1 — Personal Information
  fullName: string;
  gender: 'male' | 'female' | 'other' | string;
  dob: string;
  age: string;
  timeOfBirth: string;
  placeOfBirth: string;
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  rashi: string;
  nakshatra: string;
  manglik: string;
  height: string;
  weight: string;
  complexion: string;
  highestEducation: string; // Education
  occupation: string;
  companyName: string; // Company / Organization
  annualIncome: string; // Income
  workLocation: string;

  // Additional Astrological & Personal Details
  bloodGroup?: string;
  maritalStatus?: string;
  motherTongue?: string;
  dietaryHabits?: string;
  charan?: string;
  gan?: string;
  nadi?: string;
  kuldevi?: string;
  collegeUniversity?: string;
  additionalDegrees?: string;
  jobTitle?: string;

  // STEP 2 — Family Information
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothersList: SiblingEntry[];
  sistersList: SiblingEntry[];
  familyType: string;
  familyStatus: string;
  familyLocation: string;
  familyDescription: string;

  // Backward compatibility fields for templates
  brothersCount?: string;
  brothersDetails?: string;
  sistersCount?: string;
  sistersDetails?: string;
  nativePlace?: string;
  familyValues?: string;
  maternalUncleDetails?: string;

  // STEP 3 — Contact Information
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  residentialAddress: string; // Address
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  relationWithCandidate?: string;
  alternateNumber?: string;

  // STEP 4 — Photo Details (Client-Side Only)
  photoUrl?: string;
  photoConfig: PhotoConfig;

  // STEP 5 — Custom Fields
  customFields: CustomField[];

  // Partner Preferences (Optional)
  partnerAgeRange?: string;
  partnerHeightRange?: string;
  partnerEducation?: string;
  partnerOccupation?: string;
  partnerLocation?: string;
  partnerDiet?: string;
  partnerExpectationsNotes?: string;

  // Section visibility toggles
  sectionsVisible: {
    personal: boolean;
    horoscope: boolean;
    education: boolean;
    family: boolean;
    contact: boolean;
    preferences: boolean;
    photo: boolean;
  };
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  tagline: string;
  category: 'Traditional' | 'Modern' | 'Royal' | 'Spiritual' | 'Minimalist' | string;
  primaryColor: string;
  secondaryColor: string;
  accentBg: string;
  cardBorder: string;
  description: string;
  popularFor: string;
}

export type {
  AnonymousAnalyticsEvent,
  AnalyticsEventType,
  DeviceCategory,
  BrowserCategory,
  TrafficSourceCategory,
  AggregateStats
} from './analytics';
