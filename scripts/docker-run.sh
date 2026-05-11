#!/usr/bin/env bash
set -euo pipefail

IMAGE="ghcr.io/arthurfiorette/tunnelmole-service:latest"

# Build the image locally (skip if you already pulled it)
docker build -t "$IMAGE" .

if [[ ! -f config-instance.toml ]]; then
  echo "Error: config-instance.toml not found. Copy config-instance.example.toml and edit it first."
  exit 1
fi

# Run the service, optionally overriding env vars
docker run --rm \
  -p 8000:8000 \
  -p 8080:8080 \
  -e TUNNELMOLE_LOG_LEVEL="${TUNNELMOLE_LOG_LEVEL:-}" \
  -e LOG_CONNECTION_INFO="${LOG_CONNECTION_INFO:-}" \
  -v "$(pwd)/config-instance.toml:/app/config-instance.toml:ro" \
  "$IMAGE"
