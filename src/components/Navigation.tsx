import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-appleGray-100/50'
            : 'bg-white border-b border-appleGray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-accent-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
              <span className="text-2xl font-semibold text-appleGray-900 tracking-tight">2e-woning.nl</span>
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link
                href="/"
                className={`px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${
                  isActive('/')
                    ? 'text-accent-500 bg-appleGray-50'
                    : 'text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100'
                }`}
              >
                {t('navigation.home')}
              </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${
                  isActive('/contact')
                    ? 'text-accent-500 bg-appleGray-50'
                    : 'text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100'
                }`}
              >
                {t('navigation.contact')}
              </Link>
              <div className="ml-6">
                <LanguageSwitcher />
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-3 rounded-full text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 transition-all"
                aria-expanded={isOpen}
                aria-label="Open main menu"
              >
                {isOpen ? (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-md shadow-apple z-50 rounded-l-2xl border-l border-appleGray-100 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-full text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100 transition-all"
              aria-label="Close menu"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-10 space-y-4">
            <Link
              href="/"
              className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors duration-200 ${
                isActive('/') ? 'text-accent-500 bg-appleGray-50' : 'text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100'
              }`}
            >
              {t('navigation.home')}
            </Link>
            <Link
              href="/contact"
              className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors duration-200 ${
                isActive('/contact') ? 'text-accent-500 bg-appleGray-50' : 'text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100'
              }`}
            >
              {t('navigation.contact')}
            </Link>
            <div className="pt-4 pl-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </>
  );
};

export default Navigation;
