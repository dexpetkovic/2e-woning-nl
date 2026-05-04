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

          {/* About section — expanded */}
          <div className="mt-10 card">
            <h2 className="text-xl font-semibold text-appleGray-900 mb-5">Over Box 3 belasting</h2>
            <div className="text-appleGray-600 text-sm leading-relaxed space-y-4 max-w-3xl">
              <p>
                Box 3 is het belastingvak voor vermogen buiten je eigen woning en je bedrijf. Spaargeld, beleggingen, een tweede woning, verhuurde panden — dat valt allemaal in Box 3. De meeste mensen komen er pas echt mee in aanraking als ze iets opbouwen dat boven het heffingvrij vermogen uitkomt.
              </p>
              <p>
                Het bijzondere — en voor velen frustrerende — aan Box 3 is dat de Belastingdienst niet kijkt naar wat je daadwerkelijk hebt verdiend. Ze gaan uit van een <strong className="text-appleGray-700">fictief rendement</strong>: een percentage dat je geacht wordt te behalen, ongeacht wat er werkelijk is gebeurd. Over dat fictieve rendement betaal je vervolgens 36% belasting.
              </p>
              <p>
                Dat fictieve rendement is opgesplitst per vermogenscategorie. Spaargeld krijgt een laag percentage (1,44% in 2025) omdat de spaarrentes laag zijn. Beleggingen en onroerend goed krijgen een hoger percentage (6,04%), omdat je geacht wordt meer risico te nemen en daarvoor beloond te worden. Schulden zijn aftrekbaar tegen 2,61%.
              </p>
              <p>
                Er is ook een vrijstelling: het <strong className="text-appleGray-700">heffingvrij vermogen van €57.000 per persoon</strong>. Zit je eronder, dan betaal je niks. Heb je een fiscale partner, dan is die grens samen €114.000. Veel mensen met alleen spaargeld zitten dus gewoon onder die grens.
              </p>
              <p>
                Dit systeem bestaat in de huidige vorm pas since 2023. Het oude systeem gebruikte één vast fictief rendement voor alles — en dat leidde in december 2021 tot het Kerstarrest van de Hoge Raad, die oordeelde dat het in strijd was met Europees recht. Sindsdien is er een overbruggingsstelsel van kracht. Een nieuw systeem op basis van werkelijk rendement staat gepland voor 2027 (of later, we zullen zien).
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: 'Spaargeld', rate: '1,44%' },
                  { label: 'Beleggingen & vastgoed', rate: '6,04%' },
                  { label: 'Schulden', rate: '2,61%' },
                ].map((r) => (
                  <div key={r.label} className="bg-appleGray-50 rounded-xl p-3 border border-appleGray-100 text-center">
                    <p className="text-xs text-appleGray-400 mb-1">{r.label}</p>
                    <p className="text-lg font-bold text-appleGray-800">{r.rate}</p>
                    <p className="text-xs text-appleGray-400">fictief rendement 2025</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-appleGray-400 pt-1">
                Bron:{' '}
                <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2024" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">
                  Belastingdienst
                </a>
              </p>
            </div>
          </div>

          {/* FAQ — visible for AdSense + SEO */}
          <div className="mt-8 card">
            <h2 className="text-xl font-semibold text-appleGray-900 mb-6">Veelgestelde vragen over Box 3</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Telt mijn eigen woning mee voor Box 3?',
                  a: 'Nee. Je eigen woning en de bijbehorende hypotheekschuld vallen in Box 1, niet in Box 3. Alleen tweede woningen, vakantiehuisjes en verhuurde panden horen in Box 3 thuis.',
                },
                {
                  q: 'Hoe werkt het heffingvrij vermogen precies?',
                  a: 'Het heffingvrij vermogen (€57.000 per persoon in 2025) is een drempel. Zit je totale Box 3-vermogen na aftrek van schulden onder dit bedrag, dan betaal je niks. Met een fiscale partner is de grens samen €114.000 — en jullie mogen het vermogen onderling verdelen op de gunstigste manier.',
                },
                {
                  q: 'Hoe zit het met schulden?',
                  a: 'Schulden mag je aftrekken van je vermogen, maar niet volledig. Er is een drempel: de eerste €3.700 aan schulden (of €7.400 met partner) telt niet mee. Alles daarboven vermindert je belastbare grondslag. Let op: hypotheekschuld op je eigen woning hoort bij Box 1 en telt hier niet mee.',
                },
                {
                  q: 'Zijn groene beleggingen anders behandeld?',
                  a: 'Ja. Groene beleggingen zijn tot €71.251 per persoon vrijgesteld van Box 3 (€142.502 met partner). Als je bewust in duurzame fondsen belegt, scheelt dat direct in je belastinggrondslag.',
                },
                {
                  q: 'Is deze berekening hetzelfde als mijn definitieve aanslag?',
                  a: 'Nee, dit is een indicatie. De Belastingdienst berekent je definitieve aanslag op basis van je ingediende aangifte en kan daarin afwijken. Gebruik dit als richtlijn — niet als bindende uitkomst.',
                },
              ].map((item) => (
                <div key={item.q} className="border-b border-appleGray-100 pb-5 last:border-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-appleGray-800 mb-2">{item.q}</h3>
                  <p className="text-sm text-appleGray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Article links */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">Meer lezen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/box3-uitleg', title: 'Box 3 uitgelegd', desc: 'Wat het is, hoe het werkt en waarom het zo ingewikkeld lijkt.' },
                { href: '/box3-tips', title: 'Zo verlaag je je Box 3 belasting', desc: '5 legale manieren om minder te betalen.' },
                { href: '/rechtbank', title: 'Box 3 & de Rechter', desc: 'Van het Kerstarrest tot het nieuwe stelsel in 2027.' },
              ].map((a) => (
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
