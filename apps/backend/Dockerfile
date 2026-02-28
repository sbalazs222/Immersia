FROM node:20-alpine AS base
WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY package*.json ./

COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --omit=dev

COPY apps/backend apps/backend
COPY packages/shared packages/shared

WORKDIR /app/apps/backend
USER 1000:1000

ENTRYPOINT ["/entrypoint.sh"]