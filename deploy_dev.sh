#!/bin/bash

docker stop eventify-next 2>/dev/null || true

# Force remove the container if it still exists
docker rm -f eventify-next 2>/dev/null || true

# Stops running containers and removes them
docker compose -f docker-compose.dev.yml down --remove-orphans

# Remove the old next_cache volume if it exists (enables hot reload)
docker volume rm frontend_next_cache 2>/dev/null || true

# Starts the dev container (runs "npm run dev" - no rebuild)
docker compose -f docker-compose.dev.yml up -d

# Wait a moment for container to start, then follow logs
sleep 5
docker compose -f docker-compose.dev.yml logs --tail=100 -f
