// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ENCODED_SVG_TAG_START = '%3C';

const DAKOTA_BACKGROUND_NOISE = [
  'url("data:image/svg+xml,',
  `${ ENCODED_SVG_TAG_START }svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27140%27 height=%27140%27 viewBox=%270 0 140 140%27%3E`,
  `${ ENCODED_SVG_TAG_START }filter id=%27n%27%3E`,
  '%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.82%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E',
  '%3CfeColorMatrix type=%27saturate%27 values=%270%27/%3E',
  '%3C/filter%3E',
  `${ ENCODED_SVG_TAG_START }rect width=%27140%27 height=%27140%27 filter=%27url(%23n)%27 opacity=%270.55%27/%3E`,
  '%3C/svg%3E")',
].join('');

const DAKOTA_STARFIELD_BACKGROUND = [
  'radial-gradient(ellipse at 50% 0%, rgba(52, 211, 153, 0.13) 0%, transparent 38%)',
  'radial-gradient(ellipse at 16% 36%, rgba(15, 118, 110, 0.1) 0%, transparent 34%)',
  'radial-gradient(ellipse at 86% 24%, rgba(45, 212, 191, 0.1) 0%, transparent 32%)',
  'radial-gradient(circle, rgba(255, 255, 255, 0.72) 0 1px, transparent 1.9px)',
  'radial-gradient(circle, rgba(52, 211, 153, 0.68) 0 1px, transparent 2px)',
  'radial-gradient(circle, rgba(255, 255, 255, 0.52) 0 0.85px, transparent 1.7px)',
  'radial-gradient(circle, rgba(255, 255, 255, 0.92) 0 1.35px, transparent 2.6px)',
  'radial-gradient(circle, rgba(15, 118, 110, 0.74) 0 1.2px, transparent 2.5px)',
].join(', ');

const Container = ({ children, className }: Props) => {
  return (
    <Box
      className={ className }
      minWidth={{ base: '100%', lg: 'fit-content' }}
      m="0 auto"
      bgColor="bg.primary"
      position="relative"
      isolation="isolate"
      overflow="clip"
      css={{
        '@keyframes dakotaExplorerStarGleam': {
          '0%, 100%': { opacity: 0.28, filter: 'drop-shadow(0 0 0 transparent)' },
          '42%': { opacity: 0.86, filter: 'drop-shadow(0 0 7px rgba(255, 255, 255, 0.48))' },
          '68%': { opacity: 0.48, filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.28))' },
        },
      }}
      _before={{
        content: '""',
        position: 'fixed',
        inset: 0,
        backgroundImage: DAKOTA_STARFIELD_BACKGROUND,
        backgroundRepeat: 'repeat',
        backgroundSize: {
          base: '100% 100%, 100% 100%, 100% 100%, 86px 86px, 132px 132px, 218px 218px, 190px 190px, 260px 260px',
          md: '100% 100%, 100% 100%, 100% 100%, 112px 112px, 176px 176px, 286px 286px, 250px 250px, 340px 340px',
        },
        backgroundPosition: '0 0, 0 0, 0 0, 13px 10px, 62px 36px, 121px 82px, 33px 34px, 174px 90px',
        mixBlendMode: { base: 'normal', _dark: 'screen' },
        opacity: { base: 0.24, _dark: 0.44 },
        animation: 'dakotaExplorerStarGleam 5.2s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0,
        _motionReduce: {
          animation: 'none',
        },
      }}
      _after={{
        content: '""',
        position: 'fixed',
        inset: 0,
        backgroundImage: DAKOTA_BACKGROUND_NOISE,
        backgroundRepeat: 'repeat',
        backgroundSize: '140px 140px',
        mixBlendMode: { base: 'multiply', _dark: 'screen' },
        opacity: { base: 0.16, _dark: 0.22 },
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <Box position="relative" zIndex={ 2 }>
        { children }
      </Box>
    </Box>
  );
};

export default React.memo(chakra(Container));
