import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { sampleHinduBiodata, sampleHindiBiodata } from '../data/initialBiodata';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { BiodataData } from '../types/biodata';
import { BiodataTemplateView } from '../components/templates/BiodataTemplateView';
import { DownloadModal } from '../components/preview/DownloadModal';
import { Sparkles, Edit3, Download, Eye, FileText, Check } from 'lucide-react';

export interface SamplesPageProps {
  language?: 'en' | 'hi' | 'bilingual';
  onLanguageToggle?: (lang: 'en' | 'hi') => void;
}

export const SamplesPage: React.FC<SamplesPageProps> = ({ language = 'en', onLanguageToggle }) => {
  const [activeSampleTab, setActiveSampleTab] = useState<'hindu' | 'hindi'>('hindu');
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const navigate = useNavigate();

  const isHindi = language === 'hi';

  useSEO({
    title: isHindi
      ? 'विवाह बायोडाटा नमूने (वर व वधू) | BiodataCraft'
      : 'Marriage Biodata Samples & Previews for Groom & Bride | BiodataCraft',
    description: isHindi
      ? 'सुंदर हिन्दू व हिन्दी विवाह बायोडाटा के वास्तविक नमूने देखें और तुरंत एक क्लिक में संपादित करें।'
      : 'Browse authentic Indian marriage biodata samples for groom and bride in English and Hindi. Real Kundali, Gotra, and family format examples with instant editing.',
    canonicalPath: '/samples',
    breadcrumbs: [{ name: 'Samples', path: '/samples' }]
  });

  const currentSampleData: BiodataData =
    activeSampleTab === 'hindi' ? sampleHindiBiodata : sampleHinduBiodata;

  const handleEditSample = () => {
    storageService.saveLocalDraft(currentSampleData);
    if (onLanguageToggle) {
      onLanguageToggle(activeSampleTab === 'hindi' ? 'hi' : 'en');
    }
    analyticsService.trackEvent('edit_sample_clicked', { templateId: currentSampleData.templateId });
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            {isHindi ? 'रेडी-टू-यूज़ नमूने' : 'Curated Indian Formats'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1 font-cinzel">
            {isHindi ? 'विवाह बायोडेटा के उत्कृष्ट नमूने' : 'Sample Marriage Biodatas'}
          </h1>
          <p className="mt-3 text-sm text-stone-600">
            {isHindi
              ? 'देखें कि एक पेशेवर एवं सुसंस्कृत भारतीय विवाह बायोडेटा किस प्रकार दिखाई देता है। आप सीधे इन नमूनों को अपनी जानकारी से बदल सकते हैं।'
              : 'Inspect realistic, culturally accurate marriage biodatas formatted for Indian matrimonial requirements. Load any sample with one click to edit.'}
          </p>

          {/* Sample Selector Tabs */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => setActiveSampleTab('hindu')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSampleTab === 'hindu'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>English Sample (Lead Solutions Architect)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSampleTab('hindi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSampleTab === 'hindi'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span className="font-rozha">ॐ</span>
              <span>शुद्ध हिन्दी नमूना (चार्टर्ड अकाउंटेंट CA)</span>
            </button>
          </div>
        </div>

        {/* Live Sample Showcase Container */}
        <div className="bg-stone-200/90 border border-stone-300 rounded-3xl p-4 sm:p-8 shadow-inner flex flex-col items-center">
          {/* Action Bar Above Preview */}
          <div className="w-full max-w-4xl bg-white border border-stone-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {currentSampleData.fullName}
              </h3>
              <p className="text-xs text-stone-500">
                {currentSampleData.highestEducation} • {currentSampleData.jobTitle}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsDownloadOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isHindi ? 'डाउनलोड करें' : 'Download Sample'}</span>
              </button>

              <button
                type="button"
                onClick={handleEditSample}
                className="flex-1 sm:flex-none px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all hover:scale-102"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'इस बायोडेटा को एडिट करें' : 'Load & Customize This'}</span>
              </button>
            </div>
          </div>

          {/* Scaled Preview Render */}
          <div className="w-full flex justify-center overflow-x-auto pb-4">
            <div className="transform scale-[0.65] sm:scale-[0.8] md:scale-[0.9] lg:scale-100 origin-top">
              <BiodataTemplateView data={currentSampleData} id="biodata-print-container" />
            </div>
          </div>
        </div>
      </div>

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        candidateName={currentSampleData.fullName}
        templateId={currentSampleData.templateId}
        language={currentSampleData.language}
        data={currentSampleData}
      />
    </div>
  );
};
