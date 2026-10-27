#!/usr/bin/env node
/**
 * A5 — Audit des dépendances (npm front + npm back + Composer). Toute vulnérabilité bloque.
 * Lance tous les audits avant de conclure, pour voir toutes les failles d'un coup.
 * Doc: docs/TESTING.md
 *
 * Le résultat dépend de la base d'advisories du jour : un lockfile vert hier peut être
 * rouge aujourd'hui. C'est voulu — d'où l'exécution en pre-push et en CI planifiée.
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const isWin = process.platform === 'win32'
const npmCmd = isWin ? 'npm.cmd' : 'npm'

// Aucune sévérité tolérée. Correctif indisponible en amont : override npm / mise à jour ciblée,
// jamais un seuil abaissé (docs/TESTING.md, « Politique sécurité »).
const AUDIT_LEVEL = 'low'

const audits = [
  ['npm frontend', npmCmd, ['audit', '--prefix', 'frontend', `--audit-level=${AUDIT_LEVEL}`], isWin],
  ['npm backend', npmCmd, ['audit', '--prefix', 'backend', `--audit-level=${AUDIT_LEVEL}`], isWin],
  ['composer', process.execPath, [path.join(root, 'scripts/ci/php.mjs'), 'composer', 'audit', '--locked', '--abandoned=fail'], false],
]

const failed = []
for (const [label, cmd, args, shell] of audits) {
  console.log(`\n[A5] audit ${label}`)
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell })
  if (r.status !== 0) failed.push(label)
}

if (failed.length) {
  console.error(`\nA5 audit: FAIL — ${failed.join(', ')}`)
  console.error('Corriger : npm audit fix (--prefix frontend|backend) / composer update <paquet> -W')
  process.exit(1)
}
console.log('\nOK — A5 audit (aucune vulnérabilité connue)')
