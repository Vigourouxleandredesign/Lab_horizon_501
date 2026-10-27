# Crée ou complète le .env de déploiement (Windows, PowerShell 5.1 ou 7).
#
#   powershell -ExecutionPolicy Bypass -File scripts\deploy\init-env.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\deploy\init-env.ps1 https://192.168.1.20
#
# Même comportement que scripts/deploy/init-env.sh :
# - .env absent : copié depuis .env.docker.example.
# - Secrets vides (APP_KEY, DB_PASSWORD, DB_ROOT_PASSWORD, APP_BOOT_PASSWORD) : générés.
#   Un secret déjà rempli n'est jamais modifié (changer APP_KEY déconnecte tout le monde).
# - Adresse passée en argument : APP_URL, ports, SANCTUM, CORS et TLS_SAN réglés en conséquence.
# Doc : docs/passation/02-lancer-et-relancer.md
param([string]$Url)

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$envFile = Join-Path $root '.env'
$utf8 = New-Object System.Text.UTF8Encoding($false)  # sans BOM : lu par docker compose

if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $root '.env.docker.example') $envFile
    Write-Output "Cree : .env (depuis .env.docker.example)"
}

$script:lines = [System.Collections.Generic.List[string]]([IO.File]::ReadAllLines($envFile, $utf8))

function Get-Var([string]$key) {
    $value = ''
    foreach ($line in $script:lines) { if ($line.StartsWith("$key=")) { $value = $line.Substring($key.Length + 1) } }
    return $value
}

function Set-Var([string]$key, [string]$value) {
    for ($i = 0; $i -lt $script:lines.Count; $i++) {
        if ($script:lines[$i].StartsWith("$key=")) { $script:lines[$i] = "$key=$value"; return }
    }
    $script:lines.Add("$key=$value")
}

$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
function New-RandomBytes([int]$count) { $b = New-Object byte[] $count; $rng.GetBytes($b); return $b }
function New-RandomHex([int]$count) { return (-join ((New-RandomBytes $count) | ForEach-Object { $_.ToString('x2') })) }

$generated = @()
function Set-SecretIfEmpty([string]$key, [string]$value) {
    if ([string]::IsNullOrEmpty((Get-Var $key))) { Set-Var $key $value; $script:generated += $key }
}

Set-SecretIfEmpty 'APP_KEY' ('base64:' + [Convert]::ToBase64String((New-RandomBytes 32)))
Set-SecretIfEmpty 'DB_PASSWORD' (New-RandomHex 24)
Set-SecretIfEmpty 'DB_ROOT_PASSWORD' (New-RandomHex 24)
Set-SecretIfEmpty 'APP_BOOT_PASSWORD' (New-RandomHex 10)

if ($Url) {
    $u = $Url.TrimEnd('/')
    if ($u -notmatch '^https://([^:/]+)(?::(\d+))?$') {
        throw "Adresse invalide : $Url (attendu : https://hote ou https://hote:port)"
    }
    $hostName = $Matches[1]
    $port = if ($Matches[2]) { $Matches[2] } else { '443' }
    if ($port -eq '443') { $httpPort = '80'; $site = $hostName } else { $httpPort = '8080'; $site = "${hostName}:$port" }
    $san = if ($hostName -match '^\d+(\.\d+){3}$') { "IP:$hostName" } else { "DNS:$hostName" }

    Set-Var 'APP_URL' "https://$site"
    Set-Var 'HTTPS_PORT' $port
    Set-Var 'HTTP_PORT' $httpPort
    Set-Var 'SANCTUM_STATEFUL_DOMAINS' $site
    Set-Var 'CORS_ALLOWED_ORIGINS' "https://$site"
    if ($hostName -ne 'localhost') { Set-Var 'TLS_SAN' $san }
    Write-Output "Adresse : https://$site (HTTP $httpPort -> HTTPS $port)"
}

[IO.File]::WriteAllText($envFile, (($script:lines -join "`n") + "`n"), $utf8)

Write-Output ''
if ($generated.Count) { Write-Output ("Secrets generes : " + ($generated -join ' ')) }
Write-Output ("Site                : " + (Get-Var 'APP_URL'))
Write-Output  "Compte              : test@labhorizon.nc"
Write-Output ("Mot de passe        : " + (Get-Var 'APP_BOOT_PASSWORD'))
Write-Output ''
Write-Output 'Suite : docker compose up -d --build'
