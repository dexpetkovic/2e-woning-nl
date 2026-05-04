import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Script from 'next/script';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'nl', ['common'])),
  },
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Zo verlaag je je Box 3 belasting — 5 dingen die echt werken",
  "description": "Vijf legale manieren om minder Box 3 belasting te betalen: fiscaal partnerschap, groene beleggingen, schulden aflossen voor 1 januari en meer.",
  "author": { "@type": "Organization", "name": "Elands AI" },
  "publisher": { "@type": "Organization", "name": "2e-woning.nl" },
};

const TIPS = [
  {
    number: '01',
    title: 'Gebruik je fiscaal partnerschap optimaal',
    body: [
      'Als je een fiscale partner hebt, mogen jullie het Box 3-vermogen onderling verdelen op de manier die fiscaal het gunstigst is. In de praktijk betekent dat: je kunt vermogen verschuiven van de partner met het hoogste belastbaar inkomen naar de ander.',
      'Bovendien geldt het heffingvrij vermogen per persoon. Samen hebben jullie dus recht op €114.000 vrijstelling in plaats van €57.000. Dat scheelt bij een gemiddeld vermogen al snel honderden euro\'s per jaar.',
      'De verdeling hoef je niet fifty-fifty te doen. Je mag optimaliseren — maar doe dit wel via je aangifte, niet achteraf.',
    ],
  },
  {
    number: '02',
    title: 'Betaal schulden af vóór 1 januari',
    body: [
      'Box 3 wordt berekend op peildatum 1 januari. Je vermogenssaldo op die dag bepaalt je aanslag voor het hele jaar.',
      'Als je een grote aflossing kunt doen vóór het einde van het jaar — en daarmee je Box 3-grondslag verlaagt — is dat soms de moeite waard. Let op: schulden zijn pas aftrekbaar boven een drempel van €3.700 (of €7.400 met partner). Kleine schulden afbetalen heeft dus geen fiscaal effect.',
      'Dit is een timing-kwestie, geen trucje. Het vermindert je daadwerkelijke vermogen — maar het verlaagt ook je belastingaanslag.',
    ],
  },
  {
    number: '03',
    title: 'Beleg (deels) in groene fondsen',
    body: [
      'Groene beleggingen zijn tot €71.251 per persoon vrijgesteld van Box 3 — met partner dus tot €142.502. Als je toch al van plan bent om te beleggen, en je hebt een keuze, loont het om te kijken of er duurzame alternatieven zijn die voor jou werken.',
      'Het gaat om beleggingen in fondsen met het keurmerk van de Belastingdienst. Niet elk fonds dat zichzelf "groen" noemt, telt. Check dit via je bank of broker.',
      'De vrijstelling scheelt direct in je belastinggrondslag — je betaalt dan over een kleiner deel van je vermogen.',
    ],
  },
  {
    number: '04',
    title: 'Controleer je aangifte zorgvuldig',
    body: [
      'Dit klinkt voor de hand liggend, maar het gaat regelmatig mis. De Belastingdienst vult de aangifte voor een deel zelf in op basis van banksaldi en WOZ-waarden — maar die gegevens kloppen niet altijd.',
      'Controleer in elk geval: zijn alle schulden boven de drempel meegenomen? Is de WOZ-waarde van je tweede woning correct? Heb je groene beleggingen die als zodanig zijn opgegeven?',
      'Gebruik deze calculator om een richtlijn te hebben voordat je de aangifte doet. Als de uitkomst sterk afwijkt van wat de Belastingdienst berekent, is dat een reden om verder te kijken.',
    ],
  },
  {
    number: '05',
    title: 'Houd de rechtsontwikkeling in de gaten',
    body: [
      'Er lopen nog steeds procedures over Box 3. Mensen die in eerdere jaren te veel hebben betaald onder het oude systeem kunnen in sommige gevallen aanspraak maken op herstel of teruggave.',
      'Of je recht hebt op iets, hangt af van of je destijds bezwaar hebt gemaakt en in welk jaar het om gaat. De Hoge Raad en lagere rechters blijven uitspraken doen — soms met gevolgen voor jouw situatie.',
      'Het is de moeite waard om je erin te verdiepen, zeker als je in de jaren 2017–2022 een flink vermogen had. Raadpleeg een belastingadviseur als je denkt recht te hebben op herstel.',
    ],
  },
];

const Box3Tips: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Zo verlaag je je Box 3 belasting — 5 tips die werken"
        description="Vijf legale manieren om minder Box 3 belasting te betalen in 2025. Fiscaal partnerschap, groene beleggingen, peildatum-optimalisatie en meer."
        canonical="https://2e-woning.nl/box3-tips"
        additionalMetaTags={[{
          name: 'keywords',
          content: 'box 3 belasting verlagen, box 3 tips, minder box 3 betalen, groene beleggingen vrijstelling, fiscaal partner box 3, box 3 optimaliseren',
        }]}
      />
      <Script
        id="structured-data-tips"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-appleGray-50">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-accent-500/6 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Praktische tips
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-appleGray-900 mb-4 tracking-tight">
              Zo verlaag je je Box 3 belasting
            </h1>
            <p className="text-lg text-appleGray-500 max-w-xl mx-auto leading-relaxed">
              Er is geen magische truc. Maar er zijn wel degelijk keuzes die je kunt maken — en die het verschil maken.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 pb-16 space-y-5">
          {TIPS.map((tip) => (
            <div key={tip.number} className="card">
              <div className="flex items-start gap-4">
                <span className="text-2xl font-bold text-accent-500/30 leading-none flex-shrink-0 tabular-nums">{tip.number}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-appleGray-900 mb-3">{tip.title}</h2>
                  <div className="space-y-2">
                    {tip.body.map((para, i) => (
                      <p key={i} className="text-sm text-appleGray-600 leading-relaxed">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="card bg-appleGray-50 border-dashed border-appleGray-200">
            <p className="text-sm text-appleGray-600 leading-relaxed">
              <strong className="text-appleGray-800">Even eerlijk zijn:</strong> als je vermogen hebt boven het heffingvrij vermogen, ontkom je niet volledig aan Box 3-belasting. Bovenstaande tips helpen je het te beperken — maar ze lossen het niet op. Voor complexere situaties (groot vastgoedvermogen, meerdere beleggingsrekeningen, lopende bezwaarprocedures) is een belastingadviseur de moeite waard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Bereken uw Box 3 belasting
            </Link>
            <Link href="/box3-uitleg" className="btn btn-outline inline-flex items-center gap-2">
              Box 3 uitgelegd →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Box3Tips;
