#!/bin/bash

set -euo pipefail

# The generator lives at deploy/tools/sitemap-generator beside this script in the repo (deploy/scripts/), and under the
# working directory in the image (/app, where this script is copied to /app/sitemap_generator.sh).
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
for dir in "${SCRIPT_DIR}/../tools/sitemap-generator" "${SCRIPT_DIR}/deploy/tools/sitemap-generator"; do
  if [ -f "${dir}/next-sitemap.config.js" ]; then
    cd "${dir}"
    exec node ./node_modules/next-sitemap/bin/next-sitemap.mjs
  fi
done

echo "👎 sitemap generator not found beside ${SCRIPT_DIR}" >&2
exit 1
