#!/bin/bash
set -ex

# Bamboo envs are prefixed with bamboo_SECRET to avoid being printed
# prefix variables with "bamboo_" or "bamboo_SECRET_" for all environments.
# prefix variables with "bamboo_SIT_" or "bamboo_SECRET_SIT_" to override in SIT environment.
declare -a param_list=(
    "bamboo_DOCKER_REPOSITORY"
    "bamboo_REPORT_BUILD_STATUS"
    "bamboo_SECRET_GITHUB_TOKEN"
    "bamboo_SECRET_SIT_AWS_ACCESS_KEY_ID"
    "bamboo_SECRET_SIT_AWS_SECRET_ACCESS_KEY"
    "bamboo_SECRET_SIT_ES_PASSWORD"
    "bamboo_SECRET_SIT_ES_USER"
    "bamboo_SIT_APIROOT"
    "bamboo_SIT_AUTH_METHOD"
    "bamboo_SIT_AWS_REGION"
    "bamboo_SIT_BUCKET"
    "bamboo_SIT_DAAC_NAME"
    "bamboo_SIT_ENABLE_RECOVERY"
    "bamboo_SIT_KIBANAROOT"
    "bamboo_SIT_HIDE_PDR"
    "bamboo_SIT_STAGE"
    "bamboo_SIT_DASHBOARD_BUCKET"
)

## Strip 'bamboo_SECRET_' from secret keys
## Translate bamboo_ keys to expected stack keys
for key in "${param_list[@]}"; do
    [[ $key =~ bamboo(_SECRET)?_(.*) ]]
    update_key=${BASH_REMATCH[2]}
    export $update_key=${!key}
done

if [[ $NGAP_ENV == 'SIT' ]]; then
    echo "***NGAP_ENV IS SIT****"
    for key in "${param_list[@]}"; do
	[[ $key =~ bamboo(_SECRET_SIT|_SIT)?_(.*) ]]
	update_key=${BASH_REMATCH[2]}
	export $update_key=${!key}
    done
fi

## Get the current git SHA
GIT_SHA=$(git rev-parse HEAD)
export GIT_SHA

## Always set GIT_PR true if master or develop branch
if [[ $BRANCH == master || $BRANCH == develop ]]; then
  export GIT_PR=true
fi

## This should take a blank value from the global options, and
## is intended to allow an override for a custom branch build.
if [[ ! -z $bamboo_GIT_PR ]]; then
  export GIT_PR=$bamboo_GIT_PR
  export REPORT_BUILD_STATUS=true
fi

## Branch should be set in the .bamboo_env_vars *or* the
## configured bamboo Environment variables.
if [[ -z $BRANCH ]]; then
  echo "Branch is not set, this is required for Bamboo CI.  Exiting"
  exit 1
fi

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
  elif [[ PR_CODE -eq 0 ]]; then
    export GIT_PR=false
  else
    echo "Error detecting PR status"
    exit 1
  fi
fi

echo GIT_PR is $GIT_PR
echo writing git environment file
echo export GIT_PR=$GIT_PR >> .bamboo_git_env
echo export BRANCH=$BRANCH >> .bamboo_git_env
echo export PR_BRANCH=$PR_BRANCH >> .bamboo_git_env
echo export REPORT_BUILD_STATUS=$REPORT_BUILD_STATUS >> .bamboo_git_env
echo export GIT_SHA=$GIT_SHA >> .bamboo_git_env
