import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const CompanyInfo: React.FC = () => {
  const { t } = useTranslation('common');
  
  return (
    <div className="bg-white rounded-xl p-6 mt-8">
      <div className="flex flex-col md:flex-row items-center">
        <div className="mb-4 md:mb-0 md:mr-6">
          <img 
            src="/images/elands-studio-logo.png" 
            alt="Elands Studio" 
            className="h-auto w-64"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-primary-700 mb-2">{t('company.title')}</h3>
          <p className="text-neutral-600 mb-3">
            {t('company.description')}
          </p>
          <div className="flex flex-wrap gap-2">
            {/* <Link href="https://elands.studio" target="_blank" rel="noopener noreferrer" legacyBehavior>
              <a className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {t('company.website')}
              </a>
            </Link> */}
            <Link href="mailto:elandsstudio@gmail.com" legacyBehavior>
              <a className="inline-flex items-center px-3 py-1.5 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('company.contact')}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo; 