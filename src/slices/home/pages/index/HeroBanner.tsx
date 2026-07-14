// SPDX-License-Identifier: LicenseRef-Blockscout

// we use custom heading size for hero banner
// eslint-disable-next-line no-restricted-imports
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import React from 'react';

import SearchBar from 'src/slices/search/components/search-bar/SearchBarDesktop';
import SearchBarMobile from 'src/slices/search/components/search-bar/SearchBarMobile';

import UserProfileDesktop from 'src/features/account/components/user-profile/UserProfileDesktop';
import RewardsButton from 'src/features/rewards/components/RewardsButton';

import config from 'src/config';
import DakotaStarfield from 'src/shared/components/DakotaStarfield';

const DAKOTA_HERO_PILLS = [
  'Live blocks',
  'Transactions',
  'Token activity',
  'Smart contracts',
];

const dakotaHeroPanelReveal = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 18px, 0) scale(0.985);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

const DAKOTA_PANEL_REVEAL_ANIMATION = `${ dakotaHeroPanelReveal } 540ms ease-out both`;

export const BACKGROUND_DEFAULT = [
  'linear-gradient(135deg, rgba(15, 118, 110, 0.12) 0%, rgba(255, 255, 255, 0.98) 58%, rgba(45, 212, 191, 0.08) 100%)',
  'linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98))',
].join(', ');

const BACKGROUND_DARK_DEFAULT = [
  'linear-gradient(135deg, rgba(52, 211, 153, 0.12) 0%, rgba(9, 31, 28, 0.96) 58%, rgba(45, 212, 191, 0.08) 100%)',
  'linear-gradient(rgba(9, 31, 28, 0.96), rgba(9, 31, 28, 0.96))',
].join(', ');

const TEXT_COLOR_DEFAULT = { _light: '#1F2937', _dark: 'rgba(244, 248, 247, 0.96)' };
const BORDER_DEFAULT = { _light: '1px solid rgba(15, 118, 110, 0.18)', _dark: '1px solid rgba(52, 211, 153, 0.18)' };

const HERO_SUBTEXT = [
  'Search Dakota Network blocks, transactions, tokens, addresses, and smart contracts across the Dakota Cards ecosystem.',
  'Use the Navigator menu for switching between network sites while following live network activity.',
].join(' ');

const HeroBanner = () => {
  const background = {
    _light:
      config.slices.home.heroBanner?.background?.[0] ||
      BACKGROUND_DEFAULT,
    _dark:
      config.slices.home.heroBanner?.background?.[1] ||
      config.slices.home.heroBanner?.background?.[0] ||
      BACKGROUND_DARK_DEFAULT,
  };

  const textColor = {
    _light:
      // light mode
      config.slices.home.heroBanner?.text_color?.[0] ||
      TEXT_COLOR_DEFAULT._light,
    // dark mode
    _dark:
      config.slices.home.heroBanner?.text_color?.[1] ||
      config.slices.home.heroBanner?.text_color?.[0] ||
      TEXT_COLOR_DEFAULT._dark,
  };

  const border = {
    _light:
      config.slices.home.heroBanner?.border?.[0] || BORDER_DEFAULT._light,
    _dark:
      config.slices.home.heroBanner?.border?.[1] || config.slices.home.heroBanner?.border?.[0] || BORDER_DEFAULT._dark,
  };

  const text = (() => {
    if (config.slices.home.heroBanner?.text) {
      return config.slices.home.heroBanner.text;
    }

    return `${ config.chain.name } Explorer`;
  })();

  return (
    <Flex
      data-dakota-hero-panel="true"
      w="100%"
      background={ background }
      border={ border }
      borderRadius={{ base: '24px', lg: '32px' }}
      minH={{ base: '318px', md: '286px' }}
      px={{ base: 5, md: 8, lg: 10 }}
      py={{ base: 7, md: 8, lg: 10 }}
      columnGap={ 8 }
      alignItems="center"
      justifyContent="center"
      position="relative"
      isolation="isolate"
      overflow="hidden"
      boxShadow={{
        _light: '0 18px 58px rgba(15, 118, 110, 0.08)',
        _dark: '0 18px 58px rgba(0, 0, 0, 0.28), 0 0 34px rgba(52, 211, 153, 0.06)',
      }}
      backdropFilter="blur(18px) saturate(145%)"
      animation={ DAKOTA_PANEL_REVEAL_ANIMATION }
      _motionReduce={{
        animation: 'none',
      }}
    >
      <DakotaStarfield/>
      <Flex
        flexGrow={ 1 }
        position="relative"
        zIndex={ 3 }
        w="100%"
        maxW="1160px"
        mx="auto"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        gap={{ base: 2, md: 3 }}
      >
        <Text
          as="p"
          textTransform="uppercase"
          fontSize={{ base: '11px', md: '13px' }}
          lineHeight="1.2"
          fontWeight={ 900 }
          letterSpacing="0.16em"
          color={{ _light: '#0F766E', _dark: '#34D399' }}
        >
          Network explorer
        </Text>

        <Box>
          <Heading
            as="h1"
            fontSize={{ base: '28px', md: '38px' }}
            lineHeight={{ base: '32px', md: '42px' }}
            fontWeight={ 900 }
            letterSpacing="0"
            color={ textColor }
          >
            { text }
          </Heading>
          { config.shell.navigation.layout === 'vertical' && (
            <Box
              position={{ base: 'static', lg: 'absolute' }}
              top={{ lg: 6 }}
              right={{ lg: 6 }}
              display={{ base: 'none', lg: 'flex' }}
              gap={ 2 }
            >
              { config.features.rewards.isEnabled && <RewardsButton variant="hero"/> }
              <UserProfileDesktop buttonVariant="hero"/>
            </Box>
          ) }
        </Box>

        <Text
          as="p"
          maxW="980px"
          color="text.secondary"
          fontSize={{ base: '15px', md: '17px' }}
          lineHeight={{ base: '24px', md: '28px' }}
          fontWeight={ 400 }
        >
          { HERO_SUBTEXT }
        </Text>

        <Flex
          as="ul"
          listStyleType="none"
          p={ 0 }
          m={ 0 }
          pt={ 1 }
          flexWrap="wrap"
          gap={ 2 }
          justifyContent="center"
        >
          { DAKOTA_HERO_PILLS.map((label) => (
            <Text
              as="li"
              key={ label }
              h="24px"
              px={ 3 }
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              borderWidth="1px"
              borderColor={{ _light: 'rgba(15, 118, 110, 0.26)', _dark: 'rgba(52, 211, 153, 0.28)' }}
              bg={{ _light: 'rgba(15, 118, 110, 0.08)', _dark: 'rgba(52, 211, 153, 0.16)' }}
              color="text.primary"
              fontSize="12px"
              lineHeight="16px"
              fontWeight={ 800 }
              whiteSpace="nowrap"
            >
              { label }
            </Text>
          )) }
        </Flex>

        <Box display={{ base: 'flex', lg: 'none' }} w="100%" maxW="1040px" mt={{ base: 3, md: 4 }}>
          <SearchBarMobile isHeroBanner/>
        </Box>
        <Box display={{ base: 'none', lg: 'flex' }} w="100%" maxW="1040px" mt={ 4 }>
          <SearchBar isHeroBanner/>
        </Box>
      </Flex>
    </Flex>
  );
};

export default React.memo(HeroBanner);
