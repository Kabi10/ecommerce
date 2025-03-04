import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

// Export a middleware function that handles auth
export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Check if the request is for the admin area
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If not logged in or not an admin, redirect to login
    if (!session || session.user.role !== 'ADMIN') {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protected routes that require authentication
    '/admin/:path*',
    '/dashboard/:path*',
    '/checkout/:path*',
  ]
} 