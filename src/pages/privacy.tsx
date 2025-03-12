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

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t('privacy.title')} | 2e-woning.nl</title>
        <meta name="description" content={t('privacy.description')} />
      </Head>

      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-8">
              {t('privacy.title')}
            </h1>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2>{t('privacy.sections.introduction.title')}</h2>
                <p>{t('privacy.sections.introduction.content')}</p>
              </section>

              <section className="mb-8">
                <h2>{t('privacy.sections.dataCollection.title')}</h2>
                <p>{t('privacy.sections.dataCollection.content')}</p>
                <ul>
                  <li>{t('privacy.sections.dataCollection.items.calculations')}</li>
                  <li>{t('privacy.sections.dataCollection.items.technical')}</li>
                  <li>{t('privacy.sections.dataCollection.items.cookies')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2>{t('privacy.sections.dataUse.title')}</h2>
                <p>{t('privacy.sections.dataUse.content')}</p>
                <ul>
                  <li>{t('privacy.sections.dataUse.items.service')}</li>
                  <li>{t('privacy.sections.dataUse.items.improvement')}</li>
                  <li>{t('privacy.sections.dataUse.items.communication')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2>{t('privacy.sections.dataSharing.title')}</h2>
                <p>{t('privacy.sections.dataSharing.content')}</p>
                <ul>
                  <li>{t('privacy.sections.dataSharing.items.thirdParty')}</li>
                  <li>{t('privacy.sections.dataSharing.items.legal')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2>{t('privacy.sections.cookies.title')}</h2>
                <p>{t('privacy.sections.cookies.content')}</p>
                <p>
                  <a href="/cookies" className="text-primary-600 hover:underline">
                    {t('privacy.sections.cookies.policyLink')}
                  </a>
                </p>
              </section>

              <section className="mb-8">
                <h2>{t('privacy.sections.rights.title')}</h2>
                <p>{t('privacy.sections.rights.content')}</p>
                <ul>
                  <li>{t('privacy.sections.rights.items.access')}</li>
                  <li>{t('privacy.sections.rights.items.rectification')}</li>
                  <li>{t('privacy.sections.rights.items.erasure')}</li>
                  <li>{t('privacy.sections.rights.items.restriction')}</li>
                  <li>{t('privacy.sections.rights.items.portability')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2>{t('privacy.sections.contact.title')}</h2>
                <p>{t('privacy.sections.contact.content')}</p>
                <p>
                  Email: <a href="mailto:elandsstudio@gmail.com" className="text-primary-600 hover:underline">
                    elandsstudio@gmail.com
                  </a>
                </p>
              </section>

              <section>
                <h2>{t('privacy.sections.updates.title')}</h2>
                <p>{t('privacy.sections.updates.content')}</p>
                <p className="text-sm text-neutral-500 mt-4">
                  {t('privacy.lastUpdated')}: 2024-03-08
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy; 