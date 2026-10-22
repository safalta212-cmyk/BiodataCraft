import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card, CardContent } from '../components/ui/Card';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const RefundPolicyPage: React.FC = () => {
  useSEO({
    title: 'Refund & Pricing Policy (100% Free Service) | BiodataCraft',
    description:
      'BiodataCraft is 100% free with no paid services or download fees. Read our pricing and refund policy disclosure.',
    canonicalPath: '/refund-policy',
    breadcrumbs: [{ name: 'Refund Policy', path: '/refund-policy' }]
  });

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ name: 'Refund Policy' }]} />

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs border border-emerald-200">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Pricing Disclosure
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-cinzel">
            Refund & Pricing Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            BiodataCraft is an entirely free utility with zero customer fees, paywalls, or premium subscriptions.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-stone-500 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              Effective Date: October 2026
            </span>
            <span>•</span>
            <span>Version 2.4</span>
          </div>
        </div>

        {/* Highlight Card */}
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-emerald-800">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800 rounded-full text-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Free Public Utility
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-200">
              Zero Customer Charges • No Paid Services
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-3xl">
              BiodataCraft does not offer any paid plans, premium tiers, or download unlocking fees. Every template, feature, Hindi/English language setting, and vector A4 PDF export on this website is <strong>completely free of charge</strong> for all users.
            </p>
          </div>
        </div>

        {/* Detailed Policy Card */}
        <Card>
          <CardContent className="p-6 sm:p-10 space-y-6 text-sm text-stone-700 leading-relaxed font-sans">
            <section className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 font-cinzel text-base sm:text-lg">
                <CreditCard className="w-5 h-5 text-amber-800 shrink-0" />
                <span>1. No Payments Collected</span>
              </div>
              <p>
                Because BiodataCraft is supported entirely by non-intrusive standard web advertising, <strong>we do not operate any payment gateway, credit card processing system, Net Banking connection, or UPI QR code</strong> on this platform.
              </p>
              <p>
                At no point will BiodataCraft prompt you to enter credit/debit card credentials, bank account info, or mobile wallet details.
              </p>
              <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <strong className="text-stone-800 block mb-1">Clarification on "Premium" and "Royal" Template Labels:</strong>
                Any templates marked as &quot;Premium&quot;, &quot;Royal&quot;, or &quot;Elite&quot; in our template catalog refer solely to ornate artistic border styles, intricate mandala motifs, and cultural aesthetics. All such designs are 100% free to customize and download without any payment, unlocking fee, or subscription.
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 font-cinzel text-base sm:text-lg">
                <Sparkles className="w-5 h-5 text-amber-800 shrink-0" />
                <span>2. Non-Applicability of Refunds</span>
              </div>
              <p>
                Because no monetary transactions or payments of any kind are ever accepted from users of this website, <strong>refund requests, chargebacks, and payment disputes are non-applicable</strong> to BiodataCraft.
              </p>
              <p>
                All services—from template selection and customization to instant PDF generation—are provided to the public at zero monetary cost.
              </p>
            </section>

            <section className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 font-cinzel text-base sm:text-lg">
                <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0" />
                <span>3. Fraud & Impersonation Alert</span>
              </div>
              <p>
                BiodataCraft will never send unsolicited emails, SMS messages, WhatsApp chats, or phone calls demanding payment, subscriptions, or biodata release fees.
              </p>
              <p>
                If you encounter any individual, entity, or third-party website fraudulently soliciting payments claiming to represent BiodataCraft, please do not remit any funds and report the incident immediately to our security desk at{' '}
                <a href="mailto:support@biodatacraft.in" className="text-amber-800 underline font-semibold">
                  support@biodatacraft.in
                </a>.
              </p>
            </section>

            <section className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2 font-bold text-stone-900 font-cinzel text-base sm:text-lg">
                <HelpCircle className="w-5 h-5 text-amber-800 shrink-0" />
                <span>4. Assistance & Inquiries</span>
              </div>
              <p>
                If you have questions regarding this disclosure or wish to provide feedback on our free templates, please contact our support team.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-600">
                  <span>Questions about our zero-cost commitment?</span>
                </div>
                <Link to="/contact">
                  <Button size="sm" variant="outline" className="text-xs">
                    Contact Support (/contact)
                  </Button>
                </Link>
              </div>

              {/* Legal Review Advisory Notice */}
              <div className="mt-4 p-3 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 leading-relaxed">
                <strong>Legal Review Advisory:</strong> This Refund & Pricing Policy truthfully discloses that BiodataCraft operates with zero payment gateways, zero customer fees, and free A4 PDF exports. Statements regarding consumer rights and non-applicability of refunds under applicable consumer protection legislation should be verified by a qualified legal professional.
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
