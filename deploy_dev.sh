#!/bin/bash

# Stops running containers and removes them
docker compose -f docker-compose.dev.yml down

# Remove the old next_cache volume if it exists (enables hot reload)
docker volume rm frontend_next_cache 2>/dev/null || true

# Starts the dev container (runs "npm run dev" - no rebuild)
docker compose -f docker-compose.dev.yml up -d

# Follows the logs
docker compose -f docker-compose.dev.yml logs -f
