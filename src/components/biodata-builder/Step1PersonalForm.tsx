import React, { useEffect } from 'react';
import { BiodataData } from '../../types/biodata';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Ruler,
  Compass,
  GraduationCap,
  Briefcase,
  Building2,
  IndianRupee,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import {
  validationUtils,
  HEIGHT_OPTIONS,
  RASHI_OPTIONS,
  NAKSHATRA_OPTIONS
} from '../../utils/validation';

interface Step1PersonalFormProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
  errors?: Record<string, string>;
}

const COMPLEXION_OPTIONS = [
  'Very Fair (अत्यधिक गोरा)',
  'Fair (गोरा)',
  'Wheatish (गेहुंआ)',
  'Wheatish Medium (मध्यम गेहुंआ)',
  'Dusky (सांवला)'
];

const RELIGION_OPTIONS = [
  'Hindu',
  'Jain',
  'Sikh',
  'Muslim',
  'Christian',
  'Buddhist',
  'Parsi',
  'Other'
];

const MANGLIK_OPTIONS = [
  'Non-Manglik (अमांगलिक)',
  'Manglik (मांगलिक)',
  'Anshik Manglik / Partial (आंशिक मांगलिक)',
  'Don\'t Know (ज्ञात नहीं)'
];

export const Step1PersonalForm: React.FC<Step1PersonalFormProps> = ({
  data,
  onChange,
  language,
  errors = {}
}) => {
  const isHindi = language === 'hi';

  // Automatically update age when DOB changes if age is empty or was previously auto-calculated
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDob = e.target.value;
    const ageCalc = validationUtils.calculateAge(newDob);
    onChange({
      dob: newDob,
      age: ageCalc ? `${ageCalc.ageYears}` : data.age
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Basic Identity Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-800 shrink-0" />
              <span>{isHindi ? 'प्राथमिक पहचान (Basic Identity)' : 'Basic Personal Information'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi ? 'उम्मीदवार का नाम, जन्म समय, स्थान एवं लिंग' : 'Full legal name, gender, birth details and location'}
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md self-start sm:self-auto shrink-0">
            * {isHindi ? 'अनिवार्य विवरण' : 'Required fields'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'उम्मीदवार का पूरा नाम (Full Name) *' : 'Full Name *'}
            </label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder={isHindi ? 'उदा. राहुल शर्मा' : 'e.g. Aarav Devendra Sharma'}
              className={`w-full text-sm font-semibold border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'लिंग (Gender) *' : 'Gender *'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChange({ gender: g })}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                    data.gender === g
                      ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {g === 'male'
                    ? isHindi
                      ? 'वर (Groom / Male)'
                      : 'Male (Groom)'
                    : isHindi
                    ? 'वधू (Bride / Female)'
                    : 'Female (Bride)'}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'जन्म तिथि (Date of Birth) *' : 'Date of Birth *'}</span>
            </label>
            <input
              type="date"
              value={data.dob}
              onChange={handleDobChange}
              className={`w-full text-sm font-semibold border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.dob
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.dob && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.dob}</span>
              </p>
            )}
          </div>

          {/* Age (Auto-calculated, customizable) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'आयु (Age in Years)' : 'Age (Years)'}
            </label>
            <input
              type="text"
              value={data.age}
              onChange={(e) => onChange({ age: e.target.value })}
              placeholder={isHindi ? 'उदा. 27' : 'e.g. 27'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
            <span className="text-[10px] text-stone-500 mt-0.5 block">
              {isHindi ? 'जन्म तिथि से स्वतः गणना की जाती है' : 'Auto-computed from Date of Birth'}
            </span>
          </div>

          {/* Time of Birth */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'जन्म समय (Time of Birth)' : 'Time of Birth'}</span>
            </label>
            <input
              type="text"
              value={data.timeOfBirth}
              onChange={(e) => onChange({ timeOfBirth: e.target.value })}
              placeholder={isHindi ? 'उदा. 06:45 AM / प्रातः 06:45' : 'e.g. 06:45 AM / 14:30 PM'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Place of Birth */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'जन्म स्थान (Place of Birth)' : 'Place of Birth'}</span>
            </label>
            <input
              type="text"
              value={data.placeOfBirth}
              onChange={(e) => onChange({ placeOfBirth: e.target.value })}
              placeholder={isHindi ? 'उदा. जयपुर, राजस्थान' : 'e.g. Jaipur, Rajasthan'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Astrological & Religious Information */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-800" />
            <span>{isHindi ? 'धर्म एवं ज्योतिष (Religion & Astrology)' : 'Religion & Horoscope Details'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi ? 'धर्म, जाति, उप-जाति, गोत्र, राशि, नक्षत्र एवं मांगलिक स्थिति' : 'Religion, Caste, Gotra, Rashi, Nakshatra, and Manglik status'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Religion */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'धर्म (Religion)' : 'Religion'}
            </label>
            <select
              value={data.religion}
              onChange={(e) => onChange({ religion: e.target.value })}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            >
              {RELIGION_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Caste */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'जाति (Caste)' : 'Caste'}
            </label>
            <input
              type="text"
              value={data.caste}
              onChange={(e) => onChange({ caste: e.target.value })}
              placeholder={isHindi ? 'उदा. ब्राह्मण, राजपूत, माहेश्वरी, जाट, खत्री' : 'e.g. Brahmin, Agarwal, Rajput, Khatri, Kayastha'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Sub Caste */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'उप-जाति (Sub Caste)' : 'Sub Caste'}
            </label>
            <input
              type="text"
              value={data.subCaste}
              onChange={(e) => onChange({ subCaste: e.target.value })}
              placeholder={isHindi ? 'उदा. गौड़ / सनाढ्य / बंसल' : 'e.g. Gaur / Khandelwal / Bansal'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Gotra */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'गोत्र (Gotra)' : 'Gotra'}
            </label>
            <input
              type="text"
              value={data.gotra}
              onChange={(e) => onChange({ gotra: e.target.value })}
              placeholder={isHindi ? 'उदा. भारद्वाज, कश्यप, वत्स' : 'e.g. Kashyap, Bharadwaj, Vatsa'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Rashi */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'राशि (Rashi / Moon Sign)' : 'Rashi (Moon Sign)'}
            </label>
            <select
              value={data.rashi}
              onChange={(e) => onChange({ rashi: e.target.value })}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            >
              <option value="">{isHindi ? '-- राशि चुनें --' : '-- Select Rashi --'}</option>
              {RASHI_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Nakshatra */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'नक्षत्र (Nakshatra)' : 'Nakshatra'}
            </label>
            <select
              value={data.nakshatra}
              onChange={(e) => onChange({ nakshatra: e.target.value })}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            >
              <option value="">{isHindi ? '-- नक्षत्र चुनें --' : '-- Select Nakshatra --'}</option>
              {NAKSHATRA_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Manglik */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'मांगलिक दोष (Manglik Status)' : 'Manglik Status'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MANGLIK_OPTIONS.map((m) => {
                const simpleVal = m.split(' ')[0];
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ manglik: m })}
                    className={`p-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      data.manglik === m
                        ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Physical Attributes Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-800" />
            <span>{isHindi ? 'शारीरिक विवरण (Physical Attributes)' : 'Physical Appearance'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi ? 'ऊंचाई, वजन एवं रंग-रूप' : 'Height, weight, and complexion'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Height */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'ऊंचाई (Height)' : 'Height'}
            </label>
            <select
              value={data.height}
              onChange={(e) => onChange({ height: e.target.value })}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            >
              <option value="">{isHindi ? '-- ऊंचाई चुनें --' : '-- Select Height --'}</option>
              {HEIGHT_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'वजन (Weight)' : 'Weight'}
            </label>
            <input
              type="text"
              value={data.weight}
              onChange={(e) => onChange({ weight: e.target.value })}
              placeholder={isHindi ? 'उदा. 68 kg' : 'e.g. 68 kg / 150 lbs'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Complexion */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'रंग-रूप (Complexion)' : 'Complexion'}
            </label>
            <select
              value={data.complexion}
              onChange={(e) => onChange({ complexion: e.target.value })}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            >
              <option value="">{isHindi ? '-- रंग-रूप चुनें --' : '-- Select Complexion --'}</option>
              {COMPLEXION_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Education & Career Information */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-800" />
            <span>{isHindi ? 'शिक्षा एवं करियर (Education & Career)' : 'Education & Professional Details'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi ? 'उच्चतम शिक्षा, पद, कंपनी/संगठन, आय एवं कार्यस्थल' : 'Highest qualification, current occupation, organization, income, and city'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Education */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'शिक्षा / उच्चतम योग्यता (Education / Degree)' : 'Education / Highest Degree'}</span>
            </label>
            <input
              type="text"
              value={data.highestEducation}
              onChange={(e) => onChange({ highestEducation: e.target.value })}
              placeholder={isHindi ? 'उदा. B.Tech (Computer Science), IIT Delhi / MBA, IIM' : 'e.g. B.Tech in Computer Science / MBA (Marketing) / MBBS'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'व्यवसाय / पद (Occupation)' : 'Occupation / Designation'}</span>
            </label>
            <input
              type="text"
              value={data.occupation}
              onChange={(e) => onChange({ occupation: e.target.value, jobTitle: e.target.value })}
              placeholder={isHindi ? 'उदा. सीनियर सॉफ्टवेयर इंजीनियर / बैंक मैनेजर' : 'e.g. Senior Software Engineer / Manager / Consultant'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Company / Organization */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'कंपनी / संगठन (Company / Organization)' : 'Company / Organization'}</span>
            </label>
            <input
              type="text"
              value={data.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              placeholder={isHindi ? 'उदा. Microsoft India / Tata Consultancy / Govt. of India' : 'e.g. Microsoft India / State Bank of India / Self-Employed'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Income */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'वार्षिक आय (Annual Income)' : 'Annual Income'}</span>
            </label>
            <input
              type="text"
              value={data.annualIncome}
              onChange={(e) => onChange({ annualIncome: e.target.value })}
              placeholder={isHindi ? 'उदा. ₹18 LPA / ₹25-30 LPA' : 'e.g. ₹18 LPA / ₹25 Lakhs per annum / $120,000 USD'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Work Location */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'कार्यस्थल / शहर (Work Location)' : 'Work Location'}</span>
            </label>
            <input
              type="text"
              value={data.workLocation}
              onChange={(e) => onChange({ workLocation: e.target.value })}
              placeholder={isHindi ? 'उदा. बेंगलुरु, कर्नाटक / मुंबई' : 'e.g. Bengaluru, Karnataka / Mumbai / Hybrid'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
