#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

cd "${SCRIPT_DIR}/../tools/sitemap-generator"
node ./node_modules/next-sitemap/bin/next-sitemap.mjs
