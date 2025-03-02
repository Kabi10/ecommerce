'use client'

import { useCart } from '@/lib/store/cart'

export function CartBadge() {
  const cart = useCart()
  const totalItems = cart.getTotalItems()

  if (totalItems === 0) return null

  return (
    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
      {totalItems}
    </span>
  )
} 