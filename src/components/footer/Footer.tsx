import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, FileCheck2, Lock, Sparkles, Award } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'hi' | 'bilingual';
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isHindi = language === 'hi';

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 mb-10 border-b border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">
                {isHindi ? '100% डेटा गोपनीयता गारंटी' : 'Zero-Storage Privacy'}
              </h5>
              <p className="text-xs text-stone-400 mt-0.5">
                {isHindi
                  ? 'आपका बायोडेटा कभी हमारे सर्वर पर सेव नहीं होता। पूरा काम आपके ब्राउज़र में होता है।'
                  : 'Customer biodata remains strictly on your local browser. No cloud storage of private details.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">
                {isHindi ? 'कोई अकाउंट या लॉगिन नहीं' : 'No Account / Sign-up Required'}
              </h5>
              <p className="text-xs text-stone-400 mt-0.5">
                {isHindi
                  ? 'बिना फोन नंबर या पासवर्ड डाले तुरंत सुंदर बायोडेटा बनाएं और डाउनलोड करें।'
                  : 'Jump straight into the maker. No phone verification, no passwords, no spam.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">
                {isHindi ? 'मानक A4 प्रिंट-रेडी PDF' : 'Standard High-Res A4 Output'}
              </h5>
              <p className="text-xs text-stone-400 mt-0.5">
                {isHindi
                  ? 'व्हाट्सएप पर शेयर करने अथवा प्रिंट निकालने के लिए उपयुक्त हाई-रेजोल्यूशन।'
                  : 'Crisp Hindi Unicode and English typography with auspicious borders.'}
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-xs">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-rozha text-xl text-amber-400 font-bold">ॐ</span>
              <span className="font-bold text-base text-white font-cinzel">BiodataCraft</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              {isHindi
                ? 'भारतीय वैवाहिक रीति-रिवाजों एवं आधुनिक जीवनशैली के अनुरूप तैयार किया गया प्रमुख बायोडेटा निर्माता।'
                : 'Architected for Indian families seeking dignity, cultural nuance, and effortless matrimonial presentations.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h6 className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
              {isHindi ? 'शीघ्र नेविगेशन' : 'Navigation'}
            </h6>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <Link to="/builder" className="hover:text-amber-400 transition-colors">
                  {isHindi ? 'बायोडेटा बनाएं' : 'Create Biodata'}
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-amber-400 transition-colors">
                  {isHindi ? 'टेम्पलेट गैलरी' : 'Template Gallery'}
                </Link>
              </li>
              <li>
                <Link to="/samples" className="hover:text-amber-400 transition-colors">
                  {isHindi ? 'तैयार नमूने' : 'Sample Biodatas'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-400 transition-colors">
                  {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQ & Print Tips'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cultural Formats */}
          <div className="space-y-2.5">
            <h6 className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
              {isHindi ? 'धार्मिक व सांस्कृतिक प्रारूप' : 'Cultural Formats'}
            </h6>
            <ul className="space-y-1.5 text-stone-400">
              <li>Hindu Vedic & Brahmin</li>
              <li>Jain Digambar & Shwetambar</li>
              <li>Sikh Anand Karaj</li>
              <li>Muslim Nikah Biodata</li>
              <li>Modern Professional & IT</li>
            </ul>
          </div>

          {/* Security & Admin */}
          <div className="space-y-2.5">
            <h6 className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
              {isHindi ? 'सुरक्षा एवं नीति' : 'Security & Trust'}
            </h6>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <Link to="/privacy" className="hover:text-amber-400 transition-colors">
                  {isHindi ? 'गोपनीयता नीति' : 'Zero-Storage Pledge'}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <Lock className="w-3 h-3 text-stone-500" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} BiodataCraft. All rights reserved. Designed with cultural reverence for Indian families.
          </div>
          <div className="flex items-center gap-4">
            <span>Client-Side Architecture</span>
            <span>•</span>
            <span>Made with Respect for Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
