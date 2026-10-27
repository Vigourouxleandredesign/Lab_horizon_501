/**
 * Test du contrôle A3 lui-même : un scanner qui ne détecte rien passe toujours au vert.
 * Les faux secrets sont générés à l'exécution — rien de sensible n'est versionné.
 *
 *   node --test scripts/ci/
 */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { generateKeyPairSync, randomBytes } from 'node:crypto'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { after, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

const checker = path.join(path.dirname(fileURLToPath(import.meta.url)), 'check-secrets.mjs')
const dir = mkdtempSync(path.join(tmpdir(), 'lab-horizon-secrets-'))
after(() => rmSync(dir, { recursive: true, force: true }))

const alnum = (n) => randomBytes(n * 2).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, n)

function scan(name, content) {
  const file = path.join(dir, name)
  writeFileSync(file, content)
  return spawnSync(process.execPath, [checker, file], { encoding: 'utf8' })
}

describe('check-secrets (A3)', () => {
  it('laisse passer un fichier sain', () => {
    assert.equal(scan('ok.ts', 'export const answer = 42\n').status, 0)
  })

  it('bloque un token GitHub', () => {
    assert.equal(scan('token.ts', `const t = 'ghp_${alnum(36)}'\n`).status, 1)
  })

  it('bloque une clé privée RSA (PKCS#1)', () => {
    const { privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
      publicKeyEncoding: { type: 'spki', format: 'pem' },
    })
    assert.equal(scan('rsa.txt', privateKey).status, 1)
  })

  it('bloque une clé privée PKCS#8 (format OpenSSL par défaut)', () => {
    const { privateKey } = generateKeyPairSync('ed25519', {
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      publicKeyEncoding: { type: 'spki', format: 'pem' },
    })
    assert.equal(scan('ed25519.txt', privateKey).status, 1)
  })

  it('bloque une clé d’API assignée en dur (motif générique)', () => {
    assert.equal(scan('config.php', `$config = ['api_key' => '${alnum(32)}'];\n`).status, 1)
  })

  it('refuse un fichier .env même vide', () => {
    assert.equal(scan('.env', '').status, 1)
  })

  it('autorise un modèle .env.example', () => {
    assert.equal(scan('.env.example', 'APP_KEY=\nDB_PASSWORD=\n').status, 0)
  })
})
