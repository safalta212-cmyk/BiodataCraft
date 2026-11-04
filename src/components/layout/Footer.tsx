import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, HeartHandshake } from 'lucide-react';
import { adminService, SiteSettings } from '../../services/adminService';

export const Footer: React.FC = () => {
  const [settings] = useState<SiteSettings>(() => adminService.getSettings());
  const social = settings.socialLinks || {};

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 mb-10 border-b border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Zero Customer Data Storage
              </h3>
              <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                Customer biodatas remain strictly within your browser. We never store personal details or family photos in any cloud database.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                No Customer Accounts or Logins
              </h3>
              <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                No registration, OTP verification, or password creation required. Direct access to all Indian templates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                Authentic Cultural Nuance
              </h3>
              <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                Tailored for Indian weddings with Gotra, Mama Ji (Mosal), Kundali, Rashi, Nakshatra, and sacred shlokas.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 sm:gap-8 mb-10 text-xs">
          {/* Brand Column */}
          <div className="col-span-1 sm:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white p-0.5 shadow-xs shrink-0">
                <img
                  src={settings.logo || '/logo.png'}
                  alt={settings.siteName || 'BiodataCraft'}
                  className="w-full h-full object-contain"
                  width={32}
                  height={32}
                />
              </div>
              <span className="font-bold text-base text-white font-cinzel">{settings.siteName || 'BiodataCraft'}</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs max-w-sm">
              An original web platform purpose-built for Indian families to design distinguished marriage biodatas with complete privacy and zero data harvesting.
            </p>

            {/* Social Media Links from Settings */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-stone-300">
              {social.whatsapp && (
                <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-stone-800" title="WhatsApp">
                  WhatsApp
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-stone-800" title="Facebook">
                  Facebook
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-stone-800" title="Instagram">
                  Instagram
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-stone-800" title="Twitter / X">
                  X
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-stone-800" title="YouTube">
                  YouTube
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <p className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
              Explore
            </p>
            <ul className="space-y-1 text-stone-300">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  All Templates
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Create Biodata
                </Link>
              </li>
              <li>
                <Link to="/samples" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Sample Biodatas
                </Link>
              </li>
              <li>
                <Link to="/biodata" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Topics Directory (500+)
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Guides & Articles
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Formats & Community Guides */}
          <div className="space-y-2.5">
            <p className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
              Formats & Guides
            </p>
            <ul className="space-y-1 text-stone-300">
              <li>
                <Link to="/marriage-biodata" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Biodata Guide
                </Link>
              </li>
              <li>
                <Link to="/marriage-biodata-format" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Format Checklist
                </Link>
              </li>
              <li>
                <Link to="/hindu-marriage-biodata" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Hindu Biodata
                </Link>
              </li>
              <li>
                <Link to="/muslim-marriage-biodata" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Muslim (Nikah) Biodata
                </Link>
              </li>
              <li>
                <Link to="/yadav-marriage-biodata" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Yadav Biodata
                </Link>
              </li>
              <li>
                <Link to="/marathi-biodata" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  मराठी बायोडाटा
                </Link>
              </li>
              <li>
                <Link to="/bengali-marriage-biodata" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  বাংলা বায়োডাটা
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-2.5">
            <p className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
              Company
            </p>
            <ul className="space-y-1 text-stone-300">
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center gap-1">
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span>Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div className="space-y-2.5">
            <p className="font-bold text-stone-200 uppercase tracking-wider text-[11px]">
              Legal & Trust
            </p>
            <ul className="space-y-1 text-stone-300">
              <li>
                <Link to="/privacy-policy" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-amber-400 transition-colors py-1.5 min-h-[36px] inline-flex items-center">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            {settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName || 'BiodataCraft'}. All rights reserved.`}
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <span>Client-Side Architecture</span>
            <span>•</span>
            <span>100% Free Forever</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">Design by Anwar Ansari</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
