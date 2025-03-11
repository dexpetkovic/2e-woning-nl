import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

// Get Google AdSense client ID from environment variables
const GOOGLE_ADSENSE_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || '';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Google AdSense Verification */}
          <meta name="google-adsense-account" content={GOOGLE_ADSENSE_CLIENT} />
          
          {/* Google AdSense Script - Only load if client ID is available */}
          {GOOGLE_ADSENSE_CLIENT && (
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
            />
          )}
          
          {/* Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 