#!/bin/sh

set -evx

if [ "$PORT" == "" ]; then
  PORT="80"
fi

echo "listen ${PORT};" > /etc/nginx/port.conf

nginx -g "daemon off;"
