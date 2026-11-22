// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text, chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import config from 'src/config';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { useColorModeValue } from 'src/toolkit/chakra/color-mode';
import { Image } from 'src/toolkit/chakra/image';

import { INVERT_FILTER } from './consts';

const DAKOTA_MARK_SRC = '/assets/cryft/cryft-cards-mark.svg';

const LogoFallback = () => {
  return (
    <SpriteIcon
      name="networks/logo-placeholder"
      width="120px"
      height="24px"
      color={{ base: '#0B7D89', _dark: '#35C2CF' }}
      aria-label="Network logo placeholder"
    />
  );
};

type Props = {
  className?: string;
};

const NetworkLogo = ({ className }: Props) => {

  const logoSrc = useColorModeValue(config.chain.logo.default, config.chain.logo.dark || config.chain.logo.default);
  const isDakotaLogo = logoSrc === DAKOTA_MARK_SRC;

  if (isDakotaLogo) {
    return (
      <chakra.a
        className={ className }
        href={ route({ pathname: '/' }) }
        aria-label="Cryft Cards Network Explorer"
        display="inline-flex"
        alignItems="center"
        gap="10px"
        color="text.primary"
        minW={ 0 }
        w="220px"
        h="72px"
        _hover={{ textDecoration: 'none', color: 'text.primary' }}
      >
        <Image
          w="48px"
          h="48px"
          src={ DAKOTA_MARK_SRC }
          alt="Cryft Cards Explorer logo mark"
          fallback={ <LogoFallback/> }
          objectFit="contain"
        />
        <Box minW={ 0 }>
          <Text m={ 0 } fontWeight={ 700 } lineHeight="1.05" fontSize="14px" color="text.primary" whiteSpace="nowrap">
            Cryft Cards
          </Text>
          <Text
            m={ 0 }
            display="block"
            lineHeight="1.15"
            fontSize="12px"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="text.secondary"
          >
            Network<br/>Explorer
          </Text>
        </Box>
      </chakra.a>
    );
  }

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label="Link to main page"
    >
      <Image
        h="24px"
        skeletonWidth="120px"
        src={ logoSrc }
        alt={ `${ config.chain.name } network logo` }
        fallback={ <LogoFallback/> }
        filter={{ _dark: !config.chain.logo.dark ? INVERT_FILTER : undefined }}
        objectFit="contain"
        objectPosition="left"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkLogo));
