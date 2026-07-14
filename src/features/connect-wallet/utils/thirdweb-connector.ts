// SPDX-License-Identifier: LicenseRef-Blockscout

export const THIRDWEB_WAGMI_CONNECTOR_ID = 'in-app-wallet';

let syncPromise: Promise<unknown> | undefined;

export const runThirdwebWagmiSync = async<T>(sync: () => Promise<T>): Promise<T> => {
  if (syncPromise) {
    return syncPromise as Promise<T>;
  }

  const promise = sync();
  syncPromise = promise;

  try {
    return await promise;
  } finally {
    if (syncPromise === promise) {
      syncPromise = undefined;
    }
  }
};
