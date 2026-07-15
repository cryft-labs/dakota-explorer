// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

console.log('🎨 Generating OG image...');

const targetFile = path.resolve(process.cwd(), 'public/static/og_image.png');
const appProtocol = process.env.NEXT_PUBLIC_APP_PROTOCOL || 'https';
const appHost = process.env.NEXT_PUBLIC_APP_HOST;
const appPort = process.env.NEXT_PUBLIC_APP_PORT;
const appOrigin = [
  appProtocol,
  '://',
  appHost,
  appPort && `:${ appPort }`,
].filter(Boolean).join('');
const isDakota = appHost?.endsWith('.dakota.cards') || process.env.NEXT_PUBLIC_APP_INSTANCE?.startsWith('dakota');
const dakotaImageFile = path.resolve(process.cwd(), 'public/static/dakota_og_image.png');
const configuredLogo = process.env.NEXT_PUBLIC_NETWORK_LOGO_DARK ?? process.env.NEXT_PUBLIC_NETWORK_LOGO;
const configuredBanner = process.env.NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG;

function getAbsoluteAssetUrl(assetUrl) {
  if (!assetUrl || /^https?:\/\//.test(assetUrl)) {
    return assetUrl;
  }

  return `${ appOrigin }${ assetUrl.startsWith('/') ? '' : '/' }${ assetUrl }`;
}

function copyPlaceholderImage() {
  const sourceFile = path.resolve(process.cwd(), 'public/static/og_placeholder.png');
  fs.copyFileSync(sourceFile, targetFile);
}

if (process.env.NEXT_PUBLIC_OG_IMAGE_URL) {
  console.log('⏩ NEXT_PUBLIC_OG_IMAGE_URL is set. Skipping OG image generation...');
} else if (isDakota && fs.existsSync(dakotaImageFile)) {
  console.log('Copying Dakota-branded OG image...');
  fs.copyFileSync(dakotaImageFile, targetFile);
} else if (!process.env.NEXT_PUBLIC_NETWORK_NAME) {
  console.log('⏩ NEXT_PUBLIC_NETWORK_NAME is not set. Copying placeholder image...');
  copyPlaceholderImage();
} else if (!configuredLogo && !configuredBanner && !isDakota) {
  console.log('⏩ Neither NEXT_PUBLIC_NETWORK_LOGO nor NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG is set. Copying placeholder image...');
  copyPlaceholderImage();
} else {
  try {
    const bannerConfig = JSON.parse(configuredBanner?.replaceAll('\'', '"') || '{}');
    const dakotaLogoOrigin = appHost === 'localhost' ? 'https://explore.dakota.cards' : appOrigin;
    const data = {
      title: bannerConfig.text || (isDakota ? 'Dakota Network Explorer' : `${ process.env.NEXT_PUBLIC_NETWORK_NAME } explorer`),
      logo_url: getAbsoluteAssetUrl(configuredLogo) || (isDakota ? `${ dakotaLogoOrigin }/assets/dakota/dakota-rabbit-logo.svg` : undefined),
      background: bannerConfig.background?.[0] || (isDakota ? 'linear-gradient(135deg, #06231d 0%, #0a473b 56%, #0d817b 100%)' : undefined),
      title_color: bannerConfig.text_color?.[0] || (isDakota ? '#f2fbf8' : undefined),
      invert_logo: !process.env.NEXT_PUBLIC_NETWORK_LOGO_DARK && !isDakota,
      app_url: appOrigin,
    };

    console.log('⏳ Making request to OG image generator service...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    const response = await fetch('https://bigs.services.blockscout.com/generate/og', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('⬇️  Downloading the image...');
      const buffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);
      fs.writeFileSync(targetFile, imageBuffer);
    } else {
      const payload = response.headers.get('Content-type')?.includes('application/json') ? await response.json() : await response.text();
      console.error('🛑 Failed to generate OG image. Response:', payload);
      console.log('Copying placeholder image...');
      copyPlaceholderImage();
    }
  } catch (error) {
    console.error('🛑 Failed to generate OG image. Error:', error?.message);
    console.log('Copying placeholder image...');
    copyPlaceholderImage();
  }
}

console.log('✅ Done.');
