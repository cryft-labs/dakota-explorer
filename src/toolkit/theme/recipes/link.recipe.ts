// SPDX-License-Identifier: LicenseRef-Blockscout

import { defineRecipe } from '@chakra-ui/react';

import { latexChoosable, latexSelected } from '../latex';

export const recipe = defineRecipe({
  base: {
    gap: 0,
    _disabled: {
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      primary: {
        color: 'link.primary',
        _hover: {
          textDecoration: 'none',
          color: 'link.primary.hover',
        },
      },
      secondary: {
        color: 'link.secondary',
        _hover: {
          textDecoration: 'none',
          color: 'hover',
        },
      },
      subtle: {
        color: 'link.subtle',
        _hover: {
          color: 'link.subtle.hover',
          textDecorationLine: 'underline',
          textDecorationColor: 'link.subtle.hover',
        },
      },
      underlaid: {
        color: 'link.primary',
        bgColor: 'link.underlaid.bg',
        px: '8px',
        py: '6px',
        borderRadius: 'base',
        textStyle: 'sm',
        _hover: {
          color: 'link.primary.hover',
          textDecoration: 'none',
        },
      },
      menu: {
        color: 'link.menu',
        _hover: {
          color: 'hover',
          textDecoration: 'none',
        },
      },
      navigation: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1',
        color: 'link.navigation.fg',
        bg: 'transparent',
        ...latexChoosable,
        _hover: {
          color: 'link.navigation.fg.hover',
          textDecoration: 'none',
        },
        // Cryft latex: the chosen item is pressed into the bar (cryft.app's --latex-selected)
        _selected: {
          ...latexSelected,
          _hover: {
            ...latexSelected,
            textDecoration: 'none',
          },
          _active: {
            boxShadow: 'var(--latex-press)',
          },
        },
        _active: {
          color: 'link.navigation.fg.active',
          boxShadow: 'var(--latex-press)',
        },
      },
      plain: {
        color: 'inherit',
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
