#!/bin/bash

# Stops running containers and removes them
docker compose -f docker-compose.dev.yml down

# Rebuilds the dev image and starts it in the background
docker compose -f docker-compose.dev.yml up -d --build

# Follows the logs
docker compose -f docker-compose.dev.yml logs -f
