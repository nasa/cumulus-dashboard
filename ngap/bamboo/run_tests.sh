#!/bin/sh

set -e

cp -R /source /build
(
  set -e
  cd /build
  tar -xf modules.tar
  npm run lint
  ./node_modules/.bin/tape -r babel-register -r babel-polyfill test/**/*.js |\
    ./node_modules/.bin/tap-xunit > /artifacts/results.xml
)
chown -R "${RELEASE_UID}:${RELEASE_GID}" /artifacts/results.xml
