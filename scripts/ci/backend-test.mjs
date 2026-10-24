#!/usr/bin/env node
/**
 * C3 — Tests backend dans un environnement conforme à la prod, sans adapter les tests :
 *   1. assets Blade construits (comme le Dockerfile) — les vues @vite exigent le manifest
 *   2. .env présent avec APP_KEY (créé depuis .env.example si absent, comme `composer setup`)
 *   3. composer test (config:clear + php artisan test)
 * Utilisé par le hook pre-commit, `npm run test:backend`, la gate et la CI.
 * Doc: docs/TESTING.md
 */
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const backend = path.join(root, 'backend')
const isWin = process.platform === 'win32'
const npmCmd = isWin ? 'npm.cmd' : 'npm'
const phpRunner = path.join(root, 'scripts/ci/php.mjs')

function step(label, cmd, args, opts = {}) {
  console.log(`[C3] ${label}`)
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', ...opts })
  if (r.status !== 0) {
    console.error(`\nC3 backend: FAIL — ${label}`)
    process.exit(r.status ?? 1)
  }
}

if (!existsSync(path.join(backend, 'node_modules'))) {
  step('npm ci (backend)', npmCmd, ['ci', '--prefix', 'backend', '--no-audit', '--no-fund'], { shell: isWin })
}
step('vite build (assets Blade)', npmCmd, ['run', 'build', '--prefix', 'backend'], { shell: isWin })

if (!existsSync(path.join(backend, '.env'))) {
  console.log('[C3] backend/.env absent — copie de .env.example + key:generate')
  copyFileSync(path.join(backend, '.env.example'), path.join(backend, '.env'))
  step('key:generate', process.execPath, [phpRunner, 'php', 'artisan', 'key:generate', '--ansi'])
}

step('composer test', process.execPath, [phpRunner, 'composer', 'test'])
