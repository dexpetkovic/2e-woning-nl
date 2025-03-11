import React, { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import InputField from '@/components/InputField';
import ResultCard from '@/components/ResultCard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AdBanner from '@/components/AdBanner';
import CompanyInfo from '@/components/CompanyInfo';
import { Assets, calculateBox3Tax, TaxCalculationResult } from '@/utils/taxCalculations';

// Get Google AdSense client ID and ad slot IDs from environment variables
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
    return {
      props: {},
    };
  }
};

export default function Home() {
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
    setAssets((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Hide results when inputs change
    if (showResults) {
      setShowResults(false);
    }
  };

  const handleCalculate = () => {
    const result = calculateBox3Tax(assets, hasFiscalPartner);
    setCalculationResult(result);
    setShowResults(true);
  };

  const handleReset = () => {
    setAssets({
      bankSavings: 0,
      investments: 0,
      properties: 0,
      otherAssets: 0,
      greenInvestments: 0,
      debts: 0,
    });
    setHasFiscalPartner(false);
    setShowResults(false);
    setCalculationResult(null);
  };

  return (
    <>
      <Head>
        <title>{t('title')} | 2e-woning.nl</title>
        <meta name="description" content={t('subtitle')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-10 flex flex-col items-center">
            <div className="self-end mb-4">
              <LanguageSwitcher />
            </div>
            <h1 className="text-4xl font-bold text-primary-800 mb-2">{t('title')}</h1>
            <p className="text-lg text-neutral-600">
              {t('subtitle')}
            </p>
          </header>

          {/* Top horizontal ad */}
          <AdBanner
            client={GOOGLE_ADSENSE_CLIENT}
            slot={GOOGLE_ADSENSE_SLOT_HORIZONTAL}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Input form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-2xl font-semibold text-primary-700 mb-6">{t('assets.title')}</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-4">{t('assets.possessions')}</h3>
                  
                  <InputField
                    label={t('assets.bankSavings')}
                    value={assets.bankSavings}
                    onChange={(value) => handleInputChange('bankSavings', value)}
                  />
                  
                  <InputField
                    label={t('assets.investments')}
                    value={assets.investments}
                    onChange={(value) => handleInputChange('investments', value)}
                  />
                  
                  <InputField
                    label={t('assets.properties')}
                    value={assets.properties}
                    onChange={(value) => handleInputChange('properties', value)}
                  />
                  
                  <InputField
                    label={t('assets.otherAssets')}
                    value={assets.otherAssets}
                    onChange={(value) => handleInputChange('otherAssets', value)}
                    optional
                  />
                  
                  <InputField
                    label={t('assets.greenInvestments')}
                    value={assets.greenInvestments}
                    onChange={(value) => handleInputChange('greenInvestments', value)}
                    optional
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-4">{t('debts.title')}</h3>
                  
                  <InputField
                    label={t('debts.debts')}
                    value={assets.debts}
                    onChange={(value) => handleInputChange('debts', value)}
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-4">{t('personal.title')}</h3>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hasFiscalPartner}
                        onChange={(e) => {
                          setHasFiscalPartner(e.target.checked);
                          if (showResults) {
                            setShowResults(false);
                          }
                        }}
                        className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-neutral-700">{t('personal.fiscalPartner')}</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={handleCalculate}
                    className="btn btn-primary"
                  >
                    {t('buttons.calculate')}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="btn btn-outline"
                  >
                    {t('buttons.reset')}
                  </button>
                </div>
              </div>

              {/* Company information */}
              <CompanyInfo />
            </div>
            
            {/* Right column - Results or placeholder + vertical ad */}
            <div className="lg:col-span-1 space-y-8">
              {showResults && calculationResult && (
                <ResultCard result={calculationResult} />
              )}
              
              {!showResults && (
                <div className="card bg-primary-50 border border-primary-100">
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div className="text-primary-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-primary-800 mb-2">
                      {t('placeholder.title')}
                    </h3>
                    <p className="text-primary-600">
                      {t('placeholder.description')}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Vertical ad */}
              <AdBanner
                client={GOOGLE_ADSENSE_CLIENT}
                slot={GOOGLE_ADSENSE_SLOT_VERTICAL}
                format="vertical"
              />
            </div>
          </div>
          
          <div className="mt-12 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-primary-700 mb-4">{t('about.title')}</h2>
            <div className="prose max-w-none text-neutral-700">
              <p>
                {t('about.description')}
              </p>
              <p className="mt-4">
                {t('about.rates')}
              </p>
              <ul className="mt-2 list-disc pl-5">
                <li><strong>{t('about.bankSavings')}:</strong> 1,44%</li>
                <li><strong>{t('about.investments')}:</strong> 6,04%</li>
                <li><strong>{t('about.debts')}:</strong> 2,61%</li>
              </ul>
              <p className="mt-4">
                {t('about.taxRate')}
              </p>
              <p className="mt-4">
                {t('about.taxFreeAmount')}
              </p>
              <p className="mt-4 text-sm text-neutral-500">
                {t('about.source')}: <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2024" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Belastingdienst</a>
              </p>
            </div>
          </div>
          
          {/* Bottom horizontal ad */}
          <AdBanner
            client={GOOGLE_ADSENSE_CLIENT}
            slot={GOOGLE_ADSENSE_SLOT_HORIZONTAL}
            className="mt-8"
          />
        </div>
      </main>
      
      <footer className="bg-neutral-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">2e-woning.nl</h2>
              <p className="text-neutral-400 mt-1">{t('footer.taxCalculator')}</p>
            </div>
            <div className="text-neutral-400 text-sm">
              <p>{t('footer.copyright')}</p>
              <p className="mt-1">
                {t('footer.disclaimer')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 