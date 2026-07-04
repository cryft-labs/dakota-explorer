// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ThemingConfig } from '@chakra-ui/react';

import type { ExcludeUndefined } from 'src/shared/types/utils';

import config from 'src/config';

export const BODY_TYPEFACE = config.misc.fonts.body?.name ?? 'Montserrat';
export const HEADING_TYPEFACE = config.misc.fonts.heading?.name ?? 'Montserrat';

export const fonts: ExcludeUndefined<ThemingConfig['tokens']>['fonts'] = {
  heading: { value: `${ HEADING_TYPEFACE }, sans-serif` },
  body: { value: `${ BODY_TYPEFACE }, sans-serif` },
};

export const textStyles: ThemingConfig['textStyles'] = {
  heading: {
    xl: {
      value: {
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: '600',
        letterSpacing: '0',
        fontFamily: 'heading',
      },
    },
    lg: {
      value: {
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: '600',
        fontFamily: 'heading',
      },
    },
    md: {
      value: {
        fontSize: '18px',
        lineHeight: '24px',
        fontWeight: '600',
        fontFamily: 'heading',
      },
    },
    sm: {
      value: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: '600',
        fontFamily: 'heading',
      },
    },
    xs: {
      value: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '600',
        fontFamily: 'heading',
      },
    },
  },
  text: {
    xl: {
      value: {
        fontSize: '20px',
        lineHeight: '28px',
        fontWeight: '400',
        fontFamily: 'body',
      },
    },
    md: {
      value: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: '400',
        fontFamily: 'body',
      },
    },
    sm: {
      value: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '400',
        fontFamily: 'body',
      },
    },
    xs: {
      value: {
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: '400',
        fontFamily: 'body',
      },
    },
  },
};
