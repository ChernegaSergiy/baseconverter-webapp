const fs = require('fs');
const path = require('path');

const { availableLanguages } = require('../lib/translations');

const BASE_URL = 'https://radix.pp.ua';

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  xml += `<url>`;
  xml += `<loc>${BASE_URL}</loc>`;

  for (const lang of availableLanguages) {
    xml += `<xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}" />`;
  }

  xml += `<xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}" />`;
  xml += `<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>`;
  xml += `<changefreq>monthly</changefreq>`;
  xml += `<priority>1.0</priority>`;
  xml += `</url>`;

  xml += `</urlset>`;
  return xml;
}

function main() {
  const sitemap = generateSitemap();
  const sitemapPath = path.join(__dirname, '../out', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Sitemap generated at ${sitemapPath}`);
}

main();
