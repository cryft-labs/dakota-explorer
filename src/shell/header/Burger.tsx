// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import NavigationMobile from 'src/shell/navigation/mobile/NavigationMobile';

import NetworkLogo from 'src/slices/chain/logo/NetworkLogo';
import TestnetBadge from 'src/slices/chain/TestnetBadge';

import RollupStageBadge from 'src/features/rollup/common/components/RollupStageBadge';

import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'src/toolkit/chakra/drawer';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

interface Props {
  isMarketplaceAppPage?: boolean;
}

const DAKOTA_PLATFORM_LINKS = [
  { label: 'Main site', url: 'https://dakota.cards' },
  { label: 'Docs', url: 'https://docs.dakota.cards' },
  { label: 'Dashboard', url: 'https://dashboard.dakota.cards' },
] as const;

const MenuIcon = () => (
  <chakra.svg aria-hidden="true" focusable="false" boxSize="22px" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"/>
  </chakra.svg>
);

const Burger = ({ isMarketplaceAppPage }: Props) => {
  const { open, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <DrawerRoot
      open={ open }
      onOpenChange={ onOpenChange }
      placement="start"
      lazyMount={ false }
    >
      <DrawerTrigger>
        <IconButton
          onClick={ onOpen }
          p={ 2 }
          boxSize="40px"
          borderRadius="10px"
          aria-label="Menu button"
          bg={{ _light: 'rgba(15, 118, 110, 0.08)', _dark: 'rgba(52, 211, 153, 0.12)' }}
          borderWidth="1px"
          borderColor={{ _light: 'rgba(15, 118, 110, 0.16)', _dark: 'rgba(52, 211, 153, 0.18)' }}
          color={{ _light: 'teal.700', _dark: 'green.300' }}
          _hover={{ bg: { _light: 'rgba(15, 118, 110, 0.12)', _dark: 'rgba(52, 211, 153, 0.16)' } }}
        >
          <MenuIcon/>
        </IconButton>
      </DrawerTrigger>
      <DrawerContent
        bg={{ _light: 'rgba(255, 255, 255, 0.96)', _dark: 'rgba(7, 26, 23, 0.98)' }}
        borderRightWidth="1px"
        borderColor={{ _light: 'rgba(15, 118, 110, 0.14)', _dark: 'rgba(52, 211, 153, 0.16)' }}
        boxShadow={{ _light: '18px 0 44px rgba(15, 118, 110, 0.14)', _dark: '18px 0 52px rgba(0, 0, 0, 0.42)' }}
      >
        <DrawerBody display="flex" flexDirection="column" overflowX="hidden" overflowY="auto" px="24px" py="20px">
          <NetworkLogo/>
          <chakra.nav aria-label="Dakota platform links">
            <chakra.ul display="flex" flexDirection="column" gap="8px" mt="18px" mb="18px" listStyleType="none" p={ 0 }>
              { DAKOTA_PLATFORM_LINKS.map((link) => (
                <chakra.li key={ link.label }>
                  <chakra.a
                    href={ link.url }
                    target="_blank"
                    rel="noreferrer"
                    display="flex"
                    alignItems="center"
                    h="44px"
                    px="14px"
                    borderRadius="10px"
                    bg={{ _light: 'rgba(15, 118, 110, 0.06)', _dark: 'rgba(52, 211, 153, 0.1)' }}
                    borderWidth="1px"
                    borderColor={{ _light: 'rgba(15, 118, 110, 0.14)', _dark: 'rgba(52, 211, 153, 0.16)' }}
                    color="text.primary"
                    fontSize="15px"
                    fontWeight={ 700 }
                    _hover={{
                      textDecoration: 'none',
                      bg: { _light: 'rgba(15, 118, 110, 0.1)', _dark: 'rgba(52, 211, 153, 0.14)' },
                    }}
                  >
                    { link.label }
                  </chakra.a>
                </chakra.li>
              )) }
            </chakra.ul>
          </chakra.nav>
          <TestnetBadge alignSelf="flex-start" mb={ 2 }/>
          <RollupStageBadge alignSelf="flex-start" mb={ 2 }/>
          <NavigationMobile onNavLinkClick={ onClose } isMarketplaceAppPage={ isMarketplaceAppPage }/>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default Burger;
