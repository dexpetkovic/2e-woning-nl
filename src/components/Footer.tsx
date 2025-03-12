import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Title and Copyright */}
          <div>
            <h3 className="text-lg font-semibold text-primary-700 mb-2">
              {t('footer.taxCalculator')}
            </h3>
            <p className="text-sm text-neutral-500">
              {t('footer.copyright')}
            </p>
          </div>

          {/* Column 2: Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-neutral-600 hover:text-primary-600 hover:underline">
                  {t('cookie.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-neutral-600 hover:text-primary-600 hover:underline">
                  {t('cookie.cookiePolicy')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-neutral-600 hover:text-primary-600 hover:underline">
                  {t('contact.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Disclaimer */}
          <div>
            <p className="text-sm text-neutral-500">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 