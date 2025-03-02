'use client'

import Link from 'next/link'

interface PaginationProps {
  totalPages: number
  currentPage: number
  searchParams: Record<string, string | string[]>
}

export default function Pagination({ totalPages, currentPage, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center gap-2">
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1
        const isCurrentPage = page === currentPage

        return (
          <Link
            key={page}
            href={{
              pathname: '/products',
              query: {
                ...searchParams,
                page: page.toString(),
              },
            }}
            className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded px-3 text-sm font-medium ${
              isCurrentPage
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {page}
          </Link>
        )
      })}
    </div>
  )
} 