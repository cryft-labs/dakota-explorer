// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ConnectionOptions } from '@thirdweb-dev/wagmi-adapter';
import React from 'react';
import {
  AutoConnect,
  ThirdwebProvider as ThirdwebProviderCore,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletConnectionStatus,
} from 'thirdweb/react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';

import {
  getThirdwebAppMetadata,
  thirdwebChain,
  thirdwebClient,
  thirdwebWallets,
} from 'src/features/connect-wallet/utils/thirdweb-config';
import {
  runThirdwebWagmiSync,
  THIRDWEB_WAGMI_CONNECTOR_ID,
} from 'src/features/connect-wallet/utils/thirdweb-connector';

import { toaster } from 'src/toolkit/chakra/toaster';

import { ThirdwebWalletModalProvider } from '../ThirdwebWalletModal';
import WagmiProvider from './WagmiProvider';

const ThirdwebWagmiBridge = () => {
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const connectionStatus = useActiveWalletConnectionStatus();

  const wagmiAccount = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync } = useSwitchChain();

  React.useEffect(() => {
    if (!activeWallet || !activeAccount || connectionStatus !== 'connected') {
      if (wagmiAccount.connector?.id === THIRDWEB_WAGMI_CONNECTOR_ID) {
        disconnect({ connector: wagmiAccount.connector });
      }
      return;
    }

    const connector = connectors.find((connector) => connector.id === THIRDWEB_WAGMI_CONNECTOR_ID);
    const chain = activeWallet.getChain();

    if (!connector || !chain) {
      return;
    }

    const isSameAccount = wagmiAccount.address?.toLowerCase() === activeAccount.address.toLowerCase();
    const isThirdwebConnector = wagmiAccount.connector?.id === THIRDWEB_WAGMI_CONNECTOR_ID;

    void runThirdwebWagmiSync(async() => {
      if (isSameAccount && isThirdwebConnector) {
        if (wagmiAccount.chainId !== chain.id) {
          await switchChainAsync({ chainId: chain.id });
        }
        return;
      }

      const connectionOptions = { wallet: activeWallet } satisfies ConnectionOptions;
      await connectAsync({ connector, chainId: chain.id, ...connectionOptions });
    }).catch(() => {
      toaster.error({
        title: 'Wallet connection failed',
        description: 'The Dakota wallet session could not be prepared for explorer transactions. Please reconnect and try again.',
      });
    });
  }, [
    activeAccount,
    activeWallet,
    connectionStatus,
    connectAsync,
    connectors,
    disconnect,
    switchChainAsync,
    wagmiAccount.address,
    wagmiAccount.chainId,
    wagmiAccount.connector,
  ]);

  return null;
};

interface Props {
  children: React.ReactNode;
}

const ThirdwebProvider = ({ children }: Props) => {
  const appMetadata = React.useMemo(() => getThirdwebAppMetadata(), []);

  return (
    <ThirdwebProviderCore>
      <WagmiProvider>
        <ThirdwebWalletModalProvider>
          <AutoConnect
            appMetadata={ appMetadata }
            chain={ thirdwebChain }
            client={ thirdwebClient }
            wallets={ thirdwebWallets }
            timeout={ 20_000 }
          />
          <ThirdwebWagmiBridge/>
          { children }
        </ThirdwebWalletModalProvider>
      </WagmiProvider>
    </ThirdwebProviderCore>
  );
};

export default React.memo(ThirdwebProvider);
