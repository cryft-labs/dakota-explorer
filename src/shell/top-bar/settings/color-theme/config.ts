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
    sampleBg: 'linear-gradient(154deg, #F6FBFC 48%, #E2F4F6 100%)',
  },
  {
    id: 'dim',
    label: 'Dim',
    colorMode: 'dark',
    hex: '#2F3136',
    sampleBg: 'linear-gradient(152deg, #2F3136 48%, #26444A 100%)',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    colorMode: 'dark',
    hex: '#222222',
    sampleBg: 'linear-gradient(148deg, #222222 45%, #0B7D89 140%)',
  },
  {
    id: 'dark',
    label: 'Dark',
    colorMode: 'dark',
    hex: '#1A1A1A',
    sampleBg: 'linear-gradient(161deg, #1A1A1A 9.37%, #2F3136 92.52%)',
  },
];
