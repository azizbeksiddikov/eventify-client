#!/bin/bash

# Stops running containers
docker compose -f docker-compose.prod.yml down

# Builds the pure production image (no dev dependencies)
docker compose -f docker-compose.prod.yml build

# Starts the production container using the new image
docker compose -f docker-compose.prod.yml up -d

# Follows the logs
docker compose -f docker-compose.prod.yml logs -f
