// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra, Flex, Separator } from '@chakra-ui/react';
import React from 'react';

import NetworkLogo from 'src/slices/chain/logo/NetworkLogo';
import TestnetBadge from 'src/slices/chain/TestnetBadge';

import UserProfileDesktop from 'src/features/account/components/user-profile/UserProfileDesktop';
import useIsAuth from 'src/features/account/hooks/useIsAuth';
import CsvExportDownloads from 'src/features/csv-export/components/downloads/CsvExportDownloads';
import RewardsButton from 'src/features/rewards/components/RewardsButton';
import RollupStageBadge from 'src/features/rollup/common/components/RollupStageBadge';

import config from 'src/config';

import Settings from '../../top-bar/settings/Settings';
import NavigationPromoBanner from '../promo-banner/NavigationPromoBanner';
import useNavItems, { isGroupItem } from '../useNavItems';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const accountFeature = config.features.account;
const DAKOTA_HEADER_HEIGHT = '74px';
const DAKOTA_HEADER_ACTION_HEIGHT = '38px';
const DAKOTA_HEADER_ICON_SIZE = '40px';
const DAKOTA_HEADER_MAX_WIDTH = '1200px';
const DAKOTA_HEADER_GAP = '10px';
const DAKOTA_HEADER_SECTION_GAP = '16px';
const DAKOTA_PLATFORM_LINKS = [
  { label: 'Main site', url: 'https://dakota.cards', variant: 'ghost' },
  { label: 'Docs', url: 'https://docs.dakota.cards', variant: 'ghost' },
  { label: 'Dashboard', url: 'https://dashboard.dakota.cards', variant: 'solid' },
] as const;

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();
  const isAuth = useIsAuth();

  const accountNavGroup = React.useMemo(() => {
    if (accountFeature.isEnabled && accountFeature.authProvider === 'dynamic' && isAuth) {
      return {
        text: 'Account',
        subItems: accountNavItems,
      };
    }
  }, [ accountNavItems, isAuth ]);

  return (
    <Box
      position="sticky"
      top={ 0 }
      zIndex="sticky"
      bg={{ _light: 'rgba(255, 255, 255, 0.86)', _dark: 'rgba(7, 26, 23, 0.92)' }}
      borderBottomWidth="1px"
      borderColor={{ _light: 'rgba(15, 118, 110, 0.16)', _dark: 'rgba(52, 211, 153, 0.16)' }}
      borderRadius={{ base: 0, lg: '0 0 40px 40px' }}
      backdropFilter="blur(12px)"
      boxShadow={{ _light: '0 16px 42px rgba(15, 118, 110, 0.1)', _dark: '0 18px 54px rgba(0, 0, 0, 0.34)' }}
      overflow="hidden"
    >
      <Box
        display={{ base: 'none', lg: 'grid' }}
        gridTemplateColumns="minmax(190px, 1fr) auto minmax(190px, 1fr)"
        alignItems="center"
        columnGap={ DAKOTA_HEADER_SECTION_GAP }
        minH={ DAKOTA_HEADER_HEIGHT }
        px="24px"
        py={ 0 }
        maxW={ DAKOTA_HEADER_MAX_WIDTH }
        m="0 auto"
      >
        <Flex alignItems="center" justifyContent="flex-start" gap={ DAKOTA_HEADER_GAP } minW={ 0 }>
          <NetworkLogo/>
          <TestnetBadge/>
          <RollupStageBadge/>
        </Flex>

        <chakra.nav minW={ 0 } display="flex" justifyContent="center">
          <Flex as="ul" columnGap={ DAKOTA_HEADER_GAP } alignItems="center" flexWrap="nowrap">
            { mainNavItems.map((item) => {
              if (isGroupItem(item)) {
                return <NavLinkGroup key={ item.text } item={ item } height={ DAKOTA_HEADER_ACTION_HEIGHT }/>;
              } else {
                return <NavLink key={ item.text } item={ item } noIcon height={ DAKOTA_HEADER_ACTION_HEIGHT }/>;
              }
            }) }
            { accountNavGroup && (
              <>
                <Separator orientation="vertical" mx="4px" h={ 4 }/>
                <NavLinkGroup key={ accountNavGroup.text } item={ accountNavGroup } height={ DAKOTA_HEADER_ACTION_HEIGHT }/>
              </>
            ) }
          </Flex>
        </chakra.nav>

        <Flex
          gap={ DAKOTA_HEADER_GAP }
          alignItems="center"
          justifyContent="flex-end"
          minH={ DAKOTA_HEADER_ICON_SIZE }
          minW={ 0 }
        >
          <Flex alignItems="center" gap="6px">
            { DAKOTA_PLATFORM_LINKS.map((link) => (
              <chakra.a
                key={ link.label }
                href={ link.url }
                target="_blank"
                rel="noreferrer"
                display={ link.variant === 'solid' ? 'inline-flex' : { base: 'none', '2xl': 'inline-flex' } }
                h={ DAKOTA_HEADER_ACTION_HEIGHT }
                px={ link.variant === 'solid' ? '14px' : '10px' }
                alignItems="center"
                justifyContent="center"
                borderRadius="10px"
                fontSize="14px"
                lineHeight="20px"
                fontWeight={ link.variant === 'solid' ? 800 : 700 }
                whiteSpace="nowrap"
                color={ link.variant === 'solid' ? 'white' : 'text.secondary' }
                bg={ link.variant === 'solid' ? '#34D399' : 'transparent' }
                borderWidth={ link.variant === 'solid' ? '0' : '1px' }
                borderColor={{ _light: 'rgba(15, 118, 110, 0.18)', _dark: 'rgba(148, 163, 184, 0.12)' }}
                boxShadow={ link.variant === 'solid' ? '0 10px 26px rgba(52, 211, 153, 0.24)' : undefined }
                _hover={{
                  textDecoration: 'none',
                  color: link.variant === 'solid' ? 'white' : 'text.primary',
                  bg: link.variant === 'solid' ? '#2DD4BF' : { _light: 'rgba(15, 118, 110, 0.08)', _dark: 'rgba(52, 211, 153, 0.1)' },
                }}
              >
                { link.label }
              </chakra.a>
            )) }
          </Flex>
          <Flex alignItems="center" gap="4px">
            <CsvExportDownloads/>
            <Settings/>
          </Flex>
          <NavigationPromoBanner/>
          { config.features.rewards.isEnabled && <RewardsButton size="sm"/> }
          <UserProfileDesktop buttonSize="sm"/>
        </Flex>
      </Box>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
