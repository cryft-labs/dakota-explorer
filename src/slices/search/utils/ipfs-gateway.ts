// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'src/config/utils/envs';

import * as regexp from 'src/toolkit/utils/regexp';

const IPFS_GATEWAY_ENV_NAMES = [
  'NEXT_PUBLIC_IPFS_GATEWAY',
  'NEXT_PUBLIC_IPFS_GATEWAY_URL',
];

const DAKOTA_IPFS_GATEWAY_DEFAULT = 'https://cryft.network/ipfs/';

// Keep CID matching intentionally strict enough that regular explorer searches
// do not get mistaken for IPFS content.
const CID_V0_REGEXP = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
const CID_V1_BASE32_REGEXP = /^b[a-z2-7]{20,}$/i;
const CID_V1_BASE36_REGEXP = /^k[0-9a-z]{20,}$/i;
const CID_V1_BASE58BTC_REGEXP = /^z[1-9A-HJ-NP-Za-km-z]{20,}$/;

function getIpfsGatewayBaseUrl() {
  const runtimeGateway = IPFS_GATEWAY_ENV_NAMES
    .map((envName) => getEnvValue(envName)?.trim())
    .find(Boolean);
  const gateway = runtimeGateway || DAKOTA_IPFS_GATEWAY_DEFAULT;

  return gateway && regexp.URL_PREFIX.test(gateway) ? gateway.replace(/\/+$/, '') : undefined;
}

function safeDecodeUriComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

function isIpfsCid(value: string) {
  return CID_V0_REGEXP.test(value) ||
    CID_V1_BASE32_REGEXP.test(value) ||
    CID_V1_BASE36_REGEXP.test(value) ||
    CID_V1_BASE58BTC_REGEXP.test(value);
}

function extractIpfsPath(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return;
  }

  if (regexp.IPFS_PREFIX.test(trimmed)) {
    return trimmed.replace(regexp.IPFS_PREFIX, '');
  }

  if (/^\/?ipfs\//i.test(trimmed)) {
    return trimmed.replace(/^\/?ipfs\//i, '');
  }

  try {
    const url = new URL(trimmed);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const ipfsSegmentIndex = pathSegments.findIndex((segment) => segment.toLowerCase() === 'ipfs');

    if (ipfsSegmentIndex >= 0) {
      return pathSegments.slice(ipfsSegmentIndex + 1).join('/');
    }
  } catch (error) {
    return trimmed;
  }

  return trimmed;
}

function normalizeIpfsPath(value: string) {
  const cleanValue = value.split(/[?#]/)[0]?.replace(/^\/+/, '').replace(/\/+$/, '');

  if (!cleanValue) {
    return;
  }

  const [ cidCandidate, ...pathSegments ] = cleanValue.split('/').filter(Boolean);

  if (!cidCandidate || !isIpfsCid(cidCandidate)) {
    return;
  }

  const normalizedPathSegments = pathSegments.map((segment) => encodeURIComponent(safeDecodeUriComponent(segment)));

  return [ cidCandidate, ...normalizedPathSegments ].join('/');
}

export function getIpfsGatewaySearchUrl(searchTerm: string) {
  const gatewayBaseUrl = getIpfsGatewayBaseUrl();

  if (!gatewayBaseUrl) {
    return;
  }

  const ipfsPath = normalizeIpfsPath(extractIpfsPath(searchTerm) ?? '');

  if (!ipfsPath) {
    return;
  }

  const gatewayPath = new URL(gatewayBaseUrl).pathname.replace(/\/+$/, '').toLowerCase();
  const ipfsRoutePrefix = gatewayPath.endsWith('/ipfs') ? '' : '/ipfs';

  return `${ gatewayBaseUrl }${ ipfsRoutePrefix }/${ ipfsPath }`;
}

export function openIpfsGatewayFromSearch(searchTerm: string) {
  const gatewayUrl = getIpfsGatewaySearchUrl(searchTerm);

  if (!gatewayUrl || typeof window === 'undefined') {
    return;
  }

  window.open(gatewayUrl, '_blank', 'noopener,noreferrer');

  return gatewayUrl;
}
