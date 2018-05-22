# Postgres, GraphQL, Node.js

## Prerequisites

Install docker.

`touch .env` with the following:

```
API_PORT=8081
DB_HOST=0.0.0.0
DB_PORT=5432
POSTGRES_DB=table
POSTGRES_USER=user
POSTGRES_PASSWORD=password
```

## Development

```
docker-compose build
docker-compose up

# Clearing dangling images/containers
docker system prune -fa
```

## Production

Dockerfile has been created for production use.
