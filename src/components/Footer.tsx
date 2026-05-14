import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-appleGray-900 text-appleGray-50 mt-auto">
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-3xl md:text-4xl font-semibold tracking-display leading-none mb-3">
              <span className="brand-dot mr-2 align-middle" />
              2e-woning
            </div>
            <p className="text-sm leading-relaxed text-appleGray-50/70 max-w-[36ch]">
              {t('footer.disclaimer')}
            </p>
          </div>

          {/* Tool column */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-[.14em] text-appleGray-50/60 mb-3 font-medium">
              Tool
            </h5>
            <div className="space-y-1.5 text-sm">
              <Link href="/" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                {t('navigation.home')}
              </Link>
              <Link href="/box3-tips" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                Box 3 tips
              </Link>
              <Link href="/rechtbank" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                {t('navigation.rechtbank')}
              </Link>
            </div>
          </div>

          {/* Lezen column */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-[.14em] text-appleGray-50/60 mb-3 font-medium">
              Lezen
            </h5>
            <div className="space-y-1.5 text-sm">
              <Link href="/box3-uitleg" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                Box 3 uitgelegd
              </Link>
              <Link href="/box3-tips" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                Zo verlaag je je Box 3
              </Link>
              <Link href="/rechtbank" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                Box 3 &amp; de Rechter
              </Link>
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-[.14em] text-appleGray-50/60 mb-3 font-medium">
              Contact
            </h5>
            <div className="space-y-1.5 text-sm">
              <Link href="/contact" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                {t('contact.title')}
              </Link>
              <Link href="/privacy" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                {t('cookie.privacyPolicy')}
              </Link>
              <Link href="/cookies" className="block no-underline text-appleGray-50/85 hover:text-accent-500 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-appleGray-50/15 flex flex-wrap justify-between gap-3 font-mono text-[11px] uppercase tracking-[.12em] text-appleGray-50/55">
          <span>© {new Date().getFullYear()} · 2e-woning.nl · {t('footer.copyright')}</span>
          <span>Hulpmiddel — geen fiscaal advies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
