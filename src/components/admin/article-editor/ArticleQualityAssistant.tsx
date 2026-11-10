import React, { useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  BookOpen,
  Link as LinkIcon,
  HelpCircle,
  TrendingUp,
  FileText,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';

interface QualityCheckItem {
  id: string;
  label: string;
  passed: boolean;
  severity: 'required' | 'recommended' | 'optional';
  message: string;
  suggestion?: string;
  onFix?: () => void;
}

interface ArticleQualityAssistantProps {
  title: string;
  slug: string;
  excerpt: string;
  contentBody: string;
  featuredImage: string;
  featuredImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  onApplyTitleSuggestion: (newTitle: string) => void;
  onApplyDescriptionSuggestion: (newDesc: string) => void;
  onApplyExcerptSuggestion: (newExcerpt: string) => void;
  onOpenInternalLinksModal: () => void;
  onOpenStructureModal: () => void;
}

export const ArticleQualityAssistant: React.FC<ArticleQualityAssistantProps> = ({
  title,
  slug,
  excerpt,
  contentBody,
  featuredImage,
  featuredImageAlt,
  seoTitle,
  seoDescription,
  focusKeyword,
  onApplyTitleSuggestion,
  onApplyDescriptionSuggestion,
  onApplyExcerptSuggestion,
  onOpenInternalLinksModal,
  onOpenStructureModal
}) => {
  // Analyze content for quality checks
  const analysis = useMemo(() => {
    const paragraphs = contentBody
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const firstParagraph = paragraphs[0] || '';
    const hasIntro = firstParagraph.length > 50 && !firstParagraph.startsWith('#');

    // Headings
    const h2Matches = contentBody.match(/^##\s+.+$/gm) || [];
    const hasH2 = h2Matches.length >= 2;

    // Featured Image & ALT
    const hasFeaturedImage = Boolean(featuredImage.trim());
    const hasImageAlt = hasFeaturedImage ? Boolean(featuredImageAlt.trim()) : true;

    // Very long paragraphs (>120 words)
    const longParagraphs = paragraphs.filter((p) => {
      const words = p.split(/\s+/).length;
      return words > 120 && !p.startsWith('|'); // skip tables
    });
    const hasLongParagraphs = longParagraphs.length > 0;

    // Internal links (matching /templates, /create, /samples, /blog, /marriage-biodata, etc.)
    const internalLinkRegex = /\[([^\]]+)\]\((\/[^\s)]+|https?:\/\/[^\s)]*(biodatacraft|vercel)[^\s)]*)\)/gi;
    const internalLinks = contentBody.match(internalLinkRegex) || [];
    const hasInternalLinks = internalLinks.length >= 1;

    // Conclusion (look for ## Conclusion, Next Steps, or final paragraph CTA)
    const hasConclusion = /(##\s+(conclusion|next steps|wrapping up|final thoughts)|summary|in summary)/i.test(contentBody);

    // SEO Meta Title & Description
    const hasSeoTitle = seoTitle.trim().length >= 40 && seoTitle.trim().length <= 70;
    const hasSeoDesc = seoDescription.trim().length >= 110 && seoDescription.trim().length <= 170;

    // Article Excerpt
    const hasExcerpt = excerpt.trim().length >= 80;

    // Readability: average sentence length in words
    const sentences = contentBody.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const totalWords = contentBody.trim() ? contentBody.trim().split(/\s+/).length : 0;
    const avgWordsPerSentence = sentences.length > 0 ? Math.round(totalWords / sentences.length) : 0;
    const readabilityTier =
      avgWordsPerSentence <= 16
        ? 'Excellent (Easy to read for families)'
        : avgWordsPerSentence <= 24
        ? 'Good (Standard conversational tone)'
        : 'Dense (Consider shorter sentences)';

    // Keyword detection
    const kw = focusKeyword.trim().toLowerCase();
    const keywordInTitle = kw ? title.toLowerCase().includes(kw) : false;
    const keywordInIntro = kw && firstParagraph ? firstParagraph.toLowerCase().includes(kw) : false;
    const keywordInH2 = kw ? h2Matches.some((h) => h.toLowerCase().includes(kw)) : false;

    // Internal linking opportunities (keywords in text that lack links)
    const linkingOpportunities: Array<{ keyword: string; route: string; pageName: string }> = [];
    if (!contentBody.includes('/create') && /biodata maker|make biodata|create biodata/i.test(contentBody)) {
      linkingOpportunities.push({ keyword: 'biodata maker', route: '/create', pageName: 'Online Biodata Maker' });
    }
    if (!contentBody.includes('/templates') && /templates?|biodata templates?/i.test(contentBody)) {
      linkingOpportunities.push({ keyword: 'templates', route: '/templates', pageName: 'Templates Catalog' });
    }
    if (!contentBody.includes('/samples') && /samples?|sample profiles?/i.test(contentBody)) {
      linkingOpportunities.push({ keyword: 'samples', route: '/samples', pageName: 'Biodata Samples' });
    }
    if (!contentBody.includes('/hindu-marriage-biodata') && /hindu|kundali|gotra/i.test(contentBody)) {
      linkingOpportunities.push({ keyword: 'kundali / gotra', route: '/hindu-marriage-biodata', pageName: 'Hindu Biodata Format' });
    }

    return {
      hasIntro,
      hasH2,
      h2Count: h2Matches.length,
      hasFeaturedImage,
      hasImageAlt,
      hasLongParagraphs,
      longParagraphCount: longParagraphs.length,
      hasInternalLinks,
      internalLinkCount: internalLinks.length,
      hasConclusion,
      hasSeoTitle,
      hasSeoDesc,
      hasExcerpt,
      totalWords,
      readabilityTier,
      avgWordsPerSentence,
      keywordInTitle,
      keywordInIntro,
      keywordInH2,
      linkingOpportunities
    };
  }, [title, slug, excerpt, contentBody, featuredImage, featuredImageAlt, seoTitle, seoDescription, focusKeyword]);

  // Construct standard checklist items
  const qualityChecks: QualityCheckItem[] = [
    {
      id: 'intro',
      label: 'Engaging Introduction',
      passed: analysis.hasIntro,
      severity: 'recommended',
      message: analysis.hasIntro
        ? 'Article starts with a clear introductory paragraph.'
        : 'Missing intro: Open with a compelling paragraph before the first heading.'
    },
    {
      id: 'h2-headings',
      label: 'Structured H2 Headings',
      passed: analysis.hasH2,
      severity: 'required',
      message: analysis.hasH2
        ? `Found ${analysis.h2Count} H2 headings for logical flow.`
        : 'Missing H2 headings: Use at least 2 H2 headings to divide major concepts.'
    },
    {
      id: 'featured-image',
      label: 'Featured Hero Image',
      passed: analysis.hasFeaturedImage,
      severity: 'recommended',
      message: analysis.hasFeaturedImage
        ? 'Featured hero image is attached.'
        : 'Attach an auspicious matrimonial banner for visual engagement.'
    },
    {
      id: 'image-alt',
      label: 'Image ALT Text',
      passed: analysis.hasImageAlt,
      severity: 'recommended',
      message: analysis.hasImageAlt
        ? 'Featured image has descriptive ALT text.'
        : 'Missing ALT text: Provide descriptive text for screen readers and SEO.'
    },
    {
      id: 'paragraph-length',
      label: 'Scannable Paragraphs',
      passed: !analysis.hasLongParagraphs,
      severity: 'recommended',
      message: !analysis.hasLongParagraphs
        ? 'Paragraphs are bite-sized and mobile friendly.'
        : `Found ${analysis.longParagraphCount} long paragraph(s) (>120 words). Break up dense text.`
    },
    {
      id: 'internal-links',
      label: 'Internal Website Links',
      passed: analysis.hasInternalLinks,
      severity: 'recommended',
      message: analysis.hasInternalLinks
        ? `Includes ${analysis.internalLinkCount} internal link(s) to website resources.`
        : 'Missing internal links: Link to biodata templates, the maker, or formats.'
    },
    {
      id: 'conclusion',
      label: 'Conclusion & Next Steps',
      passed: analysis.hasConclusion,
      severity: 'recommended',
      message: analysis.hasConclusion
        ? 'Article has a dedicated conclusion or next steps section.'
        : 'Add a concluding section with actionable advice or next steps.'
    },
    {
      id: 'seo-title',
      label: 'SEO Title Length (50–60 chars)',
      passed: analysis.hasSeoTitle,
      severity: 'optional',
      message: analysis.hasSeoTitle
        ? `SEO Title is ${seoTitle.length} characters (Optimal).`
        : `SEO Title is ${seoTitle.length} characters. Recommended range: 50–60 characters.`
    },
    {
      id: 'seo-desc',
      label: 'Meta Description (120–160 chars)',
      passed: analysis.hasSeoDesc,
      severity: 'optional',
      message: analysis.hasSeoDesc
        ? `Meta Description is ${seoDescription.length} characters (Optimal).`
        : `Meta Description is ${seoDescription.length} characters. Recommended range: 120–160 characters.`
    },
    {
      id: 'excerpt',
      label: 'Article Catalog Excerpt',
      passed: analysis.hasExcerpt,
      severity: 'required',
      message: analysis.hasExcerpt
        ? 'Article excerpt provided for directory cards.'
        : 'Write a 2–3 sentence summary displayed in the blog directory.'
    }
  ];

  const passedCount = qualityChecks.filter((c) => c.passed).length;
  const scorePercent = Math.round((passedCount / qualityChecks.length) * 100);

  // Smart suggestions generator
  const currentYear = new Date().getFullYear();
  const titleSuggestion = title
    ? `${title.replace(/\s*\|\s*BiodataCraft/gi, '').replace(/\s*-\s*\d{4}/g, '')} - ${currentYear} Complete Guide | BiodataCraft`
    : `How to Write an Indian Marriage Biodata: ${currentYear} Complete Guide | BiodataCraft`;

  const descSuggestion = excerpt
    ? `${excerpt.slice(0, 140).trim()}... Explore authentic templates and format tips at BiodataCraft.`
    : `Learn how to write a dignified Indian marriage biodata. Includes Gotra, Kundali, family background tips, and free downloadable templates.`;

  return (
    <div className="space-y-5 text-xs">
      {/* Overall Score Gauge */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-800" />
            <span className="font-bold text-stone-900 font-cinzel text-xs">Article Quality Score</span>
          </div>
          <span className="font-bold text-sm text-amber-900 font-mono">
            {passedCount}/{qualityChecks.length} ({scorePercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              scorePercent >= 80
                ? 'bg-emerald-600'
                : scorePercent >= 60
                ? 'bg-amber-600'
                : 'bg-amber-800'
            }`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>

        <p className="text-[11px] text-stone-500 leading-normal">
          {scorePercent >= 80
            ? 'Excellent! Your article meets comprehensive matrimonial publishing standards.'
            : scorePercent >= 60
            ? 'Good progress. Address recommended items below to enhance reader experience.'
            : 'Draft in progress. Complete foundational sections for a polished guide.'}
        </p>

        {/* Mandatory SEO Disclaimer */}
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-[10px] text-stone-500 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
          <span>
            <strong>Editorial Standard:</strong> Quality metrics evaluate structure, readability, and completeness. They do not guarantee search engine rankings or traffic.
          </span>
        </div>
      </div>

      {/* 10 Quality Checks Checklist */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <span className="font-bold text-stone-900 text-xs">10-Point Readiness Checklist</span>
          <span className="text-[10px] text-stone-400 font-mono">Live Validation</span>
        </div>

        <div className="space-y-2">
          {qualityChecks.map((check) => (
            <div
              key={check.id}
              className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors ${
                check.passed
                  ? 'bg-emerald-50/40 border-emerald-200/60 text-emerald-950'
                  : check.severity === 'required'
                  ? 'bg-red-50/40 border-red-200 text-red-950'
                  : 'bg-stone-50/70 border-stone-200/80 text-stone-700'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {check.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      check.severity === 'required' ? 'text-red-500' : 'text-amber-600'
                    }`}
                  />
                )}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-semibold text-xs text-stone-900">{check.label}</span>
                  <span className="text-[10px] uppercase font-mono text-stone-400">
                    {check.severity}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-normal">{check.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Writing Improvement Assistant */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Sparkles className="w-4 h-4 text-amber-800" />
          <span className="font-bold text-stone-900 text-xs font-cinzel">SEO Improvement Assistant</span>
        </div>

        {/* Readability Score */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700">Readability Analysis</span>
            <span className="font-mono text-amber-900 font-bold text-[11px]">
              ~{analysis.avgWordsPerSentence} words/sentence
            </span>
          </div>
          <p className="text-[11px] text-stone-500">{analysis.readabilityTier}</p>
        </div>

        {/* Keyword Placement Report */}
        {focusKeyword && (
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-2">
            <span className="font-semibold text-stone-800 block text-xs">
              Keyword Placement: <strong className="font-mono text-amber-900">"{focusKeyword}"</strong>
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <span className={`p-1.5 rounded-lg border text-center ${analysis.keywordInTitle ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                {analysis.keywordInTitle ? '✓ In Title' : 'Missing Title'}
              </span>
              <span className={`p-1.5 rounded-lg border text-center ${analysis.keywordInIntro ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                {analysis.keywordInIntro ? '✓ In Intro' : 'Missing Intro'}
              </span>
              <span className={`p-1.5 rounded-lg border text-center ${analysis.keywordInH2 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                {analysis.keywordInH2 ? '✓ In H2' : 'Missing H2'}
              </span>
            </div>
          </div>
        )}

        {/* Internal Link Opportunities */}
        {analysis.linkingOpportunities.length > 0 && (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-amber-800" />
                <span>Internal Linking Opportunities</span>
              </span>
              <button
                type="button"
                onClick={onOpenInternalLinksModal}
                className="text-[10px] text-amber-800 hover:underline font-semibold"
              >
                Browse All
              </button>
            </div>
            <div className="space-y-1.5">
              {analysis.linkingOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white rounded-lg border border-stone-200 flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <span className="text-[11px] font-semibold text-stone-800 block">
                      Found keyword: <code className="text-amber-800">"{opp.keyword}"</code>
                    </span>
                    <span className="text-[10px] text-stone-400 truncate block">
                      Link to {opp.pageName} ({opp.route})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenInternalLinksModal}
                    className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-medium cursor-pointer shrink-0"
                  >
                    Insert Link
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Title Improvement Suggestion */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
            <span>Suggested SEO Title</span>
            <span className="text-[10px] text-stone-400 font-mono">{titleSuggestion.length} chars</span>
          </div>
          <p className="text-[11px] font-mono text-stone-700 bg-white p-2 rounded-lg border border-stone-200">
            {titleSuggestion}
          </p>
          <button
            type="button"
            onClick={() => onApplyTitleSuggestion(titleSuggestion)}
            className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer pt-0.5"
          >
            <span>Apply suggested title</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Description Improvement Suggestion */}
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
            <span>Suggested Meta Description</span>
            <span className="text-[10px] text-stone-400 font-mono">{descSuggestion.length} chars</span>
          </div>
          <p className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-200 italic leading-relaxed">
            {descSuggestion}
          </p>
          <button
            type="button"
            onClick={() => onApplyDescriptionSuggestion(descSuggestion)}
            className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer pt-0.5"
          >
            <span>Apply suggested description</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Article Outline Quick Action */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenStructureModal}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 border border-amber-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-amber-800" />
            <span>Open Article Structure Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
