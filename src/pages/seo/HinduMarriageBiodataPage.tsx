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
  Flame,
  Star,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Why is Gotra matchmaking crucial in Hindu marriages?',
    answer:
      'According to Vedic Shastras, individuals sharing the same paternal Gotra descend from the same ancient Rishi and are considered brother and sister in lineage (Sagotra). Hence, marriage within the same paternal Gotra is traditionally forbidden. Many North and West Indian communities also avoid the mother\'s maiden gotra (Mosal) and grandmother\'s gotra.'
  },
  {
    question: 'What is Manglik Dosha and how should it be listed?',
    answer:
      'Manglik Dosha occurs when Mars (Mangal) is positioned in the 1st, 2nd, 4th, 7th, 8th, or 12th house of the Lagna chart. It should be honestly represented as: Non-Manglik, Anshik (Partial) Manglik, or Manglik. Astrological remedies and matching with another Manglik partner ensure harmony.'
  },
  {
    question: 'Which sacred shlokas can be placed at the top of a Hindu biodata?',
    answer:
      'The most widely used sacred headings are: "॥ श्री गणेशाय नमः ॥" (reverence to Lord Ganesha, remover of obstacles), "॥ श्री राधे कृष्णा ॥" (divine marital love), "॥ ॐ श्री कुलदेवतायै नमः ॥" (Kuldevi/Kuldevta blessings), or the universal sacred syllable "ॐ".'
  },
  {
    question: 'What are Kuldevi and Kuldevta details?',
    answer:
      'Kuldevi and Kuldevta refer to the ancestral guardian deities worshipped by a clan for generations. Mentioning your family deity helps identify shared religious customs and ancestral origins during marriage alliances.'
  }
];

export const HinduMarriageBiodataPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useSEO({
    title: 'Hindu Marriage Biodata Format: Gotra, Kundali & Vedic Templates | BiodataCraft',
    description:
      'Design authentic Hindu marriage biodatas with Shree Ganesh Shlokas, Gotra (Self & Mosal), Kundali horoscope details, and sacred Vedic styling. 100% Free PDF.',
    canonicalPath: '/hindu-marriage-biodata',
    ogType: 'article',
    breadcrumbs: [{ name: 'Hindu Marriage Biodata', path: '/hindu-marriage-biodata' }],
    faqs: FAQ_ITEMS,
    article: {
      title: 'Guide to Hindu Matrimonial Biodata: Sacred Traditions, Gotra & Horoscope',
      description: 'Understanding the sacred elements of Hindu marriage biodatas including Kundali, Gotra, and Vedic blessings.',
      url: 'https://biodata-craft.vercel.app/hindu-marriage-biodata',
      datePublished: '2026-10-02T10:00:00Z',
      dateModified: '2026-10-05T08:00:00Z',
      authorName: 'Vedic Traditions Desk, BiodataCraft'
    }
  });

  const handleStartBuilder = (templateId = 'vedic-crimson') => {
    storageService.saveLocalDraft(sampleHinduBiodata);
    storageService.setSelectedTemplate(templateId);
    analyticsService.trackEvent('seo_guide_start_builder', { guide: 'hindu_marriage_biodata', templateId });
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs items={[{ name: 'Hindu Marriage Biodata' }]} />

        {/* Hero Banner */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs">
            <span className="font-rozha text-sm">ॐ</span>
            <span>Vedic & Sanatan Traditions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight leading-tight">
            Hindu Marriage Biodata Format
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Craft a sacred, distinguished matrimonial profile enriched with traditional shlokas, Gotra lineages, Kundali horoscope parameters, and auspicious Vedic aesthetics.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleStartBuilder('vedic-crimson')}
              leftIcon={<ScrollText className="w-5 h-5" />}
            >
              Create Hindu Biodata
            </Button>
            <Link to="/templates">
              <Button variant="outline" size="lg">
                View Vedic Templates
              </Button>
            </Link>
          </div>
        </header>

        {/* Cultural Elements Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-amber-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <span className="font-rozha text-lg">ॐ</span>
              </div>
              <h3 className="font-bold text-stone-900 text-base">Auspicious Mantras</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Adorn your biodata header with Shree Ganesh, Radha Krishna, or Shiv-Parvati invocations to invoke divine blessings.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Kundali & Guna Milan</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Accurate fields for Rashi, Nakshatra, Charan, Gan, Nadi, and Mangal Dosha for seamless matchmaking and horoscope verification.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Gotra & Mosal Heritage</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Respect ancestral Rishi lineage rules by recording both Self Gotra and Maternal Uncle (Mama Ji / Mosal) roots.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Deep Dive Guide */}
        <article className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              Traditional Elements in a Hindu Marriage Biodata
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              Hindu matrimony is considered a sacred sacrament (<em>Sanskara</em>) binding two extended families for generations. A typical Hindu biodata honors this spiritual dimension through specific conventions:
            </p>
            <ul className="text-xs sm:text-sm text-stone-700 space-y-3 list-disc list-inside leading-relaxed pl-2">
              <li>
                <strong>Mangalcharan (Opening Shloka):</strong> A revered invocation such as <em>॥ श्री गणेशाय नमः ॥</em> (Salutations to Ganesha, the remover of obstacles) or <em>॥ श्री राधे कृष्णा ॥</em> sets an auspicious tone.
              </li>
              <li>
                <strong>Horoscope Specifics (Kundali Vivaran):</strong> Vital for matching Gunank (Ashtakoot Guna Milan). Required fields include Date of Birth, Exact Birth Time (with AM/PM), Birth City, Rashi (Moon Sign), Nakshatra, Charan, Gan, and Manglik status.
              </li>
              <li>
                <strong>Gotra & Lineage:</strong> Specifying paternal Gotra (Rishi lineage) and maternal gotra ensures families immediately recognize matrimonial eligibility according to Sanatan Shastras.
              </li>
              <li>
                <strong>Kuldevi / Kuldevta:</strong> Many orthodox families venerate particular lineage deities (such as Maa Ambika, Lord Balaji, or Kalka Maa); noting this demonstrates deep familial respect.
              </li>
              <li>
                <strong>Ancestral Roots (Paitrik Nivas):</strong> Denoting the original village and district helps families find shared community elders and common acquaintances.
              </li>
            </ul>
          </section>

          {/* Sample Format Preview Box */}
          <section className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
            <h3 className="text-lg font-bold text-amber-950 font-cinzel flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-amber-700" />
              <span>Recommended Hindu Biodata Structure</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-800">
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-amber-900">॥ श्री गणेशाय नमः ॥</span>
                <p><strong>Name:</strong> Rajesh Sharma</p>
                <p><strong>DOB:</strong> 22 Oct 1996, 06:15 AM (Jaipur, RJ)</p>
                <p><strong>Height:</strong> 5 ft 10 in | Complexion: Wheatish Fair</p>
                <p><strong>Gotra:</strong> Vashishtha | Mosal Gotra: Bharadwaj</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-amber-900">Horoscope & Family Coordinates</span>
                <p><strong>Rashi:</strong> Kumbha (Aquarius) | Nakshatra: Shatabhisha</p>
                <p><strong>Manglik:</strong> Non-Manglik | Gan: Manushya</p>
                <p><strong>Father:</strong> Executive Engineer (PWD)</p>
                <p><strong>Mama Ji:</strong> Shri Suresh Sharma, Advocate (Alwar)</p>
              </div>
            </div>
          </section>
        </article>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Hindu Matrimony Queries</span>
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
        <div className="rounded-3xl bg-gradient-to-r from-red-950 via-amber-950 to-red-950 text-white p-8 text-center space-y-4 shadow-lg">
          <span className="font-rozha text-3xl text-amber-400">ॐ</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel">
            Create an Auspicious Hindu Marriage Biodata
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-lg mx-auto">
            Design your sacred biodata in English or Hindi with Vedic crimson, royal gold, and marigold borders. Free instant PDF.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleStartBuilder('vedic-crimson')}
            leftIcon={<Download className="w-5 h-5" />}
          >
            Start with Vedic Crimson Template
          </Button>
        </div>
      </div>
    </div>
  );
};
