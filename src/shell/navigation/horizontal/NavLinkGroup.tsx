// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, chakra, Separator } from '@chakra-ui/react';
import React from 'react';

import type { NavGroupItem } from '../types';

import { Link } from 'src/toolkit/chakra/link';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import LightningLabel from '../LightningLabel';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';
interface Props {
  height?: string;
  item: NavGroupItem;
}

const NavLinkGroup = ({ height, item }: Props) => {
  const { open, onOpenChange } = useDisclosure();

  const isHighlighted = checkRouteHighlight(item.subItems);
  const hasGroups = item.subItems.some((subItem) => Array.isArray(subItem));

  const content = hasGroups ? (
    <HStack separator={ <Separator/> } alignItems="stretch">
      { item.subItems.map((subItem, index) => {
        if (!Array.isArray(subItem)) {
          return <NavLink key={ subItem.text } item={ subItem } isSubMenuItem/>;
        }

        return (
          <chakra.ul key={ index } display="flex" flexDir="column" rowGap={ 1 }>
            { subItem.map((navItem) => <NavLink key={ navItem.text } item={ navItem } isSubMenuItem/>) }
          </chakra.ul>
        );
      }) }
    </HStack>
  ) : (
    <chakra.ul display="flex" flexDir="column" rowGap={ 1 }>
      { item.subItems.map((subItem) => {
        if (Array.isArray(subItem)) {
          return null;
        }
        return <NavLink key={ subItem.text } item={ subItem } isSubMenuItem/>;
      }) }
    </chakra.ul>
  );

  return (
    <Tooltip
      variant="popover"
      content={ content }
      onOpenChange={ onOpenChange }
      lazyMount={ false }
      positioning={{
        placement: 'bottom',
        offset: { mainAxis: 8 },
      }}
      interactive
    >
      <Link
        as="li"
        listStyleType="none"
        display="flex"
        alignItems="center"
        justifyContent="center"
        h={ height }
        minH={ height }
        minW="112px"
        px="15px"
        py={ 0 }
        fontSize="16px"
        lineHeight="1"
        fontWeight={ 600 }
        variant="navigation"
        { ...(item.isActive ? { 'data-selected': true } : {}) }
        { ...(open ? { 'data-active': true } : {}) }
        borderRadius="base"
        whiteSpace="nowrap"
        boxSizing="border-box"
      >
        <chakra.span display="inline-flex" alignItems="center" h="100%">{ item.text }</chakra.span>
        { isHighlighted && (
          <LightningLabel
            iconColor={ item.isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg.group' }
            position={{ lg: 'static' }}
            ml={{ lg: '2px' }}
          />
        ) }
      </Link>
    </Tooltip>
  );
};

export default React.memo(NavLinkGroup);
