// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import NetworkIcon from 'src/slices/chain/logo/NetworkIcon';
import TestnetBadge from 'src/slices/chain/TestnetBadge';
import SearchBarMobile from 'src/slices/search/components/search-bar/SearchBarMobile';

import UserProfileAuth0 from 'src/features/account/components/user-profile/auth0/UserProfileMobile';
import UserWalletMobile from 'src/features/account/components/user-profile/wallet/UserWalletMobile';
import RewardsButton from 'src/features/rewards/components/RewardsButton';
import RollupStageBadge from 'src/features/rollup/common/components/RollupStageBadge';

import config from 'src/config';

import { useIsSticky } from 'src/toolkit/hooks/useIsSticky';

import Burger from './Burger';

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
      bg={{ _light: 'rgba(255, 255, 255, 0.84)', _dark: 'rgba(16, 38, 33, 0.84)' }}
      display={{ base: 'block', lg: 'none' }}
      position="sticky"
      top="-1px"
      left={ 0 }
      zIndex="sticky2"
      pt="1px"
      height="74px"
      minH="74px"
      borderBottomWidth="1px"
      borderColor="border.divider"
      backdropFilter="blur(12px)"
    >
      <Flex
        as="header"
        paddingX="24px"
        paddingY={ 0 }
        bg="transparent"
        width="100%"
        height="74px"
        minH="74px"
        alignItems="center"
        transitionProperty="box-shadow"
        transitionDuration="slow"
        boxShadow={ isSticky ? 'md' : 'none' }
      >
        <Burger/>
        <Flex alignItems="center" flexGrow={ 1 } mx="10px">
          <NetworkIcon/>
          <TestnetBadge ml="10px"/>
          <RollupStageBadge ml="10px"/>
        </Flex>
        <Flex columnGap="10px">
          { !hideSearchButton && <SearchBarMobile onGoToSearchResults={ onGoToSearchResults }/> }
          { config.features.rewards.isEnabled && <RewardsButton/> }
          { userProfile }
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(HeaderMobile);
