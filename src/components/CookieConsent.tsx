import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { trackEvent, AnalyticsEvent, initAnalytics } from '@/utils/analytics';

const CookieConsent: React.FC = () => {
  const { t } = useTranslation('common');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
    initAnalytics(); // Initialize analytics after consent
    trackEvent(AnalyticsEvent.ACCEPT_COOKIES);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowBanner(false);
    trackEvent(AnalyticsEvent.DECLINE_COOKIES);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-600">
            {t('cookie.message')} {' '}
            <a href="/privacy" className="text-primary-600 hover:underline">
              {t('cookie.privacyPolicy')}
            </a>
            {' '} {t('cookie.and')} {' '}
            <a href="/cookies" className="text-primary-600 hover:underline">
              {t('cookie.cookiePolicy')}
            </a>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            >
              {t('cookie.decline')}
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('cookie.accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 