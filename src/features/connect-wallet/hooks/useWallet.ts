// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

const feature = config.features.connectWallet;

// eslint-disable-next-line no-nested-ternary
const useWallet = (feature.isEnabled && feature.connectorType === 'dynamic') ?
  (await import('./wallet/useWalletDynamic')).default :
  (feature.isEnabled && feature.connectorType === 'thirdweb') ?
    (await import('./wallet/useWalletThirdweb')).default :
    (await import('./wallet/useWalletFallback')).default;

export default useWallet;
