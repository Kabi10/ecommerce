'use client'

import { Package, RefreshCw, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  stock: number
  price: number
  sku?: string
}

interface LowStockAlertProps {
  products: Product[]
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const [reorderingProducts, setReorderingProducts] = useState<Set<string>>(new Set())

  const handleReorder = (productId: string) => {
    // In a real app, this would trigger an API call to create a purchase order
    setReorderingProducts(prev => {
      const newSet = new Set(prev)
      newSet.add(productId)
      return newSet
    })
    
    // Simulate API call completion after 2 seconds
    setTimeout(() => {
      setReorderingProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 2000)
  }

  const getRecommendedReorderQuantity = (stock: number) => {
    // Simple reorder quantity calculation
    // In a real app, this would be based on sales velocity, lead time, etc.
    if (stock <= 5) return 20
    if (stock <= 10) return 15
    return 10
  }

  if (!products?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Products that need to be restocked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground py-8 text-center">
            No low stock items at the moment
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
        <CardDescription>Products that need to be restocked</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-3 border-b last:border-0"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Package className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.price)}
                    </p>
                    {product.sku && (
                      <p className="text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  product.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {product.stock} left
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Reorder: {getRecommendedReorderQuantity(product.stock)}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReorder(product.id)}
                    disabled={reorderingProducts.has(product.id)}
                  >
                    {reorderingProducts.has(product.id) ? (
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-3 w-3 mr-1" />
                    )}
                    {reorderingProducts.has(product.id) ? 'Ordering...' : 'Reorder'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/admin/inventory">
            <Button variant="outline" size="sm">
              View All Inventory
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 