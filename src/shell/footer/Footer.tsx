// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, VStack, HStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from './types';

import useApiQuery from 'src/api/hooks/useApiQuery';
import useFetch from 'src/api/hooks/useFetch';
import type { ResourceError } from 'src/api/resources';

import { useAppContext } from 'src/shell/app/context';
import { CONTENT_MAX_WIDTH } from 'src/shell/layout/utils';

import IndexingStatusInternalTxs from 'src/slices/chain/indexing-status/IndexingStatusInternalTxs';

import NetworkAddToWallet from 'src/features/web3-wallet/components/NetworkAddToWallet';

import config from 'src/config';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { copy } from 'src/toolkit/utils/htmlEntities';

import FooterCookieSettings from './FooterCookieSettings';
import FooterLinkItem from './FooterLinkItem';
import { getApiVersionUrl } from './get-api-version-url';

const MAX_LINKS_COLUMNS = 4;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.shell.footer.frontendVersion }`;
const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${ config.shell.footer.frontendCommit }`;

const DAKOTA_LINKS = [
  {
    text: 'Dakota Cards',
    url: 'https://dakota.cards',
  },
  {
    text: 'Documentation',
    url: 'https://docs.dakota.cards',
  },
  {
    text: 'Dashboard',
    url: 'https://dashboard.dakota.cards',
  },
];

const Footer = () => {

  const { data: backendVersionData } = useApiQuery('core:config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
      enabled: !config.features.multichain.isEnabled,
      refetchOnMount: false,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version ?? undefined);

  const NETWORK_DETAILS = React.useMemo(() => [
    {
      label: 'Chain ID',
      value: config.chain.id || '112311',
    },
    {
      label: 'Ticker',
      value: 'KOTA',
    },
  ], []);

  const frontendLink = (() => {
    if (config.shell.footer.frontendVersion) {
      return <Link href={ FRONT_VERSION_URL } external noIcon>{ config.shell.footer.frontendVersion }</Link>;
    }

    if (config.shell.footer.frontendCommit) {
      return <Link href={ FRONT_COMMIT_URL } external noIcon>{ config.shell.footer.frontendCommit }</Link>;
    }

    return null;
  })();

  const { onionDomain } = useAppContext();

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.shell.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.shell.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const linkGroupsCount = isPlaceholderData ? 1 : Math.min((linksData?.length || 0) + 1, MAX_LINKS_COLUMNS);
  const footerGridColNum = linkGroupsCount + 1;

  const renderNetworkInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Flex
        alignItems="center"
        gridArea={ gridArea }
        flexWrap="wrap"
        justifyContent="flex-start"
        columnGap={ 3 }
        rowGap={ 2 }
        mb={{ base: 5, lg: 10 }}
        _empty={{ display: 'none' }}
      >
        { !config.chain.indexingStatus.intTxs.isHidden && <IndexingStatusInternalTxs/> }
        { !config.features.multichain.isEnabled && <NetworkAddToWallet source="Footer"/> }
      </Flex>
    );
  }, []);

  const renderProjectInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    const logoColor = { base: 'teal.700', _dark: 'green.300' };

    return (
      <Box gridArea={ gridArea }>
        <Flex columnGap={ 2 } textStyle="xs" alignItems="center" color="text.secondary">
          <span>Tailor-made using</span>
          <Link
            href="https://blockscout.com"
            external
            noIcon
            display="inline-flex"
            alignItems="center"
            columnGap={ 1 }
            color={ logoColor }
            _hover={{ color: logoColor }}
          >
            <SpriteIcon name="brands/blockscout" boxSize={ 5 }/>
            <span>Blockscout</span>
          </Link>
        </Flex>
        <Text mt={ 3 } fontSize="xs">
          Dakota Network Blockchain Explorer helps inspect Dakota Network blocks, transactions,
          tokens, addresses, and smart contracts across the Dakota Cards ecosystem. IPFS CID searches
          open matching content through the configured gateway.
        </Text>
        <VStack mt={ 6 } alignItems="start" textStyle="xs" gap={ 1 }>
          <Flex flexDir={ onionDomain ? 'row' : 'column' } _empty={{ display: 'none' }} columnGap={ 6 } rowGap={ 1 }>
            { apiVersionUrl && (
              <Text>
                Backend: <Link href={ apiVersionUrl } external noIcon>{ backendVersionData?.backend_version }</Link>
              </Text>
            ) }
            { frontendLink && (
              <Text>
                Frontend: { frontendLink }
              </Text>
            ) }
          </Flex>
          { onionDomain && (
            <HStack _empty={{ display: 'none' }} columnGap={ 0 }>
              <Text aria-label={ `Also accessible via Tor Browser: ${ onionDomain }` }>
                Also accessible via Tor Browser
              </Text>
              <CopyToClipboard text={ onionDomain } tooltipContent="Copy .onion address to clipboard" ml={ 1 }/>
            </HStack>
          ) }
          <Text>
            Copyright { copy } Blockscout Limited 2023-{ (new Date()).getFullYear() }
          </Text>
        </VStack>
      </Box>
    );
  }, [ apiVersionUrl, backendVersionData?.backend_version, frontendLink, onionDomain ]);

  const renderDakotaLinks = React.useCallback((isLoading?: boolean) => {
    return (
      <Box>
        <Skeleton
          fontWeight={ 600 }
          mb={ 3 }
          display="inline-block"
          loading={ Boolean(isLoading) }
          color="text.primary"
        >
          Dakota ecosystem
        </Skeleton>
        <VStack gap={ 2 } alignItems="stretch">
          { DAKOTA_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isLoading }/>) }
        </VStack>
      </Box>
    );
  }, []);

  const renderNetworkDetails = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Box gridArea={ gridArea }>
        <Text textStyle="xs" fontWeight={ 600 } mb={ 3 } color="text.primary">
          Network details
        </Text>
        <VStack gap={ 2 } alignItems="stretch">
          { NETWORK_DETAILS.map((item) => (
            <Flex
              key={ item.label }
              alignItems="center"
              justifyContent="space-between"
              columnGap={ 4 }
              minH="36px"
              px={ 3 }
              py={ 2 }
              borderWidth="1px"
              borderColor={{ _light: 'rgba(15, 118, 110, 0.18)', _dark: 'rgba(52, 211, 153, 0.18)' }}
              borderRadius="base"
              bg={{ _light: 'rgba(255, 255, 255, 0.44)', _dark: 'rgba(7, 26, 23, 0.46)' }}
            >
              <Text textStyle="xs" color="text.secondary" whiteSpace="nowrap">
                { item.label }
              </Text>
              <Text textStyle="xs" fontWeight={ 700 } color="text.primary" textAlign="right">
                { item.value }
              </Text>
            </Flex>
          )) }
        </VStack>
      </Box>
    );
  }, [ NETWORK_DETAILS ]);

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'border.divider',
    bg: { _light: 'rgba(255, 255, 255, 0.58)', _dark: 'rgba(16, 38, 33, 0.66)' },
    backdropFilter: 'blur(12px)',
  };

  const contentProps: GridProps = {
    px: { base: 4, lg: config.shell.navigation.layout === 'horizontal' ? 6 : 12, '2xl': 6 },
    py: { base: 4, lg: 8 },
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
    maxW: `${ CONTENT_MAX_WIDTH }px`,
    m: '0 auto',
  };

  const renderRecaptcha = (gridArea?: GridProps['gridArea']) => {
    if (!config.services.reCaptcha.siteKey) {
      return <Box gridArea={ gridArea }/>;
    }

    return (
      <Box gridArea={ gridArea } textStyle="xs" mt={ 6 }>
        <span>This site is protected by reCAPTCHA and the Google </span>
        <Link href="https://policies.google.com/privacy" external noIcon>Privacy Policy</Link>
        <span> and </span>
        <Link href="https://policies.google.com/terms" external noIcon>Terms of Service</Link>
        <span> apply.</span>
      </Box>
    );
  };

  const renderCookieSettings = (gridArea?: GridProps['gridArea']) => {
    if (!config.services.usercentrics) {
      return <Box gridArea={ gridArea }/>;
    }

    return <FooterCookieSettings gridArea={ gridArea }/>;
  };

  if (config.shell.footer.links) {
    return (
      <Box { ...containerProps }>
        <Grid { ...contentProps }>
          <div>
            { renderNetworkInfo() }
            { renderProjectInfo() }
            { renderRecaptcha() }
            { renderCookieSettings() }
          </div>

          <Grid
            gap={{ base: 6, lg: 4, xl: 6 }}
            gridTemplateColumns={{
              base: '1fr',
              md: 'repeat(2, minmax(0, 180px))',
              lg: `repeat(${ footerGridColNum }, 160px)`,
              xl: `repeat(${ footerGridColNum }, 180px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            { renderDakotaLinks(isPlaceholderData) }
            { (linksData || []).slice(0, linkGroupsCount - 1).map(linkGroup => (
              <Box key={ linkGroup.title }>
                <Skeleton
                  fontWeight={ 600 }
                  mb={ 3 }
                  display="inline-block"
                  loading={ isPlaceholderData }
                  color="text.primary"
                >
                  { linkGroup.title }
                </Skeleton>
                <VStack gap={ 2 } alignItems="stretch">
                  { linkGroup.links.map(link => (
                    <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>
                  )) }
                </VStack>
              </Box>
            )) }
            { renderNetworkDetails() }
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box { ...containerProps }>
      <Grid
        { ...contentProps }
        gridTemplateAreas={{
          lg: `
          "network links-top"
          "info links-bottom"
          "recaptcha links-bottom"
          "cookie-settings links-bottom"
        `,
        }}
      >

        { renderNetworkInfo({ lg: 'network' }) }
        { renderProjectInfo({ lg: 'info' }) }
        { renderRecaptcha({ lg: 'recaptcha' }) }
        { renderCookieSettings({ lg: 'cookie-settings' }) }

        <Grid
          gridArea={{ lg: 'links-bottom' }}
          gap={{ base: 6, lg: 4, xl: 6 }}
          gridTemplateColumns={{
            base: '1fr',
            sm: 'repeat(2, minmax(0, 180px))',
            lg: 'repeat(2, 180px)',
          }}
          alignContent="start"
          justifyContent={{ lg: 'flex-end' }}
          mt={{ base: 8, lg: 0 }}
        >
          { renderDakotaLinks() }
          { renderNetworkDetails() }
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);
