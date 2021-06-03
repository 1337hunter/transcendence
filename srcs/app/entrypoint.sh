#!/bin/bash
#set -e

cd /app
# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
bundle exec rake db:setup
#rake db:migrate RAILS_ENV=test
exec "$@"
