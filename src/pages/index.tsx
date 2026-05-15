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
import { Assets, TaxYear, calculateBox3TaxForYear, TaxCalculationResult, TAX_RATES_2024, TAX_RATES_2025, TAX_RATES_2026 } from '@/utils/taxCalculations';
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

const EMPTY_ASSETS: Assets = {
  bankSavings: 0,
  investments: 0,
  properties: 0,
  foreignTreatyProperties: 0,
  otherAssets: 0,
  greenInvestments: 0,
  debts: 0,
};

const fmtEUR = (n: number) => {
  if (!isFinite(n)) n = 0;
  return new Intl.NumberFormat('nl-NL').format(Math.round(n));
};

const pctNL = (n: number) => (n * 100).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';

const RATES_BY_YEAR: Record<TaxYear, { savings: string; invest: string; debt: string }> = {
  '2024': { savings: pctNL(TAX_RATES_2024.BANK_SAVINGS_RATE), invest: pctNL(TAX_RATES_2024.INVESTMENTS_RATE), debt: pctNL(TAX_RATES_2024.DEBT_RATE) },
  '2025': { savings: pctNL(TAX_RATES_2025.BANK_SAVINGS_RATE), invest: pctNL(TAX_RATES_2025.INVESTMENTS_RATE), debt: pctNL(TAX_RATES_2025.DEBT_RATE) },
  '2026': { savings: pctNL(TAX_RATES_2026.BANK_SAVINGS_RATE), invest: pctNL(TAX_RATES_2026.INVESTMENTS_RATE), debt: pctNL(TAX_RATES_2026.DEBT_RATE) },
};

type FaqItem = { q: string; a: string };
type MoreLezenItem = { href: string; title: string; desc: string };
type PropertyLocation = 'nl' | 'treaty' | 'noTreaty';
type PropertyEntry = { id: string; value: number; location: PropertyLocation; mortgage: number; hasMortgage: boolean; isPrimaryResidence: boolean };

const Home = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const faqItems = t('faq.items', { returnObjects: true }) as FaqItem[];
  const moreLezenItems = t('moreLezen.items', { returnObjects: true }) as MoreLezenItem[];
  const [copied, setCopied] = useState(false);
  const didInitFromUrl = useRef(false);

  const [assets, setAssets] = useState<Assets>(EMPTY_ASSETS);
  const [hasFiscalPartner, setHasFiscalPartner] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<TaxCalculationResult | null>(null);
  const [resultPrevYear, setResultPrevYear] = useState<TaxCalculationResult | null>(null);
  const [alternativeTaxAmount, setAlternativeTaxAmount] = useState<number | undefined>(undefined);

  const [selectedYear, setSelectedYear] = useState<TaxYear>('2025');

  const [propertyEntries, setPropertyEntries] = useState<PropertyEntry[]>([
    { id: '1', value: 0, location: 'nl', mortgage: 0, hasMortgage: false, isPrimaryResidence: false },
  ]);
  const [focusedPropertyId, setFocusedPropertyId] = useState<string | null>(null);
  const [focusedMortgageId, setFocusedMortgageId] = useState<string | null>(null);
  const [otherDebts, setOtherDebts] = useState(0);

  // Live preview (always-on rough preview shown above the formal "Bereken" result)
  const previewResult = (() => {
    try {
      return calculateBox3TaxForYear(assets, hasFiscalPartner, selectedYear);
    } catch {
      return null;
    }
  })();

  const syncPropertyTotals = (entries: PropertyEntry[], oDebts = otherDebts) => {
    const nlTotal = entries.filter(e => e.location === 'nl' && !e.isPrimaryResidence).reduce((s, e) => s + e.value, 0);
    const ftpTotal = entries.filter(e => e.location !== 'nl').reduce((s, e) => s + e.value, 0);
    const mortgageTotal = entries.filter(e => !e.isPrimaryResidence).reduce((s, e) => s + (e.hasMortgage ? e.mortgage : 0), 0);
    setAssets(a => ({ ...a, properties: nlTotal, foreignTreatyProperties: ftpTotal, debts: oDebts + mortgageTotal }));
  };

  const addPropertyEntry = () => {
    setPropertyEntries(prev => [...prev, { id: Date.now().toString(), value: 0, location: 'nl', mortgage: 0, hasMortgage: false, isPrimaryResidence: false }]);
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
        if (field === 'isPrimaryResidence' && val === true && e.id !== id) {
          return { ...e, isPrimaryResidence: false };
        }
        if (e.id !== id) return e;
        const next = { ...e, [field]: val };
        if (field === 'hasMortgage' && val === false) next.mortgage = 0;
        if (field === 'isPrimaryResidence' && val === true) {
          next.location = 'nl';
          next.hasMortgage = false;
          next.mortgage = 0;
        }
        if (field === 'location' && val !== 'nl') {
          next.isPrimaryResidence = false;
        }
        return next;
      });
      syncPropertyTotals(updated);
      return updated;
    });
    if (showResults) setShowResults(false);
  };

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
      const entries: PropertyEntry[] = [];
      if (fromUrl.properties > 0) entries.push({ id: '1', value: fromUrl.properties, location: 'nl', mortgage: 0, hasMortgage: false, isPrimaryResidence: false });
      if (fromUrl.foreignTreatyProperties > 0) entries.push({ id: '2', value: fromUrl.foreignTreatyProperties, location: 'treaty', mortgage: 0, hasMortgage: false, isPrimaryResidence: false });
      if (entries.length > 0) setPropertyEntries(entries);
      if (fromUrl.debts > 0) setOtherDebts(fromUrl.debts);
      const urlYear = (p.get('yr') as TaxYear) || '2025';
      setSelectedYear(urlYear);
      setHasFiscalPartner(fp);
      const r = calculateBox3TaxForYear(fromUrl, fp, urlYear);
      setCalculationResult(r);
      const urlPrevYear = urlYear === '2026' ? '2025' : urlYear === '2025' ? '2024' : null;
      setResultPrevYear(urlPrevYear ? calculateBox3TaxForYear(fromUrl, fp, urlPrevYear) : null);
      setAlternativeTaxAmount(calculateBox3TaxForYear(fromUrl, !fp, urlYear).taxAmount);
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

  const buildShareUrl = (currentAssets: Assets, fp: boolean, year: TaxYear): string => {
    const p = new URLSearchParams();
    if (currentAssets.bankSavings) p.set('bs', String(currentAssets.bankSavings));
    if (currentAssets.investments) p.set('inv', String(currentAssets.investments));
    if (currentAssets.properties) p.set('prop', String(currentAssets.properties));
    if (currentAssets.foreignTreatyProperties) p.set('ftp', String(currentAssets.foreignTreatyProperties));
    if (currentAssets.otherAssets) p.set('oth', String(currentAssets.otherAssets));
    if (currentAssets.greenInvestments) p.set('gri', String(currentAssets.greenInvestments));
    if (currentAssets.debts) p.set('dbt', String(currentAssets.debts));
    if (fp) p.set('fp', '1');
    if (year !== '2025') p.set('yr', year);
    const base = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
    return `${base}?${p.toString()}`;
  };

  const handleCalculate = () => {
    const r = calculateBox3TaxForYear(assets, hasFiscalPartner, selectedYear);
    const prevYear = selectedYear === '2026' ? '2025' : selectedYear === '2025' ? '2024' : null;
    const rPrev = prevYear ? calculateBox3TaxForYear(assets, hasFiscalPartner, prevYear) : null;
    const altAmount = calculateBox3TaxForYear(assets, !hasFiscalPartner, selectedYear).taxAmount;

    setCalculationResult(r);
    setResultPrevYear(rPrev);
    setAlternativeTaxAmount(altAmount);
    setShowResults(true);

    router.replace(buildShareUrl(assets, hasFiscalPartner, selectedYear), undefined, { shallow: true });

    trackEvent(AnalyticsEvent.CALCULATE_TAX, {
      hasFiscalPartner,
      totalAssets: Object.values(assets).reduce((s, v) => s + v, 0) - assets.debts,
      totalDebts: assets.debts,
      taxAmount: r.taxAmount,
    });

    // Scroll detailed result into view
    setTimeout(() => {
      document.getElementById('detailed-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleReset = () => {
    setAssets(EMPTY_ASSETS);
    setHasFiscalPartner(false);
    setShowResults(false);
    setCalculationResult(null);
    setResultPrevYear(null);
    setAlternativeTaxAmount(undefined);
    setPropertyEntries([{ id: '1', value: 0, location: 'nl', mortgage: 0, hasMortgage: false, isPrimaryResidence: false }]);
    setOtherDebts(0);
    setSelectedYear('2025');
    router.replace(router.pathname, undefined, { shallow: true });
    trackEvent(AnalyticsEvent.RESET_CALCULATOR);
  };

  const handleCopyLink = () => {
    const url = buildShareUrl(assets, hasFiscalPartner, selectedYear);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Use a single JSON-LD object with @graph for multiple records — some
  // SEO/validator extensions iterate top-level script content and fail on
  // arrays where each entry has its own @context.
  const faqItemsArr = Array.isArray(faqItems) ? faqItems : [];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Box 3 Belastingcalculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "description": "Box 3 belasting uitrekenen voor tweede woning, beleggingen, spaargeld en schulden. Met de actuele tarieven voor 2024, 2025 en 2026 — plus een 2028-schatting onder aanwasbelasting.",
        "author": {
          "@type": "Person",
          "name": "Dejan Petković",
          "url": "https://2e-woning.nl/over",
        },
        "publisher": {
          "@type": "Organization",
          "name": "Elands AI",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItemsArr.map((it) => ({
          "@type": "Question",
          "name": it.q,
          "acceptedAnswer": { "@type": "Answer", "text": it.a },
        })),
      },
    ],
  };

  const currentRates = RATES_BY_YEAR[selectedYear];

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

      <main className="min-h-screen bg-appleGray-50 text-appleGray-900">
        {/* ───────── Hero with inline calculator ───────── */}
        <section className="border-b border-appleGray-200/80" id="calculator">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8 pt-12 pb-6">
            <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-16 items-end">
              {/* Left — editorial headline */}
              <div>
                <div className="eyebrow mb-4">
                  <span className="blip" />
                  Belastingcalculator · {selectedYear}
                </div>
                <h1 className="display-h text-[clamp(46px,6.6vw,96px)] mb-5">
                  Box 3 belasting,<br />
                  <em>zonder de</em> bureaucratie.
                </h1>
                <p className="text-lg text-appleGray-700 max-w-[46ch] mb-7 leading-relaxed">
                  {t('subtitle')}
                </p>
                <div className="ticks">
                  <span>Gratis &amp; anoniem</span>
                  <span>Tarieven {selectedYear}</span>
                  <span>Rekent in je browser</span>
                  <span>Door één persoon onderhouden</span>
                </div>
              </div>

              {/* Right — calculator card */}
              <div data-no-auto-ads>
                <CalculatorCard
                  selectedYear={selectedYear}
                  setSelectedYear={(y) => { setSelectedYear(y); if (showResults) setShowResults(false); }}
                  assets={assets}
                  handleInputChange={handleInputChange}
                  hasFiscalPartner={hasFiscalPartner}
                  setHasFiscalPartner={(v) => { setHasFiscalPartner(v); if (showResults) setShowResults(false); }}
                  propertyEntries={propertyEntries}
                  addPropertyEntry={addPropertyEntry}
                  removePropertyEntry={removePropertyEntry}
                  updatePropertyEntry={updatePropertyEntry}
                  focusedPropertyId={focusedPropertyId}
                  setFocusedPropertyId={setFocusedPropertyId}
                  focusedMortgageId={focusedMortgageId}
                  setFocusedMortgageId={setFocusedMortgageId}
                  otherDebts={otherDebts}
                  handleOtherDebtsChange={handleOtherDebtsChange}
                  previewResult={previewResult}
                  onCalculate={handleCalculate}
                  onCopyLink={handleCopyLink}
                  onReset={handleReset}
                  copied={copied}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ───────── Black rate strip ───────── */}
        <div className="strip" id="tarieven">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-5">
            <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-4">
              <div className="strip-cell"><span>Spaargeld</span><b>{currentRates.savings}</b></div>
              <div className="strip-cell"><span>Beleggingen &amp; vastgoed</span><b>{currentRates.invest}</b></div>
              <div className="strip-cell"><span>Schulden</span><b>{currentRates.debt}</b></div>
              <div className="strip-cell"><span>Heffingvrij vermogen</span><b>€57k</b></div>
              <div className="strip-cell"><span>Belasting over rendement</span><b>36%</b></div>
            </div>
          </div>
        </div>

        {/* ───────── Detailed result panel (after Bereken) ───────── */}
        {showResults && calculationResult && (
          <section id="detailed-result" className="border-b border-appleGray-200/80">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-16">
              <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-12 items-start mb-10">
                <div>
                  <div className="eyebrow mb-2">Volledige berekening</div>
                  <h2 className="section-h-inner font-display text-3xl md:text-5xl font-medium tracking-display leading-[1.02]">
                    Stap voor stap, <em className="not-italic text-accent-500">in beeld</em>.
                  </h2>
                </div>
                <p className="text-lg text-appleGray-700 max-w-[60ch] leading-relaxed">
                  Hieronder zie je precies hoe de Belastingdienst tot het bedrag komt — per categorie,
                  met toepassing van vrijstellingen, de schuldendrempel, partner-verdeling en (als
                  van toepassing) verdragskorting voor buitenlands vastgoed. Geen black box.
                </p>
              </div>

              <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
                <ResultCard
                  result={calculationResult}
                  resultPrevYear={resultPrevYear ?? undefined}
                  alternativeTaxAmount={alternativeTaxAmount}
                  alternativeHasFiscalPartner={!hasFiscalPartner}
                  assets={assets}
                  hasFiscalPartner={hasFiscalPartner}
                  selectedYear={selectedYear}
                />
                <div className="space-y-6 lg:sticky lg:top-24">
                  <EmailCapture />
                  <CompanyInfo />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ───────── How it works ───────── */}
        <section className="border-b border-appleGray-200/80 py-20 md:py-24" id="hoe">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 mb-12 items-end">
              <div>
                <div className="eyebrow mb-2">Zo werkt het</div>
                <h2 className="font-display text-3xl md:text-5xl font-medium tracking-display leading-[1.02]">
                  Drie stappen, <em className="not-italic text-accent-500">nul</em> verrassingen.
                </h2>
              </div>
              <p className="text-lg text-appleGray-700 max-w-[60ch] leading-relaxed">
                De Belastingdienst kijkt niet naar wat je werkelijk hebt verdiend — ze gaan uit van
                een fictief rendement, een aanname per categorie. Hier reken ik die aanname stap
                voor stap voor je voor. Geen aannames over jouw situatie die je niet zelf hebt ingevuld.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'Vul je vermogen in', body: 'Spaargeld, beleggingen, eventueel een tweede woning, hypotheek en schulden. Tip: voor vastgoed de WOZ-waarde gebruiken, niet de marktwaarde — dat scheelt vaak 10–20%.', tag: '~ 90 seconden' },
                { num: '2', title: 'Elke euro krijgt zijn eigen percentage', body: 'Spaargeld op 1,44%, beleggingen en vastgoed op 6,04%, schulden op 2,61% (boven de €3.700-drempel). Partner-vrijstellingen, jaar-tarieven en verdragslanden zitten erin.', tag: 'Live berekening' },
                { num: '3', title: 'Zie de aanslag in beeld', body: 'Effectief tarief, belastbare grondslag, vrijstellingen, het bedrag onderaan de streep — en een vergelijking met vorig jaar en met 2028 onder aanwasbelasting.', tag: 'Deelbaar als link' },
              ].map((s) => (
                <div key={s.num} className="p-7 rounded-2xl bg-white border border-appleGray-200/80 flex flex-col gap-3 min-h-[240px]">
                  <div className="font-display text-[56px] leading-none font-medium text-accent-500 tabular-nums tracking-display-tight">
                    {s.num}
                  </div>
                  <h3 className="font-display text-2xl font-medium tracking-display leading-tight">{s.title}</h3>
                  <p className="text-appleGray-700 text-[15px] leading-relaxed">{s.body}</p>
                  <div className="font-mono text-[10.5px] uppercase tracking-[.12em] text-appleGray-500 mt-auto">{s.tag}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Rates explainer ───────── */}
        <section className="border-b border-appleGray-200/80 py-20 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 mb-12 items-end">
              <div>
                <div className="eyebrow mb-2">Fictieve rendementen {selectedYear}</div>
                <h2 className="font-display text-3xl md:text-5xl font-medium tracking-display leading-[1.02]">
                  De drie <em className="not-italic text-accent-500">aannames</em> waarmee de fiscus rekent.
                </h2>
              </div>
              <p className="text-lg text-appleGray-700 max-w-[60ch] leading-relaxed">
                Tot 2022 gebruikte de Belastingdienst één gemiddeld percentage voor alles. Het Kerstarrest
                van december 2021 (<a href="https://uitspraken.rechtspraak.nl/details?id=ECLI:NL:HR:2021:1963" target="_blank" rel="noopener noreferrer" className="underline decoration-accent-500/40 hover:decoration-accent-500">ECLI:NL:HR:2021:1963</a>)
                veranderde dat. Sinds 2023 zijn er drie categorieën, elk met een eigen percentage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 rounded-2xl overflow-hidden border border-appleGray-200/80 bg-white">
              <RateCell
                cat="Spaargeld"
                pct={currentRates.savings}
                color="ink"
                desc="Bank- en spaartegoeden. Laag percentage, want spaarrentes zitten al jaren onder de twee procent. Wijkt af van wat je werkelijk ontvangt — vaak in jouw nadeel."
                hint="Bron · Belastingdienst"
              />
              <RateCell
                cat="Beleggingen & vastgoed"
                pct={currentRates.invest}
                color="accent"
                desc="Aandelen, obligaties, je tweede woning. Hoger rendement verondersteld op basis van langetermijngemiddelden — in 2022 met -13% op de AEX viel dat tegen, in 2024 met +14% juist mee."
                hint="Tweede woningen tegen WOZ-waarde"
              />
              <RateCell
                cat="Schulden"
                pct={currentRates.debt}
                color="ink"
                desc="Aftrekbaar van je grondslag — maar de eerste €3.700 (€7.400 met fiscale partner) telt niet mee. Bedoeld om kleine schulden buiten Box 3 te houden."
                hint="Drempel per persoon"
              />
            </div>
          </div>
        </section>

        {/* ───────── Why I built this ───────── */}
        <section className="border-b border-appleGray-200/80 py-20 md:py-24" id="waarom">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 items-start">
              <div>
                <div className="eyebrow mb-2">Wie hier achter zit</div>
                <h2 className="font-display text-3xl md:text-5xl font-medium tracking-display leading-[1.02]">
                  Eén persoon, één <em className="not-italic text-accent-500">Excel</em> dat is uitgegroeid.
                </h2>
              </div>
              <div className="space-y-4 text-[17px] text-appleGray-700 leading-relaxed max-w-[62ch]">
                <p>
                  Ik ben Dejan. Servisch van origine, woon in Nederland, AI engineer overdag, en de
                  bouwer van deze site in mijn vrije uren. 2e-woning.nl begon als een Excel-bestand
                  toen een vriend mij vroeg om zijn Box 3-aanslag te controleren. Drie avonden later
                  was er een rekenmodel; een paar maanden later een webversie. Dit is die webversie.
                </p>
                <p>
                  Geen advertenties verstopt tussen je cijfers, geen e-mail die je moet achterlaten,
                  geen advies waarvoor ik niet gekwalificeerd ben. Wel: een eerlijke berekening van
                  wat de Belastingdienst gaat doen, en een paar pagina&apos;s uitleg in normaal
                  Nederlands. Voor wie het wil weten — er staat een hele pagina over wie ik ben,
                  waarom dit bestaat, en wat het níet is.
                </p>
                <div className="pt-2">
                  <Link href="/over" className="btn btn-outline inline-flex items-center gap-2">
                    Over de auteur
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section className="border-b border-appleGray-200/80 py-20 md:py-24" id="faq">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-12 mb-12 items-end">
              <div>
                <div className="eyebrow mb-2">FAQ</div>
                <h2 className="font-display text-3xl md:text-5xl font-medium tracking-display leading-[1.02]">
                  Eerlijke antwoorden, <em className="not-italic text-accent-500">geen</em> jargon.
                </h2>
              </div>
              <p className="text-lg text-appleGray-700 max-w-[60ch] leading-relaxed">
                Tien vragen die ik het vaakst krijg via mail — kort beantwoord, in normale taal, en
                zonder verwijzingen naar 14 andere pagina&apos;s of een wetsartikel dat je toch niet
                gaat openen.
              </p>
            </div>

            <div className="border-t border-appleGray-200/80">
              {faqItems.map((it, i) => (
                <details key={i} className="border-b border-appleGray-200/80 group" {...(i === 0 ? { open: true } : {})}>
                  <summary className="flex justify-between items-center gap-6 py-6 cursor-pointer list-none">
                    <h4 className="m-0 font-display text-xl md:text-[28px] font-medium tracking-display leading-tight flex-1">
                      {it.q}
                    </h4>
                    <span className="qa-icon" aria-hidden="true">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </summary>
                  <div className="pb-6 text-base text-appleGray-700 max-w-[72ch] leading-[1.55]">
                    {it.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── More articles ───────── */}
        <section className="py-20 md:py-24">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="mb-8">
              <div className="eyebrow mb-2">Verder lezen</div>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-display leading-[1.02]">
                {t('moreLezen.title')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {moreLezenItems.map((a) => (
                <Link key={a.href} href={a.href} className="card p-6 hover:-translate-y-0.5 transition-transform no-underline block group">
                  <p className="font-display text-xl font-medium tracking-display text-appleGray-900 group-hover:text-accent-500 transition-colors mb-2 leading-tight">
                    {a.title}
                  </p>
                  <p className="text-sm text-appleGray-600 leading-relaxed">{a.desc}</p>
                </Link>
              ))}
            </div>
            <AdBanner client={GOOGLE_ADSENSE_CLIENT} slot={GOOGLE_ADSENSE_SLOT_HORIZONTAL} className="mt-10" />
          </div>
        </section>
      </main>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   Calculator card — inline live preview, matches the editorial design
   ───────────────────────────────────────────────────────────────────── */

interface CalculatorCardProps {
  selectedYear: TaxYear;
  setSelectedYear: (y: TaxYear) => void;
  assets: Assets;
  handleInputChange: (field: keyof Assets, value: number) => void;
  hasFiscalPartner: boolean;
  setHasFiscalPartner: (v: boolean) => void;
  propertyEntries: PropertyEntry[];
  addPropertyEntry: () => void;
  removePropertyEntry: (id: string) => void;
  updatePropertyEntry: (id: string, field: keyof Omit<PropertyEntry, 'id'>, val: number | PropertyLocation | boolean) => void;
  focusedPropertyId: string | null;
  setFocusedPropertyId: (id: string | null) => void;
  focusedMortgageId: string | null;
  setFocusedMortgageId: (id: string | null) => void;
  otherDebts: number;
  handleOtherDebtsChange: (v: number) => void;
  previewResult: TaxCalculationResult | null;
  onCalculate: () => void;
  onCopyLink: () => void;
  onReset: () => void;
  copied: boolean;
}

const CalculatorCard: React.FC<CalculatorCardProps> = (props) => {
  const { t } = useTranslation('common');
  const {
    selectedYear, setSelectedYear, assets, handleInputChange,
    hasFiscalPartner, setHasFiscalPartner,
    propertyEntries, addPropertyEntry, removePropertyEntry, updatePropertyEntry,
    focusedPropertyId, setFocusedPropertyId, focusedMortgageId, setFocusedMortgageId,
    otherDebts, handleOtherDebtsChange,
    previewResult, onCalculate, onCopyLink, onReset, copied,
  } = props;

  return (
    <div className="card overflow-hidden">
      {/* Head: year selector */}
      <div className="flex justify-between items-center px-4 md:px-5 py-3.5 border-b border-appleGray-200/80"
           style={{ background: 'linear-gradient(180deg, #EFEBE1 0%, #fff 100%)' }}>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-[.16em] text-appleGray-500">Belastingjaar</span>
          <span className="font-display text-[15px] font-medium text-appleGray-900 tabular-nums tracking-display-tight">{selectedYear}</span>
        </div>
        <div className="flex gap-1 bg-appleGray-100 p-1 rounded-lg" role="tablist" aria-label="Belastingjaar kiezen">
          {(['2024', '2025', '2026'] as TaxYear[]).map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              role="tab"
              aria-selected={selectedYear === y}
              className={`appearance-none px-3 py-1 rounded-md text-xs font-medium font-mono transition-all ${
                selectedYear === y
                  ? 'bg-white text-appleGray-900 shadow-sm'
                  : 'bg-transparent text-appleGray-500 hover:text-appleGray-900'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 md:p-6">
        {/* Section: liquid assets */}
        <SectionLabel
          title="Liquide vermogen"
          hint="Spaargeld krijgt een laag fictief rendement; beleggingen een hoog."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0 items-stretch">
          <InputField label={t('assets.bankSavings')} value={assets.bankSavings} onChange={(v) => handleInputChange('bankSavings', v)} />
          <InputField label={t('assets.investments')} value={assets.investments} onChange={(v) => handleInputChange('investments', v)} />
        </div>

        {/* Section: properties */}
        <SectionLabel
          title="Tweede woningen & vastgoed"
          hint="Gebruik WOZ-waarde — voor verhuurde of buitenlandse woningen."
          counter={`${propertyEntries.length} ${propertyEntries.length === 1 ? 'woning' : 'woningen'}`}
        />

        <div className="space-y-2.5">
          {propertyEntries.map((entry, idx) => (
            <PropertyBlock
              key={entry.id}
              entry={entry}
              index={idx}
              canRemove={propertyEntries.length > 1}
              onUpdate={(field, val) => updatePropertyEntry(entry.id, field, val)}
              onRemove={() => removePropertyEntry(entry.id)}
              focusedPropertyId={focusedPropertyId}
              setFocusedPropertyId={setFocusedPropertyId}
              focusedMortgageId={focusedMortgageId}
              setFocusedMortgageId={setFocusedMortgageId}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addPropertyEntry}
          className="mt-3 flex items-center gap-2.5 px-4 py-3 w-full rounded-xl border border-dashed border-appleGray-300 text-appleGray-700 text-sm hover:bg-white hover:border-appleGray-700 transition-all"
        >
          <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-accent-500 text-white font-semibold text-sm leading-none">
            +
          </span>
          {t('assets.addProperty')}
        </button>

        {/* Section: extras */}
        <SectionLabel
          title="Overig"
          hint="Optioneel — laat leeg als niet van toepassing."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-stretch">
          <InputField
            label={t('assets.otherAssets')}
            value={assets.otherAssets}
            onChange={(v) => handleInputChange('otherAssets', v)}
            optional
          />
          <InputField
            label={t('assets.greenInvestments')}
            value={assets.greenInvestments}
            onChange={(v) => handleInputChange('greenInvestments', v)}
            help="Vrijstelling tot €71.251"
            optional
          />
          <div className="sm:col-span-2">
            <InputField
              label={t('debts.otherDebtsLabel')}
              value={otherDebts}
              onChange={handleOtherDebtsChange}
              optional
            />
          </div>
        </div>

        {/* Section: partner */}
        <SectionLabel
          title="Persoonlijk"
          hint="Een fiscale partner verdubbelt het heffingvrij vermogen en de schuldendrempel."
        />
        <button
          type="button"
          onClick={() => setHasFiscalPartner(!hasFiscalPartner)}
          className={`partner-toggle w-full text-left ${hasFiscalPartner ? 'is-on' : ''}`}
          role="switch"
          aria-checked={hasFiscalPartner}
        >
          <span className="toggle" aria-hidden="true" />
          <span className="flex-1">
            <span className="block">{t('personal.fiscalPartner')}</span>
            <span className="block text-xs text-appleGray-500 mt-0.5">
              {hasFiscalPartner
                ? 'Heffingvrij vermogen €114.000 · schuldendrempel €7.400'
                : 'Heffingvrij vermogen €57.000 · schuldendrempel €3.700'}
            </span>
          </span>
        </button>
      </div>

      {/* Live preview result */}
      {previewResult && (
        <div className="grid md:grid-cols-[1.1fr_.9fr] gap-6 items-center px-5 md:px-6 py-5 border-t border-appleGray-200/80"
             style={{ background: 'linear-gradient(180deg, #EFEBE1, color-mix(in oklab, #EFEBE1 50%, white))' }}>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[.16em] text-appleGray-500 mb-1">
              Geschatte Box 3 belasting · {selectedYear}
            </div>
            <div className="font-display text-[clamp(40px,5.5vw,64px)] font-medium tracking-display-tight leading-[.95] text-appleGray-900 tabular-nums">
              €{fmtEUR(previewResult.taxAmount)}
              <small className="text-[.4em] text-appleGray-500 ml-2 font-mono font-medium uppercase tracking-normal align-middle">
                per jaar
              </small>
            </div>
            <div className="mt-2 text-sm text-appleGray-700">
              Effectief tarief op vermogen:{' '}
              <strong className="text-accent-500 font-semibold tabular-nums font-mono">
                {previewResult.taxBase > 0
                  ? ((previewResult.taxAmount / previewResult.taxBase) * 100).toFixed(2)
                  : '0,00'}%
              </strong>
              {previewResult.taxAmount === 0 && previewResult.taxBase > 0 && (
                <span className="text-appleGray-500"> · onder heffingvrij vermogen</span>
              )}
            </div>
          </div>

          <div className="font-mono text-xs">
            <BreakdownRow k="Netto vermogen" v={`€${fmtEUR(previewResult.taxBase)}`} />
            <BreakdownRow k="Heffingvrij" v={`−€${fmtEUR(previewResult.taxBase - previewResult.savingsAndInvestmentBase)}`} />
            <BreakdownRow k="Belastbaar" v={`€${fmtEUR(previewResult.savingsAndInvestmentBase)}`} />
            <BreakdownRow k="Fictief rendement" v={`€${fmtEUR(previewResult.taxableReturn)}`} last />
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-1 flex items-center gap-2.5 flex-wrap">
        <button onClick={onCalculate} className="btn btn-primary" aria-label="Toon de berekening stap voor stap">
          Toon volledige uitleg
          <span className="arr" aria-hidden="true">→</span>
        </button>
        <button onClick={onCopyLink} className="btn btn-outline" aria-label="Kopieer een deelbare link naar deze berekening">
          {copied ? '✓ Link gekopieerd' : 'Deel berekening'}
        </button>
        <button
          onClick={onReset}
          className="appearance-none border-0 bg-transparent text-appleGray-500 hover:text-appleGray-900 text-sm px-3 py-2 rounded-md hover:bg-appleGray-100 transition-all ml-auto"
          aria-label="Wis alle velden"
        >
          {t('buttons.reset')}
        </button>
      </div>
    </div>
  );
};

const BreakdownRow: React.FC<{ k: string; v: string; last?: boolean }> = ({ k, v, last }) => (
  <div className={`flex justify-between items-center py-1.5 ${last ? '' : 'border-b border-dashed border-appleGray-300/60'}`}>
    <span className="text-appleGray-500 uppercase tracking-[.08em] text-[11px]">{k}</span>
    <span className="text-appleGray-900 font-medium tabular-nums">{v}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   Section divider inside the calculator — clear visual grouping
   ───────────────────────────────────────────────────────────────────── */
const SectionLabel: React.FC<{ title: string; hint?: string; counter?: string }> = ({ title, hint, counter }) => (
  <div className="mt-5 mb-2 first:mt-0">
    <div className="flex items-baseline justify-between gap-3 border-t border-appleGray-200/70 pt-3">
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-[10.5px] uppercase tracking-[.16em] text-appleGray-500">{title}</span>
        {hint && <span className="text-[11.5px] text-appleGray-500 leading-snug">{hint}</span>}
      </div>
      {counter && (
        <span className="font-mono text-[10.5px] uppercase tracking-[.1em] text-appleGray-500 whitespace-nowrap">{counter}</span>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   Property block (single woning row inside the calculator)
   ───────────────────────────────────────────────────────────────────── */

interface PropertyBlockProps {
  entry: PropertyEntry;
  index: number;
  canRemove: boolean;
  onUpdate: (field: keyof Omit<PropertyEntry, 'id'>, val: number | PropertyLocation | boolean) => void;
  onRemove: () => void;
  focusedPropertyId: string | null;
  setFocusedPropertyId: (id: string | null) => void;
  focusedMortgageId: string | null;
  setFocusedMortgageId: (id: string | null) => void;
}

const PropertyBlock: React.FC<PropertyBlockProps> = ({
  entry, index, canRemove, onUpdate, onRemove,
  focusedPropertyId, setFocusedPropertyId, focusedMortgageId, setFocusedMortgageId,
}) => {
  const { t } = useTranslation('common');

  const locationLabels: Record<PropertyLocation, { short: string; long: string; hint: string }> = {
    nl: { short: 'Nederland', long: 'Nederland', hint: 'Telt mee in Box 3' },
    treaty: { short: 'Verdragsland', long: 'Verdragsland', hint: 'Buitenland mét belastingverdrag — vrijstelling via Bvdb 2001' },
    noTreaty: { short: 'Geen verdrag', long: 'Geen verdrag', hint: 'Buitenland zonder belastingverdrag' },
  };

  return (
    <div className="property-card">
      <div className="property-card-head">
        <div className="property-name">Woning {index + 1}</div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="appearance-none border-0 bg-transparent text-appleGray-500 text-sm cursor-pointer px-2 py-1 rounded-md hover:bg-appleGray-100 hover:text-appleGray-900 inline-flex items-center gap-1.5"
            aria-label={t('assets.removeProperty')}
          >
            <span aria-hidden="true">✕</span>
            <span className="text-[11px] uppercase tracking-[.1em] font-mono">Verwijder</span>
          </button>
        )}
      </div>
      <div className="p-3.5">
        {/* Location selector with explicit label */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between mb-1.5 gap-3">
            <label className="text-[13px] text-appleGray-700 font-medium tracking-[0.005em]">Waar staat deze woning?</label>
            <span className="font-mono text-[10.5px] uppercase tracking-[.1em] text-appleGray-500">Fiscale locatie</span>
          </div>
          <div className="seg w-full" role="radiogroup" aria-label="Locatie van de woning" style={{ width: '100%' }}>
            {(['nl', 'treaty', 'noTreaty'] as PropertyLocation[]).map((loc) => (
              <button
                key={loc}
                role="radio"
                aria-checked={entry.location === loc}
                className={entry.location === loc ? 'on flex-1' : 'flex-1'}
                onClick={() => onUpdate('location', loc)}
                disabled={entry.isPrimaryResidence}
                style={{
                  flex: 1,
                  ...(entry.isPrimaryResidence ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                }}
              >
                {locationLabels[loc].short}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-appleGray-500 mt-1.5 leading-snug">
            {locationLabels[entry.location].hint}
          </p>
        </div>

        {entry.location === 'nl' && (
          <label className="flex items-center gap-2 cursor-pointer group mb-2.5">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={entry.isPrimaryResidence}
                onChange={e => onUpdate('isPrimaryResidence', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                entry.isPrimaryResidence ? 'bg-accent-500 border-accent-500' : 'border-appleGray-300 group-hover:border-accent-400'
              }`}>
                {entry.isPrimaryResidence && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs font-medium text-appleGray-700">{t('assets.primaryResidence')}</span>
            <span className="text-[11px] text-appleGray-500 ml-1">— valt in Box 1, niet hier</span>
          </label>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0">
          {/* WOZ value */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[12.5px] text-appleGray-700 font-medium">WOZ-waarde</label>
              <span className="font-mono text-[10.5px] uppercase tracking-[.1em] text-appleGray-500">Niet marktwaarde</span>
            </div>
            <div className={`relative ${entry.isPrimaryResidence ? 'opacity-50' : ''}`}>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-appleGray-500 font-mono text-sm pointer-events-none">€</span>
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
                  onUpdate('value', parseInt(sanitized, 10) || 0);
                }}
                placeholder="350.000"
                disabled={entry.isPrimaryResidence}
                className="w-full pl-7 pr-3.5 py-3 border border-appleGray-200 rounded-xl bg-white font-mono text-[15px] font-medium text-appleGray-900 focus:outline-none focus:border-appleGray-900 focus:ring-[3px] focus:ring-accent-500/20 transition-all"
              />
            </div>
          </div>

          {/* Mortgage */}
          {entry.location === 'nl' && !entry.isPrimaryResidence && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[12.5px] text-appleGray-700 font-medium">{t('debts.hasMortgage')}</label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={entry.hasMortgage}
                    onChange={e => onUpdate('hasMortgage', e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`w-3.5 h-3.5 rounded border-2 inline-flex items-center justify-center transition-all ${
                    entry.hasMortgage ? 'bg-accent-500 border-accent-500' : 'border-appleGray-300'
                  }`}>
                    {entry.hasMortgage && (
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </label>
              </div>
              <div className={`relative ${entry.hasMortgage ? '' : 'opacity-50 pointer-events-none'}`}>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-appleGray-500 font-mono text-sm pointer-events-none">€</span>
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
                    onUpdate('mortgage', parseInt(sanitized, 10) || 0);
                  }}
                  className="w-full pl-7 pr-3.5 py-3 border border-appleGray-200 rounded-xl bg-white font-mono text-[15px] font-medium text-appleGray-900 focus:outline-none focus:border-appleGray-900 focus:ring-[3px] focus:ring-accent-500/20 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {entry.isPrimaryResidence && (
          <p className="text-xs text-appleGray-600 leading-relaxed font-medium mt-1">{t('assets.primaryResidenceNote')}</p>
        )}
        {entry.location === 'treaty' && (
          <p className="text-xs text-appleGray-500 leading-relaxed mt-1">{t('assets.treatyNote')}</p>
        )}
        {entry.location === 'noTreaty' && (
          <p className="text-xs text-appleGray-500 leading-relaxed mt-1">{t('assets.noTreatyNote')}</p>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   Rate cell — single column in the rates explainer grid
   ───────────────────────────────────────────────────────────────────── */
const RateCell: React.FC<{
  cat: string;
  pct: string;
  color: 'ink' | 'accent';
  desc: string;
  hint: string;
}> = ({ cat, pct, color, desc, hint }) => {
  // Strip percent from pct so we can render the unit separately
  const cleaned = pct.replace('%', '');
  return (
    <div className="p-8 border-r border-b md:border-b-0 border-appleGray-200/80 last:border-r-0 relative">
      <div className="font-mono text-[11px] uppercase tracking-[.14em] text-appleGray-500">{cat}</div>
      <div className={`font-display text-[72px] md:text-[88px] leading-[.9] tracking-[-0.05em] my-4 font-medium tabular-nums ${
        color === 'accent' ? 'text-accent-500' : 'text-appleGray-900'
      }`}>
        {cleaned}
        <span className="font-mono text-base text-appleGray-500 ml-1.5 font-medium tracking-normal">%</span>
      </div>
      <div className="text-sm text-appleGray-700 max-w-[30ch] leading-relaxed">{desc}</div>
      <div className="font-mono text-[10.5px] uppercase tracking-[.1em] text-appleGray-500 mt-5 pt-3.5 border-t border-dashed border-appleGray-300/60">
        {hint}
      </div>
    </div>
  );
};

export default Home;
