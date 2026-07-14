// SPDX-License-Identifier: LicenseRef-Blockscout

// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import { Button } from 'src/toolkit/chakra/button';

import UserWalletAutoConnectAlert from '../UserWalletAutoConnectAlert';

interface Props {
  address: string;
  isAutoConnectDisabled?: boolean;
  isReconnecting?: boolean;
  onDisconnect: () => void;
}

const UserWalletMenuContent = ({ isAutoConnectDisabled, address, isReconnecting, onDisconnect }: Props) => {
  return (
    <Box>
      { isAutoConnectDisabled && <UserWalletAutoConnectAlert/> }
      <Text fontSize="sm" fontWeight={ 700 } mb={ 3 }>Connected wallet</Text>
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
      <Button size="sm" width="full" variant="outline" onClick={ onDisconnect } mt={ 4 }>
        Disconnect
      </Button>
    </Box>
  );
};

export default React.memo(UserWalletMenuContent);
