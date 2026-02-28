# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# 1. Copy manifest files
COPY package*.json ./
COPY apps/web/package.json apps/web/package.json

# 2. Install dependencies (strict)
RUN npm ci

# 3. FORCE install the missing Alpine-specific rollup binary 
# This bypasses the "npm bug" mentioned in your error log
RUN npm install @rollup/rollup-linux-x64-musl

# 4. Copy source and build
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build -w apps/web

# Stage 2: serve static files
FROM nginx:alpine
# In many setups, the build output is in apps/web/dist
COPY --from=build /usr/src/app/apps/web/dist /usr/share/nginx/html

# OVERWRITE the main nginx.conf to support your custom http/events blocks
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]