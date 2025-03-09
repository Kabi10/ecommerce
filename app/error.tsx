'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
          <div className="mb-6 text-gray-600">
            <p className="mb-4">
              An error occurred in the Server Components render. The specific message is omitted in 
              production builds to avoid leaking sensitive details.
            </p>
            {error.digest && (
              <div className="bg-gray-100 p-4 rounded-md text-left mb-4">
                <p className="font-mono text-sm">Error Digest: {error.digest}</p>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-2">
              This error has been logged and our team will look into it.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => reset()}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/debug"
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go to Diagnostics
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Refresh page
            </button>
            <Link
              href="/"
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 