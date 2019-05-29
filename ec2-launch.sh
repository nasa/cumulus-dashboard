#!/bin/sh

# Openresty install

sudo yum install yum-utils

sudo yum-config-manager --add-repo https://openresty.org/package/amazon/openresty.repo

sudo yum install openresty -y

# Install nginx

sudo yum install nginx -y

# Start openresty

PATH=/usr/local/openresty/nginx/sbin:$PATH
export PATH

cd /usr/local/openresty/nginx
sudo nginx -p `pwd`/ -c conf/nginx.conf

sudo openresty -s restart