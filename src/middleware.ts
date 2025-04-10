import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = await createServerSupabaseClient()

  // IMPORTANT: Avoid writing Supabase options to cookies in middleware!
  // Issue: https://github.com/supabase/ssr/issues/4
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) {
    console.error("Error getting session:", sessionError)
    return supabaseResponse
  }

  if (!session) {
    // There is no session, therefore invoke the handler handler
    return supabaseResponse
  }

  // Refresh the session unless the pathname is /auth/callback
  if (request.nextUrl.pathname !== '/auth/callback') {
    const { error } = await supabase.auth.refreshSession()
    if (error) {
      console.error("Error refreshing session:", error)
      // Delete cookies if refresh fails
      supabaseResponse.cookies.delete('sb-access-token')
      supabaseResponse.cookies.delete('sb-refresh-token')
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 