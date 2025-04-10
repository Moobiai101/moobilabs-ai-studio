import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
// import type { Database } from '@/types/supabase' // Temporarily remove type for build

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies() // Await the cookies function

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error: unknown) {
            // Catching error but not using it
            console.error("Error setting cookie:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error: unknown) {
             // Catching error but not using it
             console.error("Error removing cookie:", error)
          }
        },
      },
    }
  )
} 