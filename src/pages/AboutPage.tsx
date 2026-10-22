import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Award,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  useSEO({
    title: 'About Us - Privacy-First Indian Matrimonial Platform | BiodataCraft',
    description:
      'Learn about BiodataCraft, our mission to uphold family privacy in Indian marriage biodata creation, and our zero-customer-storage commitment.',
    canonicalPath: '/about',
    breadcrumbs: [{ name: 'About Us', path: '/about' }]
  });

  return (
    <div className="min-h-screen bg-stone-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold">
            <span className="font-rozha text-sm">ॐ</span>
            <span>Cultural Reverence & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-cinzel">
            About BiodataCraft
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Crafting auspicious marriage biodatas for Indian families without sacrificing personal privacy, demanding logins, or storing personal family details.
          </p>
        </div>

        {/* Origin Story Card */}
        <Card variant="royal">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-stone-900 font-cinzel">
              Why We Built BiodataCraft
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              In India, a marriage biodata is an intimate document. It contains the deepest details of one’s family: ancestral Gotra, maternal uncle’s lineage, astrological birth timings, educational achievements, contact numbers, and family residences.
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              When we surveyed existing online tools, we observed a troubling trend: visitors were forced to submit phone numbers for OTP verification, personal photographs were uploaded to insecure public cloud buckets, and biodatas were harvested into matrimonial databases.
            </p>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-semibold text-amber-950">
              We asked a simple engineering question: Why should creating a PDF document require an account? The answer was: It shouldn't.
            </p>
          </CardContent>
        </Card>

        {/* Guiding Principles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-900 font-cinzel text-center">
            Our Core Architectural Principles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5 flex items-start gap-3.5">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Zero Customer Database</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    We deliberately do not maintain a Firestore collection or database table for customer biodatas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-start gap-3.5">
                <Heart className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-stone-900">100% Free Forever</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    No paywalls, hidden charges, or forced watermarks on downloaded PDFs.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-start gap-3.5">
                <Compass className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Authentic Cultural Details</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Support for Gotra, Mosal (maternal uncle), Rashi, Nakshatra, and sacred shlokas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 flex items-start gap-3.5">
                <Sparkles className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Browser-Side Generation</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    High-resolution vector PDF synthesis occurs directly in your local browser memory.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Designer Attribution Card */}
        <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 border border-amber-200/80 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-xs space-y-2">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel">
            Creator & Craftsmanship
          </p>
          <h3 className="text-base font-bold text-stone-900 font-cinzel">
            Design by Anwar Ansari
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
            Dedicated to providing dignified, culturally authentic, and 100% private marriage biodata designs for Indian families across the world.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
          <h2 className="text-2xl font-bold font-cinzel">
            Experience Dignified Matrimonial Crafting
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            Choose a royal Indian design, enter your family details, and download a publication-grade PDF without logging in.
          </p>
          <div className="pt-2">
            <Link to="/templates">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse All Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
