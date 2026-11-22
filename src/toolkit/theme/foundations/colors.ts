// SPDX-License-Identifier: LicenseRef-Blockscout

import { defaultsDeep } from 'es-toolkit/compat';

import config from 'src/config';

const DEFAULT_THEME_COLORS = {
  bg: {
    primary: {
      // for some reason links to colors.white and colors.black variables are not working here
      // so we use hex values instead
      // but it is not the case for other colors
      _light: { value: '#F6FBFC' },
      _dark: { value: '#222222' },
    },
  },
  text: {
    primary: {
      _light: { value: '#2A3547' },
      _dark: { value: '#E2E8F0' },
    },
    secondary: {
      _light: { value: '#5A6A85' },
      _dark: { value: '#94A3B8' },
    },
  },
  hover: {
    _light: { value: '#075A66' },
    _dark: { value: '#6FD6DF' },
  },
  selected: {
    control: {
      text: {
        _light: { value: '#075A66' },
        _dark: { value: '#FFFFFF' },
      },
      bg: {
        _light: { value: '#E2F4F6' },
        _dark: { value: '#26444A' },
      },
    },
    option: {
      bg: {
        _light: { value: '#0B7D89' },
        _dark: { value: '#35C2CF' },
      },
    },
  },
  icon: {
    primary: {
      _light: { value: '#5A6A85' },
      _dark: { value: '#94A3B8' },
    },
    secondary: {
      _light: { value: '#8BA1AE' },
      _dark: { value: '#64748B' },
    },
  },
  button: {
    primary: {
      _light: { value: '#0B7D89' },
      _dark: { value: '#35C2CF' },
      text: {
        // Cryft Cards: white type on the teal (4.9:1), dark type on the bright teal (8.1:1)
        _light: { value: '{colors.white}' },
        _dark: { value: '#0A2226' },
      },
    },
  },
  link: {
    primary: {
      _light: { value: '#0B7D89' },
      _dark: { value: '#35C2CF' },
    },
  },
  graph: {
    line: {
      _light: { value: '#0B7D89' },
      _dark: { value: '#35C2CF' },
    },
    gradient: {
      start: {
        _light: { value: 'rgba(11, 125, 137, 0.24)' },
        _dark: { value: 'rgba(53, 194, 207, 0.22)' },
      },
      stop: {
        _light: { value: 'rgba(11, 125, 137, 0)' },
        _dark: { value: 'rgba(53, 194, 207, 0)' },
      },
    },
  },
  navigation: {
    bg: {
      selected: {
        _light: { value: '#E2F4F6' },
        _dark: { value: '#26444A' },
      },
    },
    text: {
      selected: {
        _light: { value: '#075A66' },
        _dark: { value: '#FFFFFF' },
      },
    },
  },
  stats: {
    bg: {
      _light: { value: '#FFFFFF' },
      _dark: { value: '#2F3136' },
    },
  },
  topbar: {
    bg: {
      _light: { value: 'rgba(255, 255, 255, 0.82)' },
      _dark: { value: 'rgba(47, 49, 54, 0.82)' },
    },
  },
  tabs: {
    text: {
      primary: {
        _light: { value: '#0B7D89' },
        _dark: { value: '#FFFFFF' },
      },
    },
  },
};

const colors = {
  // BASE COLORS
  green: {
    '50': { value: '#F0FFF4' },
    '100': { value: '#C6F6D5' },
    '200': { value: '#9AE6B4' },
    '300': { value: '#68D391' },
    '400': { value: '#48BB78' },
    '500': { value: '#38A169' },
    '600': { value: '#25855A' },
    '700': { value: '#276749' },
    '800': { value: '#22543D' },
    '900': { value: '#1C4532' },
  },
  blue: {
    '50': { value: '#EBF8FF' },
    '100': { value: '#BEE3F8' },
    '200': { value: '#90CDF4' },
    '300': { value: '#63B3ED' },
    '400': { value: '#4299E1' },
    '500': { value: '#3182CE' },
    '600': { value: '#2B6CB0' },
    '700': { value: '#2C5282' },
    '800': { value: '#2A4365' },
    '900': { value: '#1A365D' },
  },
  red: {
    '50': { value: '#FFF5F5' },
    '100': { value: '#FED7D7' },
    '200': { value: '#FEB2B2' },
    '300': { value: '#FC8181' },
    '400': { value: '#F56565' },
    '500': { value: '#E53E3E' },
    '600': { value: '#C53030' },
    '700': { value: '#9B2C2C' },
    '800': { value: '#822727' },
    '900': { value: '#63171B' },
  },
  orange: {
    '50': { value: '#FFFAF0' },
    '100': { value: '#FEEBCB' },
    '200': { value: '#FBD38D' },
    '300': { value: '#F6AD55' },
    '400': { value: '#ED8936' },
    '500': { value: '#DD6B20' },
    '600': { value: '#C05621' },
    '700': { value: '#9C4221' },
    '800': { value: '#7B341E' },
    '900': { value: '#652B19' },
  },
  yellow: {
    '50': { value: '#FFFFF0' },
    '100': { value: '#FEFCBF' },
    '200': { value: '#FAF089' },
    '300': { value: '#F6E05E' },
    '400': { value: '#ECC94B' },
    '500': { value: '#D69E2E' },
    '600': { value: '#B7791F' },
    '700': { value: '#975A16' },
    '800': { value: '#744210' },
    '900': { value: '#5F370E' },
  },
  gray: {
    '50': { value: '#F7FAFC' },
    '100': { value: '#EDF2F7' },
    '200': { value: '#E2E8F0' },
    '300': { value: '#CBD5E0' },
    '400': { value: '#A0AEC0' },
    '500': { value: '#718096' },
    '600': { value: '#4A5568' },
    '700': { value: '#2D3748' },
    '800': { value: '#1A202C' },
    '900': { value: '#171923' },
  },
  teal: {
    '50': { value: '#E6FFFA' },
    '100': { value: '#B2F5EA' },
    '200': { value: '#81E6D9' },
    '300': { value: '#4FD1C5' },
    '400': { value: '#38B2AC' },
    '500': { value: '#319795' },
    '600': { value: '#2C7A7B' },
    '700': { value: '#285E61' },
    '800': { value: '#234E52' },
    '900': { value: '#1D4044' },
  },
  cyan: {
    '50': { value: '#EDFDFD' },
    '100': { value: '#C4F1F9' },
    '200': { value: '#9DECF9' },
    '300': { value: '#76E4F7' },
    '400': { value: '#0BC5EA' },
    '500': { value: '#00B5D8' },
    '600': { value: '#00A3C4' },
    '700': { value: '#0987A0' },
    '800': { value: '#086F83' },
    '900': { value: '#065666' },
  },
  purple: {
    '50': { value: '#FAF5FF' },
    '100': { value: '#E9D8FD' },
    '200': { value: '#D6BCFA' },
    '300': { value: '#B794F4' },
    '400': { value: '#9F7AEA' },
    '500': { value: '#805AD5' },
    '600': { value: '#6B46C1' },
    '700': { value: '#553C9A' },
    '800': { value: '#44337A' },
    '900': { value: '#322659' },
  },
  pink: {
    '50': { value: '#FFF5F7' },
    '100': { value: '#FED7E2' },
    '200': { value: '#FBB6CE' },
    '300': { value: '#F687B3' },
    '400': { value: '#ED64A6' },
    '500': { value: '#D53F8C' },
    '600': { value: '#B83280' },
    '700': { value: '#97266D' },
    '800': { value: '#702459' },
    '900': { value: '#521B41' },
  },
  black: { value: '#101112' },
  white: { value: '#ffffff' },
  whiteAlpha: {
    '50': { value: 'RGBA(255, 255, 255, 0.04)' },
    '100': { value: 'RGBA(255, 255, 255, 0.06)' },
    '200': { value: 'RGBA(255, 255, 255, 0.08)' },
    '300': { value: 'RGBA(255, 255, 255, 0.16)' },
    '400': { value: 'RGBA(255, 255, 255, 0.24)' },
    '500': { value: 'RGBA(255, 255, 255, 0.36)' },
    '600': { value: 'RGBA(255, 255, 255, 0.48)' },
    '700': { value: 'RGBA(255, 255, 255, 0.64)' },
    '800': { value: 'RGBA(255, 255, 255, 0.80)' },
    '900': { value: 'RGBA(255, 255, 255, 0.92)' },
  },
  blackAlpha: {
    '50': { value: 'RGBA(16, 17, 18, 0.04)' },
    '100': { value: 'RGBA(16, 17, 18, 0.06)' },
    '200': { value: 'RGBA(16, 17, 18, 0.08)' },
    '300': { value: 'RGBA(16, 17, 18, 0.16)' },
    '400': { value: 'RGBA(16, 17, 18, 0.24)' },
    '500': { value: 'RGBA(16, 17, 18, 0.36)' },
    '600': { value: 'RGBA(16, 17, 18, 0.48)' },
    '700': { value: 'RGBA(16, 17, 18, 0.64)' },
    '800': { value: 'RGBA(16, 17, 18, 0.80)' },
    '900': { value: 'RGBA(16, 17, 18, 0.92)' },
  },

  // BRAND COLORS
  github: { value: '#171923' },
  telegram: { value: '#2775CA' },
  linkedin: { value: '#1564BA' },
  discord: { value: '#9747FF' },
  slack: { value: '#1BA27A' },
  twitter: { value: '#000000' },
  opensea: { value: '#2081E2' },
  facebook: { value: '#4460A0' },
  medium: { value: '#231F20' },
  reddit: { value: '#FF4500' },
  celo: { value: '#FCFF52' },
  clusters: { value: '#DE6061' },

  // THEME COLORS
  theme: defaultsDeep(config.shell.topBar.colorTheme.overrides, DEFAULT_THEME_COLORS),
};

export default colors;
