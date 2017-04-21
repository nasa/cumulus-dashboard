#!/bin/sh

set -e

npm run production

rm -f release.tar
rm -rf .release && mkdir .release

mkdir .release/html
cp -R dist .release/html/dashboard
cp deployment/Dockerfile .release/Dockerfile
cp deployment/nginx.conf .release/nginx.conf
cp deployment/Procfile .release/Procfile
cp deployment/run_web.sh .release/run_web.sh

tar -cf release.tar -C .release .

rm -rf .release
