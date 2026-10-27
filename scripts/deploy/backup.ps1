# Sauvegarde Lab Horizon (Windows, PowerShell 5.1 ou 7) : base MySQL + fichiers uploadés (PDF).
#
#   powershell -ExecutionPolicy Bypass -File scripts\deploy\backup.ps1
#     -> backups\labhorizon-AAAAMMJJ-HHMMSS.tar.gz
#
# Même comportement que scripts/deploy/backup.sh (14 dernières gardées, -Keep pour changer).
# Restauration : restore.ps1. Doc : docs/passation/04-plan-maintenance.md
param([int]$Keep = 14)

$ErrorActionPreference = 'Stop'
Set-Location (Resolve-Path (Join-Path $PSScriptRoot '..\..'))

function Invoke-Native {
    & $args[0] $args[1..($args.Count - 1)]
    if ($LASTEXITCODE -ne 0) { throw "Echec : $($args -join ' ')" }
}

# tar de Windows (10 1803+), chemin explicite : le tar GNU de Git for Windows, s'il est dans le
# PATH, prend « C:\… » pour un serveur distant.
$tar = Join-Path $env:SystemRoot 'System32\tar.exe'

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archive = "backups\labhorizon-$stamp.tar.gz"
$work = "backups\.en-cours-$stamp"
New-Item -ItemType Directory -Force -Path $work | Out-Null

try {
    Write-Output 'Base MySQL...'
    Invoke-Native docker compose exec -T mysql bash -c 'set -o pipefail; MYSQL_PWD=$MYSQL_ROOT_PASSWORD mysqldump -u root --single-transaction --routines --triggers --no-tablespaces --databases $MYSQL_DATABASE | gzip > /tmp/db.sql.gz'
    Invoke-Native docker compose cp mysql:/tmp/db.sql.gz "$work\db.sql.gz"
    Invoke-Native docker compose exec -T mysql rm -f /tmp/db.sql.gz

    Write-Output 'Fichiers uploades...'
    # Fichiers temporaires du conteneur manipules en root (pas de conflit de proprietaire).
    Invoke-Native docker compose exec -T -u root backend tar czf /tmp/storage.tar.gz -C /var/www/html/storage/app .
    Invoke-Native docker compose cp backend:/tmp/storage.tar.gz "$work\storage.tar.gz"
    Invoke-Native docker compose exec -T -u root backend rm -f /tmp/storage.tar.gz

    Invoke-Native $tar czf $archive -C $work db.sql.gz storage.tar.gz
    $bytes = (Get-Item $archive).Length
    $size = if ($bytes -ge 1MB) { '{0:N1} Mo' -f ($bytes / 1MB) } else { '{0:N0} Ko' -f [math]::Ceiling($bytes / 1KB) }
    Write-Output "Sauvegarde : $archive ($size)"
}
finally {
    Remove-Item -Recurse -Force $work -ErrorAction SilentlyContinue
}

# Rotation : on garde les $Keep plus recentes.
Get-ChildItem backups -Filter 'labhorizon-*.tar.gz' | Sort-Object LastWriteTime -Descending |
    Select-Object -Skip $Keep | ForEach-Object {
        Remove-Item $_.FullName
        Write-Output "Supprimee (rotation) : $($_.Name)"
    }
