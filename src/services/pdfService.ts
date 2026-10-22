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

  // 1. Direct ID match
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

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const scale = options?.scale ?? 2; // 2x Retina scale

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
        x: 0,
        y: 0,
        windowWidth: 794 // 210mm in standard 96dpi pixels
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

      pdf.save(filename);
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
   * Generates crisp PNG image for fast WhatsApp sharing
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

    // Look for first print-page
    const pageEl = (element.querySelector('.print-page') as HTMLElement) || element;

    const canvas = await html2canvas(pageEl, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0
    });

    const filename = getBiodataPngFilename(candidateName);
    let imgData: string;
    try {
      imgData = canvas.toDataURL('image/png');
    } catch {
      try {
        imgData = canvas.toDataURL('image/jpeg', 0.98);
      } catch {
        throw new Error('Image export failed due to browser security restrictions.');
      }
    }

    const link = document.createElement('a');
    link.download = filename;
    link.href = imgData;
    link.click();
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
