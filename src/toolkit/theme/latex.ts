// SPDX-License-Identifier: LicenseRef-Blockscout

// Cryft Cards "latex" layer (cryft-cards-web src/ui/theme.css, Chad 2026-10-24; for the explorer 2026-11-22): the page is
// one sheet of material, and what stands on it is that material pushed up from underneath (a soft face lit from the top
// left, shaded to the bottom right, --latex-lift); what takes words or holds a setting is pressed into it (--latex-sink);
// a press pushes a button back down (--latex-press); the brand's teal is the same rubber, tinted (--latex-brand). It only
// adds depth: the colours words are read on stay the theme's own, so the theme's contrast holds (AA). The teal rubber runs
// from the brand teal to the deep teal (cryft.app starts it lighter; white type there would fall under 4.5:1), its sheen
// carried by the inset rim instead. Chakra's color mode is the `dark` class on <html>.

export const LATEX_VARS_LIGHT = {
  '--latex-face': 'linear-gradient(155deg, #ffffff 0%, #f8fbfa 52%, #f0f5f4 100%)',
  '--latex-hi': 'rgba(255, 255, 255, 0.95)',
  '--latex-lo': 'rgba(16, 64, 70, 0.14)',
  '--latex-rim': 'inset 0 1px 1px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(16, 64, 70, 0.05)',
  '--latex-lift': '-5px -5px 14px var(--latex-hi), 6px 8px 18px var(--latex-lo), var(--latex-rim)',
  '--latex-lift-sm': '-3px -3px 8px var(--latex-hi), 3px 5px 10px var(--latex-lo), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
  '--latex-well': '#eef4f3',
  // The chosen option (cryft.app --latex-selected*): pressed in, tinted with the brand rubber (brand 55% / deep, 15% into
  // the well = #CCE0E1), its words in the brand text colour (#075A66 on it: 5.8:1)
  '--latex-selected': '#CCE0E1',
  '--latex-selected-press': 'inset 2px 3px 7px rgba(16, 64, 70, 0.2), inset -2px -2px 6px rgba(255, 255, 255, 0.85)',
  '--latex-selected-text': '#075A66',
  '--latex-sink': 'inset 3px 4px 8px rgba(16, 64, 70, 0.13), inset -3px -3px 8px rgba(255, 255, 255, 0.95)',
  '--latex-sink-sm': 'inset 2px 2px 5px rgba(16, 64, 70, 0.14), inset -2px -2px 5px rgba(255, 255, 255, 0.9)',
  '--latex-press': 'inset 3px 4px 9px rgba(16, 64, 70, 0.18), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
  '--latex-brand': 'linear-gradient(155deg, #0B7D89 0%, #0A6F7A 55%, #075A66 100%)',
  '--latex-brand-lift': '-3px -3px 9px var(--latex-hi), 5px 8px 16px rgba(7, 90, 102, 0.4), ' +
    'inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.12)',
  '--latex-brand-press': 'inset 3px 4px 8px rgba(0, 0, 0, 0.28), inset -2px -2px 6px rgba(255, 255, 255, 0.18)',
};

export const LATEX_VARS_DARK = {
  '--latex-face': 'linear-gradient(155deg, #35373c 0%, #2e3034 52%, #282a2d 100%)',
  '--latex-hi': 'rgba(255, 255, 255, 0.05)',
  '--latex-lo': 'rgba(0, 0, 0, 0.6)',
  '--latex-rim': 'inset 0 1px 1px rgba(255, 255, 255, 0.07), inset 0 -1px 2px rgba(0, 0, 0, 0.3)',
  '--latex-lift': '-5px -5px 14px var(--latex-hi), 6px 8px 18px var(--latex-lo), var(--latex-rim)',
  '--latex-lift-sm': '-3px -3px 8px var(--latex-hi), 3px 5px 10px var(--latex-lo), inset 0 1px 1px rgba(255, 255, 255, 0.07)',
  '--latex-well': '#1e1f21',
  // brand 55% / deep, 22% into the well = #1F3C40; #35C2CF on it: 5.5:1
  '--latex-selected': '#1F3C40',
  '--latex-selected-press': 'inset 2px 3px 7px rgba(0, 0, 0, 0.6), inset -2px -2px 6px rgba(255, 255, 255, 0.05)',
  '--latex-selected-text': '#35C2CF',
  '--latex-sink': 'inset 3px 4px 9px rgba(0, 0, 0, 0.6), inset -3px -3px 8px rgba(255, 255, 255, 0.045)',
  '--latex-sink-sm': 'inset 2px 2px 5px rgba(0, 0, 0, 0.6), inset -2px -2px 5px rgba(255, 255, 255, 0.04)',
  '--latex-press': 'inset 3px 4px 9px rgba(0, 0, 0, 0.65), inset -3px -3px 8px rgba(255, 255, 255, 0.04)',
  // dark type (#0A2226) on it: 5.5:1 at its darkest stop
  '--latex-brand': 'linear-gradient(155deg, #59CDD8 0%, #35C2CF 55%, #2EAAB6 100%)',
  '--latex-brand-lift': '-3px -3px 9px var(--latex-hi), 5px 8px 16px rgba(0, 0, 0, 0.55), ' +
    'inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.18)',
  '--latex-brand-press': 'inset 3px 4px 8px rgba(0, 0, 0, 0.4), inset -2px -2px 6px rgba(255, 255, 255, 0.15)',
};

// Shared pieces for recipes and the shell's panels.
const MOTION = 'box-shadow 0.18s ease, transform 0.12s ease, filter 0.18s ease';
const NO_MOTION = { transition: 'none', _active: { transform: 'none' } };

export const latexRaised = {
  bgImage: 'var(--latex-face)',
  boxShadow: 'var(--latex-lift)',
};

export const latexRaisedSm = {
  bgImage: 'var(--latex-face)',
  boxShadow: 'var(--latex-lift-sm)',
  transition: MOTION,
  _active: { boxShadow: 'var(--latex-press)', transform: 'translateY(1px)' },
  _motionReduce: NO_MOTION,
};

export const latexBrand = {
  bgImage: 'var(--latex-brand)',
  boxShadow: 'var(--latex-brand-lift)',
  transition: MOTION,
  _active: { boxShadow: 'var(--latex-brand-press)', transform: 'translateY(1px)' },
  _motionReduce: NO_MOTION,
};

// The chosen option, one look wherever it is chosen from (cryft.app, Chad 2026-11-22): pressed in, tinted with the
// brand rubber, its words in the brand text colour; hovering never washes over it, a press pushes it further in. The bar
// it sits on is the same in every dark colour theme (Dim, Midnight, Dark), so the look is too.
const SELECTED_EASE = 'background-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease';
export const latexSelected = {
  bg: 'var(--latex-selected)',
  boxShadow: 'var(--latex-selected-press)',
  color: 'var(--latex-selected-text)',
};
export const latexChoosable = {
  transition: SELECTED_EASE,
  _active: { boxShadow: 'var(--latex-press)' },
  _motionReduce: { transition: 'none' },
};

export const latexSunk = {
  bg: 'var(--latex-well)',
  boxShadow: 'var(--latex-sink)',
};

// Hover on the teal: a little lighter, never a different colour (the type on it stays readable).
export const latexBrandHover = { bgImage: 'var(--latex-brand)', filter: 'brightness(1.06)' };

// Type on a teal fill: white on the deep teal (light), dark on the bright teal (dark).
export const ON_BRAND = { _light: 'white', _dark: '#0A2226' };
