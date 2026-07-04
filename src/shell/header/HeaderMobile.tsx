// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import NetworkLogo from 'src/slices/chain/logo/NetworkLogo';
import SearchBarMobile from 'src/slices/search/components/search-bar/SearchBarMobile';

import UserProfileAuth0 from 'src/features/account/components/user-profile/auth0/UserProfileMobile';
import UserWalletMobile from 'src/features/account/components/user-profile/wallet/UserWalletMobile';
import RewardsButton from 'src/features/rewards/components/RewardsButton';

import config from 'src/config';

import { useIsSticky } from 'src/toolkit/hooks/useIsSticky';

import Burger from './Burger';
import DakotaThemeToggle from './DakotaThemeToggle';

const UserProfileDynamic = dynamic(() => import('src/features/account/components/user-profile/dynamic/UserProfile'), { ssr: false });

type Props = {
  hideSearchButton?: boolean;
  onGoToSearchResults?: (searchTerm: string) => void;
};

const HeaderMobile = ({ hideSearchButton, onGoToSearchResults }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isSticky = useIsSticky(ref, 5);

  const userProfile = (() => {
    const accountFeature = config.features.account;
    if (accountFeature.isEnabled) {
      switch (accountFeature.authProvider) {
        case 'auth0':
          return <UserProfileAuth0/>;
        case 'dynamic':
          return <UserProfileDynamic/>;
        default:
          return null;
      }
    }
    if (config.features.connectWallet.isEnabled) {
      return <UserWalletMobile/>;
    }
  })();

  return (
    <Box
      ref={ ref }
      bg={{ _light: 'rgba(255, 255, 255, 0.88)', _dark: 'rgba(7, 26, 23, 0.94)' }}
      display={{ base: 'block', lg: 'none' }}
      position="sticky"
      top={ 0 }
      left={ 0 }
      zIndex="sticky2"
      height="74px"
      minH="74px"
      borderBottomWidth="1px"
      borderColor={{ _light: 'rgba(15, 118, 110, 0.16)', _dark: 'rgba(52, 211, 153, 0.16)' }}
      borderRadius="0 0 40px 40px"
      backdropFilter="blur(12px)"
      boxShadow={{ _light: '0 14px 38px rgba(15, 118, 110, 0.1)', _dark: '0 18px 48px rgba(0, 0, 0, 0.34)' }}
      overflow="hidden"
    >
      <Flex
        as="header"
        paddingX={{ base: '20px', sm: '24px' }}
        paddingY={ 0 }
        bg="transparent"
        width="100%"
        height="74px"
        minH="74px"
        alignItems="center"
        gap="10px"
        transitionProperty="box-shadow"
        transitionDuration="slow"
        boxShadow={ isSticky ? 'md' : 'none' }
      >
        <Flex alignItems="center" flex="1 1 auto" minW={ 0 }>
          <Box maxW={{ base: '190px', sm: '220px' }} overflow="hidden">
            <NetworkLogo/>
          </Box>
        </Flex>
        <Flex columnGap="8px" alignItems="center" flexShrink={ 0 }>
          { !hideSearchButton && <SearchBarMobile onGoToSearchResults={ onGoToSearchResults }/> }
          { config.features.rewards.isEnabled && <RewardsButton/> }
          { userProfile }
          <DakotaThemeToggle/>
          <Burger/>
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(HeaderMobile);
