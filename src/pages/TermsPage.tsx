import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card, CardContent } from '../components/ui/Card';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Scale,
  Sparkles,
  Layers,
  Clock,
  Radio,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  useSEO({
    title: 'Terms of Service | BiodataCraft',
    description:
      'Terms and conditions governing the use of BiodataCraft. Understand service scope, user responsibilities, acceptable use, generated content ownership, intellectual property, and advertising policies.',
    canonicalPath: '/terms',
    breadcrumbs: [{ name: 'Terms of Service', path: '/terms' }]
  });

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ name: 'Terms of Service' }]} />

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs border border-amber-200">
            <FileText className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            User Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-cinzel">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Please review these terms governing your access to and use of BiodataCraft’s document formatting and generation tools.
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

        {/* Executive Summary Card */}
        <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-800/80 rounded-full text-amber-200 text-xs font-semibold tracking-wide">
              <Scale className="w-3.5 h-3.5" />
              Summary of Key Terms
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-200">
              Clear, Fair Terms for Every Indian Family
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-3xl">
              BiodataCraft is a <strong>100% free online document formatting tool</strong>. You retain full ownership of all personal data and matrimonial text you enter. We provide the visual designs and client-side PDF export technology, supported respectfully by non-intrusive Google AdSense advertising.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                <span className="block text-amber-300 font-bold">100% Free</span>
                <span className="text-stone-300 text-[11px]">No charges or paywalls</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                <span className="block text-amber-300 font-bold">Your Content</span>
                <span className="text-stone-300 text-[11px]">You own your personal text & photos</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                <span className="block text-amber-300 font-bold">Our Designs</span>
                <span className="text-stone-300 text-[11px]">Templates protected by copyright</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                <span className="block text-amber-300 font-bold">No Matchmaking</span>
                <span className="text-stone-300 text-[11px]">We format documents, not matches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Table of Contents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900">
            <a href="#acceptance" className="hover:underline hover:text-amber-700">1. Acceptance of Terms</a>
            <a href="#service-description" className="hover:underline hover:text-amber-700">2. Service Description & Scope</a>
            <a href="#user-responsibilities" className="hover:underline hover:text-amber-700">3. User Responsibilities & Data Accuracy</a>
            <a href="#acceptable-use" className="hover:underline hover:text-amber-700">4. Acceptable Use Policy</a>
            <a href="#generated-content" className="hover:underline hover:text-amber-700">5. Generated Content & Ownership</a>
            <a href="#intellectual-property" className="hover:underline hover:text-amber-700">6. Intellectual Property & Template License</a>
            <a href="#availability" className="hover:underline hover:text-amber-700">7. Service Availability & Maintenance</a>
            <a href="#limitations" className="hover:underline hover:text-amber-700">8. Disclaimers & Limitations of Liability</a>
            <a href="#advertising" className="hover:underline hover:text-amber-700">9. Advertising Architecture & Compliance</a>
            <a href="#third-party-services" className="hover:underline hover:text-amber-700">10. Third-Party Services & Links</a>
            <a href="#changes" className="hover:underline hover:text-amber-700">11. Modifications to Terms</a>
            <a href="#governing-law" className="hover:underline hover:text-amber-700">12. Governing Law & Jurisdiction</a>
            <a href="#contact" className="hover:underline hover:text-amber-700">13. Inquiries & Support</a>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card id="acceptance" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <CheckCircle2 className="w-5 h-5 text-amber-800 shrink-0" />
                <span>1. Acceptance of Terms</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                By visiting, accessing, browsing, or using <strong>BiodataCraft</strong> (<a href="https://biodata-craft.vercel.app" className="text-amber-800 underline">https://biodata-craft.vercel.app</a>), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                If you do not agree to these terms in their entirety, you must immediately discontinue your use of this service.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card id="service-description" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Sparkles className="w-5 h-5 text-amber-800 shrink-0" />
                <span>2. Service Description & Scope</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                BiodataCraft provides free, client-side web application software designed to help Indian individuals and families compose, format, preview, and download elegant marriage biodata documents in standard A4 PDF format.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong>Important Distinction:</strong> BiodataCraft is purely a document editing and formatting utility. We are <em>not</em> a matrimonial matchmaking agency, matrimonial bureau, dating service, or marriage broker. We do not verify prospective candidates, arrange introductions, or broker matrimonial alliances.
              </p>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card id="user-responsibilities" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Scale className="w-5 h-5 text-amber-800 shrink-0" />
                <span>3. User Responsibilities & Data Accuracy</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                When utilizing BiodataCraft to construct a marriage biodata, you represent and warrant that:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>
                  <strong>Truthfulness:</strong> All biographical, astrological, educational, professional, and familial details you input are truthful, accurate, and not misleading.
                </li>
                <li>
                  <strong>Consent:</strong> If you are generating a biodata on behalf of another individual (such as your son, daughter, sibling, or relative), you have received their explicit authorization and consent to input and format their personal details and photograph.
                </li>
                <li>
                  <strong>Local Backup:</strong> Because BiodataCraft does not store customer biodatas on servers, you are solely responsible for saving and maintaining backups of your downloaded PDF files.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card id="acceptable-use" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0" />
                <span>4. Acceptable Use Policy</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                You agree not to misuse or abuse the BiodataCraft platform. Prohibited activities include, but are not limited to:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>Using the builder to generate defamatory, obscene, pornographic, hateful, harassing, or unlawful content.</li>
                <li>Attempting to reverse engineer, decompile, or tamper with the client-side software or security controls.</li>
                <li>Employing automated spiders, bots, scrapers, or scripts to access or harvest site assets or mass-generate documents.</li>
                <li>Submitting fraudulent, malicious, or spam messages through our <Link to="/contact" className="text-amber-800 underline">/contact</Link> support desk.</li>
                <li>Interfering with, disabling, or burdening the platform infrastructure or networks through denial-of-service (DoS) attempts.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card id="generated-content" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <FileText className="w-5 h-5 text-amber-800 shrink-0" />
                <span>5. Generated Content & Ownership</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong>Your Ownership:</strong> You retain complete and exclusive ownership of all text, personal data, photographs, and family records that you input into the biodata builder. BiodataCraft claims zero ownership, title, or intellectual property rights over your personal matrimonial content.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                <strong>Distribution Responsibility:</strong> You assume sole and exclusive responsibility for how and with whom you share, transmit, email, message (e.g., via WhatsApp), or distribute your generated PDF document. BiodataCraft is not responsible for any subsequent disclosure, forwarding, or misuse of your biodata by third-party recipients.
              </p>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card id="intellectual-property" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Layers className="w-5 h-5 text-amber-800 shrink-0" />
                <span>6. Intellectual Property & Template License</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                All visual templates, border artwork, religious icons, vector flourishes, brand marks, typography stylings, and source code on BiodataCraft are the proprietary intellectual property of BiodataCraft and its licensors, protected by copyright and intellectual property laws.
              </p>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-1">
                <strong className="text-stone-900">Personal License Grant:</strong>
                <p>
                  Subject to these Terms, BiodataCraft grants you a worldwide, perpetual, non-exclusive, royalty-free license to use, reproduce, print, and transmit any PDF biodata document generated using our templates for personal, non-commercial matrimonial purposes.
                </p>
                <p className="text-xs text-stone-500 pt-1">
                  You may not extract, resell, sublicense, or redistribute our underlying template artwork, SVGs, or software code as part of a commercial template pack, competing generator, or software service without prior written consent.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card id="availability" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Clock className="w-5 h-5 text-amber-800 shrink-0" />
                <span>7. Service Availability & Maintenance</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                BiodataCraft is provided on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis. While we strive to maintain high availability and smooth operation, we do not guarantee uninterrupted, error-free, or immediate access at all times.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                We reserve the right to modify, update, enhance, temporarily suspend, or discontinue any feature, template, or aspect of the service for system updates, server maintenance, or architectural enhancements without prior liability.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card id="limitations" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0" />
                <span>8. Disclaimers & Limitations of Liability</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                To the maximum extent permitted under applicable law:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>
                  <strong>No Matchmaking Warranties:</strong> We make no representations or warranties regarding matrimonial outcomes, marital compatibility, horoscope match accuracy (Kundali Milan), or the veracity of candidates using our tools.
                </li>
                <li>
                  <strong>Device & Font Variation:</strong> Document visual output may vary slightly across different mobile devices, operating systems, and PDF reader engines. You should verify your PDF preview before printing or sharing.
                </li>
                <li>
                  <strong>Limitation of Liability:</strong> In no event shall BiodataCraft, its authors, or operators be liable for any indirect, incidental, special, consequential, or punitive damages arising from your access to, use of, or inability to use the service.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card id="advertising" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Radio className="w-5 h-5 text-amber-800 shrink-0" />
                <span>9. Advertising Architecture & Compliance</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                To provide free biodata formatting to all users without imposing fees, BiodataCraft displays advertisements served by Google AdSense and accredited advertising partners.
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>
                  Users agree not to artificially inflate impressions or clicks through automated bots, click fraud, or deceptive tactics.
                </li>
                <li>
                  Advertisements are delivered by Google’s ad serving platform. BiodataCraft does not endorse, verify, or guarantee the products, matrimonial services, or third-party offerings displayed within third-party advertisements.
                </li>
                <li>
                  Access to generated PDF files is never blocked or held hostage based on ad delivery or ad interactions.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card id="third-party-services" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <ExternalLink className="w-5 h-5 text-amber-800 shrink-0" />
                <span>10. Third-Party Services & External Links</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                Our application incorporates third-party utilities including Google Fonts and cloud hosting CDNs. If our website provides hyperlinks to external web pages (such as matrimonial advice blogs or cultural references), those external sites operate under their own independent terms and privacy policies.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                BiodataCraft exercises no editorial control over third-party websites and accepts no responsibility for their content or data handling practices.
              </p>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card id="changes" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Clock className="w-5 h-5 text-amber-800 shrink-0" />
                <span>11. Modifications to Terms</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                We reserve the right to revise these Terms of Service at any time. When modifications are made, the "Effective Date" at the top of this document will be revised accordingly. Your continued use of BiodataCraft following such updates constitutes your acceptance of the revised terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 12 */}
          <Card id="governing-law" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Scale className="w-5 h-5 text-amber-800 shrink-0" />
                <span>12. Governing Law & Jurisdiction</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                These Terms of Service and any non-contractual obligations arising out of or in connection with them shall be governed by, construed, and enforced in accordance with the laws of <strong>India</strong>, without giving effect to any principles of conflicts of law.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                Subject to any applicable statutory conciliation or consumer dispute resolution mechanisms under Indian law, you agree that the competent civil courts located in <strong>New Delhi, India</strong> shall have exclusive jurisdiction to hear, settle, and determine any dispute, proceeding, claim, or controversy arising under or relating to these Terms or the use of BiodataCraft.
              </p>
            </CardContent>
          </Card>

          {/* Section 13 */}
          <Card id="contact" className="scroll-mt-20 border-amber-200 bg-amber-50/40">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-amber-200/60 pb-3">
                <HelpCircle className="w-5 h-5 text-amber-800 shrink-0" />
                <span>13. Inquiries & Support</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                If you have questions, feedback, or require clarification regarding these Terms of Service, please reach out to our team:
              </p>
              <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-1.5">
                <p>
                  <strong>Platform:</strong> BiodataCraft (<a href="https://biodata-craft.vercel.app" className="text-amber-800 underline">https://biodata-craft.vercel.app</a>)
                </p>
                <p>
                  <strong>Contact Desk:</strong>{' '}
                  <a href="mailto:support@biodatacraft.in" className="text-amber-800 underline font-semibold">
                    support@biodatacraft.in
                  </a>
                </p>
                <p>
                  <strong>Online Support Form:</strong>{' '}
                  <Link to="/contact" className="text-amber-800 underline font-semibold">
                    /contact
                  </Link>
                </p>
              </div>

              {/* Legal Review Advisory Notice */}
              <div className="mt-4 p-3 bg-amber-100/70 border border-amber-200 rounded-xl text-xs text-amber-950 leading-relaxed">
                <strong>Legal Review Notice:</strong> While BiodataCraft provides this document to truthfully describe our software architecture and usage policies, users and commercial entities are advised that formal legal enforceability is subject to applicable statutory provisions. Statements herein should be reviewed by a qualified legal professional for jurisdiction-specific compliance.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
