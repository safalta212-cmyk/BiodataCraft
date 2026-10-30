import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { adminService, SiteSettings } from '../../services/adminService';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings] = useState<SiteSettings>(() => adminService.getSettings());
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/templates', label: 'Templates' },
    { to: '/samples', label: 'Samples' },
    { to: '/marriage-biodata-format', label: 'Formats' },
    { to: '/create', label: 'Create Biodata' },
    { to: '/blog', label: 'Blog & Guides' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      {/* Top Announcement Banner Strip */}
      {settings.announcementActive && settings.announcementText && (
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-amber-100 text-[11px] py-1.5 px-4 text-center font-medium border-b border-amber-700/50 flex flex-wrap items-center justify-center gap-1.5 break-words">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="max-w-3xl">{settings.announcementText}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="font-rozha text-lg sm:text-xl font-bold text-amber-200">ॐ</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-stone-900 tracking-tight text-base sm:text-xl font-cinzel truncate max-w-[130px] xs:max-w-none">
                  {settings.siteName || 'BiodataCraft'}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded shrink-0">
                  100% Free
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium -mt-1 hidden sm:block truncate">
                Indian Marriage Biodata Maker • No Login Required
              </p>
            </div>
          </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-xs font-semibold transition-colors py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-amber-800 font-bold border-b-2 border-amber-800'
                    : 'text-stone-600 hover:text-stone-950'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls & Mobile Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="whitespace-nowrap">Zero-Storage Privacy</span>
          </div>

          <Link
            to="/create"
            className="hidden sm:inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1 text-xs px-3 py-1.5 gap-1.5 min-h-[36px] bg-amber-800 text-white hover:bg-amber-900 focus:ring-amber-800/50 shadow-sm shadow-amber-900/20 border border-amber-900/20 active:scale-[0.98] whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Create Biodata</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 cursor-pointer transition-colors p-2"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <Link
              to="/create"
              className="w-full inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1 text-sm px-4 py-2.5 min-h-[44px] gap-2 bg-amber-800 text-white hover:bg-amber-900 shadow-sm shadow-amber-900/20 active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Create Free Biodata</span>
            </Link>

            <Link
              to="/admin/login"
              className="text-center text-xs text-stone-600 hover:text-stone-700 py-2 min-h-[36px] flex items-center justify-center"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
    </>
  );
};
