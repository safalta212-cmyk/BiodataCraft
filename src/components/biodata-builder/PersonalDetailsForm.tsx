import React from 'react';
import { BiodataData } from '../../types/biodata';
import { User, Calendar, Clock, MapPin, Ruler, Heart, Sparkles } from 'lucide-react';

interface PersonalDetailsFormProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
}

const HEIGHT_OPTIONS = [
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

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({
  data,
  onChange,
  language
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-stone-200 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <User className="w-5 h-5 text-amber-800" />
          <span>{isHindi ? 'व्यक्तिगत जानकारी' : 'Personal Details'}</span>
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          {isHindi
            ? 'वर अथवा वधू की प्राथमिक पहचान एवं शारीरिक विवरण दर्ज करें'
            : 'Enter the candidate\'s foundational personal information'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
          </label>
          <input
            type="text"
            required
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder={isHindi ? 'उदा. राहुल शर्मा' : 'e.g. Aarav Devendra Sharma'}
            className="w-full text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'लिंग (Gender)' : 'Gender'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ gender: g })}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                  data.gender === g
                    ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold'
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

        {/* Marital Status */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'वैवाहिक स्थिति (Marital Status)' : 'Marital Status'}
          </label>
          <select
            value={data.maritalStatus}
            onChange={(e) => onChange({ maritalStatus: e.target.value })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          >
            <option value="Never Married">{isHindi ? 'अविवाहित (Never Married)' : 'Never Married'}</option>
            <option value="Divorced">{isHindi ? 'तलाकशुदा (Divorced)' : 'Divorced'}</option>
            <option value="Awaiting Divorce">{isHindi ? 'तलाक प्रक्रियाधीन (Awaiting Divorce)' : 'Awaiting Divorce'}</option>
            <option value="Widowed">{isHindi ? 'विधुर / विधवा (Widowed)' : 'Widowed'}</option>
            <option value="Annulled">{isHindi ? 'विवाह रद्द (Annulled)' : 'Annulled'}</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'जन्म तिथि (Date of Birth)' : 'Date of Birth'}</span>
          </label>
          <input
            type="date"
            value={data.dob}
            onChange={(e) => onChange({ dob: e.target.value })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
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
            placeholder={isHindi ? 'उदा. 07:25 AM या प्रात: 7:25' : 'e.g. 07:25 AM'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Place of Birth */}
        <div>
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

        {/* Height */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'ऊंचाई (Height)' : 'Height'}</span>
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

        {/* Complexion */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'रंग-रूप (Complexion)' : 'Complexion'}</span>
          </label>
          <select
            value={data.complexion}
            onChange={(e) => onChange({ complexion: e.target.value })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          >
            <option value="">{isHindi ? '-- रंग-रूप चुनें --' : '-- Select Complexion --'}</option>
            <option value="Fair">{isHindi ? 'गोरा (Fair)' : 'Fair'}</option>
            <option value="Very Fair">{isHindi ? 'अत्यंत गोरा (Very Fair)' : 'Very Fair'}</option>
            <option value="Wheatish">{isHindi ? 'गेहुंआ (Wheatish)' : 'Wheatish'}</option>
            <option value="Wheatish Medium">{isHindi ? 'मध्यम गेहुंआ (Wheatish Medium)' : 'Wheatish Medium'}</option>
            <option value="Dusky">{isHindi ? 'सांवला (Dusky)' : 'Dusky'}</option>
          </select>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'रक्त समूह (Blood Group)' : 'Blood Group'}</span>
          </label>
          <select
            value={data.bloodGroup}
            onChange={(e) => onChange({ bloodGroup: e.target.value })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          >
            <option value="">{isHindi ? '-- रक्त समूह चुनें --' : '-- Select Blood Group --'}</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* Mother Tongue */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'मातृभाषा (Mother Tongue)' : 'Mother Tongue'}
          </label>
          <input
            type="text"
            value={data.motherTongue}
            onChange={(e) => onChange({ motherTongue: e.target.value })}
            placeholder={isHindi ? 'उदा. हिंदी, मारवाड़ी, गुजराती' : 'e.g. Hindi, Punjabi, Gujarati'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Dietary Habits */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'खान-पान (Dietary Habits)' : 'Dietary Habits'}
          </label>
          <select
            value={data.dietaryHabits}
            onChange={(e) => onChange({ dietaryHabits: e.target.value })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          >
            <option value="Pure Vegetarian">{isHindi ? 'शुद्ध शाकाहारी (Pure Vegetarian)' : 'Pure Vegetarian'}</option>
            <option value="Vegetarian">{isHindi ? 'शाकाहारी (Vegetarian)' : 'Vegetarian'}</option>
            <option value="Jain Vegetarian">{isHindi ? 'जैन शाकाहारी (Jain Vegetarian)' : 'Jain Vegetarian'}</option>
            <option value="Eggetarian">{isHindi ? 'अंडा युक्त शाकाहारी (Eggetarian)' : 'Eggetarian'}</option>
            <option value="Non-Vegetarian">{isHindi ? 'मांसाहारी (Non-Vegetarian)' : 'Non-Vegetarian'}</option>
          </select>
        </div>
      </div>
    </div>
  );
};
