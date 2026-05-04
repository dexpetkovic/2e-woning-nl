import React from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import Script from 'next/script';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'nl', ['common', 'box3-tips'])),
  },
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Zo verlaag je je Box 3 belasting - 5 dingen die echt werken",
  "description": "Vijf legale manieren om minder Box 3 belasting te betalen: fiscaal partnerschap, groene beleggingen, schulden aflossen voor 1 januari en meer.",
  "author": { "@type": "Organization", "name": "Elands AI" },
  "publisher": { "@type": "Organization", "name": "2e-woning.nl" },
};

type TipItem = { number: string; title: string; body: string[] };

const Box3Tips: React.FC = () => {
  const { t } = useTranslation('box3-tips');
  const tips = t('tips', { returnObjects: true }) as TipItem[];

  return (
    <>
      <NextSeo
        title={t('meta.title')}
        description={t('meta.description')}
        canonical="https://2e-woning.nl/box3-tips"
        additionalMetaTags={[{
          name: 'keywords',
          content: t('meta.keywords'),
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

        <div className="max-w-3xl mx-auto px-6 pb-16 space-y-5">
          {tips.map((tip) => (
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
              <strong className="text-appleGray-800">{t('disclaimerBold')}</strong>{t('disclaimerText')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {t('cta.calculator')}
            </Link>
            <Link href="/box3-uitleg" className="btn btn-outline inline-flex items-center gap-2">
              {t('cta.uitleg')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Box3Tips;
