import React, { useState } from 'react';
import { useSEO } from '../hooks/useSEO';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input, Textarea, Select } from '../components/ui/Form';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { contactService } from '../services/contactService';
import { adminService, SiteSettings } from '../services/adminService';
import {
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SUBJECT_OPTIONS = [
  { value: 'General Feedback', label: 'General Feedback' },
  { value: 'New Template Suggestion', label: 'New Template Suggestion' },
  { value: 'Regional Community Request', label: 'Regional Community Request' },
  { value: 'Bug Report / PDF Issue', label: 'Bug Report / PDF Issue' },
  { value: 'Partnership / Collaboration', label: 'Partnership / Collaboration' }
];

export const ContactPage: React.FC = () => {
  const [settings] = useState<SiteSettings>(() => adminService.getSettings());
  useSEO({
    title: `Contact Support & Feedback | ${settings.siteName || 'BiodataCraft'}`,
    description:
      `Get in touch with the ${settings.siteName || 'BiodataCraft'} team for feedback, template suggestions, or support inquiries.`,
    canonicalPath: '/contact',
    breadcrumbs: [{ name: 'Contact Us', path: '/contact' }]
  });

  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback');
  const [message, setMessage] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      const result = await contactService.submitMessage({
        name,
        email,
        subject,
        message
      });

      if (result.success) {
        setSubmitted(true);
        toast.success(
          'Thank you! Your message has been received. Our team will review your inquiry.',
          'Message Sent'
        );
        setName('');
        setEmail('');
        setSubject('General Feedback');
        setMessage('');
      } else {
        if (result.validationErrors) {
          setFieldErrors(result.validationErrors as Record<string, string>);
        }
        toast.error(result.error || 'Please correct the highlighted errors before submitting.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred while sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <Breadcrumbs items={[{ name: 'Contact Us' }]} />

        {/* Page Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
            Support & Community
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-cinzel">
            Contact BiodataCraft
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Have questions about templates, regional Indian formats, or wish to suggest new features? We are here to assist.
          </p>
        </div>

        {/* Critical Privacy Callout Notice: Never store biodatas through contact form */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 flex items-start gap-3 text-xs text-amber-950">
          <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Strict Privacy Protection Notice:</span>
            <p className="text-amber-900/90 leading-relaxed">
              This contact form is strictly for customer support, bug reports, and feedback.
              <strong> Please do not submit family biodatas, horoscopes, or matrimonial profiles here.</strong> To create and download your biodata securely with zero server storage, please use our{' '}
              <Link to="/create" className="font-bold underline text-amber-950 hover:text-amber-800">
                Free Biodata Maker
              </Link>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details Column */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-stone-900">Email Address</h3>
                    <p className="text-xs text-stone-600 mt-0.5">{settings.contactEmail || 'contact@biodatacraft.in'}</p>
                  </div>
                </div>

                {settings.contactPhone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-stone-900">Phone / WhatsApp</h3>
                      <p className="text-xs text-stone-600 mt-0.5">{settings.contactPhone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-stone-900">Response Time</h3>
                    <p className="text-xs text-stone-600 mt-0.5">Usually within 24-48 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-stone-900">Zero Cloud Biodata</h3>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                      We never store, sell, or collect personal matrimonial biodatas on our servers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-5 bg-stone-100 rounded-2xl text-xs text-stone-600 space-y-2">
              <h4 className="font-bold text-stone-800">Frequently Asked Questions</h4>
              <p>Looking for quick printing or photo cropping instructions?</p>
              <Link to="/faq" className="text-amber-800 font-bold hover:underline block pt-1">
                Read FAQ Guide →
              </Link>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Share your thoughts, suggestions, or technical questions with our team.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {submitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-stone-900 font-cinzel">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting BiodataCraft. Your message has been logged securely and our team will get back to you shortly.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="mt-3"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {fieldErrors.biodataDetected && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>{fieldErrors.biodataDetected}</div>
                      </div>
                    )}

                    {/* Field 1: Name */}
                    <div>
                      <Input
                        label="Your Name *"
                        placeholder="e.g. Rajesh Kumar"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
                        }}
                        error={fieldErrors.name}
                      />
                    </div>

                    {/* Field 2: Email */}
                    <div>
                      <Input
                        label="Your Email Address *"
                        type="email"
                        placeholder="e.g. rajesh.kumar@example.com"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
                        }}
                        error={fieldErrors.email}
                      />
                    </div>

                    {/* Field 3: Subject */}
                    <div>
                      <Select
                        label="Subject / Topic *"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value);
                          if (fieldErrors.subject) setFieldErrors({ ...fieldErrors, subject: '' });
                        }}
                        options={SUBJECT_OPTIONS}
                        error={fieldErrors.subject}
                      />
                    </div>

                    {/* Field 4: Message */}
                    <div>
                      <Textarea
                        label="Message / Inquiry *"
                        placeholder="Type your message, feedback, or suggestion here..."
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: '' });
                        }}
                        error={fieldErrors.message}
                        hint={`${message.length}/3000 characters`}
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={isSubmitting}
                        className="w-full sm:w-auto"
                        rightIcon={<Send className="w-4 h-4" />}
                      >
                        Submit Message
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
