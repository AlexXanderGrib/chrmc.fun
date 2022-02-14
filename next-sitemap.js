/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://chrmc.fun',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  alternateRefs: [
    {
      href: 'https://chrmc.fun/ru',
      hreflang: 'ru',
    },
    {
      href: 'https://chrmc.fun/en',
      hreflang: 'en',
    }
  ]
}