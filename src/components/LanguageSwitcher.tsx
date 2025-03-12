import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { trackEvent, AnalyticsEvent } from '@/utils/analytics';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { locales, locale: activeLocale } = router;

  // Ensure locales is always an array
  const availableLocales = locales || ['nl', 'en'];
  const currentLocale = activeLocale || 'nl';

  const handleLanguageChange = (newLocale: string) => {
    trackEvent(AnalyticsEvent.CHANGE_LANGUAGE, {
      language: newLocale,
      previousLanguage: currentLocale,
    });
    // Use router.push instead of Link for more control
    router.push(router.asPath, router.asPath, { locale: newLocale });
  };

  return (
    <div className="flex items-center">
      <span className="text-neutral-600 mr-2">{t('language')}:</span>
      <div className="flex space-x-2">
        {availableLocales.map((locale) => {
          const isActive = locale === currentLocale;
          
          return (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`px-2 py-1 rounded text-sm ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              {locale === 'nl' ? '🇳🇱 NL' : '🇬🇧 EN'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSwitcher; 