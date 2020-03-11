#!/bin/sh

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
  rsync \
  git

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
  APIROOT=$APIROOT \
    DAAC_NAME=$DAAC_NAME \
    STAGE=$STAGE \
    HIDE_PDR=$HIDE_PDR \
    LABELS=$LABELS \
    SERVED_BY_CUMULUS_API=$SERVED_BY_CUMULUS_API \
    AUTH_METHOD=$AUTH_METHOD npm run build

  rsync -av ./dist/ /dist/
  chown -R "${DOCKER_UID}:${DOCKER_GID}" /dist/
)
EOS
chmod +x tmp/script.sh

echo "Building to $DIST"
docker run \
  --rm \
  --volume "${DIST}:/dist" \
  --volume "$(pwd):/cumulus-dashboard:ro" \
  --env APIROOT=$APIROOT \
  --env DAAC_NAME=$DAAC_NAME \
  --env STAGE=$STAGE \
  --env HIDE_PDR=$HIDE_PDR \
  --env LABELS=$LABELS \
  --env SERVED_BY_CUMULUS_API=${SERVED_BY_CUMULUS_API:-false} \
  --env AUTH_METHOD=$AUTH_METHOD \
  node:10-slim \
  /cumulus-dashboard/tmp/script.sh
