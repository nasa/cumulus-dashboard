#!/bin/sh

set -e

apt-get update && apt-get install -y rsync

mkdir /build
rsync -a --exclude node_modules /source/ /build/

(
  cd /build

  npm install
  npm run production

  mkdir .release
  mkdir .release/html
  cp -R dist .release/html/dashboard
  cp deployment/Dockerfile .release/Dockerfile
  cp deployment/nginx.conf .release/nginx.conf
  cp deployment/Procfile .release/Procfile
  cp deployment/run_web.sh .release/run_web.sh

  tar -cf /source/release.tar -C .release .
  chown "$RELEASE_UID" /source/release.tar
)
