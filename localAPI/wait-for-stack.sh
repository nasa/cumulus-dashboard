#!/bin/sh
# wait-for-stack.sh - Wait until both Elasticsearch and Localstack are available then execute command.
# for example, a docker-compose.yml file with:
#     command: [ "./localAPI/wait-for-stack.sh", "./node_modules/@cumulus/api/bin/cli.js", "serve", "--no-reseed" ]
# would run the command `./node_modules/@cumulus/api/bin/cli.js serve --no-reseed` when the stack becomes ready.

set -e

cmd="$@"

until  curl --connect-timeout 5 -sS http://localhost:9200/ 2> /dev/null | grep 'tagline' > /dev/null; do
  >&2 echo "Elasticsearch is unavailable - sleeping"
  sleep 2
done

>&2 echo "Elasticsearch is up - checking Localstack"

# Wait for localstack
until curl --connect-timeout 5 -sS http://localhost:4566/ 2> /dev/null | grep 'running' > /dev/null; do
  >&2 echo "Localstack is unavailable - sleeping"
  sleep 2
done

>&2 echo "Localstack is up - executing command"
exec $cmd
