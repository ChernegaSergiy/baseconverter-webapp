const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const { availableLanguages } = require('../lib/translations');

const BASE_URL = 'https://radix.pp.ua';

async function generateSitemap() {
  const smStream = new SitemapStream({ hostname: BASE_URL });

  const links = [
    ...availableLanguages.map((lang) => ({ lang, url: '/' })),
    { lang: 'x-default', url: '/' },
  ];

  smStream.write({
    url: '/',
    changefreq: 'monthly',
    priority: 1.0,
    lastmodISO: new Date().toISOString(),
    links,
  });

  smStream.end();

  const sitemapBuffer = await streamToPromise(smStream);
  return sitemapBuffer.toString('utf8');
}

async function main() {
  try {
    const sitemap = await generateSitemap();
    const sitemapPath = path.join(__dirname, '../out', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`Sitemap generated at ${sitemapPath}`);
  } catch (error) {
    console.error('Failed to generate sitemap', error);
    process.exit(1);
  }
}

main();
