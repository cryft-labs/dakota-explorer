// SPDX-License-Identifier: LicenseRef-Blockscout

import { mkdir, writeFile } from 'node:fs/promises';

const assetsDirectory = new URL('../../public/assets/', import.meta.url);
const outputFile = new URL('envs.js', assetsDirectory);

const publicEnvs = Object.fromEntries(
  Object.entries(process.env)
    .filter(([ key ]) => key.startsWith('NEXT_PUBLIC_') && !key.startsWith('NEXT_PUBLIC_VERCEL'))
    .sort(([ firstKey ], [ secondKey ]) => {
      if (firstKey < secondKey) {
        return -1;
      }
      if (firstKey > secondKey) {
        return 1;
      }
      return 0;
    }),
);

await mkdir(assetsDirectory, { recursive: true });
await writeFile(outputFile, `window.__envs = ${ JSON.stringify(publicEnvs, null, 2) };\n`, 'utf8');
