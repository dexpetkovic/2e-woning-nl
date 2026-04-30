import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
  titleTemplate: '%s | Box 3 Belastingcalculator',
  defaultTitle: 'Box 3 Belastingcalculator | Bereken uw vermogensbelasting 2025',
  description: 'Bereken eenvoudig uw Box 3 vermogensbelasting voor tweede woning, investeringen en spaargeld. Gratis belastingcalculator met actuele 2025 tarieven.',
  canonical: 'https://2e-woning.nl',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://2e-woning.nl',
    siteName: '2e-woning.nl',
    title: 'Box 3 Belastingcalculator | Bereken uw vermogensbelasting 2025',
    description: 'Bereken eenvoudig uw Box 3 vermogensbelasting voor tweede woning, investeringen en spaargeld. Gratis belastingcalculator met actuele 2025 tarieven.',
    images: [
      {
        url: 'https://2e-woning.nl/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Box 3 Belastingcalculator 2025',
      },
    ],
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'box 3 belasting, vermogensbelasting, tweede woning belasting, belastingcalculator, spaarbelasting, beleggingsbelasting, vermogensrendementsheffing, belastingaangifte 2025, box 3 2025, box 3 2026, vermogensbelasting calculator gratis',
    },
    {
      name: 'author',
      content: 'Elands Studio',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'alternate',
      hrefLang: 'nl',
      href: 'https://2e-woning.nl',
    },
    {
      rel: 'alternate',
      hrefLang: 'en',
      href: 'https://2e-woning.nl/en',
    },
    {
      rel: 'alternate',
      hrefLang: 'x-default',
      href: 'https://2e-woning.nl',
    },
  ],
  twitter: {
    handle: '@elandsstudio',
    site: '@elandsstudio',
    cardType: 'summary_large_image',
  },
};

export default config;
