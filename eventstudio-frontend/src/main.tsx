import '@/components/keenicons/assets/duotone/style.css';
import '@/components/keenicons/assets/outline/style.css';
import '@/components/keenicons/assets/filled/style.css';
import '@/components/keenicons/assets/solid/style.css';
import './css/styles.css';

import axios from 'axios';
import ReactDOM from 'react-dom/client';

import { App } from './App';

import { ProvidersWrapper } from './providers';
import React from 'react';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Toaster } from 'react-hot-toast';
import { setupAxios } from '@/auth';

const RECAPTCHA_KEY = import.meta.env.VITE_APP_RECAPTCHA_KEY;

/**
 * Inject interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
setupAxios(axios);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ProvidersWrapper>
      <Toaster position="top-center" reverseOrder={true} />
      <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY}>
        <App />
      </GoogleReCaptchaProvider>
    </ProvidersWrapper>
  </React.StrictMode>
);
