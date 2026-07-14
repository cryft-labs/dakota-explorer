// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ButtonProps } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Button } from 'src/toolkit/chakra/button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  isPending?: boolean;
  isAutoConnectDisabled?: boolean;
  address?: string;
}

const UserWalletButton = ({ size, variant, isPending, isAutoConnectDisabled, address, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {

  const isMobile = useIsMobile();
  const isConnected = Boolean(address);

  return (
    <Tooltip
      content={ isConnected ? 'Connected wallet' : 'Connect your wallet to the Dakota Cards Explorer' }
      disabled={ isMobile }
      openDelay={ 500 }
      disableOnMobile
    >
      <span>
        <Button
          ref={ ref }
          aria-label={ isConnected ? 'Open connected wallet' : 'Connect wallet' }
          size={ size }
          variant={ variant }
          selected={ isConnected }
          highlighted={ isAutoConnectDisabled }
          w="40px"
          minW="40px"
          h="40px"
          p={ 0 }
          borderRadius="full"
          loading={ isPending }
          { ...rest }
        >
          <SpriteIcon name="wallet" boxSize={ 5 }/>
        </Button>
      </span>
    </Tooltip>
  );
};

export default React.memo(React.forwardRef(UserWalletButton));
