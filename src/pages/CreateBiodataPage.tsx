import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useToast } from '../context/ToastContext';
import { BiodataData, TemplateId } from '../types/biodata';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import {
  defaultEmptyBiodata,
  sampleHinduBiodata,
  sampleHindiBiodata,
  TEMPLATES,
  HEADER_SYMBOLS
} from '../data/initialBiodata';
import { validationUtils } from '../utils/validation';
import { AdFlowService } from '../services/adFlowService';

// Step Form Components
import { StepIndicator, BUILDER_STEPS } from '../components/biodata-builder/StepIndicator';
import { Step1PersonalForm } from '../components/biodata-builder/Step1PersonalForm';
import { Step2FamilyForm } from '../components/biodata-builder/Step2FamilyForm';
import { Step3ContactForm } from '../components/biodata-builder/Step3ContactForm';
import { Step4PhotoStudio } from '../components/biodata-builder/Step4PhotoStudio';
import { Step5CustomFields } from '../components/biodata-builder/Step5CustomFields';

// Preview and Download Components
import { BiodataTemplateView } from '../components/templates/BiodataTemplateView';
import { DownloadModal } from '../components/preview/DownloadModal';
import { LivePreviewModal } from '../components/preview/LivePreviewModal';

// Icons
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Download,
  RotateCcw,
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Palette,
  FileCheck2,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

export const CreateBiodataPage: React.FC = () => {
  useSEO({
    title: 'Create Marriage Biodata Online - Free PDF Generator | BiodataCraft',
    description:
      'Professional Indian Marriage Biodata Maker. Create elegant Hindu, Jain, Sikh & Muslim biodatas in 5 easy steps without signup. 100% private client-side PDF download.',
    canonicalPath: '/create',
    breadcrumbs: [{ name: 'Create Biodata', path: '/create' }],
    includeWebApplicationSchema: true
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const templateFromQuery = searchParams.get('template');

  // Load from local browser storage (client-side only, NO Firestore)
  const [data, setData] = useState<BiodataData>(() => {
    const draft = storageService.loadLocalDraft();
    if (templateFromQuery && TEMPLATES.some((t) => t.id === templateFromQuery)) {
      draft.templateId = templateFromQuery as TemplateId;
      const tmpl = TEMPLATES.find((t) => t.id === templateFromQuery);
      if (tmpl) draft.themeColor = tmpl.primaryColor;
    }
    return draft;
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Modals & UI States
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState<boolean>(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [previewScale, setPreviewScale] = useState<number>(0.56);
  const [saveStatus, setSaveStatus] = useState<string>('Draft saved locally');

  const isHindi = language === 'hi';

  // Track initial page view & builder start
  useEffect(() => {
    analyticsService.trackEvent('create_page_view', {
      templateId: data.templateId,
      language
    });
    analyticsService.trackBuilderStarted(
      data.templateId,
      AdFlowService.detectCreationMode(data)
    );
  }, []);

  // Sync template from query parameter if changed
  useEffect(() => {
    if (templateFromQuery && TEMPLATES.some((t) => t.id === templateFromQuery)) {
      const tmpl = TEMPLATES.find((t) => t.id === templateFromQuery);
      setData((prev) => ({
        ...prev,
        templateId: templateFromQuery as TemplateId,
        themeColor: tmpl ? tmpl.primaryColor : prev.themeColor
      }));
    }
  }, [templateFromQuery]);

  // Client-side Autosave (Debounced 350ms to prevent main thread blocking while typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      storageService.saveLocalDraft(data);
      setSaveStatus('Auto-saved locally');
    }, 350);
    return () => clearTimeout(timer);
  }, [data]);

  const updateFields = (fields: Partial<BiodataData>) => {
    setData((prev) => ({ ...prev, ...fields }));
    // Clear field errors as user edits
    if (Object.keys(stepErrors).length > 0) {
      setStepErrors({});
    }
  };

  // Step Validation Logic
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      // Step 1: Personal Information Validation
      if (!validationUtils.isRequired(data.fullName)) {
        errors.fullName = isHindi ? 'उम्मीदवार का पूरा नाम अनिवार्य है' : 'Full Name is required';
      } else if (data.fullName.trim().length < 2) {
        errors.fullName = isHindi ? 'कृपया कम से कम 2 अक्षर दर्ज करें' : 'Name must be at least 2 characters';
      }

      if (!validationUtils.isRequired(data.dob)) {
        errors.dob = isHindi ? 'जन्म तिथि अनिवार्य है' : 'Date of Birth is required';
      } else {
        const dobCheck = validationUtils.validateDob(data.dob);
        if (!dobCheck.valid) {
          errors.dob = dobCheck.error || 'Invalid Date of Birth';
        }
      }
    } else if (stepNumber === 2) {
      // Step 2: Family Information Validation
      if (!validationUtils.isRequired(data.fatherName)) {
        errors.fatherName = isHindi ? 'पिता का नाम अनिवार्य है' : "Father's Name is required";
      }
      if (!validationUtils.isRequired(data.motherName)) {
        errors.motherName = isHindi ? 'माता का नाम अनिवार्य है' : "Mother's Name is required";
      }
    } else if (stepNumber === 3) {
      // Step 3: Contact Information Validation
      if (!validationUtils.isRequired(data.contactPerson)) {
        errors.contactPerson = isHindi ? 'संपर्क व्यक्ति का नाम अनिवार्य है' : 'Contact Person is required';
      }

      if (!validationUtils.isRequired(data.mobileNumber)) {
        errors.mobileNumber = isHindi ? 'मोबाइल नंबर अनिवार्य है' : 'Mobile Number is required';
      } else if (!validationUtils.isValidIndianMobile(data.mobileNumber)) {
        errors.mobileNumber = isHindi
          ? 'मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (6-9 से शुरू)'
          : 'Enter valid 10-digit Indian mobile number (e.g. 9829012345)';
      }

      if (data.email && !validationUtils.isValidEmail(data.email)) {
        errors.email = isHindi ? 'मान्य ईमेल पता दर्ज करें' : 'Please enter a valid email address';
      }

      if (!validationUtils.isRequired(data.residentialAddress)) {
        errors.residentialAddress = isHindi ? 'निवास का पता अनिवार्य है' : 'Residential Address is required';
      }

      if (!validationUtils.isRequired(data.city)) {
        errors.city = isHindi ? 'शहर का नाम अनिवार्य है' : 'City is required';
      }

      if (!validationUtils.isRequired(data.state)) {
        errors.state = isHindi ? 'राज्य चुनें' : 'State is required';
      }

      if (!validationUtils.isRequired(data.pincode)) {
        errors.pincode = isHindi ? 'पिन कोड अनिवार्य है' : 'PIN Code is required';
      } else if (!validationUtils.isValidIndianPincode(data.pincode)) {
        errors.pincode = isHindi ? 'मान्य 6-अंकीय भारतीय पिन कोड दर्ज करें' : 'Enter valid 6-digit Indian PIN code';
      }
    }

    setStepErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error(
        isHindi ? 'कृपया आगे बढ़ने से पहले अनिवार्य फ़ील्ड भरें।' : 'Please fill all required fields correctly to proceed.',
        'Validation Notice'
      );
      return false;
    }

    return true;
  };

  // Next Step Handler
  const handleNext = () => {
    if (validateStep(currentStep)) {
      analyticsService.trackBuilderStepCompleted(currentStep, data.templateId);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Step 5 completed: open preview or download
        setIsDownloadModalOpen(true);
      }
    }
  };

  // Back Step Handler
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Direct Step Selection from Stepper
  const handleSelectStep = (stepNum: number) => {
    if (stepNum < currentStep) {
      setCurrentStep(stepNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (stepNum === currentStep) {
      // do nothing
    } else {
      // Validate current before jumping forward
      if (validateStep(currentStep)) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps((prev) => [...prev, currentStep]);
        }
        setCurrentStep(stepNum);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Explicit Save Draft Button (Browser Only)
  const handleSaveDraft = () => {
    storageService.saveLocalDraft(data);
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setSaveStatus(`Saved at ${now}`);
    toast.success(
      isHindi
        ? 'बायोडेटा केवल आपके ब्राउज़र में सुरक्षित रूप से सहेजा गया है।'
        : 'Biodata temporarily saved in your browser storage. Zero server uploads.',
      'Draft Saved'
    );
  };

  // Clear / Start Over Confirmation
  const handleConfirmClear = () => {
    setData({
      ...defaultEmptyBiodata,
      language: data.language
    });
    storageService.clearDraft();
    setCompletedSteps([]);
    setCurrentStep(1);
    setStepErrors({});
    setIsClearModalOpen(false);
    toast.info(
      isHindi ? 'सभी फ़ील्ड खाली कर दिए गए हैं।' : 'Biodata workspace reset. Ready for a fresh start.',
      'Workspace Cleared'
    );
  };

  // Load Sample Matrimonial Biodata
  const handleLoadSample = (type: 'hindu' | 'modern') => {
    const sample = type === 'hindu' ? sampleHinduBiodata : { ...sampleHinduBiodata, templateId: 'modern-elegance', highestEducation: 'M.S. in Computer Science', occupation: 'Staff Software Architect' };
    setData(sample);
    storageService.saveLocalDraft(sample);
    setCompletedSteps([1, 2, 3, 4, 5]);
    setIsSampleModalOpen(false);
    toast.success(
      isHindi
        ? 'नमूना बायोडेटा लोड किया गया! अब आप सीधे जांच या कस्टमाइज़ कर सकते हैं।'
        : 'Sample Indian biodata loaded! You can customize or test download now.',
      'Sample Ready'
    );
  };

  // Session Cleanup Callback after completed download
  const handleClearSessionAfterDownload = () => {
    storageService.clearDraft();
    setData(defaultEmptyBiodata);
    setCompletedSteps([]);
    setCurrentStep(1);
    toast.info(
      isHindi
        ? 'सत्र पूरा हुआ: गोपनीयता सुरक्षा हेतु स्थानीय ड्राफ्ट मिटा दिया गया है।'
        : 'Session cleaned up: Local draft cleared from browser memory for your privacy.',
      'Session Finished'
    );
  };

  // Template switch helper
  const handleSelectTemplate = (templateId: TemplateId) => {
    const tmpl = TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      updateFields({
        templateId,
        themeColor: tmpl.primaryColor
      });
      analyticsService.trackTemplateSelected(templateId, 'builder');
      toast.info(`Switched design to ${tmpl.name}`, 'Template Updated');
    }
  };

  const handleOpenLivePreview = () => {
    setIsLivePreviewOpen(true);
    analyticsService.trackPreviewGenerated(data.templateId);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 pb-24">
      {/* Top Builder App Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand & Mode */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-w-0"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="h-4 w-[1px] bg-stone-200 hidden sm:block" />

            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-extrabold text-stone-900 font-cinzel leading-tight truncate">
                Biodata Builder
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                <span className="hidden md:inline">{saveStatus}</span>
                <span className="hidden md:inline">•</span>
                <span className="text-emerald-700 font-semibold truncate">100% Client-Side</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Language, Sample, Reset, Download) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Toggle */}
            <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 min-h-[34px] sm:min-h-0 rounded-md transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ENG
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 min-h-[34px] sm:min-h-0 rounded-md transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Load Sample Button (md+) */}
            <button
              type="button"
              onClick={() => setIsSampleModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Fill form with sample data to test"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Sample</span>
            </button>

            {/* Save Draft Button (sm+) */}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Save draft temporarily in browser storage"
            >
              <Save className="w-3.5 h-3.5 text-stone-600" />
              <span>Save Draft</span>
            </button>

            {/* Clear / Start Over */}
            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-stone-500 hover:text-red-700 p-2 sm:px-2.5 sm:py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
              title="Clear all fields"
              aria-label="Reset form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Download Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 px-3 sm:px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer min-h-[38px] sm:min-h-0"
            >
              <Download className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span className="hidden xs:inline">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Column: Stepper, Active Step Form & Nav (xl:col-span-7) */}
          <div className="xl:col-span-7 space-y-6">
            {/* Step Progress Bar */}
            <StepIndicator
              currentStep={currentStep}
              onSelectStep={handleSelectStep}
              completedSteps={completedSteps}
              language={language}
            />

            {/* Step Content Shell */}
            <div className="transition-all duration-200">
              {currentStep === 1 && (
                <Step1PersonalForm
                  data={data}
                  onChange={updateFields}
                  language={language}
                  errors={stepErrors}
                />
              )}

              {currentStep === 2 && (
                <Step2FamilyForm
                  data={data}
                  onChange={updateFields}
                  language={language}
                  errors={stepErrors}
                />
              )}

              {currentStep === 3 && (
                <Step3ContactForm
                  data={data}
                  onChange={updateFields}
                  language={language}
                  errors={stepErrors}
                />
              )}

              {currentStep === 4 && (
                <Step4PhotoStudio
                  data={data}
                  onChange={updateFields}
                  language={language}
                  errors={stepErrors}
                />
              )}

              {currentStep === 5 && (
                <Step5CustomFields
                  data={data}
                  onChange={updateFields}
                  language={language}
                  errors={stepErrors}
                  onOpenPreview={handleOpenLivePreview}
                  onOpenDownload={() => setIsDownloadModalOpen(true)}
                />
              )}
            </div>

            {/* Bottom Step Actions / Navigation Bar - Sticky on mobile screens */}
            <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t sm:border border-stone-200/90 rounded-none sm:rounded-2xl p-3 sm:p-4 shadow-lg sm:shadow-xs flex items-center justify-between gap-2 sm:gap-4 -mx-4 px-4 sm:mx-0 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-300 min-h-[44px] px-3.5 sm:px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'पिछला' : 'Back'}</span>
              </button>

              <div className="text-center hidden sm:block">
                <span className="text-xs font-semibold text-stone-500">
                  Step {currentStep} of {BUILDER_STEPS.length}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenLivePreview}
                  className="xl:hidden inline-flex items-center justify-center gap-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 min-h-[44px] px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-stone-600 shrink-0" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 min-h-[44px] px-3.5 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <span className="truncate max-w-[130px] xs:max-w-none">
                    {currentStep === 5
                      ? isHindi ? 'डाउनलोड करें' : 'Finish & Download'
                      : isHindi ? 'अगला चरण' : 'Next Step'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-amber-200 shrink-0" />
                </button>
              </div>
            </div>

            {/* Zero-Storage Privacy Footer Guarantee */}
            <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-950">
                  {isHindi ? '100% निजी एवं गोपनीय (Zero-Storage Guarantee)' : 'Strict Zero-Storage Privacy Guarantee'}
                </span>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
                  {isHindi
                    ? 'आपकी व्यक्तिगत जानकारी एवं फोटो किसी भी डेटाबेस या सर्वर पर अपलोड नहीं की जाती। पूरी प्रक्रिया आपके कंप्यूटर/फ़ोन पर ही सुरक्षित रूप से होती है।'
                    : 'BiodataCraft stores zero customer biodatas in Firestore. Your entries and photographs remain entirely inside your browser memory for generating your private A4 PDF.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Sticky A4 Preview for Desktop (xl:col-span-5) */}
          <div className="hidden xl:block xl:col-span-5 sticky top-20 space-y-4">
            {/* Preview Header & Controls */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-800" />
                    <span>Live A4 Document Preview</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Real-time rendering • Updates instantly
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewScale((s) => Math.max(0.4, Number((s - 0.05).toFixed(2))))}
                    className="p-1 text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold text-stone-600 px-1">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewScale((s) => Math.min(0.85, Number((s + 0.05).toFixed(2))))}
                    className="p-1 text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenLivePreview}
                    className="p-1 text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded border border-stone-200 cursor-pointer ml-1"
                    title="Full Screen Preview"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Template Switcher */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1.5">
                  Choose Template:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {TEMPLATES.slice(0, 6).map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-1.5 rounded-lg border text-left text-[11px] font-semibold transition-all cursor-pointer truncate ${
                        data.templateId === tmpl.id
                          ? 'border-amber-800 bg-amber-50 text-amber-950 font-bold'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: tmpl.primaryColor }}
                        />
                        <span className="truncate">{tmpl.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auspicious Header Symbol Quick Selector */}
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">
                  Header Devotional Shloka:
                </label>
                <select
                  value={data.headerSymbol}
                  onChange={(e) => {
                    const sym = HEADER_SYMBOLS.find((s) => s.id === e.target.value);
                    updateFields({
                      headerSymbol: e.target.value,
                      customHeaderTitle: sym ? sym.shloka : data.customHeaderTitle
                    });
                  }}
                  className="w-full text-xs border border-stone-300 rounded-lg p-1.5 bg-white"
                >
                  {HEADER_SYMBOLS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scaled A4 Document Container */}
            <div className="bg-stone-200/80 p-4 rounded-2xl border border-stone-300 shadow-inner flex justify-center overflow-hidden max-h-[700px] overflow-y-auto">
              <div className="origin-top transition-transform duration-200">
                <BiodataTemplateView
                  data={data}
                  scale={previewScale}
                  id="desktop-sidebar-preview"
                />
              </div>
            </div>

            {/* Quick Action Button below preview */}
            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(true)}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-200" />
              <span>Download Printable A4 PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated Off-Screen Print & Export Target (Always in DOM, scale=1, 794px width, ready on mobile/tablet/desktop) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '794px',
          zIndex: -99999,
          opacity: 1,
          pointerEvents: 'none'
        }}
      >
        <BiodataTemplateView
          data={data}
          scale={1}
          id="biodata-print-container"
          isPrintMode={true}
        />
      </div>

      {/* Confirmation Modal: Clear / Start Over */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  {isHindi ? 'बायोडेटा खाली करें?' : 'Reset All Fields?'}
                </h4>
                <p className="text-xs text-stone-500">
                  {isHindi
                    ? 'सभी दर्ज की गई जानकारी मिट जाएगी।'
                    : 'This will wipe all fields from your browser.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              {isHindi
                ? 'क्या आप पूरी तरह नए सिरे से शुरुआत करना चाहते हैं?'
                : 'Are you sure you want to clear your current progress and start fresh?'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer shadow-xs"
              >
                {isHindi ? 'हाँ, खाली करें' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sample Data Confirmation Modal */}
      {isSampleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  Load Realistic Sample Biodata
                </h4>
                <p className="text-xs text-stone-500">
                  Instantly fills all 5 steps with realistic Indian matrimony details
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Loading sample data replaces your current input with a ready-to-test candidate biodata. You can immediately preview all designs and test the PDF download!
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleLoadSample('hindu')}
                className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-left text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-amber-950">Traditional Vedic</div>
                <div className="text-[11px] text-stone-600 mt-0.5">Royal Heritage • SDE-2 Google</div>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('modern')}
                className="p-3 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-left text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-stone-900">Modern Professional</div>
                <div className="text-[11px] text-stone-600 mt-0.5">Modern Elegance • Staff Architect</div>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsSampleModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Full-Screen Preview Modal (For Mobile / Tablets) */}
      <LivePreviewModal
        isOpen={isLivePreviewOpen}
        onClose={() => setIsLivePreviewOpen(false)}
        data={data}
        language={language}
        onChangeTemplate={handleSelectTemplate}
        onChangeLanguage={(l) => {
          setLanguage(l === 'bilingual' ? 'en' : l);
          updateFields({ language: l });
        }}
        onOpenDownload={() => {
          setIsLivePreviewOpen(false);
          setIsDownloadModalOpen(true);
        }}
        onPrint={() => window.print()}
      />

      {/* High-Resolution Download & Print Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        candidateName={data.fullName || 'Candidate'}
        templateId={data.templateId}
        language={language}
        creationMode={AdFlowService.detectCreationMode(data)}
        onClearSession={handleClearSessionAfterDownload}
        data={data}
      />
    </div>
  );
};
