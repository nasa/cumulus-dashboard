#!/bin/sh
#
# Script to build a Docker image that uses a basic nginx configuration to serve
# a pre-built dashboard located in ${root}/dist.

# The resulting image can be run exposing the dashboard with a simple command
# docker run --rm -p 3000:80 cumulus-dashboard:latest

set -evx

IMAGE_NAME="${1:-cumulus-dashboard:latest}"

if [ ! -d dist ]; then
  echo "No dist directory found" >&2
  exit 1
fi

if [ -z "$(ls -A dist)" ]; then
  echo "Nothing found in the dist directory" >&2
  exit 1
fi

rm -rf docker/html
mkdir docker/html
rsync \
  --archive \
  --delete \
  --verbose \
  ./dist/ ./docker/html/

if [ "$IMAGE_NAME" == "" ]; then
  docker build docker
else
  docker build --tag "$IMAGE_NAME" docker
fi
