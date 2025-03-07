import { auth } from '@/auth'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AddressForm } from '@/components/user/address-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Add New Address',
  description: 'Add a new shipping or billing address to your account.',
}

export default async function NewAddressPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/addresses/new')
  }
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/addresses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Add New Address</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>New Address</CardTitle>
          <CardDescription>
            Add a new shipping or billing address to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddressForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
} 