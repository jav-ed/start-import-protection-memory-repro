// Starts the dev server twice (import protection on, then off), loads the page once and prints the live heap after a forced GC.
import { spawnSync } from 'node:child_process'

if (process.argv[2] !== '--child') {
  const heap = {}
  for (const mode of ['on', 'off']) {
    const run = spawnSync(process.execPath, ['--expose-gc', new URL(import.meta.url).pathname, '--child'], {
      env: { ...process.env, IMPORT_PROTECTION: mode },
      encoding: 'utf8',
    })
    const line = run.stdout.split('\n').find((l) => l.startsWith('HEAP '))
    if (!line) throw new Error(`no result for import protection ${mode}\n${run.stdout}\n${run.stderr}`)
    heap[mode] = Number(line.slice(5))
  }
  console.log(`live heap after the first page, import protection on:  ${heap.on} MB`)
  console.log(`live heap after the first page, import protection off: ${heap.off} MB`)
  console.log(`difference: ${(heap.on - heap.off).toFixed(1)} MB`)
} else {
  const { createServer } = await import('vite')
  const server = await createServer({ server: { port: 0 }, logLevel: 'error' })
  await server.listen()
  const { port } = server.httpServer.address()
  const response = await fetch(`http://localhost:${port}/`)
  if (!response.ok) throw new Error(`page returned ${response.status}`)
  await response.text()
  await new Promise((resolve) => setTimeout(resolve, 3000))
  globalThis.gc()
  console.log(`HEAP ${(process.memoryUsage().heapUsed / 1048576).toFixed(1)}`)
  await server.close()
  process.exit(0)
}
