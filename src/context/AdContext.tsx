import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdSettings } from '../types/monetization';
import { adSettingsService, defaultAdSettings } from '../services/adSettingsService';

interface AdContextValue {
  settings: AdSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<AdSettings>) => Promise<{ success: boolean; error?: string }>;
}

const AdContext = createContext<AdContextValue>({
  settings: defaultAdSettings,
  isLoading: false,
  refreshSettings: async () => {},
  updateSettings: async () => ({ success: true })
});

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AdSettings>(() => adSettingsService.getSettings());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetched = await adSettingsService.fetchSettings(true);
      setSettings(fetched);
    } catch (err) {
      console.warn('Failed to refresh ad settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    adSettingsService.fetchSettings(false).then((data) => {
      if (isMounted) {
        setSettings(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<AdSettings>) => {
    const result = await adSettingsService.updateSettings(newSettings);
    if (result.success) {
      setSettings(adSettingsService.getSettings());
    }
    return result;
  }, []);

  return (
    <AdContext.Provider value={{ settings, isLoading, refreshSettings, updateSettings }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAdSettings = () => useContext(AdContext);
