#!/bin/bash

set -ex
export GIT_SHA=$(git rev-parse HEAD)

if [[ $bamboo_REPORT_BUILD_STATUS == true ]]; then
  ### Post status to github.
  curl -H\
  "Authorization: token $bamboo_GITHUB_TOKEN"\
   -d "{\"state\":\"$1\", \"target_url\": \"$2\", \"description\": \"$3\", \"context\": \"earthdata-bamboo\"}"\
   -H "Content-Type: application/json"\
   -X POST\
   https://api.github.com/repos/nasa/cumulus-dashboard/statuses/$GIT_SHA
fi
