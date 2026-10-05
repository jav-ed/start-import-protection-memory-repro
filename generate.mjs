// Writes N synthetic modules of ordinary application-sized code plus a barrel, so the dev server has many modules to analyse.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'

const count = Number(process.env.MODULES ?? 1500)
const dir = new URL('./src/generated/', import.meta.url)
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })
const name = (i) => `m${String(i).padStart(4, '0')}`

for (let i = 0; i < count; i++) {
  const imports = [i - 1, i - 7, i - 31].filter((j) => j >= 0)
  const lines = imports.map((j) => `import { value_${j}, type Record_${j} } from './${name(j)}'`)
  lines.push('')
  lines.push(`export type Record_${i} = { id: number; label: string; tags: Array<string>; parent?: Record_${imports[0] ?? i} }`)
  for (let f = 0; f < 12; f++) {
    lines.push(`export function build_${i}_${f}(input: number, label: string): Record_${i} {`)
    lines.push(`  const tags = [label, String(input), 'k${f}'].filter((tag) => tag.length > 0)`)
    lines.push(`  const base = { id: input * ${f + 2} + ${i}, label: label.trim().toLowerCase(), tags }`)
    lines.push(`  if (input % ${f + 3} === 0) return { ...base, tags: [...tags, 'multiple'] }`)
    lines.push('  return base')
    lines.push('}')
  }
  lines.push(`export const value_${i} = ${imports.map((j) => `value_${j}`).join(' + ') || '0'} + build_${i}_0(${i}, 'x').id`)
  writeFileSync(new URL(`${name(i)}.ts`, dir), lines.join('\n') + '\n')
}

const barrel = Array.from({ length: count }, (_, i) => `import { value_${i} } from './${name(i)}'`)
barrel.push('', `export const total = () => [${Array.from({ length: count }, (_, i) => `value_${i}`).join(', ')}].reduce((a, b) => a + b, 0)`)
writeFileSync(new URL('index.ts', dir), barrel.join('\n') + '\n')
console.log(`generated ${count} modules`)
