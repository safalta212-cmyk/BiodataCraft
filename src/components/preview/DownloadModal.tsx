import React, { useState, useEffect } from 'react';
import {
  PDFService,
  PDFGenerationProgress,
  getBiodataPdfFilename,
  getBiodataPngFilename
} from '../../services/pdfService';
import { AdFlowService } from '../../services/adFlowService';
import { CreationMode } from '../../types/monetization';
import { DownloadInterstitialArea } from '../ads/DownloadInterstitialArea';
import { analyticsService } from '../../services/analyticsService';
import confetti from 'canvas-confetti';
import {
  Download,
  FileText,
  Image,
  Printer,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { BiodataData } from '../../types/biodata';
import { BiodataTemplateView } from '../templates/BiodataTemplateView';
import { storageService } from '../../services/storageService';

export interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  templateId: string;
  language: 'en' | 'hi' | 'bilingual';
  creationMode?: CreationMode;
  onClearSession?: () => void;
  data?: BiodataData;
}

/**
 * Phase 7 Production DownloadModal
 * Implements:
 * - Application-level creation modes: STANDARD, TEMPLATE, ADVANCED
 * - AdFlowService download flow initiation & completion
 * - Policy-compliant ad opportunities (never blocking or concealing download actions)
 * - States: "Generating PDF...", "PDF Ready", "Download PDF"
 * - Professional filename preview: Marriage-Biodata-[Name].pdf
 * - Graceful failure handling with retry
 * - Zero-storage / client-side privacy preservation
 */
export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  templateId,
  language,
  creationMode,
  onClearSession,
  data
}) => {
  const [generationState, setGenerationState] = useState<
    'idle' | 'generating' | 'ready' | 'error'
  >('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clearAfterDownload, setClearAfterDownload] = useState<boolean>(false);

  // Determine effective creation mode (STANDARD, TEMPLATE, or ADVANCED)
  const effectiveMode: CreationMode =
    creationMode ||
    (templateId && templateId !== 'royal-heritage' ? 'TEMPLATE' : 'STANDARD');

  // Trigger AdFlowService download flow start on modal open
  useEffect(() => {
    if (isOpen) {
      AdFlowService.startDownloadFlow(effectiveMode);
    }
  }, [isOpen, effectiveMode]);

  if (!isOpen) return null;

  const currentData = data || storageService.loadLocalDraft();

  const isHindi = language === 'hi';
  const expectedFilename = getBiodataPdfFilename(candidateName);
  const expectedPngFilename = getBiodataPngFilename(candidateName);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if canvas confetti not supported
    }
  };

  const handlePostDownloadCleanup = () => {
    if (clearAfterDownload && onClearSession) {
      setTimeout(() => {
        onClearSession();
      }, 1200);
    }
  };

  const handleGenerateAndDownloadPdf = async () => {
    setGenerationState('generating');
    setErrorMessage(null);
    setProgressPercent(10);
    setStatusMessage(
      isHindi ? 'बायोडेटा तैयार हो रहा है...' : 'Generating PDF...'
    );

    analyticsService.trackDownloadRequested('pdf', templateId, effectiveMode);
    analyticsService.trackPdfGenerationStarted(templateId, effectiveMode);
    const startTime = Date.now();

    try {
      const pdf = await PDFService.generateBiodataPDF('biodata-print-container', {
        candidateName,
        onProgress: (p: PDFGenerationProgress) => {
          setProgressPercent(p.progressPercentage);
          if (p.status === 'generating') {
            setStatusMessage(
              isHindi ? 'बायोडेटा तैयार हो रहा है...' : 'Generating PDF...'
            );
          } else if (p.status === 'ready') {
            setStatusMessage(isHindi ? 'PDF तैयार है!' : 'PDF Ready');
          }
        }
      });

      analyticsService.trackPdfGenerationCompleted(
        templateId,
        effectiveMode,
        Date.now() - startTime
      );

      // Save PDF directly to user's device
      pdf.save(expectedFilename);
      analyticsService.trackDownloadCompleted('pdf', templateId, effectiveMode, language);
      triggerConfetti();

      // Complete monetization flow session cleanly
      AdFlowService.completeDownloadFlow();

      setGenerationState('ready');
      setStatusMessage(isHindi ? 'PDF तैयार है! डाउनलोड पूर्ण।' : 'PDF Ready! Download Complete.');
      handlePostDownloadCleanup();

      setTimeout(() => {
        setGenerationState('idle');
      }, 3500);
    } catch (err: any) {
      setGenerationState('error');
      setErrorMessage(
        err?.message ||
          (isHindi
            ? 'PDF बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
            : 'Failed to generate PDF. Please ensure all sections are visible and try again.')
      );
    }
  };

  const handleDownloadPng = async () => {
    setGenerationState('generating');
    setErrorMessage(null);
    setStatusMessage(
      isHindi ? 'व्हाट्सएप इमेज तैयार हो रही है...' : 'Creating WhatsApp Image...'
    );

    analyticsService.trackDownloadRequested('png', templateId, effectiveMode);

    try {
      await PDFService.downloadBiodataPNG('biodata-print-container', candidateName);
      analyticsService.trackDownloadCompleted('png', templateId, effectiveMode, language);
      triggerConfetti();

      AdFlowService.completeDownloadFlow();

      setGenerationState('ready');
      setStatusMessage(
        isHindi ? 'इमेज सफलतापूर्वक डाउनलोड हुई!' : 'Image Downloaded Successfully!'
      );
      handlePostDownloadCleanup();

      setTimeout(() => {
        setGenerationState('idle');
      }, 3000);
    } catch (err: any) {
      setGenerationState('error');
      setErrorMessage(
        err?.message ||
          (isHindi
            ? 'इमेज बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
            : 'Failed to generate Image. Please try again.')
      );
    }
  };

  const handlePrint = () => {
    analyticsService.trackDownloadRequested('print', templateId, effectiveMode);
    analyticsService.trackDownloadCompleted('print', templateId, effectiveMode, language);
    AdFlowService.completeDownloadFlow();
    PDFService.triggerPrint();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-7 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full cursor-pointer transition-all"
          aria-label="Close download dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-4 sm:mb-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-inner">
            <Download className="w-6 h-6 sm:w-7 sm:h-7 text-amber-900" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-stone-900">
            {isHindi ? 'बायोडेटा डाउनलोड करें' : 'Download Your Biodata'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            {isHindi
              ? 'बिना किसी वॉटरमार्क या रजिस्ट्रेशन के सीधे अपने डिवाइस पर सहेजें'
              : '100% Free • No Login Required • High-Resolution A4 PDF'}
          </p>

          {/* Filename Preview */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 text-[10px] sm:text-[11px] font-mono text-stone-600 max-w-full truncate">
            <FileText className="w-3.5 h-3.5 text-amber-800 shrink-0" />
            <span className="truncate">{expectedFilename}</span>
          </div>
        </div>

        {/* ================= Status Display ================= */}
        {generationState === 'generating' && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-amber-950 mb-1.5">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-800" />
                <span>{isHindi ? 'बायोडेटा तैयार हो रहा है...' : 'Generating PDF...'}</span>
              </span>
              <span>{progressPercent}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-800/80 mt-1.5">
              {isHindi
                ? 'फॉन्ट और हाई-रेजोल्यूशन A4 पेजों को रेंडर किया जा रहा है...'
                : 'Rendering vectors, fonts, and print layout...'}
            </p>
          </div>
        )}

        {generationState === 'ready' && statusMessage && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2.5 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <div className="flex-1">
              <div>{statusMessage}</div>
              <div className="text-[11px] font-normal text-emerald-700">
                {isHindi ? 'फ़ाइल आपके डिवाइस पर सहेजी जा चुकी है।' : 'File has been saved to your downloads folder.'}
              </div>
            </div>
          </div>
        )}

        {generationState === 'error' && errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold">{isHindi ? 'डाउनलोड विफल' : 'Download Failed'}</div>
              <div className="text-[11px] text-red-700 mt-0.5">{errorMessage}</div>
              <button
                type="button"
                onClick={handleGenerateAndDownloadPdf}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isHindi ? 'पुनः प्रयास करें' : 'Try Again'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= Phase 14: Google AdSense Download Interstitial Area ================= */}
        {/* Strictly compliant: Never hides download buttons, never simulates clicks, legitimate placement */}
        <DownloadInterstitialArea monetizationLevel={effectiveMode} language={language} className="mb-4" />

        {/* ================= Unobstructed Action Buttons ================= */}
        <div className="space-y-2.5 sm:space-y-3">
          {/* High Res PDF Button (Requirement: "Download PDF") */}
          <button
            type="button"
            disabled={generationState === 'generating'}
            onClick={handleGenerateAndDownloadPdf}
            className="w-full flex items-center justify-between p-3 sm:p-3.5 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 gap-2"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-amber-950/40 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-amber-200" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="truncate text-xs sm:text-sm font-bold">
                  {isHindi ? 'PDF डाउनलोड करें' : 'Download PDF'}
                </div>
                <div className="text-[10px] sm:text-[11px] font-normal text-amber-200/90 truncate">
                  {isHindi
                    ? 'उच्च गुणवत्ता वाला A4 प्रिंट प्रारूप'
                    : 'High-Res A4 Print-Ready Document'}
                </div>
              </div>
            </div>
            {generationState === 'generating' ? (
              <span className="text-[10px] sm:text-xs bg-amber-950/60 px-2 py-1 rounded-md animate-pulse shrink-0">
                Generating...
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs bg-amber-950/40 px-2 sm:px-2.5 py-1 rounded-md shrink-0">
                Standard A4
              </span>
            )}
          </button>

          {/* WhatsApp Image (PNG) */}
          <button
            type="button"
            disabled={generationState === 'generating'}
            onClick={handleDownloadPng}
            className="w-full flex items-center justify-between p-3 sm:p-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 gap-2"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-900/40 flex items-center justify-center shrink-0">
                <Image className="w-5 h-5 text-emerald-200" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="truncate text-xs sm:text-sm font-bold">
                  {isHindi ? 'व्हाट्सएप इमेज (PNG)' : 'Download WhatsApp Image (PNG)'}
                </div>
                <div className="text-[10px] sm:text-[11px] font-normal text-emerald-200/90 truncate">
                  {isHindi
                    ? 'चैट और फोन पर तुरंत भेजने योग्य'
                    : 'Crisp image optimized for instant chat sharing'}
                </div>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs bg-emerald-950/40 px-2 sm:px-2.5 py-1 rounded-md shrink-0">
              Instant
            </span>
          </button>

          {/* Direct Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-2.5 sm:p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl font-semibold text-sm transition-all cursor-pointer border border-stone-200 gap-2"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <Printer className="w-5 h-5 text-stone-600 shrink-0" />
              <div className="text-left min-w-0 flex-1">
                <div className="truncate text-xs sm:text-sm font-bold">
                  {isHindi ? 'सीधे प्रिंट करें' : 'Print Document Directly'}
                </div>
                <div className="text-[10px] sm:text-[11px] font-normal text-stone-500 truncate">
                  {isHindi ? 'ब्राउज़र प्रिंट डायलॉग खोलें' : 'Uses native system printer'}
                </div>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-stone-500 font-mono shrink-0">Ctrl + P</span>
          </button>
        </div>

        {/* Clear Temporary Biodata Option (Session Cleanup) */}
        {onClearSession && (
          <div className="mt-4 p-3 bg-stone-50 border border-stone-200 rounded-2xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={clearAfterDownload}
                onChange={(e) => setClearAfterDownload(e.target.checked)}
                className="mt-0.5 rounded text-amber-800 focus:ring-amber-800 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-stone-700 leading-tight">
                <span className="font-bold text-stone-900 block mb-0.5">
                  {isHindi ? 'डाउनलोड के बाद ब्राउज़र से डेटा हटाएं' : 'Clear temporary data after download'}
                </span>
                <span className="text-stone-500 text-[11px]">
                  {isHindi
                    ? 'अतिरिक्त सुरक्षा हेतु स्थानीय ड्राफ्ट को स्वतः मिटाएं (Session Cleanup)'
                    : 'Wipes your temporary draft from local browser storage once file is saved'}
                </span>
              </span>
            </label>
          </div>
        )}

        {/* Privacy Note */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex items-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {isHindi
              ? 'शत-प्रतिशत सुरक्षित: आपकी व्यक्तिगत जानकारी किसी सर्वर पर रिकॉर्ड नहीं होती।'
              : 'Zero-Storage Privacy: Generated in your browser. Nothing stored on our servers.'}
          </span>
        </div>
      </div>

      {/* Guaranteed Offscreen Print Target for PDF & PNG Generation */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '210mm',
          zIndex: -9999,
          opacity: 0,
          pointerEvents: 'none'
        }}
      >
        <BiodataTemplateView
          data={currentData}
          scale={1}
          id="biodata-print-container"
          isPrintMode={true}
        />
      </div>
    </div>
  );
};
