import React from 'react';
import { HEADER_SYMBOLS } from '../../data/initialBiodata';

interface HeaderSymbolSelectorProps {
  selectedSymbol: string;
  customTitle: string;
  onSymbolChange: (symbolId: string, defaultText: string) => void;
  onCustomTitleChange: (title: string) => void;
  language: 'en' | 'hi' | 'bilingual';
}

export const HeaderSymbolSelector: React.FC<HeaderSymbolSelectorProps> = ({
  selectedSymbol,
  customTitle,
  onSymbolChange,
  onCustomTitleChange,
  language
}) => {
  const isHindi = language === 'hi';

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-2xs">
      <h4 className="font-bold text-stone-900 text-sm sm:text-base mb-1">
        {isHindi ? 'शीर्ष मांगलिक मंत्र व प्रतीक (Auspicious Header)' : 'Auspicious Header & Devotional Symbol'}
      </h4>
      <p className="text-xs text-stone-500 mb-3">
        {isHindi
          ? 'बायोडेटा के शीर्ष पर शुभ मंत्र या धार्मिक वाक्य चुनें'
          : 'Choose an auspicious invocation to grace the top of your marriage biodata'}
      </p>

      {/* Preset Pill Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
        {HEADER_SYMBOLS.map((item) => {
          const isSelected = selectedSymbol === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSymbolChange(item.id, item.shloka)}
              className={`p-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer truncate ${
                isSelected
                  ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-800'
                  : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
              }`}
              title={item.label}
            >
              <div className="truncate font-semibold">{item.label}</div>
              <span className="text-[10px] text-stone-600 block">{item.religion}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Title Input */}
      {selectedSymbol !== 'none' && (
        <div className="mt-3">
          <label className="text-xs font-semibold text-stone-700 block mb-1">
            {isHindi ? 'कस्टम शीर्ष लेख (Edit Header Text)' : 'Header Text (Freely Editable)'}
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => onCustomTitleChange(e.target.value)}
            placeholder="e.g. ॥ श्री गणेशाय नमः ॥ or BIO-DATA"
            className="w-full text-sm font-medium border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
          />
        </div>
      )}
    </div>
  );
};
