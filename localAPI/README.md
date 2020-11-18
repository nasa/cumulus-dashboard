## The localAPI directory contains tools for testing and development.

This directory contains the docker-compose files necessary for running the Cumulus API for testing. These files are also used to stand up different portions of the testing stack during development. See the [Docker Service Diagram](../README.md#dockerdiagram) for info.

## `wait-for-stack.sh`

Helper script used in Docker compose to determine when the elasticsearch and localstack containers are up and running.  This is used in the Docker compose files to wait for them before starting the Cumulus API.

A side effect of running this script seems to be, that connection attempts to the localstack container to determine if it is ready can cause errors in the localstack logs, but it appears that these are cosmetic and that the stack works as intended when it has come up completely.

## `wait-for-dashboard.sh`

Same idea as `wait-for-stack.sh`, but waits for the cumulus dashboard to be available. Used to delay start of cypress tests until the containers are up and ready to handle requests.

## `runSeedDatabase.js`

Node script used to repopulate a running stack with test data.
