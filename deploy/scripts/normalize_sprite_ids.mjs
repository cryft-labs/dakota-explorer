#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const ICONS_DIR = path.join(ROOT, 'src/sprite/icons');
const PUBLIC_ICONS_DIR = path.join(ROOT, 'public/icons');
const SPRITE_FILE = path.join(PUBLIC_ICONS_DIR, 'sprite.svg');
const TYPES_FILE = path.join(PUBLIC_ICONS_DIR, 'name.d.ts');

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

async function collectSvgFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async(entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectSvgFiles(fullPath);
    }

    if (entry.isFile() && entry.name.endsWith('.svg')) {
      return [ fullPath ];
    }

    return [];
  }));

  return files.flat();
}

async function writeIfChanged(filePath, nextContent) {
  const currentContent = await fs.readFile(filePath, 'utf8');

  if (currentContent !== nextContent) {
    await fs.writeFile(filePath, nextContent);
    return true;
  }

  return false;
}

function buildBrokenIdMap(sourceIconNames) {
  const brokenToCanonical = new Map();

  for (const iconName of sourceIconNames) {
    const brokenName = iconName.replaceAll('/', '');

    if (brokenName === iconName) {
      continue;
    }

    const existing = brokenToCanonical.get(brokenName);

    if (existing && existing !== iconName) {
      throw new Error(`Cannot safely normalize duplicate sprite id "${ brokenName }" for "${ existing }" and "${ iconName }".`);
    }

    brokenToCanonical.set(brokenName, iconName);
  }

  return brokenToCanonical;
}

async function main() {
  const svgFiles = await collectSvgFiles(ICONS_DIR);
  const sourceIconNames = svgFiles.map((file) => {
    const relativePath = toPosixPath(path.relative(ICONS_DIR, file));
    return relativePath.replace(/\.svg$/i, '');
  });
  const sourceIconNameSet = new Set(sourceIconNames);
  const brokenToCanonical = buildBrokenIdMap(sourceIconNames);

  const spriteContent = await fs.readFile(SPRITE_FILE, 'utf8');
  const normalizedSpriteContent = spriteContent.replace(/<symbol id="([^"]+)"/g, (match, id) => {
    const slashedId = id.replace(/\\+/g, '/');

    if (sourceIconNameSet.has(slashedId)) {
      return `<symbol id="${ slashedId }"`;
    }

    const canonicalId = brokenToCanonical.get(id);

    if (canonicalId) {
      return `<symbol id="${ canonicalId }"`;
    }

    return match;
  });

  const spriteChanged = await writeIfChanged(SPRITE_FILE, normalizedSpriteContent);

  let typesChanged = false;

  try {
    const typesContent = await fs.readFile(TYPES_FILE, 'utf8');
    const normalizedTypesContent = typesContent.replace(/\\+/g, '/');
    typesChanged = await writeIfChanged(TYPES_FILE, normalizedTypesContent);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  if (spriteChanged || typesChanged) {
    process.stdout.write('Normalized SVG sprite icon ids.\n');
  } else {
    process.stdout.write('SVG sprite icon ids already normalized.\n');
  }
}

main().catch((error) => {
  process.stderr.write(`${ error.stack ?? error.message ?? String(error) }\n`);
  process.exitCode = 1;
});
