#!/bin/sh
#
# Script that will build the Cumulus dashboard entirely within a dockerized environment.
#
# Running this script will use the current environment variables and create a
# build of the dashboard in the $root/dist directory.


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

apt-get update && apt-get install -y \
  rsync \
  git

mkdir /build
rsync -av \
  --exclude .git \
  --exclude ancillary \
  --exclude bin \
  --exclude cypress \
  --exclude dist \
  --exclude localAPI \
  --exclude ngap \
  --exclude node_modules \
  --exclude test \
  --exclude tmp \
  /cumulus-dashboard/ /build/

(
  set -evx
  cd /build
  npm install --no-optional

  APIROOT=$APIROOT \
  AUTH_METHOD=$AUTH_METHOD \
  AWS_REGION=$AWS_REGION \
  DAAC_NAME=$DAAC_NAME \
  ENABLE_RECOVERY=$ENABLE_RECOVERY \
  ESROOT=$ESROOT \
  ES_PASSWORD=$ES_PASSWORD \
  ES_USER=$ES_USER \
  HIDE_PDR=$HIDE_PDR \
  KIBANAROOT=$KIBANAROOT \
  LABELS=$LABELS \
  SERVED_BY_CUMULUS_API=$SERVED_BY_CUMULUS_API \
  SHOW_DISTRIBUTION_API_METRICS=$SHOW_DISTRIBUTION_API_METRICS \
  SHOW_TEA_METRICS=$SHOW_TEA_METRICS \
  STAGE=$STAGE \
  npm run build

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
  --env AUTH_METHOD=$AUTH_METHOD \
  --env AWS_REGION=$AWS_REGION \
  --env DAAC_NAME=$DAAC_NAME \
  --env ENABLE_RECOVERY=$ENABLE_RECOVERY \
  --env ESROOT=$ESROOT \
  --env ES_PASSWORD=$ES_PASSWORD \
  --env ES_USER=$ES_USER \
  --env HIDE_PDR=$HIDE_PDR \
  --env KIBANAROOT=$KIBANAROOT \
  --env LABELS=$LABELS \
  --env SERVED_BY_CUMULUS_API=$SERVED_BY_CUMULUS_API \
  --env SHOW_DISTRIBUTION_API_METRICS=$SHOW_DISTRIBUTION_API_METRICS \
  --env SHOW_TEA_METRICS=$SHOW_TEA_METRICS \
  --env STAGE=$STAGE \
  node:12 \
  /cumulus-dashboard/tmp/script.sh
