#!/usr/bin/env node
/**
 * PNG → WebP (alpha conservée) pour Math / Physique / Chimie.
 * Usage: node scripts/convert-new-domain-assets.mjs [--delete-png]
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const deletePng = process.argv.includes('--delete-png')

const files = [
  'public/pillules/Chimie.png',
  'public/pillules/Mathematiques.png',
  'public/pillules/Physique.png',
  'public/hero/heros avant retravaille/Chimie zindex0.png',
  'public/hero/heros avant retravaille/Chimie zindex1.png',
  'public/hero/heros avant retravaille/Mathematiques zindex0.png',
  'public/hero/heros avant retravaille/Mathematiques zindex1.png',
  'public/hero/heros avant retravaille/Physique zindex0.png',
  'public/hero/heros avant retravaille/Physique zindex1.png',
]

let ok = 0
for (const rel of files) {
  const png = path.join(root, rel)
  if (!fs.existsSync(png)) {
    console.error('MISSING', rel)
    process.exit(1)
  }
  const webp = png.slice(0, -4) + '.webp'
  const meta = await sharp(png).metadata()
  const isLayer = /zindex1/i.test(rel)
  await sharp(png)
    .webp({
      quality: isLayer ? 88 : 82,
      alphaQuality: 100,
      effort: 5,
    })
    .toFile(webp)

  // Vérifie que l’alpha est toujours présent sur les calques
  const outMeta = await sharp(webp).metadata()
  if (isLayer && meta.hasAlpha && !outMeta.hasAlpha) {
    console.error('ALPHA LOST', rel)
    process.exit(1)
  }

  const before = fs.statSync(png).size
  const after = fs.statSync(webp).size
  console.log(
    'OK',
    path.basename(png),
    meta.hasAlpha ? 'alpha' : 'opaque',
    `${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`,
    outMeta.hasAlpha ? '(webp+alpha)' : '(webp)',
  )
  if (deletePng) {
    fs.unlinkSync(png)
    console.log('  deleted', path.basename(png))
  }
  ok += 1
}

console.log(`Done ${ok}/${files.length}`)
