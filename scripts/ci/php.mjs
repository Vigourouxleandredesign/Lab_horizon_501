#!/usr/bin/env node
/**
 * Lance une commande PHP / Composer dans backend/.
 * PHP local s'il est installé, sinon conteneur Docker (le README n'exige que Docker + Node).
 * Doc: docs/TESTING.md
 *
 *   node scripts/ci/php.mjs php vendor/bin/pint --test
 *   node scripts/ci/php.mjs php artisan test
 *   node scripts/ci/php.mjs composer audit --locked
 *   PHP_RUNNER=docker   → force le conteneur même si PHP est installé
 */
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const backend = path.join(root, 'backend')

// Image officielle Composer : PHP CLI + composer, avec pdo_sqlite (tests en :memory:).
const DOCKER_IMAGE = 'composer:2.9'

const isWin = process.platform === 'win32'
const [tool, ...args] = process.argv.slice(2)

if (tool !== 'php' && tool !== 'composer') {
  console.error('Usage: node scripts/ci/php.mjs <php|composer> [args...]')
  process.exit(2)
}

function available(cmd) {
  const r = spawnSync(cmd, ['--version'], { stdio: 'ignore', shell: isWin })
  return r.status === 0
}

// PHP_RUNNER=docker force le conteneur (PHP local incomplet, ou reproduire la CI).
const local =
  process.env.PHP_RUNNER !== 'docker' && available('php') && (tool === 'php' || available('composer'))

function exec(bin, binArgs) {
  if (local) {
    return spawnSync(bin, binArgs, { cwd: backend, stdio: 'inherit', shell: isWin }).status ?? 1
  }
  if (!available('docker')) {
    console.error('PHP introuvable et Docker indisponible : installez PHP 8.4 (ou 8.3+) ou lancez Docker Desktop.')
    return 1
  }
  const user = typeof process.getuid === 'function' ? ['--user', `${process.getuid()}:${process.getgid()}`] : []
  const dockerArgs = [
    'run', '--rm', ...user,
    '--mount', `type=bind,source=${backend},target=/app`,
    '-w', '/app',
    '-e', 'COMPOSER_NO_INTERACTION=1',
    DOCKER_IMAGE, bin, ...binArgs,
  ]
  return spawnSync('docker', dockerArgs, { stdio: 'inherit' }).status ?? 1
}

// vendor/ absent (clone neuf) : pint et phpunit en ont besoin. composer audit lit le lock seul.
if (tool === 'php' && !existsSync(path.join(backend, 'vendor'))) {
  console.log('[php] backend/vendor absent — composer install')
  const status = exec('composer', ['install', '--no-interaction', '--no-progress', '--prefer-dist'])
  if (status !== 0) process.exit(status)
}

process.exit(exec(tool, args))
