'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Caught in error boundary:', error);
      setError(error.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <div className="mb-6 text-gray-600">
              <p className="mb-4">
                We encountered an error while rendering this page. Our team has been notified.
              </p>
              <div className="bg-gray-100 p-4 rounded-md text-left mb-4 overflow-auto max-h-40">
                <p className="font-mono text-sm text-red-500">
                  {error?.message || 'Unknown error'}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setHasError(false);
                  setError(null);
                  window.location.reload();
                }}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/debug"
                className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Go to Diagnostics
              </Link>
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
    );
  }

  return <>{children}</>;
} 