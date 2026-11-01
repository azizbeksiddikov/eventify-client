#!/bin/bash

# --env-file makes compose read the build args from .env.production (it reads .env by default)
COMPOSE="docker compose --env-file .env.production -f docker-compose.prod.yml"

docker stop eventify-next 2>/dev/null || true

# Force remove the container if it still exists
docker rm -f eventify-next 2>/dev/null || true

# Stops running containers and removes them
$COMPOSE down --remove-orphans

# Builds the pure production image (no dev dependencies)
$COMPOSE build

# Clean up dangling images (old images that lost their tags)
docker image prune -f

# Starts the production container using the new image
$COMPOSE up -d

# Wait a moment for container to start, then follow logs
sleep 5
$COMPOSE logs -f
