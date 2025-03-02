'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ShippingForm } from './shipping-form'
import type { Address } from '@prisma/client'

interface ShippingFormContainerProps {
  defaultValues?: Address
}

export function ShippingFormContainer({ defaultValues }: ShippingFormContainerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  async function onSubmit(values: any) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to save address')
      }

      router.refresh()
      // We'll add navigation to payment step later
    } catch (error) {
      console.error('Error saving address:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ShippingForm
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      isLoading={isLoading}
    />
  )
} 