#!/bin/bash

docker run -d \
  --name span-query-db \
  --restart=always \
  -p 5432:5432 \
  -e POSTGRES_USER=spanquery \
  -e POSTGRES_PASSWORD=pgpass \
  -e POSTGRES_DB=span-query \
  postgres:13.0-alpine
