// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

import appConfig from 'src/config';
import * as cookiesLib from 'src/shared/storage/cookies';

export default function colorThemeMiddleware(req: NextRequest, res: NextResponse) {
  const colorModeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_MODE);
  const colorThemeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_THEME);
  const cryftSharedColorMode = cookiesLib.getCryftSharedThemeMode(req.headers.get('cookie') ?? undefined);

  if (!appConfig.shell.topBar.colorTheme.default) {
    return;
  }

  const defaultColorMode = cryftSharedColorMode || appConfig.shell.topBar.colorTheme.default.colorMode;
  let defaultColorTheme = appConfig.shell.topBar.colorTheme.default.id;

  if (cryftSharedColorMode) {
    defaultColorTheme = cryftSharedColorMode === 'dark' ? 'midnight' : 'light';
  }

  if (!colorModeCookie || (cryftSharedColorMode && colorModeCookie.value !== cryftSharedColorMode)) {
    res.cookies.set(cookiesLib.NAMES.COLOR_MODE, defaultColorMode, cookiesLib.getDefaultAttributes());
  }

  if (!colorThemeCookie || (cryftSharedColorMode && colorThemeCookie.value !== defaultColorTheme)) {
    res.cookies.set(cookiesLib.NAMES.COLOR_THEME, defaultColorTheme, cookiesLib.getDefaultAttributes());
  }
}
