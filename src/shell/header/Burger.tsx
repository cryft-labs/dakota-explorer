// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import NavigationMobile from 'src/shell/navigation/mobile/NavigationMobile';

import NetworkLogo from 'src/slices/chain/logo/NetworkLogo';
import TestnetBadge from 'src/slices/chain/TestnetBadge';

import RollupStageBadge from 'src/features/rollup/common/components/RollupStageBadge';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'src/toolkit/chakra/drawer';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';
import { latexBrand, latexBrandHover } from 'src/toolkit/theme/latex';

import CryftThemeToggle from './CryftThemeToggle';

interface Props {
  isMarketplaceAppPage?: boolean;
}

const CRYFT_PLATFORM_LINKS = [
  { label: 'Cryft Cards', url: 'https://cryft.app', icon: 'globe' as const },
  { label: 'How it works', url: 'https://cryft.app/how', icon: 'docs' as const },
] as const;
const CRYFT_NAVIGATOR_MENU_ID = 'cryft-mobile-navigator-links';

const MenuIcon = () => (
  <chakra.svg aria-hidden="true" focusable="false" boxSize="22px" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"/>
  </chakra.svg>
);

const Burger = ({ isMarketplaceAppPage }: Props) => {
  const { open, onOpen, onClose, onOpenChange } = useDisclosure();
  const [ isNavigatorOpen, setIsNavigatorOpen ] = React.useState(false);

  const handleNavigatorToggle = React.useCallback(() => {
    setIsNavigatorOpen((value) => !value);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setIsNavigatorOpen(false);
    }
  }, [ open ]);

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
          size="md"
          borderRadius="base"
          aria-label="Menu button"
          variant="icon_background"
          _hover={{
            bg: 'hover',
            color: 'white',
            transform: 'translateY(-1px)',
          }}
        >
          <MenuIcon/>
        </IconButton>
      </DrawerTrigger>
      <DrawerContent
        bg={{ _light: 'rgba(255, 255, 255, 0.96)', _dark: 'rgba(34, 34, 34, 0.98)' }}
        borderRightWidth="1px"
        borderColor={{ _light: 'rgba(11, 125, 137, 0.14)', _dark: 'rgba(53, 194, 207, 0.16)' }}
        boxShadow={{ _light: '18px 0 44px rgba(11, 125, 137, 0.14)', _dark: '18px 0 52px rgba(0, 0, 0, 0.42)' }}
      >
        <DrawerBody display="flex" flexDirection="column" overflowX="hidden" overflowY="auto" px="24px" py="20px">
          <NetworkLogo/>
          <chakra.nav aria-label="Cryft platform links">
            { /* Chad 2026-11-22: the light/dark toggle sits right of the long Navigator button */ }
            <Flex mt="18px" gap="10px" alignItems="center">
              <Button
                aria-controls={ CRYFT_NAVIGATOR_MENU_ID }
                aria-expanded={ isNavigatorOpen }
                aria-label="Toggle Cryft platform navigator"
                onClick={ handleNavigatorToggle }
                h="38px"
                flex="1"
                minW={ 0 }
                px="14px"
                display="inline-flex"
                alignItems="center"
                justifyContent="space-between"
                gap="6px"
                borderRadius="base"
                fontSize="14px"
                lineHeight="20px"
                fontWeight={ 700 }
                whiteSpace="nowrap"
                color="button.solid.text"
                bg="button.solid.bg"
                borderWidth="0"
                { ...latexBrand }
                _hover={{
                  ...latexBrandHover,
                  color: 'button.solid.text',
                }}
              >
                <chakra.span>Navigator</chakra.span>
                <chakra.span
                  display="inline-flex"
                  transform={ isNavigatorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }
                  transition="transform 0.2s ease"
                >
                  <SpriteIcon name="arrows/east-mini" boxSize="16px" transform="rotate(-90deg)" aria-hidden/>
                </chakra.span>
              </Button>
              <CryftThemeToggle/>
            </Flex>
            <chakra.ul
              id={ CRYFT_NAVIGATOR_MENU_ID }
              display={ isNavigatorOpen ? 'flex' : 'none' }
              flexDirection="column"
              gap="8px"
              mt="18px"
              mb="18px"
              listStyleType="none"
              p={ 0 }
            >
              { CRYFT_PLATFORM_LINKS.map((link) => {
                return (
                  <chakra.li key={ link.label }>
                    <chakra.a
                      href={ link.url }
                      target="_blank"
                      rel="noreferrer"
                      display="flex"
                      alignItems="center"
                      gap="10px"
                      h="48px"
                      px="14px"
                      borderRadius="base"
                      bg="transparent"
                      borderWidth="0"
                      color="text.primary"
                      fontSize="16px"
                      fontWeight={ 600 }
                      _hover={{
                        textDecoration: 'none',
                        bg: 'hover',
                        color: 'white',
                      }}
                    >
                      <SpriteIcon name={ link.icon } boxSize="20px" aria-hidden/>
                      <chakra.span flex="1">{ link.label }</chakra.span>
                      <SpriteIcon name="link_external" boxSize="15px" aria-hidden/>
                    </chakra.a>
                  </chakra.li>
                );
              }) }
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
