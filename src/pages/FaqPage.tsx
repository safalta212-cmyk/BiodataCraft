import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { HelpCircle, ChevronDown, ChevronUp, Printer, Globe, Shield, Sparkles, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface FaqPageProps {
  language: 'en' | 'hi' | 'bilingual';
}

export const FaqPage: React.FC<FaqPageProps> = ({ language }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isHindi = language === 'hi';

  const faqs = [
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
      q: isHindi ? 'प्रिंट करते समय हेडर व फुटर को कैसे हटाएं?' : 'How do I print cleanly without browser headers and footers?',
      a: isHindi
        ? 'जब आप "प्रिंट करें" या Ctrl+P दबाते हैं, तो प्रिंट संवाद बॉक्स में "More Settings" में जाएं और "Headers and footers" का टिक हटा दें। इससे आपकी A4 शीट बिल्कुल साफ और सुंदर निकलेगी।'
        : 'When you click "Print" or press Ctrl+P (Cmd+P on Mac), expand "More Settings" in the print dialog and uncheck the "Headers and footers" checkbox. Ensure paper size is set to A4.'
    },
    {
      q: isHindi ? 'हिन्दी में बायोडेटा कैसे टाइप करें?' : 'How do I type in Hindi Devanagari script?',
      a: isHindi
        ? 'आप अपने मोबाइल के हिन्दी कीबोर्ड का उपयोग कर सकते हैं या कंप्यूटर पर गूगल इनपुट टूल्स (Google Input Tools) का उपयोग करके अंग्रेजी में टाइप करते ही वह हिन्दी में बदल जाता है।'
        : 'You can easily type in Hindi using your smartphone’s native Hindi keyboard, or by using Google Input Tools / Windows Hindi Phonetic keyboard on your PC.'
    },
    {
      q: isHindi ? 'मामा का विवरण (Mosal/Nanihal) क्या है और यह क्यों आवश्यक है?' : 'What is the Maternal Uncle (Mosal/Nanihal) field?',
      a: isHindi
        ? 'भारतीय वैवाहिक परंपरा में विशेषकर उत्तर व पश्चिम भारत में वर और वधू दोनों के ननिहाल पक्ष का गोत्र व पारिवारिक पृष्ठभूमि जांची जाती है ताकि गोत्र मिलान में कोई विरोध न हो।'
        : 'In traditional Indian matrimony (especially North and West Indian communities), maternal uncle (Mama Ji / Mosal) gotra and background is checked to ensure there is no gotra overlap or ancestral conflict.'
    },
    {
      q: isHindi ? 'क्या मेरी फोटो सुरक्षित है?' : 'Is my candidate photograph secure?',
      a: isHindi
        ? 'हाँ, आपकी फोटो आपके ही वेब ब्राउज़र में स्थानीय रूप से प्रोसेस होती है। यह कभी हमारे सर्वर पर अपलोड नहीं होती और न ही किसी क्लाउड में रखी जाती है।'
        : 'Yes, absolutely. Your photo is converted directly into your PDF within your browser’s local memory. It is never transmitted or saved to any remote cloud storage server.'
    },
    {
      q: isHindi ? 'क्या मैं व्हाट्सएप पर सीधे शेयर कर सकता हूँ?' : 'Can I share the biodata directly on WhatsApp?',
      a: isHindi
        ? 'हाँ! आप डाउनलोड विंडो में "व्हाट्सएप हेतु इमेज (PNG)" विकल्प चुन सकते हैं। यह तुरंत उच्च गुणवत्ता वाली तस्वीर डाउनलोड कर देता है जिसे आप आसानी से व्हाट्सएप पर भेज सकते हैं।'
        : 'Yes! In the download dialog, click "Download WhatsApp Image (PNG)". This generates a high-resolution image optimized for instant viewing in WhatsApp chats.'
    }
  ];

  useSEO({
    title: isHindi
      ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ) - विवाह बायोडेटा | BiodataCraft'
      : 'Frequently Asked Questions (FAQ) - Indian Marriage Biodata Maker | BiodataCraft',
    description: isHindi
      ? 'भारतीय विवाह बायोडेटा बनाने, A4 PDF प्रिंटिंग, हिन्दी टाइपिंग, गोत्र एवं गोपनीयता से संबंधित सभी प्रश्नों के उत्तर।'
      : 'Answers to common questions regarding Indian marriage biodata creation, photo privacy, Kundali gotra fields, Mosal details, Hindi typing, and A4 PDF printing.',
    canonicalPath: '/faq',
    breadcrumbs: [{ name: 'FAQ', path: '/faq' }],
    faqs: faqs.map((f) => ({ question: f.q, answer: f.a }))
  });

  return (
    <div className="min-h-screen bg-stone-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            {isHindi ? 'सहायता एवं मार्गदर्शन' : 'Help & Guidelines'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1 font-cinzel">
            {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}
          </h1>
          <p className="mt-3 text-sm text-stone-600">
            {isHindi
              ? 'विवाह बायोडेटा बनाने, प्रिंट निकालने एवं गोपनीयता से संबंधित आपके सामान्य प्रश्नों के उत्तर।'
              : 'Everything you need to know about crafting, printing, and sharing your marriage biodata.'}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <span className="font-bold text-stone-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Related Guides & Internal Navigation */}
        <div className="mt-12 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-stone-900 font-cinzel mb-2 text-center">
            {isHindi ? 'संबंधित वैवाहिक संसाधन एवं प्रारूप' : 'Helpful Matrimonial Resources & Templates'}
          </h2>
          <p className="text-xs text-stone-500 text-center mb-6">
            {isHindi ? 'अपने समुदाय के अनुसार आदर्श प्रारूप चुनें अथवा वास्तविक नमूने देखें' : 'Pick the right cultural format for your community or browse authentic real-world samples.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              to="/samples"
              className="p-3.5 bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-200 hover:border-amber-300 font-semibold text-stone-800 transition-colors flex items-center justify-between"
            >
              <span>{isHindi ? 'बायोडेटा के नमूने देखें' : 'View Sample Biodatas'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>
            <Link
              to="/marriage-biodata-format"
              className="p-3.5 bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-200 hover:border-amber-300 font-semibold text-stone-800 transition-colors flex items-center justify-between"
            >
              <span>{isHindi ? 'विवाह बायोडेटा प्रारूप' : 'Marriage Biodata Formats'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>
            <Link
              to="/templates"
              className="p-3.5 bg-stone-50 hover:bg-amber-50 rounded-xl border border-stone-200 hover:border-amber-300 font-semibold text-stone-800 transition-colors flex items-center justify-between"
            >
              <span>{isHindi ? 'सभी १०+ टेम्पलेट्स' : 'Browse All 10+ Templates'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </Link>
            <Link
              to="/create"
              className="p-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold transition-colors flex items-center justify-between"
            >
              <span>{isHindi ? 'नया बायोडेटा बनाएं' : 'Create Free Biodata'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
