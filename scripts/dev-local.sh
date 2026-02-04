#!/bin/bash
# scripts/dev-local.sh
# Start development with local Docker MySQL

echo "Starting LOCAL development (Docker MySQL)..."
echo ""

# Copy local environment
cp .env.local .env

echo "✓ Using .env.local configuration"
echo "✓ Database: Docker MySQL container"
echo ""

# Start with local profile (includes db service)
docker-compose --profile local up --build

# Note: Ctrl+C to stop
