import React, { useState, useRef } from 'react';
import { blogService, isAdminAuthorized } from '../../../services/blogService';
import { useToast } from '../../../context/ToastContext';
import {
  Image as ImageIcon,
  Upload,
  X,
  Check,
  Star,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Copy,
  Info,
  Maximize2,
  AlertCircle
} from 'lucide-react';

export interface ManagedImageItem {
  id: string;
  url: string;
  name: string;
  alt: string;
  caption?: string;
  sizeStr?: string;
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  isPreset?: boolean;
}

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: ManagedImageItem[];
  onAddImage: (img: ManagedImageItem) => void;
  onRemoveImage: (id: string) => void;
  featuredImageUrl: string;
  onSetFeaturedImage: (url: string, alt: string) => void;
  onInsertInlineImage: (url: string, alt: string, caption?: string) => void;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({
  isOpen,
  onClose,
  mediaList,
  onAddImage,
  onRemoveImage,
  featuredImageUrl,
  onSetFeaturedImage,
  onInsertInlineImage
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'url'>('gallery');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ManagedImageItem | null>(null);
  const [customAlt, setCustomAlt] = useState('');
  const [customCaption, setCustomCaption] = useState('');
  const [directUrlInput, setDirectUrlInput] = useState('');
  const [directAltInput, setDirectAltInput] = useState('');
  const [directCaptionInput, setDirectCaptionInput] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle multi-file or single-file upload
  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (!isAdminAuthorized()) {
      toast.error('Unauthorized: Administrator clearance required to upload images.');
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      const validExts = /\.(jpe?g|png|webp|svg)$/i;

      if (!validMimes.includes(file.type.toLowerCase()) && !validExts.test(file.name.toLowerCase())) {
        toast.error(`"${file.name}" is not a supported format (JPG, PNG, WebP).`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the allowed 5MB limit.`);
        continue;
      }

      try {
        const url = await blogService.uploadBlogImage(file);
        const sizeStr =
          file.size < 1024 * 1024
            ? `${Math.round(file.size / 1024)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

        const newId = `img-${Date.now()}-${i}`;
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        const newMedia: ManagedImageItem = {
          id: newId,
          url,
          name: file.name,
          alt: cleanName,
          sizeStr,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Extract natural dimensions
        const img = new Image();
        img.onload = () => {
          newMedia.dimensions = { width: img.naturalWidth, height: img.naturalHeight };
        };
        img.src = url;

        onAddImage(newMedia);
        successCount++;
      } catch (err: any) {
        toast.error(`Failed to upload "${file.name}": ${err?.message || 'Error'}`);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (successCount > 0) {
      toast.success(`${successCount} ${successCount === 1 ? 'image' : 'images'} added to media library.`);
      setActiveTab('gallery');
    }
  };

  const handleAddDirectUrl = () => {
    if (!directUrlInput.trim()) {
      toast.error('Please enter a valid image URL.');
      return;
    }
    const cleanUrl = directUrlInput.trim();
    const newMedia: ManagedImageItem = {
      id: `url-${Date.now()}`,
      url: cleanUrl,
      name: directAltInput.trim() || 'External Web Image',
      alt: directAltInput.trim() || 'Matrimonial Image',
      caption: directCaptionInput.trim() || undefined,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const img = new Image();
    img.onload = () => {
      newMedia.dimensions = { width: img.naturalWidth, height: img.naturalHeight };
    };
    img.src = cleanUrl;

    onAddImage(newMedia);
    toast.success('Image URL registered to media library.');
    setDirectUrlInput('');
    setDirectAltInput('');
    setDirectCaptionInput('');
    setActiveTab('gallery');
  };

  const handleSelectForAction = (img: ManagedImageItem) => {
    setSelectedImage(img);
    setCustomAlt(img.alt || '');
    setCustomCaption(img.caption || '');
  };

  const handleApplySetFeatured = () => {
    if (!selectedImage) return;
    onSetFeaturedImage(selectedImage.url, customAlt.trim() || selectedImage.alt);
    toast.success('Featured hero image updated.');
  };

  const handleApplyInsertInline = () => {
    if (!selectedImage) return;
    onInsertInlineImage(selectedImage.url, customAlt.trim() || selectedImage.alt, customCaption.trim());
    toast.success('Image inserted into article body.');
    onClose();
  };

  const handleCopyUrl = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success('Image URL copied to clipboard.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-manager-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between gap-3 bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-900 shadow-2xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="media-manager-modal-title" className="text-base font-bold text-stone-900 font-cinzel">
                Article Media & Image Library
              </h2>
              <p className="text-xs text-stone-500">
                Upload multiple images, set featured banners, and insert inline imagery with captions and ALT tags.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-3 px-5 sm:px-6 border-b border-stone-100 flex items-center justify-between gap-2 bg-white">
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-amber-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              Session Library ({mediaList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-amber-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Images</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-amber-800 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              Add Image URL
            </button>
          </div>

          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Recommended: 16:9 ratio, max 5MB
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Gallery / Form Column */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeTab === 'gallery' && (
              <>
                {mediaList.length === 0 ? (
                  <div className="py-16 text-center text-stone-400 space-y-3">
                    <ImageIcon className="w-10 h-10 mx-auto opacity-30 text-stone-400" />
                    <div>
                      <p className="text-xs font-semibold text-stone-700">Media Library is Empty</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Upload photography or pick from Auspicious presets to manage article imagery.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Images Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mediaList.map((img) => {
                      const isSelected = selectedImage?.id === img.id;
                      const isFeatured = featuredImageUrl === img.url;
                      return (
                        <div
                          key={img.id}
                          onClick={() => handleSelectForAction(img)}
                          className={`relative rounded-2xl overflow-hidden border p-1.5 transition-all cursor-pointer group flex flex-col ${
                            isSelected
                              ? 'border-amber-700 ring-2 ring-amber-700/20 bg-amber-50/40'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-stone-100 relative">
                            <img
                              src={img.url}
                              alt={img.alt || img.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {isFeatured && (
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-800 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                                <Star className="w-3 h-3 fill-current" />
                                <span>Featured</span>
                              </div>
                            )}
                          </div>

                          <div className="p-2 space-y-1">
                            <span className="text-xs font-semibold text-stone-800 truncate block">
                              {img.name || 'Image'}
                            </span>
                            <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                              <span>{img.sizeStr || 'Web Asset'}</span>
                              {img.dimensions && (
                                <span>{img.dimensions.width}×{img.dimensions.height}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-200 hover:border-amber-700 rounded-3xl p-8 sm:p-12 text-center transition-colors cursor-pointer bg-stone-50/50 hover:bg-amber-50/30 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-900 mx-auto flex items-center justify-center shadow-2xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-stone-800">
                      Click to browse or drop images here
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Supports multiple file upload: JPG, JPEG, PNG, WebP (Max 5MB each)
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isUploading}
                    className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs hover:bg-stone-50 transition-colors pointer-events-none"
                  >
                    {isUploading ? 'Uploading Imagery...' : 'Select Files from Computer'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={(e) => handleFilesUpload(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-3 p-4 bg-stone-50/60 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-800 block font-cinzel">
                  Register Direct Image URL
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={directUrlInput}
                    onChange={(e) => setDirectUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs font-mono text-stone-800 focus:outline-hidden focus:border-amber-700 bg-white"
                  />
                  <input
                    type="text"
                    value={directAltInput}
                    onChange={(e) => setDirectAltInput(e.target.value)}
                    placeholder="Descriptive ALT text (e.g. Royal Rajasthani wedding mandap with marigold fluting)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-hidden focus:border-amber-700 bg-white"
                  />
                  <input
                    type="text"
                    value={directCaptionInput}
                    onChange={(e) => setDirectCaptionInput(e.target.value)}
                    placeholder="Optional figure caption (displayed below image in article body)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-hidden focus:border-amber-700 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddDirectUrl}
                    className="px-4 py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors shadow-2xs cursor-pointer"
                  >
                    Add to Library
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action & Configuration Column (when image is selected) */}
          <div className="w-full md:w-5/12 p-5 border-t md:border-t-0 md:border-l border-stone-100 bg-stone-50/30 flex flex-col justify-between space-y-4">
            {selectedImage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-xs font-bold text-stone-900 font-cinzel">Selected Image</span>
                  <span className="text-[10px] text-stone-400 font-mono">{selectedImage.uploadedAt}</span>
                </div>

                {/* Thumbnail Preview */}
                <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 aspect-[16/9] relative group">
                  <img
                    src={selectedImage.url}
                    alt={customAlt || selectedImage.alt}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(selectedImage.url)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs transition-colors cursor-pointer"
                    title="Copy Image URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* ALT Text Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-700 block">
                    Image ALT Text (Accessibility & SEO)
                  </label>
                  <input
                    type="text"
                    value={customAlt}
                    onChange={(e) => setCustomAlt(e.target.value)}
                    placeholder="e.g. Traditional wedding ceremony with sacred diya"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:border-amber-700"
                  />
                </div>

                {/* Caption Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-700 block">
                    Figure Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={customCaption}
                    onChange={(e) => setCustomCaption(e.target.value)}
                    placeholder="e.g. Figure 1: Ashtakoot Guna Milan criteria in marriage matching"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:outline-hidden focus:border-amber-700"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleApplySetFeatured}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Set as Article Featured Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyInsertInline}
                    className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-stone-600" />
                    <span>Insert Inline at Cursor</span>
                  </button>

                  {!selectedImage.isPreset && (
                    <div className="pt-2 text-right">
                      {deleteConfirmId === selectedImage.id ? (
                        <div className="flex items-center justify-end gap-1.5 text-xs">
                          <span className="text-[11px] text-red-600">Remove from library?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onRemoveImage(selectedImage.id);
                              setSelectedImage(null);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded bg-red-600 text-white font-semibold text-[10px]"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 rounded bg-stone-200 text-stone-700 text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(selectedImage.id)}
                          className="text-[11px] text-red-600 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove image</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-stone-400 space-y-2">
                <Info className="w-7 h-7 mx-auto opacity-30 text-stone-400" />
                <p className="text-xs font-medium text-stone-600">Select an image to manage</p>
                <p className="text-[11px] text-stone-400">
                  Click any image to set it as featured or insert it into the article body.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer"
            >
              Close Media Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
