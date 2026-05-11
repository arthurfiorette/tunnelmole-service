# Stage 1: Build
FROM node:lts-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:lts-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# Bake in the example config as a default so the container can start without a volume mount.
# For production, mount your own config-instance.toml: -v ./config-instance.toml:/app/config-instance.toml:ro
COPY config-instance.example.toml ./config-instance.toml
EXPOSE 8000 8080
CMD ["node", "dist/srv/index.js"]
