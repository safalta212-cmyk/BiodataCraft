import React from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card, CardContent } from '../components/ui/Card';
import {
  ShieldCheck,
  Lock,
  Database,
  ServerOff,
  EyeOff,
  Cookie,
  Radio,
  FileCheck,
  Mail,
  UserCheck,
  AlertTriangle,
  Clock,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
  useSEO({
    title: 'Privacy Policy & Zero-Storage Commitment | BiodataCraft',
    description:
      'Detailed privacy policy for BiodataCraft. Learn how our client-side architecture keeps matrimonial biodatas private, zero-server storage, cookies, AdSense advertising, and contact message handling.',
    canonicalPath: '/privacy-policy',
    breadcrumbs: [{ name: 'Privacy Policy', path: '/privacy-policy' }]
  });

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ name: 'Privacy Policy' }]} />

        {/* Hero Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs border border-emerald-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Privacy-First Architecture
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-cinzel">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Transparent disclosure regarding client-side biodata processing, zero-storage commitment, web analytics, advertising cookies, and contact message management.
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
        <div className="bg-gradient-to-br from-emerald-900 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 rounded-full text-emerald-200 text-xs font-semibold tracking-wide">
              <Lock className="w-3.5 h-3.5" />
              The BiodataCraft Privacy Guarantee
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-amber-200">
              Your Matrimonial Biodata Never Leaves Your Browser
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-3xl">
              Unlike traditional matrimonial websites, <strong>BiodataCraft requires NO user account, login, or phone registration</strong>. All names, gotra, kundali charts, horoscopes, family backgrounds, and photographs are processed <strong>strictly client-side within your browser memory</strong>. We do not maintain any database of customer biodatas.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                <span className="block text-emerald-300 font-bold">No Account</span>
                <span className="text-stone-300 text-[11px]">No login, password, or OTP required</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                <span className="block text-emerald-300 font-bold">Zero DB Storage</span>
                <span className="text-stone-300 text-[11px]">No biodatas stored on remote servers</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                <span className="block text-emerald-300 font-bold">Local Rendering</span>
                <span className="text-stone-300 text-[11px]">PDF synthesized directly on device</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs border border-white/10">
                <span className="block text-emerald-300 font-bold">Full Control</span>
                <span className="text-stone-300 text-[11px]">Wipe browser memory anytime</span>
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
            <a href="#no-customer-login" className="hover:underline hover:text-amber-700">1. No Customer Login or Account Creation</a>
            <a href="#biodata-processing" className="hover:underline hover:text-amber-700">2. Biodata Processing & Client-Side Generation</a>
            <a href="#storage-policy" className="hover:underline hover:text-amber-700">3. Non-Storage of Matrimonial Records</a>
            <a href="#analytics" className="hover:underline hover:text-amber-700">4. Aggregated Technical Analytics</a>
            <a href="#cookies" className="hover:underline hover:text-amber-700">5. Cookies & Local Storage Usage</a>
            <a href="#advertising" className="hover:underline hover:text-amber-700">6. Google AdSense & Third-Party Advertising</a>
            <a href="#third-party-services" className="hover:underline hover:text-amber-700">7. Third-Party Services & Infrastructure</a>
            <a href="#contact-messages" className="hover:underline hover:text-amber-700">8. Support Inquiries & Contact Form Data</a>
            <a href="#data-retention" className="hover:underline hover:text-amber-700">9. Data Retention Timelines</a>
            <a href="#security" className="hover:underline hover:text-amber-700">10. Data Security Measures</a>
            <a href="#user-rights" className="hover:underline hover:text-amber-700">11. User Rights & Data Deletion Requests</a>
            <a href="#childrens-policy" className="hover:underline hover:text-amber-700">12. Children's Policy</a>
            <a href="#policy-changes" className="hover:underline hover:text-amber-700">13. Modifications to this Privacy Policy</a>
            <a href="#contact-us" className="hover:underline hover:text-amber-700">14. Contacting Our Privacy Desk</a>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card id="no-customer-login" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <UserCheck className="w-5 h-5 text-amber-800 shrink-0" />
                <span>1. No Customer Login or Account Creation</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                BiodataCraft does not operate any customer registration or user login system. Visitors do not need to provide an email address, verify a phone number via SMS/OTP, or create a password to access any template or feature of our service.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                By eliminating customer accounts, we ensure that no central user profile, identity graph, or database linking your personal identity to matrimonial details can ever exist on our systems. (Note: Our platform maintains an isolated administrative gateway accessible solely to authorized website operators for managing template catalog assets and settings; no customer accounts exist or can be registered).
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card id="biodata-processing" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <ServerOff className="w-5 h-5 text-amber-800 shrink-0" />
                <span>2. Biodata Processing & Client-Side Generation</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                BiodataCraft operates on an <strong>in-browser, client-side execution model</strong>. When you enter personal details into the biodata builder—including candidate full name, date and time of birth, gotra, rashi, nakshatra, educational degrees, profession, income brackets, paternal family background, and maternal uncle (mama) details:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>
                  <strong>Client-Side Memory:</strong> All data manipulation occurs inside your web browser’s JavaScript execution environment.
                </li>
                <li>
                  <strong>Local Photo Handling:</strong> Any candidate photograph you select is converted to a base64 Data URL locally in your browser memory. Photographs are never uploaded to remote cloud buckets, external servers, or media repositories.
                </li>
                <li>
                  <strong>In-Browser PDF Synthesis:</strong> Vector and raster document assembly, typographic kerning, and A4 page layout calculation are performed exclusively within your browser using client-side JavaScript libraries (HTML5 Canvas and jsPDF). The resulting PDF document downloads directly from your browser to your local device storage.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card id="storage-policy" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Database className="w-5 h-5 text-amber-800 shrink-0" />
                <span>3. Non-Storage of Matrimonial Records</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                We make an explicit, binding technical guarantee: <strong>BiodataCraft does not store, retain, inspect, monetize, or sell customer matrimonial biodatas</strong>.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                Our cloud infrastructure does not contain any database collections, tables, or storage volumes allocated for customer biodatas. Furthermore, our Firebase Firestore security rules explicitly forbid write and read operations to biodata collections (<code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded text-amber-900">allow read, write: if false;</code> for biodata paths).
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                If you choose to use the optional browser persistence feature, your working draft is saved only inside your browser’s own HTML5 <code className="text-xs bg-stone-100 px-1.5 py-0.5 rounded text-amber-900">localStorage</code> on your physical device. You can immediately wipe this draft at any time by clicking "Clear Form" or by clearing your browser cache.
              </p>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card id="analytics" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Radio className="w-5 h-5 text-amber-800 shrink-0" />
                <span>4. Aggregated Technical Analytics</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                To maintain uptime, monitor page speed, optimize mobile layout rendering, and determine popular templates, we may collect aggregated, non-personally identifiable technical telemetry.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                These metrics may include:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1 leading-relaxed">
                <li>Template popularity counters (e.g., aggregate count of times the "Royal Mandap" template was selected).</li>
                <li>Device category (e.g., mobile, tablet, desktop) and viewport dimensions to refine PDF readability.</li>
                <li>Referring URLs, coarse geographic regions (country/state level), and browser versions for compatibility testing.</li>
                <li>Anonymized HTTP log metadata (IP addresses are anonymized and not cross-referenced with any user identity).</li>
              </ul>
              <p className="text-sm text-stone-700 leading-relaxed font-semibold text-stone-800">
                We never log, track, or associate any names, phone numbers, gotras, horoscopes, or matrimonial details with technical analytics events.
              </p>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card id="cookies" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Cookie className="w-5 h-5 text-amber-800 shrink-0" />
                <span>5. Cookies & Local Storage Usage</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                Like most modern web applications, BiodataCraft and its third-party service partners utilize cookies and HTML5 local storage:
              </p>
              <div className="space-y-2 text-sm text-stone-700">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">A. Essential & Functional Local Storage:</strong>
                  <span className="text-xs text-stone-600 block mt-0.5">
                    Stores your active language preference (English/Hindi) and your optional local biodata draft so you do not lose progress if your browser refreshes. Stored strictly on your device.
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">B. Advertising Cookies (Google AdSense):</strong>
                  <span className="text-xs text-stone-600 block mt-0.5">
                    Google and third-party advertising partners use cookies to serve ads based on your prior visits to this website or other websites on the internet.
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-stone-900 block font-semibold">C. Managing & Disabling Cookies:</strong>
                  <span className="text-xs text-stone-600 block mt-0.5">
                    You can instruct your web browser to refuse cookies or alert you when cookies are sent. Note that core biodata generation will continue to work normally even if non-essential cookies are disabled.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card id="advertising" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <EyeOff className="w-5 h-5 text-amber-800 shrink-0" />
                <span>6. Google AdSense & Third-Party Advertising</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                To keep BiodataCraft completely free for all Indian families without paywalls or subscription fees, we display advertisements managed by Google AdSense and qualified advertising networks.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                In compliance with Google AdSense terms and international advertising standards:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other sites.
                </li>
                <li>
                  Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 underline font-semibold"
                  >
                    Google Ads Settings
                  </a>{' '}
                  or by visiting{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 underline font-semibold"
                  >
                    www.aboutads.info
                  </a>.
                </li>
                <li>
                  <strong>Ad Integrity Pledge:</strong> BiodataCraft strictly forbids deceptive ad placements, never labels ads as "Download" or "Proceed" buttons, and ensures advertisements are visibly marked with "Advertisement" or "Sponsored" labels.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card id="third-party-services" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <FileCheck className="w-5 h-5 text-amber-800 shrink-0" />
                <span>7. Third-Party Services & Infrastructure</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                Our website utilizes select trusted third-party technology providers for delivery, styling, and operational support:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>
                  <strong>Google Fonts:</strong> Web typography (such as Cinzel, Rozha One, Noto Sans Devanagari) is delivered via Google Fonts CDN. Google’s privacy policy governs font delivery caching.
                </li>
                <li>
                  <strong>Google AdSense:</strong> Advertising network infrastructure as described in Section 6.
                </li>
                <li>
                  <strong>Firebase / Google Cloud Firestore:</strong> Used solely for storing administrative site configuration and support contact messages submitted via <code className="text-xs bg-stone-100 px-1 py-0.5 rounded text-amber-900">/contact</code>. Strictly isolated from the biodata builder.
                </li>
                <li>
                  <strong>Unsplash & Visual Assets:</strong> Sample template preview thumbnails may use licensed photographs hosted via CDN.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card id="contact-messages" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Mail className="w-5 h-5 text-amber-800 shrink-0" />
                <span>8. Support Inquiries & Contact Form Data</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                When you voluntarily choose to contact our team via the{' '}
                <Link to="/contact" className="text-amber-800 underline font-semibold">
                  Contact Support Page (/contact)
                </Link>
                , we collect the information you submit:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>Your full name (2–100 characters)</li>
                <li>Your email address (to reply to your inquiry)</li>
                <li>Subject line category</li>
                <li>Your message text</li>
              </ul>
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <strong>Anti-Biodata Guard on Contact Forms:</strong>
                <p>
                  Our contact form is strictly dedicated to technical assistance, feature suggestions, and general feedback. We actively employ automated screening and server rules that reject messages containing pasted matrimonial biodatas or horoscope details, ensuring that sensitive family details are not inadvertently submitted to contact records.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card id="data-retention" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Clock className="w-5 h-5 text-amber-800 shrink-0" />
                <span>9. Data Retention Timelines</span>
              </div>
              <div className="space-y-2 text-sm text-stone-700">
                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-24 shrink-0 font-bold text-stone-900 text-xs uppercase tracking-wider">
                    Matrimonial Biodatas
                  </div>
                  <div className="text-xs text-stone-600">
                    <strong>Zero Seconds (Server):</strong> Biodata details are retained for exactly zero seconds on our servers because they are never sent to our servers. Local browser memory persists only until you clear the form or close your browser tab.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-24 shrink-0 font-bold text-stone-900 text-xs uppercase tracking-wider">
                    Contact Messages
                  </div>
                  <div className="text-xs text-stone-600">
                    <strong>Up to 12 Months:</strong> Messages submitted via the contact form are retained for up to 12 months solely to resolve support requests and improve services, or until a deletion request is received.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="w-24 shrink-0 font-bold text-stone-900 text-xs uppercase tracking-wider">
                    Technical Server Logs
                  </div>
                  <div className="text-xs text-stone-600">
                    <strong>30 to 90 Days:</strong> Standard web server traffic logs are automatically rotated and purged after 30 to 90 days.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card id="security" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <Lock className="w-5 h-5 text-amber-800 shrink-0" />
                <span>10. Data Security Measures</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                We implement robust technical and architectural safeguards to protect your experience:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>
                  <strong>Mandatory TLS/HTTPS:</strong> All web traffic is strictly encrypted in transit using industry-standard modern TLS encryption.
                </li>
                <li>
                  <strong>Firestore Security Rules:</strong> Administrative collections are locked behind role-based authentication rules. Public writes to biodata paths are permanently disabled.
                </li>
                <li>
                  <strong>Sanitization & XSS Protection:</strong> User inputs are sanitized to prevent cross-site scripting (XSS) and injection vulnerabilities during in-browser preview rendering.
                </li>
                <li>
                  <strong>Sandboxed Execution:</strong> Vector PDF generation takes place inside an isolated browser canvas sandbox.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card id="user-rights" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0" />
                <span>11. User Rights & Data Deletion Requests</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                Under modern data protection standards (including India's Digital Personal Data Protection Act and global privacy frameworks), you have the right to know what personal information is held about you and request its erasure:
              </p>
              <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1.5 leading-relaxed">
                <li>
                  <strong>Matrimonial Biodata:</strong> Because your biodata is never stored on our servers, there is nothing on our servers for us to delete. You can instantly delete your in-browser draft at any time by pressing "Clear Form" in the builder.
                </li>
                <li>
                  <strong>Support Inquiries:</strong> If you previously submitted an inquiry through our <Link to="/contact" className="text-amber-800 underline">/contact</Link> form and wish to have your message, name, and email permanently erased from our support archive, you may submit a deletion request.
                </li>
                <li>
                  <strong>Submitting a Deletion Request:</strong> Send an email to{' '}
                  <a href="mailto:privacy@biodatacraft.in" className="text-amber-800 underline font-semibold">
                    privacy@biodatacraft.in
                  </a>{' '}
                  or submit a ticket via our{' '}
                  <Link to="/contact" className="text-amber-800 underline font-semibold">
                    Contact Form
                  </Link>{' '}
                  specifying the email address you used. Deletion requests are processed within 15 business days.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 12 */}
          <Card id="childrens-policy" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0" />
                <span>12. Children's Policy</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                BiodataCraft is designed exclusively for prospective matrimonial introductions by adults who have reached the legal age of marriage under applicable law (at least 18 years of age in India), or by parents, guardians, and family members acting with the consent of eligible adult candidates.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                We do not knowingly collect, request, or solicit personal data from children under the age of 18. If you believe that a minor has provided personal details through our contact form, please notify us immediately at{' '}
                <a href="mailto:privacy@biodatacraft.in" className="text-amber-800 underline font-semibold">
                  privacy@biodatacraft.in
                </a>
                , and we will promptly delete such records.
              </p>
            </CardContent>
          </Card>

          {/* Section 13 */}
          <Card id="policy-changes" className="scroll-mt-20">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-stone-100 pb-3">
                <FileCheck className="w-5 h-5 text-amber-800 shrink-0" />
                <span>13. Modifications to this Privacy Policy</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                We may periodically update this Privacy Policy to reflect technical modifications to our browser engine, adjustments in advertising network requirements, or changes in regulatory legal standards.
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                When updates occur, the "Effective Date" at the top of this document will be revised accordingly. We encourage users to periodically review this page. Continued use of BiodataCraft following the posting of revisions constitutes your acknowledgment of the updated terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 14 */}
          <Card id="contact-us" className="scroll-mt-20 border-amber-200 bg-amber-50/40">
            <CardContent className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-stone-900 font-cinzel font-bold text-lg sm:text-xl border-b border-amber-200/60 pb-3">
                <HelpCircle className="w-5 h-5 text-amber-800 shrink-0" />
                <span>14. Contacting Our Privacy Desk</span>
              </div>
              <p className="text-sm text-stone-700 leading-relaxed">
                If you have questions, feedback, or concerns regarding our zero-storage technical architecture, advertising policy, or personal data deletion:
              </p>
              <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-1.5">
                <p>
                  <strong>Platform:</strong> BiodataCraft (<a href="https://biodatacraft.in" className="text-amber-800 underline">https://biodatacraft.in</a>)
                </p>
                <p>
                  <strong>Privacy Desk Email:</strong>{' '}
                  <a href="mailto:privacy@biodatacraft.in" className="text-amber-800 underline font-semibold">
                    privacy@biodatacraft.in
                  </a>
                </p>
                <p>
                  <strong>Web Contact Form:</strong>{' '}
                  <Link to="/contact" className="text-amber-800 underline font-semibold">
                    /contact
                  </Link>
                </p>
                <p className="text-stone-500 text-xs pt-1">
                  We endeavor to respond to all legitimate privacy inquiries within 48 to 72 business hours.
                </p>
              </div>

              {/* Legal Review Advisory Notice */}
              <div className="mt-4 p-3 bg-emerald-100/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed">
                <strong>Legal Review Advisory:</strong> This Privacy Policy accurately describes the technical implementation of BiodataCraft (in-browser execution, zero server-side customer biodata storage, local base64 photo processing, and aggregated analytics). To ensure strict adherence to evolving data protection frameworks (such as India's Digital Personal Data Protection Act, 2023), these provisions should be formally reviewed by a qualified legal professional.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
