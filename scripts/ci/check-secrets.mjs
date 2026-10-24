#!/usr/bin/env node
/**
 * A3 — Aucun secret dans le dépôt.
 *   1. fichiers sensibles refusés par leur nom (.env, clés, certificats…)
 *   2. contenu scanné par secretlint (.secretlintrc.json : ~30 fournisseurs + motifs génériques)
 *
 *   node scripts/ci/check-secrets.mjs            → tous les fichiers versionnés (gate, CI)
 *   node scripts/ci/check-secrets.mjs <fichiers> → fichiers donnés (hook pre-commit)
 *
 * Volontairement sans liste d'exclusion de dossiers (tests, docs, seeders compris).
 * En CI, gitleaks rescane tout l'historique ; GitHub bloque aussi le push (push protection).
 * Doc: docs/TESTING.md
 */
import { spawnSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { runSecretLint } from 'secretlint'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

/** Nom de fichier = secret quasi certain. Les modèles *.example restent autorisés. */
const FORBIDDEN = [
  { re: /(^|\/)\.env(\.[^/]+)?$/, allow: /\.example$/, why: 'fichier d’environnement (.env)' },
  { re: /\.(pem|key|p12|pfx|jks|keystore|ppk)$/i, why: 'clé ou certificat' },
  { re: /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/, why: 'clé SSH privée' },
  { re: /(^|\/)(auth\.json|\.npmrc|\.pypirc|credentials(\.json)?)$/, why: 'fichier d’identifiants' },
  { re: /\.(sqlite|sqlite3|sql\.gz|dump)$/i, why: 'base de données (données personnelles)' },
]

const BINARY = /\.(png|jpe?g|gif|webp|avif|ico|pdf|zip|gz|woff2?|ttf|otf|mp4|webm|psd|aep|bundle)$/i

function trackedFiles() {
  const r = spawnSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
  if (r.status !== 0) {
    console.error('A3 secrets: git ls-files a échoué')
    process.exit(2)
  }
  return r.stdout.split('\0').filter(Boolean)
}

const args = process.argv.slice(2)
const files = (args.length ? args : trackedFiles()).map((f) => f.replaceAll('\\', '/'))

const forbidden = []
for (const file of files) {
  for (const rule of FORBIDDEN) {
    if (rule.re.test(file) && !(rule.allow && rule.allow.test(file))) {
      forbidden.push(`${file} — ${rule.why}`)
    }
  }
}

const toScan = files.filter((f) => {
  if (BINARY.test(f)) return false
  const abs = path.resolve(root, f)
  return existsSync(abs) && statSync(abs).isFile()
})

let scanFailed = false
if (toScan.length) {
  const { exitStatus, stdout, stderr } = await runSecretLint({
    cliOptions: {
      cwd: root,
      filePathOrGlobList: toScan.map((f) => path.resolve(root, f)),
      noGlob: true,
      // Un fichier forcé (`git add -f`) malgré .gitignore doit quand même être scanné.
      respectGitignore: false,
    },
    engineOptions: {
      cwd: root,
      configFilePath: path.join(root, '.secretlintrc.json'),
      formatter: 'stylish',
      color: process.stdout.isTTY ?? false,
      maskSecrets: true,
    },
  })
  if (stdout) console.log(stdout)
  if (stderr) console.error(stderr)
  scanFailed = exitStatus !== 0
}

if (forbidden.length) {
  console.error('A3 secrets: fichiers sensibles interdits dans le dépôt :\n')
  for (const f of forbidden) console.error(`  - ${f}`)
  console.error('\nRetirez-les (git rm --cached <fichier>) ; versionnez uniquement un modèle *.example.')
}
if (scanFailed) {
  console.error('A3 secrets: secret détecté. Retirez-le du code, révoquez-le s’il a été partagé, utilisez .env.')
}
if (forbidden.length || scanFailed) process.exit(1)

console.log(`OK — A3 check:secrets (${toScan.length} fichier(s) scanné(s), aucun secret)`)
