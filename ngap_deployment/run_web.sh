#!/bin/sh

set -e

echo "listen $PORT;" > /etc/nginx/conf.d/port.conf
nginx -g 'daemon off;'
