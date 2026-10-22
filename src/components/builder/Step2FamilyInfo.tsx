import React from 'react';
import { BiodataData, SiblingEntry } from '../../types/biodata';
import { Input, Textarea, Select } from '../ui/Form';
import { Button } from '../ui/Button';
import { Users, Plus, Trash2, Home, Heart, Award } from 'lucide-react';

interface Step2FamilyInfoProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  errors: Record<string, string>;
}

export const Step2FamilyInfo: React.FC<Step2FamilyInfoProps> = ({
  data,
  onChange,
  errors
}) => {
  // Sibling Helpers
  const addBrother = () => {
    const newBrother: SiblingEntry = {
      id: `brother_${Date.now()}`,
      name: '',
      maritalStatus: 'Unmarried',
      occupation: '',
      relationType: 'Younger'
    };
    const updated = [...(data.brothersList || []), newBrother];
    onChange({
      brothersList: updated,
      brothersDetails: formatSiblingsSummary(updated)
    });
  };

  const removeBrother = (id: string) => {
    const updated = (data.brothersList || []).filter((b) => b.id !== id);
    onChange({
      brothersList: updated,
      brothersDetails: formatSiblingsSummary(updated)
    });
  };

  const updateBrother = (id: string, updates: Partial<SiblingEntry>) => {
    const updated = (data.brothersList || []).map((b) =>
      b.id === id ? { ...b, ...updates } : b
    );
    onChange({
      brothersList: updated,
      brothersDetails: formatSiblingsSummary(updated)
    });
  };

  const addSister = () => {
    const newSister: SiblingEntry = {
      id: `sister_${Date.now()}`,
      name: '',
      maritalStatus: 'Unmarried',
      occupation: '',
      relationType: 'Younger'
    };
    const updated = [...(data.sistersList || []), newSister];
    onChange({
      sistersList: updated,
      sistersDetails: formatSiblingsSummary(updated)
    });
  };

  const removeSister = (id: string) => {
    const updated = (data.sistersList || []).filter((s) => s.id !== id);
    onChange({
      sistersList: updated,
      sistersDetails: formatSiblingsSummary(updated)
    });
  };

  const updateSister = (id: string, updates: Partial<SiblingEntry>) => {
    const updated = (data.sistersList || []).map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    onChange({
      sistersList: updated,
      sistersDetails: formatSiblingsSummary(updated)
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-lg font-bold text-stone-900 font-cinzel flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-800" />
          <span>Step 2: Family Background & Lineage</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Enter parents, repeatable brother and sister details, family status, location, and cultural background.
        </p>
      </div>

      {/* 1. Parents Information */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Parents Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Father's Name"
            required
            placeholder="e.g. Dr. Devendra Kumar Sharma"
            value={data.fatherName}
            onChange={(e) => onChange({ fatherName: e.target.value })}
            error={errors.fatherName}
          />

          <Input
            label="Father's Occupation"
            placeholder="e.g. Chief Medical Officer (Retd.) / Business"
            value={data.fatherOccupation}
            onChange={(e) => onChange({ fatherOccupation: e.target.value })}
          />

          <Input
            label="Mother's Name"
            required
            placeholder="e.g. Mrs. Sunita Sharma"
            value={data.motherName}
            onChange={(e) => onChange({ motherName: e.target.value })}
            error={errors.motherName}
          />

          <Input
            label="Mother's Occupation"
            placeholder="e.g. Homemaker / School Principal / Doctor"
            value={data.motherOccupation}
            onChange={(e) => onChange({ motherOccupation: e.target.value })}
          />
        </div>
      </div>

      {/* 2. Repeatable Brothers List */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Brother(s) Details
            </h3>
            <p className="text-[11px] text-stone-500">
              Add individual entries for each brother.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addBrother}
            leftIcon={<Plus className="w-3.5 h-3.5 text-amber-800" />}
            className="text-xs bg-white"
          >
            Add Brother
          </Button>
        </div>

        {(!data.brothersList || data.brothersList.length === 0) ? (
          <div className="p-4 bg-white rounded-xl border border-dashed border-stone-300 text-center text-xs text-stone-500">
            No brothers added. Click &quot;Add Brother&quot; if the candidate has brothers.
          </div>
        ) : (
          <div className="space-y-3">
            {data.brothersList.map((brother, idx) => (
              <div
                key={brother.id}
                className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 relative shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-bold text-xs text-stone-800">
                    Brother #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBrother(brother.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                    title="Remove Brother"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Brother's Name"
                    placeholder="e.g. Anurag Sharma"
                    value={brother.name}
                    onChange={(e) => updateBrother(brother.id, { name: e.target.value })}
                  />

                  <Select
                    label="Relation / Seniority"
                    value={brother.relationType || 'Younger'}
                    onChange={(e) =>
                      updateBrother(brother.id, { relationType: e.target.value })
                    }
                    options={[
                      { value: 'Elder', label: 'Elder Brother (बड़ा भाई)' },
                      { value: 'Younger', label: 'Younger Brother (छोटा भाई)' }
                    ]}
                  />

                  <Select
                    label="Marital Status"
                    value={brother.maritalStatus}
                    onChange={(e) =>
                      updateBrother(brother.id, { maritalStatus: e.target.value })
                    }
                    options={[
                      { value: 'Unmarried', label: 'Unmarried' },
                      { value: 'Married', label: 'Married' },
                      { value: 'Engaged', label: 'Engaged' }
                    ]}
                  />

                  <div className="sm:col-span-3">
                    <Input
                      label="Education / Profession Details"
                      placeholder="e.g. Software Architect at Adobe / Studying MS in Germany"
                      value={brother.occupation}
                      onChange={(e) =>
                        updateBrother(brother.id, { occupation: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Repeatable Sisters List */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Sister(s) Details
            </h3>
            <p className="text-[11px] text-stone-500">
              Add individual entries for each sister.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSister}
            leftIcon={<Plus className="w-3.5 h-3.5 text-amber-800" />}
            className="text-xs bg-white"
          >
            Add Sister
          </Button>
        </div>

        {(!data.sistersList || data.sistersList.length === 0) ? (
          <div className="p-4 bg-white rounded-xl border border-dashed border-stone-300 text-center text-xs text-stone-500">
            No sisters added. Click &quot;Add Sister&quot; if the candidate has sisters.
          </div>
        ) : (
          <div className="space-y-3">
            {data.sistersList.map((sister, idx) => (
              <div
                key={sister.id}
                className="bg-white p-4 rounded-xl border border-stone-200 space-y-3 relative shadow-2xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-bold text-xs text-stone-800">
                    Sister #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSister(sister.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                    title="Remove Sister"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Sister's Name"
                    placeholder="e.g. Neha Sharma"
                    value={sister.name}
                    onChange={(e) => updateSister(sister.id, { name: e.target.value })}
                  />

                  <Select
                    label="Relation / Seniority"
                    value={sister.relationType || 'Younger'}
                    onChange={(e) =>
                      updateSister(sister.id, { relationType: e.target.value })
                    }
                    options={[
                      { value: 'Elder', label: 'Elder Sister (बड़ी बहन)' },
                      { value: 'Younger', label: 'Younger Sister (छोटी बहन)' }
                    ]}
                  />

                  <Select
                    label="Marital Status"
                    value={sister.maritalStatus}
                    onChange={(e) =>
                      updateSister(sister.id, { maritalStatus: e.target.value })
                    }
                    options={[
                      { value: 'Unmarried', label: 'Unmarried' },
                      { value: 'Married', label: 'Married' },
                      { value: 'Engaged', label: 'Engaged' }
                    ]}
                  />

                  <div className="sm:col-span-3">
                    <Input
                      label="Education / In-Laws / Settlement Details"
                      placeholder="e.g. Married in Pune (Husband: Senior VP at Citi)"
                      value={sister.occupation}
                      onChange={(e) =>
                        updateSister(sister.id, { occupation: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Family Structure, Status & Location */}
      <div className="bg-stone-50/70 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Family Structure & Background
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Family Type"
            value={data.familyType}
            onChange={(e) => onChange({ familyType: e.target.value })}
            options={[
              { value: 'Nuclear', label: 'Nuclear Family (एकल परिवार)' },
              { value: 'Joint', label: 'Joint Family (संयुक्त परिवार)' },
              { value: 'Nuclear with strong joint roots', label: 'Nuclear with joint roots' }
            ]}
          />

          <Select
            label="Family Status"
            value={data.familyStatus}
            onChange={(e) => onChange({ familyStatus: e.target.value })}
            options={[
              { value: 'Upper Middle Class', label: 'Upper Middle Class' },
              { value: 'Middle Class', label: 'Middle Class' },
              { value: 'Affluent / High Net Worth', label: 'Affluent / High Net Worth' },
              { value: 'Respected Traditional Family', label: 'Respected Traditional Family' }
            ]}
          />

          <div className="sm:col-span-2">
            <Input
              label="Family Location / Ancestral City"
              placeholder="e.g. Vaishali Nagar, Jaipur (Native: Jodhpur, Rajasthan)"
              value={data.familyLocation || data.nativePlace}
              onChange={(e) =>
                onChange({ familyLocation: e.target.value, nativePlace: e.target.value })
              }
              hint="Current family residence and ancestral hometown"
            />
          </div>

          <div className="sm:col-span-2">
            <Textarea
              label="Family Description & Values"
              placeholder="e.g. Cultured and respected family with a blend of traditional values and progressive outlook. Father is a retired medical officer, mother an educator."
              value={data.familyDescription}
              onChange={(e) => onChange({ familyDescription: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function formatSiblingsSummary(entries: SiblingEntry[]): string {
  if (entries.length === 0) return 'None';
  return entries
    .map((e) => `${e.relationType || ''} ${e.name} (${e.maritalStatus}${e.occupation ? `, ${e.occupation}` : ''})`.trim())
    .join('; ');
}
