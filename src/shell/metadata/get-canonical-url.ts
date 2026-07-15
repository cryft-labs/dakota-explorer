// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';

import config from 'src/config';

import { isIndexableRoute } from './route-indexing';

type QueryValue = string | Array<string> | undefined;

function getQueryValue(query: Route['query'] | undefined, key: string): QueryValue {
  return (query as Record<string, QueryValue> | undefined)?.[key];
}

function encodePathValue(value: QueryValue, catchAll = false) {
  let segments: Array<string>;

  if (Array.isArray(value)) {
    segments = value;
  } else if (!value) {
    segments = [];
  } else {
    segments = catchAll ? value.split('/') : [ value ];
  }

  return segments.map((segment) => encodeURIComponent(segment)).join('/');
}

export default function getCanonicalUrl(pathname: Route['pathname'], query?: Route['query']) {
  if (!isIndexableRoute(pathname)) {
    return;
  }

  let hasMissingParam = false;
  let canonicalPath = pathname
    .replace(/\[\[\.\.\.([^\]]+)\]\]/g, (_match, key: string) => encodePathValue(getQueryValue(query, key), true))
    .replace(/\[\.\.\.([^\]]+)\]/g, (_match, key: string) => {
      const value = getQueryValue(query, key);
      if (!value || (Array.isArray(value) && value.length === 0)) {
        hasMissingParam = true;
        return '';
      }
      return encodePathValue(value, true);
    })
    .replace(/\[([^\]]+)\]/g, (_match, key: string) => {
      const value = getQueryValue(query, key);
      if (!value || (Array.isArray(value) && value.length === 0)) {
        hasMissingParam = true;
        return '';
      }
      return encodePathValue(Array.isArray(value) ? value.slice(0, 1) : value);
    })
    .replace(/\/{2,}/g, '/');

  if (hasMissingParam) {
    return;
  }

  if (canonicalPath.length > 1) {
    canonicalPath = canonicalPath.replace(/\/$/, '');
  }

  return config.app.baseUrl.replace(/\/$/, '') + canonicalPath;
}
