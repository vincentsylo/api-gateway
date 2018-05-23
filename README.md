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
JWT_SECRET=jwt_secret
```

## Development

```
docker-compose build
docker-compose up

# Clearing dangling images/containers
docker system prune -fa

# Accessing docker volume
docker exec -it <container_id> bash
```

## Production

Dockerfile has been created for production use.

## Authenticated endpoints

JWT tokens are in use for securely, stateless authentication.

Access tokens have an expiry of 1 hour.

When clients login, we store a refresh token on the database against the user and require the client to save both the access token and refresh token locally. Upon every request, we require the client to add an authorization header `Bearer <accessToken>`.

Upon any unauthenticated request, the client must call the `/api/auth/token` endpoint to request for a new access token, before trying to make the call again.

