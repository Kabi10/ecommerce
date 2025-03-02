'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, Menu, ShoppingCart } from 'lucide-react'
import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { ProductSearch } from '@/components/products/product-search'

const CartSheet = dynamic(() => import('@/components/cart/cart-sheet').then(mod => mod.CartSheet), {
  ssr: false,
  loading: () => (
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
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
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                EStore
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar - Only visible on large screens when not on products page */}
          {pathname !== '/products' && (
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
              <ProductSearch className="w-full" />
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center">
            <Suspense fallback={
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            }>
              <CartSheet />
            </Suspense>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${
                  pathname === item.href
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {pathname !== '/products' && (
            <div className="p-3">
              <ProductSearch />
            </div>
          )}
        </div>
      )}
    </nav>
  )
} 