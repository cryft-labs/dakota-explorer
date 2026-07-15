// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable no-console */

import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const templatePath = path.join(root, 'deploy/tools/dakota-og-preview.html');
const logoPath = path.join(root, 'public/assets/dakota/dakota-rabbit-logo.svg');
const outputPath = path.join(root, 'public/static/dakota_og_image.png');
const edgePath = process.env.EDGE_PATH || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const html = fs.readFileSync(templatePath, 'utf8')
  .replace('{{LOGO}}', fs.readFileSync(logoPath, 'utf8'));

const browser = await chromium.launch({
  executablePath: fs.existsSync(edgePath) ? edgePath : undefined,
  headless: true,
});

try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: outputPath, type: 'png' });
  console.log('Generated ' + outputPath);
} finally {
  await browser.close();
}
