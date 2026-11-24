// SPDX-License-Identifier: LicenseRef-Blockscout

import app from 'src/config/app';
import { getEnvValue, getExternalAssetFilePath } from 'src/config/utils/envs';

const defaultImageUrl = '/static/og_image.png';
const defaultDescription = [
  'Cryft Network Explorer for searching transactions, blocks, addresses, tokens,',
  'smart contracts, validator activity, and IPFS CIDs across the Cryft Cards ecosystem.',
].join(' ');

const metadata = Object.freeze({
  promoteBlockscoutInTitle: getEnvValue('NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE') === 'true',
  og: {
    description: getEnvValue('NEXT_PUBLIC_OG_DESCRIPTION') || defaultDescription,
    // relative when the host is unknown (a page prerendered at build time), never "https:///…"
    imageUrl: (app.host ? app.baseUrl : '') + (getExternalAssetFilePath('NEXT_PUBLIC_OG_IMAGE_URL') || defaultImageUrl),
    enhancedDataEnabled: getEnvValue('NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED') !== 'false',
  },
  seo: {
    enhancedDataEnabled: getEnvValue('NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED') === 'true',
  },
});

export default metadata;
