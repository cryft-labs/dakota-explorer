// SPDX-License-Identifier: LicenseRef-Blockscout

import { Center, chakra } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { useColorModeValue } from 'src/toolkit/chakra/color-mode';
import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

type Props = {
  icon?: IconName;
  iconSize?: string;
  iconUrl?: Array<string>;
  text: string;
  url: string;
  isLoading?: boolean;
};

const FooterLinkItemIconExternal = ({ iconUrl, text }: { iconUrl: Array<string>; text: string }) => {
  const [ lightIconUrl, darkIconUrl ] = iconUrl;

  const imageSrc = useColorModeValue(lightIconUrl, darkIconUrl || lightIconUrl);

  return (
    <Image
      src={ imageSrc }
      alt={ `${ text } icon` }
      boxSize={ 5 }
      objectFit="contain"
    />
  );
};

const FooterLinkItem = ({ icon, iconSize, iconUrl, text, url, isLoading }: Props) => {
  if (isLoading) {
    return <Skeleton loading my="3px">{ text }</Skeleton>;
  }

  const iconElement = (() => {
    if (iconUrl && Array.isArray(iconUrl)) {
      const [ lightIconUrl, darkIconUrl ] = iconUrl;

      if (typeof lightIconUrl === 'string' && (typeof darkIconUrl === 'string' || !darkIconUrl)) {
        return <FooterLinkItemIconExternal iconUrl={ iconUrl } text={ text }/>;
      }
    }

    if (icon) {
      return (
        <Center minW={ 6 }>
          <SpriteIcon boxSize={ iconSize || 5 } name={ icon }/>
        </Center>
      );
    }

    return null;
  })();

  return (
    <Link
      href={ url }
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      minH="36px"
      w="100%"
      px={ 3 }
      py={ 2 }
      variant="plain"
      external
      iconColor="currentColor"
      textStyle="xs"
      columnGap={ 2 }
      borderWidth="1px"
      borderColor={{ _light: 'rgba(15, 118, 110, 0.18)', _dark: 'rgba(52, 211, 153, 0.18)' }}
      borderRadius="base"
      bg={{ _light: 'rgba(255, 255, 255, 0.44)', _dark: 'rgba(7, 26, 23, 0.46)' }}
      color="text.secondary"
      fontWeight={ 600 }
      _hover={{
        color: 'text.primary',
        bg: { _light: 'rgba(52, 211, 153, 0.1)', _dark: 'rgba(52, 211, 153, 0.1)' },
        borderColor: { _light: 'rgba(15, 118, 110, 0.34)', _dark: 'rgba(52, 211, 153, 0.34)' },
        textDecoration: 'none',
      }}
    >
      { iconElement }
      <chakra.span flex="1" minW={ 0 }>
        { text }
      </chakra.span>
    </Link>
  );
};

export default FooterLinkItem;
