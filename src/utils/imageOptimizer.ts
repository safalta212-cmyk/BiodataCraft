/**
 * Image Optimization Utility for BiodataCraft Articles & Assets
 *
 * Automatically resizes and compresses client-uploaded imagery to ensure
 * documents never exceed Firestore's 1 MiB (1,048,576 bytes) limit.
 *
 * Scales images proportionally to modern web standards (e.g. 1200x800 for featured banners)
 * and outputs high-quality WebP or JPEG with ~90% file size reduction.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  size: number;
  width: number;
  height: number;
  blob?: Blob;
}

export async function optimizeImageForWeb(
  input: File | string,
  maxWidth = 1200,
  maxHeight = 800,
  quality = 0.80
): Promise<OptimizedImageResult> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (typeof input === 'string') {
      return { dataUrl: input, size: input.length, width: maxWidth, height: maxHeight };
    }
    return { dataUrl: '', size: input.size, width: maxWidth, height: maxHeight };
  }

  // Preserve vector SVGs without rasterization
  if (typeof input === 'object' && input.type === 'image/svg+xml') {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read SVG image file.'));
      reader.readAsDataURL(input);
    });
    return { dataUrl, size: input.size, width: 800, height: 600 };
  }

  if (typeof input === 'string' && input.startsWith('data:image/svg+xml')) {
    return { dataUrl: input, size: input.length, width: 800, height: 600 };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoaded = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (!width || !height) {
        width = 800;
        height = 600;
      }

      // Constrain dimensions proportionally to fit within bounds
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.max(1, Math.round(width * ratio));
        height = Math.max(1, Math.round(height * ratio));
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        if (typeof input === 'string') {
          return resolve({ dataUrl: input, size: input.length, width, height });
        }
        return reject(new Error('Failed to acquire canvas context for image optimization.'));
      }

      // Enable bicubic high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format: prefer modern WebP, fall back to JPEG
      let mimeType = 'image/webp';
      let dataUrl = canvas.toDataURL(mimeType, quality);
      if (!dataUrl.startsWith('data:image/webp')) {
        mimeType = 'image/jpeg';
        dataUrl = canvas.toDataURL(mimeType, quality);
      }

      // If result is still unexpectedly large (> 350 KB), re-encode with slightly lower quality
      if (dataUrl.length > 350 * 1024) {
        dataUrl = canvas.toDataURL(mimeType, 0.65);
      }

      // If still > 260 KB, downscale dimensions further to ensure absolute safety in Firestore
      if (dataUrl.length > 260 * 1024 && (width > 800 || height > 550)) {
        const downWidth = Math.max(1, Math.round(width * 0.75));
        const downHeight = Math.max(1, Math.round(height * 0.75));
        canvas.width = downWidth;
        canvas.height = downHeight;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, downWidth, downHeight);
        dataUrl = canvas.toDataURL(mimeType, 0.65);
        width = downWidth;
        height = downHeight;
      }

      canvas.toBlob(
        (blob) => {
          resolve({
            dataUrl,
            size: blob?.size || Math.round(dataUrl.length * 0.75),
            width,
            height,
            blob: blob || undefined
          });
        },
        mimeType,
        quality
      );
    };

    img.onload = handleLoaded;
    img.onerror = () => {
      reject(new Error('Failed to decode image data for optimization.'));
    };

    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image file into memory.'));
      reader.readAsDataURL(input);
    }
  });
}
