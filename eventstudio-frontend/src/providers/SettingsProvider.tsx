import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { defaultSettings, ISettings, type TSettingsThemeMode } from '@/config/settings.config';
import { getData, setData } from '@/utils';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

export interface ISettingsProps {
  settings: ISettings;
  storeSettings: (settings: Partial<ISettings>) => void;
  updateSettings: (settings: Partial<ISettings>) => void;
  getThemeMode: () => TSettingsThemeMode;
}

const SETTINGS_CONFIGS_KEY = 'settings-configs';

const getStoredSettings = (): Partial<ISettings> => {
  return (getData(SETTINGS_CONFIGS_KEY) as Partial<ISettings>) || {};
};

const initialProps: ISettingsProps = {
  settings: { ...defaultSettings, ...getStoredSettings() },
  updateSettings: (settings: Partial<ISettings>) => {},
  storeSettings: (settings: Partial<ISettings>) => {},
  getThemeMode: () => 'light'
};

const LayoutsContext = createContext<ISettingsProps>(initialProps);
const useSettings = () => useContext(LayoutsContext);

const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState(initialProps.settings);
  const { auth } = useAuth();

  const updateSettings = (newSettings: Partial<ISettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const storeSettings = (newSettings: Partial<ISettings>) => {
    const updatedSettings = { ...getStoredSettings(), ...newSettings };
    setData(SETTINGS_CONFIGS_KEY, updatedSettings);
    updateSettings(updatedSettings);
  };

  // When the user logs in, re-read stored settings (e.g., dark mode preference)
  useEffect(() => {
    if (auth) {
      const stored = getStoredSettings();
      if (stored.themeMode && stored.themeMode !== settings.themeMode) {
        updateSettings(stored);
      }
    }
  }, [auth]);

  // Compute effectiveTheme based on auth and user settings
  const effectiveTheme = useMemo<TSettingsThemeMode>(() => {
    if (!auth) {
      // Force light theme on login pages (when not authenticated)
      return 'light';
    }
    if (settings.themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.themeMode;
  }, [auth, settings.themeMode]);

  // Update the document's class so your CSS immediately reflects the theme change.
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  const getThemeMode = useCallback(() => effectiveTheme, [effectiveTheme]);

  return (
    <LayoutsContext.Provider value={{ settings, updateSettings, storeSettings, getThemeMode }}>
      {children}
    </LayoutsContext.Provider>
  );
};

export { SettingsProvider, useSettings };
