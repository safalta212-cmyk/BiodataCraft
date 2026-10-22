import React, { useRef, useState } from 'react';
import { BiodataData, PhotoFrameStyle } from '../../types/biodata';
import { validationUtils } from '../../utils/validation';
import { Button } from '../ui/Button';
import {
  Camera,
  Upload,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Crop
} from 'lucide-react';

interface Step4PhotoProps {
  data: BiodataData;
  onChange: (fields: Partial<BiodataData>) => void;
  error?: string;
  onError?: (err: string | null) => void;
}

export const Step4Photo: React.FC<Step4PhotoProps> = ({
  data,
  onChange,
  error,
  onError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const photoConfig = data.photoConfig || {
    zoom: 1,
    rotate: 0,
    frameStyle: 'arch',
    cropAspect: 'portrait'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    if (onError) onError(null);

    const validation = validationUtils.validateImageFile(file, 5 * 1024 * 1024);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid image file.');
      if (onError) onError(validation.error || 'Invalid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        photoUrl: dataUrl,
        photoConfig: {
          ...photoConfig,
          zoom: 1,
          rotate: 0
        },
        sectionsVisible: {
          ...data.sectionsVisible,
          photo: true
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRotate = () => {
    const nextRotate = (photoConfig.rotate + 90) % 360;
    onChange({
      photoConfig: {
        ...photoConfig,
        rotate: nextRotate
      }
    });
  };

  const handleZoomChange = (newZoom: number) => {
    onChange({
      photoConfig: {
        ...photoConfig,
        zoom: Math.min(2.0, Math.max(0.5, newZoom))
      }
    });
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

  const handleRemovePhoto = () => {
    onChange({
      photoUrl: undefined,
      sectionsVisible: {
        ...data.sectionsVisible,
        photo: false
      }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFrameClasses = (style: PhotoFrameStyle) => {
    switch (style) {
      case 'arch':
        return 'rounded-t-full rounded-b-xl border-4';
      case 'oval':
        return 'rounded-full border-4';
      case 'rounded':
        return 'rounded-3xl border-4';
      case 'classic':
      default:
        return 'rounded-xl border-4';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-stone-200 pb-3">
        <h2 className="text-lg font-bold text-stone-900 font-cinzel flex items-center gap-2">
          <Camera className="w-5 h-5 text-amber-800" />
          <span>Step 4: Candidate Photograph & Frame Styling</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Add an optional dignified portrait photo. Processed entirely within your browser for complete privacy.
        </p>
      </div>

      {(error || photoError) && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          {error || photoError}
        </div>
      )}

      {/* Main Photo Editor Area */}
      <div className="bg-stone-50/70 p-5 sm:p-6 rounded-3xl border border-stone-200 space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
          {/* Photo Frame & Interactive Canvas */}
          <div className="relative group shrink-0">
            {data.photoUrl ? (
              <div className="relative">
                <div
                  className={`w-40 h-52 overflow-hidden bg-stone-100 shadow-lg relative flex items-center justify-center transition-all ${getFrameClasses(
                    photoConfig.frameStyle
                  )}`}
                  style={{ borderColor: data.themeColor || '#c59b27' }}
                >
                  <img
                    src={data.photoUrl}
                    alt={data.fullName || 'Candidate Photo Preview'}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-200"
                    style={{
                      transform: `scale(${photoConfig.zoom}) rotate(${photoConfig.rotate}deg)`,
                      transformOrigin: 'center center'
                    }}
                  />
                </div>

                {/* Floating Quick Action Buttons */}
                <div className="absolute -top-3 -right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 shadow-md flex items-center justify-center cursor-pointer transition-all"
                    title="Rotate 90 degrees"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center cursor-pointer transition-all"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-52 rounded-2xl border-2 border-dashed border-stone-300 bg-white hover:bg-amber-50/40 hover:border-amber-700 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-stone-800">Upload Photo</span>
                <span className="text-[10px] text-stone-400 mt-1">JPG, PNG, WEBP (Max 5MB)</span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />
          </div>

          {/* Controls Panel */}
          <div className="flex-1 w-full max-w-md space-y-5">
            {/* Upload or Replace button */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={data.photoUrl ? <RefreshCw className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5" />}
                className="bg-white"
              >
                {data.photoUrl ? 'Replace Photograph' : 'Choose Photograph'}
              </Button>

              {data.photoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>

            {/* Frame Style Selection */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                Photo Frame Shape
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: 'arch', label: 'Arch (महराब)', icon: '🏛️' },
                    { id: 'oval', label: 'Oval (अंडाकार)', icon: '🥚' },
                    { id: 'rounded', label: 'Rounded', icon: '🔲' },
                    { id: 'classic', label: 'Classic', icon: '⏹️' }
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFrameStyleChange(f.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all ${
                      photoConfig.frameStyle === f.id
                        ? 'border-amber-800 bg-amber-100/60 text-amber-950 font-bold shadow-2xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="block text-sm mb-0.5">{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom Slider */}
            {data.photoUrl && (
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span className="flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-stone-400" />
                    <span>Zoom & Crop Scale</span>
                  </span>
                  <span className="font-mono text-[11px] text-stone-500">
                    {Math.round(photoConfig.zoom * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleZoomChange(photoConfig.zoom - 0.1)}
                    className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={photoConfig.zoom}
                    onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-800 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleZoomChange(photoConfig.zoom + 0.1)}
                    className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Rotation Control */}
            {data.photoUrl && (
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-stone-400" />
                  <span className="font-semibold text-stone-700">Orientation:</span>
                  <span className="font-mono text-stone-500">{photoConfig.rotate}°</span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                  leftIcon={<RotateCw className="w-3.5 h-3.5 text-amber-800" />}
                >
                  Rotate 90° Clockwise
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Client-Side Photo Processing</strong>
          <span className="text-emerald-900 leading-relaxed block mt-0.5">
            Your photograph is never uploaded to Firebase Storage or any remote server. It is handled as a temporary in-memory data URL inside your web browser.
          </span>
        </div>
      </div>
    </div>
  );
};
