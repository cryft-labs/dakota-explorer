// SPDX-License-Identifier: LicenseRef-Blockscout

// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useWeb3Account from 'src/features/connect-wallet/hooks/useAccount';
import useWeb3Wallet from 'src/features/connect-wallet/hooks/useWallet';
import { useMarketplaceContext } from 'src/features/marketplace/context';

import { DrawerTrigger, DrawerRoot, DrawerContent, DrawerBody } from 'src/toolkit/chakra/drawer';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import UserWalletButton from './UserWalletButton';
import UserWalletMenuContent from './UserWalletMenuContent';

const UserWalletMobile = () => {
  const walletMenu = useDisclosure();

  const web3Wallet = useWeb3Wallet({ source: 'Header' });
  const web3Account = useWeb3Account();
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const isPending =
    (web3Wallet.isConnected && web3Account.isConnecting) ||
    (!web3Wallet.isConnected && web3Wallet.isOpen);

  const handleDisconnectClick = React.useCallback(() => {
    web3Wallet.disconnect();
    walletMenu.onClose();
  }, [ web3Wallet, walletMenu ]);

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!web3Wallet.isConnected) {
      web3Wallet.openModal();
      return;
    }

    if (open) {
      walletMenu.onOpen();
    } else {
      walletMenu.onClose();
    }
  }, [ walletMenu, web3Wallet ]);

  return (
    <DrawerRoot
      open={ walletMenu.open }
      onOpenChange={ handleOpenChange }
    >
      <DrawerTrigger>
        <UserWalletButton
          variant="header"
          address={ web3Account.address }
          isPending={ isPending }
        />
      </DrawerTrigger>
      <DrawerContent maxWidth="300px">
        <DrawerBody p={ 6 }>
          { web3Account.address && walletMenu.open && (
            <UserWalletMenuContent
              address={ web3Account.address }
              isAutoConnectDisabled={ isAutoConnectDisabled }
              isReconnecting={ web3Wallet.isReconnecting }
              onDisconnect={ handleDisconnectClick }
            />
          ) }
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default React.memo(UserWalletMobile);
