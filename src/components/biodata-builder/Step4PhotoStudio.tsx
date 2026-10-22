import React, { useState, useRef } from 'react';
import { BiodataData, PhotoFrameStyle } from '../../types/biodata';
import {
  Camera,
  Upload,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { validationUtils } from '../../utils/validation';

interface Step4PhotoStudioProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  language: 'en' | 'hi' | 'bilingual';
  errors?: Record<string, string>;
}

export const Step4PhotoStudio: React.FC<Step4PhotoStudioProps> = ({
  data,
  onChange,
  language,
  errors = {}
}) => {
  const isHindi = language === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const photoConfig = data.photoConfig || {
    zoom: 1,
    rotate: 0,
    frameStyle: 'arch',
    cropAspect: 'portrait'
  };

  const frameStyle: PhotoFrameStyle = data.photoFrameStyle || photoConfig.frameStyle || 'arch';

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    setSuccessNotice(null);

    // Validate image file type and size
    const validation = validationUtils.validateImageFile(file, 5 * 1024 * 1024);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid photo');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        photoUrl: dataUrl,
        sectionsVisible: { ...data.sectionsVisible, photo: true },
        photoConfig: {
          ...photoConfig,
          zoom: 1,
          rotate: 0
        }
      });
      setIsProcessing(false);
      setSuccessNotice(isHindi ? 'फोटो सफलतापूर्वक लोड की गई!' : 'Photo loaded client-side successfully!');
      setTimeout(() => setSuccessNotice(null), 3000);
    };
    reader.onerror = () => {
      setPhotoError('Failed to read image file in browser.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false);

  const handleConfirmRemove = () => {
    onChange({
      photoUrl: undefined,
      sectionsVisible: { ...data.sectionsVisible, photo: false }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPhotoError(null);
    setSuccessNotice(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.max(0.5, Math.min(2.5, Number(newZoom.toFixed(2))));
    onChange({
      photoConfig: {
        ...photoConfig,
        zoom: clamped
      }
    });
  };

  // Rotate image using client-side canvas so exported PDF contains the rotated image
  const handleRotate90 = () => {
    if (!data.photoUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Rotate 90 deg clockwise
      canvas.width = img.height;
      canvas.height = img.width;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const rotatedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      onChange({
        photoUrl: rotatedDataUrl,
        photoConfig: {
          ...photoConfig,
          rotate: (photoConfig.rotate + 90) % 360
        }
      });
      setIsProcessing(false);
      setSuccessNotice(isHindi ? 'फोटो 90° घुमाई गई' : 'Rotated 90° clockwise');
      setTimeout(() => setSuccessNotice(null), 2000);
    };
    img.onerror = () => {
      setIsProcessing(false);
      setPhotoError('Failed to rotate photo in browser.');
    };
    img.src = data.photoUrl;
  };

  // Crop preset (e.g. Portrait 3:4, Square 1:1) using canvas
  const handleApplyCropPreset = (aspect: 'portrait' | 'square' | 'classic') => {
    if (!data.photoUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      let targetRatio = 3 / 4; // portrait default
      if (aspect === 'square') targetRatio = 1;
      if (aspect === 'classic') targetRatio = 4 / 5;

      const imgRatio = img.width / img.height;
      let sX = 0,
        sY = 0,
        sW = img.width,
        sH = img.height;

      if (imgRatio > targetRatio) {
        // Source is wider than target: crop width
        sW = img.height * targetRatio;
        sX = (img.width - sW) / 2;
      } else {
        // Source is taller than target: crop height
        sH = img.width / targetRatio;
        sY = (img.height - sH) / 2;
      }

      canvas.width = sW;
      canvas.height = sH;
      ctx.drawImage(img, sX, sY, sW, sH, 0, 0, sW, sH);

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      onChange({
        photoUrl: croppedDataUrl,
        photoConfig: {
          ...photoConfig,
          cropAspect: aspect,
          zoom: 1
        }
      });
      setIsProcessing(false);
      setSuccessNotice(isHindi ? 'फ्रेम क्रॉप लागू किया गया' : `Applied ${aspect} crop`);
      setTimeout(() => setSuccessNotice(null), 2000);
    };
    img.onerror = () => {
      setIsProcessing(false);
      setPhotoError('Failed to crop photo in browser.');
    };
    img.src = data.photoUrl;
  };

  const handleFrameStyleChange = (style: PhotoFrameStyle) => {
    onChange({
      photoFrameStyle: style,
      photoConfig: {
        ...photoConfig,
        frameStyle: style
      }
    });
  };

  const getFramePreviewClass = (style: PhotoFrameStyle) => {
    switch (style) {
      case 'arch':
        return 'rounded-t-[48px] rounded-b-md';
      case 'oval':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-2xl';
      case 'classic':
      default:
        return 'rounded-md';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Photo Studio Workspace Card */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
        <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-800" />
              <span>{isHindi ? 'फोटो स्टूडियो (Photo Studio)' : 'Candidate Photo Studio'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isHindi
                ? 'अपलोड, क्रॉप, ज़ूम, रोटेट एवं फ्रेम का चयन करें (100% निजी व सुरक्षित)'
                : 'Upload, Crop, Zoom, Rotate, and Choose Frame Style (100% Client-Side)'}
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 bg-amber-50/70 border border-amber-200 px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={data.sectionsVisible.photo}
              onChange={(e) =>
                onChange({
                  sectionsVisible: { ...data.sectionsVisible, photo: e.target.checked }
                })
              }
              className="rounded text-amber-800 focus:ring-amber-800 w-4 h-4 cursor-pointer"
            />
            <span>{isHindi ? 'बायोडेटा में फोटो शामिल करें' : 'Include Photo in Biodata'}</span>
          </label>
        </div>

        {/* Notices */}
        {photoError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{photoError}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Main Photo Editor Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Photo Live Preview Box */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-stone-50 border border-dashed border-stone-300 rounded-2xl">
            {data.photoUrl ? (
              <div className="relative group">
                <div
                  className={`w-40 h-52 sm:w-44 sm:h-56 overflow-hidden border-4 border-amber-600 shadow-lg bg-stone-100 flex items-center justify-center ${getFramePreviewClass(
                    frameStyle
                  )}`}
                >
                  <img
                    src={data.photoUrl}
                    alt="Candidate Preview"
                    loading="lazy"
                    decoding="async"
                    style={{
                      transform: `scale(${photoConfig.zoom})`,
                      transformOrigin: 'center center'
                    }}
                    className="w-full h-full object-cover transition-transform duration-150"
                  />
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 px-3.5 py-2 min-h-[40px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                    <span>{isHindi ? 'बदलें (Replace)' : 'Replace'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-red-700 bg-white hover:bg-red-50 border border-red-200 px-3.5 py-2 min-h-[40px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>{isHindi ? 'हटाएं (Remove)' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-12 px-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-stone-100/80 rounded-xl transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-3 shadow-inner">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-stone-800">
                  {isHindi ? 'अपनी फोटो चुनें' : 'Upload Candidate Photo'}
                </h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  {isHindi
                    ? 'क्लिक करें या फोटो ड्रैग करें (JPG, PNG, WEBP, अधिकतम 5MB)'
                    : 'Click or drag photo here. Supports JPG, PNG, WEBP up to 5MB'}
                </p>
                <span className="mt-3 inline-block text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-300 px-3 py-1 rounded-md">
                  {isHindi ? 'ब्राउज़ करें (Browse)' : 'Browse Files'}
                </span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />
          </div>

          {/* Controls: Crop, Zoom, Rotate, Frame Style */}
          <div className="md:col-span-7 space-y-5">
            {/* Frame Style Picker */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-2">
                {isHindi ? '1. फ्रेम का आकार चुनें (Frame Style)' : '1. Select Frame Style'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'arch' as PhotoFrameStyle, label: 'Arch (महराब)', icon: '🏛️' },
                  { id: 'oval' as PhotoFrameStyle, label: 'Oval (अंडाकार)', icon: '🥚' },
                  { id: 'rounded' as PhotoFrameStyle, label: 'Rounded (गोल कोना)', icon: '🔲' },
                  { id: 'classic' as PhotoFrameStyle, label: 'Classic (सटीक)', icon: '⏹️' }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleFrameStyleChange(st.id)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      frameStyle === st.id
                        ? 'border-amber-800 bg-amber-50 text-amber-950 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50 bg-white'
                    }`}
                  >
                    <div className="text-lg mb-1">{st.icon}</div>
                    <div className="truncate">{st.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tools (Rotate, Crop presets, Zoom) */}
            {data.photoUrl ? (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                {/* Crop & Rotate Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-stone-800">
                    {isHindi ? '2. फोटो रोटेट व क्रॉप (Rotate & Crop)' : '2. Rotate & Crop'}
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleRotate90}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-amber-800" />
                    <span>{isHindi ? '90° घुमाएं (Rotate)' : 'Rotate 90°'}</span>
                  </button>
                </div>

                {/* Crop Presets */}
                <div>
                  <div className="text-[11px] font-semibold text-stone-600 mb-1.5">
                    {isHindi ? 'क्रॉप अनुपात (Aspect Ratio)' : 'Crop Aspect Ratio:'}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleApplyCropPreset('portrait')}
                      className={`min-h-[44px] py-1.5 px-1 sm:px-2 text-[11px] sm:text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer bg-white flex items-center justify-center ${
                        photoConfig.cropAspect === 'portrait'
                          ? 'border-amber-800 text-amber-900 bg-amber-50 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Portrait (3:4)
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleApplyCropPreset('square')}
                      className={`min-h-[44px] py-1.5 px-1 sm:px-2 text-[11px] sm:text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer bg-white flex items-center justify-center ${
                        photoConfig.cropAspect === 'square'
                          ? 'border-amber-800 text-amber-900 bg-amber-50 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Square (1:1)
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleApplyCropPreset('classic')}
                      className={`min-h-[44px] py-1.5 px-1 sm:px-2 text-[11px] sm:text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer bg-white flex items-center justify-center ${
                        photoConfig.cropAspect === 'classic'
                          ? 'border-amber-800 text-amber-900 bg-amber-50 font-bold'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Classic (4:5)
                    </button>
                  </div>
                </div>

                {/* Zoom Slider */}
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5 text-stone-500" />
                      <span>{isHindi ? 'ज़ूम समायोजन (Zoom)' : 'Zoom Adjustment'}</span>
                    </span>
                    <span className="text-xs font-bold text-amber-900">
                      {Math.round(photoConfig.zoom * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => handleZoomChange(photoConfig.zoom - 0.1)}
                      className="p-1.5 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                      title="Zoom Out"
                      aria-label="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4 text-stone-700" />
                    </button>

                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.05}
                      value={photoConfig.zoom}
                      onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
                    />

                    <button
                      type="button"
                      onClick={() => handleZoomChange(photoConfig.zoom + 0.1)}
                      className="p-1.5 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                      title="Zoom In"
                      aria-label="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4 text-stone-700" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleZoomChange(1.0)}
                      className="text-xs font-semibold text-stone-600 bg-white border border-stone-300 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 cursor-pointer min-h-[44px] flex items-center justify-center shrink-0"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-50/70 border border-stone-200 rounded-xl text-xs text-stone-600 space-y-1">
                <p className="font-semibold text-stone-800">
                  {isHindi ? 'सुझाव:' : 'Helpful Matrimonial Photo Tips:'}
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                  <li>{isHindi ? 'साफ चेहरे वाली एवं अच्छे प्रकाश वाली तस्वीर चुनें।' : 'Choose a well-lit portrait looking directly into the camera.'}</li>
                  <li>{isHindi ? 'पारंपरिक या फॉर्मल पोशाक में फोटो अधिक उपयुक्त होती है।' : 'Traditional Indian or smart formal attire creates the best impression.'}</li>
                  <li>{isHindi ? 'फोटो आपके ब्राउज़र से बाहर कहीं नहीं भेजी जाती।' : '100% private: Processed purely in your browser canvas.'}</li>
                </ul>
              </div>
            )}

            {/* Zero-Storage Privacy Guarantee */}
            <div className="flex items-center gap-2.5 text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
              <div>
                <span className="font-bold">Zero-Storage Guarantee: </span>
                <span>
                  {isHindi
                    ? 'आपकी फोटो किसी भी सर्वर पर अपलोड नहीं की जाती। यह केवल आपके कंप्यूटर/मोबाइल पर बायो-डाटा पीडीएफ बनाने हेतु प्रोसेस होती है।'
                    : 'Your photo stays strictly in your browser memory and is never uploaded to any remote server or permanent database.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Confirmation Modal for Removing Photo */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">
                  {isHindi ? 'फोटो हटाएं?' : 'Remove Photo?'}
                </h4>
                <p className="text-xs text-stone-500">
                  {isHindi
                    ? 'यह फोटो आपके बायोडेटा से हटा दी जाएगी।'
                    : 'This photo will be removed from your biodata.'}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              {isHindi
                ? 'क्या आप वाकई इस फोटो को बायोडेटा से हटाना चाहते हैं?'
                : 'Are you sure you want to remove this photo from your biodata? You can upload a new one at any time.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {isHindi ? 'हटाएं' : 'Remove Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
