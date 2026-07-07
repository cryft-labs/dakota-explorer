// SPDX-License-Identifier: LicenseRef-Blockscout

import Cookies from 'js-cookie';

import config from 'src/config';

import { isBrowser } from 'src/toolkit/utils/isBrowser';

export type DakotaSharedThemeMode = 'light' | 'dark';

export const DAKOTA_SHARED_THEME_MODE_KEY = 'dakota.themeMode.v1';
export const DAKOTA_SHARED_STATE_CHANNEL = 'dakota.sharedState.v1';
export const DAKOTA_SHARED_STATE_EVENT = 'dakota-shared-state-change';

const DAKOTA_SHARED_COOKIE_MAX_AGE_DAYS = 365;
const DAKOTA_SHARED_STATE_POLL_INTERVAL_MS = 750;

/**
 * All cookie names that can be used in the application.
 */
export enum NAMES {
  NAV_BAR_COLLAPSED = 'nav_bar_collapsed',
  API_TOKEN = '_explorer_key',
  API_TEMP_TOKEN = 'api_temp_token',
  REWARDS_API_TOKEN = 'rewards_api_token',
  REWARDS_REFERRAL_CODE = 'rewards_ref_code',
  TXS_SORT = 'txs_sort',
  COLOR_MODE = 'chakra-ui-color-mode',
  COLOR_THEME = 'chakra-ui-color-theme',
  DAKOTA_SHARED_THEME_MODE = 'dakota_theme_mode',
  ADDRESS_IDENTICON_TYPE = 'address_identicon_type',
  ADDRESS_FORMAT = 'address_format',
  TIME_FORMAT = 'time_format',
  LOCAL_TIME = 'local_time',
  INDEXING_ALERT = 'indexing_alert',
  ADBLOCK_DETECTED = 'adblock_detected',
  MIXPANEL_DEBUG = '_mixpanel_debug',
  ADDRESS_NFT_DISPLAY_TYPE = 'address_nft_display_type',
  HIDE_ADD_TO_WALLET_BUTTON = 'hide_add_to_wallet_button',
  UUID = 'uuid',
  SHOW_SCAM_TOKENS = 'show_scam_tokens',
  SHOW_POOR_REPUTATION_TOKENS = 'show_poor_reputation_tokens',
  APP_PROFILE = 'app_profile',
  TABLE_VIEW_ON_MOBILE = 'table_view_on_mobile',
}

/**
 * Cookies that are disallowed in private mode.
 * These cookies should not be set when app profile is 'private'.
 */
export const PRIVATE_MODE_DISALLOWED: ReadonlyArray<NAMES> = [
  NAMES.UUID,
  NAMES.ADBLOCK_DETECTED,
  NAMES.MIXPANEL_DEBUG,
];

export const getDefaultAttributes = () => ({
  path: '/',
  secure: config.app.protocol === 'https',
});

function shouldUseDakotaCookieDomain(hostname: string): boolean {
  return hostname === 'dakota.cards' || hostname.endsWith('.dakota.cards');
}

function getDakotaSharedThemeAttributes(): Cookies.CookieAttributes {
  const hostname = isBrowser() ? window.location.hostname.toLowerCase() : (config.app.host ?? '').toLowerCase();
  const secure = isBrowser() ? window.location.protocol === 'https:' : config.app.protocol === 'https';

  return {
    path: '/',
    sameSite: 'lax',
    expires: DAKOTA_SHARED_COOKIE_MAX_AGE_DAYS,
    secure,
    ...(shouldUseDakotaCookieDomain(hostname) ? { domain: '.dakota.cards' } : {}),
  };
}

export function normalizeDakotaSharedThemeMode(value: unknown): DakotaSharedThemeMode | undefined {
  return value === 'dark' || value === 'light' ? value : undefined;
}

export function getDakotaSharedThemeMode(serverCookie?: string): DakotaSharedThemeMode | undefined {
  const cookieMode = normalizeDakotaSharedThemeMode(get(NAMES.DAKOTA_SHARED_THEME_MODE, serverCookie));

  if (cookieMode) {
    return cookieMode;
  }

  if (!isBrowser()) {
    return undefined;
  }

  try {
    return normalizeDakotaSharedThemeMode(window.localStorage.getItem(DAKOTA_SHARED_THEME_MODE_KEY));
  } catch {}

  return undefined;
}

function publishDakotaSharedThemeChange(mode: DakotaSharedThemeMode) {
  if (!isBrowser()) {
    return;
  }

  const detail = { topic: 'theme', value: mode };
  window.dispatchEvent(new CustomEvent(DAKOTA_SHARED_STATE_EVENT, { detail }));

  try {
    const channel = new BroadcastChannel(DAKOTA_SHARED_STATE_CHANNEL);
    channel.postMessage(detail);
    channel.close();
  } catch {}
}

export function setDakotaSharedThemeMode(mode: DakotaSharedThemeMode) {
  if (!isBrowser()) {
    return;
  }

  const normalizedMode = normalizeDakotaSharedThemeMode(mode);

  if (!normalizedMode) {
    return;
  }

  set(NAMES.DAKOTA_SHARED_THEME_MODE, normalizedMode, getDakotaSharedThemeAttributes());

  try {
    window.localStorage.setItem(DAKOTA_SHARED_THEME_MODE_KEY, normalizedMode);
  } catch {}

  publishDakotaSharedThemeChange(normalizedMode);
}

export function subscribeDakotaSharedThemeMode(onChange: (mode: DakotaSharedThemeMode) => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  let currentMode = getDakotaSharedThemeMode();

  const notifyIfChanged = () => {
    const nextMode = getDakotaSharedThemeMode();

    if (nextMode && nextMode !== currentMode) {
      currentMode = nextMode;
      onChange(nextMode);
    }
  };

  const handleSharedStateEvent = (event: Event) => {
    const detail = (event as CustomEvent<{ topic?: string }>).detail;

    if (detail?.topic === 'theme') {
      notifyIfChanged();
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === DAKOTA_SHARED_THEME_MODE_KEY || event.key === null) {
      notifyIfChanged();
    }
  };

  let channel: BroadcastChannel | undefined;

  try {
    channel = new BroadcastChannel(DAKOTA_SHARED_STATE_CHANNEL);
    channel.addEventListener('message', (event) => {
      if (event.data?.topic === 'theme') {
        notifyIfChanged();
      }
    });
  } catch {}

  window.addEventListener(DAKOTA_SHARED_STATE_EVENT, handleSharedStateEvent);
  window.addEventListener('storage', handleStorageEvent);

  const interval = window.setInterval(notifyIfChanged, DAKOTA_SHARED_STATE_POLL_INTERVAL_MS);

  return () => {
    window.removeEventListener(DAKOTA_SHARED_STATE_EVENT, handleSharedStateEvent);
    window.removeEventListener('storage', handleStorageEvent);
    window.clearInterval(interval);
    channel?.close();
  };
}

export function get(name?: NAMES | undefined | null, serverCookie?: string) {
  if (!isBrowser()) {
    return serverCookie ? getFromCookieString(serverCookie, name) : undefined;
  }

  if (name) {
    return Cookies.get(name);
  }
}

/**
 * Checks if a cookie is disallowed in private mode.
 */
function isDisallowedInPrivateMode(name: NAMES): boolean {
  return PRIVATE_MODE_DISALLOWED.includes(name);
}

/**
 * Checks if the app is currently in private mode by reading the APP_PROFILE cookie.
 */
export function isPrivateMode(serverCookie?: string): boolean {
  const appProfile = get(NAMES.APP_PROFILE, serverCookie);
  return appProfile === 'private';
}

export function set(name: NAMES, value: string, attributes: Cookies.CookieAttributes = {}, serverCookie?: string) {
  // Check if we're in private mode and this cookie is disallowed
  if (isPrivateMode(serverCookie) && isDisallowedInPrivateMode(name)) {
    // Don't set the cookie in private mode
    return;
  }

  return Cookies.set(name, value, { ...getDefaultAttributes(), ...attributes });
}

export function remove(name: NAMES, attributes: Cookies.CookieAttributes = {}) {
  return Cookies.remove(name, { ...getDefaultAttributes(), ...attributes });
}

export function getFromCookieString(cookieString: string, name?: NAMES | undefined | null) {
  if (!name) {
    return undefined;
  }

  const escapedName = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = cookieString.match(new RegExp(`(?:^|;\\s*)${ escapedName }=([^;]*)`));

  if (!match) {
    return undefined;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
