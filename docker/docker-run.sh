#!/usr/bin/env bash
# Simple alternative to Docker Compose: run the service with docker run.
# Copy config-instance.example.toml to config.toml and edit it first.
set -euo pipefail

if [[ ! -f config.toml ]]; then
  echo "Error: config.toml not found. Copy config-instance.example.toml and edit it first."
  exit 1
fi

docker run --rm \
  -p 8000:8000 \
  -p 8080:8080 \
  -e TUNNELMOLE_LOG_LEVEL="${TUNNELMOLE_LOG_LEVEL:-}" \
  -e LOG_CONNECTION_INFO="${LOG_CONNECTION_INFO:-}" \
  -v "$(pwd)/config.toml:/app/config-instance.toml:ro" \
  ghcr.io/robbie-cahill/tunnelmole-service:latest
