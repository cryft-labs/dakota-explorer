// SPDX-License-Identifier: LicenseRef-Blockscout

export default function getChainUtilizationParams(value: number) {
  const load = (() => {
    if (value > 80) {
      return 'high';
    }

    if (value > 50) {
      return 'medium';
    }

    return 'low';
  })();

  const colors = {
    high: 'red.600',
    medium: 'orange.600',
    low: 'link.primary', // Cryft Cards: the brand teal in both modes (a level, not a success)
  };
  const color = colors[load];

  return {
    load,
    color,
  };
}
