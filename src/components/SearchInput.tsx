interface SearchInputProps {
  placeholder?: string
  value: string
  onChange: (val: string) => void
}

export default function SearchInput({ placeholder = '搜索...', value, onChange }: SearchInputProps) {
  return (
    <label className="input input-bordered flex items-center gap-2 h-10 w-full max-w-xs text-sm rounded-2 bg-base-100">
      <svg className="h-4 w-4 opacity-40 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input type="search" placeholder={placeholder} className="grow bg-transparent outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}
