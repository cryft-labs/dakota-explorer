// SPDX-License-Identifier: LicenseRef-Blockscout

// SPDX-License-Identifier: LicenseRef-Blockscout

// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import UserWalletAutoConnectAlert from '../UserWalletAutoConnectAlert';

interface Props {
  address: string;
  isAutoConnectDisabled?: boolean;
  isReconnecting?: boolean;
  onDisconnect: () => void;
  onOpenDetails: () => void;
}

const UserWalletMenuContent = ({
  isAutoConnectDisabled,
  address,
  isReconnecting,
  onDisconnect,
  onOpenDetails,
}: Props) => {
  return (
    <Box>
      { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
      <Flex alignItems="center" justifyContent="space-between" gap={ 2 } mb={ 3 }>
        <Text fontSize="sm" fontWeight={ 700 }>Connected wallet</Text>
        <Tooltip content="Open wallet details">
          <IconButton
            aria-label="Open wallet details"
            variant="icon_secondary"
            size="2xs"
            onClick={ onOpenDetails }
          >
            <SpriteIcon name="open-link"/>
          </IconButton>
        </Tooltip>
      </Flex>
      <Flex
        alignItems="center"
        columnGap={ 2 }
        justifyContent="space-between"
        borderWidth="1px"
        borderColor="border.divider"
        borderRadius="md"
        px={ 3 }
        py={ 2.5 }
      >
        <AddressEntity
          address={{ hash: address }}
          truncation="dynamic"
          fontSize="sm"
          fontWeight={ 700 }
        />
        { isReconnecting && <Spinner size="sm" m="2px" flexShrink={ 0 }/> }
      </Flex>
      <Button width="full" variant="solid" onClick={ onDisconnect } mt={ 4 }>
        Disconnect wallet
      </Button>
    </Box>
  );
};

export default React.memo(UserWalletMenuContent);
