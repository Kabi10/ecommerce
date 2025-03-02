'use client'

import * as React from 'react'
import { useCartStore } from '@/lib/store/cart'
import { PaymentForm } from './payment-form'
import { useToast } from '@/components/ui/use-toast'

interface PaymentFormContainerProps {
  addressId: string
}

export function PaymentFormContainer({ addressId }: PaymentFormContainerProps) {
  const [clientSecret, setClientSecret] = React.useState<string>('')
  const { items, total, clearCart } = useCartStore()
  const { toast } = useToast()

  React.useEffect(() => {
    async function createOrder() {
      try {
        // Create order first
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            addressId,
            total,
          }),
        })

        if (!orderResponse.ok) {
          throw new Error('Failed to create order')
        }

        const { orderId } = await orderResponse.json()

        // Then create payment intent
        const paymentResponse = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            orderId,
          }),
        })

        if (!paymentResponse.ok) {
          throw new Error('Failed to create payment intent')
        }

        const data = await paymentResponse.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error('Error creating order:', error)
        toast({
          title: 'Error',
          description: 'Failed to initialize payment. Please try again.',
          variant: 'destructive',
        })
      }
    }

    if (total > 0 && !clientSecret) {
      createOrder()
    }
  }, [total, items, addressId, toast])

  if (!clientSecret || total === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Your cart is empty. Add some items to proceed with payment.
      </div>
    )
  }

  return (
    <PaymentForm
      clientSecret={clientSecret}
      amount={total}
      onSuccess={clearCart}
    />
  )
} 