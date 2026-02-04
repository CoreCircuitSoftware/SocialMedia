#!/bin/bash
# scripts/deploy-production.sh
# Deploy to production on EC2

echo "Deploying to PRODUCTION..."
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "Error: .env.production not found!"
    echo "   Create it from .env.production.template first."
    exit 1
fi

# Verify critical settings
if grep -q "CHANGE-THIS" .env.production; then
    echo "Error: .env.production contains default values!"
    echo "   Please update SECRET_KEY, DATABASE_HOST, and DATABASE_PASSWORD."
    exit 1
fi

if grep -q "DEBUG=1" .env.production; then
    echo "WARNING: DEBUG is enabled in production!"
    read -p "   Continue anyway? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        exit 1
    fi
fi

# Copy production environment
cp .env.production .env

echo "✓ Using .env.production configuration"
echo "✓ Database: AWS RDS"
echo "✓ Debug mode: OFF"
echo ""

# Use production docker-compose
docker-compose -f docker-compose.prod.yml up --build -d

echo ""
echo "✓ Production deployment started!"
echo ""
echo "Check status: docker-compose -f docker-compose.prod.yml ps"
echo "View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo ""
