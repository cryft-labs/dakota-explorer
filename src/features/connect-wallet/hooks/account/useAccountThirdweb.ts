// SPDX-License-Identifier: LicenseRef-Blockscout

import { useActiveAccount, useActiveWalletConnectionStatus } from 'thirdweb/react';

export default function useAccountThirdweb() {
  const account = useActiveAccount();
  const connectionStatus = useActiveWalletConnectionStatus();

  return {
    address: account?.address as `0x${ string }` | undefined,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    isReconnecting: connectionStatus === 'unknown',
    status: connectionStatus,
  };
}
