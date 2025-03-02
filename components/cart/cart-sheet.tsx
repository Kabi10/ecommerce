'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { CartBadge } from './cart-badge'

export function CartSheet() {
  const cart = useCart()
  const [isOpen, setIsOpen] = React.useState(false)

  const totalItems = cart.getTotalItems()
  const totalPrice = cart.getTotalPrice()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <CartBadge />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 overflow-hidden">
          {cart.items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <Button asChild variant="link" className="text-sm" onClick={() => setIsOpen(false)}>
                <Link href="/products">Continue shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-6">
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-1 text-base">
                          <span className="line-clamp-1 font-medium">
                            {item.name}
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                cart.updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-9 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                cart.updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => cart.removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 pr-6">
                <Separator />
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Button size="lg" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 