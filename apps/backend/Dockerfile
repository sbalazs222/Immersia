FROM node:20-alpine AS base
WORKDIR /app

# Install build essentials for native modules
RUN apk add --no-cache libc6-compat su-exec python3 make g++

# 1. Copy ALL files (required for monorepo linking)
COPY . .

# 2. Clean install specifically for the Alpine environment
# Removing --cpu and --os allows npm to auto-detect the container's environment
RUN npm ci --omit=dev --include=optional --libc=musl

# 3. Explicitly install sharp one more time as a 'failsafe'
RUN npm install --include=optional --libc=musl sharp

# 4. Set permissions
RUN chown -R 1000:1000 /app && chmod +x /app/entrypoint.sh

WORKDIR /app/apps/backend
ENTRYPOINT ["/app/entrypoint.sh"]