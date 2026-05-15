import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const CompanyInfo: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <img
          src="/images/elands-studio-logo.png"
          alt="Elands AI"
          className="h-12 w-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="font-mono text-[10.5px] uppercase tracking-[.14em] text-appleGray-500 mb-0.5">
            Gemaakt door
          </div>
          <div className="font-display text-[15px] font-medium text-appleGray-900 leading-tight tracking-display-tight">
            Elands AI
          </div>
        </div>
      </div>
      <p className="text-appleGray-700 text-[13.5px] leading-relaxed mb-4">
        {t('company.description')}
      </p>
      <Link
        href="mailto:hello@elands.studio"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-appleGray-900 hover:text-accent-500 transition-colors no-underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {t('company.contact')}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
};

export default CompanyInfo;
