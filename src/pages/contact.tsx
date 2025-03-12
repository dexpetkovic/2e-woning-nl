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

const Contact: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('contact.title')} | 2e-woning.nl</title>
        <meta name="description" content={t('contact.description')} />
      </Head>

      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-8">
              {t('contact.title')}
            </h1>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2>{t('contact.sections.general.title')}</h2>
                <p>{t('contact.sections.general.content')}</p>
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">{t('contact.sections.general.company')}</h3>
                  <ul className="list-none p-0">
                    <li>Elands Studio</li>
                    <li>
                      Email: <a href="mailto:elandsstudio@gmail.com" className="text-primary-600 hover:underline">
                        elandsstudio@gmail.com
                      </a>
                    </li>
                    <li>Elands Studio is registered in Serbian Chamber of commerce under:</li>
                    <li>Tax ID: 114346597</li>
                    <li>Company ID: 67504151</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2>{t('contact.sections.support.title')}</h2>
                <p>{t('contact.sections.support.content')}</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t('contact.sections.support.email.title')}</h3>
                    <p>{t('contact.sections.support.email.content')}</p>
                    <a href="mailto:elandsstudio@gmail.com" className="text-primary-600 hover:underline">
                      elandsstudio@gmail.com
                    </a>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2>{t('contact.sections.privacy.title')}</h2>
                <p>{t('contact.sections.privacy.content')}</p>
                <div className="mt-4">
                  <ul className="list-none p-0 space-y-2">
                    <li>
                      <a href="/privacy" className="text-primary-600 hover:underline">
                        {t('contact.sections.privacy.privacyPolicy')}
                      </a>
                    </li>
                    <li>
                      <a href="/cookies" className="text-primary-600 hover:underline">
                        {t('contact.sections.privacy.cookiePolicy')}
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2>{t('contact.sections.response.title')}</h2>
                <p>{t('contact.sections.response.content')}</p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact; 