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

# Le seed pose un mot de passe de démo connu. On le remplace tout de suite,
# y compris si le volume existe déjà. Sans variable, on refuse de démarrer.
if [ -z "${APP_BOOT_PASSWORD}" ]; then
    echo "APP_BOOT_PASSWORD manquant : le mot de passe de démo ne doit pas rester en place." >&2
    exit 1
fi

php -r '
require "vendor/autoload.php";
$app = require "bootstrap/app.php";
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$email = "test@labhorizon.nc";
$user = App\Models\User::query()->where("email", $email)->first();
if ($user === null) {
    fwrite(STDERR, "Compte {$email} introuvable après le seed.\n");
    exit(1);
}
$user->password = Illuminate\Support\Facades\Hash::make((string) getenv("APP_BOOT_PASSWORD"));
$user->save();
fwrite(STDOUT, "Mot de passe applicatif appliqué pour {$email}.\n");
'

# route:cache impossible : routes/web.php contient des closures (/files, dashboard, HAL).
if [ "${APP_ENV:-production}" != "local" ]; then
    php artisan config:cache
    php artisan view:cache
fi

# Le conteneur tourne déjà en www-data (USER du Dockerfile) : tout ce qui est créé ici lui appartient.
mkdir -p storage/logs
touch storage/logs/php-fpm.log storage/logs/php-fpm.access.log

exec "$@"
