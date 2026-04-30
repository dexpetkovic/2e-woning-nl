import React from 'react';
import { useTranslation } from 'next-i18next';
import { TaxCalculationResult } from '@/utils/taxCalculations';

interface ResultCardProps {
  result: TaxCalculationResult;
  className?: string;
}

const fmt = (n: number, decimals = 2) =>
  n.toLocaleString('nl-NL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const StepCard: React.FC<{ index: number; title: string; content: string }> = ({ index, title, content }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-appleGray-50 border border-appleGray-100">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-500 text-white text-sm font-semibold flex items-center justify-center mt-0.5">
      {index}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-appleGray-700 mb-1">{title}</p>
      <p className="text-xs text-appleGray-500 font-mono leading-relaxed break-words whitespace-pre-wrap">{content}</p>
    </div>
  </div>
);

const ResultCard: React.FC<ResultCardProps> = ({ result, className = '' }) => {
  const { t } = useTranslation('common');

  return (
    <div className={`card animate-fade-in-up ${className}`}>
      {/* Tax amount hero */}
      <div className="mb-8 pb-6 border-b border-appleGray-100">
        <p className="text-sm font-medium text-appleGray-500 uppercase tracking-wider mb-1">{t('results.title')}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-medium text-appleGray-400">€</span>
          <span className="text-5xl font-bold text-accent-500 tabular-nums">
            {fmt(result.taxAmount)}
          </span>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-appleGray-50 p-4 rounded-xl border border-appleGray-100">
          <p className="text-xs font-medium text-appleGray-500 mb-1">{t('results.taxableReturn')}</p>
          <p className="text-lg font-semibold text-appleGray-900 tabular-nums">€ {fmt(result.taxableReturn)}</p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl border border-appleGray-100">
          <p className="text-xs font-medium text-appleGray-500 mb-1">{t('results.taxBase')}</p>
          <p className="text-lg font-semibold text-appleGray-900 tabular-nums">€ {fmt(result.taxBase, 0)}</p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl border border-appleGray-100">
          <p className="text-xs font-medium text-appleGray-500 mb-1">{t('results.savingsAndInvestmentBase')}</p>
          <p className="text-lg font-semibold text-appleGray-900 tabular-nums">€ {fmt(result.savingsAndInvestmentBase, 0)}</p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl border border-appleGray-100">
          <p className="text-xs font-medium text-appleGray-500 mb-1">{t('results.benefitFromSavingsAndInvestments')}</p>
          <p className="text-lg font-semibold text-appleGray-900 tabular-nums">€ {fmt(result.benefitFromSavingsAndInvestments)}</p>
        </div>
      </div>

      {/* Calculation steps */}
      <div>
        <p className="text-sm font-semibold text-appleGray-700 mb-3">{t('results.calculationSteps')}</p>
        <div className="space-y-2">
          <StepCard index={1} title={t('results.step1')} content={result.steps.step1} />
          <StepCard index={2} title={t('results.step2')} content={result.steps.step2} />
          <StepCard index={3} title={t('results.step3')} content={result.steps.step3} />
          <StepCard index={4} title={t('results.step4')} content={result.steps.step4} />
          <StepCard index={5} title={t('results.step5')} content={result.steps.step5} />
          <StepCard index={6} title={t('results.step6')} content={result.steps.step6} />
        </div>
      </div>

      <p className="mt-6 text-xs text-appleGray-400 leading-relaxed">{t('results.disclaimer')}</p>
    </div>
  );
};

export default ResultCard;
