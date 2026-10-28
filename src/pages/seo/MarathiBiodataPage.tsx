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
  Award,
  Sun
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What is "Devak" (देवक) in a Marathi marriage biodata?',
    answer:
      'In Maharashtrian culture (especially among Maratha, CKP, Saraswat, and Brahmin families), "Devak" represents the family’s sacred ancestral emblem or totem—often associated with a specific tree (such as Mango, Banyan, or Umbar leaves), flower, or metal. Tradition requires that the bride and groom do not share the exact same Devak to prevent clan consanguinity.'
  },
  {
    question: 'Why are Mama (मामा) and Aajol (आजोळ) details so critical in Maharashtra?',
    answer:
      'In Maharashtrian marriages, the maternal uncle (मामा) holds an honored place in all wedding rituals, including Kanyadaan and welcoming ceremonies. The biodata always lists the Mama’s full name, village (आजोळ), and profession.'
  },
  {
    question: 'Which astrological parameters are required for Guna Milan in Marathi biodatas?',
    answer:
      'Standard Maharashtrian biodatas feature: Rashi (राशी), Nakshatra (नक्षत्र), Charan (चरण), Gan (गण - देव/मनुष्य/राक्षस), Nadi (नाडी - आद्य/मध्य/अंत्य), and Mangal (मांगलिक/सौम्य मंगळ).'
  },
  {
    question: 'Can I write my Marathi biodata in Marathi (Devanagari) script on BiodataCraft?',
    answer:
      'Yes, absolutely. BiodataCraft fully supports Unicode Marathi and Devanagari script for both field names and values (e.g. जन्म वेळ, उंची, शिक्षण, रक्तगट).'
  }
];

export const MarathiBiodataPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useSEO({
    title: 'Marathi Biodata: लग्न बायोडाटा Format, Devak & Templates | BiodataCraft',
    description:
      'मराठी लग्न बायोडाटा (Marathi Lagna Biodata) format: Devak, Kuldaivat, Gan, Nadi, Mama details, and Paithani-inspired templates with free PDF maker.',
    canonicalPath: '/marathi-biodata',
    ogType: 'article',
    breadcrumbs: [{ name: 'Marathi Lagna Biodata', path: '/marathi-biodata' }],
    faqs: FAQ_ITEMS,
    article: {
      title: 'Marathi Lagna Biodata Guide: Devak, Kuldaivat, Patrika & Traditions',
      description: 'Comprehensive guide to writing an authentic Marathi marriage biodata in Marathi and English.',
      url: 'https://biodata-craft.vercel.app/marathi-biodata',

      datePublished: '2026-10-02T10:00:00Z',
      dateModified: '2026-10-05T08:00:00Z',
      authorName: 'Maharashtra Cultural Desk, BiodataCraft'
    }
  });

  const handleStartBuilder = (templateId = 'marigold-bliss') => {
    storageService.saveLocalDraft(sampleHinduBiodata);
    storageService.setSelectedTemplate(templateId);
    analyticsService.trackEvent('seo_guide_start_builder', { guide: 'marathi_biodata', templateId });
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <Breadcrumbs items={[{ name: 'Marathi Lagna Biodata' }]} />

        {/* Hero Banner */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-300 text-orange-950 text-xs font-bold shadow-2xs">
            <Sun className="w-3.5 h-3.5 text-orange-600" />
            <span>॥ श्री गणेशाय नमः ॥ • ॥ कुलदैवत प्रसन्न ॥</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight leading-tight">
            मराठी लग्न बायोडाटा (Marathi Biodata Format)
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Create a culturally authentic Marathi marriage biodata complete with Devak (देवक), Kuldaivat (कुलदैवत), Gan, Nadi, and Mama details.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => handleStartBuilder('marigold-bliss')}
              leftIcon={<ScrollText className="w-5 h-5" />}
            >
              बायोडाटा तयार करा (Create Biodata)
            </Button>
            <Link to="/templates">
              <Button variant="outline" size="lg">
                View Marathi Templates
              </Button>
            </Link>
          </div>
        </header>

        {/* Distinctive Marathi Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-orange-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">देवक व कुलदैवत</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Essential inclusion of family Devak (देवक) and guardian Kuldaivat (e.g. Khandoba, Tuljabhavani, Jyotiba) for traditional matching.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">पत्रिका व गुण मिलन</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Detailed astrological entries for राशी, नक्षत्र, गण (देव/मनुष्य/राक्षस), नाडी (आद्य/मध्य/अंत्य), and मंगळ स्थिती.
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">मामा व आजोळ</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dedicated honorific fields for Mama’s name, profession, and maternal ancestral village (आजोळ).
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Marathi Field Reference Table */}
        <article className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900 font-cinzel">
              Marathi Lagna Biodata Terms & Field Reference
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              When preparing a Maharashtrian matrimonial biodata in Marathi or English, use these standardized terms:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-orange-50 text-orange-950 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 border-b border-stone-200">Marathi Term (मराठी)</th>
                  <th className="p-3 border-b border-stone-200">English Equivalent</th>
                  <th className="p-3 border-b border-stone-200">Example / Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-3 font-semibold text-stone-900">नाव</td>
                  <td className="p-3">Full Name</td>
                  <td className="p-3">अमित विजयराव कदम (Amit Vijayrao Kadam)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">जन्म तारीख व वेळ</td>
                  <td className="p-3">Birth Date & Time</td>
                  <td className="p-3">१२ जुलै १९९६, सकाळी ०८:२० वाजता, पुणे</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">देवक (Devak)</td>
                  <td className="p-3">Family Clan Totem</td>
                  <td className="p-3">पंचपल्लव / सूर्यफूल / आंब्याची पानं</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">कुलदैवत (Kuldaivat)</td>
                  <td className="p-3">Family Deity</td>
                  <td className="p-3">श्री खंडोबा (जेजुरी) / आई तुळजाभवानी</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">गण / नाडी</td>
                  <td className="p-3">Astrological Gan & Nadi</td>
                  <td className="p-3">मनुष्य गण / मध्य नाडी</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">मामा (Mama / आजोळ)</td>
                  <td className="p-3">Maternal Uncle & Roots</td>
                  <td className="p-3">श्री. रमेशराव मोहिते (गाव: वाई, जि. सातारा)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-stone-900">मूळ गाव</td>
                  <td className="p-3">Native Village</td>
                  <td className="p-3">कऱ्हाड, जिल्हा सातारा</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-orange-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>प्रश्नोत्तरे (FAQs)</span>
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
                        isOpen ? 'rotate-180 text-orange-800' : ''
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
        <div className="rounded-3xl bg-gradient-to-r from-orange-950 via-amber-950 to-orange-950 text-white p-8 text-center space-y-4 shadow-xl">
          <span className="font-rozha text-3xl text-orange-400">ॐ</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel">
            सुंदर मराठी लग्न बायोडाटा तयार करा
          </h2>
          <p className="text-xs sm:text-sm text-amber-200 max-w-lg mx-auto">
            Design your Marathi matrimonial biodata with traditional saffron borders, Devak, and Guna Milan details. Instant free PDF download.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => handleStartBuilder('marigold-bliss')}
            leftIcon={<Download className="w-5 h-5" />}
          >
            आता बायोडाटा बनवा (Create Now)
          </Button>
        </div>
      </div>
    </div>
  );
};
