# syntax=docker/dockerfile:1
# Front React (Vite) servi par Nginx, qui reverse-proxy /api /sanctum /files vers le back.

FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_DATA_SOURCE=rest
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_DATA_SOURCE=$VITE_DATA_SOURCE
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
