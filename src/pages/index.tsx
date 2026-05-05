import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import InputField from '@/components/InputField';
import ResultCard from '@/components/ResultCard';
import AdBanner from '@/components/AdBanner';
import CompanyInfo from '@/components/CompanyInfo';
import EmailCapture from '@/components/EmailCapture';
import { Assets, calculateBox3Tax, calculateBox3TaxForYear, TaxCalculationResult } from '@/utils/taxCalculations';
import { NextSeo } from 'next-seo';
import Script from 'next/script';
import { trackEvent, AnalyticsEvent } from '@/utils/analytics';

const GOOGLE_ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || '';
const GOOGLE_ADSENSE_SLOT_HORIZONTAL = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_HORIZONTAL || '';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    return {
      props: {
        ...(await serverSideTranslations(locale || 'nl', ['common'])),
      },
    };
  } catch (error) {
    console.error('Error loading translations:', error);
    return { props: {} };
  }
};

const TRUST_BADGES = [
  { icon: '✓', label: 'Gratis' },
  { icon: '✓', label: '2025 tarieven' },
  { icon: '✓', label: 'Direct resultaat' },
  { icon: '✓', label: 'Geen registratie' },
];

const EMPTY_ASSETS: Assets = {
  bankSavings: 0,
  investments: 0,
  properties: 0,
  foreignTreatyProperties: 0,
  otherAssets: 0,
  greenInvestments: 0,
  debts: 0,
};

type FaqItem = { q: string; a: string };
type MoreLezenItem = { href: string; title: string; desc: string };
type RateGridItem = { label: string; rate: string };
type PropertyLocation = 'nl' | 'treaty' | 'noTreaty';
type PropertyEntry = { id: string; value: number; location: PropertyLocation; mortgage: number; hasMortgage: boolean };

const Home = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const faqItems = t('faq.items', { returnObjects: true }) as FaqItem[];
  const moreLezenItems = t('moreLezen.items', { returnObjects: true }) as MoreLezenItem[];
  const rateGridItems: RateGridItem[] = [
    { label: t('about.savingsLabel'), rate: '1,44%' },
    { label: t('about.investmentsVastgoed'), rate: '6,04%' },
    { label: t('about.debtsLabel'), rate: '2,61%' },
  ];
  const [copied, setCopied] = useState(false);
  const didInitFromUrl = useRef(false);

  const [assets, setAssets] = useState<Assets>(EMPTY_ASSETS);
  const [hasFiscalPartner, setHasFiscalPartner] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);
  const [result2024, setResult2024] = useState<TaxCalculationResult | null>(null);
  const [alternativeTaxAmount, setAlternativeTaxAmount] = useState<number | undefined>(undefined);

  const [propertyEntries, setPropertyEntries] = useState<PropertyEntry[]>([
    { id: '1', value: 0, location: 'nl', mortgage: 0, hasMortgage: false },
  ]);
  const [focusedPropertyId, setFocusedPropertyId] = useState<string | null>(null);
  const [focusedMortgageId, setFocusedMortgageId] = useState<string | null>(null);
  const [otherDebts, setOtherDebts] = useState(0);

  // NL properties pay full Dutch Box 3. Foreign properties (treaty OR no-treaty) both
  // get the Bvdb 2001 art. 23 proportional reduction — same formula, different user note.
  // Mortgages on NL properties are Box 3 debts; tracked here and merged with otherDebts.
  const syncPropertyTotals = (entries: PropertyEntry[], oDebts = otherDebts) => {
    const nlTotal = entries.filter(e => e.location === 'nl').reduce((s, e) => s + e.value, 0);
    const ftpTotal = entries.filter(e => e.location !== 'nl').reduce((s, e) => s + e.value, 0);
    const mortgageTotal = entries.reduce((s, e) => s + (e.hasMortgage ? e.mortgage : 0), 0);
    setAssets(a => ({ ...a, properties: nlTotal, foreignTreatyProperties: ftpTotal, debts: oDebts + mortgageTotal }));
  };

  const addPropertyEntry = () => {
    setPropertyEntries(prev => [...prev, { id: Date.now().toString(), value: 0, location: 'nl', mortgage: 0, hasMortgage: false }]);
  };

  const removePropertyEntry = (id: string) => {
    setPropertyEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      syncPropertyTotals(updated);
      return updated;
    });
    if (showResults) setShowResults(false);
  };

  const updatePropertyEntry = (id: string, field: keyof Omit<PropertyEntry, 'id'>, val: number | PropertyLocation | boolean) => {
    setPropertyEntries(prev => {
      const updated = prev.map(e => {
        if (e.id !== id) return e;
        const next = { ...e, [field]: val };
        // Clear mortgage amount when toggling off
        if (field === 'hasMortgage' && val === false) next.mortgage = 0;
        return next;
      });
      syncPropertyTotals(updated);
      return updated;
    });
    if (showResults) setShowResults(false);
  };

  // Initialise form from URL query params (shareable links)
  useEffect(() => {
    if (didInitFromUrl.current) return;
    didInitFromUrl.current = true;
    const p = new URLSearchParams(window.location.search);
    const fromUrl: Assets = {
      bankSavings: parseFloat(p.get('bs') || '0') || 0,
      investments: parseFloat(p.get('inv') || '0') || 0,
      properties: parseFloat(p.get('prop') || '0') || 0,
      foreignTreatyProperties: parseFloat(p.get('ftp') || '0') || 0,
      otherAssets: parseFloat(p.get('oth') || '0') || 0,
      greenInvestments: parseFloat(p.get('gri') || '0') || 0,
      debts: parseFloat(p.get('dbt') || '0') || 0,
    };
    const fp = p.get('fp') === '1';
    if (Object.values(fromUrl).some((v) => v > 0)) {
      setAssets(fromUrl);
      // Reconstruct property entries from URL totals (mortgages not encoded in URL — put total debts in otherDebts)
      const entries: PropertyEntry[] = [];
      if (fromUrl.properties > 0) entries.push({ id: '1', value: fromUrl.properties, location: 'nl', mortgage: 0, hasMortgage: false });
      if (fromUrl.foreignTreatyProperties > 0) entries.push({ id: '2', value: fromUrl.foreignTreatyProperties, location: 'treaty', mortgage: 0, hasMortgage: false });
      if (entries.length > 0) setPropertyEntries(entries);
      if (fromUrl.debts > 0) setOtherDebts(fromUrl.debts);
      setHasFiscalPartner(fp);
      // Auto-calculate if values were pre-filled from URL
      const r = calculateBox3Tax(fromUrl, fp);
      setCalculationResult(r);
      setResult2024(calculateBox3TaxForYear(fromUrl, fp, '2024'));
      setAlternativeTaxAmount(calculateBox3Tax(fromUrl, !fp).taxAmount);
      setShowResults(true);
    }
  }, []);

  const handleInputChange = (field: keyof Assets, value: number) => {
    setAssets((prev) => ({ ...prev, [field]: value }));
    trackEvent(AnalyticsEvent.UPDATE_ASSET, { assetType: field, assetValue: value });
    if (showResults) setShowResults(false);
  };

  const handleOtherDebtsChange = (v: number) => {
    setOtherDebts(v);
    syncPropertyTotals(propertyEntries, v);
    if (showResults) setShowResults(false);
  };

  const buildShareUrl = (currentAssets: Assets, fp: boolean): string => {
    const p = new URLSearchParams();
    if (currentAssets.bankSavings) p.set('bs', String(currentAssets.bankSavings));
    if (currentAssets.investments) p.set('inv', String(currentAssets.investments));
    if (currentAssets.properties) p.set('prop', String(currentAssets.properties));
    if (currentAssets.foreignTreatyProperties) p.set('ftp', String(currentAssets.foreignTreatyProperties));
    if (currentAssets.otherAssets) p.set('oth', String(currentAssets.otherAssets));
    if (currentAssets.greenInvestments) p.set('gri', String(currentAssets.greenInvestments));
    if (currentAssets.debts) p.set('dbt', String(currentAssets.debts));
    if (fp) p.set('fp', '1');
    const base = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
    return `${base}?${p.toString()}`;
  };

  const handleCalculate = () => {
    const r2025 = calculateBox3Tax(assets, hasFiscalPartner);
    const r2024 = calculateBox3TaxForYear(assets, hasFiscalPartner, '2024');
    const altAmount = calculateBox3Tax(assets, !hasFiscalPartner).taxAmount;

    setCalculationResult(r2025);
    setResult2024(r2024);
    setAlternativeTaxAmount(altAmount);
    setShowResults(true);

    // Update URL for shareable link
    router.replace(buildShareUrl(assets, hasFiscalPartner), undefined, { shallow: true });

    trackEvent(AnalyticsEvent.CALCULATE_TAX, {
      hasFiscalPartner,
      totalAssets: Object.values(assets).reduce((s, v) => s + v, 0) - assets.debts,
      totalDebts: assets.debts,
      taxAmount: r2025.taxAmount,
    });
  };

  const handleReset = () => {
    setAssets(EMPTY_ASSETS);
    setHasFiscalPartner(false);
    setShowResults(false);
    setCalculationResult(null);
    setResult2024(null);
    setAlternativeTaxAmount(undefined);
    setPropertyEntries([{ id: '1', value: 0, location: 'nl', mortgage: 0, hasMortgage: false }]);
    setOtherDebts(0);
    router.replace(router.pathname, undefined, { shallow: true });
    trackEvent(AnalyticsEvent.RESET_CALCULATOR);
  };

  const handleCopyLink = () => {
    const url = buildShareUrl(assets, hasFiscalPartner);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Box 3 Belastingcalculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
      "description": "Bereken eenvoudig uw Box 3 vermogensbelasting voor tweede woning, investeringen en spaargeld. Gratis belastingcalculator met actuele 2025 tarieven.",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Wat is Box 3 belasting?",
          "acceptedAnswer": { "@type": "Answer", "text": "Box 3 is de belastingcategorie voor vermogen buiten de eigen woning en de onderneming. U betaalt belasting over een fictief rendement op spaargeld, beleggingen, tweede woningen en andere vermogensbestanddelen." }
        },
        {
          "@type": "Question",
          "name": "Wat is het heffingvrij vermogen in 2025?",
          "acceptedAnswer": { "@type": "Answer", "text": "In 2025 is het heffingvrij vermogen €57.000 per persoon. Voor fiscale partners samen is dit €114.000. Over vermogen onder dit bedrag betaalt u geen Box 3 belasting." }
        },
        {
          "@type": "Question",
          "name": "Wat zijn de Box 3 tarieven in 2025?",
          "acceptedAnswer": { "@type": "Answer", "text": "De fictieve rendementspercentages voor 2025 zijn: spaargeld 1,44%, beleggingen 6,04%, schulden 2,61%. Over het berekende fictieve rendement betaalt u 36% belasting." }
        },
        {
          "@type": "Question",
          "name": "Hoe werkt de Box 3 calculator?",
          "acceptedAnswer": { "@type": "Answer", "text": "Vul uw spaargeld, beleggingen, tweede woning en schulden in. De calculator berekent automatisch uw belastbare rendement, de belastinggrondslag en het uiteindelijke te betalen bedrag op basis van de officiële 2025 Belastingdienst tarieven." }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Hoe bereken ik mijn Box 3 belasting?",
      "description": "Stap voor stap berekening van Box 3 vermogensbelasting met de gratis calculator op 2e-woning.nl",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Vul uw vermogen in", "text": "Voer uw spaargeld, beleggingen, tweede woning en eventuele andere bezittingen in." },
        { "@type": "HowToStep", "position": 2, "name": "Voer uw schulden in", "text": "Vul schulden in die meetellen voor Box 3 (exclusief hypotheek op eigen woning)." },
        { "@type": "HowToStep", "position": 3, "name": "Geef aan of u een fiscaal partner heeft", "text": "Met een fiscaal partner verdubbelt het heffingvrij vermogen naar €114.000." },
        { "@type": "HowToStep", "position": 4, "name": "Bereken en bekijk het resultaat", "text": "Klik op Bereken en u ziet direct uw geschatte Box 3 belasting met stapsgewijze toelichting." }
      ]
    }
  ];

  return (
    <>
      <NextSeo
        title={t('title')}
        description={t('subtitle')}
        openGraph={{ title: t('title'), description: t('subtitle') }}
      />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-appleGray-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent-500/6 blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              Belastingcalculator 2025
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold text-appleGray-900 mb-4 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-xl text-appleGray-500 max-w-xl mx-auto mb-8 leading-relaxed">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {TRUST_BADGES.map((b) => (
                <span key={b.label} className="inline-flex items-center gap-1.5 bg-white border border-appleGray-100 text-appleGray-600 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                  <span className="text-accent-500 font-bold">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>
            <div className="mt-5">
              <Link href="/box3-tips" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('moreLezen.items.1.title')}
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-16">
          {/* data-no-auto-ads tells AdSense Auto Ads to skip injecting inside the calculator.
              Configure the CSS selector "[data-no-auto-ads]" as an exclusion zone in your
              AdSense dashboard → Auto Ads → Excluded areas. */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-no-auto-ads>
            {/* Calculator form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-2xl font-semibold text-appleGray-900 mb-6">{t('assets.title')}</h2>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-appleGray-400 uppercase tracking-wider mb-4">{t('assets.possessions')}</h3>
                  <InputField label={t('assets.bankSavings')} value={assets.bankSavings} onChange={(v) => handleInputChange('bankSavings', v)} />
                  <InputField label={t('assets.investments')} value={assets.investments} onChange={(v) => handleInputChange('investments', v)} />
                  {/* Property list — multiple second homes with NL / treaty / no-treaty selector */}
                  <div className="mb-6">
                    <p className="block text-appleGray-700 mb-3 font-medium text-base">{t('assets.propertiesTitle')}</p>
                    <div className="space-y-3">
                      {propertyEntries.map((entry, index) => (
                        <div key={entry.id} className="bg-appleGray-50 rounded-xl border border-appleGray-100 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-appleGray-500">
                              Woning {index + 1}
                            </span>
                            {propertyEntries.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePropertyEntry(entry.id)}
                                className="text-appleGray-300 hover:text-red-400 transition-colors p-0.5"
                                title={t('assets.removeProperty')}
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </div>
                          {/* Location toggle */}
                          <div className="flex rounded-lg border border-appleGray-200 overflow-hidden text-xs font-medium mb-2">
                            {(['nl', 'treaty', 'noTreaty'] as PropertyLocation[]).map((loc) => (
                              <button
                                key={loc}
                                type="button"
                                className={`flex-1 px-2 py-1.5 transition-colors ${entry.location === loc ? 'bg-accent-500 text-white' : 'bg-white text-appleGray-500 hover:bg-appleGray-100'}`}
                                onClick={() => updatePropertyEntry(entry.id, 'location', loc)}
                              >
                                {loc === 'nl' ? t('assets.netherlands') : loc === 'treaty' ? t('assets.treatyCountry') : t('assets.noTreatyCountry')}
                              </button>
                            ))}
                          </div>
                          {/* Value input — show raw number while focused to avoid Dutch . separator breaking parseFloat */}
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-appleGray-400 text-lg pointer-events-none">€</span>
                            <input
                              type="text"
                              inputMode="decimal"
                              value={focusedPropertyId === entry.id
                                ? (entry.value === 0 ? '' : String(entry.value))
                                : (entry.value === 0 ? '' : entry.value.toLocaleString('nl-NL'))}
                              onFocus={() => setFocusedPropertyId(entry.id)}
                              onBlur={() => setFocusedPropertyId(null)}
                              onChange={e => {
                                const sanitized = e.target.value.replace(/[^0-9]/g, '');
                                updatePropertyEntry(entry.id, 'value', parseInt(sanitized, 10) || 0);
                              }}
                              placeholder="0"
                              className="w-full pl-10 pr-4 py-3 border border-appleGray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-base transition-all hover:border-appleGray-300"
                            />
                          </div>
                          {/* Mortgage toggle — only for NL properties */}
                          {entry.location === 'nl' && (
                            <div className="mt-2">
                              <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex-shrink-0">
                                  <input
                                    type="checkbox"
                                    checked={entry.hasMortgage}
                                    onChange={e => updatePropertyEntry(entry.id, 'hasMortgage', e.target.checked)}
                                    className="sr-only"
                                  />
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${entry.hasMortgage ? 'bg-accent-500 border-accent-500' : 'border-appleGray-300 group-hover:border-accent-400'}`}>
                                    {entry.hasMortgage && (
                                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-appleGray-600">{t('debts.hasMortgage')}</span>
                              </label>
                              {entry.hasMortgage && (
                                <div className="mt-2">
                                  <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-appleGray-400 text-lg pointer-events-none">€</span>
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      placeholder={t('debts.mortgageAmount')}
                                      value={focusedMortgageId === entry.id
                                        ? (entry.mortgage === 0 ? '' : String(entry.mortgage))
                                        : (entry.mortgage === 0 ? '' : entry.mortgage.toLocaleString('nl-NL'))}
                                      onFocus={() => setFocusedMortgageId(entry.id)}
                                      onBlur={() => setFocusedMortgageId(null)}
                                      onChange={e => {
                                        const sanitized = e.target.value.replace(/[^0-9]/g, '');
                                        updatePropertyEntry(entry.id, 'mortgage', parseInt(sanitized, 10) || 0);
                                      }}
                                      className="w-full pl-10 pr-4 py-2.5 border border-appleGray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm transition-all hover:border-appleGray-300"
                                    />
                                  </div>
                                  <p className="mt-1 text-xs text-appleGray-400 leading-relaxed">{t('debts.mortgageNote')}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {entry.location === 'treaty' && (
                            <p className="mt-2 text-xs text-appleGray-400 leading-relaxed">{t('assets.treatyNote')}</p>
                          )}
                          {entry.location === 'noTreaty' && (
                            <p className="mt-2 text-xs text-appleGray-400 leading-relaxed">{t('assets.noTreatyNote')}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addPropertyEntry}
                      className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      {t('assets.addProperty')}
                    </button>
                  </div>
                  <InputField label={t('assets.otherAssets')} value={assets.otherAssets} onChange={(v) => handleInputChange('otherAssets', v)} optional />
                  <InputField label={t('assets.greenInvestments')} value={assets.greenInvestments} onChange={(v) => handleInputChange('greenInvestments', v)} optional />
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-appleGray-400 uppercase tracking-wider mb-4">{t('debts.title')}</h3>
                  <InputField label={t('debts.otherDebtsLabel')} value={otherDebts} onChange={handleOtherDebtsChange} />
                </div>

                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-appleGray-400 uppercase tracking-wider mb-4">{t('personal.title')}</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={hasFiscalPartner}
                        onChange={(e) => {
                          setHasFiscalPartner(e.target.checked);
                          if (showResults) setShowResults(false);
                        }}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${hasFiscalPartner ? 'bg-accent-500 border-accent-500' : 'border-appleGray-300 group-hover:border-accent-400'}`}>
                        {hasFiscalPartner && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-appleGray-700 text-base">{t('personal.fiscalPartner')}</span>
                  </label>
                </div>

                <div className="flex flex-wrap gap-3 pt-2 border-t border-appleGray-100">
                  <button onClick={handleCalculate} className="btn btn-primary">
                    {t('buttons.calculate')}
                  </button>
                  <button onClick={handleReset} className="btn btn-outline">
                    {t('buttons.reset')}
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="btn btn-outline ml-auto flex items-center gap-2"
                    title={t('buttons.copyLink')}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-accent-500 text-sm">{t('buttons.copied')}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="text-sm">{t('buttons.copyLink')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <CompanyInfo />
            </div>

            {/* Results sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {showResults && calculationResult ? (
                <>
                  <ResultCard
                    result={calculationResult}
                    result2024={result2024 ?? undefined}
                    alternativeTaxAmount={alternativeTaxAmount}
                    alternativeHasFiscalPartner={!hasFiscalPartner}
                    assets={assets}
                    hasFiscalPartner={hasFiscalPartner}
                  />
                  <EmailCapture />
                </>
              ) : (
                <div className="card border-dashed border-appleGray-200 bg-appleGray-50 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-appleGray-700 mb-1">{t('placeholder.title')}</h3>
                  <p className="text-sm text-appleGray-400 max-w-[200px]">{t('placeholder.description')}</p>
                </div>
              )}

            </div>
          </div>

          {/* About section */}
          <div className="mt-10 card">
            <h2 className="text-xl font-semibold text-appleGray-900 mb-5">{t('about.title')}</h2>
            <div className="text-appleGray-600 text-sm leading-relaxed space-y-4 max-w-3xl">
              <p>{t('about.p1')}</p>
              <p dangerouslySetInnerHTML={{ __html: t('about.p2') }} />
              <p>{t('about.p3')}</p>
              <p dangerouslySetInnerHTML={{ __html: t('about.p4') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.p5') }} />
              <div className="grid grid-cols-3 gap-3 pt-2">
                {rateGridItems.map((r) => (
                  <div key={r.label} className="bg-appleGray-50 rounded-xl p-3 border border-appleGray-100 text-center">
                    <p className="text-xs text-appleGray-400 mb-1">{r.label}</p>
                    <p className="text-lg font-bold text-appleGray-800">{r.rate}</p>
                    <p className="text-xs text-appleGray-400">{t('about.rateNote')}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-appleGray-400 pt-1">
                {t('about.source')}:{' '}
                <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2024" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">
                  Belastingdienst
                </a>
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8 card">
            <h2 className="text-xl font-semibold text-appleGray-900 mb-6">{t('faq.title')}</h2>
            <div className="space-y-6">
              {faqItems.map((item) => (
                <div key={item.q} className="border-b border-appleGray-100 pb-5 last:border-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-appleGray-800 mb-2">{item.q}</h3>
                  <p className="text-sm text-appleGray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Article links */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('moreLezen.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {moreLezenItems.map((a) => (
                <a key={a.href} href={a.href} className="card hover:shadow-lg transition-shadow group block no-underline">
                  <p className="text-sm font-semibold text-appleGray-900 group-hover:text-accent-500 transition-colors mb-1">{a.title}</p>
                  <p className="text-xs text-appleGray-400 leading-relaxed">{a.desc}</p>
                </a>
              ))}
            </div>
          </div>

          <AdBanner client={GOOGLE_ADSENSE_CLIENT} slot={GOOGLE_ADSENSE_SLOT_HORIZONTAL} className="mt-8" />
        </div>
      </main>
    </>
  );
};

export default Home;
