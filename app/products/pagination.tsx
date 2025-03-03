'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Suspense } from 'react'

interface PaginationProps {
  totalPages: number
}

function PaginationContent({ totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParamsObj = useSearchParams()
  const currentPage = Number(searchParamsObj.get('page')) || 1

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParamsObj.toString())
    params.set('page', page.toString())
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between px-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function Pagination(props: PaginationProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-between px-2">
        <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
      </div>
    }>
      <PaginationContent {...props} />
    </Suspense>
  )
} 