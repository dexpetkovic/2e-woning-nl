import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { TaxCalculationResult, Assets, calculateBox3Tax2028 } from '@/utils/taxCalculations';

interface ResultCardProps {
  result: TaxCalculationResult;
  result2024?: TaxCalculationResult;
  alternativeTaxAmount?: number;
  alternativeHasFiscalPartner?: boolean;
  assets: Assets;
  hasFiscalPartner: boolean;
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

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  result2024,
  alternativeTaxAmount,
  alternativeHasFiscalPartner,
  assets,
  hasFiscalPartner,
  className = '',
}) => {
  const { t } = useTranslation('common');
  const [assumedReturn, setAssumedReturn] = useState(5);

  const delta2024 = result2024 != null ? result.taxAmount - result2024.taxAmount : null;
  const tax2028 = calculateBox3Tax2028(assets, hasFiscalPartner, assumedReturn / 100);

  return (
    <div className={`card animate-fade-in-up ${className}`}>
      {/* Tax amount hero */}
      <div className="mb-6 pb-6 border-b border-appleGray-100">
        <p className="text-xs font-semibold text-appleGray-400 uppercase tracking-wider mb-1">{t('results.title')}</p>
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="text-2xl font-medium text-appleGray-400">€</span>
          <span className="text-5xl font-bold text-accent-500 tabular-nums">
            {fmt(result.taxAmount)}
          </span>
          {delta2024 != null && (
            <span className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full self-center ${delta2024 > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
              {delta2024 > 0 ? '▲' : '▼'} €{fmt(Math.abs(delta2024))} {t('results.vs2024')}
            </span>
          )}
        </div>

        {/* Fiscal partner comparison */}
        {alternativeTaxAmount != null && (
          <div className="mt-3 flex items-center gap-2 p-3 bg-appleGray-50 rounded-xl border border-appleGray-100">
            <svg className="w-4 h-4 text-appleGray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-appleGray-600">
              {alternativeHasFiscalPartner
                ? t('results.withPartner')
                : t('results.withoutPartner')}
              {': '}
              <strong className="text-appleGray-900">€ {fmt(alternativeTaxAmount)}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Year comparison row */}
      <div className="mb-6 pb-6 border-b border-appleGray-100">
        <p className="text-xs font-semibold text-appleGray-400 uppercase tracking-wider mb-3">{t('results.yearComparison')}</p>
        <div className="grid grid-cols-3 gap-2">
          {result2024 != null && (
            <div className="bg-appleGray-50 rounded-xl p-3 border border-appleGray-100 text-center">
              <p className="text-xs text-appleGray-400 mb-1">2024</p>
              <p className="text-lg font-bold text-appleGray-600 tabular-nums">€ {fmt(result2024.taxAmount)}</p>
            </div>
          )}
          <div className={`bg-accent-500/5 rounded-xl p-3 border border-accent-500/20 text-center ${result2024 == null ? 'col-span-2' : ''}`}>
            <p className="text-xs text-accent-600 font-medium mb-1">2025</p>
            <p className="text-lg font-bold text-accent-500 tabular-nums">€ {fmt(result.taxAmount)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-center">
            <p className="text-xs text-amber-600 font-medium mb-1">{t('results.year2028est')}</p>
            <p className="text-lg font-bold text-amber-600 tabular-nums">€ {fmt(tax2028)}</p>
          </div>
        </div>

        {/* 2028 slider */}
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-amber-700">{t('results.assumedReturn')}</label>
            <span className="text-sm font-bold text-amber-700 tabular-nums">{assumedReturn}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={0.5}
            value={assumedReturn}
            onChange={(e) => setAssumedReturn(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-amber-200 rounded-full appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-amber-500">1%</span>
            <span className="text-xs text-amber-500">12%</span>
          </div>
          <p className="mt-2 text-xs text-amber-600 leading-relaxed">{t('results.estimate2028Note')}</p>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-appleGray-50 p-4 rounded-xl border border-appleGray-100">
          <p className="text-xs font-medium text-appleGray-500 mb-1">{t('results.taxableReturn')}</p>
          <p className="text-base font-semibold text-appleGray-900 tabular-nums">€ {fmt(result.taxableReturn)}</p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl border border-appleGray-100">
          <p className="text-xs font-medium text-appleGray-500 mb-1">{t('results.taxBase')}</p>
          <p className="text-base font-semibold text-appleGray-900 tabular-nums">€ {fmt(result.taxBase, 0)}</p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl border border-appleGray-100">
          <p className="text-xs font-medium text-appleGray-500 mb-1">{t('results.savingsAndInvestmentBase')}</p>
          <p className="text-base font-semibold text-appleGray-900 tabular-nums">€ {fmt(result.savingsAndInvestmentBase, 0)}</p>
        </div>
        <div className="bg-appleGray-50 p-4 rounded-xl border border-appleGray-100">
          <p className="text-xs font-medium text-appleGray-500 mb-1">{t('results.benefitFromSavingsAndInvestments')}</p>
          <p className="text-base font-semibold text-appleGray-900 tabular-nums">€ {fmt(result.benefitFromSavingsAndInvestments)}</p>
        </div>
      </div>

      {/* Calculation steps */}
      <div>
        <p className="text-xs font-semibold text-appleGray-400 uppercase tracking-wider mb-3">{t('results.calculationSteps')}</p>
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
