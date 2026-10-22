import { BiodataData, TemplateDefinition } from '../types/biodata';

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'royal-heritage',
    name: 'Royal Heritage',
    tagline: 'Timeless Rajasthani Mandap & Gold Fluting',
    category: 'Royal',
    primaryColor: '#7a1426', // Deep Maroon / Crimson
    secondaryColor: '#c59b27', // Gold
    accentBg: '#fffaf5',
    cardBorder: '#e8c97e',
    description: 'Rich royal maroon with auspicious gold filigree borders, floral crests, and authentic regal typography.',
    popularFor: 'North & West Indian Hindu/Marwari/Rajput families'
  },
  {
    id: 'modern-elegance',
    name: 'Modern Elegance',
    tagline: 'Contemporary Navy, Clean Typography & Geometry',
    category: 'Modern',
    primaryColor: '#102a43', // Royal Deep Navy
    secondaryColor: '#b48c36', // Warm Gold
    accentBg: '#f8fafc',
    cardBorder: '#cbd5e1',
    description: 'Sophisticated corporate and polished aesthetic designed for software engineers, doctors, and working professionals.',
    popularFor: 'Urban professionals, NRI families, Metro weddings'
  },
  {
    id: 'vedic-aura',
    name: 'Vedic Aura',
    tagline: 'Auspicious Saffron, Sandalwood & Traditional Shlokas',
    category: 'Spiritual',
    primaryColor: '#b44a0e', // Auspicious Sandalwood/Deep Amber
    secondaryColor: '#d97706', // Rich Gold
    accentBg: '#fffdf5',
    cardBorder: '#fed7aa',
    description: 'Traditional Vedic aesthetic with sacred mantras, temple pillars, and highlighted astrological / gotra elements.',
    popularFor: 'Brahmin, Vedic, and deeply traditional families'
  },
  {
    id: 'emerald-royalty',
    name: 'Emerald Royalty',
    tagline: 'Regal Dark Emerald, Paisley Motifs & Ivory',
    category: 'Royal',
    primaryColor: '#064e3b', // Deep Forest Emerald
    secondaryColor: '#d4af37', // Antique Gold
    accentBg: '#f6fbf7',
    cardBorder: '#a7f3d0',
    description: 'Luxurious emerald green and champagne gold framing with subtle mughal jaali & floral ornamentation.',
    popularFor: 'Muslim, Jain, and aristocratic pan-Indian ceremonies'
  },
  {
    id: 'blush-serenade',
    name: 'Blush Serenade',
    tagline: 'Soft Rose Gold, Pastel Burgundy & Delicate Florals',
    category: 'Minimalist',
    primaryColor: '#881337', // Rose Wine
    secondaryColor: '#be185d', // Rose Gold
    accentBg: '#fff1f2',
    cardBorder: '#fecdd3',
    description: 'Gentle, modern romantic aesthetic with soft botanical borders, warm card accents, and contemporary spacing.',
    popularFor: 'Bridal biodatas, modern love-cum-arranged marriages'
  },
  {
    id: 'peacock-glory',
    name: 'Peacock Glory',
    tagline: 'Mayura Teal, Royal Gold & Symmetric Crests',
    category: 'Traditional',
    primaryColor: '#0f766e', // Peacock Teal
    secondaryColor: '#eab308', // Royal Gold
    accentBg: '#f0fdfa',
    cardBorder: '#99f6e4',
    description: 'Inspired by the national bird of India, featuring regal peacock hues, intricate borders, and balance.',
    popularFor: 'South Indian, Gujarati, and Maharashtrian weddings'
  }
];

export const HEADER_SYMBOLS = [
  { id: 'ganesh', label: '॥ श्री गणेशाय नमः ॥', shloka: '॥ श्री गणेशाय नमः ॥', iconName: 'Ganesh', religion: 'Hindu' },
  { id: 'radha-krishna', label: '॥ श्री राधा कृष्णाय नमः ॥', shloka: '॥ श्री राधा कृष्णाय नमः ॥', iconName: 'Krishna', religion: 'Hindu' },
  { id: 'om-namah-shivaya', label: '॥ ॐ नमः शिवाय ॥', shloka: '॥ ॐ नमः शिवाय ॥', iconName: 'Shiva', religion: 'Hindu' },
  { id: 'swastik', label: '卐 शुभ विवाह 卐', shloka: '卐 शुभ विवाह 卐', iconName: 'Swastik', religion: 'Hindu' },
  { id: 'om', label: 'ॐ', shloka: '॥ ॐ ॥', iconName: 'Om', religion: 'Spiritual' },
  { id: 'jain', label: '॥ ॐ अर्हं नमः / जय जिनेन्द्र ॥', shloka: '॥ ॐ अर्हं नमः ॥', iconName: 'Jain', religion: 'Jain' },
  { id: 'sikh', label: 'ੴ सतिगुरु प्रसादि', shloka: 'ੴ सतिगुरु प्रसादि', iconName: 'Khanda', religion: 'Sikh' },
  { id: 'bismillah', label: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', shloka: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', iconName: 'Crescent', religion: 'Muslim' },
  { id: 'christian', label: 'God Bless Our Union', shloka: '✝ In God We Trust ✝', iconName: 'Cross', religion: 'Christian' },
  { id: 'secular', label: 'MARRIAGE BIODATA', shloka: 'MARRIAGE BIODATA', iconName: 'Crown', religion: 'Universal' },
  { id: 'none', label: 'None (Clean Header)', shloka: '', iconName: 'Minus', religion: 'Universal' }
];

export const defaultEmptyBiodata: BiodataData = {
  templateId: 'royal-heritage',
  language: 'en',
  headerSymbol: 'ganesh',
  customHeaderTitle: '॥ श्री गणेशाय नमः ॥',
  themeColor: '#7a1426',
  fontFamily: 'cinzel',
  photoFrameStyle: 'arch',
  showWatermark: false,

  fullName: '',
  gender: 'male',
  dob: '',
  age: '',
  timeOfBirth: '',
  placeOfBirth: '',
  height: '',
  weight: '',
  complexion: '',
  bloodGroup: '',
  maritalStatus: 'Never Married',
  motherTongue: 'Hindi',
  dietaryHabits: 'Vegetarian',

  religion: 'Hindu',
  caste: '',
  subCaste: '',
  gotra: '',
  kuldevi: '',
  rashi: '',
  nakshatra: '',
  charan: '',
  manglik: 'Non-Manglik',
  gan: '',
  nadi: '',

  highestEducation: '',
  collegeUniversity: '',
  additionalDegrees: '',
  occupation: '',
  jobTitle: '',
  companyName: '',
  annualIncome: '',
  workLocation: '',

  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  brothersList: [],
  sistersList: [],
  brothersCount: 'None',
  brothersDetails: '',
  sistersCount: 'None',
  sistersDetails: '',
  familyType: 'Nuclear',
  familyValues: 'Moderate',
  familyStatus: 'Upper Middle Class',
  familyLocation: '',
  familyDescription: '',
  nativePlace: '',
  maternalUncleDetails: '',

  contactPerson: '',
  relationWithCandidate: 'Father',
  mobileNumber: '',
  alternateNumber: '',
  whatsappNumber: '',
  email: '',
  residentialAddress: '',
  city: '',
  state: '',
  pincode: '',

  photoConfig: {
    zoom: 1,
    rotate: 0,
    frameStyle: 'arch',
    cropAspect: 'portrait'
  },

  partnerAgeRange: '24 - 28 Years',
  partnerHeightRange: '5\'2" - 5\'7"',
  partnerEducation: 'Graduate / Post Graduate',
  partnerOccupation: 'Working Professional or Homemaker',
  partnerLocation: 'Delhi NCR / North India',
  partnerDiet: 'Vegetarian',
  partnerExpectationsNotes: 'Looking for a cultured, understanding, and family-oriented partner with shared values.',

  customFields: [],
  sectionsVisible: {
    personal: true,
    horoscope: true,
    education: true,
    family: true,
    contact: true,
    preferences: true,
    photo: true
  }
};

export const sampleHinduBiodata: BiodataData = {
  templateId: 'royal-heritage',
  language: 'en',
  headerSymbol: 'ganesh',
  customHeaderTitle: '॥ श्री गणेशाय नमः ॥',
  themeColor: '#7a1426',
  fontFamily: 'cinzel',
  photoFrameStyle: 'arch',
  showWatermark: false,

  photoUrl: '',
  photoConfig: {
    zoom: 1,
    rotate: 0,
    frameStyle: 'arch',
    cropAspect: 'portrait'
  },
  fullName: 'Aarav Devendra Sharma',
  gender: 'male',
  dob: '1996-08-14',
  age: '28 Years',
  timeOfBirth: '07:25 AM',
  placeOfBirth: 'Jaipur, Rajasthan',
  height: "5'11\" (180 cm)",
  weight: '74 kg',
  complexion: 'Fair',
  bloodGroup: 'B+ve',
  maritalStatus: 'Never Married',
  motherTongue: 'Hindi / Rajasthani',
  dietaryHabits: 'Pure Vegetarian',

  religion: 'Hindu',
  caste: 'Brahmin (Gaur)',
  subCaste: 'Sanadhya',
  gotra: 'Bharadwaj',
  kuldevi: 'Shakambhari Mata',
  rashi: 'Karka (Cancer)',
  nakshatra: 'Pushya',
  charan: '3rd Charan',
  manglik: 'Non-Manglik',
  gan: 'Dev Gan',
  nadi: 'Madhya Nadi',

  highestEducation: 'B.Tech in Computer Science',
  collegeUniversity: 'IIT Delhi (Batch of 2018)',
  additionalDegrees: 'Executive MBA (IIM Lucknow)',
  occupation: 'Lead Solutions Architect',
  jobTitle: 'Senior Vice President of Technology',
  companyName: 'Microsoft India R&D',
  annualIncome: '₹ 42,00,000 P.A. + RSUs',
  workLocation: 'Bengaluru / Gurgaon (Hybrid)',

  fatherName: 'Dr. Devendra Kumar Sharma',
  fatherOccupation: 'Chief Medical Officer (Retd. Rajasthan Govt.)',
  motherName: 'Mrs. Sunita Sharma',
  motherOccupation: 'M.Sc, B.Ed (Vice Principal, DPS)',
  brothersList: [
    {
      id: 'b1',
      name: 'Anurag Sharma',
      maritalStatus: 'Unmarried',
      occupation: 'Pursuing MS at TU Munich, Germany',
      relationType: 'Younger'
    }
  ],
  sistersList: [],
  brothersCount: '1 Younger Brother',
  brothersDetails: 'Anurag Sharma - Pursuing MS at TU Munich, Germany',
  sistersCount: 'None',
  sistersDetails: '',
  familyType: 'Nuclear with strong joint family roots',
  familyValues: 'Moderate & Traditional',
  familyStatus: 'Affluent / Respected Family',
  familyLocation: 'Vaishali Nagar, Jaipur',
  familyDescription: 'Cultured family of civil servants and educators based in Jaipur.',
  nativePlace: 'Jaipur, Rajasthan',
  maternalUncleDetails: 'Mishra Parivar (Gotra: Vashistha), Senior Advocate, High Court, Jodhpur',

  contactPerson: 'Dr. Devendra Sharma (Father)',
  relationWithCandidate: 'Father',
  mobileNumber: '+91 98290 12345',
  alternateNumber: '+91 94140 67890',
  whatsappNumber: '+91 98290 12345',
  email: 'sharma.devendra.jp@gmail.com',
  residentialAddress: 'B-14, Surya Enclave, Vaishali Nagar',
  city: 'Jaipur',
  state: 'Rajasthan',
  pincode: '302021',

  partnerAgeRange: '24 - 28 Years',
  partnerHeightRange: '5\'3" - 5\'8"',
  partnerEducation: 'Engineer / Doctor / CA / MBA or similar graduate',
  partnerOccupation: 'Working professional or pursuing career',
  partnerLocation: 'Delhi NCR, Rajasthan, Bengaluru or open to relocate',
  partnerDiet: 'Vegetarian',
  partnerExpectationsNotes: 'Seeking a well-educated, warm-hearted companion who appreciates cultural traditions alongside modern ambitions.',

  customFields: [
    {
      id: 'c1',
      name: 'Passport / Travel',
      label: 'Passport / Travel',
      value: 'Valid Indian Passport, traveled to US & Europe'
    },
    {
      id: 'c2',
      name: 'Interests & Hobbies',
      label: 'Interests & Hobbies',
      value: 'Classical Indian flute, trekking, reading historical fiction'
    }
  ],
  sectionsVisible: {
    personal: true,
    horoscope: true,
    education: true,
    family: true,
    contact: true,
    preferences: true,
    photo: true
  }
};

export const sampleHindiBiodata: BiodataData = {
  templateId: 'vedic-aura',
  language: 'hi',
  headerSymbol: 'ganesh',
  customHeaderTitle: '॥ ॐ श्री गणेशाय नमः ॥',
  themeColor: '#b44a0e',
  fontFamily: 'rozha',
  photoFrameStyle: 'oval',
  showWatermark: false,

  photoUrl: '',
  photoConfig: {
    zoom: 1,
    rotate: 0,
    frameStyle: 'oval',
    cropAspect: 'portrait'
  },
  fullName: 'प्रिया राजेन्द्र अग्रवाल',
  gender: 'female',
  dob: '1998-11-20',
  age: '26 वर्ष',
  timeOfBirth: '09:15 प्रात:',
  placeOfBirth: 'इंदौर, मध्य प्रदेश',
  height: "5'4\" (162 सेमी)",
  weight: '55 किग्रा',
  complexion: 'गोरा (Fair)',
  bloodGroup: 'O+ धनात्मक',
  maritalStatus: 'अविवाहित (Never Married)',
  motherTongue: 'हिंदी',
  dietaryHabits: 'शुद्ध शाकाहारी',

  religion: 'हिन्दू (वैष्णव)',
  caste: 'अग्रवाल',
  subCaste: 'गोयल',
  gotra: 'गोयल',
  kuldevi: 'माँ महालक्ष्मी',
  rashi: 'वृश्चिक (Scorpio)',
  nakshatra: 'अनुराधा',
  charan: 'द्वितीय चरण',
  manglik: 'अमांगलिक (Non-Manglik)',
  gan: 'देव गण',
  nadi: 'मध्य नाड़ी',

  highestEducation: 'चार्टर्ड अकाउंटेंट (CA) + B.Com (Hons.)',
  collegeUniversity: 'द इंस्टीट्यूट ऑफ चार्टर्ड एकाउंटेंट्स ऑफ इंडिया (ICAI)',
  additionalDegrees: 'CFA Level 2 Qualified',
  occupation: 'सीनियर फाइनेंशियल एनालिस्ट',
  jobTitle: 'सीनियर मैनेजर - ऑडिट एवं टैक्सेशन',
  companyName: 'डेलॉइट इंडिया (Deloitte)',
  annualIncome: '₹ 22,00,000 प्रति वर्ष',
  workLocation: 'मुंबई / इंदौर',

  fatherName: 'श्री राजेन्द्र प्रसाद अग्रवाल',
  fatherOccupation: 'कपड़ा उद्योग व्यवसायी (अग्रवाल टेक्सटाइल्स, इंदौर)',
  motherName: 'श्रीमती अनीता अग्रवाल',
  motherOccupation: 'गृहणी (B.A. साहित्य)',
  brothersList: [
    {
      id: 'hb1',
      name: 'रोहन अग्रवाल',
      maritalStatus: 'Unmarried',
      occupation: 'CA Final की तैयारी में संलग्न',
      relationType: 'Younger'
    }
  ],
  sistersList: [
    {
      id: 'hs1',
      name: 'नेहा अग्रवाल',
      maritalStatus: 'Married',
      occupation: 'जीजाजी: सॉफ्टवेयर आर्किटेक्ट, सिंगापुर',
      relationType: 'Elder'
    }
  ],
  brothersCount: '1 छोटा भाई',
  brothersDetails: 'रोहन अग्रवाल (CA Final की तैयारी में संलग्न)',
  sistersCount: '1 बड़ी बहन',
  sistersDetails: 'विवाहित (जीजाजी: सॉफ्टवेयर आर्किटेक्ट, सिंगापुर)',
  familyType: 'संयुक्त परिवार (Joint Family)',
  familyValues: 'धार्मिक एवं सुसंस्कृत',
  familyStatus: 'उच्च मध्यमवर्गीय एवं सम्मानित',
  familyLocation: 'साकेत नगर, इंदौर',
  familyDescription: 'प्रतिष्ठित एवं सुसंस्कृत कपड़ा उद्योग परिवार।',
  nativePlace: 'इंदौर, मध्य प्रदेश',
  maternalUncleDetails: 'मित्तल परिवार, भोपाल (उद्योगपति)',

  contactPerson: 'श्री राजेन्द्र अग्रवाल (पिताजी)',
  relationWithCandidate: 'पिताजी',
  mobileNumber: '+91 98260 54321',
  alternateNumber: '+91 94250 11223',
  whatsappNumber: '+91 98260 54321',
  email: 'rajendra.indore.textiles@gmail.com',
  residentialAddress: '42, साकेत नगर, ओल्ड पलासिया',
  city: 'इंदौर',
  state: 'मध्य प्रदेश',
  pincode: '452001',

  partnerAgeRange: '26 - 30 वर्ष',
  partnerHeightRange: '5\'8" से 6\'0"',
  partnerEducation: 'CA / MBA / Engineer / Doctor / उच्च शिक्षित',
  partnerOccupation: 'व्यवसाय अथवा प्रतिष्ठित सेवा में',
  partnerLocation: 'इंदौर, भोपाल, मुंबई, दिल्ली NCR अथवा मेट्रो शहर',
  partnerDiet: 'शुद्ध शाकाहारी (मद्यपान रहित)',
  partnerExpectationsNotes: 'संस्कारवान, परिवार का सम्मान करने वाले एवं प्रगतिशील सोच वाले सुयोग्य वर की अभिलाषा।',

  customFields: [
    {
      id: 'h1',
      name: 'विशेष रुचि',
      label: 'विशेष रुचि',
      value: 'भारतीय शास्त्रीय गायन (विशारद), पेंटिंग एवं योग'
    }
  ],
  sectionsVisible: {
    personal: true,
    horoscope: true,
    education: true,
    family: true,
    contact: true,
    preferences: true,
    photo: true
  }
};
