#!/usr/bin/env node
/**
 * A4 — Fail if literal colors (#hex, rgb/rgba with numeric channels) appear in page CSS modules.
 * Allowed: rgba(var(--lh-rgb-*), α), var(--lh-*), keywords (black, transparent).
 * Doc: docs/TESTING.md
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pagesDir = join(root, 'src/style/pages')

const HEX = /#[0-9a-fA-F]{3,8}\b/g
/** Literal channels only — not rgba(var(--lh-rgb-…), …) */
const RGB_LITERAL = /rgba?\(\s*\d/g

const files = readdirSync(pagesDir).filter((f) => f.endsWith('.module.css'))
const violations = []

for (const file of files) {
  const content = readFileSync(join(pagesDir, file), 'utf8')
  const hex = content.match(HEX) ?? []
  const rgb = content.match(RGB_LITERAL) ?? []
  const total = hex.length + rgb.length
  if (total) {
    violations.push(`${file}: ${total} occurrence(s)`)
  }
}

if (violations.length) {
  console.error('Couleurs en dur détectées dans les modules CSS des pages :\n')
  violations.forEach((v) => console.error(`  - ${v}`))
  console.error('\nUtilisez les variables --lh-* de src/style/global.css.')
  process.exit(1)
}

console.log('OK — aucune couleur littérale dans src/style/pages/*.module.css')
