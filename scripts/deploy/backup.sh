#!/bin/sh
# Sauvegarde Lab Horizon (Linux, macOS, WSL) : base MySQL + fichiers uploadés (PDF).
#
#   sh scripts/deploy/backup.sh          → backups/labhorizon-AAAAMMJJ-HHMMSS.tar.gz
#
# - Stack démarrée requise (docker compose up -d). Aucun mot de passe sur la ligne de commande :
#   le dump utilise le compte root depuis l'environnement du conteneur MySQL.
# - Garde les 14 dernières sauvegardes (BACKUP_KEEP=30 sh … pour changer).
# - Les sauvegardes contiennent les comptes (hash des mots de passe) : backups/ est hors Git,
#   à copier hors de la machine (disque externe, autre serveur).
# Restauration : scripts/deploy/restore.sh. Équivalent Windows : backup.ps1.
# Doc : docs/passation/04-plan-maintenance.md
set -eu
# Git Bash (Windows) convertit les chemins /var/… passés à docker : on le désactive.
export MSYS_NO_PATHCONV=1

cd "$(dirname "$0")/../.."
keep=${BACKUP_KEEP:-14}
stamp=$(date +%Y%m%d-%H%M%S)
archive="backups/labhorizon-$stamp.tar.gz"
work="backups/.en-cours-$stamp"

mkdir -p backups
chmod 700 backups
mkdir "$work"
trap 'rm -rf "$work"' EXIT

echo "Base MySQL…"
docker compose exec -T mysql bash -c 'set -o pipefail; MYSQL_PWD=$MYSQL_ROOT_PASSWORD mysqldump -u root --single-transaction --routines --triggers --no-tablespaces --databases $MYSQL_DATABASE | gzip > /tmp/db.sql.gz'
docker compose cp mysql:/tmp/db.sql.gz "$work/db.sql.gz" > /dev/null
docker compose exec -T mysql rm -f /tmp/db.sql.gz

echo "Fichiers uploadés…"
# Fichiers temporaires du conteneur manipulés en root : pas de conflit de propriétaire avec
# une copie docker cp précédente (root) ; la lecture de storage/app reste possible.
docker compose exec -T -u root backend tar czf /tmp/storage.tar.gz -C /var/www/html/storage/app .
docker compose cp backend:/tmp/storage.tar.gz "$work/storage.tar.gz" > /dev/null
docker compose exec -T -u root backend rm -f /tmp/storage.tar.gz

gzip -t "$work/db.sql.gz"
tar czf "$archive" -C "$work" db.sql.gz storage.tar.gz
chmod 600 "$archive"
echo "Sauvegarde : $archive ($(du -h "$archive" | cut -f1))"

# Rotation : on garde les $keep plus récentes.
n=0
for old in $(ls -1t backups/labhorizon-*.tar.gz); do
    n=$((n + 1))
    if [ "$n" -gt "$keep" ]; then rm -f -- "$old" && echo "Supprimée (rotation) : $old"; fi
done
