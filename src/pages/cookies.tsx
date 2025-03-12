import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'nl', ['common'])),
    },
  };
};

const CookiePolicy: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('cookies.title')} | 2e-woning.nl</title>
        <meta name="description" content={t('cookies.description')} />
      </Head>

      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-8">
              {t('cookies.title')}
            </h1>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2>{t('cookies.sections.introduction.title')}</h2>
                <p>{t('cookies.sections.introduction.content')}</p>
              </section>

              <section className="mb-8">
                <h2>{t('cookies.sections.what.title')}</h2>
                <p>{t('cookies.sections.what.content')}</p>
              </section>

              <section className="mb-8">
                <h2>{t('cookies.sections.types.title')}</h2>
                <h3>{t('cookies.sections.types.necessary.title')}</h3>
                <p>{t('cookies.sections.types.necessary.content')}</p>
                <ul>
                  <li>cookieConsent</li>
                  <li>NEXT_LOCALE</li>
                </ul>

                <h3 className="mt-4">{t('cookies.sections.types.analytics.title')}</h3>
                <p>{t('cookies.sections.types.analytics.content')}</p>
                <ul>
                  <li>_ga</li>
                  <li>_gid</li>
                  <li>_gat</li>
                </ul>

                <h3 className="mt-4">{t('cookies.sections.types.advertising.title')}</h3>
                <p>{t('cookies.sections.types.advertising.content')}</p>
                <ul>
                  <li>__gads</li>
                  <li>__gpi</li>
                  <li>_gcl_au</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2>{t('cookies.sections.control.title')}</h2>
                <p>{t('cookies.sections.control.content')}</p>
                <ul>
                  <li>
                    <a
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Microsoft Edge
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      Safari
                    </a>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2>{t('cookies.sections.contact.title')}</h2>
                <p>{t('cookies.sections.contact.content')}</p>
                <p>
                  Email: <a href="mailto:elandsstudio@gmail.com" className="text-primary-600 hover:underline">
                    elandsstudio@gmail.com
                  </a>
                </p>
              </section>

              <section>
                <h2>{t('cookies.sections.updates.title')}</h2>
                <p>{t('cookies.sections.updates.content')}</p>
                <p className="text-sm text-neutral-500 mt-4">
                  {t('cookies.lastUpdated')}: 2024-03-08
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CookiePolicy; 