import React, { useRef, useState } from 'react';
import { PhotoFrameStyle } from '../../types/biodata';
import { validationUtils } from '../../utils/validation';
import { Camera, Trash2, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface PhotoUploaderProps {
  photoUrl?: string;
  frameStyle: PhotoFrameStyle;
  showPhoto: boolean;
  onPhotoChange: (url?: string) => void;
  onFrameStyleChange: (style: PhotoFrameStyle) => void;
  onToggleShowPhoto: (show: boolean) => void;
  language: 'en' | 'hi' | 'bilingual';
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoUrl,
  frameStyle,
  showPhoto,
  onPhotoChange,
  onFrameStyleChange,
  onToggleShowPhoto,
  language
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isHindi = language === 'hi';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);

    // Validate MIME type and 5MB size limit
    const validation = validationUtils.validateImageFile(file, 5 * 1024 * 1024);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid photo format');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onPhotoChange(dataUrl);
      onToggleShowPhoto(true);
    };
    reader.onerror = () => {
      setErrorMessage(isHindi ? 'फ़ोटो लोड करने में त्रुटि हुई' : 'Failed to read photo file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onPhotoChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <h4 className="font-bold text-stone-900 text-sm sm:text-base">
              {isHindi ? 'वर/वधू की तस्वीर (ऐच्छिक)' : 'Candidate Photograph (Optional)'}
            </h4>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            {isHindi
              ? 'शादी के बायोडेटा में पासपोर्ट साइज या साफ फोटो जोड़ें'
              : 'Add a high quality portrait photo to enhance your biodata'}
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
          <input
            type="checkbox"
            checked={showPhoto}
            onChange={(e) => onToggleShowPhoto(e.target.checked)}
            className="rounded text-amber-800 focus:ring-amber-800 w-4 h-4 cursor-pointer"
          />
          <span>{isHindi ? 'बायोडेटा में फोटो दिखाएं' : 'Show Photo in Biodata'}</span>
        </label>
      </div>

      {errorMessage && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {showPhoto && (
        <div className="mt-4 flex flex-col md:flex-row items-center gap-6">
          {/* Photo Preview & Frame */}
          <div className="relative group shrink-0">
            {photoUrl ? (
              <div className="relative">
                <img
                  src={photoUrl}
                  alt="Candidate photograph preview"
                  width={128}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className={`w-32 h-40 object-cover border-4 border-amber-400 shadow-md ${
                    frameStyle === 'arch'
                      ? 'rounded-t-full rounded-b-lg'
                      : frameStyle === 'oval'
                      ? 'rounded-full'
                      : frameStyle === 'rounded'
                      ? 'rounded-2xl'
                      : 'rounded-md'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full shadow-md cursor-pointer transition-all"
                  title="Remove photo"
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-40 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50/80 hover:bg-stone-100 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors"
              >
                <Camera className="w-7 h-7 text-stone-600 mb-1" />
                <span className="text-[11px] font-bold text-stone-700">
                  {isHindi ? 'फोटो अपलोड करें' : 'Upload Photo'}
                </span>
                <span className="text-[9px] text-stone-600 mt-1">JPG / PNG / WEBP</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Controls & Privacy Badge */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                {isHindi ? 'फोटो फ्रेम का आकार (Frame Shape)' : 'Photo Frame Style'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: 'arch', label: 'Arch (महराब)', icon: '🏛️' },
                    { id: 'oval', label: 'Oval (अंडाकार)', icon: '🥚' },
                    { id: 'rounded', label: 'Rounded (गोल कोना)', icon: '🔲' },
                    { id: 'classic', label: 'Classic (सटीक)', icon: '⏹️' }
                  ] as const
                ).map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onFrameStyleChange(style.id)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all cursor-pointer flex items-center gap-1.5 ${
                      frameStyle === style.id
                        ? 'border-amber-800 bg-amber-100/50 text-amber-950 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span className="truncate">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* In-Browser Privacy Guarantee */}
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                {isHindi
                  ? 'गोपनीयता सुरक्षा: आपकी फोटो आपके ब्राउज़र में ही प्रोसेस होती है और कभी किसी सर्वर पर अपलोड नहीं की जाती।'
                  : 'Privacy Guarantee: Your photograph is converted client-side into your PDF and is never uploaded or saved on any server.'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
