// SPDX-License-Identifier: LicenseRef-Blockscout

import Head from 'next/head';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { Props as PageProps } from 'src/server/getServerSideProps/handlers';

import * as metadata from 'src/shell/metadata';
import { STRUCTURED_DATA_SCRIPT_ID } from 'src/shell/metadata/structured-data';

import config from 'src/config';

interface Props<Pathname extends Route['pathname']> {
  pathname: Pathname;
  query?: PageProps<Pathname>['query'];
  apiData?: PageProps<Pathname>['apiData'];
}

const SITE_NAME = 'Cryft Network Explorer';

const PageMetadata = <Pathname extends Route['pathname']>(props: Props<Pathname>) => {
  // A page prerendered at build time (404) has no host: its links stay relative, never "https:///…".
  const origin = config.app.host ? config.app.baseUrl : '';
  const { title, description, opengraph, canonical, robots, jsonLd } = metadata.generate(props, props.apiData);
  const jsonLdContent = jsonLd ? JSON.stringify(jsonLd).replaceAll('<', '\\u003c') : undefined;

  return (
    <Head>
      <title>{ title }</title>
      <meta name="description" content={ description }/>
      <meta name="robots" content={ robots }/>
      <meta name="googlebot" content={ robots }/>
      { canonical && <link rel="canonical" href={ canonical }/> }
      <link rel="sitemap" type="application/xml" href={ origin + '/sitemap.xml' }/>

      { /* OG TAGS */ }
      <meta property="og:title" content={ opengraph.title }/>
      { opengraph.description && <meta property="og:description" content={ opengraph.description }/> }
      { opengraph.imageUrl && <meta property="og:image" content={ opengraph.imageUrl }/> }
      { opengraph.imageUrl && <meta property="og:image:alt" content={ SITE_NAME }/> }
      { canonical && <meta property="og:url" content={ canonical }/> }
      <meta property="og:site_name" content={ SITE_NAME }/>
      <meta property="og:type" content="website"/>

      { /* Twitter Meta Tags */ }
      <meta name="twitter:card" content="summary_large_image"/>
      { config.app.host && <meta property="twitter:domain" content={ config.app.host }/> }
      <meta name="twitter:title" content={ opengraph.title }/>
      { opengraph.description && <meta name="twitter:description" content={ opengraph.description }/> }
      { opengraph.imageUrl && <meta property="twitter:image" content={ opengraph.imageUrl }/> }
      { opengraph.imageUrl && <meta name="twitter:image:alt" content={ SITE_NAME }/> }
      { canonical && <meta name="twitter:url" content={ canonical }/> }

      { jsonLdContent && (
        <script
          id={ STRUCTURED_DATA_SCRIPT_ID }
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdContent }}
        />
      ) }

      { /* Pinch zoom stays on (WCAG 1.4.4); inputs are 16px on touch screens, so focusing one never zooms (globalCss) */ }
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
    </Head>
  );
};

export default PageMetadata;
