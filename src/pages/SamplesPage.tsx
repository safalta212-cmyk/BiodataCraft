import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { sampleHinduBiodata, sampleHindiBiodata } from '../data/initialBiodata';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { BiodataData } from '../types/biodata';
import { BiodataTemplateView } from '../components/templates/BiodataTemplateView';
import { DownloadModal } from '../components/preview/DownloadModal';
import {
  Sparkles,
  Edit3,
  Download,
  Eye,
  FileText,
  Check,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

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

        {/* Educational Content & Guidelines Section */}
        <section className="mt-16 max-w-5xl mx-auto space-y-12">
          {/* Essential Pillars */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Matrimonial Formatting Standards
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-cinzel mt-1">
                Anatomy of an Auspicious Marriage Biodata
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                A well-crafted Indian matrimonial profile balances ancestral heritage, personal accomplishments, and religious respect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base font-cinzel mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>1. Personal & Astrological (Kundali) Details</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Accurate Date of Birth, exact Time of Birth (with AM/PM), Birth City, Rashi (Moon Sign), Nakshatra, Charan, Gotra, and Manglik or Anshik Manglik status. These allow matching pandits to verify Guna Milan without back-and-forth phone calls.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base font-cinzel mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>2. Education & Professional Credentials</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Clearly state highest qualification (e.g., B.Tech, MBA, MBBS, CA), college or university name, current designation, employer organization, and workplace city. Mentioning package or salary range is optional based on family preference.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base font-cinzel mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>3. Family Lineage & Mosal / Nanihal</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Father's name and occupation (business, retired officer, serviceman), Mother's name, sibling count with their marital status, and Maternal Uncle (Mama Ji / Mosal) details including village origin to verify cross-family ancestral background.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <h3 className="font-bold text-stone-900 text-sm sm:text-base font-cinzel mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>4. Decent Photograph & Verified Contact</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Use a professional studio portrait or well-lit traditional attire photograph with no heavy digital filters. Include father's or elder's mobile number, family home address, and WhatsApp contact for respectful family communication.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Steps Guide */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 shadow-lg">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Instant Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-cinzel mt-1 text-white">
                How to Personalize Your Biodata in 3 Minutes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mx-auto mb-3 font-cinzel text-lg">
                  1
                </div>
                <h3 className="font-bold text-sm text-white mb-1">Pick a Sample or Template</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Click "Load & Customize This" above or choose from our 10+ cultural themes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mx-auto mb-3 font-cinzel text-lg">
                  2
                </div>
                <h3 className="font-bold text-sm text-white mb-1">Fill Your Family & Bio Details</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Type in English, Hindi, or bilingual script. Real-time preview updates live.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mx-auto mb-3 font-cinzel text-lg">
                  3
                </div>
                <h3 className="font-bold text-sm text-white mb-1">Free PDF & WhatsApp Image</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Download a print-ready vector A4 PDF or crisp WhatsApp image without watermarks.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/create"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-md hover:scale-102 flex items-center gap-2"
              >
                <span>Start Creating Your Biodata</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/templates"
                className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-semibold rounded-xl text-sm transition-all border border-stone-700"
              >
                Browse All 10+ Templates
              </Link>
            </div>
          </div>

          {/* Internal Links Hub */}
          <div className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 font-cinzel mb-4 text-center">
              Explore Community-Specific Formats & Guides
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <Link
                to="/marriage-biodata-format"
                className="p-3 bg-white rounded-xl border border-stone-200 font-medium text-stone-800 hover:text-amber-800 hover:border-amber-300 transition-colors shadow-2xs"
              >
                Marriage Biodata Formats
              </Link>
              <Link
                to="/marriage-biodata"
                className="p-3 bg-white rounded-xl border border-stone-200 font-medium text-stone-800 hover:text-amber-800 hover:border-amber-300 transition-colors shadow-2xs"
              >
                Complete Biodata Guide
              </Link>
              <Link
                to="/hindu-marriage-biodata"
                className="p-3 bg-white rounded-xl border border-stone-200 font-medium text-stone-800 hover:text-amber-800 hover:border-amber-300 transition-colors shadow-2xs"
              >
                Hindu Marriage Biodata
              </Link>
              <Link
                to="/muslim-marriage-biodata"
                className="p-3 bg-white rounded-xl border border-stone-200 font-medium text-stone-800 hover:text-amber-800 hover:border-amber-300 transition-colors shadow-2xs"
              >
                Muslim Nikah Biodata
              </Link>
              <Link
                to="/yadav-marriage-biodata"
                className="p-3 bg-white rounded-xl border border-stone-200 font-medium text-stone-800 hover:text-amber-800 hover:border-amber-300 transition-colors shadow-2xs"
              >
                Yadav Samaj Biodata
              </Link>
              <Link
                to="/marathi-biodata"
                className="p-3 bg-white rounded-xl border border-stone-200 font-medium text-stone-800 hover:text-amber-800 hover:border-amber-300 transition-colors shadow-2xs"
              >
                Marathi Lagna Biodata
              </Link>
              <Link
                to="/bengali-marriage-biodata"
                className="p-3 bg-white rounded-xl border border-stone-200 font-medium text-stone-800 hover:text-amber-800 hover:border-amber-300 transition-colors shadow-2xs"
              >
                Bengali Matrimony Biodata
              </Link>
              <Link
                to="/faq"
                className="p-3 bg-white rounded-xl border border-stone-200 font-medium text-stone-800 hover:text-amber-800 hover:border-amber-300 transition-colors shadow-2xs"
              >
                Frequently Asked Questions
              </Link>
            </div>
          </div>
        </section>
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
