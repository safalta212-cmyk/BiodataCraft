import React, { useState } from 'react';
import { BiodataData, CustomField } from '../../types/biodata';
import {
  ListPlus,
  Plus,
  Trash2,
  Sparkles,
  Edit2,
  Check,
  X,
  FileCheck2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Step5CustomFieldsProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
  errors?: Record<string, string>;
  onOpenPreview: () => void;
  onOpenDownload: () => void;
}

const COMMON_SUGGESTIONS = [
  { name: 'Dietary Preference (खान-पान)', val: 'Pure Vegetarian (शुद्ध शाकाहारी)' },
  { name: 'Hobbies & Interests (रुचियां)', val: 'Reading, Classical Music, Travel' },
  { name: 'Kundali Matching (गुण मिलान)', val: 'Must match 24+ Gunas (गुण मिलान आवश्यक)' },
  { name: 'Maternal Gotra (मामा का गोत्र / मोसाल)', val: 'Kashyap (कश्यप), Jaipur' },
  { name: 'Visa / PR Status', val: 'Permanent Resident (Canada / USA / India)' },
  { name: 'Mother Tongue (मातृभाषा)', val: 'Hindi / Marwari / Gujarati' },
  { name: 'Family Assets / Property', val: 'Own House, Commercial Property in Metro' },
  { name: 'Willing to Relocate', val: 'Yes, Open to relocate within India or Abroad' }
];

export const Step5CustomFields: React.FC<Step5CustomFieldsProps> = ({
  data,
  onChange,
  language,
  onOpenPreview,
  onOpenDownload
}) => {
  const isHindi = language === 'hi';
  const customFields = data.customFields || [];

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editVal, setEditVal] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddField = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newFieldName.trim()) {
      setValidationError(isHindi ? 'कृपया फ़ील्ड का नाम दर्ज करें' : 'Please provide a field name');
      return;
    }
    if (!newFieldValue.trim()) {
      setValidationError(isHindi ? 'कृपया फ़ील्ड का मान दर्ज करें' : 'Please enter the value for this field');
      return;
    }

    const newField: CustomField = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: newFieldName.trim(),
      label: newFieldName.trim(),
      value: newFieldValue.trim(),
      section: 'custom'
    };

    onChange({
      customFields: [...customFields, newField]
    });

    setNewFieldName('');
    setNewFieldValue('');
    setValidationError(null);
  };

  const handleApplySuggestion = (name: string, val: string) => {
    const exists = customFields.some((f) => (f.name || f.label) === name);
    if (exists) {
      setValidationError(isHindi ? 'यह फ़ील्ड पहले से जुड़ी हुई है' : 'This field is already added');
      return;
    }

    const newField: CustomField = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      label: name,
      value: val,
      section: 'custom'
    };

    onChange({
      customFields: [...customFields, newField]
    });
    setValidationError(null);
  };

  const handleRemoveField = (id: string) => {
    onChange({
      customFields: customFields.filter((f) => f.id !== id)
    });
  };

  const startEdit = (field: CustomField) => {
    setEditingId(field.id);
    setEditName(field.name || field.label || '');
    setEditVal(field.value);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim() || !editVal.trim()) return;
    onChange({
      customFields: customFields.map((f) =>
        f.id === id ? { ...f, name: editName.trim(), label: editName.trim(), value: editVal.trim() } : f
      )
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Add Custom Field Form Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5">
        <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ListPlus className="w-5 h-5 text-amber-800" />
              <span>{isHindi ? 'अतिरिक्त एवं विशेष फ़ील्ड (Custom Fields)' : 'Custom Fields & Extra Information'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi
                ? 'अपनी आवश्यकतानुसार कोई भी नया फ़ील्ड जोड़ें (जैसे खान-पान, मातृभाषा, रुचियां आदि)'
                : 'Add any custom fields specific to your family or community requirements'}
            </p>
          </div>
        </div>

        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Add Form */}
        <form onSubmit={handleAddField} className="p-4 bg-stone-50/80 border border-stone-200 rounded-xl space-y-4">
          <div className="text-xs font-bold text-stone-800">
            {isHindi ? '+ नया फ़ील्ड जोड़ें (Add Custom Field)' : '+ Add Custom Field'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                {isHindi ? 'फ़ील्ड का नाम (Field name:)' : 'Field name:'}
              </label>
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder={isHindi ? 'उदा. रुचियां / खान-पान / गुण मिलान' : 'e.g. Hobbies / Dietary Habit / Citizen Status'}
                className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                {isHindi ? 'मान / विवरण (Value:)' : 'Value:'}
              </label>
              <input
                type="text"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                placeholder={isHindi ? 'उदा. शुद्ध शाकाहारी / संगीत व यात्रा' : 'e.g. Pure Vegetarian / Music, Badminton'}
                className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 px-4 py-2 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHindi ? 'फ़ील्ड जोड़ें (Add Field)' : 'Add Field'}</span>
            </button>
          </div>
        </form>

        {/* 1-Click Matrimonial Suggestions */}
        <div>
          <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>{isHindi ? 'अक्सर उपयोग होने वाले सुझाव (1-Click Suggestions):' : 'Popular Matrimonial Field Suggestions:'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {COMMON_SUGGESTIONS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleApplySuggestion(item.name, item.val)}
                className="text-[11px] font-medium text-stone-700 bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left"
              >
                + {item.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Current Custom Fields List */}
        <div className="pt-2 border-t border-stone-200">
          <div className="text-xs font-bold text-stone-800 mb-2">
            {isHindi ? 'शामिल किए गए फ़ील्ड (Custom Fields List)' : 'Configured Custom Fields'} ({customFields.length})
          </div>

          {customFields.length === 0 ? (
            <div className="p-4 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-center text-xs text-stone-500">
              {isHindi ? 'कोई अतिरिक्त फ़ील्ड नहीं जोड़ी गई।' : 'No custom fields added yet. Add one above or proceed to download!'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {customFields.map((f) => (
                <div
                  key={f.id}
                  className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  {editingId === f.id ? (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-xs border border-amber-500 rounded px-2 py-1.5 bg-white"
                      />
                      <input
                        type="text"
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        className="text-xs border border-amber-500 rounded px-2 py-1.5 bg-white"
                      />
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs font-bold text-stone-800 mr-2">
                        {f.name || f.label}:
                      </span>
                      <span className="text-xs font-medium text-stone-700">
                        {f.value}
                      </span>
                    </div>
                  )}

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    {editingId === f.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEdit(f.id)}
                          className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          title="Save"
                          aria-label="Save field edits"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 text-stone-500 hover:bg-stone-100 rounded-lg cursor-pointer"
                          title="Cancel"
                          aria-label="Cancel editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(f)}
                          className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded-lg cursor-pointer"
                          title="Edit"
                          aria-label={`Edit ${f.name || f.label}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(f.id)}
                          className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 text-stone-500 hover:text-red-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                          title="Delete"
                          aria-label={`Delete ${f.name || f.label}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ready to Download Celebration Card */}
      <div className="bg-linear-to-br from-amber-500/10 via-amber-100/40 to-stone-50 border border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-900" />
            <h4 className="text-sm font-bold text-amber-950">
              {isHindi ? 'आपका बायोडेटा डाउनलोड हेतु पूर्ण रूप से तैयार है!' : 'Your Biodata Document is Ready!'}
            </h4>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            {isHindi
              ? 'बिना किसी लॉगिन या वाटरमार्क के उच्च गुणवत्ता वाली A4 PDF या व्हाट्सएप इमेज डाउनलोड करें।'
              : 'Preview your finished document or download standard high-resolution A4 PDF instantly.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenPreview}
            className="flex-1 sm:flex-none text-xs font-bold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 px-4 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer text-center"
          >
            {isHindi ? 'पूर्वावलोकन (Preview)' : 'Preview A4'}
          </button>
          <button
            type="button"
            onClick={onOpenDownload}
            className="flex-1 sm:flex-none text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 px-5 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer text-center"
          >
            {isHindi ? 'डाउनलोड करें (Download)' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};
