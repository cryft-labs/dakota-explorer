// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SystemConfig } from '@chakra-ui/react';

import addressEntity from './globals/address-entity';
import entity from './globals/entity';
import recaptcha from './globals/recaptcha';
import scrollbar from './globals/scrollbar';
import { LATEX_VARS_DARK, LATEX_VARS_LIGHT } from './latex';

const webkitAutofillOverrides = {
  WebkitTextFillColor: 'var(--chakra-colors-input-fg)',
  '-webkit-box-shadow': '0 0 0px 1000px var(--chakra-colors-input-bg) inset',
  transition: 'background-color 5000s ease-in-out 0s',
};

// Touch screens: inputs at 16px or more, so focusing one never zooms the page (pinch zoom stays on).
const touchInputSize = {
  '@media (pointer: coarse)': { fontSize: 'max(16px, 1em)' },
};

const webkitAutofillRules = {
  '&:-webkit-autofill': webkitAutofillOverrides,
  '&:-webkit-autofill:hover': webkitAutofillOverrides,
  '&:-webkit-autofill:focus': webkitAutofillOverrides,
};

const globalCss: SystemConfig['globalCss'] = {
  ':root': LATEX_VARS_LIGHT,
  '.dark': LATEX_VARS_DARK,
  html: {
    bg: 'global.body.bg',
  },
  body: {
    bg: 'global.body.bg',
    color: 'global.body.fg',
    WebkitTapHighlightColor: 'transparent',
    fontVariantLigatures: 'no-contextual',
    focusRingStyle: 'hidden',
    minHeight: '100vh',
  },
  mark: {
    bg: 'global.mark.bg',
    color: 'inherit',
  },
  '::selection': {
    bg: 'global.selection.bg',
  },
  'svg *::selection': {
    color: 'none',
    background: 'none',
  },
  form: {
    w: '100%',
  },
  input: {
    // hide number input arrows in Google Chrome
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    ...webkitAutofillRules,
    ...touchInputSize,
  },
  textarea: {
    ...webkitAutofillRules,
    ...touchInputSize,
  },
  select: {
    ...webkitAutofillRules,
    ...touchInputSize,
  },
  ...recaptcha,
  ...scrollbar,
  ...entity,
  ...addressEntity,
};

export default globalCss;
