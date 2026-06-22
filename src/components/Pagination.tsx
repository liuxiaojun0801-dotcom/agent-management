interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  showPageSize?: boolean
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | 'ellipsis')[] = [1]
  if (current > 3) pages.push('ellipsis')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('ellipsis')
  pages.push(total)
  return pages
}

export default function Pagination({
  currentPage, totalPages, totalItems, pageSize,
  onPageChange, onPageSizeChange, showPageSize = true,
}: PaginationProps) {
  if (totalPages <= 1 && !showPageSize) return null

  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-sm text-base-content/60 whitespace-nowrap">
        共 {totalItems} 条
      </span>
      <div className="join">
        <button className="join-item btn btn-sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          ‹
        </button>
        {getPageNumbers(currentPage, totalPages).map((page, i) =>
          page === 'ellipsis' ? (
            <button key={`e-${i}`} className="join-item btn btn-sm btn-disabled">…</button>
          ) : (
            <button key={page} className={`join-item btn btn-sm ${page === currentPage ? 'btn-primary text-primary-content' : ''}`} onClick={() => onPageChange(page)}>
              {page}
            </button>
          )
        )}
        <button className="join-item btn btn-sm" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          ›
        </button>
      </div>
      {showPageSize && onPageSizeChange && (
        <select className="text-sm select select-sm w-30 border-base-200 text-base-content" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n} 条/页</option>)}
        </select>
      )}
    </div>
  )
}
