import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TEMPLATES, sampleHinduBiodata } from '../../data/initialBiodata';
import { storageService } from '../../services/storageService';
import { analyticsService } from '../../services/analyticsService';
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  LayoutTemplate,
  FileCheck,
  Download,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Should I choose a 1-page or a 2-page marriage biodata format?',
    answer:
      'For 90% of matrimonial introductions—especially those shared via WhatsApp, email, or family mediators—a crisp, single-page A4 format is highly recommended. It allows elders to view everything at a glance without scrolling. Use a 2-page format only if you have extensive sibling/uncle lineages or detailed horoscope charts (Kundali chakra) to display.'
  },
  {
    question: 'What are the most common mistakes to avoid in a biodata format?',
    answer:
      'Key mistakes include: 1) Overcrowding with excessive corporate jargon or bullet points, 2) Poor photo quality or casual selfies, 3) Omitting birth time and birth place needed for astrological verification, 4) Not mentioning whether siblings are married or unmarried, and 5) Using small, illegible fonts.'
  },
  {
    question: 'How should Gotra be mentioned if mother’s gotra is also expected?',
    answer:
      'Format it clearly: "Self / Paternal Gotra: Kashyap | Mother\'s (Mosal) Gotra: Vatsa". In communities observing 3 or 4 gotra rules (such as Yadav, Jat, Rajput, or Marwari), you may also list Grandmother’s gotra (Dadi).'
  },
  {
    question: 'Can I generate both English and Hindi biodata formats?',
    answer:
      'Yes! BiodataCraft fully supports English, Hindi (Devanagari script), and bilingual biodata formats with authentic Hindi section headings such as व्यक्तिगत विवरण, कुण्डली विवरण, and पारिवारिक विवरण.'
  }
];

export const MarriageBiodataFormatPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useSEO({
    title: 'Marriage Biodata Format: 1-Page vs 2-Page Layouts & Templates | BiodataCraft',
    description:
      'Discover standard Indian marriage biodata formats, 1-page vs 2-page layouts, field-by-field checklist in English & Hindi, and download printable PDF biodatas.',
    canonicalPath: '/marriage-biodata-format',
    ogType: 'article',
    breadcrumbs: [{ name: 'Marriage Biodata Format', path: '/marriage-biodata-format' }],
    faqs: FAQ_ITEMS,
    article: {
      title: 'Standard Indian Marriage Biodata Formats and Layout Specifications',
      description: 'Detailed analysis of matrimonial biodata layout formats and field requirements.',
      url: 'https://biodatacraft.in/marriage-biodata-format',
      datePublished: '2026-10-02T10:00:00Z',
      dateModified: '2026-10-05T08:00:00Z',
      authorName: 'Format Architecture Team, BiodataCraft'
    }
  });

  const handleStartBuilder = (templateId?: string) => {
    storageService.saveLocalDraft(sampleHinduBiodata);
    if (templateId) {
      storageService.setSelectedTemplate(templateId);
    }
    analyticsService.trackEvent('seo_guide_start_builder', { guide: 'marriage_biodata_format', templateId });
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs items={[{ name: 'Marriage Biodata Format' }]} />

        {/* Hero Section */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <LayoutTemplate className="w-3.5 h-3.5 text-amber-600" />
            <span>Layout & Design Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight leading-tight">
            Indian Marriage Biodata Formats & Layouts
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            The layout of your marriage biodata sets the tone for first impressions. Discover the optimal section sequence, 1-page vs 2-page formats, and bilingual terminology.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleStartBuilder()}
              leftIcon={<FileCheck className="w-5 h-5" />}
            >
              Choose Format & Edit Free
            </Button>
            <Link to="/marriage-biodata">
              <Button variant="outline" size="lg">
                Read General Biodata Guide
              </Button>
            </Link>
          </div>
        </header>

        {/* Format Comparison: 1-Page vs 2-Page */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-amber-300 bg-white shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Most Popular
            </div>
            <CardContent className="p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-stone-900 font-cinzel">
                Standard 1-Page A4 Format
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                A single-sheet condensed layout that fits all vital details: identity, career, horoscope, nuclear family, and contact numbers.
              </p>
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Optimal for WhatsApp & quick mobile preview</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Respects the time of busy family elders</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero risk of missing second-page pages when printed</span>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleStartBuilder('royal-heritage')}
              >
                Use 1-Page Format
              </Button>
            </CardContent>
          </Card>

          <Card className="border-stone-200 bg-white shadow-xs">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-stone-900 font-cinzel">
                Comprehensive 2-Page Format
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                An extended layout designed for joint families with detailed astrological charts (Kundali Kund), extended uncles, and comprehensive ancestral roots.
              </p>
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
                <div className="flex items-center gap-2 text-stone-800">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Ample room for planetary degrees & Lagna chakra</span>
                </div>
                <div className="flex items-center gap-2 text-stone-800">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Space for multiple Tau Ji, Chacha Ji, and Bua Ji details</span>
                </div>
                <div className="flex items-center gap-2 text-stone-800">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Separate dedicated page for family pedigree</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleStartBuilder('modern-elegance')}
              >
                Use 2-Page Format
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Complete Field Checklist Table */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              Complete Field-by-Field Checklist
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Verify your information against this standard checklist before finalizing your PDF:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-amber-50 text-amber-950 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 border-b border-stone-200">Category</th>
                  <th className="p-3 border-b border-stone-200">English Field Label</th>
                  <th className="p-3 border-b border-stone-200">Hindi Equivalent</th>
                  <th className="p-3 border-b border-stone-200">Recommended Format / Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-3 font-semibold text-stone-900" rowSpan={3}>Personal Details</td>
                  <td className="p-3">Full Name</td>
                  <td className="p-3">पूरा नाम</td>
                  <td className="p-3">Pooja Sharma (Include middle/surname)</td>
                </tr>
                <tr>
                  <td className="p-3">Date & Time of Birth</td>
                  <td className="p-3">जन्म तिथि एवं समय</td>
                  <td className="p-3">14 March 1997, 07:45 AM</td>
                </tr>
                <tr>
                  <td className="p-3">Height & Complexion</td>
                  <td className="p-3">ऊंचाई एवं वर्ण</td>
                  <td className="p-3">5 ft 4 in (162 cm), Fair / Wheatish</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="p-3 font-semibold text-stone-900" rowSpan={3}>Astrology / Kundali</td>
                  <td className="p-3">Gotra (Self & Mosal)</td>
                  <td className="p-3">गोत्र (स्वयं एवं ननिहाल)</td>
                  <td className="p-3">Vatsa (Self) / Kaushik (Maternal)</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="p-3">Rashi & Nakshatra</td>
                  <td className="p-3">राशी एवं नक्षत्र</td>
                  <td className="p-3">Tula (Libra), Chitra Nakshatra</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="p-3">Manglik Status</td>
                  <td className="p-3">मांगलिक स्थिति</td>
                  <td className="p-3">Non-Manglik / Anshik Manglik</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900" rowSpan={2}>Education & Career</td>
                  <td className="p-3">Highest Education</td>
                  <td className="p-3">उच्चतम शिक्षा</td>
                  <td className="p-3">B.Tech (Computer Science), IIT Roorkee</td>
                </tr>
                <tr>
                  <td className="p-3">Occupation & Company</td>
                  <td className="p-3">व्यवसाय एवं संस्थान</td>
                  <td className="p-3">Senior Software Engineer at Oracle</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="p-3 font-semibold text-stone-900" rowSpan={2}>Family Details</td>
                  <td className="p-3">Parents Background</td>
                  <td className="p-3">माता-पिता का विवरण</td>
                  <td className="p-3">Father: Chief Manager (SBI); Mother: Homemaker</td>
                </tr>
                <tr className="bg-stone-50/50">
                  <td className="p-3">Siblings</td>
                  <td className="p-3">भाई एवं बहन</td>
                  <td className="p-3">1 Elder Brother (Married, Architect), 1 Younger Sister</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dos and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Format Dos (Best Practices)</span>
            </div>
            <ul className="text-xs text-emerald-950 space-y-2 list-disc list-inside leading-relaxed">
              <li>Use high-contrast fonts (e.g., Cinzel for headings, Plus Jakarta Sans for body text).</li>
              <li>Include city and state of ancestral village for native connection.</li>
              <li>Ensure contact mobile number has an active WhatsApp connection.</li>
              <li>Always proofread spellings of sacred mantras and gotra names.</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-rose-50/60 border border-rose-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-rose-700" />
              <span>Format Don’ts (Common Pitfalls)</span>
            </div>
            <ul className="text-xs text-rose-950 space-y-2 list-disc list-inside leading-relaxed">
              <li>Do not use low-resolution, pixelated photos or heavily filtered social selfies.</li>
              <li>Do not hide astrological or marital status; transparency builds lasting trust.</li>
              <li>Avoid cluttered decorative graphics that distract from readable text.</li>
              <li>Do not share full home addresses publicly before initial mutual consent.</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Formatting Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
              Format Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-stone-200 bg-white rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                  >
                    <span className="font-bold text-stone-900 text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 transition-transform ${
                        isOpen ? 'rotate-180 text-amber-800' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-3xl bg-amber-900 text-white p-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel">
            Build Your Biodata Using This Proven Format
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-lg mx-auto">
            Choose from authentic Indian templates pre-configured with all standard fields. Free, private, and instant PDF download.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleStartBuilder()}
            leftIcon={<Download className="w-5 h-5" />}
          >
            Launch Free Biodata Maker
          </Button>
        </div>
      </div>
    </div>
  );
};
