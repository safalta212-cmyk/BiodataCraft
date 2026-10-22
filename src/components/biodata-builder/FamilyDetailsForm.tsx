import React from 'react';
import { BiodataData } from '../../types/biodata';
import { Users, Home, Award } from 'lucide-react';

interface FamilyDetailsFormProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
}

export const FamilyDetailsForm: React.FC<FamilyDetailsFormProps> = ({
  data,
  onChange,
  language
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-stone-200 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-800" />
          <span>{isHindi ? 'पारिवारिक विवरण' : 'Family Background'}</span>
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          {isHindi
            ? 'माता-पिता, भाई-बहन, मूल निवास एवं ननिहाल (मामा का गोत्र/स्थान) का विवरण'
            : 'Parents, siblings, ancestral town, and maternal uncle (Mosal/Nanihal) background'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Father's Name */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'पिता का नाम (Father\'s Name) *' : 'Father\'s Name *'}
          </label>
          <input
            type="text"
            value={data.fatherName}
            onChange={(e) => onChange({ fatherName: e.target.value })}
            placeholder={isHindi ? 'उदा. श्री राजेन्द्र कुमार शर्मा' : 'e.g. Mr. Devendra Kumar Sharma'}
            className="w-full text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Father's Occupation */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'पिता का व्यवसाय (Father\'s Occupation)' : 'Father\'s Occupation'}
          </label>
          <input
            type="text"
            value={data.fatherOccupation}
            onChange={(e) => onChange({ fatherOccupation: e.target.value })}
            placeholder={isHindi ? 'उदा. व्यवसायी / मुख्य चिकित्सा अधिकारी (सेवानिवृत्त)' : 'e.g. Chief Medical Officer (Retd.) / Businessman'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Mother's Name */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'माता का नाम (Mother\'s Name) *' : 'Mother\'s Name *'}
          </label>
          <input
            type="text"
            value={data.motherName}
            onChange={(e) => onChange({ motherName: e.target.value })}
            placeholder={isHindi ? 'उदा. श्रीमती सुनीता शर्मा' : 'e.g. Mrs. Sunita Sharma'}
            className="w-full text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Mother's Occupation */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'माता का व्यवसाय (Mother\'s Occupation)' : 'Mother\'s Occupation'}
          </label>
          <input
            type="text"
            value={data.motherOccupation}
            onChange={(e) => onChange({ motherOccupation: e.target.value })}
            placeholder={isHindi ? 'उदा. गृहणी / अध्यापिका' : 'e.g. Homemaker / Vice Principal, School'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Brothers Details */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'भाई का विवरण (Brothers Count & Details)' : 'Brother(s) Details'}
          </label>
          <input
            type="text"
            value={data.brothersDetails}
            onChange={(e) => onChange({ brothersDetails: e.target.value })}
            placeholder={isHindi ? 'उदा. 1 छोटा भाई (MS छात्र, जर्मनी)' : 'e.g. 1 Younger Brother (Pursuing MS at TU Munich) or None'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Sisters Details */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'बहनों का विवरण (Sisters Count & Details)' : 'Sister(s) Details'}
          </label>
          <input
            type="text"
            value={data.sistersDetails}
            onChange={(e) => onChange({ sistersDetails: e.target.value })}
            placeholder={isHindi ? 'उदा. 1 बड़ी बहन (विवाहित, सॉफ्टवेयर आर्किटेक्ट)' : 'e.g. 1 Elder Sister (Married, settled in Pune) or None'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Native Place */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-stone-500" />
            <span>{isHindi ? 'मूल निवास (Native Place / Ancestral Town)' : 'Native Place'}</span>
          </label>
          <input
            type="text"
            value={data.nativePlace}
            onChange={(e) => onChange({ nativePlace: e.target.value })}
            placeholder={isHindi ? 'उदा. जयपुर / जोधपुर, राजस्थान' : 'e.g. Jaipur, Rajasthan'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
        </div>

        {/* Family Type & Values */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            {isHindi ? 'परिवार प्रकार (Family Type)' : 'Family Type'}
          </label>
          <select
            value={data.familyType}
            onChange={(e) => onChange({ familyType: e.target.value as any })}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          >
            <option value="Nuclear">{isHindi ? 'एकल परिवार (Nuclear Family)' : 'Nuclear Family'}</option>
            <option value="Joint">{isHindi ? 'संयुक्त परिवार (Joint Family)' : 'Joint Family'}</option>
          </select>
        </div>

        {/* Maternal Uncle Details (Mama Ji / Mosal) */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-800" />
            <span>{isHindi ? 'मामा का विवरण / ननिहाल गोत्र (Maternal Uncle / Mosal Details)' : 'Maternal Uncle / Mosal Gotra Details'}</span>
          </label>
          <input
            type="text"
            value={data.maternalUncleDetails}
            onChange={(e) => onChange({ maternalUncleDetails: e.target.value })}
            placeholder={isHindi ? 'उदा. मिश्रा परिवार (गोत्र: वशिष्ठ), वरिष्ठ अधिवक्ता, जोधपुर' : 'e.g. Mishra Parivar (Gotra: Vashistha), Advocate, Jodhpur'}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
          />
          <span className="text-[10px] text-stone-600 block mt-1">
            {isHindi ? 'पारंपरिक विवाह में ननिहाल पक्ष का गोत्र व स्थान अति महत्वपूर्ण होता है।' : 'Crucial in Indian traditions to verify maternal gotra compatibility.'}
          </span>
        </div>
      </div>
    </div>
  );
};
