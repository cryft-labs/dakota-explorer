// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import React from 'react';

const AMBIENT_BACKGROUND = {
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

const STARFIELD_BACKGROUND = {
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

const GLEAM_BACKGROUND = {
  _light: [
    'radial-gradient(circle, rgba(255, 255, 255, 0.92) 0 1.35px, transparent 2.6px)',
    'radial-gradient(circle, rgba(15, 118, 110, 0.74) 0 1.2px, transparent 2.5px)',
  ].join(', '),
  _dark: [
    'radial-gradient(circle, rgba(255, 255, 255, 0.92) 0 1.35px, transparent 2.6px)',
    'radial-gradient(circle, rgba(52, 211, 153, 0.74) 0 1.2px, transparent 2.5px)',
  ].join(', '),
};

const GLIMMER_BACKGROUND = {
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

const GLIMMER_SIZE = [
  '260px 140px',
  '320px 180px',
  '280px 150px',
  '360px 190px',
  '300px 160px',
  '300px 180px',
  '340px 200px',
  '320px 190px',
].join(', ');

const GLIMMER_START_POSITION = [
  '0 0',
  '12px 8px',
  '28px 14px',
  '44px 22px',
  '62px 30px',
  '82px 36px',
  '100px 44px',
  '122px 52px',
].join(', ');

const GLIMMER_END_POSITION = [
  '-34px 18px',
  '-18px 26px',
  '4px 34px',
  '22px 42px',
  '46px 48px',
  '64px 56px',
  '86px 64px',
  '104px 72px',
].join(', ');

const ambientParallax = keyframes`
  0% {
    transform: translate3d(-10px, 6px, 0) scale(1.01);
  }

  100% {
    transform: translate3d(12px, -8px, 0) scale(1.016);
  }
`;

const starfieldDrift = keyframes`
  0% {
    background-position: 13px 10px, 62px 36px, 121px 82px;
  }

  100% {
    background-position: 31px 0, 43px 52px, 143px 70px;
  }
`;

const gleamParallax = keyframes`
  0% {
    transform: translate3d(10px, -6px, 0);
  }

  100% {
    transform: translate3d(-14px, 8px, 0);
  }
`;

const gleamDrift = keyframes`
  0% {
    background-position: 33px 34px, 174px 90px;
  }

  100% {
    background-position: 8px 48px, 205px 72px;
  }
`;

const stationaryStarGleam = keyframes`
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

const glimmerDrift = keyframes`
  0% {
    background-position: ${ GLIMMER_START_POSITION };
    opacity: 0.36;
    transform: translate3d(-12%, 8%, 0);
  }

  50% {
    opacity: 0.92;
  }

  100% {
    background-position: ${ GLIMMER_END_POSITION };
    opacity: 0.42;
    transform: translate3d(14%, -10%, 0);
  }
`;

const AMBIENT_ANIMATION = `${ ambientParallax } 18s ease-in-out infinite alternate`;
const STARFIELD_ANIMATION = `${ starfieldDrift } 22s ease-in-out infinite alternate`;
const GLIMMER_ANIMATION = `${ glimmerDrift } 6s ease-in-out infinite alternate`;
const GLEAM_ANIMATION = [
  `${ stationaryStarGleam } 5.2s ease-in-out infinite`,
  `${ gleamParallax } 14s ease-in-out infinite alternate`,
  `${ gleamDrift } 16s ease-in-out infinite alternate`,
].join(', ');

interface Props {
  ambientInset?: BoxProps['inset'];
  glimmerInset?: BoxProps['inset'];
}

const DakotaStarfield = ({ ambientInset = '-18px', glimmerInset = '-10px' }: Props) => {
  return (
    <>
      <Box
        aria-hidden="true"
        data-dakota-animation-layer="ambient"
        position="absolute"
        inset={ ambientInset }
        zIndex={ 1 }
        pointerEvents="none"
        overflow="hidden"
        background={ AMBIENT_BACKGROUND }
        animation={ AMBIENT_ANIMATION }
        willChange="transform"
        _motionReduce={{ animation: 'none' }}
        _before={{
          content: '""',
          position: 'absolute',
          inset: '-1px',
          opacity: { _light: 0.34, _dark: 0.44 },
          backgroundImage: STARFIELD_BACKGROUND,
          backgroundSize: {
            base: '86px 86px, 132px 132px, 218px 218px',
            md: '112px 112px, 176px 176px, 286px 286px',
          },
          backgroundPosition: '13px 10px, 62px 36px, 121px 82px',
          backgroundRepeat: 'repeat',
          animation: STARFIELD_ANIMATION,
          willChange: 'background-position',
          _motionReduce: { animation: 'none' },
        }}
        _after={{
          content: '""',
          position: 'absolute',
          inset: '-1px',
          opacity: 0.4,
          backgroundImage: GLEAM_BACKGROUND,
          backgroundSize: {
            base: '190px 190px, 260px 260px',
            md: '250px 250px, 340px 340px',
          },
          backgroundPosition: '33px 34px, 174px 90px',
          backgroundRepeat: 'repeat',
          animation: GLEAM_ANIMATION,
          willChange: 'background-position, transform, opacity, filter',
          _motionReduce: { animation: 'none' },
        }}
      />
      <Box
        aria-hidden="true"
        data-dakota-animation-layer="glimmer"
        position="absolute"
        inset={ glimmerInset }
        zIndex={ 2 }
        pointerEvents="none"
        backgroundImage={ GLIMMER_BACKGROUND }
        backgroundSize={ GLIMMER_SIZE }
        backgroundPosition={ GLIMMER_START_POSITION }
        animation={ GLIMMER_ANIMATION }
        filter={{
          _light: 'drop-shadow(0 0 6px rgba(15, 118, 110, 0.14))',
          _dark: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.26))',
        }}
        mixBlendMode={{ _light: 'normal', _dark: 'screen' }}
        willChange="transform, opacity"
        _motionReduce={{ animation: 'none' }}
      />
    </>
  );
};

export default React.memo(DakotaStarfield);
