#!/bin/bash

set -e

# Eventify Frontend Docker Cleanup Script

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker daemon is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Find frontend containers (both dev and prod)
FRONTEND_CONTAINERS=$(docker ps -aq --filter "name=eventify-next")

if [ -z "$FRONTEND_CONTAINERS" ]; then
    echo "No frontend containers found"
else
    # Show containers that will be removed
    echo "Found frontend containers (dev and prod):"
    docker ps -a --filter "name=eventify-next" --format "   - {{.Names}} ({{.ID}})" || true
    echo ""
    
    # Stop frontend containers
    echo "Stopping frontend containers..."
    docker stop $FRONTEND_CONTAINERS 2>/dev/null || true
    
    # Remove frontend containers
    echo "Removing frontend containers..."
    docker rm $FRONTEND_CONTAINERS 2>/dev/null || true
    
    echo "Removed frontend containers successfully!"
fi

# Remove frontend images (both dev and prod)
echo "Removing frontend images..."
FRONTEND_IMAGES=$(docker images -q --filter "reference=eventify-next*")
if [ ! -z "$FRONTEND_IMAGES" ]; then
    echo "Found images to remove:"
    docker images --filter "reference=eventify-next*" --format "   - {{.Repository}}:{{.Tag}} ({{.ID}})" || true
    echo ""
    docker rmi $FRONTEND_IMAGES 2>/dev/null || true
    echo "Removed frontend images successfully!"
else
    echo "No frontend images found"
fi

echo ""
echo "Frontend cleanup complete!"
echo ""
echo "Remaining frontend resources:"
FRONTEND_REMAINING=$(docker ps -aq --filter "name=eventify-next")
if [ -z "$FRONTEND_REMAINING" ]; then
    echo "  Containers: 0"
else
    echo "  Containers: $(echo "$FRONTEND_REMAINING" | wc -l | tr -d ' ')"
fi
