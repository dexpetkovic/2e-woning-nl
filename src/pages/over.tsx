import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Script from 'next/script';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'nl', ['common', 'over'])),
  },
});

const Over: React.FC = () => {
  const { t } = useTranslation('over');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": t('meta.title'),
    "description": t('meta.description'),
    "url": "https://2e-woning.nl/over",
    "mainEntity": {
      "@type": "Person",
      "name": "Dejan Petković",
      "url": "https://dejan.petkovic.nl",
      "jobTitle": "AI engineer, founder of Elands AI",
      "worksFor": {
        "@type": "Organization",
        "name": "Elands AI",
        "vatID": "115160487",
        "taxID": "22121910",
      },
      "knowsAbout": ["Box 3", "Dutch tax law", "fictief rendement", "vermogensbelasting", "AI engineering"],
    },
  };

  const intro = t('intro.paragraphs', { returnObjects: true }) as string[];
  const whyBuilt = t('whyBuilt.paragraphs', { returnObjects: true }) as string[];
  const whatItIsNot = t('whatItIsNot.paragraphs', { returnObjects: true }) as string[];
  const approach = t('approach.paragraphs', { returnObjects: true }) as string[];
  const accountability = t('accountability.paragraphs', { returnObjects: true }) as string[];
  const credentials = t('credentials.paragraphs', { returnObjects: true }) as string[];

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
        canonical="https://2e-woning.nl/over"
        additionalMetaTags={[{ name: 'keywords', content: t('meta.keywords') }]}
      />
      <Script
        id="structured-data-over"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-appleGray-50">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-accent-500/6 blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-appleGray-900 mb-4 tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-appleGray-500 max-w-xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 pb-16 space-y-6">
          {/* Byline / identity card */}
          <div className="card p-6 md:p-7 flex items-center gap-5 flex-wrap">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-accent-500/15 border border-accent-500/30 flex items-center justify-center font-display text-2xl font-semibold text-accent-600">
              DP
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="font-display text-xl font-semibold text-appleGray-900 leading-tight">
                {t('byline.name')}
              </p>
              <p className="text-sm text-appleGray-600 leading-snug mt-1">
                {t('byline.role')}
              </p>
              <p className="text-xs font-mono text-appleGray-500 uppercase tracking-[.1em] mt-2">
                {t('byline.location')} ·{' '}
                <a
                  href="https://dejan.petkovic.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-600 hover:underline normal-case tracking-normal"
                >
                  {t('byline.personalSite')}
                </a>
              </p>
            </div>
            <div className="font-mono text-[10.5px] uppercase tracking-[.12em] text-appleGray-500">
              {t('byline.lastUpdated')}
            </div>
          </div>

          <Section title={t('intro.title')} paragraphs={intro} />
          <Section title={t('whyBuilt.title')} paragraphs={whyBuilt} />
          <Section title={t('whatItIsNot.title')} paragraphs={whatItIsNot} />
          <Section title={t('approach.title')} paragraphs={approach} />
          <Section title={t('accountability.title')} paragraphs={accountability} />
          <Section title={t('credentials.title')} paragraphs={credentials} html />

          <div className="card bg-appleGray-900 text-appleGray-50 p-7 md:p-8">
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-display leading-tight mb-3">
              {t('cta.title')}
            </h2>
            <p className="text-appleGray-50/80 leading-relaxed mb-5 max-w-[58ch]">
              {t('cta.intro')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
                {t('cta.calculator')}
              </Link>
              <Link href="/box3-uitleg" className="btn btn-outline inline-flex items-center gap-2 bg-transparent text-appleGray-50 border-appleGray-50/30 hover:bg-appleGray-50/10">
                {t('cta.uitleg')}
              </Link>
              <a
                href="mailto:hello@elands.studio"
                className="btn btn-outline inline-flex items-center gap-2 bg-transparent text-appleGray-50 border-appleGray-50/30 hover:bg-appleGray-50/10"
              >
                {t('cta.contact')}
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const Section: React.FC<{ title: string; paragraphs: string[]; html?: boolean }> = ({
  title,
  paragraphs,
  html = false,
}) => (
  <div className="card">
    <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{title}</h2>
    <div className="text-[15px] text-appleGray-700 leading-relaxed space-y-4">
      {paragraphs.map((p, i) =>
        html ? (
          <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
        ) : (
          <p key={i}>{p}</p>
        )
      )}
    </div>
  </div>
);

export default Over;
