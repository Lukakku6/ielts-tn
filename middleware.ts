import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function middleware(req: NextRequest) {
  // Only protect admin routes
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Use the admin client directly to check auth
  const { data: { session } } = await supabaseAdmin.auth.getSession()
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Check if user is admin
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  if (error || !profile?.is_admin) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}