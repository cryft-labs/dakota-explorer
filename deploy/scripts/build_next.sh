#!/bin/bash

set -e

EXPECTED_THIRDWEB_VERSION="$(node -p "require('./package.json').dependencies.thirdweb")"
INSTALLED_THIRDWEB_VERSION="$(node -p "require('./node_modules/thirdweb/package.json').version")"

if [ "${INSTALLED_THIRDWEB_VERSION}" != "${EXPECTED_THIRDWEB_VERSION}" ]; then
  echo "Thirdweb SDK version mismatch: expected ${EXPECTED_THIRDWEB_VERSION}, installed ${INSTALLED_THIRDWEB_VERSION}." >&2
  exit 1
fi

echo "Thirdweb SDK version: ${INSTALLED_THIRDWEB_VERSION}"

./deploy/scripts/download_assets.sh ./public/assets/configs
source ./deploy/scripts/build_sprite.sh
./deploy/scripts/make_envs_script.sh
next build
