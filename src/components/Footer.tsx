import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-white border-t border-appleGray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="text-sm text-appleGray-500">
          &copy; 2e-woning.nl — {t('footer.copyright')}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 text-appleGray-400">
          <Link href="/privacy" className="hover:text-accent-500 transition-colors text-sm">
            {t('cookie.privacyPolicy')}
          </Link>
          <span className="hidden md:inline">·</span>
          <Link href="/cookies" className="hover:text-accent-500 transition-colors text-sm">
            {t('cookie.cookiePolicy')}
          </Link>
          <span className="hidden md:inline">·</span>
          <Link href="/contact" className="hover:text-accent-500 transition-colors text-sm">
            {t('contact.title')}
          </Link>
        </div>
        <div className="text-xs text-appleGray-300 max-w-xs">
          {t('footer.disclaimer')}
        </div>
      </div>
    </footer>
  );
};

export default Footer; 