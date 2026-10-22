import React from 'react';
import { ShieldCheck, Lock, Database, Trash2, EyeOff, ServerOff, FileCheck, CheckCircle } from 'lucide-react';

interface PrivacyPageProps {
  language: 'en' | 'hi' | 'bilingual';
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ language }) => {
  const isHindi = language === 'hi';

  const principles = [
    {
      title: isHindi ? '१. कोई ग्राहक पंजीकरण या लॉगिन नहीं' : '1. Zero Customer Registration or Accounts',
      desc: isHindi
        ? 'हम आपसे कभी भी मोबाइल नंबर, ईमेल सत्यापन या पासवर्ड बनाने के लिए नहीं कहते। आप बिना किसी बाधा के तुरंत बायोडेटा बना सकते हैं।'
        : 'You will never be asked for an email, phone verification, or password. We do not maintain any user account database for visitors.'
    },
    {
      title: isHindi ? '२. कोई ग्राहक डेटाबेस (Firestore) संग्रह नहीं' : '2. No Database Collection for Customer Biodatas',
      desc: isHindi
        ? 'हमारे सर्वर पर कोई डेटाबेस टेबल या संग्रह मौजूद नहीं है जहाँ आपकी व्यक्तिगत जानकारी रिकॉर्ड हो सके।'
        : 'There is deliberately no database collection, Firestore table, or persistent server record storing your matrimonial biodata.'
    },
    {
      title: isHindi ? '३. १००% क्लाइंट-साइड (ब्राउज़र में) निर्माण' : '3. 100% In-Browser Client-Side Generation',
      desc: isHindi
        ? 'आपका नाम, गोत्र, कुंडली, वेतन तथा फोटो आपके अपने वेब ब्राउज़र के भीतर ही रेंडर होते हैं। डेटा कभी हमारे सर्वर पर ट्रांसमिट नहीं होता।'
        : 'HTML5 canvas rendering and vector PDF creation take place completely inside your local browser memory on your phone or computer.'
    },
    {
      title: isHindi ? '४. तस्वीरों का कोई सर्वर अपलोड नहीं' : '4. Zero Photo Upload to Cloud Storage',
      desc: isHindi
        ? 'जब आप फोटो जोड़ते हैं, तो वह केवल आपके स्थानीय डिवाइस पर बेस६४ प्रारूप में लोड होती है और सीधे आपकी पीडीएफ में एम्बेड होती है।'
        : 'Uploaded portrait photos are converted directly into base64 data URLs in your browser memory and never stored in any cloud bucket.'
    },
    {
      title: isHindi ? '५. केवल अनाम तकनीकी एनालिटिक्स' : '5. Anonymous Aggregated Event Analytics Only',
      desc: isHindi
        ? 'हमारी प्रणाली केवल यह गिनती करती है कि कौन सा टेम्पलेट कितने लोगों द्वारा पसंद किया गया (जैसे: "रॉयल हेरिटेज: ५०० बार")। इसमें कोई नाम, पता या फोन नंबर नहीं होता।'
        : 'We only tally aggregate technical metrics (such as "Royal Heritage template downloaded 500 times"). We never log or record personal biodata details.'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            {isHindi ? 'हमारी प्रतिबद्धता' : 'Our Non-Negotiable Commitment'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1 font-cinzel">
            {isHindi ? 'शून्य-डेटा भंडारण गोपनीयता गारंटी' : 'The Zero-Storage Privacy Pledge'}
          </h1>
          <p className="mt-3 text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? 'भारतीय परिवारों के वैवाहिक बायोडेटा की पूर्ण शुचिता एवं गोपनीयता की रक्षा करना हमारा प्राथमिक सिद्धांत है।'
              : 'Indian marriage biodatas contain intimate family details, astrological charts, and contact numbers. Here is how we technically guarantee your absolute privacy.'}
          </p>
        </div>

        {/* Core Principles Cards */}
        <div className="space-y-4 mb-12">
          {principles.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-900 font-bold flex items-center justify-center shrink-0 text-sm mt-0.5 border border-amber-200">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-1">{item.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Architecture Comparison */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-10">
          <h3 className="text-lg font-bold text-stone-900 mb-4 font-cinzel">
            {isHindi ? 'पारंपरिक वेबसाइट्स बनाम BiodataCraft' : 'Typical Matrimonial Sites vs. BiodataCraft'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Typical Websites */}
            <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2">
              <span className="font-bold text-red-900 block text-sm">
                Typical Commercial Platforms
              </span>
              <ul className="space-y-1.5 text-stone-700">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Forces customer registration & OTP</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Stores names, numbers, and salaries in cloud DB</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Uploads personal photos to remote cloud buckets</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>May resell matrimonial lead data to brokers</span>
                </li>
              </ul>
            </div>

            {/* BiodataCraft */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 block text-sm">
                BiodataCraft (Our Architecture)
              </span>
              <ul className="space-y-1.5 text-stone-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero registration, no login, open access</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No customer biodata database exists on server</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Photos rendered locally inside browser memory</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% free forever with instant local PDF export</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Clear Data Instructions */}
        <div className="bg-stone-100 border border-stone-200 rounded-2xl p-5 text-xs text-stone-600">
          <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
            <Trash2 className="w-4 h-4 text-amber-800" />
            <span>{isHindi ? 'स्थानीय ड्राफ्ट को कभी भी मिटाएं' : 'Wiping Local Storage at Any Time'}</span>
          </h4>
          <p className="leading-relaxed">
            {isHindi
              ? 'जब आप काम पूरा कर लें, तो बायोडेटा बिल्डर में "खाली करें (Clear Form)" बटन दबाकर अपने ब्राउज़र की अस्थायी मेमोरी को तुरंत साफ कर सकते हैं।'
              : 'Whenever you finish drafting your biodata and have downloaded your PDF, simply click the "Clear Form" button in the builder toolbar. This immediately wipes your local draft from your browser.'}
          </p>
        </div>
      </div>
    </div>
  );
};
