import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { sampleHinduBiodata, sampleHindiBiodata } from '../data/initialBiodata';
import { INITIAL_TEMPLATES } from '../data/templateData';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { templateService } from '../services/templateService';
import { Template } from '../types/template';
import { TemplateCard } from '../components/templates/TemplateCard';
import { TemplatePreviewModal } from '../components/templates/TemplatePreviewModal';
import { ResponsiveAd } from '../components/ads/ResponsiveAd';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Download,
  Lock,
  Heart,
  ChevronRight,
  ChevronDown,
  Palette,
  CheckCircle,
  FileText,
  Users,
  Compass,
  Award,
  Globe2,
  Printer,
  Moon,
  Sun,
  BookOpen
} from 'lucide-react';

interface HomePageProps {
  language: 'en' | 'hi' | 'bilingual';
}

export const HomePage: React.FC<HomePageProps> = ({ language }) => {
  const navigate = useNavigate();
  const isHindi = language === 'hi';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [templates, setTemplates] = useState<Template[]>(() => INITIAL_TEMPLATES.slice(0, 6));
  const [isLoadingTemplates, setIsLoadingTemplates] = useState<boolean>(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    async function fetchHomeTemplates() {
      try {
        const liveTemplates = await templateService.getTemplates({ forceRefresh: true });
        if (isMounted) {
          setTemplates(liveTemplates);
        }
      } catch (err) {
        console.warn('Notice loading templates for home page:', err);
      } finally {
        if (isMounted) setIsLoadingTemplates(false);
      }
    }
    fetchHomeTemplates();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUseTemplate = (template: Template) => {
    analyticsService.trackTemplateSelected(template.slug, 'home_page_showcase');
    const existing = storageService.loadLocalDraft();
    storageService.saveLocalDraft({
      ...existing,
      templateId: template.slug as any,
      themeColor: template.templateConfig?.primaryColor || existing.themeColor,
      fontFamily: template.templateConfig?.fontFamily || existing.fontFamily
    });
    navigate('/create');
  };

  const faqItems = [
    {
      q: isHindi ? 'क्या BiodataCraft पूरी तरह नि:शुल्क है?' : 'Is BiodataCraft truly 100% free with no hidden charges?',
      a: isHindi
        ? 'हाँ, BiodataCraft पूर्णतः नि:शुल्क है। आप बिना किसी वॉटरमार्क या सदस्यता शुल्क के जितनी बार चाहें उतनी बार अपना बायोडेटा बना और डाउनलोड कर सकते हैं।'
        : 'Yes, BiodataCraft is 100% free forever. There are no hidden fees, premium paywalls, or forced watermarks. You can generate and download as many biodatas as you need.'
    },
    {
      q: isHindi ? 'क्या मुझे खाता बनाने या लॉग इन करने की आवश्यकता है?' : 'Do I need to sign up or create an account?',
      a: isHindi
        ? 'बिल्कुल नहीं! हमारा मुख्य सिद्धांत है कि ग्राहक को कभी लॉगिन या खाता बनाने की आवश्यकता न पड़े। सीधे वेबसाइट खोलें, विवरण भरें और तुरंत PDF डाउनलोड करें।'
        : 'Never! Our core architecture requires zero customer login or registration. You can jump directly into the biodata builder without providing a phone number, OTP, or email.'
    },
    {
      q: isHindi ? 'क्या मेरी फोटो और व्यक्तिगत जानकारी सुरक्षित है?' : 'Is my candidate photograph and personal data secure?',
      a: isHindi
        ? 'हाँ, आपकी फोटो और पारिवारिक विवरण केवल आपके ब्राउज़र में ही प्रोसेस होते हैं। यह कभी किसी बाहरी सर्वर या क्लाउड डाटाबेस में सेव नहीं होते।'
        : 'Yes, absolutely. All processing is 100% client-side inside your browser memory. We maintain zero database records of customer biodatas or photos.'
    },
    {
      q: isHindi ? 'क्या मैं इसे सीधे व्हाट्सएप पर भेज सकता हूँ?' : 'Can I share the biodata directly on WhatsApp?',
      a: isHindi
        ? 'हाँ! आप डाउनलोड विंडो में "व्हाट्सएप इमेज (PNG)" चुनकर सीधे व्हाट्सएप पर साझा करने योग्य उच्च गुणवत्ता वाली तस्वीर डाउनलोड कर सकते हैं।'
        : 'Yes! In the download dialog, choose "Download WhatsApp Image (PNG)". It provides a high-resolution image tailored for effortless sharing on WhatsApp.'
    }
  ];

  useSEO({
    title: 'Free Indian Marriage Biodata Maker Online | BiodataCraft',
    description:
      'Create elegant Hindu, Jain, Muslim & Indian matrimonial biodata PDFs in 5 minutes with Vedic mantras, kundali details, and auspicious templates. 100% free with zero customer data storage.',
    canonicalPath: '/',
    ogType: 'website',
    ogImageAlt: 'BiodataCraft - Free Indian Marriage Biodata Maker Online',
    includeWebApplicationSchema: true,
    includeWebSiteSchema: true,
    includeOrganizationSchema: true,
    faqs: faqItems.map((f) => ({ question: f.q, answer: f.a })),
    howTo: {
      name: isHindi
        ? 'विवाह हेतु बायोडाटा कैसे बनाएं (सरल 3 चरण)'
        : 'How to Create an Indian Marriage Biodata Online in 3 Easy Steps',
      description: isHindi
        ? 'सरल 3 चरणों में अपना प्रामाणिक और सुंदर वैवाहिक बायोडाटा बनाएं और तुरंत A4 PDF डाउनलोड करें।'
        : 'Step-by-step master guide to designing and downloading a publication-grade Indian matrimonial biodata PDF.',
      totalTime: 'PT5M',
      steps: [
        {
          name: isHindi ? 'चरण 1: व्यक्तिगत, कुंडली व पारिवारिक विवरण दर्ज करें' : 'Step 1: Enter Personal, Kundali & Family Heritage',
          text: isHindi
            ? 'अपनी जन्मतिथि, समय, गोत्र, मांगलिक स्थिति, शिक्षा, पेशा और परिवार का विवरण दर्ज करें।'
            : 'Fill in candidate profile, astrological gotra/rashi/nakshatra, career milestones, and family heritage.'
        },
        {
          name: isHindi ? 'चरण 2: सांस्कृतिक या आधुनिक टेम्पलेट चुनें' : 'Step 2: Choose an Auspicious Design Layout',
          text: isHindi
            ? 'पारंपरिक वैदिक, राजस्थानी रॉयल, आधुनिक कॉर्पोरेट या फ्लोरल टेम्पलेट्स में से पसंदीदा शैली चुनें।'
            : 'Pick from traditional Vedic motifs, royal mandap borders, contemporary executive layouts, or floral designs.'
        },
        {
          name: isHindi ? 'चरण 3: तुरंत हाई-रेजोल्यूशन A4 PDF व WhatsApp इमेज डाउनलोड करें' : 'Step 3: Download High-Res Vector PDF & WhatsApp Image',
          text: isHindi
            ? 'बिना किसी लॉगिन या शुल्क के सीधे अपने मोबाइल या कंप्यूटर पर वाटरमार्क-मुक्त प्रिंट-रेडी PDF प्राप्त करें।'
            : 'Download watermark-free, publication-grade A4 PDF ready for high-resolution printing or instant WhatsApp forwarding.'
        }
      ]
    }
  });

  const handleStartFresh = () => {
    storageService.clearDraft();
    analyticsService.trackEvent('start_fresh_click');
    navigate('/create');
  };

  const handleLoadSample = (sampleType: 'hindu' | 'hindi') => {
    if (sampleType === 'hindi') {
      storageService.saveLocalDraft(sampleHindiBiodata);
    } else {
      storageService.saveLocalDraft(sampleHinduBiodata);
    }
    analyticsService.trackEvent('load_sample_home', { templateId: sampleType });
    navigate('/create');
  };

  const categories = [
    { name: 'Traditional Vedic', desc: 'Ganesh Shlokas, temple pillars & Gotra prominence', count: '2 Designs', path: '/templates?category=traditional' },
    { name: 'Modern Professional', desc: 'Sleek executive layouts for corporate & NRI families', count: '2 Designs', path: '/templates?category=modern' },
    { name: 'Royal Heritage', desc: 'Rajasthani mandaps, antique gold crests & velvet borders', count: '2 Designs', path: '/templates?category=royal' },
    { name: 'Minimalist Floral', desc: 'Pastel rose accents & understated contemporary elegance', count: '1 Design', path: '/templates?category=minimal' }
  ];

  const communities = [
    { title: 'Hindu Marriage Biodata', subtitle: 'Ganesh Shlokas, Rashi, Gotra & Kundali', path: '/hindu-marriage-biodata', icon: 'ॐ' },
    { title: 'Muslim (Nikah) Biodata', subtitle: 'Bismillah header, Urdu-compatible format', path: '/muslim-marriage-biodata', icon: '☪' },
    { title: 'Yadav Community Biodata', subtitle: 'Yaduvanshi gotra, ancestral lineage & values', path: '/yadav-marriage-biodata', icon: '❀' },
    { title: 'मराठी बायोडाटा (Marathi)', subtitle: 'कुलदैवत, रास, नक्षत्र व मामाचे घराणे', path: '/marathi-biodata', icon: '॥' },
    { title: 'বাংলা বায়োডাটা (Bengali)', subtitle: 'Purohit details, Gotra & ancestral lineage', path: '/bengali-marriage-biodata', icon: 'স্ব' }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-stone-50 to-stone-50 pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-stone-200">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Sacred Top Ribbon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold mb-6 shadow-2xs">
            <span className="font-rozha text-sm">ॐ</span>
            <span>{isHindi ? '100% नि:शुल्क • कोई लॉगिन नहीं • पूर्ण गोपनीयता' : '100% Free • No Login • Zero Data Stored Online'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight font-cinzel max-w-4xl mx-auto leading-tight">
            {isHindi ? (
              <>
                विवाह हेतु सुंदर एवं सुसंस्कृत <br />
                <span className="text-amber-800">बायो-डाटा निर्माता</span>
              </>
            ) : (
              <>
                Create An Auspicious Indian <br />
                <span className="text-amber-800">Marriage Biodata</span> in Minutes
              </>
            )}
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? 'बिना किसी अकाउंट, पासवर्ड या मोबाइल नंबर दिए तुरंत तैयार करें। आपकी निजी जानकारी सीधे आपके फोन या कंप्यूटर पर ही रहती है।'
              : 'Designed with cultural elegance for modern Indian families. Pure client-side generation ensures your family details never touch an external database.'}
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              onClick={handleStartFresh}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isHindi ? 'नया बायोडेटा बनाएं' : 'Create Free Biodata'}</span>
            </button>

            <Link
              to="/templates"
              className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4 text-amber-800" />
              <span>{isHindi ? 'टेम्पलेट्स देखें' : 'Explore Templates'}</span>
            </Link>

            <button
              onClick={() => handleLoadSample('hindu')}
              className="w-full sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHindi ? 'सैंपल लोड करें' : 'Try With Sample'}</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {isHindi ? 'कोई वॉटरमार्क नहीं' : 'No Watermark'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {isHindi ? 'उच्च रेजोल्यूशन A4 PDF' : 'Crisp A4 PDF & Image'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {isHindi ? 'अंग्रेजी एवं हिन्दी सपोर्ट' : 'Hindi & English Unicode'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {isHindi ? '100% प्राइवेट व सुरक्षित' : 'Zero Data Stored Online'}
            </span>
          </div>
        </div>
      </section>

      {/* Non-intrusive ad placeholder */}
      <ResponsiveAd variant="horizontal-leaderboard" monetizationLevel="STANDARD" />

      {/* 2. Three Step Process (How It Works) */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            {isHindi ? 'सरल एवं त्वरित प्रक्रिया' : 'Effortless 3-Step Process'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-cinzel">
            {isHindi ? 'केवल 3 चरणों में आपका बायोडेटा तैयार' : 'How It Works'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-stone-900 mb-1">
              {isHindi ? 'पारिवारिक व व्यक्तिगत विवरण भरें' : 'Fill In Family & Education Details'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isHindi
                ? 'नाम, जन्म समय/स्थान, शिक्षा, पेशा, गोत्र, मामा पक्ष व संपर्क सूत्र जैसी भारतीय परंपरा के अनुकूल जानकारी।'
                : 'Comprehensive fields for Gotra, Mosal (maternal uncle), Rashi, Nakshatra, career packages, and family values.'}
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-stone-900 mb-1">
              {isHindi ? 'शाही या आधुनिक टेम्पलेट चुनें' : 'Select a Royal or Modern Template'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isHindi
                ? 'राजस्थानी मंडप, वैदिक केसरिया, एमेरल्ड ग्रीन या कॉर्पोरेट नेवी ब्लू में से मनपसंद डिजाइन चुनें।'
                : 'Choose from culturally distinct designs featuring sacred mantras, temple arches, and gold fluting.'}
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-stone-900 mb-1">
              {isHindi ? 'तुरंत PDF व इमेज डाउनलोड करें' : 'Download High-Res PDF Instantly'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isHindi
                ? 'एक क्लिक में A4 साइज PDF प्राप्त करें अथवा सीधे व्हाट्सएप पर शेयर करने हेतु इमेज डाउनलोड करें।'
                : 'Zero waiting time. Save directly to your phone or computer, ready to print or forward on WhatsApp.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Design Categories Section */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              {isHindi ? 'डिजाइन शैलियां' : 'Curated Styles'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-cinzel">
              {isHindi ? 'अपनी पसंद के अनुसार श्रेणियां' : 'Explore by Template Category'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.path}
                className="p-5 rounded-2xl border border-stone-200 hover:border-amber-400 bg-stone-50/60 hover:bg-amber-50/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                    {cat.count}
                  </span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">{cat.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-800 group-hover:translate-x-1 transition-transform">
                  <span>Browse Category</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Template Showcase Preview */}
      <section className="py-14 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold mb-2 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>{isHindi ? 'लाइव टेम्पलेट कैटलॉग' : 'Live Cultural Catalog'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-cinzel tracking-tight">
                {isHindi ? 'प्रीमियम वैवाहिक टेम्पलेट्स' : 'Distinguished Marriage Templates'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {isHindi
                  ? 'पारंपरिक वैदिक, राजस्थानी मांडप एवं आधुनिक डिजाइनों में से चुनें'
                  : 'Authentic Indian designs with custom shlokas, gotra layouts, and elegant gold borders.'}
              </p>
            </div>
            <Link
              to="/templates"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm transition-all"
            >
              <span>{isHindi ? 'सभी टेम्पलेट्स देखें' : 'Browse All Templates'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills on Home Page */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button
              onClick={() => setSelectedHomeCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedHomeCategory === 'all'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {isHindi ? 'सभी डिजाइन' : 'All Templates'} ({templates.length})
            </button>
            <button
              onClick={() => setSelectedHomeCategory('traditional')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedHomeCategory === 'traditional'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {isHindi ? 'पारंपरिक (Traditional)' : 'Traditional Vedic'}
            </button>
            <button
              onClick={() => setSelectedHomeCategory('modern')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedHomeCategory === 'modern'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {isHindi ? 'आधुनिक (Modern)' : 'Modern & NRI'}
            </button>
            <button
              onClick={() => setSelectedHomeCategory('royal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedHomeCategory === 'royal'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {isHindi ? 'शाही (Royal Heritage)' : 'Royal Heritage'}
            </button>
          </div>

          {/* Template Cards Grid */}
          {isLoadingTemplates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-3xl border border-stone-200 p-4 h-80 animate-pulse flex flex-col justify-between">
                  <div className="h-44 bg-stone-100 rounded-2xl" />
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-stone-100 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
              <p className="text-stone-500 text-sm">No templates found.</p>
              <Link to="/templates" className="mt-3 inline-block text-xs font-bold text-amber-800 underline">
                View all templates
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates
                .filter((t) => {
                  if (selectedHomeCategory === 'all') return true;
                  if (selectedHomeCategory === 'royal') {
                    return t.style?.toLowerCase() === 'royal' || t.categoryId === 'royal';
                  }
                  return t.categoryId === selectedHomeCategory;
                })
                .slice(0, 6)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={(t) => setPreviewTemplate(t)}
                    onUseTemplate={handleUseTemplate}
                  />
                ))}
            </div>
          )}

          {/* View more CTA footer */}
          <div className="mt-10 text-center">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm rounded-2xl border border-stone-300 shadow-xs transition-all hover:shadow"
            >
              <Palette className="w-4 h-4 text-amber-800" />
              <span>
                {isHindi
                  ? `सभी ${templates.length} वैवाहिक टेम्पलेट्स देखें`
                  : `Explore All ${templates.length} Marriage Templates`}
              </span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Cultural & Community Guides */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            {isHindi ? 'धार्मिक व क्षेत्रीय प्रारूप' : 'Religion & Regional Formats'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-cinzel">
            {isHindi ? 'सभी परंपराओं के लिए उपयुक्त' : 'Formats Tailored to Every Tradition'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {communities.map((c, i) => (
            <Link
              key={i}
              to={c.path}
              className="p-4 rounded-xl border border-stone-200 bg-white hover:border-amber-300 hover:shadow-xs transition-all flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-sm">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs text-stone-900 truncate">{c.title}</h3>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Comprehensive Matrimonial Guide & Educational Content (SEO Authority) */}
      <section className="py-14 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              {isHindi ? 'विस्तृत मार्गदर्शिका' : 'Authoritative Matrimonial Guide'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mt-1 font-cinzel leading-tight">
              {isHindi
                ? 'विवाह हेतु आदर्श बायोडाटा कैसे बनाएं: संपूर्ण मार्गदर्शिका'
                : 'How to Create a Distinguished Indian Marriage Biodata: Complete Guide'}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isHindi
                ? 'भारतीय वैवाहिक व्यवस्था में बायोडेटा मात्र एक परिचय पत्र नहीं, बल्कि दो कुलों और परिवारों के परस्पर मिलन की पहली सीढ़ी है। जानिए इसमें क्या विवरण जोड़ें और किन बातों का ध्यान रखें।'
                : 'In Indian arranged and semi-arranged matrimony, a marriage biodata is far more than a corporate curriculum vitae. It is an auspicious document representing ancestral dignity, personal milestones, and family lineage.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Guide Card 1 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-base text-stone-900 font-cinzel">
                Personal & Auspicious Details
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Start with a sacred invocation (e.g. <em>॥ श्री गणेशाय नमः ॥</em>, <em>ॐ</em>, or <em>Bismillah</em>). Include full legal name, date of birth, exact time of birth, birth city, height, complexion, and mother tongue.
              </p>
              <div className="pt-2">
                <Link
                  to="/hindu-marriage-biodata"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
                >
                  <span>Explore Vedic Sacred Headers</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Guide Card 2 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-base text-stone-900 font-cinzel">
                Astrological & Horoscope Alignment
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Crucial for Kundali matching (Guna Milan). Explicitly mention self (paternal) Gotra, maternal uncle (Mosal/Nanihal) Gotra, Rashi (moon sign), Nakshatra, Charana, and Manglik status (Non-Manglik / Anshik).
              </p>
              <div className="pt-2">
                <Link
                  to="/marriage-biodata-format"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
                >
                  <span>View Gotra & Kundali Checklist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Guide Card 3 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-base text-stone-900 font-cinzel">
                Education & Career Standing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Highlight university degrees (e.g. B.Tech, MBA, MBBS, CA, Civil Services), current job title, corporate employer, and work location. State annual package gracefully or reserve it for personal conversation.
              </p>
              <div className="pt-2">
                <Link
                  to="/samples"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
                >
                  <span>View Professional Biodata Samples</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Guide Card 4 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="font-bold text-base text-stone-900 font-cinzel">
                Family Heritage & Lineage
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                List Father’s occupation, Mother’s background, Siblings (with marital status: elder brother married, younger sister studying), and Maternal Uncle (Mama Ji / Mosal) details for regional verification.
              </p>
              <div className="pt-2">
                <Link
                  to="/yadav-marriage-biodata"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
                >
                  <span>Learn 4-Gotra Lineage Rules</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Guide Card 5 */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-sm">
                5
              </div>
              <h3 className="font-bold text-base text-stone-900 font-cinzel">
                Dignified Portrait Photo
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Choose a warm, high-resolution portrait photograph in ethnic or formal attire with natural lighting. Avoid sunglasses, heavy filters, or crowded group crops to ensure a credible first impression.
              </p>
              <div className="pt-2">
                <Link
                  to="/templates"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
                >
                  <span>Browse Templates with Photo Frames</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Guide Card 6 */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 font-bold flex items-center justify-center text-sm">
                6
              </div>
              <h3 className="font-bold text-base text-stone-900 font-cinzel">
                Print & WhatsApp Readiness
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Always ensure your final biodata fits crisply on a single A4 page for printing without awkward page breaks. BiodataCraft also provides 1-click WhatsApp image download for instant mobile sharing.
              </p>
              <div className="pt-2">
                <Link
                  to="/create"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900"
                >
                  <span>Start Creating Free Biodata Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Hub of Regional & Community Guides */}
          <div className="p-6 rounded-2xl bg-stone-100/70 border border-stone-200">
            <h3 className="font-bold text-sm text-stone-900 font-cinzel mb-3">
              Regional Formats & Community Traditions
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link to="/marriage-biodata" className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium">
                Marriage Biodata Complete Guide
              </Link>
              <Link to="/marriage-biodata-format" className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium">
                1-Page vs 2-Page Format Analysis
              </Link>
              <Link to="/hindu-marriage-biodata" className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium">
                Hindu Vedic Format
              </Link>
              <Link to="/muslim-marriage-biodata" className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium">
                Muslim Nikah Format
              </Link>
              <Link to="/yadav-marriage-biodata" className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium">
                Yadav Community Format
              </Link>
              <Link to="/marathi-biodata" className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium">
                मराठी लग्न बायोडाटा
              </Link>
              <Link to="/bengali-marriage-biodata" className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium">
                বাংলা বিবাহ বায়োডাটা
              </Link>
              <Link to="/samples" className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-stone-700 font-medium">
                Biodata Sample Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us Section */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              {isHindi ? 'विशेषताएं' : 'Why Choose BiodataCraft'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-cinzel">
              {isHindi ? 'पारंपरिक गरिमा व आधुनिक सुविधा' : 'Built Specifically for Indian Families'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900 mb-1">
                Zero Cloud Storage
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your family contacts, income, and pictures stay strictly in your local device. We never harvest or sell matrimonial records.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900 mb-1">
                Instant PDF & WhatsApp Image
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Download print-ready standard A4 portrait PDFs or high-definition PNGs for immediate sharing on WhatsApp without formatting issues.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900 mb-1">
                Deep Cultural Nuance
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Pre-configured fields for Gotra, Mosal/Nanihal, Kundali, Rashi, Nakshatra, and custom astrological notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Zero-Storage Privacy Commitment */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800">
          <div className="max-w-3xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel mb-4">
              {isHindi
                ? 'हमारी 100% डेटा गोपनीयता प्रतिज्ञा'
                : 'Our Zero-Storage Customer Privacy Pledge'}
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed mb-6">
              {isHindi
                ? 'विवाह बायोडेटा में परिवार, कुंडली और आय की संवेदनशील जानकारी होती है। अधिकांश अन्य वेबसाइटें आपके डेटा को अपने डेटाबेस में रख लेती हैं। BiodataCraft में ऐसा कोई ग्राहक डेटाबेस मौजूद ही नहीं है। पूरा बायोडेटा आपके कंप्यूटर या फोन पर ही बनता है।'
                : 'A marriage biodata contains sensitive family, astrological, and financial information. Unlike other platforms that compile your family records into a remote database, BiodataCraft operates entirely client-side. We do not maintain any customer collection in our database.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-stone-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>No user accounts or phone number capture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Photographs never uploaded to cloud servers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>PDF generated client-side inside your browser</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Instant clear button to wipe your local cache</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/privacy-policy"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
              >
                <span>Read Full Technical Privacy Guarantee</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Interactive FAQ Accordion */}
      <section className="py-12 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-cinzel">
              {isHindi ? 'आपके सवालों के जवाब' : 'Common Questions About BiodataCraft'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <div
                key={i}
                className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
                  aria-expanded={openFaqIndex === i}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${
                      openFaqIndex === i ? 'rotate-180 text-amber-800' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === i && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900"
            >
              <span>View All Frequently Asked Questions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="py-16 bg-gradient-to-b from-amber-50/80 to-amber-100/60 border-t border-amber-200/80 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-800 text-amber-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 font-cinzel">
            {isHindi ? 'आज ही अपना विवाह बायोडेटा तैयार करें' : 'Ready to Create Your Marriage Biodata?'}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            {isHindi
              ? 'बिना किसी परेशानी, वॉटरमार्क या अकाउंट बनाए 5 मिनट में सुरुचिपूर्ण बायोडेटा तैयार करें।'
              : 'Free forever, zero registration, and complete privacy. Download a dignified, print-ready PDF in just 5 minutes.'}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartFresh}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isHindi ? 'बायोडेटा बनाना शुरू करें' : 'Create Biodata Now'}</span>
            </button>
            <Link
              to="/templates"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl font-bold text-sm shadow-2xs transition-all"
            >
              <span>Browse All Designs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Template Preview Modal on Home Page */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
};


