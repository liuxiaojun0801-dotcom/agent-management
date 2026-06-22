// 日志 — 日志首页，通过标签页切换运行日志和操作日志，内容由子页面组件渲染
import { useState } from 'react'
import RunLogs from './RunLogs'
import OperationLogs from './OperationLogs'

export default function Logs() {
  const [tab, setTab] = useState<'audit' | 'operation'>('audit')

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold">日志</h1>
      </div>

      {/* 二级菜单标签页 */}
      <div className="mb-4 flex items-center gap-1 shrink-0">
        <div className="flex items-center gap-6 border-b border-base-200">
          {(['audit', 'operation'] as const).map(cat => (
            <button key={cat}
              className={`pb-2 text-sm font-medium transition-colors relative ${tab === cat ? 'text-primary' : 'text-base-content/60 hover:text-base-content'}`}
              onClick={() => setTab(cat)}
            >
              {cat === 'audit' ? '运行日志' : '操作日志'}
              {tab === cat && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 min-h-0">
        {tab === 'audit' ? <RunLogs /> : <OperationLogs />}
      </div>
    </div>
  )
}
