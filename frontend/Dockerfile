# syntax=docker/dockerfile:1
# Front React (Vite) servi par Nginx en HTTPS, qui reverse-proxy /api /sanctum /files vers le back.

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_DATA_SOURCE=rest
# same-origin : l’API est appelée sur l’adresse de la page → une seule image pour toutes les adresses.
ARG VITE_API_BASE_URL=same-origin
ENV VITE_DATA_SOURCE=$VITE_DATA_SOURCE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Variante officielle sans root (utilisateur nginx, uid 101) : ports 8080 (HTTP → HTTPS) et 8443.
FROM nginxinc/nginx-unprivileged:1.30-alpine

# Patchs de sécurité OS publiés après la sortie de l'image de base (scan Trivy en CI).
# openssl : génération du certificat auto-signé quand le serveur n'en fournit pas.
USER root
RUN apk upgrade --no-cache \
    && apk add --no-cache openssl \
    && mkdir -p /etc/nginx/certs \
    && chown 101:0 /etc/nginx/certs
COPY --chmod=755 docker/15-tls-cert.sh /docker-entrypoint.d/15-tls-cert.sh
USER 101

# Valeurs par défaut, surchargées par docker-compose.yml.
ENV HTTPS_PORT=8443 \
    HSTS_MAX_AGE=0 \
    TLS_SAN=""

COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080 8443

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -q -O /dev/null --no-check-certificate https://127.0.0.1:8443/ || exit 1
