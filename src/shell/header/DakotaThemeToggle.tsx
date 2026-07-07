// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

import { COLOR_THEMES, type ColorThemeId } from 'src/shell/top-bar/settings/color-theme/config';
import { getThemeHexWithOverrides } from 'src/shell/top-bar/settings/color-theme/utils';

import * as cookies from 'src/shared/storage/cookies';

import { Button } from 'src/toolkit/chakra/button';
import type { ColorMode } from 'src/toolkit/chakra/color-mode';
import { useColorMode } from 'src/toolkit/chakra/color-mode';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

type Props = {
  className?: string;
  mode?: 'icon' | 'button';
};

const DAKOTA_LIGHT_THEME_ID: ColorThemeId = 'light';
const DAKOTA_DARK_THEME_ID: ColorThemeId = 'midnight';

function getDakotaThemeId(colorMode: ColorMode): ColorThemeId {
  return colorMode === 'light' ? DAKOTA_LIGHT_THEME_ID : DAKOTA_DARK_THEME_ID;
}

function applyThemeVariables(colorMode: ColorMode, themeId: ColorThemeId) {
  const varValue = getThemeHexWithOverrides(themeId);

  if (!varValue) {
    return;
  }

  const varName = colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
  const varNameBg = colorMode === 'light' ? '--chakra-colors-theme-bg-primary-_light' : '--chakra-colors-theme-bg-primary-_dark';

  window.document.documentElement.style.setProperty(varName, varValue);
  window.document.documentElement.style.setProperty(varNameBg, varValue);
}

const DakotaThemeToggle = ({ className, mode = 'icon' }: Props) => {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const nextColorMode: ColorMode = isDark ? 'light' : 'dark';
  const ThemeIcon = isDark ? LuSun : LuMoon;
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const buttonText = isDark ? 'Light Mode' : 'Dark Mode';

  const syncThemeMode = React.useCallback((nextMode: ColorMode) => {
    const syncedThemeId = getDakotaThemeId(nextMode);

    setColorMode(nextMode);
    applyThemeVariables(nextMode, syncedThemeId);
    cookies.set(cookies.NAMES.COLOR_MODE, nextMode);
    cookies.set(cookies.NAMES.COLOR_THEME, syncedThemeId);
    window.localStorage.setItem(cookies.NAMES.COLOR_MODE, nextMode);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const sharedColorMode = cookies.getDakotaSharedThemeMode();

    if (sharedColorMode) {
      syncThemeMode(sharedColorMode);
      return cookies.subscribeDakotaSharedThemeMode(syncThemeMode);
    }

    const cookieColorMode = cookies.get(cookies.NAMES.COLOR_MODE) as ColorMode | undefined;
    const cookieColorTheme = cookies.get(cookies.NAMES.COLOR_THEME) as ColorThemeId | undefined;
    const initialColorMode = cookieColorMode || colorMode;
    const cookieThemeIsValid = Boolean(
      cookieColorTheme && COLOR_THEMES.some((theme) => theme.id === cookieColorTheme && theme.colorMode === initialColorMode),
    );
    const initialThemeId = cookieThemeIsValid && cookieColorTheme ? cookieColorTheme : getDakotaThemeId(initialColorMode);

    applyThemeVariables(initialColorMode, initialThemeId);

    return cookies.subscribeDakotaSharedThemeMode(syncThemeMode);
  }, [ colorMode, syncThemeMode ]);

  const handleClick = React.useCallback(() => {
    syncThemeMode(nextColorMode);
    cookies.setDakotaSharedThemeMode(nextColorMode);
  }, [ nextColorMode, syncThemeMode ]);

  const icon = <ThemeIcon size={ 20 } strokeWidth={ 2.15 }/>;

  if (mode === 'button') {
    return (
      <Tooltip content="Click to switch themes." disableOnMobile>
        <Button
          className={ className }
          aria-label={ label }
          onClick={ handleClick }
          variant="outline"
          h="48px"
          w="100%"
          px="14px"
          justifyContent="flex-start"
          gap="10px"
          borderRadius="base"
          borderColor="border.divider"
          bg="transparent"
          color="text.primary"
          fontSize="16px"
          fontWeight={ 600 }
          _hover={{
            bg: 'hover',
            color: 'white',
          }}
        >
          { icon }
          <Box as="span">{ buttonText }</Box>
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip content="Click to switch themes." disableOnMobile>
      <IconButton
        className={ className }
        aria-label={ label }
        onClick={ handleClick }
        size="md"
        boxSize="40px"
        minW="40px"
        h="40px"
        w="40px"
        borderRadius="full"
        color="text.secondary"
        bg="button.icon_background.bg"
        transition="all 0.3s ease"
        boxShadow="none"
        _hover={{
          bg: 'hover',
          color: 'white',
          boxShadow: '0 10px 28px rgba(52, 211, 153, 0.26)',
          transform: 'rotate(18deg)',
        }}
      >
        { icon }
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(DakotaThemeToggle);
