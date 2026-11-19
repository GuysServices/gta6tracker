import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Used in Server Components, Server Actions, and the /api/ Route Handlers.
//
// Cookie set/remove are wrapped in try/catch because Server Components receive
// a read-only cookie store — calling .set() there would throw. The try/catch
// lets the same factory function be used in both contexts without branching.
export function createServerSupabaseClient() {
  const cookieStore = cookies()

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
          } catch {
            // Server Component — read-only context, ignore.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Server Component — read-only context, ignore.
          }
        },
      },
    }
  )
}
