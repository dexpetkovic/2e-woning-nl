import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Script from 'next/script';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'nl', ['common', 'box3-uitleg'])),
  },
});

type RateItem = { label: string; rate: string; note: string };
type CaseItem = { label: string; body: string };
type SourceItem = { label: string; href: string };

const Box3Uitleg: React.FC = () => {
  const { t } = useTranslation('box3-uitleg');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": t('meta.title'),
    "description": t('meta.description'),
    "author": {
      "@type": "Person",
      "name": "Dejan Petković",
      "url": "https://2e-woning.nl/over",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Elands AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://2e-woning.nl/images/elands-studio-logo.png",
      },
    },
    "datePublished": "2024-06-01",
    "dateModified": "2026-05-14",
  };

  const introParagraphs = t('intro.paragraphs', { returnObjects: true }) as string[];
  const threeBoxesParagraphs = t('threeBoxes.paragraphs', { returnObjects: true }) as string[];
  const fictiveReturnParagraphs = t('fictiveReturn.paragraphs', { returnObjects: true }) as string[];
  const rateItems = t('rates.items', { returnObjects: true }) as RateItem[];
  const afterRates = t('rates.afterRates', { returnObjects: true }) as string[];
  const cases = t('realWorldCases.cases', { returnObjects: true }) as CaseItem[];
  const personalNoteParagraphs = t('personalNote.paragraphs', { returnObjects: true }) as string[];
  const courtCasesParagraphs = t('courtCases.paragraphs', { returnObjects: true }) as string[];
  const currentSystemParagraphs = t('currentSystem.paragraphs', { returnObjects: true }) as string[];
  const sourceItems = t('sources.items', { returnObjects: true }) as SourceItem[];

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
        canonical="https://2e-woning.nl/box3-uitleg"
        additionalMetaTags={[{ name: 'keywords', content: t('meta.keywords') }]}
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
          <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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

          {/* Byline */}
          <div className="card p-4 md:p-5 flex items-center gap-4 flex-wrap text-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-500/15 border border-accent-500/30 flex items-center justify-center font-display text-sm font-semibold text-accent-600">
              DP
            </div>
            <div className="flex-1 min-w-[160px] leading-tight">
              <p className="text-appleGray-700">
                <span className="text-appleGray-500">{t('byline.prefix')}</span>{' '}
                <Link href="/over" className="font-semibold text-appleGray-900 no-underline hover:text-accent-600">
                  {t('byline.author')}
                </Link>
              </p>
              <p className="text-xs text-appleGray-500 mt-0.5">{t('byline.context')}</p>
            </div>
            <div className="font-mono text-[10.5px] uppercase tracking-[.12em] text-appleGray-500">
              {t('byline.lastUpdated')}
            </div>
          </div>

          <Section title={t('intro.title')} paragraphs={introParagraphs} />
          <Section title={t('threeBoxes.title')} paragraphs={threeBoxesParagraphs} />
          <Section title={t('fictiveReturn.title')} paragraphs={fictiveReturnParagraphs} html />

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('rates.title')}</h2>
            <div className="text-[15px] text-appleGray-700 leading-relaxed space-y-4">
              <p>{t('rates.intro')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                {rateItems.map((r) => (
                  <div key={r.label} className="bg-appleGray-50 rounded-xl p-3 border border-appleGray-100">
                    <p className="text-xs text-appleGray-500 mb-1">{r.label}</p>
                    <p className="text-xl font-bold text-appleGray-800 font-mono tabular-nums">{r.rate}</p>
                    <p className="text-xs text-appleGray-500 mt-1">{r.note}</p>
                  </div>
                ))}
              </div>
              <p dangerouslySetInnerHTML={{ __html: t('rates.taxNote') }} />
              {afterRates.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('realWorldCases.title')}</h2>
            <div className="text-[15px] text-appleGray-700 leading-relaxed space-y-4">
              <p>{t('realWorldCases.intro')}</p>
              <div className="space-y-3">
                {cases.map((c) => (
                  <div key={c.label} className="border-l-2 border-accent-500/40 pl-4 py-1">
                    <p className="font-semibold text-appleGray-900 text-[14px] mb-1">{c.label}</p>
                    <p className="text-[14.5px] text-appleGray-700 leading-relaxed">{c.body}</p>
                  </div>
                ))}
              </div>
              <p className="italic text-appleGray-600">{t('realWorldCases.afterCases')}</p>
            </div>
          </div>

          <Section title={t('personalNote.title')} paragraphs={personalNoteParagraphs} />
          <Section title={t('courtCases.title')} paragraphs={courtCasesParagraphs} />
          <Section title={t('currentSystem.title')} paragraphs={currentSystemParagraphs} html />

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-3">{t('sources.title')}</h2>
            <p className="text-sm text-appleGray-600 leading-relaxed mb-3">{t('sources.intro')}</p>
            <ul className="space-y-1.5">
              {sourceItems.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent-600 hover:underline"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {t('cta.calculator')}
            </Link>
            <Link href="/box3-tips" className="btn btn-outline inline-flex items-center gap-2">
              {t('cta.tips')}
            </Link>
            <Link href="/rechtbank" className="btn btn-outline inline-flex items-center gap-2">
              {t('cta.rechtbank')}
            </Link>
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
        html ? <p key={i} dangerouslySetInnerHTML={{ __html: p }} /> : <p key={i}>{p}</p>
      )}
    </div>
  </div>
);

export default Box3Uitleg;
