#!/usr/bin/env node
/**
 * C1 — Contract: UNC category slugs ↔ i18n descriptions ↔ pill (+ hero) assets on disk.
 * Doc: docs/TESTING.md
 */
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const frontend = path.join(root, 'frontend')
const publicDir = path.join(frontend, 'public')

const categoriesPath = path.join(frontend, 'src/data/categories.ts')
const domainsPath = path.join(frontend, 'src/i18n/domains.ts')
const assetsPath = path.join(frontend, 'src/assets/figmaHomeAssets.ts')

function extractSlugsFromCategories(src) {
  const block = src.match(/export const UNC_CATEGORIES[\s\S]*?= \[([\s\S]*?)\]\s*$/m)
    || src.match(/export const UNC_CATEGORIES[\s\S]*?= \[([\s\S]*?)\]\n/)
  if (!block) throw new Error('UNC_CATEGORIES introuvable dans categories.ts')
  const slugs = [...block[1].matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  if (!slugs.length) throw new Error('Aucun slug dans UNC_CATEGORIES')
  return slugs
}

/** Top-level keys only (ignore nested `fr` / `en`). */
function extractTopLevelObjectKeys(src, constName) {
  const marker = src.match(new RegExp(`(?:const|export const) ${constName}[^=]*=\\s*\\{`))
  if (!marker || marker.index === undefined) throw new Error(`${constName} introuvable`)
  let i = marker.index + marker[0].length
  let depth = 1
  const keys = new Set()
  while (i < src.length && depth > 0) {
    const ch = src[i]
    if (ch === '{') depth += 1
    else if (ch === '}') depth -= 1
    else if (depth === 1) {
      const slice = src.slice(i)
      const km = slice.match(/^(?:\s*)(?:'([^']+)'|([A-Za-z0-9_-]+))\s*:/)
      if (km) {
        keys.add(km[1] || km[2])
        i += km[0].length
        continue
      }
    }
    i += 1
  }
  return keys
}

function extractPillPaths(src) {
  const m = src.match(/const DOMAIN_PILL_BY_SLUG[^=]*=\s*\{([\s\S]*?)\n\}/)
  if (!m) throw new Error('DOMAIN_PILL_BY_SLUG introuvable')
  const map = new Map()
  for (const row of m[1].matchAll(/(?:'([^']+)'|([A-Za-z0-9_-]+))\s*:\s*'([^']+)'/g)) {
    map.set(row[1] || row[2], row[3])
  }
  return map
}

function extractHeroEntries(src) {
  const m = src.match(/const DOMAIN_HERO_BY_SLUG[^=]*=\s*\{([\s\S]*?)\n\}/)
  if (!m) throw new Error('DOMAIN_HERO_BY_SLUG introuvable')
  const map = new Map()
  const body = m[1]
  // slug blocks: key: { background: '...', layer: '...' }
  for (const block of body.matchAll(
    /(?:'([^']+)'|([A-Za-z0-9_-]+))\s*:\s*\{\s*background:\s*'([^']+)'\s*,\s*layer:\s*'([^']+)'/g,
  )) {
    map.set(block[1] || block[2], { background: block[3], layer: block[4] })
  }
  return map
}

const errors = []

const categoriesSrc = readFileSync(categoriesPath, 'utf8')
const domainsSrc = readFileSync(domainsPath, 'utf8')
const assetsSrc = readFileSync(assetsPath, 'utf8')

const slugs = extractSlugsFromCategories(categoriesSrc)
const descKeys = extractTopLevelObjectKeys(domainsSrc, 'domainDescriptions')
const pillMap = extractPillPaths(assetsSrc)
const heroMap = extractHeroEntries(assetsSrc)

const heroDir = path.join(publicDir, 'hero', 'heros avant retravaille')
const fallbackBg = path.join(publicDir, 'hero', 'hero_biodiversite_ss_arbre.webp')
const fallbackLayer = path.join(publicDir, 'hero', 'layer-placeholder.webp')
/** Domaines sans couple zindex0/zindex1 dédié — même fallback que biodiversite. */
const HERO_FALLBACK_SLUGS = new Set([
  'biodiversite-environnement-sante',
])

for (const slug of slugs) {
  if (!descKeys.has(slug)) {
    errors.push(`i18n: domainDescriptions manquant pour « ${slug} »`)
  }
  const pillRel = pillMap.get(slug)
  if (!pillRel) {
    errors.push(`assets: DOMAIN_PILL_BY_SLUG manquant pour « ${slug} »`)
  } else {
    const pillAbs = path.join(publicDir, ...pillRel.split('/'))
    if (!existsSync(pillAbs)) {
      errors.push(`fichier manquant: public/${pillRel} (slug ${slug})`)
    }
  }

  const hero = heroMap.get(slug)
  if (hero) {
    const bg = path.join(heroDir, hero.background)
    const layer = path.join(heroDir, hero.layer)
    if (!existsSync(bg)) {
      errors.push(`héro fond manquant: ${path.relative(publicDir, bg)} (${slug})`)
    }
    if (!existsSync(layer)) {
      errors.push(`héro calque manquant: ${path.relative(publicDir, layer)} (${slug})`)
    }
  } else if (HERO_FALLBACK_SLUGS.has(slug)) {
    if (!existsSync(fallbackBg)) {
      errors.push('héro fallback manquant: hero/hero_biodiversite_ss_arbre.webp')
    }
    if (!existsSync(fallbackLayer)) {
      errors.push('héro fallback layer manquant: hero/layer-placeholder.webp')
    }
  } else {
    errors.push(
      `assets: DOMAIN_HERO_BY_SLUG manquant pour « ${slug} » (fallback autorisé: ${[...HERO_FALLBACK_SLUGS].join(', ')})`,
    )
  }
}

// Orphans in pills / descriptions (warn as error — contract drift)
for (const key of descKeys) {
  if (!slugs.includes(key)) {
    errors.push(`i18n: domainDescriptions orphelin « ${key} » (absent de UNC_CATEGORIES)`)
  }
}
for (const key of pillMap.keys()) {
  if (!slugs.includes(key)) {
    errors.push(`assets: pill orpheline « ${key} » (absent de UNC_CATEGORIES)`)
  }
}

if (errors.length) {
  console.error('C1 domain contract: échecs\n')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(
  `OK — C1 check:domains (${slugs.length} slugs, descriptions, pills, héros)`,
)
