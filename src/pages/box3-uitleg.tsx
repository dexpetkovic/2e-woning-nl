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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Box 3 uitgelegd - wat het is, hoe het werkt en waarom het zo ingewikkeld lijkt",
  "description": "Een duidelijke uitleg van Box 3 belasting in Nederland. Wat is fictief rendement, hoe werkt het heffingvrij vermogen, en wat verandert er in 2027?",
  "author": { "@type": "Organization", "name": "Elands AI" },
  "publisher": { "@type": "Organization", "name": "2e-woning.nl" },
};

type RateItem = { label: string; rate: string; note: string };

const Box3Uitleg: React.FC = () => {
  const { t } = useTranslation('box3-uitleg');
  const rateItems = t('rates.items', { returnObjects: true }) as RateItem[];

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
        canonical="https://2e-woning.nl/box3-uitleg"
        additionalMetaTags={[{
          name: 'keywords',
          content: t('meta.keywords'),
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

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('threeBoxes.title')}</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>{t('threeBoxes.p1')}</p>
              <p>{t('threeBoxes.p2')}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('fictiveReturn.title')}</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p dangerouslySetInnerHTML={{ __html: t('fictiveReturn.p1') }} />
              <p>{t('fictiveReturn.p2')}</p>
              <p>{t('fictiveReturn.p3')}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('rates.title')}</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>{t('rates.intro')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                {rateItems.map((r) => (
                  <div key={r.label} className="bg-appleGray-50 rounded-xl p-3 border border-appleGray-100">
                    <p className="text-xs text-appleGray-400 mb-1">{r.label}</p>
                    <p className="text-xl font-bold text-appleGray-800">{r.rate}</p>
                    <p className="text-xs text-appleGray-400 mt-1">{r.note}</p>
                  </div>
                ))}
              </div>
              <p dangerouslySetInnerHTML={{ __html: t('rates.taxNote') }} />
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('courtCases.title')}</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>{t('courtCases.p1')}</p>
              <p>{t('courtCases.p2')}</p>
              <p>{t('courtCases.p3')}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-appleGray-900 mb-4">{t('currentSystem.title')}</h2>
            <div className="text-sm text-appleGray-600 leading-relaxed space-y-3">
              <p>{t('currentSystem.p1')}</p>
              <p dangerouslySetInnerHTML={{ __html: t('currentSystem.p2') }} />
              <p>{t('currentSystem.p3')}</p>
            </div>
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
          </div>
        </div>
      </main>
    </>
  );
};

export default Box3Uitleg;
