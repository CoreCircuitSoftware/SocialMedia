#!/bin/bash
# scripts/dev-rds.sh
# Start development with AWS RDS connection

echo "Starting LOCAL development (AWS RDS connection)..."
echo ""

# Check if .env.rds.local exists
if [ ! -f .env.rds.local ]; then
    echo "Error: .env.rds.local not found!"
    echo "   Create it from .env.rds.local.template first."
    exit 1
fi

# Verify critical settings
if grep -q "CHANGE-THIS" .env.rds.local; then
    echo "Error: .env.rds.local contains default values!"
    echo "   Please update DATABASE_HOST and DATABASE_PASSWORD."
    exit 1
fi

# Copy RDS environment
cp .env.rds.local .env

echo "✓ Using .env.rds.local configuration"
echo "✓ Database: AWS RDS"
echo ""
echo "Make sure your IP is allowed in RDS security group!"
echo "   Your IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Unable to detect')"
echo ""

# Start without db service (no --profile local)
docker-compose up --build

# Note: Ctrl+C to stop
