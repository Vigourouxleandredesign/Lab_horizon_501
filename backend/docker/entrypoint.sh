#!/bin/bash
set -e

cd /var/www/html

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        touch .env
    fi
fi

# APP_KEY vide dans l'environnement Compose écrase le .env : on la retire avant génération.
if [ -z "${APP_KEY}" ]; then
    unset APP_KEY
    php artisan key:generate --force
fi

php artisan storage:link || true

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force
fi

# Idempotent : LocalContentSeeder no-op si des recherches existent déjà.
if [ "${RUN_SEED:-true}" = "true" ]; then
    php artisan db:seed --force
fi

# route:cache impossible : routes/web.php contient des closures (/files, dashboard, HAL).
if [ "${APP_ENV:-production}" != "local" ]; then
    php artisan config:cache
    php artisan view:cache
fi

exec "$@"
