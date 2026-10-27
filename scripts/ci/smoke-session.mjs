#!/usr/bin/env node
/**
 * D-docker — une session reste valide après redémarrage du back (APP_KEY stable, sessions en base).
 *
 *   node scripts/ci/smoke-session.mjs register <base> <fichier>   inscrit un compte, garde les cookies
 *   (docker compose restart backend)
 *   node scripts/ci/smoke-session.mjs check <base> <fichier>      /api/me doit répondre 200
 *
 * Compte ordinaire créé pour l'occasion : le compte de démo est réécrit à chaque démarrage.
 * HTTPS auto-signé : NODE_EXTRA_CA_CERTS=<tls.crt>. Doc : docs/TESTING.md
 */
import { readFileSync, writeFileSync } from 'node:fs'

const [mode, base, file] = process.argv.slice(2)
if (!['register', 'check'].includes(mode) || !base || !file) {
  console.error('Usage : smoke-session.mjs register|check <base> <fichier>')
  process.exit(2)
}

const jar = new Map(mode === 'check' ? JSON.parse(readFileSync(file, 'utf8')) : [])

function store(response) {
  for (const cookie of response.headers.getSetCookie()) {
    const [pair] = cookie.split(';')
    const eq = pair.indexOf('=')
    jar.set(pair.slice(0, eq), pair.slice(eq + 1))
  }
}

function headers() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Cookie: [...jar].map(([k, v]) => `${k}=${v}`).join('; '),
    'X-XSRF-TOKEN': decodeURIComponent(jar.get('XSRF-TOKEN') ?? ''),
    Origin: base,
    Referer: base,
  }
}

if (mode === 'register') {
  store(await fetch(`${base}/sanctum/csrf-cookie`, { headers: headers() }))
  const password = `Ci-${Date.now()}-Session!`
  const response = await fetch(`${base}/api/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      name: 'CI session',
      email: `ci-session-${Date.now()}@labhorizon.nc`,
      password,
      password_confirmation: password,
    }),
  })
  store(response)
  if (response.status !== 201) {
    console.error(`Inscription refusée : HTTP ${response.status}`)
    process.exit(1)
  }
  writeFileSync(file, JSON.stringify([...jar]))
  console.log('OK — compte créé, session enregistrée')
} else {
  const response = await fetch(`${base}/api/me`, { headers: headers() })
  if (response.status !== 200) {
    console.error(`Session perdue après redémarrage : /api/me → HTTP ${response.status}`)
    process.exit(1)
  }
  console.log('OK — session toujours valide après redémarrage du back')
}
