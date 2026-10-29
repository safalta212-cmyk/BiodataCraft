import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { templateService } from '../services/templateService';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { Template } from '../types/template';
import { BiodataTemplateView } from '../components/templates/BiodataTemplateView';
import { sampleHinduBiodata, sampleHindiBiodata } from '../data/initialBiodata';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';
import { Loading } from '../components/ui/Loading';
import { useToast } from '../context/ToastContext';
import { DownloadModal } from '../components/preview/DownloadModal';
import { getTemplateDisplayThumbnail } from '../utils/templateVisuals';
import {
  ArrowLeft,
  Sparkles,
  Download,
  Eye,
  CheckCircle2,
  Palette,
  ShieldCheck,
  Crown,
  Share2,
  Printer,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const TemplateDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleType, setSampleType] = useState<'groom' | 'bride'>('groom');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const currentSampleData = sampleType === 'groom' ? sampleHinduBiodata : sampleHindiBiodata;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: template?.name || 'Indian Marriage Biodata Template',
          text: template?.description || 'Create your marriage biodata with this beautiful template',
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Template link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleUseTemplate = () => {
    if (!template) return;
    storageService.setSelectedTemplate(template.id);
    navigate(`/create?template=${template.id}`);
  };

  const handleDownloadSamplePdf = () => {
    if (!template) return;
    setIsDownloadModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    let isMounted = true;
    async function loadTemplate() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const isAdmin = typeof window !== 'undefined' && Boolean(sessionStorage.getItem('biodatacraft_admin_token'));
        const found = await templateService.getTemplateBySlug(slug, isAdmin);
        if (isMounted) {
          setTemplate(found);
          if (found) {
            analyticsService.trackTemplateView(found.slug);
          }
        }
      } catch (err) {
        console.error('Error fetching template detail:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadTemplate();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  useSEO({
    title: template
      ? (template.seoTitle || `${template.name} - Indian Marriage Biodata Template | BiodataCraft`)
      : isLoading
      ? 'Loading Template | BiodataCraft'
      : 'Template Not Found | BiodataCraft',
    description: template
      ? (template.seoDescription || `${template.description} Download high-resolution printable PDF format.`)
      : 'Explore authentic Indian marriage biodata designs.',
    canonicalPath: template ? `/templates/${template.slug}` : '/templates',
    noindex: !template && !isLoading,
    ogImage: template?.thumbnail || template?.previewImage,
    breadcrumbs: template
      ? [
          { name: 'Templates', path: '/templates' },
          { name: template.name, path: `/templates/${template.slug}` }
        ]
      : [{ name: 'Templates', path: '/templates' }]
  });

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-14">
      {isLoading ? (
        <div className="py-20 text-center">
          <Loading text="Loading template layout details..." size="lg" />
        </div>
      ) : !template ? (
        <div className="py-16 px-4">
          <ErrorState
            title="Template Not Found"
            message={`The requested template "${slug || ''}" does not exist in our catalog.`}
            showHomeButton
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Navigation Breadcrumb */}
          <div className="flex items-center justify-between">
            <Link
              to="/templates"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Templates</span>
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 cursor-pointer shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Design</span>
            </button>
          </div>

          {/* Hero Banner Header */}
          <div
            className="rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl"
            style={{ backgroundColor: template.templateConfig.primaryColor }}
          >
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white">
                  {template.categoryName || template.categoryId}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-950/40 text-amber-200 flex items-center gap-1">
                  {template.isPremium && <Crown className="w-3 h-3" />}
                  <span>{template.isPremium ? 'Premium Indian Layout' : '100% Free Forever'}</span>
                </span>
                <span className="text-xs text-white/80">• {template.region}</span>
                <span className="text-xs text-white/80">• {template.religion}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold font-cinzel tracking-tight">
                {template.name}
              </h1>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                {template.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  size="md"
                  variant="outline"
                  onClick={handleUseTemplate}
                  className="bg-white text-stone-900 hover:bg-stone-100 border-none font-bold shadow-lg"
                  leftIcon={<Sparkles className="w-4 h-4 text-amber-800" />}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Use This Template Now
                </Button>

                <Button
                  size="md"
                  variant="ghost"
                  onClick={handleDownloadSamplePdf}
                  className="text-white hover:bg-white/10 border border-white/30"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download Sample PDF
                </Button>
              </div>
            </div>

            {/* Decorative circular background pattern */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full border-16 border-white/10 pointer-events-none" />
          </div>

          {/* Dual Layout: Details & Controls on Left, Document Preview on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Template Information & Attributes (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  {/* Design Artwork Card Showcase */}
                  <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs h-56 flex items-center justify-center relative group">
                    <img
                      src={getTemplateDisplayThumbnail(template)}
                      alt={`${template.name} artwork`}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-bold flex items-center justify-between">
                      <span className="font-cinzel drop-shadow-sm">{template.name}</span>
                      <span className="text-[10px] bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-white/20 text-amber-200 shadow-xs">
                        From BiodataCraft
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-stone-900 font-cinzel uppercase tracking-wider pt-1">
                    Template Specifications
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Cultural Group:</span>
                      <span className="font-semibold text-stone-800">{template.popularFor}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Region:</span>
                      <span className="font-semibold text-stone-800">{template.region}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Religion:</span>
                      <span className="font-semibold text-stone-800">{template.religion}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Language:</span>
                      <span className="font-semibold text-stone-800">{template.language}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Border Style:</span>
                      <span className="font-semibold text-stone-800 capitalize">
                        {template.templateConfig.borderStyle} Frame
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-stone-100">
                      <span className="text-stone-500">Typography Font:</span>
                      <span className="font-semibold text-stone-800 uppercase">
                        {template.templateConfig.fontFamily}
                      </span>
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-stone-700 block mb-2">
                      Design Palette:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-stone-300"
                          style={{ backgroundColor: template.templateConfig.primaryColor }}
                        />
                        <span className="font-mono text-[11px]">
                          {template.templateConfig.primaryColor}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-stone-300"
                          style={{ backgroundColor: template.templateConfig.secondaryColor }}
                        />
                        <span className="font-mono text-[11px]">
                          {template.templateConfig.secondaryColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    <Button
                      size="md"
                      variant="primary"
                      onClick={handleUseTemplate}
                      className="w-full justify-center shadow-md font-bold"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Start Biodata With This Design
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-950">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Client-Side Document Creation</strong>
                  <span className="text-emerald-900 leading-relaxed block mt-0.5">
                    When you select this design, your candidate details remain exclusively in your local browser memory.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Document Preview (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Preview Toolbar */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">Sample Candidate:</span>
                  <div className="bg-stone-100 p-0.5 rounded-xl flex items-center text-xs font-semibold">
                    <button
                      onClick={() => setSampleType('groom')}
                      className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                        sampleType === 'groom'
                          ? 'bg-amber-800 text-white font-bold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Aarav (Groom - English)
                    </button>
                    <button
                      onClick={() => setSampleType('bride')}
                      className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                        sampleType === 'bride'
                          ? 'bg-amber-800 text-white font-bold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      प्रिया (वधू - हिन्दी)
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadSamplePdf}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Sample PDF
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePrint}
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Print
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleUseTemplate}
                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-200" />}
                    className="text-xs font-bold"
                  >
                    Use Template
                  </Button>
                </div>
              </div>

              {/* Document Render Container */}
              <div className="bg-stone-200/90 border border-stone-300 rounded-3xl p-4 sm:p-6 overflow-x-auto flex justify-center shadow-inner">
                <div className="my-auto transform scale-[0.65] sm:scale-[0.8] md:scale-[0.9] lg:scale-100 origin-top">
                  <BiodataTemplateView
                    data={currentSampleData}
                    templateOverride={template}
                    scale={1}
                    id="template-detail-preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {template && (
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          candidateName={currentSampleData.fullName}
          templateId={template.id}
          language={currentSampleData.language}
          data={{
            ...currentSampleData,
            templateId: template.id as any,
            themeColor: template.templateConfig?.primaryColor || currentSampleData.themeColor
          }}
        />
      )}
    </div>
  );
};
