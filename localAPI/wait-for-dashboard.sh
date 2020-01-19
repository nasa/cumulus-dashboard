#!/bin/sh
# wait-for-dashboard.sh - Wait until The localAPI and dashboard are up and
# serving data, then run rest of arguments as a command.

set -e

cmd="$@"

until curl --connect-timeout 5 -sS http://localhost:5001/version 2> /dev/null | grep 'api_version' > /dev/null; do
  >&2 echo "Cumulus localAPI is unavailable - sleeping"
  sleep 2
done

>&2 echo "LocalAPI is up - checking Localstack"

until curl --connect-timeout 5 -sS curl localhost:3000 2> /dev/null | grep "Cumulus Dashboard" > /dev/null; do
  >&2 echo "Dashboard is unavailable - sleeping"
  sleep 2
done

>&2 echo "Dashboard is up - executing command"
exec $cmd
