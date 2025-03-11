# Box 3 Belastingcalculator | 2e-woning.nl

Een moderne web applicatie voor het berekenen van Box 3 belasting in Nederland, specifiek gericht op tweede woningen en andere investeringen.

## Functionaliteiten

- Berekening van Box 3 belasting volgens de Nederlandse belastingregels voor 2024
- Ondersteuning voor verschillende soorten bezittingen (banktegoeden, beleggingen, onroerend goed)
- Rekening houden met fiscale partners
- Stapsgewijze uitleg van de berekening
- Responsive design voor desktop en mobiel
- Meertalige ondersteuning (Nederlands en Engels)
- Google AdSense integratie
- Bedrijfsinformatie en branding

## Technische Details

Deze applicatie is gebouwd met:

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [next-i18next](https://github.com/i18next/next-i18next) - Internationalisatie
- [react-google-adsense](https://github.com/hustcc/react-google-adsense) - Google AdSense integratie

## Installatie

```bash
# Installeer dependencies
npm install

# Start de development server
npm run dev

# Bouw voor productie
npm run build

# Start de productie server
npm start
```

## Google AdSense Configuratie

Om Google AdSense te configureren:

1. Vervang `GOOGLE_ADSENSE_CLIENT` in `src/pages/_document.tsx` en `src/pages/index.tsx` met je eigen Google AdSense client ID
2. Vervang `GOOGLE_ADSENSE_SLOT_HORIZONTAL` en `GOOGLE_ADSENSE_SLOT_VERTICAL` in `src/pages/index.tsx` met je eigen ad slot IDs
3. Pas de ad formaten aan indien nodig

## Belastingregels 2024

De applicatie gebruikt de volgende percentages voor 2024:

- Banktegoeden: 1,44%
- Beleggingen en andere bezittingen: 6,04%
- Schulden: 2,61%
- Belastingtarief: 36%
- Heffingsvrij vermogen: €57.000 per persoon (€114.000 voor fiscale partners)

Bron: [Belastingdienst](https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2024)

## Talen

De applicatie ondersteunt de volgende talen:

- Nederlands (standaard)
- Engels

## Disclaimer

Deze calculator is bedoeld als hulpmiddel. De berekeningen zijn gebaseerd op de belastingregels van 2024, maar kunnen afwijken van uw werkelijke belastingaanslag. Raadpleeg altijd een belastingadviseur voor uw specifieke situatie.

## Licentie

Copyright © 2024 Elands Studio. Alle rechten voorbehouden. 