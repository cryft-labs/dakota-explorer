// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import * as cookies from 'src/shared/storage/cookies';

import type { ColorMode } from 'src/toolkit/chakra/color-mode';
import { useColorMode } from 'src/toolkit/chakra/color-mode';

import SettingsSample from '../SettingsSample';
import type { ColorThemeId } from './config';
import { COLOR_THEMES } from './config';
import { getDefaultColorTheme, getThemeHexWithOverrides } from './utils';

interface Props {
  onSelect?: () => void;
}

const DAKOTA_SHARED_THEME_IDS: Record<ColorMode, ColorThemeId> = {
  light: 'light',
  dark: 'midnight',
};

const SettingsColorTheme = ({ onSelect }: Props) => {
  const { setColorMode } = useColorMode();

  const [ activeThemeId, setActiveThemeId ] = React.useState<ColorThemeId>();

  const setTheme = React.useCallback((themeId: ColorThemeId) => {
    const nextTheme = COLOR_THEMES.find((theme) => theme.id === themeId);
    const varValue = getThemeHexWithOverrides(themeId);

    if (!nextTheme || !varValue) {
      return;
    }

    setColorMode(nextTheme.colorMode);

    const varName = nextTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    const varNameBg = nextTheme.colorMode === 'light' ? '--chakra-colors-theme-bg-primary-_light' : '--chakra-colors-theme-bg-primary-_dark';
    window.document.documentElement.style.setProperty(varName, varValue);
    window.document.documentElement.style.setProperty(varNameBg, varValue);

    cookies.set(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
    cookies.set(cookies.NAMES.COLOR_THEME, themeId);
    window.localStorage.setItem(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
    cookies.setDakotaSharedThemeMode(nextTheme.colorMode);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const sharedColorMode = cookies.getDakotaSharedThemeMode() as ColorMode | undefined;
    const cookieColorMode = cookies.get(cookies.NAMES.COLOR_MODE) as ColorMode | undefined;
    const cookieColorTheme = cookies.get(cookies.NAMES.COLOR_THEME) as ColorThemeId | undefined;

    const nextColorMode = (() => {
      if (sharedColorMode) {
        return sharedColorMode;
      }

      if (!cookieColorMode) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      return cookieColorMode;
    })();

    const cookieThemeIsValid = Boolean(
      cookieColorTheme && COLOR_THEMES.some((theme) => theme.id === cookieColorTheme && theme.colorMode === nextColorMode),
    );

    let nextColorTheme = getDefaultColorTheme(nextColorMode);

    if (sharedColorMode) {
      nextColorTheme = DAKOTA_SHARED_THEME_IDS[sharedColorMode];
    } else if (cookieThemeIsValid && cookieColorTheme) {
      nextColorTheme = cookieColorTheme;
    }

    setTheme(nextColorTheme);
    setActiveThemeId(nextColorTheme);
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const themeId = event.currentTarget.getAttribute('data-value') as ColorThemeId | null;

    if (!themeId) {
      return;
    }

    setTheme(themeId);
    setActiveThemeId(themeId);
    onSelect?.();
  }, [ setTheme, onSelect ]);

  const activeTheme = COLOR_THEMES.find((theme) => theme.id === activeThemeId);

  return (
    <div>
      <Box fontWeight={ 600 }>Color theme</Box>
      <Box color="text.secondary" mt={ 1 } mb={ 2 }>{ activeTheme?.label }</Box>
      <Flex>
        { COLOR_THEMES.map((theme) => {
          return (
            <SettingsSample
              key={ theme.label }
              label={ theme.label }
              value={ theme.id }
              bg={ theme.sampleBg }
              isActive={ theme.id === activeThemeId }
              onClick={ handleSelect }
            />
          );
        }) }
      </Flex>
    </div>
  );
};

export default React.memo(SettingsColorTheme);
