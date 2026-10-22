import React, { useState, useEffect } from 'react';
import { BiodataData, CustomField } from '../types/biodata';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { sampleHinduBiodata, sampleHindiBiodata, defaultEmptyBiodata } from '../data/initialBiodata';
import { StepProgress, StepItem } from '../components/biodata-builder/StepProgress';
import { PhotoUploader } from '../components/biodata-builder/PhotoUploader';
import { HeaderSymbolSelector } from '../components/biodata-builder/HeaderSymbolSelector';
import { PersonalDetailsForm } from '../components/biodata-builder/PersonalDetailsForm';
import { HoroscopeForm } from '../components/biodata-builder/HoroscopeForm';
import { EducationCareerForm } from '../components/biodata-builder/EducationCareerForm';
import { FamilyDetailsForm } from '../components/biodata-builder/FamilyDetailsForm';
import { ContactPreferencesForm } from '../components/biodata-builder/ContactPreferencesForm';
import { CustomFieldsManager } from '../components/biodata-builder/CustomFieldsManager';
import { DesignCustomizer } from '../components/biodata-builder/DesignCustomizer';
import { BiodataTemplateView } from '../components/templates/BiodataTemplateView';
import { DownloadModal } from '../components/preview/DownloadModal';
import { LivePreviewModal } from '../components/preview/LivePreviewModal';
import { ResponsiveAd } from '../components/ads/ResponsiveAd';
import { useToast } from '../context/ToastContext';
import {
  Download,
  Eye,
  RotateCcw,
  Sparkles,
  Save,
  FileDown,
  Upload,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface BuilderPageProps {
  language: 'en' | 'hi' | 'bilingual';
  onLanguageToggle: (lang: 'en' | 'hi') => void;
}

const STEPS: StepItem[] = [
  { id: 'design', number: 1, label: 'Design & Theme', hindiLabel: 'डिजाइन व भाषा', icon: 'Palette' },
  { id: 'personal', number: 2, label: 'Personal & Photo', hindiLabel: 'व्यक्तिगत व फोटो', icon: 'User' },
  { id: 'horoscope', number: 3, label: 'Horoscope & Gotra', hindiLabel: 'कुंडली व गोत्र', icon: 'Compass' },
  { id: 'education', number: 4, label: 'Education & Job', hindiLabel: 'शिक्षा व करियर', icon: 'GraduationCap' },
  { id: 'family', number: 5, label: 'Family & Mosal', hindiLabel: 'परिवार व ननिहाल', icon: 'Users' },
  { id: 'contact', number: 6, label: 'Contact & Wishes', hindiLabel: 'संपर्क व अपेक्षाएं', icon: 'Phone' }
];

export const BuilderPage: React.FC<BuilderPageProps> = ({ language, onLanguageToggle }) => {
  const [data, setData] = useState<BiodataData>(() => storageService.loadLocalDraft());
  const [activeStep, setActiveStep] = useState<string>('design');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState<number>(0.68);
  const [lastSaved, setLastSaved] = useState<string>('Just now');
  const toast = useToast();

  const isHindi = language === 'hi' || data.language === 'hi';

  // Sync language with state
  useEffect(() => {
    if (data.language !== language) {
      setData((prev) => ({ ...prev, language: language as 'en' | 'hi' }));
    }
  }, [language]);

  // Auto-save draft on data changes (Debounced 350ms to prevent main thread blocking while typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      storageService.saveLocalDraft(data);
      setLastSaved('Auto-saved locally');
    }, 350);
    return () => clearTimeout(timer);
  }, [data]);

  const updateFields = (fields: Partial<BiodataData>) => {
    setData((prev) => ({
      ...prev,
      ...fields
    }));
  };

  const handleAddField = (field: CustomField) => {
    setData((prev) => ({
      ...prev,
      customFields: [...prev.customFields, field]
    }));
  };

  const handleRemoveField = (id: string) => {
    setData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((f) => f.id !== id)
    }));
  };

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleConfirmReset = () => {
    setData({
      ...defaultEmptyBiodata,
      language: data.language
    });
    storageService.clearDraft();
    setActiveStep('design');
    setIsResetConfirmOpen(false);
  };

  const handleReset = () => {
    setIsResetConfirmOpen(true);
  };

  const handleLoadSample = (sampleType: 'hindu' | 'hindi') => {
    if (sampleType === 'hindi') {
      setData(sampleHindiBiodata);
      onLanguageToggle('hi');
    } else {
      setData(sampleHinduBiodata);
      onLanguageToggle('en');
    }
    analyticsService.trackEvent('load_sample_builder', { templateId: sampleType });
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await storageService.importBackupJson(file);
      setData(imported);
      toast.success(
        isHindi ? 'बैकअप सफलतापूर्वक लोड हुआ!' : 'Backup successfully loaded!',
        isHindi ? 'लोड संपन्न' : 'Backup Loaded'
      );
    } catch (err: any) {
      toast.error(
        err?.message || (isHindi ? 'बैकअप लोड करने में त्रुटि' : 'Failed to import backup'),
        isHindi ? 'त्रुटि' : 'Import Error'
      );
    } finally {
      e.target.value = '';
    }
  };

  // Stepper navigation
  const currentStepIndex = STEPS.findIndex((s) => s.id === activeStep);
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveStep(STEPS[currentStepIndex - 1].id);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };
  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setActiveStep(STEPS[currentStepIndex + 1].id);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else {
      setIsDownloadModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* 1. Top Sub-header Toolbar */}
      <div className="bg-white border-b border-stone-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status info */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-stone-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'डेटा स्थानीय रूप से सुरक्षित' : 'Private Local Storage Draft'}</span>
            </span>
            <span className="hidden sm:inline text-stone-300">•</span>
            <span className="hidden sm:inline text-stone-400">{lastSaved}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLoadSample(data.language === 'hi' ? 'hindi' : 'hindu')}
              className="px-2.5 py-1 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg font-semibold cursor-pointer transition-colors"
              title="Load rich sample"
            >
              {isHindi ? 'नमूना डेटा लोड करें' : 'Load Sample'}
            </button>

            <button
              onClick={() => storageService.exportBackupJson(data)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg font-semibold cursor-pointer"
              title="Save a backup file to your computer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <label className="hidden md:flex items-center gap-1 px-2.5 py-1 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg font-semibold cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              onClick={handleReset}
              className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg font-semibold cursor-pointer transition-colors"
              title="Clear all fields"
            >
              {isHindi ? 'खाली करें' : 'Clear Form'}
            </button>

            <button
              onClick={() => setIsLivePreviewOpen(true)}
              className="lg:hidden flex items-center gap-1 px-3 py-1 bg-stone-800 text-white rounded-lg font-bold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isHindi ? 'प्रिव्यू' : 'Preview'}</span>
            </button>

            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex items-center gap-1 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-bold shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isHindi ? 'डाउनलोड PDF' : 'Download PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Step Progress Bar */}
      <StepProgress
        steps={STEPS}
        activeStep={activeStep}
        onSelectStep={(id) => setActiveStep(id)}
        language={data.language}
      />

      {/* 3. Main Workspace Dual Pane */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Column (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Design & Theme */}
            {activeStep === 'design' && (
              <div className="space-y-6">
                <DesignCustomizer
                  data={data}
                  onChange={updateFields}
                  language={data.language}
                />
                <HeaderSymbolSelector
                  selectedSymbol={data.headerSymbol}
                  customTitle={data.customHeaderTitle}
                  onSymbolChange={(sym, defaultText) =>
                    updateFields({ headerSymbol: sym, customHeaderTitle: defaultText })
                  }
                  onCustomTitleChange={(title) => updateFields({ customHeaderTitle: title })}
                  language={data.language}
                />
              </div>
            )}

            {/* Step 2: Personal & Photo */}
            {activeStep === 'personal' && (
              <div className="space-y-6">
                <PhotoUploader
                  photoUrl={data.photoUrl}
                  frameStyle={data.photoFrameStyle}
                  showPhoto={data.sectionsVisible.photo}
                  onPhotoChange={(url) => updateFields({ photoUrl: url })}
                  onFrameStyleChange={(style) => updateFields({ photoFrameStyle: style })}
                  onToggleShowPhoto={(show) =>
                    updateFields({
                      sectionsVisible: { ...data.sectionsVisible, photo: show }
                    })
                  }
                  language={data.language}
                />
                <PersonalDetailsForm
                  data={data}
                  onChange={updateFields}
                  language={data.language}
                />
                <CustomFieldsManager
                  customFields={data.customFields}
                  onAddField={handleAddField}
                  onRemoveField={handleRemoveField}
                  language={data.language}
                />
              </div>
            )}

            {/* Step 3: Horoscope & Religion */}
            {activeStep === 'horoscope' && (
              <div className="space-y-6">
                <HoroscopeForm
                  data={data}
                  onChange={updateFields}
                  language={data.language}
                />
                <CustomFieldsManager
                  customFields={data.customFields}
                  onAddField={handleAddField}
                  onRemoveField={handleRemoveField}
                  language={data.language}
                />
              </div>
            )}

            {/* Step 4: Education & Career */}
            {activeStep === 'education' && (
              <div className="space-y-6">
                <EducationCareerForm
                  data={data}
                  onChange={updateFields}
                  language={data.language}
                />
                <CustomFieldsManager
                  customFields={data.customFields}
                  onAddField={handleAddField}
                  onRemoveField={handleRemoveField}
                  language={data.language}
                />
              </div>
            )}

            {/* Step 5: Family Details */}
            {activeStep === 'family' && (
              <div className="space-y-6">
                <FamilyDetailsForm
                  data={data}
                  onChange={updateFields}
                  language={data.language}
                />
                <CustomFieldsManager
                  customFields={data.customFields}
                  onAddField={handleAddField}
                  onRemoveField={handleRemoveField}
                  language={data.language}
                />
              </div>
            )}

            {/* Step 6: Contact & Preferences */}
            {activeStep === 'contact' && (
              <div className="space-y-6">
                <ContactPreferencesForm
                  data={data}
                  onChange={updateFields}
                  language={data.language}
                />
                <CustomFieldsManager
                  customFields={data.customFields}
                  onAddField={handleAddField}
                  onRemoveField={handleRemoveField}
                  language={data.language}
                />
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xs">
              <button
                type="button"
                disabled={currentStepIndex === 0}
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isHindi ? 'पिछला चरण' : 'Previous Step'}</span>
              </button>

              <span className="text-xs text-stone-500 font-semibold">
                {isHindi ? `चरण ${currentStepIndex + 1} / 6` : `Step ${currentStepIndex + 1} of 6`}
              </span>

              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all"
              >
                <span>
                  {currentStepIndex === STEPS.length - 1
                    ? isHindi
                      ? 'पूरा हुआ • डाउनलोड करें'
                      : 'Finish & Download'
                    : isHindi
                    ? 'अगला चरण'
                    : 'Next Step'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Subtle banner */}
            <ResponsiveAd variant="in-feed" monetizationLevel="STANDARD" />
          </div>

          {/* Right Live Preview Column (5 cols on Desktop, sticky) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28 space-y-3">
            {/* Preview Toolbar */}
            <div className="bg-white border border-stone-200 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-semibold text-stone-700 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-800" />
                <span>{isHindi ? 'लाइव A4 प्रिव्यू' : 'Live Document Preview'}</span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2 text-stone-500">
                <button
                  onClick={() => setPreviewScale((s) => Math.max(0.5, s - 0.05))}
                  className="p-1 hover:text-stone-900 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono">{Math.round(previewScale * 100)}%</span>
                <button
                  onClick={() => setPreviewScale((s) => Math.min(1.0, s + 0.05))}
                  className="p-1 hover:text-stone-900 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Scoped Scrollable Preview Canvas Container */}
            <div className="bg-stone-200/80 border border-stone-300 rounded-2xl p-4 max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden flex justify-center shadow-inner">
              <BiodataTemplateView data={data} scale={previewScale} id="biodata-print-container" />
            </div>

            <div className="text-center">
              <button
                onClick={() => setIsDownloadModalOpen(true)}
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isHindi ? 'बायोडेटा डाउनलोड करें (Free)' : 'Download Free PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar for Mobile Only */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 flex items-center justify-between gap-2 z-40 shadow-lg">
        <button
          onClick={() => setIsLivePreviewOpen(true)}
          className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-4 h-4 text-stone-700" />
          <span>{isHindi ? 'लाइव प्रिव्यू देखें' : 'View Preview'}</span>
        </button>

        <button
          onClick={() => setIsDownloadModalOpen(true)}
          className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isHindi ? 'डाउनलोड करें' : 'Download PDF'}</span>
        </button>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        candidateName={data.fullName || 'Biodata'}
        templateId={data.templateId}
        language={data.language}
      />

      {/* Live Full Preview Modal */}
      <LivePreviewModal
        isOpen={isLivePreviewOpen}
        onClose={() => setIsLivePreviewOpen(false)}
        data={data}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
        onPrint={() => window.print()}
        language={data.language}
      />

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  {isHindi ? 'बायोडेटा खाली करें?' : 'Clear All Fields?'}
                </h4>
                <p className="text-xs text-stone-500">
                  {isHindi ? 'सभी फील्ड्स मिटा दी जाएंगी।' : 'All entered details will be reset.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              {isHindi
                ? 'क्या आप फॉर्म को पूरी तरह खाली करना चाहते हैं?'
                : 'Are you sure you want to clear all fields? This action cannot be undone.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {isHindi ? 'खाली करें' : 'Clear Form'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
