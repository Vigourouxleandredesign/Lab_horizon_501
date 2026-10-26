# syntax=docker/dockerfile:1
# Front React (Vite) servi par Nginx, qui reverse-proxy /api /sanctum /files vers le back.

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_DATA_SOURCE=rest
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_DATA_SOURCE=$VITE_DATA_SOURCE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Variante officielle sans root (utilisateur nginx, uid 101) : port 8080 dans le conteneur.
FROM nginxinc/nginx-unprivileged:1.30-alpine

# Patchs de sécurité OS publiés après la sortie de l'image de base (scan Trivy en CI).
USER root
RUN apk upgrade --no-cache
USER 101

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
