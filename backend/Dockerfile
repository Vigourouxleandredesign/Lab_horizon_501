# syntax=docker/dockerfile:1
# Image Laravel (PHP-FPM + Nginx + worker Redis) — adaptée du Docker.zip fourni par le back.
# Contexte de build : dossier backend/

##############################
# 1) Assets Blade (Vite / Tailwind / Alpine) — pas le front React
##############################
FROM node:22-alpine AS node-build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources ./resources
COPY vite.config.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./

RUN npm run build

##############################
# 2) Dépendances PHP (Composer)
##############################
FROM composer:2 AS composer-build

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --no-interaction

COPY . .

# dump-autoload lance aussi les scripts Composer (package:discover) : une erreur fait échouer le build.
RUN composer dump-autoload --optimize --no-dev --no-interaction

##############################
# 3) Image finale PHP-FPM + Nginx
##############################
FROM php:8.3-fpm-alpine AS final

# Patchs de sécurité OS publiés après la sortie de l'image de base (scan Trivy en CI).
# Bibliothèques d'exécution seules dans l'image finale ; les en-têtes -dev ne servent qu'à
# compiler les extensions et partent avec .build-deps. mbstring est déjà inclus dans l'image PHP.
RUN apk upgrade --no-cache \
    && apk add --no-cache \
        nginx \
        supervisor \
        bash \
        curl \
        mysql-client \
        libzip \
        libpng \
        libjpeg-turbo \
        freetype \
        icu-libs \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        libzip-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /tmp/pear \
    && apk del .build-deps

RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=10000'; \
    echo 'opcache.validate_timestamps=0'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

WORKDIR /var/www/html

COPY --from=composer-build /app /var/www/html
COPY --from=node-build /app/public/build /var/www/html/public/build

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/docker.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN mkdir -p /var/www/html/storage/framework/sessions \
        /var/www/html/storage/framework/views \
        /var/www/html/storage/framework/cache/data \
        /var/www/html/storage/framework/testing \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Le conteneur tourne sans root (www-data) : le code reste à root (lecture seule pour l'appli),
# seuls .env, storage, bootstrap/cache et les dossiers d'exécution de nginx sont inscriptibles.
RUN { [ -f .env ] || cp .env.example .env 2>/dev/null || touch .env; } \
    && chown www-data:www-data .env \
    && ln -sfn /var/www/html/storage/app/public /var/www/html/public/storage \
    && mkdir -p /run/nginx /var/lib/nginx/tmp /var/log/nginx \
    && chown -R www-data:www-data /run/nginx /var/lib/nginx /var/log/nginx

USER www-data

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --retries=12 --start-period=50s \
  CMD curl -fsS http://127.0.0.1:8080/up || exit 1

ENTRYPOINT ["entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
