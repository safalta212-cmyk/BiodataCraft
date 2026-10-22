import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  FileQuestion,
  Home,
  Palette,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useSEO({
    title: 'Page Not Found - 404 | BiodataCraft',
    description: 'The requested page or matrimonial resource could not be found on BiodataCraft.',
    canonicalPath: '/404',
    noindex: true
  });

  return (
    <div className="min-h-[75vh] bg-stone-50 py-16 sm:py-24 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Sacred Visual Badge */}
        <div className="w-20 h-20 bg-amber-100 text-amber-900 rounded-3xl flex items-center justify-center mx-auto shadow-md border border-amber-200">
          <FileQuestion className="w-10 h-10 text-amber-800" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto leading-relaxed">
            The matrimonial page, template, or guide you are looking for does not exist, has been relocated, or the link may have been entered incorrectly.
          </p>
        </div>

        {/* Helpful Direct Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Home className="w-4 h-4 text-amber-200" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/templates"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl font-semibold text-sm shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Palette className="w-4 h-4 text-amber-800" />
            <span>Browse Templates</span>
          </Link>

          <Link
            to="/create"
            className="w-full sm:w-auto px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-500" />
            <span>Create Biodata</span>
          </Link>
        </div>

        {/* Helpful Quick Links Card */}
        <Card className="text-left mt-8 max-w-xl mx-auto border-stone-200">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-cinzel">
              Popular Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <Link
                to="/marriage-biodata-format"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-700 hover:text-amber-900 transition-colors"
              >
                <span>Biodata Format Checklist</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
              <Link
                to="/hindu-marriage-biodata"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-700 hover:text-amber-900 transition-colors"
              >
                <span>Hindu & Vedic Formats</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
              <Link
                to="/blog"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-700 hover:text-amber-900 transition-colors"
              >
                <span>Matrimonial Guides & Etiquette</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
              <Link
                to="/faq"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-700 hover:text-amber-900 transition-colors"
              >
                <span>Frequently Asked Questions</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
