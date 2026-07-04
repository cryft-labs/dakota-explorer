// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ColorMode } from 'src/toolkit/chakra/color-mode';

export const COLOR_THEME_IDS = [ 'light', 'dim', 'midnight', 'dark' ] as const;
export type ColorThemeId = typeof COLOR_THEME_IDS[number];

export interface ColorTheme {
  id: ColorThemeId;
  label: string;
  colorMode: ColorMode;
  hex: string;
  sampleBg: string;
}

export const COLOR_THEMES: Array<ColorTheme> = [
  {
    id: 'light',
    label: 'Light',
    colorMode: 'light',
    hex: '#F6FBFC',
    sampleBg: 'linear-gradient(154deg, #F6FBFC 48%, #E6F7F3 100%)',
  },
  {
    id: 'dim',
    label: 'Dim',
    colorMode: 'dark',
    hex: '#102621',
    sampleBg: 'linear-gradient(152deg, #102621 48%, #113B32 100%)',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    colorMode: 'dark',
    hex: '#071A17',
    sampleBg: 'linear-gradient(148deg, #071A17 45%, #0F766E 140%)',
  },
  {
    id: 'dark',
    label: 'Dark',
    colorMode: 'dark',
    hex: '#061411',
    sampleBg: 'linear-gradient(161deg, #061411 9.37%, #102621 92.52%)',
  },
];
