import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')

  // Allow access to authentication API routes
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (isAuth) {
      return Response.redirect(new URL('/dashboard', req.nextUrl))
    }
    return NextResponse.next()
  }

  // Protect admin routes
  if (isAdminPage) {
    if (!isAuth) {
      return Response.redirect(new URL('/auth/signin', req.nextUrl))
    }
    
    const userRole = req.auth?.user?.role
    if (userRole !== 'ADMIN') {
      return Response.redirect(new URL('/', req.nextUrl))
    }
    
    return NextResponse.next()
  }

  // Protect dashboard and other authenticated routes
  if (!isAuth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/auth/signin', req.nextUrl))
  }

  return NextResponse.next()
})

// Specify which routes should be handled by the middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 