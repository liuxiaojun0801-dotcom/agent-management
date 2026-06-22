import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')

// 确保 data 目录存在
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

export function getData(name) {
  const path = join(DATA_DIR, `${name}.json`)
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch { return null }
}

export function setData(name, data) {
  const path = join(DATA_DIR, `${name}.json`)
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
}
