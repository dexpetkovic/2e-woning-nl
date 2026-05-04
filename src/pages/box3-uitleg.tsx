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
  "headline": "Box 3 uitgelegd — wat het is, hoe het werkt en waarom het zo ingewikkeld lijkt",
  "description": "Een duidelijke uitleg van Box 3 belasting in Nederland. Wat is fictief rendement, hoe werkt het heffingvrij vermogen, en wat verandert er in 2027?",
  "author": { "@type": "Organization", "name": "Elands AI" },
  "publisher": { "@type": "Organization", "name": "2e-woning.nl" },
};

const Box3Uitleg: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Box 3 uitgelegd — wat het is en hoe het werkt"
        description="Duidelijke uitleg van Box 3 belasting: fictief rendement, heffingvrij vermogen, het Kerstarrest en wat er verandert in 2027. Voor iedereen met spaargeld, beleggingen of een tweede woning."
        canonical="https://2e-woning.nl/box3-uitleg"
        additionalMetaTags={[{
          name: 'keywords',
          content: 'box 3 uitleg, box 3 belasting uitgelegd, fictief rendement box 3, heffingvrij vermogen 2025, box 3 hoe werkt het',
        }]}
      />
      <Script
        id="structured-data-uitleg"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Uitleg
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-appleGray-900 mb-4 tracking-tight">
              Box 3 uitgelegd
            </h1>
            <p className="text-lg text-appleGray-500 max-w-xl mx-auto leading-relaxed">
              Wat het is, hoe het werkt, en waarom er al jaren over wordt geprocedeerd.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 pb-16 space-y-6">

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">Drie boxen, één systeem</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>
                In Nederland betaal je inkomstenbelasting verdeeld over drie boxen. Box 1 gaat over inkomen uit werk en je eigen woning — dat is voor de meeste mensen het grootste deel van de aangifte. Box 2 is voor mensen met een aanmerkelijk belang in een BV. En Box 3 is voor al het overige vermogen: spaargeld, beleggingen, een tweede woning, verhuurde panden.
              </p>
              <p>
                De meeste mensen komen pas echt met Box 3 in aanraking als ze iets opbouwen dat boven het heffingvrij vermogen uitkomt. Tot dat punt merk je er weinig van.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">Fictief rendement — het kernidee</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>
                Het bijzondere aan Box 3 is dat de Belastingdienst niet kijkt naar wat je daadwerkelijk hebt verdiend. Ze gaan uit van een <strong className="text-appleGray-700">fictief rendement</strong>: een percentage dat je geacht wordt te behalen, ongeacht wat de markten hebben gedaan of hoeveel rente je bank heeft uitgekeerd.
              </p>
              <p>
                Over dat fictieve rendement betaal je vervolgens 36% belasting. Niet over je vermogen zelf, maar over het fictief berekende rendement daarop.
              </p>
              <p>
                In de praktijk betekent dit: heb je €200.000 aan beleggingen, dan gaat de Belastingdienst ervan uit dat je 6,04% rendement hebt behaald — dus €12.080. Daarover betaal je 36%, wat neerkomt op €4.348,80 aan belasting. Of je dat rendement ook echt hebt behaald, maakt (voor nu) niet uit.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">De tarieven voor 2025</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>Het fictieve rendement is opgesplitst per categorie:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                {[
                  { label: 'Banktegoeden', rate: '1,44%', note: 'laag, vanwege lage spaarrente' },
                  { label: 'Beleggingen & vastgoed', rate: '6,04%', note: 'hoger, geacht meer risico' },
                  { label: 'Schulden', rate: '2,61%', note: 'aftrekbaar boven de drempel' },
                ].map((r) => (
                  <div key={r.label} className="bg-appleGray-50 rounded-xl p-3 border border-appleGray-100">
                    <p className="text-xs text-appleGray-400 mb-1">{r.label}</p>
                    <p className="text-xl font-bold text-appleGray-800">{r.rate}</p>
                    <p className="text-xs text-appleGray-400 mt-1">{r.note}</p>
                  </div>
                ))}
              </div>
              <p>
                Over het totale fictieve rendement betaal je <strong className="text-appleGray-700">36% belasting</strong>. Er is ook een heffingvrij vermogen van <strong className="text-appleGray-700">€57.000 per persoon</strong> (€114.000 voor fiscale partners). Zit je eronder, dan betaal je niks.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">Waarom er zoveel over wordt geprocedeerd</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>
                Het oude Box 3-systeem (vóór 2023) gebruikte één vast fictief rendement voor alles — een paar jaar geleden nog zo'n 4%. Het probleem: als je spaargeld maar 0,1% rente opleverde maar toch werd belast over 4% fictief rendement, betaalde je effectief meer dan je werkelijk had verdiend.
              </p>
              <p>
                De Hoge Raad vond dit in december 2021 in strijd met het eigendomsrecht (EVRM) en verklaarde het systeem ongrondwettelijk. Dat is inmiddels bekend als het Kerstarrest.
              </p>
              <p>
                Belastingplichtigen die op tijd bezwaar hadden gemaakt, hadden recht op herstel. Wie geen bezwaar had gemaakt viel aanvankelijk buiten de boot — en ook daarover zijn nog steeds procedures gaande.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">Het huidige systeem en wat er komt</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>
                Sinds 2023 geldt een overbruggingsstelsel. Daarin maakt de Belastingdienst onderscheid per vermogenscategorie — vandaar de aparte percentages voor spaargeld, beleggingen en schulden. Het is nog steeds een fictief systeem, maar eerlijker dan daarvoor.
              </p>
              <p>
                Het kabinet werkt aan een nieuw stelsel op basis van <strong className="text-appleGray-700">werkelijk rendement</strong>. Idee is dat je dan echt betaalt over wat je hebt verdiend — niet over een fictief percentage. De beoogde ingangsdatum is 2027, al is dat al een paar keer verschoven.
              </p>
              <p>
                Tot die tijd blijft het huidige overbruggingsstelsel van kracht. En geldt: begrijp je systeem, bereken je belasting, en zorg dat je niet onnodig te veel betaalt.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Bereken uw Box 3 belasting
            </Link>
            <Link href="/box3-tips" className="btn btn-outline inline-flex items-center gap-2">
              Zo verlaag je je Box 3 belasting →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Box3Uitleg;
