'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, Menu, ShoppingCart } from 'lucide-react'
import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { ProductSearch } from '@/components/products/product-search'

// Dynamically import components that use client-side features
const CartSheet = dynamic(() => import('@/components/cart/cart-sheet').then(mod => mod.CartSheet), {
  loading: () => (
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
    </Button>
  ),
})

const UserMenu = dynamic(() => import('@/components/user/user-menu').then(mod => mod.UserMenu), {
  loading: () => (
    <Button variant="ghost" size="icon">
      <User className="h-5 w-5" />
    </Button>
  ),
})

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Categories', href: '/categories' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold">
            EStore
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center ml-8 space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <Suspense fallback={<div className="h-10 w-full max-w-sm animate-pulse rounded-md bg-muted" />}>
              <ProductSearch className="w-full max-w-sm lg:max-w-lg" />
            </Suspense>
          </div>
          <CartSheet />
          <UserMenu />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4">
                <ProductSearch className="w-full" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 