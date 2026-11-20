import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in:
 *   - Server Components (read-only cookie context — set/remove silently no-op)
 *   - Route Handlers (writable cookie context — set/remove work and are written to the response)
 *   - Server Actions (writable cookie context)
 *
 * Session refreshes are handled by middleware.ts before the request reaches
 * this client, so by the time getUser() is called here the token is current.
 */
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
            // Server Component — read-only cookie store; ignore.
            // Route Handlers and Server Actions use a writable store,
            // but middleware.ts already handles token refresh there.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Server Component — read-only cookie store; ignore.
          }
        },
      },
    },
  )
}
