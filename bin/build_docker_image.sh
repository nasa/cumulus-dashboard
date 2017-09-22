#!/bin/sh

set -evx

IMAGE_NAME="$1"

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
