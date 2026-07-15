// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const sitemapPath = path.join(rootDir, 'public', 'sitemap.xml');
const robotsPath = path.join(rootDir, 'public', 'robots.txt');
const ogImagePath = path.join(rootDir, 'public', 'static', 'og_image.png');

const readRequiredFile = (filePath) => {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    throw new Error(`Missing required SEO artifact: ${ filePath }`);
  }

  return fs.readFileSync(filePath, 'utf8');
};

const sitemap = readRequiredFile(sitemapPath);
const robots = readRequiredFile(robotsPath);
const appOrigin = [
  process.env.NEXT_PUBLIC_APP_PROTOCOL || 'https',
  '://',
  process.env.NEXT_PUBLIC_APP_HOST,
  process.env.NEXT_PUBLIC_APP_PORT && `:${ process.env.NEXT_PUBLIC_APP_PORT }`,
].filter(Boolean).join('');
const forbiddenSitemapPaths = [
  '/404',
  '/graphiql',
  '/l2-deposits',
  '/l2-output-roots',
  '/l2-txn-batches',
  '/l2-withdrawals',
  '/search-results',
];

if (process.env.NEXT_PUBLIC_MARKETPLACE_ENABLED !== 'true') {
  forbiddenSitemapPaths.push('/apps');
}

if (!process.env.NEXT_PUBLIC_STATS_API_HOST) {
  forbiddenSitemapPaths.push('/stats');
}

if (!process.env.NEXT_PUBLIC_ROLLUP_TYPE && process.env.NEXT_PUBLIC_HAS_BEACON_CHAIN !== 'true') {
  forbiddenSitemapPaths.push('/withdrawals');
}

for (const route of forbiddenSitemapPaths) {
  if (sitemap.includes(`<loc>${ appOrigin }${ route }</loc>`)) {
    throw new Error(`Non-indexable route found in sitemap: ${ route }`);
  }
}

if (sitemap.includes('?tab=contract')) {
  throw new Error('Non-canonical contract tab URL found in sitemap');
}

if (!robots.includes('Sitemap:')) {
  throw new Error('robots.txt does not advertise the sitemap');
}

if (!process.env.NEXT_PUBLIC_OG_IMAGE_URL) {
  if (!fs.existsSync(ogImagePath) || fs.statSync(ogImagePath).size < 1024) {
    throw new Error(`Missing or invalid generated OG image: ${ ogImagePath }`);
  }
}

console.log('SEO artifacts verified.');
