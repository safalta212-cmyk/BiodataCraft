/**
 * Comprehensive Validation Utilities for Indian Marriage Biodata
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi NCR',
  'Jammu and Kashmir',
  'Chandigarh',
  'Overseas / NRI'
];

export const RASHI_OPTIONS = [
  'Mesh (Aries) - मेष',
  'Vrishabh (Taurus) - वृषभ',
  'Mithun (Gemini) - मिथुन',
  'Kark (Cancer) - कर्क',
  'Simha (Leo) - सिंह',
  'Kanya (Virgo) - कन्या',
  'Tula (Libra) - तुला',
  'Vrishchik (Scorpio) - वृश्चिक',
  'Dhanu (Sagittarius) - धनु',
  'Makar (Capricorn) - मकर',
  'Kumbh (Aquarius) - कुंभ',
  'Meen (Pisces) - मीन'
];

export const NAKSHATRA_OPTIONS = [
  'Ashwini - अश्विनी',
  'Bharani - भरणी',
  'Krittika - कृत्तिका',
  'Rohini - रोहिणी',
  'Mrigashira - मृगशिरा',
  'Ardra - आर्द्रा',
  'Punarvasu - पुनर्वसु',
  'Pushya - पुष्य',
  'Ashlesha - आश्लेषा',
  'Magha - मघा',
  'Purva Phalguni - पूर्वा फाल्गुनी',
  'Uttara Phalguni - उत्तरा फाल्गुनी',
  'Hasta - हस्त',
  'Chitra - चित्रा',
  'Swati - स्वाति',
  'Vishakha - विशाखा',
  'Anuradha - अनुराधा',
  'Jyeshtha - ज्येष्ठा',
  'Mula - मूल',
  'Purva Ashadha - पूर्वाषाढ़ा',
  'Uttara Ashadha - उत्तराषाढ़ा',
  'Shravana - श्रवण',
  'Dhanishta - धनिष्ठा',
  'Shatabhisha - शतभिषा',
  'Purva Bhadrapada - पूर्व भाद्रपद',
  'Uttara Bhadrapada - उत्तर भाद्रपद',
  'Revati - रेवती'
];

export const HEIGHT_OPTIONS = [
  "4'10\" (147 cm)",
  "4'11\" (150 cm)",
  "5'0\" (152 cm)",
  "5'1\" (155 cm)",
  "5'2\" (157 cm)",
  "5'3\" (160 cm)",
  "5'4\" (162 cm)",
  "5'5\" (165 cm)",
  "5'6\" (168 cm)",
  "5'7\" (170 cm)",
  "5'8\" (173 cm)",
  "5'9\" (175 cm)",
  "5'10\" (178 cm)",
  "5'11\" (180 cm)",
  "6'0\" (183 cm)",
  "6'1\" (185 cm)",
  "6'2\" (188 cm)",
  "6'3\" (190 cm)",
  "6'4\" (193 cm)"
];

export const validationUtils = {
  // Required string check
  isRequired: (value?: string): boolean => {
    return Boolean(value && value.trim().length > 0);
  },

  // Indian Mobile Number Validation (10 digits starting with 6, 7, 8, 9, optional +91 prefix)
  isValidIndianMobile: (phone?: string): boolean => {
    if (!phone) return false;
    const clean = phone.replace(/[\s\-\(\)\+]/g, '');
    // If it starts with 91 and has 12 digits, strip 91
    const stripped = clean.length === 12 && clean.startsWith('91') ? clean.slice(2) : clean;
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(stripped);
  },

  // Email Validation (RFC 5322 simplified standard)
  isValidEmail: (email?: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  // Indian Pincode Validation (6 digits, cannot start with 0)
  isValidIndianPincode: (pin?: string): boolean => {
    if (!pin) return false;
    const clean = pin.trim().replace(/\s/g, '');
    const pinRegex = /^[1-9][0-9]{5}$/;
    return pinRegex.test(clean);
  },

  // Date of birth validation & age calculation
  calculateAge: (dobString?: string): { ageYears: number; formatted: string } | null => {
    if (!dobString) return null;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 0 || age > 120) {
      return null;
    }

    return { ageYears: age, formatted: `${age} Years` };
  },

  // Validate DOB
  validateDob: (dobString?: string): { valid: boolean; error?: string } => {
    if (!dobString) {
      return { valid: false, error: 'Date of birth is required' };
    }
    const d = new Date(dobString);
    if (isNaN(d.getTime())) {
      return { valid: false, error: 'Please enter a valid calendar date' };
    }
    const today = new Date();
    if (d > today) {
      return { valid: false, error: 'Date of birth cannot be in the future' };
    }
    const ageInfo = validationUtils.calculateAge(dobString);
    if (ageInfo && ageInfo.ageYears < 18) {
      return { valid: false, error: 'Candidate must be at least 18 years of age' };
    }
    return { valid: true };
  },

  // Validate image file
  validateImageFile: (file: File, maxSizeBytes: number = 5 * 1024 * 1024): { valid: boolean; error?: string } => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: 'Invalid file format. Please upload a JPG, PNG, or WEBP image.'
      };
    }

    if (file.size > maxSizeBytes) {
      const mb = Math.round(maxSizeBytes / (1024 * 1024));
      return {
        valid: false,
        error: `Image size exceeds the ${mb}MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller photo.`
      };
    }

    return { valid: true };
  }
};
