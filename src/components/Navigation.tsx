import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      <nav className="bg-white border-b border-appleGray-100 fixed w-full top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between h-20 items-center">
            {/* Logo and Home link */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-semibold text-appleGray-900 tracking-tight">2e-woning.nl</span>
              </Link>
            </div>

            {/* Desktop menu */}
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

            {/* Hamburger button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-3 rounded-full text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 transition-all"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isOpen ? 'hidden' : 'block'} h-7 w-7`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isOpen ? 'block' : 'hidden'} h-7 w-7`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile menu drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-white/90 shadow-apple z-50 rounded-l-2xl border-l border-appleGray-100 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-end">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-3 rounded-full text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 transition-all"
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-10 space-y-8">
            <Link
              href="/"
              className={`block px-4 py-2 rounded-full text-lg font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-accent-500 bg-appleGray-50' 
                  : 'text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100'
              }`}
            >
              {t('navigation.home')}
            </Link>
            <Link
              href="/contact"
              className={`block px-4 py-2 rounded-full text-lg font-medium transition-colors duration-200 ${
                isActive('/contact') 
                  ? 'text-accent-500 bg-appleGray-50' 
                  : 'text-appleGray-700 hover:text-accent-500 hover:bg-appleGray-100'
              }`}
            >
              {t('navigation.contact')}
            </Link>
          </div>
        </div>
      </div>

      {/* Content spacer for fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Navigation; 