import { useRef } from 'react'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartChange: (val: string) => void
  onEndChange: (val: string) => void
  onReset?: () => void
}

const fmtDT = (d: Date) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, onReset }: DateRangePickerProps) {
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)

  const handleReset = () => {
    if (onReset) {
      onReset()
    } else {
      const d = new Date()
      const s = new Date()
      s.setMonth(s.getMonth() - 6)
      onStartChange(fmtDT(s))
      onEndChange(fmtDT(d))
    }
  }

  return (
    <div className="flex items-center h-10 gap-1 px-3 rounded-2 bg-base-100 input input-bordered group min-w-100">
      <div className="flex-1 cursor-pointer min-w-0" onClick={() => startRef.current?.showPicker()}>
        <input ref={startRef} type="datetime-local" className="w-42.5 text-sm bg-transparent outline-none cursor-pointer text-base-content" style={{ colorScheme: 'light' }} value={startDate} onChange={(e) => onStartChange(e.target.value)} />
      </div>
      <span className="text-base-content/40 shrink-0">—</span>
      <div className="cursor-pointer" onClick={() => endRef.current?.showPicker()}>
        <input ref={endRef} type="datetime-local" className="w-42.5 text-sm bg-transparent outline-none cursor-pointer text-base-content" style={{ colorScheme: 'light' }} value={endDate} onChange={(e) => onEndChange(e.target.value)} />
      </div>
      <button type="button" className="flex items-center justify-center transition-all rounded-full opacity-0 group-hover:opacity-100 text-base-content/40 hover:text-base-content hover:bg-base-300 size-5" onClick={handleReset}>
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <svg className="w-4 h-4 text-base-content/30 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    </div>
  )
}
