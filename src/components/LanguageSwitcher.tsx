import React from 'react';
import { useRouter } from 'next/router';
import { trackEvent, AnalyticsEvent } from '@/utils/analytics';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { locales, locale: activeLocale } = router;

  const availableLocales = locales || ['nl', 'en'];
  const currentLocale = activeLocale || 'nl';

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    trackEvent(AnalyticsEvent.CHANGE_LANGUAGE, {
      language: newLocale,
      previousLanguage: currentLocale,
    });
    router.push(router.asPath, router.asPath, { locale: newLocale });
  };

  return (
    <span className="lang-pill" role="tablist" aria-label="Language">
      {availableLocales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLanguageChange(locale)}
          className={locale === currentLocale ? 'on' : ''}
          aria-pressed={locale === currentLocale}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </span>
  );
};

export default LanguageSwitcher;
