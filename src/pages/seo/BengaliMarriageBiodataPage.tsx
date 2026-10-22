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
  Feather,
  Music,
  GraduationCap
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How is a Bengali Marriage Biodata (পাত্র-পাত্রীর বায়োডাটা) typically structured?',
    answer:
      'A Bengali marriage biodata traditionally begins with a revered invocation such as "॥ শ্রী শ্রী প্রজাপতয়ে নমঃ ॥" (Lord Prajapati, deity of matrimonial unions) or "॥ শ্রী শ্রী রাধাকৃষ্ণ জীউ ॥". It balances profound respect for academic excellence, Gothro (গোত্র), and ancestral roots (West Bengal / Ghoti or East Bengal / Bangal origin) with cultural interests such as literature, music, and art.'
  },
  {
    question: 'Why are ancestral origins (Desher Baari / Adi Nivas) important in Bengali matrimony?',
    answer:
      'Bengali families traditionally identify with their ancestral heritage—whether Ghoti (hailing from West Bengal districts like Hooghly, Burdwan, Nadia, or Midnapore) or Bangal (ancestral roots in pre-partition Bengal like Dhaka, Barisal, Mymensingh, or Faridpur). Mentioning "Adi Nivas" provides a rich cultural anchor for family elders.'
  },
  {
    question: 'What astrological details are included for Rajjotoko (যোটক বিচার)?',
    answer:
      'For families consulting a traditional Koshthi (horoscope), the biodata includes Date of Birth, Exact Birth Time, Birth Place, Rashi (রাশি), Nakshatra (নক্ষত্র), and Gono (গণ - দেব/নর/রাক্ষস) to facilitate Rajjotoko matching.'
  },
  {
    question: 'Are cultural hobbies (Rabindra Sangeet, Literature) customary in a Bengali biodata?',
    answer:
      'Yes. Unlike many other regions where extracurriculars are ignored, Bengali matrimonial culture holds intellectual, musical, and artistic pursuits in high regard alongside professional credentials.'
  }
];

export const BengaliMarriageBiodataPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useSEO({
    title: 'Bengali Marriage Biodata: পাত্র-পাত্রীর বায়োডাটা Format & Guide | BiodataCraft',
    description:
      'Create an authentic Bengali marriage biodata (পাত্র-পাত্রীর বায়োডাটা) with Gothro (গোত্র), ancestral roots (Desher Baari), Koshthi horoscope, and elegant cultural styling. 100% Free PDF.',
    canonicalPath: '/bengali-marriage-biodata',
    ogType: 'article',
    breadcrumbs: [{ name: 'Bengali Marriage Biodata', path: '/bengali-marriage-biodata' }],
    faqs: FAQ_ITEMS,
    article: {
      title: 'Bengali Marriage Biodata Guide: Gothro, Desher Baari & Matrimonial Traditions',
      description: 'Step-by-step guidance on creating a distinguished Bengali matrimonial profile with cultural grace.',
      url: 'https://biodatacraft.in/bengali-marriage-biodata',
      datePublished: '2026-10-02T10:00:00Z',
      dateModified: '2026-10-05T08:00:00Z',
      authorName: 'Bengal Cultural Desk, BiodataCraft'
    }
  });

  const handleStartBuilder = (templateId = 'vedic-crimson') => {
    storageService.saveLocalDraft(sampleHinduBiodata);
    storageService.setSelectedTemplate(templateId);
    analyticsService.trackEvent('seo_guide_start_builder', { guide: 'bengali_marriage_biodata', templateId });
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs items={[{ name: 'Bengali Marriage Biodata' }]} />

        {/* Hero Section */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-950 text-xs font-bold shadow-2xs">
            <Feather className="w-3.5 h-3.5 text-rose-700" />
            <span>॥ শ্রী শ্রী প্রজাপতয়ে নমঃ ॥ • পাত্র-পাত্রীর বায়োডাটা</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight leading-tight">
            Bengali Marriage Biodata Format
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Design an intellectually distinguished, culturally refined Bengali matrimonial biodata honoring Gothro (গোত্র), ancestral origins (আদি নিবাস), and horoscope coordinates.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-rose-900 hover:bg-rose-950 text-white"
              onClick={() => handleStartBuilder('vedic-crimson')}
              leftIcon={<ScrollText className="w-5 h-5" />}
            >
              বায়োডাটা তৈরি করুন (Create Biodata)
            </Button>
            <Link to="/templates">
              <Button variant="outline" size="lg">
                View Bengali Templates
              </Button>
            </Link>
          </div>
        </header>

        {/* 3 Pillars of Bengali Matrimony */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-rose-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">গোত্র ও আদি নিবাস</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Precise designation of Gothro (e.g. Sandilya, Alambyan, Kashyap) and ancestral homeland (Ghoti / Bangal district) roots.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">উচ্চশিক্ষা ও কর্মজীবন</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Prominence for advanced degrees (Masters, Doctorate, Engineering, Medicine) and reputable professions reflecting Bengali intellectual values.
              </p>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">সাংস্কৃতিক রুচি ও কৃষ্টি</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Special mention of cultural affinity: classical music, Rabindra Sangeet, literature, and fine arts cherished across families.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Field Guide Article */}
        <article className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              Bengali Matrimonial Terminology & Layout
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              When creating a Bengali biodata for arranged matchmaking, the following terms help ensure your document resonates with cultural elders:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-rose-50 text-rose-950 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 border-b border-stone-200">Bengali Term (বাংলা)</th>
                  <th className="p-3 border-b border-stone-200">English Field</th>
                  <th className="p-3 border-b border-stone-200">Example / Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-3 font-semibold text-stone-900">শুভ প্রারম্ভ (Opening)</td>
                  <td className="p-3">Auspicious Invocations</td>
                  <td className="p-3">॥ শ্রী শ্রী প্রজাপতয়ে নমঃ ॥ / ॥ শ্রী শ্রী রাধাকৃষ্ণ জীউ ॥</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">নাম (Name)</td>
                  <td className="p-3">Candidate Full Name</td>
                  <td className="p-3">অনির্বাণ মুখোপাধ্যায় (Anirban Mukherjee)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">জন্ম তারিখ ও সময়</td>
                  <td className="p-3">Birth Date & Time</td>
                  <td className="p-3">১৮ নভেম্বর ১৯৯৫, দুপুর ০১:১৫ মিনিট (কলকাতা)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">গোত্র (Gothro)</td>
                  <td className="p-3">Ancestral Lineage</td>
                  <td className="p-3">শাণ্ডিল্য (Sandilya) / কাশ্যপ (Kashyap) / ভরদ্বাজ</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">আদি নিবাস (Desher Baari)</td>
                  <td className="p-3">Ancestral Roots</td>
                  <td className="p-3">বর্ধমান (West Bengal) / বিক্রমপুর (Dhaka)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">রাশি ও গণ (Horoscope)</td>
                  <td className="p-3">Zodiac & Astrological Gan</td>
                  <td className="p-3">কন্যা রাশি, হস্তা নক্ষত্র, দেব গণ</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">মামার বাড়ি (Mamabari)</td>
                  <td className="p-3">Maternal Uncle Lineage</td>
                  <td className="p-3">শ্রী সুব্রত বন্দ্যোপাধ্যায় (হুগলী)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-rose-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>সাধারণ প্রশ্নোত্তর (FAQs)</span>
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
                        isOpen ? 'rotate-180 text-rose-800' : ''
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
        <div className="rounded-3xl bg-gradient-to-r from-stone-950 via-rose-950 to-stone-950 text-white p-8 text-center space-y-4 shadow-xl">
          <span className="font-rozha text-3xl text-rose-400">ॐ</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel">
            আভিজাত্যপূর্ণ বাংলা বায়োডাটা তৈরি করুন
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            Design your Bengali matrimonial biodata with traditional terracotta and ivory styling. 100% Free with zero registration.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={() => handleStartBuilder('vedic-crimson')}
            leftIcon={<Download className="w-5 h-5" />}
          >
            এখনই তৈরি করুন (Create Free PDF)
          </Button>
        </div>
      </div>
    </div>
  );
};
