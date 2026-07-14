// SPDX-License-Identifier: LicenseRef-Blockscout

import chain from 'src/slices/chain/config';

import accountFeature from 'src/features/account/config';
import multichain from 'src/features/multichain/config';

import app from 'src/config/app';
import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const thirdwebClientId = getEnvValue('NEXT_PUBLIC_THIRDWEB_CLIENT_ID');

const title = 'Blockchain interaction (writing to contract, etc.)';

type FeaturePayload = {
  connectorType: 'thirdweb';
  thirdweb: { clientId: string };
} | {
  connectorType: 'dynamic';
  dynamic: { environmentId: string };
};

const config: Feature<FeaturePayload> = (() => {

  // all chain parameters are required for wagmi provider
  // @wagmi/chains/dist/index.d.ts
  const isSingleChain = Boolean(
    chain.id &&
    chain.name &&
    chain.currency.name &&
    chain.currency.symbol &&
    chain.currency.decimals &&
    chain.rpcUrls.length > 0,
  );

  const isMultichain = multichain.isEnabled;

  if (
    !app.isPrivateMode &&
    (isSingleChain || isMultichain)
  ) {
    if (accountFeature.isEnabled && accountFeature.authProvider === 'dynamic' && accountFeature.dynamic?.environmentId) {
      return Object.freeze({
        title,
        isEnabled: true,
        connectorType: 'dynamic',
        dynamic: {
          environmentId: accountFeature.dynamic.environmentId,
        },
      });
    } else if (thirdwebClientId) {
      return Object.freeze({
        title,
        isEnabled: true,
        connectorType: 'thirdweb',
        thirdweb: {
          clientId: thirdwebClientId,
        },
      });
    }
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
