// SPDX-License-Identifier: LicenseRef-Blockscout

import { createThirdwebClient } from 'thirdweb';

import config from 'src/config';

const feature = config.features.connectWallet;

export const thirdwebClient = feature.isEnabled && feature.connectorType === 'thirdweb' ?
  createThirdwebClient({ clientId: feature.thirdweb.clientId }) :
  undefined;
