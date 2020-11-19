#!/bin/sh
#
# Script that will build the Cumulus dashboard entirely within a dockerized environment.
#
# Running this script will use the current environment variables and create a
# build of the dashboard in the $root/dist directory.


set -evx

TAG=${TAG:-latest}
DIST="$(pwd)/dist"

echo "Cleaning $DIST directory"
rm -rf $DIST && mkdir $DIST

TAG=${TAG} docker-compose -f docker/docker-compose.yml build build
docker create --name dashboard-build-container dashboard-build:${TAG}
docker cp dashboard-build-container:/cumulus-dashboard/dist/. ./dist
docker rm dashboard-build-container
