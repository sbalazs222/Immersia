FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci

COPY apps/backend apps/backend
COPY packages/shared packages/shared

WORKDIR /app/apps/backend

CMD ["node", "src/index.js"]