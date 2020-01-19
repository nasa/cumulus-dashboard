#!/bin/sh
# wait-for-stack.sh - Wait until both Elasticsearch and Localstack are available then execute command.
# for example, a docker-compose.yml file with:
#     command: [ "./localAPI/wait-for-stack.sh", "./node_modules/@cumulus/api/bin/cli.js", "serve", "--no-reseed" ]
# would run the command `./node_modules/@cumulus/api/bin/cli.js serve --no-reseed` when the stack becomes ready.

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
