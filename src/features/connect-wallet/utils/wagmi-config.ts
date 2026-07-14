// SPDX-License-Identifier: LicenseRef-Blockscout

import { inAppWalletConnector } from '@thirdweb-dev/wagmi-adapter';
import type { Chain, Transport } from 'viem';
import { fallback, http } from 'viem';
import { createConfig } from 'wagmi';

import { chains, parentChain } from 'src/features/connect-wallet/utils/chains';
import { thirdwebClient } from 'src/features/connect-wallet/utils/thirdweb-client';
import essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps';
import multichainConfig from 'src/features/multichain/chains-config';

import appConfig from 'src/config';

const feature = appConfig.features.connectWallet;

const getChainTransportFromConfig = (config: Partial<typeof appConfig> | undefined, readOnly?: boolean): Record<string, Transport> => {
  if (!config?.chain?.id) {
    return {};
  }

  return {
    [config.chain.id]: fallback(
      config.chain.rpcUrls
        .concat(readOnly && config.apis?.core ? `${ config.apis.core.endpoint }${ config.apis.core.basePath ?? '' }/api/eth-rpc` : '')
        .filter(Boolean)
        .map((url) => http(url, { batch: { wait: 100, batchSize: 5 } })),
    ),
  };
};

const reduceExternalChainsToTransportConfig = (readOnly: boolean): Record<string, Transport> => {
  const multichain = multichainConfig();
  const essentialDapps = essentialDappsChainsConfig();
  const chains = [ ...(multichain?.chains ?? []), ...(essentialDapps?.chains ?? []) ].filter(Boolean);

  if (!chains) {
    return {};
  }

  return chains
    .map(({ app_config: config }) => getChainTransportFromConfig(config, readOnly))
    .reduce((result, item) => {
      Object.entries(item).map(([ id, transport ]) => {
        result[id] = transport;
      });
      return result;
    }, {} as Record<string, Transport>);
};

const wagmi = (() => {
  const isThirdweb = feature.isEnabled && feature.connectorType === 'thirdweb';
  const isDynamic = feature.isEnabled && feature.connectorType === 'dynamic';
  const thirdwebWagmiConnector = isThirdweb && thirdwebClient ? inAppWalletConnector({
    client: thirdwebClient,
    metadata: {
      name: 'Dakota Wallet',
      icon: appConfig.chain.icon.default,
    },
  }) : undefined;

  const wagmiConfig = createConfig({
    chains: chains as [Chain, ...Array<Chain>],
    connectors: thirdwebWagmiConnector ? [ thirdwebWagmiConnector ] : undefined,
    transports: {
      ...getChainTransportFromConfig(appConfig, !isThirdweb),
      ...(parentChain ? { [parentChain.id]: http(isThirdweb ? undefined : parentChain.rpcUrls.default.http[0]) } : {}),
      ...reduceExternalChainsToTransportConfig(!isThirdweb),
    },
    ssr: true,
    batch: { multicall: { wait: 100, batchSize: 1024 } },
    multiInjectedProviderDiscovery: !isThirdweb && !isDynamic,
  });

  return { config: wagmiConfig };
})();

export default wagmi;
