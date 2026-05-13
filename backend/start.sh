#!/bin/bash
# Conance Backend Startup Script

echo "🚀 Starting Conance Infrastructure..."
docker-compose up -d

echo "📦 Installing dependencies..."
go mod tidy

echo "🏗️ Building server..."
go build -o conance-server cmd/api/main.go

echo "✅ Startup complete! API is running on http://localhost:8080"
./conance-server
