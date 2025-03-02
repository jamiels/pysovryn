import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSettings } from '@/providers';
import { AppRouting } from './routing';
import { PathnameProvider } from './providers';

const App = () => {
  const { settings } = useSettings();

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(settings.themeMode);
  }, [settings]);

  return (
    <BrowserRouter>
      <PathnameProvider>
        <AppRouting />
      </PathnameProvider>
    </BrowserRouter>
  );
};

export { App };
