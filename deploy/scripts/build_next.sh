#!/bin/bash

set -e

./deploy/scripts/download_assets.sh ./public/assets/configs
source ./deploy/scripts/build_sprite.sh
./deploy/scripts/make_envs_script.sh
next build
