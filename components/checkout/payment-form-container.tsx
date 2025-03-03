'use client'

import * as React from 'react'
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/store/cart"
import { PaymentForm } from './payment-form'
import { useToast } from '@/components/ui/use-toast'

interface PaymentFormContainerProps {
  addressId: string
}

export function PaymentFormContainer({ addressId }: PaymentFormContainerProps) {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [clientSecret, setClientSecret] = React.useState<string>('')

  React.useEffect(() => {
    // Initialize payment intent and get client secret
    async function initializePayment() {
      try {
        const response = await fetch("/api/payment/intent", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            addressId,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to initialize payment")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Payment initialization error:", error)
        toast({
          title: 'Error',
          description: 'Failed to initialize payment. Please try again.',
          variant: 'destructive',
        })
      }
    }

    if (items.length > 0) {
      initializePayment()
    }
  }, [items, addressId, toast])

  if (!clientSecret) {
    return <div>Loading payment form...</div>
  }

  return (
    <PaymentForm
      clientSecret={clientSecret}
      amount={getTotalPrice()}
    />
  )
} 