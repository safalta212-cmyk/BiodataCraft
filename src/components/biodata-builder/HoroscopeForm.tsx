import React from 'react';
import { BiodataData } from '../../types/biodata';
import { Compass } from 'lucide-react';

interface HoroscopeFormProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
}

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

export const HoroscopeForm: React.FC<HoroscopeFormProps> = ({
  data,
  onChange,
  language
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-800" />
            <span>{isHindi ? 'धर्म एवं ज्योतिष (कुंडली विवरण)' : 'Religion & Astrological Details'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi
              ? 'जाति, गोत्र, राशि, नक्षत्र और मांगलिक मिलान की जानकारी'
              : 'Community, Gotra, Rashi, Nakshatra and Kundali compatibility details'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Religion */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'धर्म (Religion)' : 'Religion'}
          </label>
          <input
            type="text"
            value={data.religion}
            onChange={(e) => onChange({ religion: e.target.value })}
            placeholder={isHindi ? 'उदा. हिन्दू, जैन, सिख' : 'e.g. Hindu, Jain, Sikh'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Caste */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'जाति (Caste / Community)' : 'Caste / Community'}
          </label>
          <input
            type="text"
            value={data.caste}
            onChange={(e) => onChange({ caste: e.target.value })}
            placeholder={isHindi ? 'उदा. ब्राह्मण, अग्रवाल, राजपूत, महेश्वरी' : 'e.g. Brahmin, Agarwal, Rajput'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Sub-Caste */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'उपजाति (Sub-Caste)' : 'Sub-Caste'}
          </label>
          <input
            type="text"
            value={data.subCaste}
            onChange={(e) => onChange({ subCaste: e.target.value })}
            placeholder={isHindi ? 'उदा. गौड़, सनाढ्य, गोयल' : 'e.g. Gaur, Sanadhya, Goyal'}
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
            placeholder={isHindi ? 'उदा. भारद्वाज, कश्यप, वशिष्ठ' : 'e.g. Bharadwaj, Kashyap'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Kuldevi / Kuldevta */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'कुलदेवी / कुलदेवता (Kuldevi)' : 'Kuldevi / Family Deity'}
          </label>
          <input
            type="text"
            value={data.kuldevi}
            onChange={(e) => onChange({ kuldevi: e.target.value })}
            placeholder={isHindi ? 'उदा. शाकंभरी माता, जीण माता' : 'e.g. Shakambhari Mata'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Manglik Status */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'मांगलिक स्थिति (Manglik Status)' : 'Manglik Status'}
          </label>
          <select
            value={data.manglik}
            onChange={(e) => onChange({ manglik: e.target.value as any })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white font-medium"
          >
            <option value="Non-Manglik">{isHindi ? 'अमांगलिक (Non-Manglik)' : 'Non-Manglik'}</option>
            <option value="Manglik">{isHindi ? 'मांगलिक (Manglik)' : 'Manglik'}</option>
            <option value="Anshik Manglik">{isHindi ? 'आंशिक मांगलिक (Anshik Manglik)' : 'Anshik Manglik'}</option>
            <option value="Don't Know">{isHindi ? 'ज्ञात नहीं (Don\'t Know)' : 'Don\'t Know'}</option>
            <option value="Not Applicable">{isHindi ? 'लागू नहीं (Not Applicable)' : 'Not Applicable'}</option>
          </select>
        </div>

        {/* Rashi */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'राशि (Moon Sign / Rashi)' : 'Moon Sign / Rashi'}
          </label>
          <select
            value={data.rashi}
            onChange={(e) => onChange({ rashi: e.target.value })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          >
            <option value="">{isHindi ? '-- राशि चुनें --' : '-- Select Rashi --'}</option>
            {RASHI_OPTIONS.map((r) => (
              <option key={r} value={r.split(' - ')[0]}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Nakshatra */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'नक्षत्र (Birth Star / Nakshatra)' : 'Nakshatra (Birth Star)'}
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

        {/* Charan / Pad */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'चरण (Charan / Pada)' : 'Charan / Pada'}
          </label>
          <select
            value={data.charan}
            onChange={(e) => onChange({ charan: e.target.value })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          >
            <option value="">{isHindi ? '-- चरण चुनें --' : '-- Select Charan --'}</option>
            <option value="1st Charan">1st Charan (प्रथम चरण)</option>
            <option value="2nd Charan">2nd Charan (द्वितीय चरण)</option>
            <option value="3rd Charan">3rd Charan (तृतीय चरण)</option>
            <option value="4th Charan">4th Charan (चतुर्थ चरण)</option>
          </select>
        </div>

        {/* Gan & Nadi */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'गण (Gan)' : 'Gan'}
          </label>
          <select
            value={data.gan}
            onChange={(e) => onChange({ gan: e.target.value })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          >
            <option value="">{isHindi ? '-- गण चुनें --' : '-- Select Gan --'}</option>
            <option value="Dev Gan">Dev Gan (देव गण)</option>
            <option value="Manushya Gan">Manushya Gan (मनुष्य गण)</option>
            <option value="Rakshas Gan">Rakshas Gan (राक्षस गण)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
