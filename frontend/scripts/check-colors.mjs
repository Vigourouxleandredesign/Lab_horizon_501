#!/usr/bin/env node
/**
 * Échoue si des couleurs littérales (#hex, rgb/rgba) traînent dans les modules CSS des pages.
 * Les tokens vivent uniquement dans src/style/global.css.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pagesDir = join(root, 'src/style/pages')
const pattern = /#[0-9a-fA-F]{3,8}\b|rgba?\(/g

const files = readdirSync(pagesDir).filter((f) => f.endsWith('.module.css'))
const violations = []

for (const file of files) {
  const content = readFileSync(join(pagesDir, file), 'utf8')
  const matches = content.match(pattern)
  if (matches?.length) {
    violations.push(`${file}: ${matches.length} occurrence(s)`)
  }
}

if (violations.length) {
  console.error('Couleurs en dur détectées dans les modules CSS des pages :\n')
  violations.forEach((v) => console.error(`  - ${v}`))
  console.error('\nUtilisez les variables --lh-* de src/style/global.css.')
  process.exit(1)
}

console.log('OK — aucune couleur littérale dans src/style/pages/*.module.css')
