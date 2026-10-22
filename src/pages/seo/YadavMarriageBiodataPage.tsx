import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { sampleHinduBiodata } from '../../data/initialBiodata';
import { storageService } from '../../services/storageService';
import { analyticsService } from '../../services/analyticsService';
import {
  Sparkles,
  HelpCircle,
  ChevronDown,
  Download,
  ScrollText,
  ShieldCheck,
  Crown,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What is the 4-Gotra rule in Yadav (Ahir) matrimonial alliances?',
    answer:
      'Traditionally across Haryana, Uttar Pradesh, Rajasthan, Bihar, Delhi NCR, and Madhya Pradesh, Yadav families observe the four-gotra avoidance rule to ensure no consanguineous relationship: 1) Self / Father\'s Gotra (Pita ka Gotra), 2) Mother\'s Maiden Gotra (Mata / Nana ji ka Gotra), 3) Paternal Grandmother\'s Gotra (Dadi ka Gotra), and 4) Maternal Grandmother\'s Gotra (Nani ka Gotra). In contemporary practice, many families strictly check 3 gotras (excluding Nani gotra).'
  },
  {
    question: 'Why is Native Village (Paitrik Gaon) so prominent in Yadav biodatas?',
    answer:
      'Yadav families maintain profound connections to their ancestral roots. Mentioning the Paitrik Gaon (native village), Tehsil, and District allows community elders to establish ancestral credibility, identify shared village ties (Bhaichara), and verify family reputation.'
  },
  {
    question: 'Which sacred header is traditional for Yadav marriage biodatas?',
    answer:
      'As descendants of the Chandravanshi Kshatriya lineage revered in the tradition of Lord Krishna, Yadav biodatas customarily begin with "॥ जय श्री कृष्णा ॥", "॥ ॐ श्री कृष्णाय नमः ॥", or "॥ श्री गणेशाय नमः ॥".'
  },
  {
    question: 'How should family landholding or agricultural background be stated?',
    answer:
      'It is customary to state family agricultural landholding respectfully alongside modern educational and professional achievements: for example, "Agricultural Land: 15 Bighas in Rewari (HR) | Paternal Family: Reputed farming & defense background".'
  }
];

export const YadavMarriageBiodataPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useSEO({
    title: 'Yadav Marriage Biodata Format: Gotra Rules, Template & Guide | BiodataCraft',
    description:
      'Authentic Yadav marriage biodata guide: 4-Gotra rules, native village details (Paitrik Gaon), Jai Shree Krishna headers, and royal templates with free PDF maker.',
    canonicalPath: '/yadav-marriage-biodata',
    ogType: 'article',
    breadcrumbs: [{ name: 'Yadav Marriage Biodata', path: '/yadav-marriage-biodata' }],
    faqs: FAQ_ITEMS,
    article: {
      title: 'Guide to Yadav Marriage Biodata: Gotra Rules, Ancestral Heritage & Formats',
      description: 'Cultural nuances, 4-gotra guidelines, and formatting standards for Yadav community matrimonial biodatas.',
      url: 'https://biodatacraft.in/yadav-marriage-biodata',
      datePublished: '2026-10-02T10:00:00Z',
      dateModified: '2026-10-05T08:00:00Z',
      authorName: 'Community Heritage Desk, BiodataCraft'
    }
  });

  const handleStartBuilder = (templateId = 'royal-heritage') => {
    storageService.saveLocalDraft(sampleHinduBiodata);
    storageService.setSelectedTemplate(templateId);
    analyticsService.trackEvent('seo_guide_start_builder', { guide: 'yadav_marriage_biodata', templateId });
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs items={[{ name: 'Yadav Marriage Biodata' }]} />

        {/* Hero Banner */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-amber-700" />
            <span>Chandravanshi Heritage & Community Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight leading-tight">
            Yadav (Ahir) Marriage Biodata Format
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Create an authentic Yadav matrimonial biodata honoring the 4-Gotra tradition, native ancestral village roots, Lord Krishna invocations, and modern career achievements.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleStartBuilder('royal-heritage')}
              leftIcon={<ScrollText className="w-5 h-5" />}
            >
              Create Yadav Biodata
            </Button>
            <Link to="/templates">
              <Button variant="outline" size="lg">
                View Royal Templates
              </Button>
            </Link>
          </div>
        </header>

        {/* 3 Pillars of Yadav Biodatas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-amber-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">4-Gotra Exogamy</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Clear fields for Father\'s Gotra, Mother\'s Gotra (Mosal), Dadi\'s Gotra, and Nani\'s Gotra to ensure Shastric matrimonial compatibility.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Paitrik Gaon & Bhaichara</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Emphasis on ancestral village, tehsil, and district helping elders verify lineage and family standing across community networks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Service & Professional Prestige</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Balanced highlighting of corporate, administrative, defense services, academic achievements, and family agricultural heritage.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Deep Dive Article */}
        <article className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              Essential Fields in a Yadav Marriage Biodata
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              The Yadav community (Ahir), with its proud martial and agricultural traditions stemming from Lord Krishna’s Chandravanshi lineage, attaches immense reverence to ancestral heritage. When drafting a matrimonial profile:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm text-stone-800">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <h4 className="font-bold text-amber-950">Gotra Architecture</h4>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-stone-700">
                  <li><strong>Self / Pita Gotra:</strong> E.g., Rao, Kosaliya, Nimoria, Khoriya</li>
                  <li><strong>Mata (Mosal) Gotra:</strong> Maternal Uncle\'s gotra</li>
                  <li><strong>Dadi Gotra:</strong> Paternal grandmother\'s lineage</li>
                  <li><strong>Nani Gotra:</strong> Maternal grandmother\'s lineage (optional)</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900">Ancestral Roots</h4>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-stone-700">
                  <li><strong>Paitrik Gaon (Native Village):</strong> Original ancestral village</li>
                  <li><strong>Tehsil & District:</strong> Administrative division</li>
                  <li><strong>Present Residence:</strong> Urban residence or work city</li>
                  <li><strong>Family Land / Prestige:</strong> Background details</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-stone-900 text-stone-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-base">
              <span>॥ जय श्री कृष्णा ॥</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-300">
              "Starting your biodata with '॥ जय श्री कृष्णा ॥' or '॥ श्री गणेशाय नमः ॥' sets an auspicious, cultured tone respected by family elders throughout North, Central, and Western India."
            </p>
          </section>
        </article>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Community Questions</span>
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

        {/* CTA */}
        <div className="rounded-3xl bg-amber-950 text-white p-8 text-center space-y-4 shadow-xl">
          <Crown className="w-8 h-8 text-amber-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel">
            Design Your Yadav Matrimonial Biodata
          </h2>
          <p className="text-xs sm:text-sm text-amber-200 max-w-lg mx-auto">
            Utilize our royal gold and classic navy templates with designated fields for 4 Gotras and Paitrik Gaon. 100% Free instant download.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleStartBuilder('royal-heritage')}
            leftIcon={<Download className="w-5 h-5" />}
          >
            Create with Royal Heritage Template
          </Button>
        </div>
      </div>
    </div>
  );
};
