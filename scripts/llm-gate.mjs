#!/usr/bin/env node
/**
 * Alias historique → scripts/gate.mjs
 * Doc: docs/TESTING.md
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const gate = path.join(root, 'scripts', 'gate.mjs')
const args = process.argv.slice(2)

// Map legacy --l0 → --static
const mapped = args.map((a) => (a === '--l0' ? '--static' : a))

const result = spawnSync(process.execPath, [gate, ...mapped], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
})
process.exit(result.status ?? 1)
