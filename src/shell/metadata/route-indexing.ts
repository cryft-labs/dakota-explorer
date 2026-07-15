// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';

import type { RobotsDirective } from './types';

const NON_INDEXABLE_ROUTES = new Set<Route['pathname']>([
  '/404',
  '/auth/profile',
  '/chakra',
  '/login',
  '/search-results',
  '/sprite',
]);

export function isIndexableRoute(pathname: Route['pathname']) {
  return !NON_INDEXABLE_ROUTES.has(pathname) && !pathname.startsWith('/account/');
}

export function getRobotsDirective(pathname: Route['pathname']): RobotsDirective {
  if (pathname === '/search-results') {
    return 'noindex,follow';
  }

  return isIndexableRoute(pathname) ? 'index,follow' : 'noindex,nofollow';
}
