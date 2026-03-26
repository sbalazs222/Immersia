# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

RUN npm ci --omit=dev --include=optional --libc=musl
RUN npm install --include=optional --libc=musl sharp

# --- Stage 2: Runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache su-exec

COPY --from=deps /app/node_modules ./node_modules

COPY --chown=1000:1000 . .

RUN chmod +x /app/entrypoint.sh

USER 1000
WORKDIR /app/apps/backend
ENTRYPOINT ["/app/entrypoint.sh"]