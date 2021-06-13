#!/bin/sh
# wait-for-postgres.sh
set -e
  
until PGPASSWORD=password psql -h "postgresql" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "Postgres is up - executing command"

cd /app
# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

# Then exec the container's main process (what's set as CMD in the Dockerfile).
# bundle exec rake db:setup RAILS_ENV=production
./bin/rails db:create RAILS_ENV=production
./bin/rails db:migrate RAILS_ENV=production
./bin/rails db:seed RAILS_ENV=production

exec "$@"
