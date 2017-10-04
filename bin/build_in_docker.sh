#!/bin/sh

set -evx

DS_ENV="$1"
if [ "$DS_ENV" == "" ]; then
  echo "Usage: $0 DS_ENV" >&2
  exit 1
fi

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
  g++ \
  make \
  python \
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
  npm install
  ./node_modules/.bin/gulp

  rsync -av ./dist/ /dist/
  chown -R "${DOCKER_UID}:${DOCKER_GID}" /dist/
)
EOS
chmod +x tmp/script.sh

echo "Building to $DIST"
docker run \
  --rm \
  --env "DS_ENV=${DS_ENV}" \
  --volume "${DIST}:/dist" \
  --volume "$(pwd):/cumulus-dashboard:ro" \
  node:slim /cumulus-dashboard/tmp/script.sh
