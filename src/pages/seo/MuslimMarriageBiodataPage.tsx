import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../../hooks/useSEO';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TEMPLATES } from '../../data/initialBiodata';
import { storageService } from '../../services/storageService';
import { analyticsService } from '../../services/analyticsService';
import {
  Sparkles,
  HelpCircle,
  ChevronDown,
  Download,
  ScrollText,
  ShieldCheck,
  Heart,
  Moon,
  Users
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How is a Muslim Marriage Biodata (Nikah Biodata) structured?',
    answer:
      'A Muslim marriage biodata begins with "Bismillah Ar-Rahman Ar-Rahim" (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ). It places primary emphasis on religious observance (Deen, Namaz, Fasting, Quran recitation, and Halal conduct) alongside modern academic credentials, professional standing, and respectable family background.'
  },
  {
    question: 'How are contact details handled for bride biodatas in Islam?',
    answer:
      'In accordance with Islamic etiquette (Haya & modesty), contact information for prospective brides is typically channeled through a Wali (guardian) or Mehram—such as the father, elder brother, or maternal uncle—rather than displaying the bride\'s direct personal phone number.'
  },
  {
    question: 'Should Maslak or Sect be mentioned in a Nikah biodata?',
    answer:
      'Yes, clearly specifying Maslak / School of thought (e.g., Sunni Hanafi, Shafi\'i, Ahl-e-Hadith, Shia, etc.) helps families ensure compatibility in religious practices, jurisprudence, and family customs right from the beginning.'
  },
  {
    question: 'Can Islamic biodatas be formatted without astrological fields?',
    answer:
      'Yes. In Islamic matrimony, Hindu astrological parameters such as Gotra, Kundali, Rashi, and Manglik status are omitted and replaced by religious practice parameters, ancestral native district, and educational credentials.'
  }
];

export const MuslimMarriageBiodataPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useSEO({
    title: 'Muslim Marriage Biodata: Nikah Biodata Format & Islamic Guidelines | BiodataCraft',
    description:
      'Create dignified Muslim Nikah biodatas with Bismillah Ar-Rahman Ar-Rahim, Maslak, Deen observance, and Mehram contact details. 100% Free, privacy-first PDF download.',
    canonicalPath: '/muslim-marriage-biodata',
    ogType: 'article',
    breadcrumbs: [{ name: 'Muslim Marriage Biodata', path: '/muslim-marriage-biodata' }],
    faqs: FAQ_ITEMS,
    article: {
      title: 'Guide to Muslim Marriage Biodata: Nikah Format, Deen & Family Lineage',
      description: 'Step-by-step guide to writing a respectful and graceful Islamic matrimonial profile.',
      url: 'https://biodata-craft.vercel.app/muslim-marriage-biodata',
      datePublished: '2026-10-02T10:00:00Z',
      dateModified: '2026-10-05T08:00:00Z',
      authorName: 'Islamic Matrimonial Desk, BiodataCraft'
    }
  });

  const handleStartBuilder = (templateId = 'emerald-islamic') => {
    storageService.setSelectedTemplate(templateId);
    analyticsService.trackEvent('seo_guide_start_builder', { guide: 'muslim_marriage_biodata', templateId });
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs items={[{ name: 'Muslim Marriage Biodata' }]} />

        {/* Hero Section */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold shadow-2xs">
            <Moon className="w-3.5 h-3.5 text-emerald-700" />
            <span>Islamic Matrimonial Traditions</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight leading-tight">
            Muslim Marriage Biodata Format
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Create an elegant, dignified Nikah biodata with Bismillah invocation, Islamic lifestyle values, academic credentials, and family pedigree.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-emerald-800 hover:bg-emerald-900 text-white"
              onClick={() => handleStartBuilder('emerald-islamic')}
              leftIcon={<ScrollText className="w-5 h-5" />}
            >
              Create Nikah Biodata
            </Button>
            <Link to="/templates">
              <Button variant="outline" size="lg">
                Browse Islamic Templates
              </Button>
            </Link>
          </div>
        </header>

        {/* Core Islamic Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Deen & Practice</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Clear representation of 5 daily prayers (Namaz), Ramadan fasting, Quran recitation, and Islamic ethical values.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Wali & Mehram Etiquette</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Respectful contact mechanisms directing inquiries to the guardian (Wali/Father) protecting family privacy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Family Heritage</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Honorable presentation of parents, maternal lineage (Nanihal), ancestral native town, and siblings.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Guide Content */}
        <article className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              Key Sections of a Dignified Muslim Nikah Biodata
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              In Islam, marriage (<em>Nikah</em>) is a sacred contract uniting two souls in companionship, mutual love, and piety according to the Sunnah. A Muslim matrimonial profile emphasizes both faith and practicality:
            </p>
            <div className="space-y-4 pt-2 text-xs sm:text-sm text-stone-700">
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-2">
                <h4 className="font-bold text-emerald-950 text-base">
                  1. Islamic Heading & Greeting
                </h4>
                <p className="leading-relaxed">
                  The header should feature <em>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</em> (In the name of Allah, Most Gracious, Most Merciful) accompanied by <em>Assalamu Alaikum wa Rahmatullahi wa Barakatuh</em>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-base">
                  2. Religious Orientation (Deen & Maslak)
                </h4>
                <p className="leading-relaxed">
                  Mention Maslak / Jurisprudence (e.g. Sunni Hanafi), adherence to daily Salah, fasting, observance of Hijab (for sisters) or beard (for brothers), and family religious environment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-base">
                  3. Educational & Career Qualifications
                </h4>
                <p className="leading-relaxed">
                  Academic degrees (e.g. B.Tech, MBBS, MBA, CA), employment details, location of employment, and Islamic education (e.g., Alim/Alimah or Quran Hifz if completed).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-base">
                  4. Family Background & Wali Contact
                </h4>
                <p className="leading-relaxed">
                  Father’s profession, mother’s background, brother and sister details, ancestral roots (e.g., Lucknow, Hyderabad, Bhopal, Kerala), and the contact number of the prospective partner\'s guardian.
                </p>
              </div>
            </div>
          </section>
        </article>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Clarifications</span>
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
                        isOpen ? 'rotate-180 text-emerald-800' : ''
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
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-8 text-center space-y-4 shadow-lg">
          <Moon className="w-8 h-8 text-emerald-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel">
            Create an Elegant Nikah Biodata
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            Design an Islamic matrimonial profile with emerald motifs and respectful typography. Free high-res PDF with zero server storage.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => handleStartBuilder('emerald-islamic')}
            leftIcon={<Download className="w-5 h-5" />}
          >
            Start with Emerald Islamic Template
          </Button>
        </div>
      </div>
    </div>
  );
};
