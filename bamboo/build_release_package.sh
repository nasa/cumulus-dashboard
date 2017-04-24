#!/bin/sh

set -e

cp -R /source /build
(
  set -e
  cd /build
  tar -xf modules.tar

  npm run production

  mkdir release
  mkdir release/html
  cp -R dist release/html/dashboard
  cp ngap_deployment/Dockerfile release/Dockerfile
  cp ngap_deployment/nginx.conf release/nginx.conf
  cp ngap_deployment/Procfile release/Procfile
  cp ngap_deployment/run_web.sh release/run_web.sh

  tar -cf /artifacts/release.tar -C release .
)

chown "${RELEASE_UID}:${RELEASE_GID}" /artifacts/release.tar
