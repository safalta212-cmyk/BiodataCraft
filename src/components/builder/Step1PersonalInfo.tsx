import React, { useEffect } from 'react';
import { BiodataData } from '../../types/biodata';
import { Input, Select, Label } from '../ui/Form';
import { validationUtils } from '../../utils/validation';
import { User, Calendar, Clock, MapPin, Ruler, Sparkles, GraduationCap, Briefcase, Building2, IndianRupee } from 'lucide-react';

interface Step1PersonalInfoProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  errors: Record<string, string>;
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

const RASHI_OPTIONS = [
  'Mesh (Aries) - मेष',
  'Vrishabh (Taurus) - वृषभ',
  'Mithun (Gemini) - मिथुन',
  'Karka (Cancer) - कर्क',
  'Simha (Leo) - सिंह',
  'Kanya (Virgo) - कन्या',
  'Tula (Libra) - तुला',
  'Vrishchik (Scorpio) - वृश्चिक',
  'Dhanu (Sagittarius) - धनु',
  'Makar (Capricorn) - मकर',
  'Kumbh (Aquarius) - कुंभ',
  'Meen (Pisces) - मीन'
];

const NAKSHATRA_OPTIONS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({
  data,
  onChange,
  errors
}) => {
  // Auto-calculate age whenever DOB changes and age is empty or auto-derived
  useEffect(() => {
    if (data.dob) {
      const calculated = validationUtils.calculateAge(data.dob);
      if (calculated && !data.age) {
        onChange({ age: calculated.formatted });
      }
    }
  }, [data.dob]);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dobValue = e.target.value;
    const calculated = validationUtils.calculateAge(dobValue);
    onChange({
      dob: dobValue,
      age: calculated ? calculated.formatted : data.age
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-lg font-bold text-stone-900 font-cinzel flex items-center gap-2">
          <User className="w-5 h-5 text-amber-800" />
          <span>Step 1: Personal & Professional Information</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Enter candidate's personal identity, birth coordinates, astrological lineage, and career details.
        </p>
      </div>

      {/* 1. Identity & Demographics */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Core Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Aarav Devendra Sharma"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              error={errors.fullName}
              hint="Candidate's full legal or preferred matrimonial name"
            />
          </div>

          <div>
            <Label required>Gender</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onChange({ gender: g })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center cursor-pointer transition-all ${
                    data.gender === g
                      ? 'border-amber-800 bg-amber-100/60 text-amber-950 font-bold shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {g === 'male' ? 'Groom (Male)' : 'Bride (Female)'}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
          </div>

          <div>
            <Input
              label="Date of Birth"
              type="date"
              required
              value={data.dob}
              onChange={handleDobChange}
              error={errors.dob}
              leftIcon={<Calendar className="w-4 h-4 text-stone-400" />}
            />
          </div>

          <div>
            <Input
              label="Age"
              placeholder="e.g. 28 Years"
              value={data.age}
              onChange={(e) => onChange({ age: e.target.value })}
              hint="Auto-calculated from date of birth (freely editable)"
            />
          </div>

          <div>
            <Input
              label="Time of Birth"
              placeholder="e.g. 07:25 AM"
              value={data.timeOfBirth}
              onChange={(e) => onChange({ timeOfBirth: e.target.value })}
              leftIcon={<Clock className="w-4 h-4 text-stone-400" />}
              hint="Essential for Kundali / Horoscope matching"
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Place of Birth"
              placeholder="e.g. Jaipur, Rajasthan, India"
              value={data.placeOfBirth}
              onChange={(e) => onChange({ placeOfBirth: e.target.value })}
              leftIcon={<MapPin className="w-4 h-4 text-stone-400" />}
            />
          </div>
        </div>
      </div>

      {/* 2. Physical Attributes */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Physical Appearance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Select
              label="Height"
              value={data.height}
              onChange={(e) => onChange({ height: e.target.value })}
              options={[
                { value: '', label: '-- Select Height --' },
                ...HEIGHT_OPTIONS.map((h) => ({ value: h, label: h }))
              ]}
            />
          </div>

          <div>
            <Input
              label="Weight"
              placeholder="e.g. 72 kg / 158 lbs"
              value={data.weight}
              onChange={(e) => onChange({ weight: e.target.value })}
            />
          </div>

          <div>
            <Select
              label="Complexion"
              value={data.complexion}
              onChange={(e) => onChange({ complexion: e.target.value })}
              options={[
                { value: '', label: '-- Select Complexion --' },
                { value: 'Fair', label: 'Fair' },
                { value: 'Very Fair', label: 'Very Fair' },
                { value: 'Wheatish', label: 'Wheatish' },
                { value: 'Wheatish Medium', label: 'Wheatish Medium' },
                { value: 'Dusky', label: 'Dusky' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* 3. Astrological & Religious Details */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Religion & Horoscope (Kundali)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Religion"
              placeholder="e.g. Hindu / Jain / Sikh"
              value={data.religion}
              onChange={(e) => onChange({ religion: e.target.value })}
            />
          </div>

          <div>
            <Input
              label="Caste / Community"
              placeholder="e.g. Brahmin / Marwari / Agarwal / Rajput"
              value={data.caste}
              onChange={(e) => onChange({ caste: e.target.value })}
            />
          </div>

          <div>
            <Input
              label="Sub-Caste"
              placeholder="e.g. Gaur / Sanadhya / Goyal"
              value={data.subCaste}
              onChange={(e) => onChange({ subCaste: e.target.value })}
            />
          </div>

          <div>
            <Input
              label="Gotra"
              placeholder="e.g. Bharadwaj / Kashyap / Vashistha"
              value={data.gotra}
              onChange={(e) => onChange({ gotra: e.target.value })}
              hint="Candidate's paternal gotra"
            />
          </div>

          <div>
            <Select
              label="Rashi (Moon Sign)"
              value={data.rashi}
              onChange={(e) => onChange({ rashi: e.target.value })}
              options={[
                { value: '', label: '-- Select Rashi --' },
                ...RASHI_OPTIONS.map((r) => ({ value: r.split(' - ')[0], label: r }))
              ]}
            />
          </div>

          <div>
            <Select
              label="Nakshatra (Birth Star)"
              value={data.nakshatra}
              onChange={(e) => onChange({ nakshatra: e.target.value })}
              options={[
                { value: '', label: '-- Select Nakshatra --' },
                ...NAKSHATRA_OPTIONS.map((n) => ({ value: n, label: n }))
              ]}
            />
          </div>

          <div className="sm:col-span-2">
            <Select
              label="Manglik Status"
              value={data.manglik}
              onChange={(e) => onChange({ manglik: e.target.value })}
              options={[
                { value: 'Non-Manglik', label: 'Non-Manglik (अमांगलिक)' },
                { value: 'Manglik', label: 'Manglik (मांगलिक)' },
                { value: 'Anshik Manglik', label: 'Anshik Manglik (आंशिक मांगलिक)' },
                { value: 'Don\'t Know', label: 'Don\'t Know (ज्ञात नहीं)' },
                { value: 'Not Applicable', label: 'Not Applicable' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* 4. Education & Career Information */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Education & Career
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Highest Education"
              required
              placeholder="e.g. B.Tech in CS / MBA / MBBS / CA"
              value={data.highestEducation}
              onChange={(e) => onChange({ highestEducation: e.target.value })}
              error={errors.highestEducation}
              leftIcon={<GraduationCap className="w-4 h-4 text-stone-400" />}
            />
          </div>

          <div>
            <Input
              label="Occupation / Designation"
              required
              placeholder="e.g. Senior Software Architect / Doctor"
              value={data.occupation}
              onChange={(e) => onChange({ occupation: e.target.value, jobTitle: e.target.value })}
              error={errors.occupation}
              leftIcon={<Briefcase className="w-4 h-4 text-stone-400" />}
            />
          </div>

          <div>
            <Input
              label="Company / Organization"
              placeholder="e.g. Microsoft India / SBI / Private Clinic"
              value={data.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              leftIcon={<Building2 className="w-4 h-4 text-stone-400" />}
            />
          </div>

          <div>
            <Input
              label="Annual Income / Package"
              placeholder="e.g. ₹ 32,00,000 P.A. or 32 LPA"
              value={data.annualIncome}
              onChange={(e) => onChange({ annualIncome: e.target.value })}
              leftIcon={<IndianRupee className="w-4 h-4 text-stone-400" />}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Work Location"
              placeholder="e.g. Bengaluru, Karnataka (Hybrid) or London, UK"
              value={data.workLocation}
              onChange={(e) => onChange({ workLocation: e.target.value })}
              leftIcon={<MapPin className="w-4 h-4 text-stone-400" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
