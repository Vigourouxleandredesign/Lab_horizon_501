import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const root = path.resolve('public')

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (entry.name.toLowerCase().endsWith('.png')) out.push(full)
  }
  return out
}

const pngs = walk(root)
let ok = 0
let fail = 0

for (const png of pngs) {
  const webp = png.slice(0, -4) + '.webp'
  try {
    const meta = await sharp(png).metadata()
    await sharp(png).webp({ quality: 85, alphaQuality: 100, effort: 4 }).toFile(webp)
    const before = fs.statSync(png).size
    const after = fs.statSync(webp).size
    console.log(
      'OK',
      path.relative(root, png),
      `${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
      meta.hasAlpha ? 'alpha' : 'opaque',
    )
    ok += 1
  } catch (error) {
    console.error('FAIL', path.relative(root, png), error.message)
    fail += 1
  }
}

console.log(`Done ${ok} ok / ${fail} fail / ${pngs.length} total`)
process.exit(fail > 0 ? 1 : 0)
