FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY package*.json ./

COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --omit=dev --include=optional --os=linux --libc=musl --cpu=x64

COPY apps/backend apps/backend
COPY packages/shared packages/shared

WORKDIR /app/apps/backend

ENTRYPOINT ["/entrypoint.sh"]