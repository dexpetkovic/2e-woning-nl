import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const isActive = (path: string) => router.pathname === path;

  const links = [
    { href: '/', label: t('navigation.home') },
    { href: '/box3-uitleg', label: 'Box 3 uitgelegd' },
    { href: '/rechtbank', label: t('navigation.rechtbank') },
    { href: '/over', label: 'Over' },
    { href: '/contact', label: t('navigation.contact') },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-appleGray-200/80">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <span className="brand-dot" />
              <span className="font-display text-xl font-semibold text-appleGray-900 tracking-tight">
                2e-woning
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7 text-sm text-appleGray-700">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`no-underline transition-opacity hover:opacity-100 ${
                    isActive(l.href) ? 'opacity-100 text-appleGray-900 font-medium' : 'opacity-75'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-appleGray-700 hover:bg-white transition-all"
                aria-expanded={isOpen}
                aria-label="Open menu"
              >
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-0 bg-appleGray-900/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-72 bg-appleGray-50 shadow-lg z-50 border-l border-appleGray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-appleGray-700 hover:bg-white transition-all"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-8 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-3 py-3 rounded-xl text-base no-underline transition-colors ${
                  isActive(l.href)
                    ? 'bg-white text-appleGray-900 font-medium'
                    : 'text-appleGray-700 hover:bg-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
