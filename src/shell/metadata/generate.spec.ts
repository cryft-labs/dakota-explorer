import { hash as addressHash } from 'src/slices/address/mocks/address-param';
import { base as transaction } from 'src/slices/tx/mocks/details';

import { it, describe, expect } from 'vitest';

import generate from './generate';

it('static route', () => {
  const result = generate({ pathname: '/txs' });
  expect(result).toMatchSnapshot();
});

it('dynamic route', () => {
  const result = generate({ pathname: '/tx/[hash]', query: { hash: transaction.hash } });
  expect(result).toMatchSnapshot();
});

describe('address route', () => {
  it('enhanced data', () => {
    const result = generate({ pathname: '/address/[hash]', query: { hash: addressHash } }, { domain_name: 'duck.eth' });
    expect(result).toMatchSnapshot();
  });

  it('no enhanced data', () => {
    const result = generate({ pathname: '/address/[hash]', query: { hash: addressHash } });
    expect(result).toMatchSnapshot();
  });
});

describe('stats details route', () => {
  it('enhanced data', () => {
    const result = generate(
      { pathname: '/stats/[id]', query: { id: 'accountsGrowth' } },
      { id: 'accountsGrowth', title: 'Number of accounts', description: 'Cumulative account growth over time', resolutions: [] },
    );
    expect(result).toMatchSnapshot();
  });

  it('no enhanced data', () => {
    const result = generate({ pathname: '/stats/[id]', query: { id: 'accountsGrowth' } });
    expect(result).toMatchSnapshot();
  });
});

describe('crawler metadata', () => {
  it('publishes Dakota homepage schema and IPFS CID copy', () => {
    const result = generate({ pathname: '/' });

    expect(result.description).toContain('IPFS CIDs');
    expect(result.robots).toBe('index,follow');
    expect(result.canonical).toBe('http://localhost:3000/');
    expect(result.jsonLd).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Dakota Cards Explorer',
      url: 'http://localhost:3000',
    });
  });

  it('builds a canonical URL for a dynamic route', () => {
    const result = generate({ pathname: '/tx/[hash]', query: { hash: transaction.hash } });

    expect(result.canonical).toBe(`http://localhost:3000/tx/${ transaction.hash }`);
  });

  it('drops tab query parameters from address canonicals', () => {
    const result = generate({
      pathname: '/address/[hash]',
      query: { hash: addressHash, tab: 'contract' },
    });

    expect(result.canonical).toBe(`http://localhost:3000/address/${ addressHash }`);
  });

  it('prevents search and account utility pages from being indexed', () => {
    const searchResult = generate({ pathname: '/search-results', query: { q: 'latest block' } });
    const accountResult = generate({ pathname: '/account/watchlist' });

    expect(searchResult.canonical).toBeUndefined();
    expect(searchResult.robots).toBe('noindex,follow');
    expect(accountResult.canonical).toBeUndefined();
    expect(accountResult.robots).toBe('noindex,nofollow');
  });
});
