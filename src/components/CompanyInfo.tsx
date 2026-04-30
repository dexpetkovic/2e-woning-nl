import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const CompanyInfo: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-shrink-0">
          <img
            src="/images/elands-studio-logo.png"
            alt="Elands Studio"
            className="h-auto w-48"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-appleGray-900 mb-1">{t('company.title')}</h3>
          <p className="text-appleGray-500 text-sm mb-4 leading-relaxed">
            {t('company.description')}
          </p>
          <Link href="mailto:elandsstudio@gmail.com" className="btn btn-outline inline-flex items-center gap-2 text-sm py-2 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('company.contact')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
