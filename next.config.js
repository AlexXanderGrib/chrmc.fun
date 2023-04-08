/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru"],
    localeDetection: true
  },
  reactStrictMode: true,
  images: {
    domains: ["www.datocms-assets.com", "dunb17ur4ymx4.cloudfront.net"]
  },
  poweredByHeader: false
};
