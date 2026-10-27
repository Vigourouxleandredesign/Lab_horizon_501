#!/bin/sh
# Crée ou complète le .env de déploiement (Linux, macOS, WSL).
#
#   sh scripts/deploy/init-env.sh                         essai local : https://localhost:8443
#   sh scripts/deploy/init-env.sh https://192.168.1.20    serveur joint par son IP (ports 80/443)
#   sh scripts/deploy/init-env.sh https://labhorizon.exemple.nc
#
# - .env absent : copié depuis .env.docker.example.
# - Secrets vides (APP_KEY, DB_PASSWORD, DB_ROOT_PASSWORD, APP_BOOT_PASSWORD) : générés.
#   Un secret déjà rempli n'est jamais modifié (changer APP_KEY déconnecte tout le monde).
# - Adresse passée en argument : APP_URL, ports, SANCTUM, CORS et TLS_SAN réglés en conséquence.
# Équivalent Windows : scripts/deploy/init-env.ps1. Doc : docs/passation/02-lancer-et-relancer.md
set -eu

cd "$(dirname "$0")/../.."
env_file=.env

if [ ! -f "$env_file" ]; then
    cp .env.docker.example "$env_file"
    echo "Créé : $env_file (depuis .env.docker.example)"
fi
chmod 600 "$env_file"

get_var() { sed -n "s/^$1=//p" "$env_file" | tail -n 1; }

set_var() {
    awk -v k="$1" -v v="$2" '
        index($0, k "=") == 1 { print k "=" v; done = 1; next }
        { print }
        END { if (!done) print k "=" v }
    ' "$env_file" > "$env_file.tmp"
    mv "$env_file.tmp" "$env_file"
    chmod 600 "$env_file"
}

random_hex() { od -An -N24 -tx1 /dev/urandom | tr -d ' \n'; }

generated=""
fill_secret() {
    if [ -z "$(get_var "$1")" ]; then
        set_var "$1" "$2"
        generated="$generated $1"
    fi
}

fill_secret APP_KEY "base64:$(head -c 32 /dev/urandom | base64 | tr -d '\n')"
fill_secret DB_PASSWORD "$(random_hex)"
fill_secret DB_ROOT_PASSWORD "$(random_hex)"
fill_secret APP_BOOT_PASSWORD "$(random_hex | cut -c1-20)"

if [ "$#" -ge 1 ]; then
    url=${1%/}
    case "$url" in
        https://*) ;;
        *) echo "Adresse invalide : $1 (attendu : https://hôte ou https://hôte:port)" >&2; exit 1 ;;
    esac
    hostport=${url#https://}
    host=${hostport%%:*}
    port=443
    [ "$host" != "$hostport" ] && port=${hostport#*:}

    if [ "$port" = 443 ]; then http_port=80; site="$host"; else http_port=8080; site="$host:$port"; fi
    if printf '%s' "$host" | grep -Eq '^[0-9]+(\.[0-9]+){3}$'; then san="IP:$host"; else san="DNS:$host"; fi

    set_var APP_URL "https://$site"
    set_var HTTPS_PORT "$port"
    set_var HTTP_PORT "$http_port"
    set_var SANCTUM_STATEFUL_DOMAINS "$site"
    set_var CORS_ALLOWED_ORIGINS "https://$site"
    [ "$host" != localhost ] && set_var TLS_SAN "$san"
    echo "Adresse : https://$site (HTTP $http_port → HTTPS $port)"
fi

echo
[ -n "$generated" ] && echo "Secrets générés :$generated"
echo "Site                : $(get_var APP_URL)"
echo "Compte              : test@labhorizon.nc"
echo "Mot de passe        : $(get_var APP_BOOT_PASSWORD)"
echo
echo "Suite : docker compose up -d --build"
