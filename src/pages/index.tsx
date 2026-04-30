import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import InputField from '@/components/InputField';
import ResultCard from '@/components/ResultCard';
import AdBanner from '@/components/AdBanner';
import CompanyInfo from '@/components/CompanyInfo';
import { Assets, calculateBox3Tax, TaxCalculationResult } from '@/utils/taxCalculations';
import { NextSeo } from 'next-seo';
import Script from 'next/script';
import { trackEvent, AnalyticsEvent } from '@/utils/analytics';

const GOOGLE_ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || '';
const GOOGLE_ADSENSE_SLOT_HORIZONTAL = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_HORIZONTAL || '';
const GOOGLE_ADSENSE_SLOT_VERTICAL = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_VERTICAL || '';

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

const Home = () => {
  const { t } = useTranslation('common');

  const [assets, setAssets] = useState<Assets>({
    bankSavings: 0,
    investments: 0,
    properties: 0,
    otherAssets: 0,
    greenInvestments: 0,
    debts: 0,
  });

  const [hasFiscalPartner, setHasFiscalPartner] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);

  const handleInputChange = (field: keyof Assets, value: number) => {
    setAssets((prev) => ({ ...prev, [field]: value }));
    trackEvent(AnalyticsEvent.UPDATE_ASSET, { assetType: field, assetValue: value });
    if (showResults) setShowResults(false);
  };

  const handleCalculate = () => {
    const result = calculateBox3Tax(assets, hasFiscalPartner);
    setCalculationResult(result);
    setShowResults(true);
    trackEvent(AnalyticsEvent.CALCULATE_TAX, {
      hasFiscalPartner,
      totalAssets: Object.values(assets).reduce((sum, v) => sum + v, 0) - assets.debts,
      totalDebts: assets.debts,
      taxAmount: result.taxAmount,
    });
  };

  const handleReset = () => {
    setAssets({ bankSavings: 0, investments: 0, properties: 0, otherAssets: 0, greenInvestments: 0, debts: 0 });
    setHasFiscalPartner(false);
    setShowResults(false);
    setCalculationResult(null);
    trackEvent(AnalyticsEvent.RESET_CALCULATOR);
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
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Box 3 is de belastingcategorie voor vermogen buiten de eigen woning en de onderneming. U betaalt belasting over een fictief rendement op spaargeld, beleggingen, tweede woningen en andere vermogensbestanddelen."
          }
        },
        {
          "@type": "Question",
          "name": "Wat is het heffingvrij vermogen in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In 2025 is het heffingvrij vermogen €57.000 per persoon. Voor fiscale partners samen is dit €114.000. Over vermogen onder dit bedrag betaalt u geen Box 3 belasting."
          }
        },
        {
          "@type": "Question",
          "name": "Wat zijn de Box 3 tarieven in 2025?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "De fictieve rendementspercentages voor 2025 zijn: spaargeld 1,44%, beleggingen 6,04%, schulden 2,61%. Over het berekende fictieve rendement betaalt u 36% belasting."
          }
        },
        {
          "@type": "Question",
          "name": "Hoe werkt de Box 3 calculator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Vul uw spaargeld, beleggingen, tweede woning en schulden in. De calculator berekent automatisch uw belastbare rendement, de belastinggrondslag en het uiteindelijke te betalen bedrag op basis van de officiële 2025 Belastingdienst tarieven."
          }
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
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 bg-white border border-appleGray-100 text-appleGray-600 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm"
                >
                  <span className="text-accent-500 font-bold">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-16">
          <AdBanner
            client={GOOGLE_ADSENSE_CLIENT}
            slot={GOOGLE_ADSENSE_SLOT_HORIZONTAL}
            className="mb-12"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-2xl font-semibold text-appleGray-900 mb-6">{t('assets.title')}</h2>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-appleGray-500 uppercase tracking-wider mb-4">{t('assets.possessions')}</h3>
                  <InputField label={t('assets.bankSavings')} value={assets.bankSavings} onChange={(v) => handleInputChange('bankSavings', v)} />
                  <InputField label={t('assets.investments')} value={assets.investments} onChange={(v) => handleInputChange('investments', v)} />
                  <InputField label={t('assets.properties')} value={assets.properties} onChange={(v) => handleInputChange('properties', v)} />
                  <InputField label={t('assets.otherAssets')} value={assets.otherAssets} onChange={(v) => handleInputChange('otherAssets', v)} optional />
                  <InputField label={t('assets.greenInvestments')} value={assets.greenInvestments} onChange={(v) => handleInputChange('greenInvestments', v)} optional />
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-appleGray-500 uppercase tracking-wider mb-4">{t('debts.title')}</h3>
                  <InputField label={t('debts.debts')} value={assets.debts} onChange={(v) => handleInputChange('debts', v)} />
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-appleGray-500 uppercase tracking-wider mb-4">{t('personal.title')}</h3>
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

                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-appleGray-100">
                  <button onClick={handleCalculate} className="btn btn-primary flex-1 sm:flex-none">
                    {t('buttons.calculate')}
                  </button>
                  <button onClick={handleReset} className="btn btn-outline">
                    {t('buttons.reset')}
                  </button>
                </div>
              </div>

              <CompanyInfo />
            </div>

            {/* Results sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {showResults && calculationResult ? (
                <ResultCard result={calculationResult} />
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

              <AdBanner
                client={GOOGLE_ADSENSE_CLIENT}
                slot={GOOGLE_ADSENSE_SLOT_VERTICAL}
                format="vertical"
              />
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
                <a
                  href="https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2024"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-500 hover:underline"
                >
                  Belastingdienst
                </a>
              </p>
            </div>
          </div>

          <AdBanner
            client={GOOGLE_ADSENSE_CLIENT}
            slot={GOOGLE_ADSENSE_SLOT_HORIZONTAL}
            className="mt-8"
          />
        </div>
      </main>
    </>
  );
};

export default Home;
