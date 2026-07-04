// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';
import { LuBookOpen, LuChevronDown, LuExternalLink, LuGlobe, LuLayoutDashboard } from 'react-icons/lu';

import NavigationMobile from 'src/shell/navigation/mobile/NavigationMobile';

import NetworkLogo from 'src/slices/chain/logo/NetworkLogo';
import TestnetBadge from 'src/slices/chain/TestnetBadge';

import RollupStageBadge from 'src/features/rollup/common/components/RollupStageBadge';

import { Button } from 'src/toolkit/chakra/button';
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'src/toolkit/chakra/drawer';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import DakotaThemeToggle from './DakotaThemeToggle';

interface Props {
  isMarketplaceAppPage?: boolean;
}

const DAKOTA_PLATFORM_LINKS = [
  { label: 'Dashboard', url: 'https://dashboard.dakota.cards', icon: LuLayoutDashboard },
  { label: 'Documentation', url: 'https://docs.dakota.cards', icon: LuBookOpen },
  { label: 'Main Site', url: 'https://dakota.cards', icon: LuGlobe },
] as const;
const DAKOTA_NAVIGATOR_MENU_ID = 'dakota-mobile-navigator-links';

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
        bg={{ _light: 'rgba(255, 255, 255, 0.96)', _dark: 'rgba(7, 26, 23, 0.98)' }}
        borderRightWidth="1px"
        borderColor={{ _light: 'rgba(15, 118, 110, 0.14)', _dark: 'rgba(52, 211, 153, 0.16)' }}
        boxShadow={{ _light: '18px 0 44px rgba(15, 118, 110, 0.14)', _dark: '18px 0 52px rgba(0, 0, 0, 0.42)' }}
      >
        <DrawerBody display="flex" flexDirection="column" overflowX="hidden" overflowY="auto" px="24px" py="20px">
          <NetworkLogo/>
          <chakra.nav aria-label="Dakota platform links">
            <Button
              aria-controls={ DAKOTA_NAVIGATOR_MENU_ID }
              aria-expanded={ isNavigatorOpen }
              aria-label="Toggle Dakota platform navigator"
              onClick={ handleNavigatorToggle }
              h="38px"
              w="100%"
              mt="18px"
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
              color="white"
              bg="#34D399"
              borderWidth="0"
              boxShadow="none"
              _hover={{
                color: 'white',
                bg: '#2DD4BF',
              }}
            >
              <chakra.span>Navigator</chakra.span>
              <chakra.span
                display="inline-flex"
                transform={ isNavigatorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }
                transition="transform 0.2s ease"
              >
                <LuChevronDown size={ 16 } strokeWidth={ 2.25 }/>
              </chakra.span>
            </Button>
            <chakra.ul
              id={ DAKOTA_NAVIGATOR_MENU_ID }
              display={ isNavigatorOpen ? 'flex' : 'none' }
              flexDirection="column"
              gap="8px"
              mt="18px"
              mb="18px"
              listStyleType="none"
              p={ 0 }
            >
              { DAKOTA_PLATFORM_LINKS.map((link) => {
                const LinkIcon = link.icon;

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
                      <LinkIcon size={ 20 } strokeWidth={ 2.1 }/>
                      <chakra.span flex="1">{ link.label }</chakra.span>
                      <LuExternalLink size={ 15 } strokeWidth={ 2 }/>
                    </chakra.a>
                  </chakra.li>
                );
              }) }
            </chakra.ul>
          </chakra.nav>
          <TestnetBadge alignSelf="flex-start" mb={ 2 }/>
          <RollupStageBadge alignSelf="flex-start" mb={ 2 }/>
          <NavigationMobile onNavLinkClick={ onClose } isMarketplaceAppPage={ isMarketplaceAppPage }/>
          <chakra.div
            position="sticky"
            bottom={ 0 }
            zIndex={ 1 }
            mt="auto"
            pt="18px"
            pb="2px"
            bg={{ _light: 'rgba(255, 255, 255, 0.96)', _dark: 'rgba(7, 26, 23, 0.98)' }}
            borderTopWidth="1px"
            borderColor={{ _light: 'rgba(15, 118, 110, 0.14)', _dark: 'rgba(52, 211, 153, 0.16)' }}
          >
            <DakotaThemeToggle mode="button"/>
          </chakra.div>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default Burger;
