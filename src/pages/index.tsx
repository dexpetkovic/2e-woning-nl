import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
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
  otherAssets: 0,
  greenInvestments: 0,
  debts: 0,
};

const Home = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const didInitFromUrl = useRef(false);

  const [assets, setAssets] = useState<Assets>(EMPTY_ASSETS);
  const [hasFiscalPartner, setHasFiscalPartner] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);
  const [result2024, setResult2024] = useState<TaxCalculationResult | null>(null);
  const [alternativeTaxAmount, setAlternativeTaxAmount] = useState<number | undefined>(undefined);

  // Initialise form from URL query params (shareable links)
  useEffect(() => {
    if (didInitFromUrl.current) return;
    didInitFromUrl.current = true;
    const p = new URLSearchParams(window.location.search);
    const fromUrl: Assets = {
      bankSavings: parseFloat(p.get('bs') || '0') || 0,
      investments: parseFloat(p.get('inv') || '0') || 0,
      properties: parseFloat(p.get('prop') || '0') || 0,
      otherAssets: parseFloat(p.get('oth') || '0') || 0,
      greenInvestments: parseFloat(p.get('gri') || '0') || 0,
      debts: parseFloat(p.get('dbt') || '0') || 0,
    };
    const fp = p.get('fp') === '1';
    if (Object.values(fromUrl).some((v) => v > 0)) {
      setAssets(fromUrl);
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

  const buildShareUrl = (currentAssets: Assets, fp: boolean): string => {
    const p = new URLSearchParams();
    if (currentAssets.bankSavings) p.set('bs', String(currentAssets.bankSavings));
    if (currentAssets.investments) p.set('inv', String(currentAssets.investments));
    if (currentAssets.properties) p.set('prop', String(currentAssets.properties));
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
                  <InputField label={t('assets.properties')} value={assets.properties} onChange={(v) => handleInputChange('properties', v)} />
                  <InputField label={t('assets.otherAssets')} value={assets.otherAssets} onChange={(v) => handleInputChange('otherAssets', v)} optional />
                  <InputField label={t('assets.greenInvestments')} value={assets.greenInvestments} onChange={(v) => handleInputChange('greenInvestments', v)} optional />
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-appleGray-400 uppercase tracking-wider mb-4">{t('debts.title')}</h3>
                  <InputField label={t('debts.debts')} value={assets.debts} onChange={(v) => handleInputChange('debts', v)} />
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
            <h2 className="text-xl font-semibold text-appleGray-900 mb-4">{t('about.title')}</h2>
            <div className="text-appleGray-600 text-sm leading-relaxed space-y-3">
              <p>{t('about.description')}</p>
              <p>{t('about.rates')}</p>
              <ul className="space-y-1 pl-4">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                  <span><strong className="text-appleGray-700">{t('about.bankSavings')}:</strong> 1,44%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                  <span><strong className="text-appleGray-700">{t('about.investments')}:</strong> 6,04%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                  <span><strong className="text-appleGray-700">{t('about.debts')}:</strong> 2,61%</span>
                </li>
              </ul>
              <p>{t('about.taxRate')}</p>
              <p>{t('about.taxFreeAmount')}</p>
              <p className="text-appleGray-400 text-xs pt-1">
                {t('about.source')}:{' '}
                <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2024" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">
                  Belastingdienst
                </a>
              </p>
            </div>
          </div>

          <AdBanner client={GOOGLE_ADSENSE_CLIENT} slot={GOOGLE_ADSENSE_SLOT_HORIZONTAL} className="mt-8" />
        </div>
      </main>
    </>
  );
};

export default Home;
