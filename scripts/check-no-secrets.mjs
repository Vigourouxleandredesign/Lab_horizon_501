#!/usr/bin/env node
/**
 * A3 — Refuse common secret patterns in tracked source (not .env* themselves).
 * Doc: docs/TESTING.md
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const SKIP_DIR = new Set([
  'node_modules',
  'vendor',
  'dist',
  'build',
  '.git',
  'coverage',
  'storage',
  'docs',
  'archive',
])

const SKIP_FILE = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|mp4|pdf|zip|psd|aep|lock)$/i

/** Patterns that usually mean a real credential leaked into source. */
const RULES = [
  {
    id: 'private-key',
    re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    id: 'aws-access-key',
    re: /AKIA[0-9A-Z]{16}/,
  },
  {
    id: 'generic-api-key-assign',
    re: /(?:api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*['"][^'"]{16,}['"]/i,
  },
  {
    id: 'bearer-literal',
    re: /Authorization:\s*Bearer\s+[A-Za-z0-9\-._~+/]+=*/,
  },
]

const ALLOW_PATH_SNIPPETS = [
  // Exemples / seeds / docs de test — pas des secrets de prod
  `${path.sep}tests${path.sep}`,
  `${path.sep}database${path.sep}seeders${path.sep}`,
  `${path.sep}scripts${path.sep}test-`,
  `${path.sep}frontend${path.sep}scripts${path.sep}test-`,
]

function shouldSkipFile(rel) {
  if (SKIP_FILE.test(rel)) return true
  if (rel.endsWith('.env') || rel.includes('.env.')) return true
  if (ALLOW_PATH_SNIPPETS.some((s) => rel.includes(s))) return true
  return false
}

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    if (SKIP_DIR.has(name)) continue
    const abs = path.join(dir, name)
    let st
    try {
      st = statSync(abs)
    } catch {
      continue
    }
    if (st.isDirectory()) walk(abs, out)
    else out.push(abs)
  }
  return out
}

const roots = [
  path.join(root, 'frontend', 'src'),
  path.join(root, 'frontend', 'scripts'),
  path.join(root, 'backend', 'app'),
  path.join(root, 'backend', 'routes'),
  path.join(root, 'backend', 'config'),
  path.join(root, 'scripts'),
]

const hits = []

for (const base of roots) {
  for (const abs of walk(base)) {
    const rel = path.relative(root, abs)
    if (shouldSkipFile(rel)) continue
    let text
    try {
      text = readFileSync(abs, 'utf8')
    } catch {
      continue
    }
    // Skip binary-ish
    if (text.includes('\u0000')) continue
    for (const rule of RULES) {
      if (rule.re.test(text)) {
        hits.push(`${rel} [${rule.id}]`)
      }
    }
  }
}

if (hits.length) {
  console.error('A3 secrets: patterns suspects détectés :\n')
  for (const h of hits) console.error(`  - ${h}`)
  console.error('\nRetirez les secrets du dépôt (utilisez .env non versionné).')
  process.exit(1)
}

console.log('OK — A3 check:secrets (aucun motif suspect dans le code source)')
