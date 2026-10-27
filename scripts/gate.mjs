#!/usr/bin/env node
/**
 * Mandatory anti-regression gate — Lab Horizon
 * Doc: docs/TESTING.md
 *
 *   npm run gate           → A + B + C1 (front, hors réseau)
 *   --with-backend         → + PHPUnit (assets Blade construits, PHP local ou Docker)
 *   npm run gate:full      → + C2 API smoke + A5 audit dépendances
 *   npm run gate:security  → A3 secrets (+ auto-test du scanner) + A5 audit seuls
 *   GATE_SKIP_API=1        → skip C2 when Docker API unavailable
 *
 * Les hooks (lefthook.yml) et la CI (.github/workflows/ci.yml) appellent les mêmes scripts.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const frontend = path.join(root, 'frontend')

const args = new Set(process.argv.slice(2))
const full = process.env.GATE_FULL === '1' || args.has('--full')
const skipApi = process.env.GATE_SKIP_API === '1' || args.has('--skip-api')
const withBackend = full || args.has('--with-backend')
const staticOnly = args.has('--static') // A only (debug)
const securityOnly = args.has('--security')

const isWin = process.platform === 'win32'
const npmCmd = isWin ? 'npm.cmd' : 'npm'
const nodeCmd = process.execPath

function log(suite, msg) {
  console.log(`[${suite}] ${msg}`)
}

function run(suite, label, command, commandArgs, cwd, { useShell = isWin } = {}) {
  log(suite, `${label}`)
  // shell:false for node.exe — Windows breaks paths with spaces ("C:\Program Files\...")
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: 'inherit',
    shell: useShell,
    env: process.env,
  })
  if (result.status !== 0) {
    console.error(`\nGATE: FAIL — ${suite} (${label})`)
    process.exit(result.status ?? 1)
  }
  log(suite, `${label} ........ OK`)
}

function runNode(suite, label, scriptRel, scriptArgs = []) {
  run(suite, label, nodeCmd, [path.join(root, scriptRel), ...scriptArgs], root, { useShell: false })
}

console.log('=== Lab Horizon gate (docs/TESTING.md) ===\n')

if (securityOnly) {
  run('A', 'test:secrets', nodeCmd, ['--test', 'scripts/ci/*.test.mjs'], root, { useShell: false })
  runNode('A', 'check:secrets', 'scripts/ci/check-secrets.mjs')
  runNode('A', 'audit', 'scripts/ci/audit.mjs')
  console.log('\nGATE: PASS (security only)')
  process.exit(0)
}

// --- A — static ---
run('A', 'format:check', npmCmd, ['run', 'format:check'], frontend)
run('A', 'typecheck', npmCmd, ['run', 'typecheck'], frontend)
run('A', 'lint', npmCmd, ['run', 'lint'], frontend)
runNode('A', 'check:secrets', 'scripts/ci/check-secrets.mjs')
run('A', 'check:colors', npmCmd, ['run', 'check:colors'], frontend)

if (staticOnly) {
  run('A', 'build', npmCmd, ['run', 'build'], frontend)
  console.log('\nGATE: PASS (static only)')
  process.exit(0)
}

// --- C1 — domain contract (before unit/build — fail fast on content drift) ---
runNode('C', 'check:domains', 'scripts/check-domain-contract.mjs')

// --- B — unit ---
run('B', 'vitest', npmCmd, ['run', 'test'], frontend)

// --- A2 — production build ---
run('A', 'build', npmCmd, ['run', 'build'], frontend)

// --- C3 — backend (assets Blade + PHPUnit, PHP local sinon conteneur) ---
if (withBackend) {
  runNode('C', 'phpunit', 'scripts/ci/backend-test.mjs')
} else {
  log('C', 'phpunit ........ SKIP (use gate:full or --with-backend)')
}

// --- C2 / A5 — only in full ---
if (full) {
  if (skipApi) {
    log('C', 'api smoke ...... SKIP (GATE_SKIP_API=1)')
  } else {
    run('C', 'api search', npmCmd, ['run', 'test:search-api'], frontend)
    run('C', 'api auth', npmCmd, ['run', 'test:auth-api'], frontend)
  }
  runNode('A', 'audit', 'scripts/ci/audit.mjs')
} else {
  log('C', 'api smoke ...... SKIP (use gate:full)')
  log('A', 'audit .......... SKIP (use gate:full or gate:security)')
}

console.log('\nGATE: PASS')
process.exit(0)
