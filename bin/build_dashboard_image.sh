#!/bin/sh
#
# Script to build a Docker image that uses a basic nginx configuration to serve
# the Cumulus dashboard
# example:
# > ./bin/build_dashboard_via_docker.sh
# > ....
# Successfully built f39c114cc432
# Successfully tagged cumulus-dashboard:latest
# >
# The resulting image can be run exposing the dashboard with a simple command
# docker run --rm -p 3000:80 cumulus-dashboard:latest

set -evx

IMAGE_NAME="${1:-cumulus-dashboard:latest}"
IMAGE_NAME=$IMAGE_NAME docker-compose -f docker/docker-compose.yml build dashboard
