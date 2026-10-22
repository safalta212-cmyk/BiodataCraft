import React from 'react';
import { BiodataData, SiblingEntry } from '../../types/biodata';
import { Users, Plus, Trash2, Home, MapPin, Heart, AlertCircle } from 'lucide-react';

interface Step2FamilyFormProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
  errors?: Record<string, string>;
}

const FAMILY_TYPES = ['Nuclear (एकल परिवार)', 'Joint Family (संयुक्त परिवार)'];
const FAMILY_STATUS_OPTIONS = [
  'Middle Class (मध्यम वर्गीय)',
  'Upper Middle Class (उच्च मध्यम वर्गीय)',
  'Affluent / Rich (समृद्ध परिवार)',
  'High Net Worth (विशिष्ट प्रतिष्ठित परिवार)'
];

export const Step2FamilyForm: React.FC<Step2FamilyFormProps> = ({
  data,
  onChange,
  language,
  errors = {}
}) => {
  const isHindi = language === 'hi';

  const brothers = data.brothersList || [];
  const sisters = data.sistersList || [];

  const handleAddBrother = () => {
    const newEntry: SiblingEntry = {
      id: `bro-${Date.now()}`,
      name: '',
      relationType: 'Elder',
      maritalStatus: 'Unmarried',
      occupation: ''
    };
    const updated = [...brothers, newEntry];
    onChange({
      brothersList: updated,
      brothersDetails: formatSiblingsSummary(updated, 'Brother')
    });
  };

  const handleUpdateBrother = (id: string, updates: Partial<SiblingEntry>) => {
    const updated = brothers.map((b) => (b.id === id ? { ...b, ...updates } : b));
    onChange({
      brothersList: updated,
      brothersDetails: formatSiblingsSummary(updated, 'Brother')
    });
  };

  const handleRemoveBrother = (id: string) => {
    const updated = brothers.filter((b) => b.id !== id);
    onChange({
      brothersList: updated,
      brothersDetails: formatSiblingsSummary(updated, 'Brother')
    });
  };

  const handleAddSister = () => {
    const newEntry: SiblingEntry = {
      id: `sis-${Date.now()}`,
      name: '',
      relationType: 'Elder',
      maritalStatus: 'Unmarried',
      occupation: ''
    };
    const updated = [...sisters, newEntry];
    onChange({
      sistersList: updated,
      sistersDetails: formatSiblingsSummary(updated, 'Sister')
    });
  };

  const handleUpdateSister = (id: string, updates: Partial<SiblingEntry>) => {
    const updated = sisters.map((s) => (s.id === id ? { ...s, ...updates } : s));
    onChange({
      sistersList: updated,
      sistersDetails: formatSiblingsSummary(updated, 'Sister')
    });
  };

  const handleRemoveSister = (id: string) => {
    const updated = sisters.filter((s) => s.id !== id);
    onChange({
      sistersList: updated,
      sistersDetails: formatSiblingsSummary(updated, 'Sister')
    });
  };

  function formatSiblingsSummary(list: SiblingEntry[], type: 'Brother' | 'Sister'): string {
    if (list.length === 0) return '';
    return list
      .map((item) => {
        const parts = [];
        if (item.relationType) parts.push(item.relationType);
        parts.push(type);
        if (item.name) parts.push(`(${item.name})`);
        if (item.maritalStatus) parts.push(`- ${item.maritalStatus}`);
        if (item.occupation) parts.push(`, ${item.occupation}`);
        return parts.join(' ');
      })
      .join('; ');
  }

  return (
    <div className="space-y-6">
      {/* 1. Parents Information Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-800 shrink-0" />
              <span>{isHindi ? 'माता-पिता का विवरण (Parents Info)' : 'Parents Information'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi ? 'पिता व माता का नाम एवं व्यवसाय' : 'Father & Mother full names and professions'}
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md self-start sm:self-auto shrink-0">
            * {isHindi ? 'अनिवार्य' : 'Required'}
          </span>
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
              className={`w-full text-sm font-semibold border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.fatherName
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.fatherName && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.fatherName}</span>
              </p>
            )}
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
              placeholder={isHindi ? 'उदा. व्यवसायी / मुख्य चिकित्सा अधिकारी (से.नि.)' : 'e.g. Senior Manager, PSU / Businessman'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
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
              className={`w-full text-sm font-semibold border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white ${
                errors.motherName
                  ? 'border-red-500 focus:border-red-500 bg-red-50/20'
                  : 'border-stone-300 focus:border-amber-800'
              }`}
            />
            {errors.motherName && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.motherName}</span>
              </p>
            )}
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
              placeholder={isHindi ? 'उदा. गृहणी / अध्यापिका' : 'e.g. Homemaker / School Principal'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Siblings (Repeatable Brothers & Sisters) */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-800" />
            <span>{isHindi ? 'भाई-बहन का विवरण (Brothers & Sisters)' : 'Siblings Information (Brothers & Sisters)'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi ? 'एक से अधिक भाई या बहन जोड़ें (वैवाहिक स्थिति व कार्यक्षेत्र सहित)' : 'Add repeatable entries for brothers and sisters with their status'}
          </p>
        </div>

        {/* Brothers Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              {isHindi ? 'भाई की जानकारी (Brothers)' : 'Brothers'} ({brothers.length})
            </h4>
            <button
              type="button"
              onClick={handleAddBrother}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? '+ भाई जोड़ें' : '+ Add Brother'}</span>
            </button>
          </div>

          {brothers.length === 0 ? (
            <div className="p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-center text-xs text-stone-500">
              {isHindi ? 'कोई भाई नहीं जोड़ा गया (यदि लागू हो तो ऊपर क्लिक करें)' : 'No brother added yet. Click above if applicable.'}
            </div>
          ) : (
            <div className="space-y-3">
              {brothers.map((b, idx) => (
                <div
                  key={b.id}
                  className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-xl space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">
                      #{idx + 1} {b.relationType || 'Brother'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBrother(b.id)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                      title="Remove brother"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Relation
                      </label>
                      <select
                        value={b.relationType}
                        onChange={(e) => handleUpdateBrother(b.id, { relationType: e.target.value })}
                        className="w-full text-xs border border-stone-300 rounded-md p-2 bg-white"
                      >
                        <option value="Elder">Elder Brother (बड़ा भाई)</option>
                        <option value="Younger">Younger Brother (छोटा भाई)</option>
                        <option value="Twin">Twin Brother</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={b.name}
                        onChange={(e) => handleUpdateBrother(b.id, { name: e.target.value })}
                        placeholder="Brother's Name"
                        className="w-full text-xs border border-stone-300 rounded-md p-2 bg-white"
                      >
                      </input>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Marital Status
                      </label>
                      <select
                        value={b.maritalStatus}
                        onChange={(e) => handleUpdateBrother(b.id, { maritalStatus: e.target.value })}
                        className="w-full text-xs border border-stone-300 rounded-md p-2 bg-white"
                      >
                        <option value="Unmarried">Unmarried (अविवाहित)</option>
                        <option value="Married">Married (विवाहित)</option>
                        <option value="Engaged">Engaged (सगाई हो चुकी)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Occupation / Studies
                      </label>
                      <input
                        type="text"
                        value={b.occupation}
                        onChange={(e) => handleUpdateBrother(b.id, { occupation: e.target.value })}
                        placeholder="e.g. Software Engineer / MS Student"
                        className="w-full text-xs border border-stone-300 rounded-md p-2 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sisters Section */}
        <div className="space-y-3 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              {isHindi ? 'बहन की जानकारी (Sisters)' : 'Sisters'} ({sisters.length})
            </h4>
            <button
              type="button"
              onClick={handleAddSister}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? '+ बहन जोड़ें' : '+ Add Sister'}</span>
            </button>
          </div>

          {sisters.length === 0 ? (
            <div className="p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-center text-xs text-stone-500">
              {isHindi ? 'कोई बहन नहीं जोड़ी गई (यदि लागू हो तो ऊपर क्लिक करें)' : 'No sister added yet. Click above if applicable.'}
            </div>
          ) : (
            <div className="space-y-3">
              {sisters.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-3.5 bg-stone-50/70 border border-stone-200 rounded-xl space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">
                      #{idx + 1} {s.relationType || 'Sister'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSister(s.id)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                      title="Remove sister"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Relation
                      </label>
                      <select
                        value={s.relationType}
                        onChange={(e) => handleUpdateSister(s.id, { relationType: e.target.value })}
                        className="w-full text-xs border border-stone-300 rounded-md p-2 bg-white"
                      >
                        <option value="Elder">Elder Sister (बड़ी बहन)</option>
                        <option value="Younger">Younger Sister (छोटी बहन)</option>
                        <option value="Twin">Twin Sister</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => handleUpdateSister(s.id, { name: e.target.value })}
                        placeholder="Sister's Name"
                        className="w-full text-xs border border-stone-300 rounded-md p-2 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Marital Status
                      </label>
                      <select
                        value={s.maritalStatus}
                        onChange={(e) => handleUpdateSister(s.id, { maritalStatus: e.target.value })}
                        className="w-full text-xs border border-stone-300 rounded-md p-2 bg-white"
                      >
                        <option value="Unmarried">Unmarried (अविवाहित)</option>
                        <option value="Married">Married (विवाहित)</option>
                        <option value="Engaged">Engaged (सगाई हो चुकी)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Occupation / Studies
                      </label>
                      <input
                        type="text"
                        value={s.occupation}
                        onChange={(e) => handleUpdateSister(s.id, { occupation: e.target.value })}
                        placeholder="e.g. Architect / Teacher / Student"
                        className="w-full text-xs border border-stone-300 rounded-md p-2 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Family Type, Status, Location & Description */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-200 pb-3">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-800" />
            <span>{isHindi ? 'परिवार प्रकार एवं पृष्ठभूमि (Family Status & Overview)' : 'Family Overview & Values'}</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isHindi ? 'परिवार प्रकार, सामाजिक स्तर, मूल स्थान एवं विवरण' : 'Family type, social status, ancestral roots and brief description'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Family Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'परिवार प्रकार (Family Type)' : 'Family Type'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Nuclear', 'Joint'].map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => onChange({ familyType: ft })}
                  className={`py-2 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    data.familyType === ft
                      ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {ft === 'Nuclear'
                    ? isHindi ? 'एकल (Nuclear)' : 'Nuclear Family'
                    : isHindi ? 'संयुक्त (Joint)' : 'Joint Family'}
                </button>
              ))}
            </div>
          </div>

          {/* Family Status */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'पारिवारिक स्थिति (Family Status)' : 'Family Status'}
            </label>
            <select
              value={data.familyStatus}
              onChange={(e) => onChange({ familyStatus: e.target.value })}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            >
              {FAMILY_STATUS_OPTIONS.map((fs) => (
                <option key={fs} value={fs.split(' ')[0]}>
                  {fs}
                </option>
              ))}
            </select>
          </div>

          {/* Family Location */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'परिवार का मूल स्थान / गृह नगर (Family Location / Native Place)' : 'Family Location / Native Hometown'}</span>
            </label>
            <input
              type="text"
              value={data.familyLocation || data.nativePlace}
              onChange={(e) => onChange({ familyLocation: e.target.value, nativePlace: e.target.value })}
              placeholder={isHindi ? 'उदा. मूल निवास: बीकानेर, राजस्थान (वर्तमान में जयपुर)' : 'e.g. Native: Bikaner, Rajasthan (Currently settled in Jaipur)'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>

          {/* Family Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isHindi ? 'पारिवारिक परिचय (Family Description / Brief)' : 'Family Description'}
            </label>
            <textarea
              rows={3}
              value={data.familyDescription}
              onChange={(e) => onChange({ familyDescription: e.target.value })}
              placeholder={isHindi ? 'उदा. सुसंस्कृत, धार्मिक एवं प्रगतिशील विचारों वाला प्रतिष्ठित परिवार। हमारे परिवार में पारंपरिक संस्कारों को प्राथमिकता दी जाती है।' : 'e.g. Well-respected and culturally grounded family with progressive outlook. We hold high moral values and respect for elder traditions.'}
              className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
