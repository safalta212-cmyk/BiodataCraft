import React, { useState } from 'react';
import { BiodataData, CustomField } from '../../types/biodata';
import { Input } from '../ui/Form';
import { Button } from '../ui/Button';
import { ListPlus, Plus, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

interface Step5CustomFieldsProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
}

const COMMON_PRESET_FIELDS = [
  'Hobbies & Interests',
  'Visa / PR / Citizenship Status',
  'House / Property Details',
  'Kundali Match Score (Guna Milan)',
  'Dietary Habits (Pure Vegetarian)',
  'Languages Known',
  'Complexion & Appearance',
  'Maternal Grandfather Lineage (Nanihal)'
];

export const Step5CustomFields: React.FC<Step5CustomFieldsProps> = ({
  data,
  onChange
}) => {
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handleAddField = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError(null);

    if (!fieldName.trim()) {
      setInputError('Please enter a Field name.');
      return;
    }
    if (!fieldValue.trim()) {
      setInputError('Please enter a Value for this field.');
      return;
    }

    const newField: CustomField = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: fieldName.trim(),
      label: fieldName.trim(),
      value: fieldValue.trim(),
      section: 'custom'
    };

    onChange({
      customFields: [...(data.customFields || []), newField]
    });

    setFieldName('');
    setFieldValue('');
  };

  const handleRemoveField = (id: string) => {
    onChange({
      customFields: (data.customFields || []).filter((f) => f.id !== id)
    });
  };

  const handleSelectPreset = (presetName: string) => {
    setFieldName(presetName);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-lg font-bold text-stone-900 font-cinzel flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-amber-800" />
          <span>Step 5: Custom Matrimonial Fields</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Add any custom attributes, family nuances, property details, hobbies, or visa details to personalize your document.
        </p>
      </div>

      {/* 1. Add Custom Field Form Card */}
      <div className="bg-stone-50/70 p-5 sm:p-6 rounded-3xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Add New Custom Field
        </h3>

        {inputError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {inputError}
          </div>
        )}

        <form onSubmit={handleAddField} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Field Name"
                placeholder="e.g. Hobbies & Interests"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                hint="Attribute or section heading"
              />
            </div>

            <div>
              <Input
                label="Value"
                placeholder="e.g. Classical Indian music, hiking, photography"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                hint="Specific description or detail"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            {/* Quick Presets Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600">
              <span className="font-semibold text-stone-500 text-[11px]">Quick presets:</span>
              {COMMON_PRESET_FIELDS.slice(0, 4).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-amber-800 text-[11px] text-stone-700 hover:text-amber-900 cursor-pointer transition-colors"
                >
                  + {preset.split(' (')[0]}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="shrink-0"
            >
              Add Field
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Active Custom Fields List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Current Custom Fields ({(data.customFields || []).length})
          </h3>
        </div>

        {(!data.customFields || data.customFields.length === 0) ? (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-stone-300 text-center space-y-1">
            <span className="text-xs font-semibold text-stone-700 block">
              No custom fields added yet.
            </span>
            <span className="text-[11px] text-stone-400 block">
              Use the form above to add fields like Visa Status, Hobbies, Property, or Horoscope Guna Score.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.customFields.map((field) => (
              <div
                key={field.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-900 block font-cinzel">
                    {field.name || field.label}
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed font-medium">
                    {field.value}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveField(field.id)}
                  className="p-1 text-stone-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                  title="Remove field"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
