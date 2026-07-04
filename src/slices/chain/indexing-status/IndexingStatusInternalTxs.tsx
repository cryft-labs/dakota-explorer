// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { operations } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import config from 'src/config';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

function formatIndexingPercent(value: string | number | null | undefined) {
  const ratio = Number(value);

  if (!Number.isFinite(ratio)) {
    return;
  }

  return Math.max(0, Math.min(100, Math.floor(ratio * 100)));
}

const IndexingStatusInternalTxs = () => {

  const { data, isError, isPending } = useApiQuery('core:homepage_indexing_status', {
    queryOptions: {
      enabled: !config.chain.indexingStatus.intTxs.isHidden,
    },
  });

  const queryClient = useQueryClient();

  const handleInternalTxsIndexStatus: SocketMessage.InternalTxsIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(
      getResourceKey('core:homepage_indexing_status'),
      (prevData: operations['MainPageController.indexing_status']['json'] | undefined) => {

        const newData = prevData ? {
          ...prevData,
          finished_indexing: payload.finished,
          indexed_internal_transactions_ratio: payload.ratio,
        } : undefined;

        return newData;
      });
  }, [ queryClient ]);

  const internalTxsIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing_internal_transactions',
    isDisabled: Boolean(!data || data.finished_indexing),
  });

  useSocketMessage({
    channel: internalTxsIndexingChannel,
    event: 'index_status',
    handler: handleInternalTxsIndexStatus,
  });

  if (isError || isPending) {
    return null;
  }

  if (data.finished_indexing !== false) {
    return null;
  }

  const indexedPercent = formatIndexingPercent(data.indexed_internal_transactions_ratio);
  const indexedStatus = indexedPercent === undefined ?
    'Internal transaction indexing is in progress.' :
    `${ indexedPercent }% of Dakota Network blocks have internal transactions indexed.`;

  const hint = (
    <Text textStyle="xs">
      { indexedStatus } Counts involving contract-created or internal transactions may be incomplete
      until indexing finishes.
    </Text>
  );

  const trigger = (
    <Flex
      px={ 1 }
      bg={{ base: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
      borderRadius="base"
      alignItems="center"
      justifyContent="center"
      color="green.400"
      _hover={{ color: 'hover' }}
      columnGap={ 1 }
    >
      <SpriteIcon name="info" boxSize={ 5 }/>
      { indexedPercent !== undefined && (
        <Text fontWeight={ 600 } textStyle="xs" color="inherit">
          { `Internal tx index: ${ indexedPercent }%` }
        </Text>
      ) }
    </Flex>
  );

  return (
    <Tooltip content={ hint } interactive positioning={{ placement: 'bottom-start' }} lazyMount>
      { trigger }
    </Tooltip>
  );
};

export default IndexingStatusInternalTxs;
