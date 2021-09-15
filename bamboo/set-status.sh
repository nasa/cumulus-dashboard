#!/bin/bash

set -ex
source .bamboo_git_env || true
source ./bamboo/set-bamboo-env-variables.sh


if [[ $REPORT_BUILD_STATUS == true ]]; then
  ### Post status to github.
  curl -H\
  "Authorization: token $GITHUB_TOKEN"\
   -d "{\"state\":\"$1\", \"target_url\": \"$2\", \"description\": \"$3\", \"context\": \"earthdata-bamboo\"}"\
   -H "Content-Type: application/json"\
   -X POST\
   https://api.github.com/repos/nasa/cumulus-dashboard/statuses/$GIT_SHA
fi
