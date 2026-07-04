// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';

export default function getChainExplorerTitle() {
  return `${ config.chain.name } Blockchain Explorer`;
}
