/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/api/*', '/auth/*', '/checkout/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/auth', '/checkout'],
      },
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
} 