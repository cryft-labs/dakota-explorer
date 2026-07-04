// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box, HStack } from '@chakra-ui/react';
import React from 'react';

import { useAppContext } from 'src/shell/app/context';
import { CONTENT_MAX_WIDTH } from 'src/shell/layout/utils';

import CsvExportDownloads from 'src/features/csv-export/components/downloads/CsvExportDownloads';
import DeFiDropdown from 'src/features/defi-dropdown/components/DeFiDropdown';
import NetworkAddToWallet from 'src/features/web3-wallet/components/NetworkAddToWallet';
import useProvider from 'src/features/web3-wallet/hooks/useProvider';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import * as cookies from 'src/shared/storage/cookies';

import NetworkMenu from './chain-menu/ChainMenu';
import TopBarStats from './TopBarStats';

const TopBarContent = () => {
  const hideAddToWalletButtonCookie = cookies.get(cookies.NAMES.HIDE_ADD_TO_WALLET_BUTTON, useAppContext().cookies);
  const [ isAddChainButtonVisible, setIsAddChainButtonVisible ] = React.useState(hideAddToWalletButtonCookie !== 'topbar');

  const web3 = useProvider();
  const isMobile = useIsMobile();

  const hasAddChainButton = Boolean(
    isAddChainButtonVisible &&
    web3.data?.provider &&
    web3.data?.wallet &&
    config.chain.rpcUrls.length &&
    config.features.web3Wallet.isEnabled &&
    !config.features.multichain.isEnabled &&
    !isMobile,
  );
  const hasDeFiDropdown = Boolean(config.features.deFiDropdown.isEnabled);

  const handleAddSuccess = React.useCallback(() => {
    cookies.set(cookies.NAMES.HIDE_ADD_TO_WALLET_BUTTON, 'topbar', { expires: 3 * 365 });
    setIsAddChainButtonVisible(false);
  }, [ ]);

  return (
    // not ideal if scrollbar is visible, but better than having a horizontal scroll
    <Box
      bgColor={{ _light: 'theme.topbar.bg._light', _dark: 'theme.topbar.bg._dark' }}
      position="sticky"
      top={ 0 }
      left={ 0 }
      width="100%"
      maxWidth="100vw"
      zIndex="sticky"
      borderBottomWidth="1px"
      borderColor="border.divider"
      backdropFilter="blur(12px)"
      boxShadow="0 6px 20px rgba(15, 118, 110, 0.06)"
    >
      <Flex
        minH="36px"
        py={ 0 }
        px={{ base: '24px', lg: '40px' }}
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        fontFamily="body"
      >
        <HStack gap={ 0 } fontSize="12px" lineHeight="16px">
          { Boolean(config.shell.topBar.chainMenu.items || config.features.multichain.isEnabled) && <NetworkMenu/> }
          { !config.features.multichain.isEnabled ? <TopBarStats/> : <div/> }
        </HStack>
        <HStack
          alignItems="center"
          gap="10px"
        >
          { (hasAddChainButton || hasDeFiDropdown) && (
            <HStack>
              { hasAddChainButton && <NetworkAddToWallet source="Top bar" onAddSuccess={ handleAddSuccess }/> }
              { hasDeFiDropdown && <DeFiDropdown/> }
            </HStack>
          ) }
          <HStack gap="4px">
            <CsvExportDownloads/>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
};

const TopBar = () => {
  if (config.shell.navigation.layout === 'horizontal') {
    return null;
  }

  return <TopBarContent/>;
};

export default React.memo(TopBar);
