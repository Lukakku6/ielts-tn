import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get the user session
  const { data: { session } } = await supabase.auth.getSession()

  // Protect admin routes - only allow logged-in users
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Redirect to login if not authenticated
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Optional: Check if user is an admin
    // You can check email or a custom role here
    // For now, we'll allow any logged-in user
    // To restrict to specific emails, uncomment the code below:
    
    /*
    const adminEmails = ['your-email@example.com', 'admin@example.com']
    if (!adminEmails.includes(session.user.email || '')) {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL('/', req.url))
    }
    */
  }

  return res
}

// Specify which routes the middleware should run on
export const config = {
  matcher: ['/admin/:path*']
}