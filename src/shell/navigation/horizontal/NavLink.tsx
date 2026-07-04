// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { NavItem } from '../types';

import { Link } from 'src/toolkit/chakra/link';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { isInternalItem } from '../useNavItems';
import { checkRouteHighlight } from '../utils';

interface Props {
  className?: string;
  height?: string;
  item: NavItem;
  noIcon?: boolean;
}

const NavLink = ({ className, height, item, noIcon }: Props) => {
  const isInternalLink = isInternalItem(item);

  const isActive = 'isActive' in item && item.isActive;

  const isHighlighted = checkRouteHighlight(item);

  return (
    <chakra.li
      listStyleType="none"
    >
      <Link
        className={ className }
        href={ isInternalLink ? route(item.nextRoute) : item.url }
        external={ !isInternalLink }
        display="flex"
        alignItems="center"
        variant="navigation"
        { ...(isActive ? { 'data-selected': true } : {}) }
        w={ noIcon ? 'auto' : '224px' }
        h={ height }
        px={ noIcon ? 3.5 : 2 }
        py={ noIcon ? 0 : '9px' }
        fontSize="14px"
        lineHeight="20px"
        fontWeight={ noIcon ? 700 : 600 }
        borderRadius="10px"
        whiteSpace="nowrap"
      >
        { !noIcon && <NavLinkIcon item={ item } mr={ 3 }/> }
        <chakra.span>{ item.text }</chakra.span>
        { isHighlighted && (
          <LightningLabel
            iconColor={ isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg.group' }
            position={{ lg: 'static' }}
            ml={{ lg: '2px' }}
            isCollapsed={ false }
          />
        ) }
      </Link>
    </chakra.li>
  );
};

export default React.memo(chakra(NavLink));
