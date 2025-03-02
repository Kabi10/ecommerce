import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import { ShippingFormContainer } from '@/components/checkout/shipping-form-container'
import { PaymentFormContainer } from '@/components/checkout/payment-form-container'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Checkout | EStore',
  description: 'Complete your purchase',
}

async function getDefaultAddress(userId: string) {
  return prisma.address.findFirst({
    where: {
      userId,
      type: 'SHIPPING',
      isDefault: true,
    },
  })
}

export default async function CheckoutPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/checkout')
  }

  const defaultAddress = await getDefaultAddress(session.user.id)

  return (
    <div className="container max-w-2xl py-8 md:py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Please complete your order details below.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <ShippingFormContainer
            defaultValues={defaultAddress || undefined}
          />
        </div>

        {defaultAddress ? (
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <PaymentFormContainer addressId={defaultAddress.id} />
          </div>
        ) : (
          <div className="rounded-lg border p-6">
            <p className="text-center text-muted-foreground">
              Please add a shipping address to continue with payment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 