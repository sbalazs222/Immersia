# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /usr/src/app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve static files
FROM nginx:alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]