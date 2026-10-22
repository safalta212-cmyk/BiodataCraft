import type jsPDFType from 'jspdf';
import { BiodataData } from '../types/biodata';

// Dynamically load heavy canvas and PDF generation engines only when needed
async function getPdfEngines() {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas-pro')
  ]);
  return { jsPDF, html2canvas };
}

export interface PDFGenerationProgress {
  status: 'idle' | 'generating' | 'ready' | 'error';
  progressPercentage: number;
  stageMessage: string;
  errorMessage?: string;
}

export interface PDFGenerationOptions {
  elementId?: string;
  candidateName?: string;
  onProgress?: (progress: PDFGenerationProgress) => void;
  scale?: number; // default: 2 (retina quality)
}

/**
 * Sanitizes candidate name for professional, cross-platform file naming
 * Example: "Aarav Devendra Sharma" -> "Marriage-Biodata-Aarav-Devendra-Sharma.pdf"
 * Unsafe characters like / \ : * ? " < > | are stripped.
 */
export function sanitizeCandidateName(name: string): string {
  if (!name || !name.trim()) return 'Candidate';

  // Replace whitespace with hyphens, remove filesystem unsafe characters
  const sanitized = name
    .trim()
    .replace(/[/\\:*?"<>|\x00-\x1F]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return sanitized || 'Candidate';
}

/**
 * Returns the professional filename: Marriage-Biodata-[Name].pdf
 */
export function getBiodataPdfFilename(candidateName: string): string {
  const safeName = sanitizeCandidateName(candidateName);
  return `Marriage-Biodata-${safeName}.pdf`;
}

/**
 * Returns the professional image filename: Marriage-Biodata-[Name].png
 */
export function getBiodataPngFilename(candidateName: string): string {
  const safeName = sanitizeCandidateName(candidateName);
  return `Marriage-Biodata-${safeName}.png`;
}

/**
 * Wait for all fonts (including Google Fonts & Devanagari) to be loaded with timeout
 */
async function waitForFontsReady(): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((resolve) => setTimeout(resolve, 4000))
      ]);
    } catch {
      // Continue even if document.fonts API encounters an error
    }
  }
}

/**
 * Wait for all images inside an element to finish loading with timeout
 */
async function waitForImagesReady(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  const promises = images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const timer = setTimeout(() => resolve(), 5000);
      img.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      img.onerror = () => {
        clearTimeout(timer);
        resolve(); // Don't hang on broken images
      };
    });
  });
  await Promise.all(promises);
}

/**
 * Robust DOM locator for print container across single-page, multi-page, and preview modes
 */
export function findPrintRootElement(preferredId: string = 'biodata-print-container'): HTMLElement | null {
  if (typeof document === 'undefined') return null;

  // 1. Modal specific print container if open
  const modalEl = document.getElementById('biodata-print-container-modal');
  if (modalEl) return modalEl;

  // 2. Direct ID match
  let el = document.getElementById(preferredId);
  if (el) return el;

  // 2. Default standard container ID
  if (preferredId !== 'biodata-print-container') {
    el = document.getElementById('biodata-print-container');
    if (el) return el;
  }

  // 3. Multi-page specific child IDs (e.g. biodata-print-container-page-1)
  const page1 =
    document.getElementById(`${preferredId}-page-1`) ||
    document.getElementById('biodata-print-container-page-1');
  if (page1) {
    return (page1.parentElement as HTMLElement) || page1;
  }

  // 4. Any .print-page in the DOM
  const anyPrintPage = document.querySelector('.print-page');
  if (anyPrintPage) {
    return (anyPrintPage.parentElement as HTMLElement) || (anyPrintPage as HTMLElement);
  }

  // 5. Desktop preview fallback
  const desktopPreview = document.getElementById('desktop-sidebar-preview');
  if (desktopPreview) return desktopPreview;

  // 6. Generic container match
  const genericMatch = document.querySelector('[id*="print-container"]') as HTMLElement | null;
  if (genericMatch) return genericMatch;

  return null;
}

/**
 * PDFService class
 * Production PDF generation engine for Indian Marriage Biodatas
 * 100% client-side, zero server uploads, privacy-first
 */
export class PDFService {
  /**
   * Generates a high-resolution, print-ready jsPDF document from rendered biodata
   */
  static async generateBiodataPDF(
    dataOrElementId?: BiodataData | string,
    options?: PDFGenerationOptions
  ): Promise<jsPDFType> {
    const candidateName =
      options?.candidateName ||
      (typeof dataOrElementId === 'object' ? dataOrElementId.fullName : undefined) ||
      'Candidate';

    const elementId =
      options?.elementId ||
      (typeof dataOrElementId === 'string' ? dataOrElementId : 'biodata-print-container');

    options?.onProgress?.({
      status: 'generating',
      progressPercentage: 10,
      stageMessage: 'Loading rendering engines...'
    });

    const { jsPDF, html2canvas } = await getPdfEngines();

    options?.onProgress?.({
      status: 'generating',
      progressPercentage: 20,
      stageMessage: 'Preparing print-ready document and fonts...'
    });

    // 1. Locate DOM element with multi-level resilient fallback
    const rootElement = findPrintRootElement(elementId);
    if (!rootElement) {
      throw new Error(
        `Print container "#${elementId}" not found in document. Please ensure the preview element is mounted.`
      );
    }

    // 2. Ensure fonts & images are fully loaded
    await waitForFontsReady();
    await waitForImagesReady(rootElement);

    options?.onProgress?.({
      status: 'generating',
      progressPercentage: 40,
      stageMessage: 'Rendering high-resolution A4 canvas...'
    });

    // 3. Find individual .print-page elements for multi-page support
    const printPages = Array.from(
      rootElement.querySelectorAll('.print-page')
    ) as HTMLElement[];

    const pagesToRender: HTMLElement[] =
      printPages.length > 0
        ? printPages
        : rootElement.classList.contains('print-page')
        ? [rootElement]
        : [rootElement];

    // 4. Initialize standard A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const isMobile =
      typeof navigator !== 'undefined' &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && window.innerWidth < 1024));

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    // Mobile devices (especially iOS WebKit) have strict canvas memory limits.
    // scale: 1.8 on mobile guarantees crisp A4 rendering while preventing tab crashes.
    const scale = options?.scale ?? (isMobile ? 1.8 : 2);

    // 5. Render each page
    for (let i = 0; i < pagesToRender.length; i++) {
      const pageEl = pagesToRender[i];
      const pageNum = i + 1;
      const progressPercent = 40 + Math.round(((i + 1) / pagesToRender.length) * 45);

      options?.onProgress?.({
        status: 'generating',
        progressPercentage: progressPercent,
        stageMessage: `Rendering Page ${pageNum} of ${pagesToRender.length}...`
      });

      const canvas = await html2canvas(pageEl, {
        scale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794, // 210mm in standard 96dpi pixels
        windowHeight: 1123, // 297mm in standard 96dpi pixels
        onclone: (clonedDoc: Document, element: HTMLElement) => {
          // Guarantee that the cloned element and all pages are fully visible at A4 dimensions
          if (element.parentElement) {
            element.parentElement.style.position = 'static';
            element.parentElement.style.left = '0';
            element.parentElement.style.top = '0';
            element.parentElement.style.opacity = '1';
            element.parentElement.style.visibility = 'visible';
            element.parentElement.style.width = '794px';
          }

          element.style.position = 'static';
          element.style.left = '0';
          element.style.top = '0';
          element.style.opacity = '1';
          element.style.visibility = 'visible';
          element.style.display = 'block';
          element.style.width = '794px';
          element.style.minWidth = '794px';
          element.style.maxWidth = '794px';

          const printPages = clonedDoc.querySelectorAll('.print-page');
          printPages.forEach((p) => {
            const htmlP = p as HTMLElement;
            htmlP.style.width = '794px';
            htmlP.style.minWidth = '794px';
            htmlP.style.maxWidth = '794px';
            htmlP.style.opacity = '1';
            htmlP.style.visibility = 'visible';
            htmlP.style.display = 'flex';
          });
        }
      });

      let imgData: string;
      try {
        imgData = canvas.toDataURL('image/jpeg', 0.98);
      } catch {
        try {
          imgData = canvas.toDataURL('image/png');
        } catch {
          throw new Error('Canvas export failed due to browser security or memory restrictions.');
        }
      }

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Add image to full A4 page dimensions
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    options?.onProgress?.({
      status: 'ready',
      progressPercentage: 100,
      stageMessage: 'PDF Ready'
    });

    return pdf;
  }

  /**
   * Cross-platform direct file downloader that works identically across all devices (phones, tablets, laptops).
   * Directly triggers download to the device's downloads folder without intercepting share dialogs.
   */
  static triggerDirectDownload(blob: Blob, filename: string): void {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    // Do NOT set target="_blank", which causes mobile browsers to open a blank tab instead of downloading
    document.body.appendChild(link);

    try {
      link.click();
    } catch {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      link.dispatchEvent(clickEvent);
    }

    setTimeout(() => {
      try {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(blobUrl);
      } catch {}
    }, 20000);
  }

  /**
   * Direct file saver for Blobs across phones and laptops
   */
  static async saveBlobFile(
    blob: Blob,
    filename: string,
    _mimeType: string = 'application/pdf'
  ): Promise<void> {
    this.triggerDirectDownload(blob, filename);
  }

  /**
   * Saves jsPDF instance directly to downloads folder across all devices
   */
  static async savePdfFile(pdf: jsPDFType, filename: string): Promise<void> {
    const blob = pdf.output('blob');
    this.triggerDirectDownload(blob, filename);
  }

  /**
   * Generates and automatically downloads the professional PDF file:
   * Marriage-Biodata-[Name].pdf
   */
  static async downloadBiodataPDF(
    dataOrElementId?: BiodataData | string,
    options?: PDFGenerationOptions
  ): Promise<boolean> {
    try {
      const candidateName =
        options?.candidateName ||
        (typeof dataOrElementId === 'object' ? dataOrElementId.fullName : undefined) ||
        'Candidate';

      const pdf = await this.generateBiodataPDF(dataOrElementId, options);
      const filename = getBiodataPdfFilename(candidateName);

      await this.savePdfFile(pdf, filename);
      return true;
    } catch (error: any) {
      options?.onProgress?.({
        status: 'error',
        progressPercentage: 0,
        stageMessage: 'PDF Generation Failed',
        errorMessage: error?.message || 'An unexpected error occurred while generating the PDF.'
      });
      throw error;
    }
  }

  /**
   * Generates crisp PNG image for fast WhatsApp sharing across mobile and desktop
   */
  static async downloadBiodataPNG(
    elementId: string = 'biodata-print-container',
    candidateName: string = 'Candidate'
  ): Promise<boolean> {
    const element = findPrintRootElement(elementId);
    if (!element) {
      throw new Error(`Print container "#${elementId}" not found for image export.`);
    }

    await waitForFontsReady();
    await waitForImagesReady(element);

    const { html2canvas } = await getPdfEngines();

    const isMobile =
      typeof navigator !== 'undefined' &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && window.innerWidth < 1024));

    // Look for first print-page
    const pageEl = (element.querySelector('.print-page') as HTMLElement) || element;

    const canvas = await html2canvas(pageEl, {
      scale: isMobile ? 1.8 : 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: 1123,
      onclone: (_clonedDoc: Document, clonedEl: HTMLElement) => {
        if (clonedEl.parentElement) {
          clonedEl.parentElement.style.position = 'static';
          clonedEl.parentElement.style.left = '0';
          clonedEl.parentElement.style.top = '0';
          clonedEl.parentElement.style.opacity = '1';
          clonedEl.parentElement.style.visibility = 'visible';
          clonedEl.parentElement.style.width = '794px';
        }

        clonedEl.style.position = 'static';
        clonedEl.style.left = '0';
        clonedEl.style.top = '0';
        clonedEl.style.opacity = '1';
        clonedEl.style.visibility = 'visible';
        clonedEl.style.display = 'block';
        clonedEl.style.width = '794px';
        clonedEl.style.minWidth = '794px';
        clonedEl.style.maxWidth = '794px';
      }
    });

    const filename = getBiodataPngFilename(candidateName);

    await new Promise<void>((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          try {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              try {
                document.body.removeChild(link);
              } catch {}
            }, 3000);
            resolve();
          } catch (e) {
            reject(new Error('Image export failed on mobile browser.'));
          }
          return;
        }

        try {
          await PDFService.saveBlobFile(blob, filename, 'image/png');
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 'image/png');
    });

    return true;
  }

  /**
   * Native high-resolution browser print
   */
  static triggerPrint(): void {
    window.print();
  }
}

// Standalone functions for direct import and Phase 6 specification
export const generateBiodataPDF = (
  dataOrElementId?: BiodataData | string,
  options?: PDFGenerationOptions
) => PDFService.generateBiodataPDF(dataOrElementId, options);

export const downloadBiodataPDF = (
  dataOrElementId?: BiodataData | string,
  options?: PDFGenerationOptions
) => PDFService.downloadBiodataPDF(dataOrElementId, options);

// Backward-compatible singleton object
export const pdfService = {
  generatePdf: (elementId: string = 'biodata-print-container', candidateName: string = 'Biodata') =>
    PDFService.downloadBiodataPDF(elementId, { candidateName }),
  generatePng: (elementId: string = 'biodata-print-container', candidateName: string = 'Biodata') =>
    PDFService.downloadBiodataPNG(elementId, candidateName),
  triggerPrint: () => PDFService.triggerPrint()
};
