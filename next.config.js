const { i18n } = require('./next-i18next.config');

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  i18n,
  reactStrictMode: true,
  images: {
    domains: ['www.datocms-assets.com', 'dunb17ur4ymx4.cloudfront.net'],
  },
  // experimental: {
  //   // reactRoot: true,

  // },
  poweredByHeader: false,
}
