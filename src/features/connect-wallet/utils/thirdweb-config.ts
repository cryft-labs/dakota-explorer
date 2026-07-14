// SPDX-License-Identifier: LicenseRef-Blockscout

import { defineChain } from 'thirdweb';
import type { Wallet } from 'thirdweb/wallets';
import { createWallet, inAppWallet } from 'thirdweb/wallets';

import { chains, currentChain } from 'src/features/connect-wallet/utils/chains';
import { thirdwebClient as configuredThirdwebClient } from 'src/features/connect-wallet/utils/thirdweb-client';

import config from 'src/config';

if (!configuredThirdwebClient) {
  throw new Error('Thirdweb wallet connection is not configured');
}

export const thirdwebClient = configuredThirdwebClient;

export const thirdwebChains = chains.map((chain) => {
  const defaultExplorer = chain.blockExplorers?.default;
  const rpc = chain.rpcUrls.default.http.find(Boolean);

  return defineChain({
    id: chain.id,
    name: chain.name,
    nativeCurrency: chain.nativeCurrency,
    ...(chain.testnet ? { testnet: true as const } : {}),
    ...(rpc ? { rpc } : {}),
    ...(defaultExplorer ? {
      blockExplorers: [ {
        name: defaultExplorer.name,
        url: defaultExplorer.url,
      } ],
    } : {}),
  });
});

export const thirdwebChain = thirdwebChains.find((chain) => chain.id === currentChain?.id) ?? thirdwebChains[0];

if (!thirdwebChain) {
  throw new Error('Thirdweb requires at least one configured chain');
}

export const thirdwebInAppWallet = inAppWallet({ auth: { options: [ 'google', 'apple', 'email' ] } });

export const thirdwebWallets: Array<Wallet> = [
  thirdwebInAppWallet,
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('walletConnect'),
];

export const thirdwebAppMetadata = {
  name: 'Dakota Cards | Network Explorer',
  description: 'Dakota Network blockchain and network explorer',
  url: config.app.baseUrl,
  logoUrl: config.chain.icon.default,
};
