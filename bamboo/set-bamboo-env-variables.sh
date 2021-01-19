#!/bin/bash
set -ex

# Bamboo envs are prefixed with bamboo_SECRET to avoid being printed
declare -a param_list=(
    "bamboo_DOCKER_REPOSITORY"
    "bamboo_GIT_PR"
    "bamboo_REPORT_BUILD_STATUS"
    "bamboo_SECRET_GITHUB_TOKEN"
    "bamboo_SECRET_GITHUB_USER"
    "bamboo_SECRET_SIT_AWS_ACCESS_KEY_ID"
    "bamboo_SECRET_SIT_AWS_SECRET_ACCESS_KEY"
    "bamboo_SECRET_SIT_DASHBOARD_ES_PASSWORD"
    "bamboo_SECRET_SIT_DASHBOARD_ES_USER"
    "bamboo_SIT_DASHBOARD_APIROOT"
    "bamboo_SIT_DASHBOARD_AUTH_METHOD"
    "bamboo_SIT_DASHBOARD_AWS_REGION"
    "bamboo_SIT_DASHBOARD_BUCKET"
    "bamboo_SIT_DASHBOARD_DAAC_NAME"
    "bamboo_SIT_DASHBOARD_ESROOT"
    "bamboo_SIT_DASHBOARD_KIBANAROOT"
)
regex='bamboo(_SECRET)?_(.*)'

## Strip 'bamboo_SECRET_' from secret keys
## Translate bamboo_ keys to expected stack keys
for key in ${param_list[@]}; do
  [[ $key =~ bamboo(_SECRET)?_(.*) ]]
  update_key=${BASH_REMATCH[2]}
  export $update_key=${!key}
done

## Get the current git SHA
export GIT_SHA=$(git rev-parse HEAD)

## Always set GIT_PR true if master or develop branch
if [[ $BRANCH == master || $BRANCH == develop ]]; then
  export GIT_PR=true
  echo export GIT_PR=true >> .bamboo_env_vars
fi

## This should take a blank value from the global options, and
## is intended to allow an override for a custom branch build.
if [[ ! -z $bamboo_GIT_PR ]]; then
  export GIT_PR=$bamboo_GIT_PR
  export REPORT_BUILD_STATUS=true
  echo export GIT_PR=$GIT_PR >> .bamboo_env_vars
fi

source .bamboo_env_vars || true

## Branch should be set in the .bamboo_env_vars *or* the
## configured bamboo Environment variables.
if [[ -z $BRANCH ]]; then
  echo "Branch is not set, this is required for Bamboo CI.  Exiting"
  exit 1
fi
echo export BRANCH=$BRANCH >> .bamboo_env_vars

# Target develop by default.
# Update with appropriate conditional
# when creating a feature branch.
export PR_BRANCH=develop

## Run detect-pr script and set flag to true/false
## depending on if there is a PR associated with the
## current ref from the current branch
if [[ -z $GIT_PR ]]; then
  echo "Setting GIT_PR"
  set +e
  node ./bamboo/detect-pr.js $BRANCH $PR_BRANCH
  PR_CODE=$?
  set -e
  if [[ PR_CODE -eq 100 ]]; then
    export GIT_PR=true
    echo export GIT_PR=true >> .bamboo_env_vars
  elif [[ PR_CODE -eq 0 ]]; then
    export GIT_PR=false
    echo export GIT_PR=false >> .bamboo_env_vars
  else
    echo "Error detecting PR status"
    exit 1
  fi
fi

echo GIT_PR is $GIT_PR
