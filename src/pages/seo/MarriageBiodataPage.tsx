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
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Download,
  ScrollText,
  Clock,
  BookOpen,
  Award,
  Eye,
  FileCheck
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What is the primary difference between a job resume and an Indian marriage biodata?',
    answer:
      'While a professional CV highlights individual career accomplishments, promotions, and technical capabilities, an Indian marriage biodata is a comprehensive matrimonial portrait that gives equal weight to family lineage, cultural roots, astrological alignment (Kundali & Gotra), and personal values. It is created to help two families evaluate mutual compatibility and shared traditions.'
  },
  {
    question: 'Should salary and annual CTC be explicitly mentioned in a marriage biodata?',
    answer:
      'In contemporary Indian matchmaking, mentioning an annual income or package range is common for working professionals, especially in groom biodatas. However, it can also be communicated as "Working as Senior Consultant at Infosys, Bangalore" without printing exact figures if the family prefers discussing financials during personal conversations.'
  },
  {
    question: 'Why are Maternal Uncle (Mama Ji / Mosal) details required?',
    answer:
      'In North, Central, and Western Indian traditions (including Gujarati, Marwari, Yadav, and Rajasthani communities), the maternal uncle represents the mother’s ancestral lineage. Providing the Mama Ji’s name, gotra, and location helps verify family standing and avoid sagotra alliances from both paternal and maternal sides.'
  },
  {
    question: 'Can I create and download a marriage biodata for free on BiodataCraft?',
    answer:
      'Yes. BiodataCraft is 100% free with no hidden charges, watermarks, or user login requirements. Your biodata is rendered entirely in your browser with zero data stored on cloud servers.'
  },
  {
    question: 'What photo format works best on a matrimonial biodata?',
    answer:
      'A recent, high-resolution portrait photograph with clean lighting, gentle smiling expression, and decent traditional or smart-casual attire works best. Avoid heavily filtered selfies, group photos, or sunglasses.'
  }
];

export const MarriageBiodataPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useSEO({
    title: 'Marriage Biodata: Complete Guide, Structure & Tips for Indian Matrimony',
    description:
      'A comprehensive guide to writing an authentic Indian marriage biodata. Understand the 5 essential sections, horoscope etiquette, family background, and free PDF maker.',
    canonicalPath: '/marriage-biodata',
    ogType: 'article',
    breadcrumbs: [{ name: 'Marriage Biodata Guide', path: '/marriage-biodata' }],
    faqs: FAQ_ITEMS,
    article: {
      title: 'Complete Guide to Indian Marriage Biodata: Etiquette, Sections & Formats',
      description: 'Step-by-step masterclass on creating an auspicious and elegant Indian marriage biodata.',
      url: 'https://biodata-craft.vercel.app/marriage-biodata',

      datePublished: '2026-10-01T10:00:00Z',
      dateModified: '2026-10-05T08:00:00Z',
      authorName: 'Cultural Matrimonial Desk, BiodataCraft'
    }
  });

  const handleStartBuilder = (templateId?: string) => {
    storageService.saveLocalDraft(sampleHinduBiodata);
    if (templateId) {
      storageService.setSelectedTemplate(templateId);
    }
    analyticsService.trackEvent('seo_guide_start_builder', { guide: 'marriage_biodata', templateId });
    navigate('/create');
  };

  const featuredTemplates = TEMPLATES.slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ name: 'Marriage Biodata Guide' }]} />

        {/* Hero Banner */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Matrimonial Masterclass</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight leading-tight">
            The Definitive Guide to Indian Marriage Biodata
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            In Indian matrimony, a biodata is far more than a resume—it is an auspicious family introduction blending personal dignity, educational merit, ancestral heritage, and astrological alignment.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleStartBuilder()}
              leftIcon={<ScrollText className="w-5 h-5" />}
            >
              Create Marriage Biodata Now
            </Button>
            <Link to="/templates">
              <Button variant="outline" size="lg">
                Explore All Templates
              </Button>
            </Link>
          </div>
        </header>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white">
            <CardContent className="p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Complete Privacy Guarantee</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero personal data or photos are ever saved to cloud databases. Every document is assembled securely in your browser.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white">
            <CardContent className="p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Two Families, One Union</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Carefully crafted sections to honor both paternal lineage and maternal roots (Mama Ji / Mosal) with utmost cultural decorum.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white">
            <CardContent className="p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Crisp Vector A4 PDF</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Download high-resolution, print-ready PDFs optimized for sharp display on WhatsApp, mobile screens, and color printers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Guide Content */}
        <article className="prose prose-stone max-w-none space-y-8 bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              1. What is an Indian Marriage Biodata?
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              An <strong>Indian marriage biodata</strong> (often referred to as a matrimonial CV, Shaadi profile, or Lagna Patrika) is a structured summary utilized by families to introduce prospective brides and grooms. Unlike western matrimonial apps where decisions are made primarily on brief personal bios and casual photos, Indian matrimony involves an extended family network seeking alignment across cultural values, spiritual outlook, socio-economic stature, and horoscope coordinates.
            </p>
            <p className="text-sm text-stone-700 leading-relaxed">
              A well-constructed biodata presents all necessary facts transparently and respectfully, avoiding both boastful exaggeration and modest omissions.
            </p>
          </section>

          {/* Comparative Table: Resume vs Biodata */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              2. Marriage Biodata vs. Job Resume: Key Differences
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700 border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-amber-50 text-amber-950 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3 border-b border-stone-200">Attribute</th>
                    <th className="p-3 border-b border-stone-200">Professional Job Resume</th>
                    <th className="p-3 border-b border-stone-200">Indian Marriage Biodata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Primary Objective</td>
                    <td className="p-3">Showcase corporate competencies & employment history</td>
                    <td className="p-3">Introduce personal values, family background & astrological fit</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Audience</td>
                    <td className="p-3">HR managers & department heads</td>
                    <td className="p-3">Prospective bride/groom, parents & family elders</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Astrology & Heritage</td>
                    <td className="p-3">Never included</td>
                    <td className="p-3">Gotra, Nakshatra, Rashi, Manglik status, Kuldevi</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Family Details</td>
                    <td className="p-3">Irrelevant / omitted</td>
                    <td className="p-3">Equal prominence: parents, siblings & maternal uncle roots</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-stone-900">Tone & Decor</td>
                    <td className="p-3">Neutral corporate, monochrome</td>
                    <td className="p-3">Auspicious invocations (ॐ, श्री गणेशाय नमः), regal borders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* The 5 Pillar Architecture */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              3. The 5 Core Sections Every Biodata Must Contain
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">1</span>
                  <span>Auspicious Invocation & Identity</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Start with sacred shlokas (e.g., <em>॥ श्री गणेशाय नमः ॥</em> or <em>Om</em>). State the candidate’s full name, date of birth, place of birth, exact birth time, height, and blood group.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">2</span>
                  <span>Astrological & Horoscope Coordinates</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Include Gotra (Self & Mother’s gotra), Rashi (Moon sign), Nakshatra, Gan, Nadi, and explicit Manglik status (Non-Manglik, Anshik Manglik, or Manglik).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">3</span>
                  <span>Education & Professional Footprint</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  List highest academic degrees, universities attended, current organization, official designation, work city, and optionally an annual remuneration bracket.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">4</span>
                  <span>Family Pedigree & Ancestral Roots</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Parents’ names and occupations, ancestral native place (Paitrik Nivas), sibling counts (with marital status), and Maternal Uncle (Mama Ji) details.
                </p>
              </div>
            </div>
          </section>

          {/* Curated Templates Showcase */}
          <section className="space-y-4 pt-4 border-t border-stone-200">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              4. Recommended Biodata Templates
            </h2>
            <p className="text-xs text-stone-600">
              Select one of our popular handcrafted templates to begin editing immediately:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose">
              {featuredTemplates.map((t) => (
                <div
                  key={t.id}
                  className="group border border-stone-200 rounded-2xl p-4 bg-stone-50 hover:bg-white hover:border-amber-400 transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900 font-cinzel">{t.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-2">{t.description}</p>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => handleStartBuilder(t.id)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* FAQ Accordion Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Questions & Clarifications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
              Frequently Asked Questions
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

        {/* Bottom Call to Action Card */}
        <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <span className="font-rozha text-3xl text-amber-400">ॐ</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-cinzel">
            Ready to Create an Auspicious Marriage Biodata?
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            No registration, no credit card, and zero cloud storage. Your family information stays safe within your device while generating a PDF.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleStartBuilder()}
              leftIcon={<Download className="w-5 h-5" />}
            >
              Start Biodata Creation
            </Button>
            <Link to="/marriage-biodata-format">
              <Button
                variant="outline"
                size="lg"
                className="border-stone-700 text-stone-200 hover:bg-stone-800"
              >
                View Format Specifications
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
