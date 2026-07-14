// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

import { KEY_WORDS } from '../utils';

const feature = config.features.connectWallet;

export function connectWallet(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  if (!feature.isEnabled || isPrivateMode) {
    return {};
  }

  switch (feature.connectorType) {
    case 'thirdweb': {
      return {
        'connect-src': [
          '*.thirdweb.com',
          'wss://*.thirdweb.com',
          '*.walletconnect.com',
          '*.walletconnect.org',
          'wss://relay.walletconnect.com',
          'wss://relay.walletconnect.org',
          'wss://www.walletlink.org',
        ],
        'frame-src': [
          '*.thirdweb.com',
        ],
        'img-src': [
          KEY_WORDS.BLOB,
          KEY_WORDS.DATA,
          '*.thirdweb.com',
          '*.walletconnect.com',
        ],
      };
    }
    case 'dynamic': {
      return {
        'connect-src': [
          'https://dynamic-static-assets.com',
          'https://app.dynamicauth.com',
          'https://logs.dynamicauth.com',
          'wss://relay.walletconnect.com',
          'wss://relay.walletconnect.org',
          // Gas Sponsorship with ZeroDev
          'https://rpc.zerodev.app',
        ],
        'font-src': [
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-italic.woff2',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-italic.woff',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-italic.woff2',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-italic.woff',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-italic.woff2',
          'https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-italic.woff',
        ],
        'style-src': [
          'https://app.dynamic.xyz',
        ],
        'img-src': [
          '*.walletconnect.com',
        ],
      };
    }
  }
}
