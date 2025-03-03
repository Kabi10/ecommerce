'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

function LoadingCard() {
  return (
    <div className="container flex items-center justify-center min-h-[600px]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400 animate-pulse" />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-gray-600">
            Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setError(searchParams.get('error'))
  }, [searchParams])

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Please try again later.'
      case 'AccessDenied':
        return 'Access denied. You do not have permission to access this resource.'
      case 'Verification':
        return 'The verification link is no longer valid. Please request a new one.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[600px]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-red-600">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-center">
            {getErrorMessage(error)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={() => window.location.href = '/auth/signin'}
            className="mt-4"
          >
            Return to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <AuthErrorContent />
    </Suspense>
  )
} 