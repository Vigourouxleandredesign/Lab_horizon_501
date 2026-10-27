# Restauration Lab Horizon (Windows, PowerShell 5.1 ou 7) depuis une archive de backup.ps1/.sh.
#
#   powershell -ExecutionPolicy Bypass -File scripts\deploy\restore.ps1 backups\labhorizon-AAAAMMJJ-HHMMSS.tar.gz
#   ... -Yes   (sans question, pour un script)
#
# REMPLACE la base et les fichiers uploadés actuels par ceux de l'archive.
# Même comportement que scripts/deploy/restore.sh. Doc : docs/passation/04-plan-maintenance.md
param(
    [Parameter(Mandatory = $true)][string]$Archive,
    [switch]$Yes
)

$ErrorActionPreference = 'Stop'
# Chemin de l'archive résolu depuis le dossier courant de l'appelant, avant de changer de dossier.
if (-not (Test-Path $Archive)) { throw "Archive introuvable : $Archive" }
$Archive = (Resolve-Path $Archive).Path
Set-Location (Resolve-Path (Join-Path $PSScriptRoot '..\..'))

function Invoke-Native {
    & $args[0] $args[1..($args.Count - 1)]
    if ($LASTEXITCODE -ne 0) { throw "Echec : $($args -join ' ')" }
}

# tar de Windows, chemin explicite (voir backup.ps1).
$tar = Join-Path $env:SystemRoot 'System32\tar.exe'

if (-not $Yes) {
    $answer = Read-Host "La base et les fichiers actuels seront REMPLACES par $Archive. Taper OUI pour continuer"
    if ($answer -cne 'OUI') { Write-Output 'Annule.'; exit 1 }
}

$work = Join-Path ([IO.Path]::GetTempPath()) ("labhorizon-restore-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $work | Out-Null
try {
    Invoke-Native $tar xzf $Archive -C $work

    Write-Output 'Base MySQL...'
    Invoke-Native docker compose cp "$work\db.sql.gz" mysql:/tmp/db.sql.gz
    Invoke-Native docker compose exec -T mysql bash -c 'set -o pipefail; gunzip -c /tmp/db.sql.gz | MYSQL_PWD=$MYSQL_ROOT_PASSWORD mysql -u root; rc=$?; rm -f /tmp/db.sql.gz; exit $rc'

    Write-Output 'Fichiers uploades...'
    Invoke-Native docker compose cp "$work\storage.tar.gz" backend:/tmp/storage.tar.gz
    Invoke-Native docker compose exec -T backend tar xzf /tmp/storage.tar.gz -C /var/www/html/storage/app
    # Fichier copie par docker cp = propriete de root : nettoyage en root.
    Invoke-Native docker compose exec -T -u root backend rm -f /tmp/storage.tar.gz

    # Redemarrage du back : reapplique APP_BOOT_PASSWORD du .env au compte de demo (l'archive contient
    # l'ancien) et joue les migrations si l'archive vient d'une version plus ancienne.
    Write-Output 'Redemarrage du back...'
    Invoke-Native docker compose restart backend
    Invoke-Native docker compose up -d --wait --wait-timeout 300 backend

    Write-Output "Restauration terminee : $Archive"
}
finally {
    Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
}
