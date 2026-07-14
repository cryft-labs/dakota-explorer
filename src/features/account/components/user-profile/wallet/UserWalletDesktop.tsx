// SPDX-License-Identifier: LicenseRef-Blockscout

// SPDX-License-Identifier: LicenseRef-Blockscout

import { type ButtonProps } from '@chakra-ui/react';
import React from 'react';

import useWeb3Account from 'src/features/connect-wallet/hooks/useAccount';
import useWeb3Wallet from 'src/features/connect-wallet/hooks/useWallet';
import { useMarketplaceContext } from 'src/features/marketplace/context';

import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import UserWalletButton from './UserWalletButton';
import UserWalletMenuContent from './UserWalletMenuContent';

interface Props {
  buttonSize?: ButtonProps['size'];
  buttonVariant?: ButtonProps['variant'];
}

const UserWalletDesktop = ({ buttonSize, buttonVariant = 'header' }: Props) => {
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
    <PopoverRoot positioning={{ placement: 'bottom-end' }} lazyMount open={ walletMenu.open } onOpenChange={ handleOpenChange }>
      <PopoverTrigger>
        <UserWalletButton
          size={ buttonSize }
          variant={ buttonVariant }
          address={ web3Account.address }
          isPending={ isPending }
          isAutoConnectDisabled={ isAutoConnectDisabled }
        />
      </PopoverTrigger>
      { web3Account.address && walletMenu.open && (
        <PopoverContent w="260px">
          <PopoverBody>
            <UserWalletMenuContent
              address={ web3Account.address }
              isAutoConnectDisabled={ isAutoConnectDisabled }
              isReconnecting={ web3Wallet.isReconnecting }
              onDisconnect={ handleDisconnectClick }
            />
          </PopoverBody>
        </PopoverContent>
      ) }
    </PopoverRoot>
  );
};

export default React.memo(UserWalletDesktop);
