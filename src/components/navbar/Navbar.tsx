import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Shield, FileText, Layers, HelpCircle, Lock } from 'lucide-react';

interface NavbarProps {
  language: 'en' | 'hi' | 'bilingual';
  onLanguageToggle: (lang: 'en' | 'hi') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ language, onLanguageToggle }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHindi = language === 'hi';

  const navLinks = [
    { to: '/', label: isHindi ? 'होम' : 'Home' },
    { to: '/create', label: isHindi ? 'बायोडेटा बनाएं' : 'Create Biodata' },
    { to: '/templates', label: isHindi ? 'टेम्पलेट्स' : 'Templates' },
    { to: '/about', label: isHindi ? 'हमारे बारे में' : 'About' },
    { to: '/privacy-policy', label: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy' },
    { to: '/contact', label: isHindi ? 'संपर्क करें' : 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
            <span className="font-rozha text-xl font-bold text-amber-200">ॐ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 tracking-tight text-lg sm:text-xl font-cinzel">
                Biodata<span className="text-amber-800">Craft</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                100% Free
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium -mt-1 hidden sm:block">
              {isHindi ? 'विवाह बायोडेटा मेकर • नो लॉगिन' : 'Marriage Biodata Maker • No Login Required'}
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-amber-800 font-bold border-b-2 border-amber-800 pb-1'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Language Toggle */}
          <div className="bg-stone-100 p-0.5 rounded-lg flex items-center text-xs font-semibold border border-stone-200 shrink-0">
            <button
              type="button"
              onClick={() => onLanguageToggle('en')}
              className={`px-2 py-1.5 min-h-[36px] rounded-md transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageToggle('hi')}
              className={`px-2 py-1.5 min-h-[36px] rounded-md transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-amber-800 text-white shadow-2xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Primary CTA */}
          <Link
            to="/create"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-900/10 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{isHindi ? 'बायोडेटा बनाएं' : 'Create Biodata'}</span>
          </Link>

          {/* Mobile Menu Button - min 44x44px touch target */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-900"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 bg-amber-800 text-white rounded-xl text-xs font-bold shadow"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{isHindi ? 'बायोडेटा बनाएं (100% Free)' : 'Create Biodata (100% Free)'}</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center min-h-[44px] flex items-center justify-center text-xs text-stone-400 hover:text-stone-600"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
