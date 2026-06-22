export interface SavedRequest {
  id: string
  label: string
  method: string
  url: string
  headers: { key: string; value: string; enabled: boolean }[]
  body: string
  collection: string
  savedAt: string
  lastResponse?: {
    status: number
    statusText: string
    time: string
    size: string
    body: string
    headers: Record<string, string>
  }
  concurrentResults?: { index: number; status: number; time: string }[]
  concurrentSummary?: { total: number; success: number; failed: number; avgTime: string; totalTime: string }
  concurrentConfig?: { mode: boolean; count: number; duration: number; timeout: number }
}

const NAME = 'api-test-saved-requests'
const LS_KEY = 'api-test-saved-requests'
let cache: SavedRequest[] | null = null

// 从 localStorage 同步恢复（保证首次渲染就有数据）
function localStorageFallback(): SavedRequest[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

async function fetchFromFile(): Promise<SavedRequest[]> {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get', name: NAME }),
    })
    const result = await res.json()
    return result.success ? (result.data || []) : []
  } catch { return [] }
}

async function writeToFile(data: SavedRequest[]) {
  try {
    await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'set', name: NAME, data }),
    })
  } catch { /* ignore */ }
}

// 同步写入 localStorage（保证页面刷新后仍能恢复）
function syncToLocal(data: SavedRequest[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

let flushTimer: ReturnType<typeof setTimeout> | null = null
let synced = false

// 同步读取（首次调用后缓存）
export function getSavedRequests(): SavedRequest[] {
  if (!cache) cache = localStorageFallback()
  return cache
}

// 同步更新并异步持久化
export function setSavedRequests(data: SavedRequest[]) {
  cache = data
  syncToLocal(data) // 同步写入 localStorage 保证跨页面恢复
  if (flushTimer) clearTimeout(flushTimer)
  flushTimer = setTimeout(() => {
    writeToFile(data)
    flushTimer = null
  }, 300)

  // 首次加载后尝试从文件同步（只做一次）
  if (!synced) {
    synced = true
    fetchFromFile().then(fileData => {
      if (fileData.length > 0 && JSON.stringify(fileData) !== JSON.stringify(cache)) {
        // 文件有新数据，更新缓存
        cache = fileData
        writeToFile(fileData) // 也同步到 localStorage
        try { localStorage.setItem(LS_KEY, JSON.stringify(fileData)) } catch { /* ignore */ }
      } else if (cache && cache.length > 0 && fileData.length === 0) {
        // 缓存有数据但文件无数据，写入文件（迁移）
        writeToFile(cache)
      }
    })
  }
}
