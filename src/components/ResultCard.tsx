import React from 'react';
import { useTranslation } from 'next-i18next';
import { TaxCalculationResult } from '@/utils/taxCalculations';

interface ResultCardProps {
  result: TaxCalculationResult;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, className = '' }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className={`card ${className}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-appleGray-900 mb-2 tracking-tight">{t('results.title')}</h2>
        <div className="flex items-center">
          <span className="text-4xl font-bold text-accent-500">
            € {result.taxAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-appleGray-50 p-4 rounded-xl">
          <h3 className="text-base font-medium mb-2 text-appleGray-700">{t('results.taxableReturn')}</h3>
          <p className="text-xl font-semibold text-appleGray-900">
            € {result.taxableReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl">
          <h3 className="text-base font-medium mb-2 text-appleGray-700">{t('results.taxBase')}</h3>
          <p className="text-xl font-semibold text-appleGray-900">
            € {result.taxBase.toLocaleString('nl-NL')}
          </p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl">
          <h3 className="text-base font-medium mb-2 text-appleGray-700">{t('results.savingsAndInvestmentBase')}</h3>
          <p className="text-xl font-semibold text-appleGray-900">
            € {result.savingsAndInvestmentBase.toLocaleString('nl-NL')}
          </p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl">
          <h3 className="text-base font-medium mb-2 text-appleGray-700">{t('results.benefitFromSavingsAndInvestments')}</h3>
          <p className="text-xl font-semibold text-appleGray-900">
            € {result.benefitFromSavingsAndInvestments.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">{t('results.calculationSteps')}</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-accent-500 mb-2">{t('results.step1')}</h4>
          <pre className="bg-appleGray-50 p-2 rounded-lg text-sm break-words text-wrap">
            {result.steps.step1}
          </pre>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-accent-500 mb-2">{t('results.step2')}</h4>
          <pre className="bg-appleGray-50 p-2 rounded-lg text-sm whitespace-pre-wrap">
            {result.steps.step2}
          </pre>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-accent-500 mb-2">{t('results.step3')}</h4>
          <pre className="bg-appleGray-50 p-2 rounded-lg text-sm whitespace-pre-wrap">
            {result.steps.step3}
          </pre>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-accent-500 mb-2">{t('results.step4')}</h4>
          <pre className="bg-appleGray-50 p-2 rounded-lg text-sm whitespace-pre-wrap">
            {result.steps.step4}
          </pre>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-accent-500 mb-2">{t('results.step5')}</h4>
          <pre className="bg-appleGray-50 p-2 rounded-lg text-sm whitespace-pre-wrap">
            {result.steps.step5}
          </pre>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-accent-500 mb-2">{t('results.step6')}</h4>
          <pre className="bg-appleGray-50 p-2 rounded-lg text-sm whitespace-pre-wrap">
            {result.steps.step6}
          </pre>
        </div>
      </div>
      <div className="mt-8 text-sm text-appleGray-400">
        <p>{t('results.disclaimer')}</p>
      </div>
    </div>
  );
};

export default ResultCard; 