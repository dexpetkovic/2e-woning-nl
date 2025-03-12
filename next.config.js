/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.amplitude.com https://cdn.amplitude.com https://pagead2.googlesyndication.com",
              "connect-src 'self' https://api.amplitude.com https://api2.amplitude.com",
              "img-src 'self' data: https:",
              "style-src 'self' 'unsafe-inline'",
              "frame-src 'self' https://googleads.g.doubleclick.net",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 