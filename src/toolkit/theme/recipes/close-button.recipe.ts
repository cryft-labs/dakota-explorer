// SPDX-License-Identifier: LicenseRef-Blockscout

import { defineRecipe } from '@chakra-ui/react';

export const recipe = defineRecipe({
  base: {
    display: 'flex',
    gap: 0,
    borderRadius: 'base',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    _disabled: {
      opacity: 'control.disabled',
    },
    minWidth: 'auto',
  },
  variants: {
    visual: {
      plain: {
        bg: 'button.icon_background.bg',
        color: 'closeButton.fg',
        border: 'none',
        _hover: {
          bg: 'hover',
          color: 'white',
        },
      },
    },
    size: {
      md: { boxSize: 5 },
    },
  },
  defaultVariants: {
    size: 'md',
    visual: 'plain',
  },
});
