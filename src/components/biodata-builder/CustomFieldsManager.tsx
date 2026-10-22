import React, { useState } from 'react';
import { CustomField } from '../../types/biodata';
import { Plus, Trash2, ListPlus } from 'lucide-react';

interface CustomFieldsManagerProps {
  customFields: CustomField[];
  onAddField: (field: CustomField) => void;
  onRemoveField: (id: string) => void;
  language: 'en' | 'hi' | 'bilingual';
}

export const CustomFieldsManager: React.FC<CustomFieldsManagerProps> = ({
  customFields,
  onAddField,
  onRemoveField,
  language
}) => {
  const [section, setSection] = useState<CustomField['section']>('personal');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const isHindi = language === 'hi';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;

    onAddField({
      id: `custom_${Date.now()}`,
      section,
      name: label.trim(),
      label: label.trim(),
      value: value.trim()
    });

    setLabel('');
    setValue('');
    setIsOpen(false);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-amber-800" />
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              {isHindi ? 'अतिरिक्त कस्टम जानकारी (Custom Fields)' : 'Custom Fields & Special Attributes'}
            </h4>
            <p className="text-xs text-stone-500">
              {isHindi ? 'अपनी पसंद का कोई भी नया शीर्षक व विवरण जोड़ें' : 'Add custom details like Hobbies, PR status, Property, etc.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHindi ? 'नया फ़ील्ड जोड़ें' : 'Add Custom Field'}</span>
        </button>
      </div>

      {/* Add Form Popdown */}
      {isOpen && (
        <form onSubmit={handleAdd} className="mt-4 p-4 bg-white border border-amber-200 rounded-xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHindi ? 'किस भाग में जोड़ें?' : 'Select Section'}
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as any)}
                className="w-full text-xs border border-stone-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-amber-800"
              >
                <option value="personal">{isHindi ? 'व्यक्तिगत (Personal)' : 'Personal Details'}</option>
                <option value="horoscope">{isHindi ? 'ज्योतिष (Horoscope)' : 'Horoscope & Religion'}</option>
                <option value="education">{isHindi ? 'शिक्षा (Education)' : 'Education & Career'}</option>
                <option value="family">{isHindi ? 'परिवार (Family)' : 'Family Background'}</option>
                <option value="contact">{isHindi ? 'संपर्क (Contact)' : 'Contact Details'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHindi ? 'फ़ील्ड का शीर्षक' : 'Field Label / Title'}
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={isHindi ? 'उदा. शौक (Hobbies) या फ्लैट' : 'e.g. Hobbies / Visa Status'}
                className="w-full text-xs border border-stone-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isHindi ? 'विवरण (Value)' : 'Field Value / Text'}
              </label>
              <input
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={isHindi ? 'उदा. शास्त्रीय संगीत, यात्रा' : 'e.g. US H1B / Music / Self-owned house'}
                className="w-full text-xs border border-stone-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold bg-amber-800 text-white rounded-lg hover:bg-amber-900 cursor-pointer shadow-xs"
            >
              {isHindi ? 'सुरक्षित करें' : 'Save Field'}
            </button>
          </div>
        </form>
      )}

      {/* List of active custom fields */}
      {customFields.length > 0 && (
        <div className="mt-4 space-y-2">
          {customFields.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-lg text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-900 font-bold rounded text-[10px] uppercase">
                  {field.section}
                </span>
                <span className="font-semibold text-stone-800">{field.label}:</span>
                <span className="text-stone-600">{field.value}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveField(field.id)}
                className="text-stone-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
