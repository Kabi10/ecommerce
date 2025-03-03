import { auth } from './auth'

// Export a minimal middleware that only handles auth
export default auth()

export const config = {
  matcher: [
    // Auth, webhooks, and protected routes
    '/api/auth/:path*',
    '/api/webhooks/:path*',
    '/checkout/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    // All routes except static files and api
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
} 