import React, { useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { getKeywordPageBySlug, KeywordPageMetadata } from '../../data/keywordCatalog';
import { TEMPLATES, sampleHinduBiodata, sampleHindiBiodata } from '../../data/initialBiodata';
import { storageService } from '../../services/storageService';
import { analyticsService } from '../../services/analyticsService';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { DownloadModal } from '../../components/preview/DownloadModal';
import { InternalLinkingHub } from '../../components/seo/InternalLinkingHub';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  Edit3,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Layers,
  HeartHandshake,
  Compass,
  FileText
} from 'lucide-react';

import { NotFoundPage } from '../NotFoundPage';

export const KeywordLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  if (!slug) {
    return <Navigate to="/biodata" replace />;
  }

  const pageData: KeywordPageMetadata | undefined = getKeywordPageBySlug(slug);

  if (!pageData) {
    return <NotFoundPage />;
  }

  // SEO configuration
  useSEO({
    title: pageData.title,
    description: pageData.metaDescription,
    canonicalPath: `/biodata/${pageData.slug}`,
    ogType: 'article',
    breadcrumbs: [
      { name: 'Matrimonial Topics', path: '/biodata' },
      { name: pageData.h1, path: `/biodata/${pageData.slug}` }
    ],
    faqs: pageData.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    article: {
      title: pageData.title,
      description: pageData.metaDescription,
      url: `https://biodata-craft.vercel.app/biodata/${pageData.slug}`
    }
  });

  const sampleData = pageData.suggestedSample === 'hindi' ? sampleHindiBiodata : sampleHinduBiodata;

  const handleStartCreation = (templateId?: string) => {
    const draft = {
      ...sampleData,
      templateId: templateId || pageData.recommendedTemplateIds[0] || 'royal-heritage'
    };
    storageService.saveLocalDraft(draft);
    analyticsService.trackEvent('keyword_page_create_click', {
      keyword: pageData.keyword,
      slug: pageData.slug,
      templateId: draft.templateId
    });
    navigate('/create');
  };

  const matchingTemplates = TEMPLATES.filter((t) =>
    pageData.recommendedTemplateIds.includes(t.id)
  );

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: 'Topics', path: '/biodata' },
            { name: pageData.category, path: '/biodata' },
            { name: pageData.h1, path: `/biodata/${pageData.slug}` }
          ]}
        />

        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-white rounded-3xl p-6 sm:p-12 border border-amber-900/40 shadow-xl">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            {/* Auspicious Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-xs">
              <span className="font-rozha text-sm">ॐ</span>
              <span>{pageData.category}</span>
              <span className="text-amber-400/60">•</span>
              <span className="text-stone-300">{pageData.categoryHindi}</span>
            </div>

            {/* Main H1 */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-cinzel leading-tight text-white">
              {pageData.h1}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-base sm:text-lg text-amber-100/90 font-medium leading-relaxed">
              {pageData.tagline}
            </p>

            {/* Cultural Context Intro */}
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              {pageData.culturalContext}
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => handleStartCreation()}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-900/30 hover:scale-102 cursor-pointer flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Create This Biodata Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsDownloadOpen(true)}
                className="px-5 py-3.5 bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Sample A4 PDF</span>
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free Forever</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Customer Data Storage</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>No Watermark on Download</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Crucial Checklist Pillars for This Topic */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Formatting Standards & Guidelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-cinzel">
              Key Sections for {pageData.h1}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Essential matrimonial particulars required by prospective families and matching pandits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pageData.keyChecklist.map((item, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-300 transition-all space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs shrink-0 font-cinzel">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base font-cinzel">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pl-9">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Templates Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Auspicious Layouts
              </span>
              <h2 className="text-2xl font-bold text-stone-900 font-cinzel mt-0.5">
                Recommended Templates for {pageData.h1}
              </h2>
            </div>
            <Link
              to="/templates"
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
            >
              <span>View All 10+ Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                {/* Visual Palette Preview Header */}
                <div
                  className="h-36 relative p-5 flex flex-col justify-between overflow-hidden border-b border-stone-200"
                  style={{
                    backgroundColor: template.accentBg || '#fffaf5',
                    borderTop: `4px solid ${template.primaryColor}`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
                      style={{ backgroundColor: template.primaryColor }}
                    >
                      {template.category.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-2xs"
                        style={{ backgroundColor: template.primaryColor }}
                        title="Primary Color"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-2xs"
                        style={{ backgroundColor: template.secondaryColor }}
                        title="Accent Gold"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="font-rozha text-xs opacity-60" style={{ color: template.primaryColor }}>
                      ॐ श्री गणेशाय नमः
                    </span>
                    <h4 className="font-bold text-sm font-cinzel line-clamp-1" style={{ color: template.primaryColor }}>
                      {template.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {template.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                    {template.popularFor && (
                      <p className="text-[11px] text-stone-400">
                        <strong className="text-stone-600 font-semibold">Ideal for: </strong>
                        {template.popularFor}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartCreation(template.id)}
                    className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:scale-101 cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                  >
                    <span>Use {template.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Benefits & Features */}
        <div className="bg-stone-900 text-stone-200 rounded-3xl p-6 sm:p-10 border border-stone-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Why Families Prefer BiodataCraft
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
              Built for Auspicious Indian Matrimony
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Upholding candidate privacy, Vedic cultural standards, and high-resolution export for modern matchmaking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">100% Client-Side Privacy</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Candidate photographs and sensitive family details stay strictly in your browser. Zero cloud database storage.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Zero Login / No OTP</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                No mobile number, OTP, or email required. Directly start drafting and download instantly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Vector Print-Ready A4</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Clean margins engineered for home printing without awkward browser headers or URLs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-850 border border-stone-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">WhatsApp Ready PNG</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                One-tap mobile image export with zero compression loss, ideal for family WhatsApp chats.
              </p>
            </div>
          </div>

          {/* Contextual Internal Link Graph */}
          <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
            <span className="font-semibold text-stone-300">Quick Navigation:</span>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/marriage-biodata-format" className="hover:text-amber-400 transition-colors">
                Format Checklist →
              </Link>
              <Link to="/templates" className="hover:text-amber-400 transition-colors">
                10+ Auspicious Templates →
              </Link>
              <Link to="/samples" className="hover:text-amber-400 transition-colors">
                Real Biodata Samples →
              </Link>
              <Link to="/hindu-marriage-biodata" className="hover:text-amber-400 transition-colors">
                Hindu Traditions →
              </Link>
              <Link to="/biodata" className="hover:text-amber-400 transition-colors">
                500+ Topics Directory →
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Common Questions
            </span>
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {pageData.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-stone-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 transition-colors"
                  >
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">
                      {faq.question}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Automated Internal Linking Hub */}
        <InternalLinkingHub
          currentSlug={pageData.slug}
          categoryName={pageData.category}
        />

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-lg border border-amber-800/40">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Start Now • 100% Free
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-cinzel text-white max-w-xl mx-auto leading-tight">
            Ready to Create Your {pageData.h1}?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
            Design your marriage biodata in 3 minutes with verified Kundali and Gotra formatting. Download in high-resolution vector A4 PDF with zero watermark.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleStartCreation()}
              className="px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-md hover:scale-102 cursor-pointer flex items-center gap-2"
            >
              <span>Build Biodata Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/samples"
              className="px-6 py-3.5 bg-stone-800 hover:bg-stone-700 text-white font-semibold rounded-xl text-sm transition-all border border-stone-700"
            >
              Inspect Real Samples
            </Link>
          </div>
        </div>
      </div>

      {/* Instant Download Sample Modal */}
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        candidateName={sampleData.fullName}
        templateId={pageData.recommendedTemplateIds[0] || 'royal-heritage'}
        language={sampleData.language}
        data={sampleData}
      />
    </div>
  );
};
