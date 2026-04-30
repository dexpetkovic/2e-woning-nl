import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-white border-t border-appleGray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <Link href="/" className="text-base font-semibold text-accent-500 tracking-tight">2e-woning.nl</Link>
          <p className="text-xs text-appleGray-400 mt-0.5">&copy; {new Date().getFullYear()} · {t('footer.copyright')}</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Link href="/privacy" className="hover:text-accent-500 transition-colors text-sm text-appleGray-400">
            {t('cookie.privacyPolicy')}
          </Link>
          <span className="hidden md:inline text-appleGray-200">·</span>
          <Link href="/cookies" className="hover:text-accent-500 transition-colors text-sm text-appleGray-400">
            {t('cookie.cookiePolicy')}
          </Link>
          <span className="hidden md:inline text-appleGray-200">·</span>
          <Link href="/contact" className="hover:text-accent-500 transition-colors text-sm text-appleGray-400">
            {t('contact.title')}
          </Link>
        </div>
        <p className="text-xs text-appleGray-300 max-w-xs leading-relaxed">
          {t('footer.disclaimer')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
