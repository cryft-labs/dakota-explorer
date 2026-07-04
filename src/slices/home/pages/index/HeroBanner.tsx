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

const DAKOTA_HERO_PILLS = [
  'Live blocks',
  'Transactions',
  'Token activity',
  'Smart contracts',
];

const DAKOTA_PANEL_AMBIENT = {
  _light: [
    'radial-gradient(ellipse at 50% 0%, rgba(15, 118, 110, 0.08) 0%, transparent 38%)',
    'radial-gradient(ellipse at 16% 36%, rgba(15, 118, 110, 0.06) 0%, transparent 34%)',
    'radial-gradient(ellipse at 86% 24%, rgba(45, 212, 191, 0.06) 0%, transparent 32%)',
  ].join(', '),
  _dark: [
    'radial-gradient(ellipse at 50% 0%, rgba(52, 211, 153, 0.13) 0%, transparent 38%)',
    'radial-gradient(ellipse at 16% 36%, rgba(52, 211, 153, 0.1) 0%, transparent 34%)',
    'radial-gradient(ellipse at 86% 24%, rgba(45, 212, 191, 0.1) 0%, transparent 32%)',
  ].join(', '),
};

const DAKOTA_PANEL_STARFIELD = {
  _light: [
    'radial-gradient(circle, rgba(255, 255, 255, 0.72) 0 1px, transparent 1.9px)',
    'radial-gradient(circle, rgba(52, 211, 153, 0.68) 0 1px, transparent 2px)',
    'radial-gradient(circle, rgba(255, 255, 255, 0.52) 0 0.85px, transparent 1.7px)',
  ].join(', '),
  _dark: [
    'radial-gradient(circle, rgba(255, 255, 255, 0.72) 0 1px, transparent 1.9px)',
    'radial-gradient(circle, rgba(52, 211, 153, 0.68) 0 1px, transparent 2px)',
    'radial-gradient(circle, rgba(255, 255, 255, 0.52) 0 0.85px, transparent 1.7px)',
  ].join(', '),
};

const DAKOTA_PANEL_GLEAM_FIELD = {
  _light: [
    'radial-gradient(circle, rgba(255, 255, 255, 0.92) 0 1.35px, transparent 2.6px)',
    'radial-gradient(circle, rgba(15, 118, 110, 0.74) 0 1.2px, transparent 2.5px)',
  ].join(', '),
  _dark: [
    'radial-gradient(circle, rgba(255, 255, 255, 0.92) 0 1.35px, transparent 2.6px)',
    'radial-gradient(circle, rgba(52, 211, 153, 0.74) 0 1.2px, transparent 2.5px)',
  ].join(', '),
};

const DAKOTA_PANEL_GLIMMER = {
  _light: [
    'radial-gradient(circle at 14% 20%, rgba(255, 255, 255, 0.95) 0 1px, transparent 2px)',
    'radial-gradient(circle at 34% 12%, rgba(52, 211, 153, 0.9) 0 1px, transparent 2px)',
    'radial-gradient(circle at 68% 24%, rgba(255, 255, 255, 0.85) 0 1px, transparent 2px)',
    'radial-gradient(circle at 86% 16%, rgba(15, 118, 110, 0.8) 0 1px, transparent 2px)',
    'radial-gradient(circle at 76% 48%, rgba(255, 255, 255, 0.7) 0 1px, transparent 2px)',
    'radial-gradient(circle at 18% 74%, rgba(52, 211, 153, 0.72) 0 1px, transparent 2px)',
    'radial-gradient(circle at 58% 82%, rgba(255, 255, 255, 0.78) 0 1px, transparent 2px)',
    'radial-gradient(circle at 88% 70%, rgba(15, 118, 110, 0.64) 0 1px, transparent 2px)',
  ].join(','),
  _dark: [
    'radial-gradient(circle at 14% 20%, rgba(255, 255, 255, 0.9) 0 1px, transparent 2px)',
    'radial-gradient(circle at 34% 12%, rgba(52, 211, 153, 0.88) 0 1px, transparent 2px)',
    'radial-gradient(circle at 68% 24%, rgba(255, 255, 255, 0.78) 0 1px, transparent 2px)',
    'radial-gradient(circle at 86% 16%, rgba(52, 211, 153, 0.74) 0 1px, transparent 2px)',
    'radial-gradient(circle at 76% 48%, rgba(255, 255, 255, 0.66) 0 1px, transparent 2px)',
    'radial-gradient(circle at 18% 74%, rgba(52, 211, 153, 0.68) 0 1px, transparent 2px)',
    'radial-gradient(circle at 58% 82%, rgba(255, 255, 255, 0.72) 0 1px, transparent 2px)',
    'radial-gradient(circle at 88% 70%, rgba(52, 211, 153, 0.62) 0 1px, transparent 2px)',
  ].join(','),
};

const DAKOTA_PANEL_GLIMMER_SIZE = [
  '260px 140px',
  '320px 180px',
  '280px 150px',
  '360px 190px',
  '300px 160px',
  '300px 180px',
  '340px 200px',
  '320px 190px',
].join(', ');

const DAKOTA_GLIMMER_START_POSITION = [
  '0 0',
  '12px 8px',
  '28px 14px',
  '44px 22px',
  '62px 30px',
  '82px 36px',
  '100px 44px',
  '122px 52px',
].join(', ');

const DAKOTA_GLIMMER_END_POSITION = [
  '-34px 18px',
  '-18px 26px',
  '4px 34px',
  '22px 42px',
  '46px 48px',
  '64px 56px',
  '86px 64px',
  '104px 72px',
].join(', ');

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

const dakotaHeroStarParallax = keyframes`
  0% {
    transform: translate3d(-10px, 6px, 0) scale(1.01);
  }

  100% {
    transform: translate3d(12px, -8px, 0) scale(1.016);
  }
`;

const dakotaHeroStarFieldDrift = keyframes`
  0% {
    background-position: 13px 10px, 62px 36px, 121px 82px;
  }

  100% {
    background-position: 31px 0, 43px 52px, 143px 70px;
  }
`;

const dakotaHeroGleamParallax = keyframes`
  0% {
    transform: translate3d(10px, -6px, 0);
  }

  100% {
    transform: translate3d(-14px, 8px, 0);
  }
`;

const dakotaHeroGleamDrift = keyframes`
  0% {
    background-position: 33px 34px, 174px 90px;
  }

  100% {
    background-position: 8px 48px, 205px 72px;
  }
`;

const dakotaStationaryStarGleam = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 0 transparent);
    opacity: 0.32;
  }

  44% {
    filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.38));
    opacity: 0.78;
  }

  72% {
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.24));
    opacity: 0.48;
  }
`;

const dakotaGlimmerDrift = keyframes`
  0% {
    background-position: ${ DAKOTA_GLIMMER_START_POSITION };
    opacity: 0.36;
    transform: translate3d(-12%, 8%, 0);
  }

  50% {
    opacity: 0.92;
  }

  100% {
    background-position: ${ DAKOTA_GLIMMER_END_POSITION };
    opacity: 0.42;
    transform: translate3d(14%, -10%, 0);
  }
`;

const DAKOTA_PANEL_REVEAL_ANIMATION = `${ dakotaHeroPanelReveal } 540ms ease-out both`;
const DAKOTA_PANEL_AMBIENT_ANIMATION = `${ dakotaHeroStarParallax } 18s ease-in-out infinite alternate`;
const DAKOTA_PANEL_STARFIELD_ANIMATION = `${ dakotaHeroStarFieldDrift } 22s ease-in-out infinite alternate`;
const DAKOTA_PANEL_GLIMMER_ANIMATION = `${ dakotaGlimmerDrift } 6s ease-in-out infinite alternate`;
const DAKOTA_PANEL_GLEAM_ANIMATION = [
  `${ dakotaStationaryStarGleam } 5.2s ease-in-out infinite`,
  `${ dakotaHeroGleamParallax } 14s ease-in-out infinite alternate`,
  `${ dakotaHeroGleamDrift } 16s ease-in-out infinite alternate`,
].join(', ');

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
  'Live chain activity stays connected to the same platform surfaces your teams already use.',
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
      <Box
        aria-hidden="true"
        data-dakota-animation-layer="ambient"
        position="absolute"
        inset="-18px"
        zIndex={ 1 }
        pointerEvents="none"
        overflow="hidden"
        background={ DAKOTA_PANEL_AMBIENT }
        animation={ DAKOTA_PANEL_AMBIENT_ANIMATION }
        willChange="transform"
        _motionReduce={{
          animation: 'none',
        }}
        _before={{
          content: '""',
          position: 'absolute',
          inset: '-1px',
          opacity: { _light: 0.34, _dark: 0.44 },
          backgroundImage: DAKOTA_PANEL_STARFIELD,
          backgroundSize: {
            base: '86px 86px, 132px 132px, 218px 218px',
            md: '112px 112px, 176px 176px, 286px 286px',
          },
          backgroundPosition: '13px 10px, 62px 36px, 121px 82px',
          backgroundRepeat: 'repeat',
          animation: DAKOTA_PANEL_STARFIELD_ANIMATION,
          willChange: 'background-position',
          _motionReduce: {
            animation: 'none',
          },
        }}
        _after={{
          content: '""',
          position: 'absolute',
          inset: '-1px',
          opacity: 0.4,
          backgroundImage: DAKOTA_PANEL_GLEAM_FIELD,
          backgroundSize: {
            base: '190px 190px, 260px 260px',
            md: '250px 250px, 340px 340px',
          },
          backgroundPosition: '33px 34px, 174px 90px',
          backgroundRepeat: 'repeat',
          animation: DAKOTA_PANEL_GLEAM_ANIMATION,
          willChange: 'background-position, transform, opacity, filter',
          _motionReduce: {
            animation: 'none',
          },
        }}
      />
      <Box
        aria-hidden="true"
        data-dakota-animation-layer="glimmer"
        position="absolute"
        inset="-10px"
        zIndex={ 2 }
        pointerEvents="none"
        backgroundImage={ DAKOTA_PANEL_GLIMMER }
        backgroundSize={ DAKOTA_PANEL_GLIMMER_SIZE }
        backgroundPosition={ DAKOTA_GLIMMER_START_POSITION }
        animation={ DAKOTA_PANEL_GLIMMER_ANIMATION }
        filter={{ _light: 'drop-shadow(0 0 6px rgba(15, 118, 110, 0.14))', _dark: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.26))' }}
        mixBlendMode={{ _light: 'normal', _dark: 'screen' }}
        willChange="transform, opacity"
        _motionReduce={{
          animation: 'none',
        }}
      />
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
