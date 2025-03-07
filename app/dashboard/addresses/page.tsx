import { auth } from '@/auth'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Pencil, Trash, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Your Addresses',
  description: 'Manage your shipping and billing addresses.',
}

async function getAddresses(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' },
  })
}

export default async function AddressesPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }
  
  const addresses = await getAddresses(session.user.id)
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Addresses</h2>
        <Button asChild>
          <Link href="/dashboard/addresses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Address
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
          <CardDescription>
            Manage your shipping and billing addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {addresses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {addresses.map((address) => (
                <div key={address.id} className="relative rounded-lg border p-4">
                  {address.isDefault && (
                    <Badge className="absolute right-4 top-4">Default</Badge>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{session.user.name}</p>
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.type === 'SHIPPING' ? 'Shipping Address' : 'Billing Address'}
                      </p>
                      
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/addresses/${address.id}/edit`}>
                            <Pencil className="mr-2 h-3 w-3" />
                            Edit
                          </Link>
                        </Button>
                        {!address.isDefault && (
                          <>
                            <form action={`/api/addresses/default?addressId=${address.id}`} method="POST">
                              <Button variant="outline" size="sm" type="submit">
                                Set as Default
                              </Button>
                            </form>
                            <form action={`/api/addresses/delete?addressId=${address.id}`} method="POST">
                              <Button variant="outline" size="sm" type="submit">
                                <Trash className="mr-2 h-3 w-3" />
                                Delete
                              </Button>
                            </form>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">You haven't added any addresses yet</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/addresses/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Address
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 