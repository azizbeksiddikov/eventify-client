#!/bin/bash

docker stop eventify-next 2>/dev/null || true

# Force remove the container if it still exists
docker rm -f eventify-next 2>/dev/null || true

# Stops running containers and removes them
docker compose -f docker-compose.prod.yml down --remove-orphans

# Builds the pure production image (no dev dependencies)
docker compose -f docker-compose.prod.yml build

# Clean up dangling images (old images that lost their tags)
docker image prune -f

# Starts the production container using the new image
docker compose -f docker-compose.prod.yml up -d

# Wait a moment for container to start, then follow logs
sleep 5
docker compose -f docker-compose.prod.yml logs -f
