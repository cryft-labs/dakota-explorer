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
  isSubMenuItem?: boolean;
  item: NavItem;
  noIcon?: boolean;
}

const NavLink = ({ className, height, isSubMenuItem, item, noIcon }: Props) => {
  const isInternalLink = isInternalItem(item);

  const isActive = 'isActive' in item && item.isActive;

  const isHighlighted = checkRouteHighlight(item);

  const shouldCenterContent = noIcon || isSubMenuItem;
  let horizontalPadding: string | number = 2;
  if (isSubMenuItem) {
    horizontalPadding = 4;
  }
  if (noIcon) {
    horizontalPadding = '15px';
  }

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
        justifyContent={ shouldCenterContent ? 'center' : 'flex-start' }
        variant="navigation"
        { ...(isActive ? { 'data-selected': true } : {}) }
        w={ noIcon ? 'auto' : '224px' }
        h={ height }
        minH={ height }
        px={ horizontalPadding }
        py={ noIcon ? 0 : '9px' }
        fontSize={ noIcon ? '16px' : '14px' }
        lineHeight={ noIcon ? '1' : '20px' }
        fontWeight={ 600 }
        borderRadius="base"
        whiteSpace="nowrap"
        textAlign={ isSubMenuItem ? 'center' : undefined }
        boxSizing="border-box"
      >
        { !noIcon && !isSubMenuItem && <NavLinkIcon item={ item } mr={ 3 }/> }
        <chakra.span display="inline-flex" alignItems="center" justifyContent={ isSubMenuItem ? 'center' : undefined } h={ noIcon ? '100%' : 'auto' }>
          { item.text }
        </chakra.span>
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
