import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { DefaultSeo } from 'next-seo';
import SEO from '@/next-seo.config';
import CookieConsent from '@/components/CookieConsent';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { initAnalytics } from '@/utils/analytics';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <DefaultSeo {...SEO} />
      <Navigation />
      <Component {...pageProps} />
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default appWithTranslation(App); 