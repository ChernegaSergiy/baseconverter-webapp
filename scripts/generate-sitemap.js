const fs = require('fs');
const path = require('path');

const { availableLanguages } = require('../lib/translations');

const BASE_URL = 'https://radix.pp.ua';

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}</loc>\n`;

  xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
  xml += `    <changefreq>monthly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;

  for (const lang of availableLanguages) {
    xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}" />\n`;
  }

  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}" />\n`;

  xml += `  </url>\n`;
  xml += `</urlset>\n`;
  return xml;
}

function main() {
  const sitemap = generateSitemap();
  const sitemapPath = path.join(__dirname, '../out', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Sitemap generated at ${sitemapPath}`);
}

main();
