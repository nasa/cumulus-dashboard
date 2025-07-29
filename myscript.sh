#!/bin/bash
# SIT shared dashboard
export APIROOT=https://d84ilrgn1b7e1.cloudfront.net/
export AUTH_METHOD=launchpad
export AWS_REGION=us-east-1
export DAAC_NAME=cumulus-std
export KIBANAROOT=https://metrics.sit.earthdata.nasa.gov/s/metrics-cumulus
export HIDE_PDR=false
export STAGE=development
export ENABLE_RECOVERY=true
npm run build
npm run serve
