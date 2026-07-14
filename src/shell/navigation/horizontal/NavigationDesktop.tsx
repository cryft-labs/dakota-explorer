// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra, Flex, Separator } from '@chakra-ui/react';
import React from 'react';
import { LuBookOpen, LuChevronDown, LuExternalLink, LuGlobe, LuLayoutDashboard } from 'react-icons/lu';

import DakotaThemeToggle from 'src/shell/header/DakotaThemeToggle';

import NetworkLogo from 'src/slices/chain/logo/NetworkLogo';
import TestnetBadge from 'src/slices/chain/TestnetBadge';

import UserProfileDesktop from 'src/features/account/components/user-profile/UserProfileDesktop';
import useIsAuth from 'src/features/account/hooks/useIsAuth';
import CsvExportDownloads from 'src/features/csv-export/components/downloads/CsvExportDownloads';
import RewardsButton from 'src/features/rewards/components/RewardsButton';
import RollupStageBadge from 'src/features/rollup/common/components/RollupStageBadge';

import config from 'src/config';

import { Button } from 'src/toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';

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
const DAKOTA_NAVIGATOR_LINKS = [
  { label: 'Dashboard', url: 'https://dashboard.dakota.cards', icon: LuLayoutDashboard },
  { label: 'Documentation', url: 'https://docs.dakota.cards', icon: LuBookOpen },
  { label: 'Main Site', url: 'https://dakota.cards', icon: LuGlobe },
] as const;

const DakotaNavigatorMenu = () => {
  return (
    <PopoverRoot positioning={{ placement: 'bottom', offset: { mainAxis: 8 } }}>
      <PopoverTrigger>
        <Button
          aria-label="Open Dakota platform navigator"
          h={ DAKOTA_HEADER_ACTION_HEIGHT }
          px="14px"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          gap="6px"
          borderRadius="base"
          fontSize="14px"
          lineHeight="20px"
          fontWeight={ 700 }
          whiteSpace="nowrap"
          color="button.solid.text"
          bg="button.solid.bg"
          borderWidth="0"
          boxShadow="none"
          _hover={{
            color: 'white',
            bg: 'button.solid.bg.hover',
          }}
        >
          Navigator
          <LuChevronDown size={ 16 } strokeWidth={ 2.25 }/>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="220px"
        p={ 0 }
        borderRadius="12px"
        borderColor={{ _light: 'rgba(15, 118, 110, 0.16)', _dark: 'rgba(52, 211, 153, 0.18)' }}
        bg={{ _light: 'rgba(255, 255, 255, 0.96)', _dark: 'rgba(7, 26, 23, 0.98)' }}
        boxShadow={{ _light: '0 18px 48px rgba(15, 118, 110, 0.16)', _dark: '0 18px 54px rgba(0, 0, 0, 0.36)' }}
        backdropFilter="blur(12px)"
      >
        <PopoverBody p={ 2 }>
          <Flex flexDir="column" gap={ 1 }>
            { DAKOTA_NAVIGATOR_LINKS.map((item) => {
              const LinkIcon = item.icon;

              return (
                <chakra.a
                  key={ item.label }
                  href={ item.url }
                  target="_blank"
                  rel="noreferrer"
                  display="flex"
                  alignItems="center"
                  gap="10px"
                  h="40px"
                  px={ 3 }
                  borderRadius="base"
                  color="text.secondary"
                  fontSize="14px"
                  fontWeight={ 700 }
                  _hover={{
                    color: 'text.primary',
                    bg: { _light: 'rgba(15, 118, 110, 0.06)', _dark: 'rgba(52, 211, 153, 0.1)' },
                    textDecoration: 'none',
                  }}
                >
                  <LinkIcon size={ 18 } strokeWidth={ 2.1 }/>
                  <chakra.span flex="1">{ item.label }</chakra.span>
                  <LuExternalLink size={ 14 } strokeWidth={ 2 }/>
                </chakra.a>
              );
            }) }
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

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
            <DakotaNavigatorMenu/>
          </Flex>
          <Flex alignItems="center" gap="4px">
            <DakotaThemeToggle/>
            <CsvExportDownloads/>
          </Flex>
          <NavigationPromoBanner/>
          { config.features.rewards.isEnabled && <RewardsButton size="md"/> }
          <UserProfileDesktop buttonSize="md"/>
        </Flex>
      </Box>
    </Box>
  );
};

export default React.memo(NavigationDesktop);
