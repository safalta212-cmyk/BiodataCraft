import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select, Checkbox } from '../../components/ui/Form';
import { adminService, SiteSettings } from '../../services/adminService';
import { isConfigured as isFirebaseConfigured } from '../../config/firebase';
import { useToast } from '../../context/ToastContext';
import {
  Settings,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  Share2,
  BarChart3,
  DollarSign,
  Save,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  Lock,
  Layers,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [settings, setSettings] = useState<SiteSettings>(() => adminService.getSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSocialChange = (network: keyof SiteSettings['socialLinks'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value
      }
    }));
  };

  const handleAnalyticsChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      analyticsConfig: {
        ...prev.analyticsConfig,
        [field]: value
      }
    }));
  };

  const handleAdChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      adConfig: {
        ...prev.adConfig,
        [field]: value
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityNotice(null);

    const token = sessionStorage.getItem('biodatacraft_admin_token');
    if (!token) {
      toast.error('Session expired or unauthorized. Please log in as admin.');
      navigate('/admin/login');
      return;
    }

    // Validate
    const validation = adminService.validateSettings(settings);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      if (validation.errors.security) {
        setSecurityNotice(validation.errors.security);
      }
      toast.error('Validation failed. Please review the highlighted fields.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const result = adminService.updateSettings(settings);
      setIsSaving(false);

      if (result.success) {
        setValidationErrors({});
        toast.success('Site settings and platform parameters updated successfully.');
      } else {
        if (result.errors?.security) {
          setSecurityNotice(result.errors.security);
        }
        toast.error('Failed to save settings.');
      }
    }, 350);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Top Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
              Phase 12 Configuration
            </span>
            <span className="text-xs text-stone-400">• Global Parameters & Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
            Site Settings & SEO Configuration
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Configure site metadata, brand assets, contact channels, public SEO tags, analytics, and AdSense.
          </p>
        </div>

        {/* Security Alert if private key detected */}
        {securityNotice && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block">Security Warning</span>
              <p className="text-xs text-red-900/90 mt-0.5 leading-relaxed">{securityNotice}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. General Branding & Assets */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel">1. Brand Identity & Assets</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Public application name, logos, and browser favicon icons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  error={validationErrors.siteName}
                  placeholder="e.g. BiodataCraft"
                  required
                />

                <Input
                  label="Logo Image URL / Path"
                  value={settings.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  placeholder="/favicon.svg"
                  hint="Header brand logo path"
                />

                <Input
                  label="Favicon Image URL / Path"
                  value={settings.favicon}
                  onChange={(e) => handleInputChange('favicon', e.target.value)}
                  placeholder="/favicon.svg"
                  hint="Browser tab favicon icon"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Contact Details */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel">2. Contact & Customer Support</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Official support channels displayed in the footer and contact page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  error={validationErrors.contactEmail}
                  placeholder="contact@biodatacraft.in"
                  hint="Displayed to visitors for matrimonial support inquiries"
                  required
                />

                <Input
                  label="Contact Phone / WhatsApp Helpline"
                  value={settings.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  error={validationErrors.contactPhone}
                  placeholder="+91 98765 43210"
                  hint="Indian phone format (+91 XXXXX XXXXX)"
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. Social Media Links */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel">3. Social Media Channels</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Links to official community and family matrimonial guidance channels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="WhatsApp Direct Link / Phone"
                  value={settings.socialLinks.whatsapp || ''}
                  onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                  placeholder="https://wa.me/919876543210"
                />

                <Input
                  label="Facebook Community Page"
                  value={settings.socialLinks.facebook || ''}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/biodatacraft"
                />

                <Input
                  label="Instagram Profile"
                  value={settings.socialLinks.instagram || ''}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/biodatacraft"
                />

                <Input
                  label="Twitter / X Profile"
                  value={settings.socialLinks.twitter || ''}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://x.com/biodatacraft"
                />

                <Input
                  label="YouTube Channel"
                  value={settings.socialLinks.youtube || ''}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@biodatacraft"
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. Default Search Engine Optimization (SEO) & Verification */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel">4. Default Search Engine Optimization (SEO)</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Site-wide default meta tags, Google Search Console tokens, and sharing cards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <Input
                label="Default SEO Title Tag"
                value={settings.defaultSeoTitle}
                onChange={(e) => handleInputChange('defaultSeoTitle', e.target.value)}
                error={validationErrors.defaultSeoTitle}
                hint={`${settings.defaultSeoTitle.length}/70 characters (50-60 characters recommended)`}
                required
              />

              <Textarea
                label="Default SEO Meta Description"
                value={settings.defaultSeoDescription}
                onChange={(e) => handleInputChange('defaultSeoDescription', e.target.value)}
                error={validationErrors.defaultSeoDescription}
                rows={3}
                hint={`${settings.defaultSeoDescription.length}/160 characters (120-160 characters recommended)`}
                required
              />

              <Input
                label="Google Search Console Verification Token / Tag"
                value={settings.googleVerification}
                onChange={(e) => handleInputChange('googleVerification', e.target.value)}
                placeholder="e.g. google-site-verification-bdc-matrimonial-2026"
                hint="Used to verify site ownership in Google Search Console"
              />
            </CardContent>
          </Card>

          {/* 5. Privacy-Conscious Analytics Configuration */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel">5. Privacy-Conscious Analytics Configuration</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Anonymous telemetry aggregation parameters. Strictly zero customer PII collection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Rule:</strong> BiodataCraft collects strictly aggregated counters (page views, template selections, browser engine types). No candidate names, phone numbers, or private biodatas are ever transmitted to analytics tools.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <Checkbox
                  label="Enable Anonymous Telemetry"
                  sublabel="Aggregate anonymous daily metrics in the Admin Dashboard"
                  checked={settings.analyticsConfig.enabled}
                  onChange={(e) => handleAnalyticsChange('enabled', e.target.checked)}
                />

                <Input
                  label="Google Analytics Measurement Tag (Public Client Tag Only)"
                  value={settings.analyticsConfig.customMeasurementId || ''}
                  onChange={(e) => handleAnalyticsChange('customMeasurementId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  hint="Public client tag format. NEVER enter secret API keys!"
                />
              </div>
            </CardContent>
          </Card>

          {/* 6. Advertising & Monetization */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-800" />
                  <CardTitle className="text-base font-cinzel">6. Google AdSense & Monetization Architecture</CardTitle>
                </div>
                <Link
                  to="/admin/ads"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                >
                  <span>Open Full Ads Studio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
              <CardDescription className="text-xs">
                Configure compliant advertising slots, download tiers, and blog monetization without code or environment edits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Checkbox
                  label="Enable Ad Units"
                  sublabel="Display subtle, non-intrusive banner slots compliant with AdSense policies"
                  checked={settings.adConfig.adsEnabled}
                  onChange={(e) => handleAdChange('adsEnabled', e.target.checked)}
                />

                <Select
                  label="Monetization Experience Level"
                  value={settings.adConfig.monetizationLevel}
                  onChange={(e) => handleAdChange('monetizationLevel', e.target.value as any)}
                  options={[
                    { value: 'standard', label: 'Standard (Clean header & footer banners)' },
                    { value: 'template', label: 'Template (Cultural sponsored cards)' },
                    { value: 'advanced', label: 'Advanced (Adaptive responsive slots)' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Google AdSense Publisher Client ID"
                  value={settings.adConfig.adClient}
                  onChange={(e) => handleAdChange('adClient', e.target.value)}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  hint="Public publisher ID (never private tokens)"
                />

                <Input
                  label="Download Ad Slot ID"
                  value={settings.adConfig.adSlotDownload || ''}
                  onChange={(e) => handleAdChange('adSlotDownload', e.target.value)}
                  placeholder="4738291029"
                  hint="Interstitial unit inside download dialog"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Header Ad Slot ID"
                  value={settings.adConfig.adSlotHeader || ''}
                  onChange={(e) => handleAdChange('adSlotHeader', e.target.value)}
                  placeholder="1092837465"
                />

                <Input
                  label="Footer Ad Slot ID"
                  value={settings.adConfig.adSlotFooter || ''}
                  onChange={(e) => handleAdChange('adSlotFooter', e.target.value)}
                  placeholder="5647382910"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span>Looking for Blog Ad Placements (Top, Middle, Bottom)?</span>
                <Link to="/admin/ads" className="text-amber-800 font-bold hover:underline">
                  Configure in Ads & Monetization →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 7. Footer Copy & Announcements */}
          <Card className="border-stone-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-800" />
                <CardTitle className="text-base font-cinzel">7. Footer Copyright & Announcements</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Copyright notices, legal attribution, and top site announcement strip.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <Textarea
                label="Footer Copyright Text"
                value={settings.footerText}
                onChange={(e) => handleInputChange('footerText', e.target.value)}
                rows={2}
                placeholder="© 2026 BiodataCraft. All Rights Reserved."
              />

              <div className="pt-2 border-t border-stone-100 space-y-3">
                <Checkbox
                  label="Display Auspicious Header Announcement Banner"
                  sublabel="Displays a golden notice strip above the main navigation"
                  checked={settings.announcementActive}
                  onChange={(e) => handleInputChange('announcementActive', e.target.checked)}
                />

                {settings.announcementActive && (
                  <Input
                    label="Announcement Notice Text"
                    value={settings.announcementText}
                    onChange={(e) => handleInputChange('announcementText', e.target.value)}
                    placeholder="✨ New Festival Special Templates Added! 100% Free Forever with Zero Registration."
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Critical Security Protection Notice Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
            <Lock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Strict Security Policy Enforced:</span>
              <p className="mt-0.5 text-amber-900/80 leading-relaxed">
                Public settings are delivered to client browsers. Never input server-side secret API keys (e.g. Firebase Admin service account keys, private database passwords, or secret authorization tokens). Public identifiers such as AdSense Publisher ID and Google Analytics client tags are safe and permitted.
              </p>
            </div>
          </div>

          {/* Save Action Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              className="px-8 shadow-sm"
            >
              Save Site Settings
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
