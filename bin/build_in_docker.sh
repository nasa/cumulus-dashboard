#!/bin/sh


# echo $APIROOT;
# exit;

set -evx

DIST="$(pwd)/dist"

echo "Cleaning $DIST directory"
rm -rf $DIST && mkdir $DIST

mkdir -p tmp
DOCKER_UID=$(id -u)
DOCKER_GID=$(id -g)
cat > tmp/script.sh <<EOS
#!/bin/sh

set -evx

apt-get update

apt-get install -y \
  rsync

mkdir /build
rsync -av \
  --exclude .git \
  --exclude node_modules \
  --exclude tmp \
  /cumulus-dashboard/ /build/

(
  set -evx

  cd /build
  npm install -g yarn
  yarn install
  APIROOT=$APIROOT yarn run build

  rsync -av ./dist/ /dist/
  chown -R "${DOCKER_UID}:${DOCKER_GID}" /dist/
)
EOS
chmod +x tmp/script.sh

echo "Building to $DIST"
docker run \
  --rm \
  -e APIROOT=$APIROOT
  --volume "${DIST}:/dist" \
  --volume "$(pwd):/cumulus-dashboard:ro" \
  node:8-slim \
  /cumulus-dashboard/tmp/script.sh
