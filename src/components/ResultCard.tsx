import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { TaxCalculationResult, Assets, TaxYear, calculateBox3Tax2028, getThresholdsForYear } from '@/utils/taxCalculations';

interface ResultCardProps {
  result: TaxCalculationResult;
  resultPrevYear?: TaxCalculationResult;
  alternativeTaxAmount?: number;
  alternativeHasFiscalPartner?: boolean;
  assets: Assets;
  hasFiscalPartner: boolean;
  selectedYear?: TaxYear;
  className?: string;
}

const fmt = (n: number, decimals = 2) =>
  n.toLocaleString('nl-NL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const StepCard: React.FC<{ index: number; title: string; content: string }> = ({ index, title, content }) => (
  <div className="flex gap-3 p-3.5 rounded-xl bg-appleGray-100/60 border border-appleGray-200/80">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-500 text-white text-sm font-semibold flex items-center justify-center mt-0.5 font-mono">
      {index}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-appleGray-900 mb-1">{title}</p>
      <p className="text-xs text-appleGray-600 font-mono leading-relaxed break-words whitespace-pre-wrap">{content}</p>
    </div>
  </div>
);

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  resultPrevYear,
  alternativeTaxAmount,
  alternativeHasFiscalPartner,
  assets,
  hasFiscalPartner,
  selectedYear = '2025',
  className = '',
}) => {
  const { t } = useTranslation('common');
  const [assumedReturn, setAssumedReturn] = useState(5);

  const prevYear = selectedYear === '2026' ? '2025' : selectedYear === '2025' ? '2024' : null;
  const deltaPrevYear = resultPrevYear != null ? result.taxAmount - resultPrevYear.taxAmount : null;
  const thresholds = getThresholdsForYear(selectedYear);
  const tax2028 = calculateBox3Tax2028(assets, hasFiscalPartner, assumedReturn / 100, thresholds);
  const delta2028 = tax2028 - result.taxAmount;

  return (
    <div className={`card animate-fade-in-up p-6 md:p-8 ${className}`}>
      {/* Tax amount hero */}
      <div className="mb-6 pb-6 border-b border-appleGray-200">
        <p className="font-mono text-[11px] font-medium text-appleGray-500 uppercase tracking-[.16em] mb-2">
          {t('results.title')}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-display text-5xl md:text-6xl font-medium tracking-display-tight text-appleGray-900 leading-none tabular-nums">
            €{fmt(result.taxAmount)}
          </span>
          {deltaPrevYear != null && prevYear != null && (
            <span className={`font-mono text-[11px] font-medium px-2.5 py-1 rounded-full self-center uppercase tracking-wider ${
              deltaPrevYear > 0 ? 'bg-accent-50 text-accent-600' : 'bg-good/10 text-good'
            }`}>
              {deltaPrevYear > 0 ? '▲' : '▼'} €{fmt(Math.abs(deltaPrevYear))} vs {prevYear}
            </span>
          )}
        </div>

        {/* Fiscal partner comparison */}
        {alternativeTaxAmount != null && (
          <div className="mt-4 flex items-center gap-2 px-3.5 py-2.5 bg-appleGray-100/60 rounded-xl border border-appleGray-200/80">
            <svg className="w-4 h-4 text-appleGray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-appleGray-700">
              {alternativeHasFiscalPartner ? t('results.withPartner') : t('results.withoutPartner')}
              {': '}
              <strong className="text-appleGray-900 font-mono tabular-nums">€{fmt(alternativeTaxAmount)}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Year comparison row */}
      <div className="mb-6 pb-6 border-b border-appleGray-200">
        <p className="font-mono text-[11px] font-medium text-appleGray-500 uppercase tracking-[.16em] mb-3">
          {t('results.yearComparison')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {resultPrevYear != null && prevYear != null && (
            <div className="bg-appleGray-100/60 rounded-xl p-2.5 border border-appleGray-200/80 text-center">
              <p className="text-[11px] text-appleGray-500 mb-1 font-mono uppercase tracking-wider">{prevYear}</p>
              <p className="text-sm font-semibold text-appleGray-700 tabular-nums font-mono leading-tight">€{fmt(resultPrevYear.taxAmount, 0)}</p>
            </div>
          )}
          <div className={`bg-accent-50 rounded-xl p-2.5 border border-accent-200 text-center ${resultPrevYear == null ? 'col-span-2' : ''}`}>
            <p className="text-[11px] text-accent-600 font-medium mb-1 font-mono uppercase tracking-wider">{selectedYear}</p>
            <p className="text-sm font-semibold text-accent-700 tabular-nums font-mono leading-tight">€{fmt(result.taxAmount, 0)}</p>
          </div>
          <div className="bg-appleGray-900 rounded-xl p-2.5 text-center">
            <p className="text-[11px] text-appleGray-50/70 font-medium mb-1 font-mono uppercase tracking-wider">2028</p>
            <p className="text-sm font-semibold text-appleGray-50 tabular-nums font-mono leading-tight">€{fmt(tax2028, 0)}</p>
            <p className="text-[10px] text-appleGray-50/55 mt-1 leading-none font-mono">{t('results.year2028est')}</p>
          </div>
        </div>

        {/* 2028 impact summary */}
        <div className={`mt-3 flex items-center gap-3 p-3 rounded-xl border ${
          delta2028 > 0 ? 'bg-accent-50 border-accent-200' : 'bg-good/10 border-good/30'
        }`}>
          <span className={`text-xl flex-shrink-0 ${delta2028 > 0 ? 'text-accent-500' : 'text-good'}`}>
            {delta2028 > 0 ? '↑' : '↓'}
          </span>
          <p className={`text-sm leading-snug ${delta2028 > 0 ? 'text-accent-700' : 'text-good'}`}>
            <strong className="font-mono tabular-nums">€{fmt(Math.abs(delta2028))}</strong>{' '}
            {delta2028 > 0 ? t('results.impact2028More', { year: selectedYear }) : t('results.impact2028Less', { year: selectedYear })}
          </p>
        </div>

        {/* 2028 slider */}
        <div className="mt-4 p-4 bg-appleGray-100/60 rounded-xl border border-appleGray-200/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-appleGray-700">{t('results.assumedReturn')}</label>
            <span className="text-sm font-semibold text-accent-600 tabular-nums font-mono">{assumedReturn}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={0.5}
            value={assumedReturn}
            onChange={(e) => setAssumedReturn(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-appleGray-200 rounded-full appearance-none cursor-pointer accent-accent-500"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[11px] text-appleGray-500 font-mono">1%</span>
            <span className="text-[11px] text-appleGray-500 font-mono">12%</span>
          </div>
          <p className="mt-2 text-xs text-appleGray-600 leading-relaxed">{t('results.estimate2028Note')}</p>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        <div className="bg-appleGray-100/60 p-3.5 rounded-xl border border-appleGray-200/80">
          <p className="text-[11px] font-mono uppercase tracking-[.1em] text-appleGray-500 mb-1">{t('results.taxableReturn')}</p>
          <p className="text-base font-semibold text-appleGray-900 tabular-nums font-mono">€{fmt(result.taxableReturn)}</p>
        </div>
        <div className="bg-appleGray-100/60 p-3.5 rounded-xl border border-appleGray-200/80">
          <p className="text-[11px] font-mono uppercase tracking-[.1em] text-appleGray-500 mb-1">{t('results.taxBase')}</p>
          <p className="text-base font-semibold text-appleGray-900 tabular-nums font-mono">€{fmt(result.taxBase, 0)}</p>
        </div>
        <div className="bg-appleGray-100/60 p-3.5 rounded-xl border border-appleGray-200/80">
          <p className="text-[11px] font-mono uppercase tracking-[.1em] text-appleGray-500 mb-1">{t('results.savingsAndInvestmentBase')}</p>
          <p className="text-base font-semibold text-appleGray-900 tabular-nums font-mono">€{fmt(result.savingsAndInvestmentBase, 0)}</p>
        </div>
        <div className="bg-appleGray-100/60 p-3.5 rounded-xl border border-appleGray-200/80">
          <p className="text-[11px] font-mono uppercase tracking-[.1em] text-appleGray-500 mb-1">{t('results.benefitFromSavingsAndInvestments')}</p>
          <p className="text-base font-semibold text-appleGray-900 tabular-nums font-mono">€{fmt(result.benefitFromSavingsAndInvestments)}</p>
        </div>
        {result.treatyReduction > 0 && (
          <>
            <div className="bg-appleGray-100/60 p-3.5 rounded-xl border border-appleGray-200/80">
              <p className="text-[11px] font-mono uppercase tracking-[.1em] text-appleGray-500 mb-1">{t('results.grossTax')}</p>
              <p className="text-base font-semibold text-appleGray-900 tabular-nums font-mono">€{fmt(result.grossTaxAmount)}</p>
            </div>
            <div className="bg-good/10 p-3.5 rounded-xl border border-good/30">
              <p className="text-[11px] font-mono uppercase tracking-[.1em] text-good mb-1">{t('results.treatyReduction')}</p>
              <p className="text-base font-semibold text-good tabular-nums font-mono">−€{fmt(result.treatyReduction)}</p>
            </div>
          </>
        )}
      </div>

      {/* Calculation steps */}
      <div>
        <p className="font-mono text-[11px] font-medium text-appleGray-500 uppercase tracking-[.16em] mb-3">
          {t('results.calculationSteps')}
        </p>
        <div className="space-y-2">
          <StepCard index={1} title={t('results.step1')} content={result.steps.step1} />
          <StepCard index={2} title={t('results.step2')} content={result.steps.step2} />
          <StepCard index={3} title={t('results.step3')} content={result.steps.step3} />
          <StepCard index={4} title={t('results.step4')} content={result.steps.step4} />
          <StepCard index={5} title={t('results.step5')} content={result.steps.step5} />
          <StepCard index={6} title={t('results.step6')} content={result.steps.step6} />
        </div>
      </div>

      <p className="mt-5 text-xs text-appleGray-500 leading-relaxed">{t('results.disclaimer')}</p>
    </div>
  );
};

export default ResultCard;
