import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Script from 'next/script';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'nl', ['common', 'rechtbank'])),
  },
});

const IMPACT_COLORS: Record<string, string> = {
  hoog: 'bg-red-50 text-red-600 border-red-100',
  middel: 'bg-amber-50 text-amber-600 border-amber-100',
  laag: 'bg-green-50 text-green-600 border-green-100',
};

type TimelineItem = {
  year: string;
  label: string;
  summary: string;
  impact: string;
  ecli?: string | null;
  href: string;
  forYou?: string[];
};
type WhatItem = { title: string; body: string };

const Rechtbank: React.FC = () => {
  const { t } = useTranslation('rechtbank');
  const timeline = t('timeline', { returnObjects: true }) as TimelineItem[];
  const whatItems = t('whatYouCanDo.items', { returnObjects: true }) as WhatItem[];
  const impactLabels = t('impactLabels', { returnObjects: true }) as Record<string, string>;
  const humanStoryParagraphs = t('humanStory.paragraphs', { returnObjects: true }) as string[];
  const myViewParagraphs = t('myView.paragraphs', { returnObjects: true }) as string[];

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

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
        canonical="https://2e-woning.nl/rechtbank"
        additionalMetaTags={[{ name: 'keywords', content: t('meta.keywords') }]}
      />
      <Script
        id="structured-data-rechtbank"
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
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

          {/* Context */}
          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-3">{t('context.title')}</h2>
            <p
              className="text-[15px] text-appleGray-700 leading-relaxed mb-3"
              dangerouslySetInnerHTML={{ __html: t('context.p1') }}
            />
            <p className="text-[15px] text-appleGray-700 leading-relaxed">{t('context.p2')}</p>
          </div>

          {/* Human story behind Kerstarrest */}
          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('humanStory.title')}</h2>
            <div className="text-[15px] text-appleGray-700 leading-relaxed space-y-4">
              {humanStoryParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          {/* Timeline */}
          <h2 className="text-lg font-semibold text-appleGray-900 mb-1 pt-2">{t('timelineTitle')}</h2>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-appleGray-200" />
            <div className="space-y-6">
              {timeline.map((item) => (
                <div key={item.year} className="relative flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-appleGray-200 flex items-center justify-center z-10 text-xs font-bold text-appleGray-700 font-mono">
                    {item.year.slice(2)}
                  </div>
                  <div className="card flex-1 pb-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <div>
                        <p className="text-xs text-appleGray-500 font-medium mb-0.5 font-mono uppercase tracking-[.1em]">{item.year}</p>
                        <h3 className="text-base font-semibold text-appleGray-900">{item.label}</h3>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${IMPACT_COLORS[item.impact]}`}>
                        {impactLabels[item.impact]}
                      </span>
                    </div>
                    <p
                      className="text-[14.5px] text-appleGray-700 leading-relaxed mb-3"
                      dangerouslySetInnerHTML={{ __html: item.summary }}
                    />

                    {item.forYou && item.forYou.length > 0 && (
                      <div className="mt-3 mb-3 px-4 py-3 bg-appleGray-100/60 border border-appleGray-200/80 rounded-xl">
                        <p className="font-mono uppercase tracking-[.1em] text-[10.5px] text-appleGray-500 mb-2">
                          Wat dit voor jou betekent
                        </p>
                        <ul className="space-y-1.5">
                          {item.forYou.map((f, i) => (
                            <li key={i} className="text-[13.5px] text-appleGray-700 leading-relaxed flex gap-2">
                              <span className="text-accent-500 flex-shrink-0">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 hover:underline"
                      >
                        {t('readMore')}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      {item.ecli && (
                        <span className="font-mono text-[10.5px] uppercase tracking-[.1em] text-appleGray-500">
                          {item.ecli}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My view */}
          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('myView.title')}</h2>
            <div className="text-[15px] text-appleGray-700 leading-relaxed space-y-4">
              {myViewParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          {/* What you can do */}
          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('whatYouCanDo.title')}</h2>
            <div className="space-y-4">
              {whatItems.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-appleGray-900">{item.title}</p>
                    <p className="text-sm text-appleGray-700 mt-0.5 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {t('cta')}
            </Link>
            <p className="text-xs text-appleGray-500 mt-3">
              {t('source')}:{' '}
              <a href="https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/" target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:underline">
                {t('sourceLinks.belastingdienst')}
              </a>{' '}
              ·{' '}
              <a href="https://uitspraken.rechtspraak.nl/" target="_blank" rel="noopener noreferrer" className="text-accent-600 hover:underline">
                {t('sourceLinks.rechtspraak')}
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Rechtbank;
