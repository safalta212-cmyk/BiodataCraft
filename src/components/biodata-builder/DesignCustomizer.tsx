import React from 'react';
import { BiodataData, TemplateId } from '../../types/biodata';
import { TEMPLATES } from '../../data/initialBiodata';
import { Palette, Type, Globe, Check, Eye } from 'lucide-react';

interface DesignCustomizerProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
}

const COLOR_PRESETS = [
  { name: 'Royal Crimson', hex: '#7a1426' },
  { name: 'Royal Navy', hex: '#102a43' },
  { name: 'Vedic Saffron', hex: '#b44a0e' },
  { name: 'Deep Emerald', hex: '#064e3b' },
  { name: 'Rose Wine', hex: '#881337' },
  { name: 'Peacock Teal', hex: '#0f766e' },
  { name: 'Classic Bronze', hex: '#78350f' }
];

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  data,
  onChange,
  language
}) => {
  const isHindi = language === 'hi';

  const handleSelectTemplate = (templateId: TemplateId) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      onChange({
        templateId,
        themeColor: template.primaryColor
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Language Selection */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-amber-800" />
          <div>
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">
              {isHindi ? 'बायोडेटा की भाषा चुनें (Language)' : 'Biodata Language Selection'}
            </h4>
            <p className="text-xs text-stone-500">
              {isHindi
                ? 'अंग्रेजी अथवा शुद्ध हिन्दी में बायोडेटा तैयार करें'
                : 'Generate your biodata in English or authentic Hindi Unicode'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => onChange({ language: 'en' })}
            className={`py-2.5 px-4 rounded-xl border text-center transition-all cursor-pointer ${
              data.language === 'en'
                ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-800/20'
                : 'border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="text-sm font-bold">English (Standard)</div>
            <span className="text-[11px] text-stone-500">Global & Pan-India</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ language: 'hi' })}
            className={`py-2.5 px-4 rounded-xl border text-center transition-all cursor-pointer ${
              data.language === 'hi'
                ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-800/20'
                : 'border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <div className="text-sm font-bold">हिन्दी (Hindi Devanagari)</div>
            <span className="text-[11px] text-stone-500">पारंपरिक व सुसंस्कृत</span>
          </button>
        </div>
      </div>

      {/* 2. Template Selection Grid */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-5 h-5 text-amber-800" />
          <div>
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">
              {isHindi ? 'डिजाइन एवं टेम्पलेट चयन (Templates)' : 'Design Templates (6 Authentic Themes)'}
            </h4>
            <p className="text-xs text-stone-500">
              {isHindi
                ? 'राजपूती, वैदिक, कॉर्पोरेट या आधुनिक शैली में से एक चुनें'
                : 'Select an authentic Indian cultural design layout'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TEMPLATES.map((tmpl) => {
            const isSelected = data.templateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-800 bg-amber-50/50 shadow-md ring-1 ring-amber-800'
                    : 'border-stone-200 hover:border-stone-300 bg-white hover:shadow-xs'
                }`}
              >
                {/* Header Swatch */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs"
                      style={{ backgroundColor: tmpl.primaryColor }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-stone-300"
                      style={{ backgroundColor: tmpl.secondaryColor }}
                    />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {tmpl.category}
                  </span>
                </div>

                <div className="font-bold text-stone-900 text-sm">{tmpl.name}</div>
                <div className="text-[11px] text-stone-500 line-clamp-1">{tmpl.tagline}</div>
                <div className="text-[10px] text-amber-900 font-medium mt-2 bg-amber-50/70 p-1.5 rounded">
                  ★ {tmpl.popularFor}
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-amber-800 text-white p-1 rounded-full shadow">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Typography & Theme Color */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Font Family */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Type className="w-4 h-4 text-amber-800" />
            <span className="text-xs font-bold text-stone-800">
              {isHindi ? 'शीर्षक फ़ॉन्ट (Typography Style)' : 'Typography Font Style'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: 'cinzel', label: 'Cinzel (Regal Serif)', previewClass: 'font-cinzel' },
                { id: 'rozha', label: 'Rozha (Vedic Serif)', previewClass: 'font-rozha' },
                { id: 'playfair', label: 'Playfair (Classic)', previewClass: 'font-playfair' },
                { id: 'sans', label: 'Modern Sans', previewClass: 'font-devanagari' }
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ fontFamily: f.id })}
                className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  data.fontFamily === f.id
                    ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className={`text-sm truncate ${f.previewClass}`}>
                  {f.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Theme Color Preset */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Palette className="w-4 h-4 text-amber-800" />
            <span className="text-xs font-bold text-stone-800">
              {isHindi ? 'थीम रंग (Theme Accent Color)' : 'Accent Color Palette'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {COLOR_PRESETS.map((color) => {
              const isSelected = (data.themeColor || '').toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => onChange({ themeColor: color.hex })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer relative flex items-center justify-center ${
                    isSelected ? 'scale-115 border-stone-900 shadow-md ring-2 ring-stone-400' : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Section Visibility Toggles */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-amber-800" />
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              {isHindi ? 'भाग छिपाएं या दिखाएं (Section Toggles)' : 'Section Visibility Control'}
            </h4>
            <p className="text-xs text-stone-500">
              {isHindi
                ? 'यदि आप ज्योतिष, कुंडली या अपेक्षाएं नहीं जोड़ना चाहते तो टॉगल बंद करें'
                : 'Turn sections on or off to tailor your biodata format'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-semibold text-stone-700">
          {[
            { key: 'personal', label: isHindi ? 'व्यक्तिगत विवरण' : 'Personal Details' },
            { key: 'horoscope', label: isHindi ? 'ज्योतिष / कुंडली' : 'Horoscope & Gotra' },
            { key: 'education', label: isHindi ? 'शिक्षा एवं आजीविका' : 'Education & Career' },
            { key: 'family', label: isHindi ? 'पारिवारिक पृष्ठभूमि' : 'Family Details' },
            { key: 'contact', label: isHindi ? 'संपर्क सूत्र' : 'Contact Information' },
            { key: 'preferences', label: isHindi ? 'जीवनसाथी अपेक्षाएं' : 'Partner Expectations' }
          ].map((sec) => {
            const isChecked = data.sectionsVisible[sec.key as keyof typeof data.sectionsVisible];
            return (
              <label
                key={sec.key}
                className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    onChange({
                      sectionsVisible: {
                        ...data.sectionsVisible,
                        [sec.key]: e.target.checked
                      }
                    })
                  }
                  className="rounded text-amber-800 focus:ring-amber-800 w-4 h-4 cursor-pointer"
                />
                <span className="truncate">{sec.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
