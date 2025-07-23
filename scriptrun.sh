#!/bin/bash
# Stack
export APIROOT=https://8o1cxx9bua.execute-api.us-east-1.amazonaws.com:8000/dev/
export AUTH_METHOD=earthdata
export AWS_REGION=us-east-1
npm run build
npm run serve