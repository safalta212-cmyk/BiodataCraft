import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Checkbox } from '../../components/ui/Form';
import { useToast } from '../../context/ToastContext';
import { adSettingsService } from '../../services/adSettingsService';
import { adminService } from '../../services/adminService';
import { AdSettings } from '../../types/monetization';
import {
  DollarSign,
  Save,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  BookOpen,
  Download,
  Layout,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const AdminAdsPage: React.FC = () => {
  const toast = useToast();
  const [settings, setSettings] = useState<AdSettings>(() => adSettingsService.getSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load existing settings on mount
  useEffect(() => {
    let isMounted = true;
    adSettingsService.fetchSettings(true).then((data) => {
      if (isMounted) {
        setSettings(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field: keyof AdSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
    setValidationError(null);
  };

  const handleReset = () => {
    const current = adSettingsService.getSettings();
    setSettings(current);
    setValidationError(null);
    toast.info('Ad configuration reset to current saved values.');
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    // Validate AdSense Client ID format if filled
    const clientId = settings.adsenseClientId.trim();
    if (clientId && !/^ca-pub-\d{10,24}$/i.test(clientId)) {
      setValidationError('Invalid AdSense Client ID format. Must begin with "ca-pub-" followed by digits (e.g. ca-pub-1234567890123456).');
      toast.error('Validation failed. Check your AdSense Publisher ID.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await adSettingsService.updateSettings(settings);

      // Also sync site settings object so all admin views match
      const currentSiteSettings = adminService.getSettings();
      adminService.updateSettings({
        adConfig: {
          ...currentSiteSettings.adConfig,
          adsEnabled: settings.adsEnabled,
          adClient: settings.adsenseClientId,
          adSlotHeader: settings.adsenseSlotHeader,
          adSlotFooter: settings.adsenseSlotFooter,
          adSlotDownload: settings.adsenseSlotDownload,
          blogAdsEnabled: settings.blogAdsEnabled,
          adSlotBlogTop: settings.adsenseSlotBlogTop,
          adSlotBlogMiddle: settings.adsenseSlotBlogMiddle,
          adSlotBlogBottom: settings.adsenseSlotBlogBottom
        }
      });

      setIsSaving(false);
      if (result.success) {
        toast.success('Ad settings updated successfully.');
      } else {
        setValidationError(result.error || 'Failed to update ad settings.');
        toast.error(result.error || 'Failed to update ad settings.');
      }
    } catch (err: any) {
      setIsSaving(false);
      setValidationError(err?.message || 'Unexpected error while saving ad settings.');
      toast.error('Failed to update ad settings.');
    }
  };

  // Status checks for Admin Preview / Status (Requirement 19)
  const isClientConfigured = Boolean(settings.adsenseClientId && settings.adsenseClientId.startsWith('ca-pub-'));
  const isHeaderConfigured = Boolean(settings.adsenseSlotHeader && settings.adsenseSlotHeader.trim());
  const isFooterConfigured = Boolean(settings.adsenseSlotFooter && settings.adsenseSlotFooter.trim());
  const isDownloadConfigured = Boolean(settings.adsenseSlotDownload && settings.adsenseSlotDownload.trim());
  const isBlogTopConfigured = Boolean(settings.adsenseSlotBlogTop && settings.adsenseSlotBlogTop.trim());
  const isBlogMiddleConfigured = Boolean(settings.adsenseSlotBlogMiddle && settings.adsenseSlotBlogMiddle.trim());
  const isBlogBottomConfigured = Boolean(settings.adsenseSlotBlogBottom && settings.adsenseSlotBlogBottom.trim());

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6 max-w-5xl pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                Monetization Control
              </span>
              <span className="text-xs text-stone-400">• Firestore-Backed Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-cinzel">
              Ads & Monetization Management
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Manage Google AdSense publisher credentials, layout ad slots, download tiers, and editorial blog monetization without editing code or environment variables.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Validation or Error Message */}
        {validationError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide text-red-800">Configuration Notice</h4>
              <p className="text-xs text-red-700 mt-0.5">{validationError}</p>
            </div>
          </div>
        )}

        {/* System Status Dashboard Card (Requirement 19) */}
        <Card className="border-stone-200 shadow-xs bg-stone-50/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <CardTitle className="text-sm font-cinzel">Ad Placement & Status Overview</CardTitle>
              </div>
              <span className="text-[11px] font-mono text-stone-500">Live Evaluation</span>
            </div>
            <CardDescription className="text-xs">
              Real-time evaluation of configured placements across public application entry points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">Ad System</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${settings.adsEnabled ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className={settings.adsEnabled ? 'text-emerald-700' : 'text-stone-500'}>
                    {settings.adsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">AdSense Client ID</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${isClientConfigured ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <span className={isClientConfigured ? 'text-emerald-700' : 'text-amber-700'}>
                    {isClientConfigured ? 'Configured' : 'Not Configured'}
                  </span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">Header Slot</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${isHeaderConfigured ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className={isHeaderConfigured ? 'text-emerald-700' : 'text-stone-500'}>
                    {isHeaderConfigured ? 'Configured' : 'Not Configured'}
                  </span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">Footer Slot</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${isFooterConfigured ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className={isFooterConfigured ? 'text-emerald-700' : 'text-stone-500'}>
                    {isFooterConfigured ? 'Configured' : 'Not Configured'}
                  </span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">Download Slot</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${isDownloadConfigured ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className={isDownloadConfigured ? 'text-emerald-700' : 'text-stone-500'}>
                    {isDownloadConfigured ? 'Configured' : 'Not Configured'}
                  </span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">Blog Ads</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${settings.blogAdsEnabled && settings.adsEnabled ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className={settings.blogAdsEnabled && settings.adsEnabled ? 'text-emerald-700' : 'text-stone-500'}>
                    {settings.blogAdsEnabled && settings.adsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">Blog Top</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${isBlogTopConfigured ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className={isBlogTopConfigured ? 'text-emerald-700' : 'text-stone-500'}>
                    {isBlogTopConfigured ? 'Configured' : 'Not Configured'}
                  </span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-semibold block mb-1">Blog Middle</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className={`w-2 h-2 rounded-full ${isBlogMiddleConfigured ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span className={isBlogMiddleConfigured ? 'text-emerald-700' : 'text-stone-500'}>
                    {isBlogMiddleConfigured ? 'Configured' : 'Not Configured'}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: General Advertising & AdSense Credentials */}
        <Card className="border-stone-200 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-800" />
              <CardTitle className="text-base font-cinzel">1. General AdSense Configuration</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Primary switch and AdSense publisher identifier. When disabled, zero ad slots render and no external Google scripts load.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
              <Checkbox
                label="Ads Enabled"
                sublabel="Master switch. When OFF, no ad slots render, AdSense script is not loaded, and download flow continues normally."
                checked={settings.adsEnabled}
                onChange={(e) => handleChange('adsEnabled', e.target.checked)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="AdSense Client ID"
                value={settings.adsenseClientId}
                onChange={(e) => handleChange('adsenseClientId', e.target.value)}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                hint="Format: ca-pub-XXXXXXXXXXXXXXXX (public client ID, never a private service token)"
              />

              <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200 flex flex-col justify-center">
                <strong className="text-stone-700 font-semibold mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Public Configuration Safety
                </strong>
                <span>
                  The publisher ID is public configuration intended for client-side tag requests. Private keys and admin tokens are never accepted here.
                </span>
                {settings.adsenseClientId && settings.adsenseClientId.startsWith('ca-pub-') && (
                  <div className="mt-2 pt-2 border-t border-stone-200 text-[11px] text-stone-700">
                    <strong className="block mb-0.5 text-stone-800">ads.txt authorization entry:</strong>
                    <div className="bg-white p-1.5 rounded border border-stone-300 font-mono text-[10px] select-all break-all text-amber-900">
                      google.com, {settings.adsenseClientId.replace('ca-', '')}, DIRECT, f08c47fec0942fa0
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Core Platform Placements */}
        <Card className="border-stone-200 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-amber-800" />
              <CardTitle className="text-base font-cinzel">2. Core App Placements (Header, Footer & Download)</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Configure slots for site navigation boundaries and the post-generation download modal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Header Ad Slot"
                value={settings.adsenseSlotHeader}
                onChange={(e) => handleChange('adsenseSlotHeader', e.target.value)}
                placeholder="1092837465"
                hint="Top placement below main navigation"
              />

              <Input
                label="Footer Ad Slot"
                value={settings.adsenseSlotFooter}
                onChange={(e) => handleChange('adsenseSlotFooter', e.target.value)}
                placeholder="5647382910"
                hint="Bottom placement above site footer"
              />

              <Input
                label="Download Ad Slot"
                value={settings.adsenseSlotDownload}
                onChange={(e) => handleChange('adsenseSlotDownload', e.target.value)}
                placeholder="4738291029"
                hint="Interstitial unit inside download dialog"
              />
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <span className="font-bold text-stone-700 block">Download Monetization Compliance:</span>
              <p>
                Download monetization levels (STANDARD = 1 opportunity, TEMPLATE = 2 opportunities, ADVANCED = 3 opportunities) represent application-level opportunities and never guarantee or force exact ad delivery. The user always has an unobstructed path to download.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Blog Advertising Architecture (Requirement 6 & 7) */}
        <Card className="border-stone-200 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-800" />
              <CardTitle className="text-base font-cinzel">3. Blog Editorial Monetization</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Configure contextual advertisements for matrimonial guide articles on the public blog.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
              <Checkbox
                label="Blog Ads Enabled"
                sublabel="When OFF or when master ads are OFF, zero advertisements will render on article pages."
                checked={settings.blogAdsEnabled}
                onChange={(e) => handleChange('blogAdsEnabled', e.target.checked)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <Input
                label="Blog Top Ad Slot"
                value={settings.adsenseSlotBlogTop}
                onChange={(e) => handleChange('adsenseSlotBlogTop', e.target.value)}
                placeholder="3847291023"
                hint="Displayed below article title and featured area"
              />

              <Input
                label="Blog Middle Ad Slot"
                value={settings.adsenseSlotBlogMiddle}
                onChange={(e) => handleChange('adsenseSlotBlogMiddle', e.target.value)}
                placeholder="5928374019"
                hint="Displayed in mid-content for long articles (4+ paragraphs)"
              />

              <Input
                label="Blog Bottom Ad Slot"
                value={settings.adsenseSlotBlogBottom}
                onChange={(e) => handleChange('adsenseSlotBlogBottom', e.target.value)}
                placeholder="6928374012"
                hint="Displayed before related articles section"
              />
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
              <span className="font-bold text-stone-700 block mb-0.5">Readability & Content Threshold Guarantee:</span>
              <p>
                Short articles automatically omit the middle ad to maintain optimal reading experience. Empty unconfigured slots produce zero empty containers.
              </p>
            </div>
          </CardContent>

          <CardFooter className="pt-2 flex justify-end gap-3 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Ad Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </AdminLayout>
  );
};
