#!/bin/sh

echo 'Seeding Postgres DB'

echo 'Creating schema'
if ! docker exec -i localapi_postgres_1 psql -d postgres -h localhost -U postgres < ./localAPI/cumulus-postgres-schema.sql; then
  echo "Failed to create schema" 1>&2
  exit 1
fi

echo 'Inserting data'
if ! docker exec -i localapi_postgres_1 psql -d postgres -h localhost -U postgres < ./localAPI/cumulus-postgres-seed-data.sql; then
  echo "Failed to insert data" 1>&2
  exit 1
fi

echo 'Seeded Postgres DB'