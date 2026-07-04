// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { operations } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import { useAppContext } from 'src/shell/app/context';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import { Alert } from 'src/toolkit/chakra/alert';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

function formatIndexingPercent(value: string | number | null | undefined) {
  const ratio = Number(value);

  if (!Number.isFinite(ratio)) {
    return;
  }

  return Math.max(0, Math.min(100, Math.floor(ratio * 100)));
}

const IndexingStatusBlocks = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;
  const [ hasAlertCookie ] = React.useState(cookies.get(cookies.NAMES.INDEXING_ALERT, cookiesString) === 'true');

  const { data, isError, isPending } = useApiQuery('core:homepage_indexing_status', {
    queryOptions: {
      enabled: !config.chain.indexingStatus.blocks.isHidden,
    },
  });

  React.useEffect(() => {
    if (!isPending && !isError) {
      cookies.set(cookies.NAMES.INDEXING_ALERT, data.finished_indexing_blocks ? 'false' : 'true');
    }
  }, [ data, isError, isPending ]);

  const queryClient = useQueryClient();

  const handleBlocksIndexStatus: SocketMessage.BlocksIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(
      getResourceKey('core:homepage_indexing_status'),
      (prevData: operations['MainPageController.indexing_status']['json'] | undefined) => {

        const newData = prevData ? {
          ...prevData,
          finished_indexing_blocks: payload.finished,
          indexed_blocks_ratio: payload.ratio,
        } : undefined;

        return newData;
      });
  }, [ queryClient ]);

  const blockIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing',
    isDisabled: !data || data.finished_indexing_blocks || config.chain.indexingStatus.blocks.isHidden,
  });

  useSocketMessage({
    channel: blockIndexingChannel,
    event: 'index_status',
    handler: handleBlocksIndexStatus,
  });

  if (config.chain.indexingStatus.blocks.isHidden) {
    return null;
  }

  if (isError) {
    return null;
  }

  if (isPending) {
    return hasAlertCookie ? <Skeleton loading h={{ base: '96px', lg: '48px' }} w="100%"/> : null;
  }

  if (data.finished_indexing_blocks !== false) {
    return null;
  }

  const indexedPercent = formatIndexingPercent(data.indexed_blocks_ratio);
  const statusText = indexedPercent === undefined ?
    'Indexing status: block indexing is in progress.' :
    `Indexing status: ${ indexedPercent }% of Dakota Network blocks are indexed.`;

  return (
    <Alert status="info" py={ 3 } borderRadius="md" showIcon>
      { `${ statusText } Explorer counts and stats may be incomplete until indexing finishes.` }
    </Alert>
  );
};

export default React.memo(IndexingStatusBlocks);
