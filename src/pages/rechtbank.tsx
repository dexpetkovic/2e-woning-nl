import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Script from 'next/script';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'nl', ['common'])),
  },
});

const TIMELINE = [
  {
    year: '2021',
    label: 'Kerstarrest — Hoge Raad',
    summary: 'Op 24 december 2021 oordeelde de Hoge Raad dat het forfaitaire stelsel van Box 3 in strijd is met Europees recht. Belastingplichtigen die bezwaar hadden gemaakt, hadden recht op herstel.',
    impact: 'hoog',
    href: 'https://uitspraken.rechtspraak.nl/details?id=ECLI:NL:HR:2021:1963',
  },
  {
    year: '2022',
    label: 'Massaal bezwaar & herstel',
    summary: 'De Belastingdienst erkende het arrest en stelde een massaal-bezwaarproces in. Miljoenen aanslagen werden herzien. Belastingplichtigen die geen bezwaar hadden gemaakt, vielen aanvankelijk buiten de boot.',
    impact: 'hoog',
    href: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/massaal-bezwaar-box-3',
  },
  {
    year: '2023',
    label: 'Overbruggingswetgeving',
    summary: 'Omdat een nieuw stelsel tijd kost, voerde het kabinet overbruggingswetgeving in. Box 3 wordt tijdelijk berekend op basis van werkelijke vermogenscategorieën in plaats van één fictief rendement.',
    impact: 'middel',
    href: 'https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/',
  },
  {
    year: '2024',
    label: 'Niet-bezwaarmakers — uitspraken',
    summary: 'De Hoge Raad en lagere rechters bogen zich over de vraag of ook niet-bezwaarmakers recht hebben op herstel. In meerdere zaken werd geoordeeld dat dit niet automatisch het geval is, maar individuele procedures bleven mogelijk.',
    impact: 'middel',
    href: 'https://uitspraken.rechtspraak.nl/',
  },
  {
    year: '2025',
    label: 'Nieuw Box 3 stelsel in voorbereiding',
    summary: 'Het kabinet werkt aan een nieuw stelsel gebaseerd op werkelijk rendement, met beoogde inwerkingtreding in 2027. Tot die tijd blijft de overbruggingswetgeving van kracht.',
    impact: 'laag',
    href: 'https://www.rijksoverheid.nl/onderwerpen/belasting-betalen/box-3',
  },
];

const IMPACT_COLORS: Record<string, string> = {
  hoog: 'bg-red-50 text-red-600 border-red-100',
  middel: 'bg-amber-50 text-amber-600 border-amber-100',
  laag: 'bg-green-50 text-green-600 border-green-100',
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Box 3 en de rechter — overzicht van rechtszaken en uitspraken",
  "description": "Overzicht van de belangrijkste rechterlijke uitspraken over Box 3 belasting in Nederland, van het Kerstarrest 2021 tot het nieuwe stelsel in 2027.",
  "author": { "@type": "Organization", "name": "Elands Studio" },
  "publisher": { "@type": "Organization", "name": "2e-woning.nl" },
};

const Rechtbank: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <NextSeo
        title="Box 3 & de Rechter | Rechtszaken en uitspraken"
        description="Overzicht van de belangrijkste rechterlijke uitspraken over Box 3 belasting in Nederland: Kerstarrest 2021, massaal bezwaar, herstelwetgeving en het nieuwe stelsel."
        canonical="https://2e-woning.nl/rechtbank"
        additionalMetaTags={[{
          name: 'keywords',
          content: 'box 3 rechtbank, box 3 rechtszaak, kerstarrest box 3, massaal bezwaar box 3, box 3 hoge raad, box 3 nieuw stelsel 2027',
        }]}
      />
      <Script
        id="structured-data-rechtbank"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-appleGray-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-accent-500/6 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Juridisch overzicht
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-appleGray-900 mb-4 tracking-tight">
              Box 3 &amp; de Rechter
            </h1>
            <p className="text-lg text-appleGray-500 max-w-xl mx-auto leading-relaxed">
              Van het Kerstarrest in 2021 tot het nieuwe stelsel in 2027 — alles wat u moet weten over de rechtszaken rondom Box 3.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 pb-16">
          {/* Context card */}
          <div className="card mb-8">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-3">Wat speelt er precies?</h2>
            <p className="text-sm text-appleGray-600 leading-relaxed mb-3">
              Het Nederlandse Box 3-stelsel berekende vermogensbelasting jarenlang op basis van een <strong>fictief rendement</strong> — ongeacht wat u werkelijk verdiende. De Hoge Raad oordeelde dat dit in strijd is met het eigendomsrecht en het discriminatieverbod uit het Europees Verdrag voor de Rechten van de Mens (EVRM).
            </p>
            <p className="text-sm text-appleGray-600 leading-relaxed">
              Sindsdien heeft de overheid tijdelijke wetgeving ingevoerd en wordt er gewerkt aan een volledig nieuw stelsel op basis van werkelijk rendement. Voor belastingplichtigen die te veel betaalden, zijn er herstelregelingen.
            </p>
          </div>

          {/* Timeline */}
          <h2 className="text-lg font-semibold text-appleGray-900 mb-5">Tijdlijn van uitspraken</h2>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-appleGray-200" />
            <div className="space-y-6">
              {TIMELINE.map((item) => (
                <div key={item.year} className="relative flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-appleGray-200 flex items-center justify-center z-10 text-xs font-bold text-appleGray-600">
                    {item.year.slice(2)}
                  </div>
                  <div className="card flex-1 pb-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <div>
                        <p className="text-xs text-appleGray-400 font-medium mb-0.5">{item.year}</p>
                        <h3 className="text-base font-semibold text-appleGray-900">{item.label}</h3>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${IMPACT_COLORS[item.impact]}`}>
                        {item.impact === 'hoog' ? 'Groot belang' : item.impact === 'middel' ? 'Relevant' : 'In ontwikkeling'}
                      </span>
                    </div>
                    <p className="text-sm text-appleGray-600 leading-relaxed mb-3">{item.summary}</p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-500 hover:underline"
                    >
                      Meer lezen
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What can you do */}
          <div className="card mt-10">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">Wat kunt u zelf doen?</h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Controleer uw aanslagen',
                  body: 'Kijk of u tijdig bezwaar heeft gemaakt voor de jaren 2017–2022. Belastingplichtigen die deel uitmaakten van het massaal-bezwaarproces hebben recht op herstel.',
                },
                {
                  title: 'Bereken uw werkelijke rendement',
                  body: 'Gebruik onze calculator om te zien wat u betaalt onder de huidige overbruggingswetgeving, en vergelijk dit met eerdere jaren.',
                },
                {
                  title: 'Raadpleeg een belastingadviseur',
                  body: 'De situatie rondom Box 3 is complex en afhankelijk van uw persoonlijke situatie. Een belastingadviseur kan u helpen met bezwaarprocedures of optimalisatie.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-appleGray-800">{item.title}</p>
                    <p className="text-sm text-appleGray-500 mt-0.5">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Bereken uw Box 3 belasting
            </Link>
            <p className="text-xs text-appleGray-400 mt-3">
              Bron: <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">Belastingdienst</a> · <a href="https://uitspraken.rechtspraak.nl/" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">Rechtspraak.nl</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Rechtbank;
