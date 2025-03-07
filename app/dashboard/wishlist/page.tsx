import { auth } from '@/auth'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Trash } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Your Wishlist',
  description: 'View and manage your saved products.',
}

async function getWishlist(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wishlist: true,
    },
  })
  
  return user?.wishlist || []
}

export default async function WishlistPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }
  
  const wishlist = await getWishlist(session.user.id)
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Wishlist</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Saved Products</CardTitle>
          <CardDescription>
            Products you've saved for later
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wishlist.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((product) => (
                <div key={product.id} className="group relative overflow-hidden rounded-lg border">
                  <div className="aspect-h-1 aspect-w-1 h-52 overflow-hidden bg-gray-100">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium">
                      <Link href={`/products/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-medium">{formatCurrency(Number(product.price))}</p>
                      <div className="flex items-center gap-2">
                        <form action={`/api/wishlist/remove?productId=${product.id}`} method="POST">
                          <Button variant="outline" size="icon" type="submit">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove from wishlist</span>
                          </Button>
                        </form>
                        <form action={`/api/cart/add?productId=${product.id}&quantity=1`} method="POST">
                          <Button size="icon" type="submit">
                            <ShoppingCart className="h-4 w-4" />
                            <span className="sr-only">Add to cart</span>
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
                <Button className="mt-4" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 