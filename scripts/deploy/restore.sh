#!/bin/sh
# Restauration Lab Horizon (Linux, macOS, WSL) depuis une archive de backup.sh.
#
#   sh scripts/deploy/restore.sh backups/labhorizon-AAAAMMJJ-HHMMSS.tar.gz
#   sh scripts/deploy/restore.sh backups/… --yes        (sans question, pour un script)
#
# REMPLACE la base et les fichiers uploadés actuels par ceux de l'archive.
# Stack démarrée requise (docker compose up -d). Équivalent Windows : restore.ps1.
# Doc : docs/passation/04-plan-maintenance.md
set -eu
# Git Bash (Windows) convertit les chemins /var/… passés à docker : on le désactive.
export MSYS_NO_PATHCONV=1

cd "$(dirname "$0")/../.."
archive=${1:-}
if [ -z "$archive" ] || [ ! -f "$archive" ]; then
    echo "Usage : sh scripts/deploy/restore.sh backups/labhorizon-AAAAMMJJ-HHMMSS.tar.gz [--yes]" >&2
    exit 1
fi

if [ "${2:-}" != "--yes" ]; then
    printf 'La base et les fichiers actuels seront REMPLACÉS par %s. Taper OUI pour continuer : ' "$archive"
    read -r answer
    [ "$answer" = "OUI" ] || { echo "Annulé."; exit 1; }
fi

# Dossier de travail relatif (pas mktemp : /tmp est inconnu de Docker sous Git Bash/Windows).
work="backups/.restauration-$$"
mkdir -p "$work"
trap 'rm -rf "$work"' EXIT
tar xzf "$archive" -C "$work"
gzip -t "$work/db.sql.gz"

echo "Base MySQL…"
docker compose cp "$work/db.sql.gz" mysql:/tmp/db.sql.gz > /dev/null
docker compose exec -T mysql bash -c 'set -o pipefail; gunzip -c /tmp/db.sql.gz | MYSQL_PWD=$MYSQL_ROOT_PASSWORD mysql -u root; rc=$?; rm -f /tmp/db.sql.gz; exit $rc' < /dev/null

echo "Fichiers uploadés…"
docker compose cp "$work/storage.tar.gz" backend:/tmp/storage.tar.gz > /dev/null
docker compose exec -T backend tar xzf /tmp/storage.tar.gz -C /var/www/html/storage/app < /dev/null
# Fichier copié par docker cp = propriété de root : nettoyage en root.
docker compose exec -T -u root backend rm -f /tmp/storage.tar.gz < /dev/null

# Redémarrage du back : réapplique APP_BOOT_PASSWORD du .env au compte de démo (l'archive contient
# l'ancien) et joue les migrations si l'archive vient d'une version plus ancienne.
echo "Redémarrage du back…"
docker compose restart backend > /dev/null 2>&1
docker compose up -d --wait --wait-timeout 300 backend > /dev/null 2>&1

echo "Restauration terminée : $archive"
