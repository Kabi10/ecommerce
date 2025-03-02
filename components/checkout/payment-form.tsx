'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
)

interface PaymentFormProps {
  clientSecret: string
  amount: number
}

function PaymentFormContent({ amount }: { amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        toast({
          title: 'Payment failed',
          description: error.message || 'Something went wrong',
          variant: 'destructive',
        })
        return
      }

      if (paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment successful',
          description: 'Thank you for your purchase!',
        })
        router.push('/checkout/success')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? 'Processing...' : `Pay ${amount.toFixed(2)} USD`}
      </Button>
    </form>
  )
}

export function PaymentForm({ clientSecret, amount }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormContent amount={amount} />
    </Elements>
  )
} 