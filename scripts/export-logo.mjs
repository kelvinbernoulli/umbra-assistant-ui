import { chromium } from '@playwright/test'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'

const temp = resolve('test-results/logo-browser')
await mkdir(temp, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', env: { ...process.env, TEMP: temp, TMP: temp } })
try {
  const svg = await readFile('public/umbra-logo.svg', 'utf8')
  for (const size of [120, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
    await page.setContent(`<style>html,body{margin:0;background:#12141a}svg{display:block;width:100vw;height:100vh}</style>${svg}`)
    const path = `public/umbra-logo-${size}.png`
    await page.screenshot({ path, animations: 'disabled' })
    const png = await readFile(path)
    if (png.readUInt32BE(16) !== size || png.readUInt32BE(20) !== size) throw new Error('Incorrect PNG dimensions')
    const { size: bytes } = await stat(path)
    if (bytes >= 1_000_000) throw new Error('PNG exceeds upload limit')
    console.log(`${path}: ${size} x ${size}, ${bytes} bytes`)
    await page.close()
  }
} finally {
  await browser.close()
}
