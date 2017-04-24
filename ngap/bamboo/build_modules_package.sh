#!/bin/sh

set -e

cp -R /source /build
(set -e && cd /build && npm install)
tar -cf /artifacts/modules.tar -C /build node_modules
chown "${RELEASE_UID}:${RELEASE_GID}" /artifacts/modules.tar
