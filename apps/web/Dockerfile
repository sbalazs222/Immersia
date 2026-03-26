# --- Stage 1: Dependencies ---
FROM node:20-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/web/package.json apps/web/package.json

RUN npm ci

RUN npm install @rollup/rollup-linux-x64-musl

COPY apps/web ./apps/web

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build -w apps/web

# --- Stage 2: Runtime ---
FROM nginx:alpine

COPY --from=build /usr/src/app/apps/web/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]