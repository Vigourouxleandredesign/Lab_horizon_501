#!/bin/sh
# Certificat TLS du front, avant le démarrage de nginx.
# - Le serveur fournit tls.crt + tls.key dans /etc/nginx/certs : ils sont utilisés tels quels.
# - Sinon : certificat auto-signé généré une fois, conservé dans le volume frontend-certs.
#   TLS_SAN ajoute des noms ou IP au certificat, ex. "IP:192.168.1.20,DNS:labhorizon.local".
set -eu

dir=/etc/nginx/certs
if [ -s "$dir/tls.crt" ] && [ -s "$dir/tls.key" ]; then
    echo "TLS : certificat présent dans $dir"
    exit 0
fi

san="DNS:localhost,IP:127.0.0.1${TLS_SAN:+,$TLS_SAN}"
umask 077
openssl req -x509 -nodes -days 825 \
    -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
    -subj "/CN=Lab Horizon (certificat auto-signe)" \
    -addext "subjectAltName=$san" \
    -addext "extendedKeyUsage=serverAuth" \
    -keyout "$dir/tls.key" -out "$dir/tls.crt" 2>/dev/null
chmod 644 "$dir/tls.crt"
echo "TLS : certificat auto-signé généré ($san)"
