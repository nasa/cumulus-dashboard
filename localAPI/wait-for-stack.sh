#!/bin/sh
# wait-for-stack.sh - Wait until MiniStack is available then execute command.
# for example, a docker-compose.yml file with:
#     command: [ "./localAPI/wait-for-stack.sh", "./node_modules/@cumulus/api/bin/cli.js", "serve", "--no-reseed" ]
# would run the command `./node_modules/@cumulus/api/bin/cli.js serve --no-reseed` when the stack becomes ready.

set -e

# Wait for MiniStack
until curl --connect-timeout 5 -sSI http://localhost:4566/ 2>&1 | grep -E -q "HTTP/[1.2]+"; do
   >&2 echo "MiniStack application is still booting - sleeping"
   sleep 2
done

>&2 echo "MiniStack is up - executing command"
exec "$@"
