import { auth } from '@/auth'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressForm } from '@/components/user/address-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Edit Address',
  description: 'Edit your shipping or billing address.',
}

async function getAddress(id: string, userId: string) {
  const address = await prisma.address.findUnique({
    where: {
      id,
      userId, // Ensure the address belongs to the user
    },
  })
  
  if (!address) {
    return null
  }
  
  return address
}

export default async function EditAddressPage({ params }: { params: { id: string } }) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/addresses')
  }
  
  const address = await getAddress(params.id, session.user.id)
  
  if (!address) {
    notFound()
  }
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/addresses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Address</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Address</CardTitle>
          <CardDescription>
            Update your shipping or billing address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddressForm 
            mode="edit" 
            address={{
              id: address.id,
              street: address.street,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
              type: address.type,
              isDefault: address.isDefault,
            }} 
          />
        </CardContent>
      </Card>
    </div>
  )
} 