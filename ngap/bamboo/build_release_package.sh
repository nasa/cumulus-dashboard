#!/bin/sh

set -e

cp -R /source /build
(
  set -e
  cd /build
  tar -xf modules.tar

  npm run build

  mkdir release
  mkdir release/html
  cp -R dist release/html/dashboard
  cp ngap/deployment/Dockerfile release/Dockerfile
  cp ngap/deployment/nginx.conf release/nginx.conf
  cp ngap/deployment/Procfile release/Procfile
  cp ngap/deployment/run_web.sh release/run_web.sh

  tar -cf /artifacts/release.tar -C release .
)

chown "${RELEASE_UID}:${RELEASE_GID}" /artifacts/release.tar
