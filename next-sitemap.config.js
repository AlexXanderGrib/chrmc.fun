/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://dicraft.net",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  additionalPaths: (config) => [
    { loc: "/ru/store", changefreq: config.changefreq }
  ]
};
