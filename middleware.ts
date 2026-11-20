import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware runs on every request before the route handler.
 * Its job: refresh the Supabase session if the access token is expired,
 * and write the refreshed tokens back onto BOTH the request (so the route
 * handler sees them) and the response (so the browser keeps them).
 *
 * Without this, an expired access token causes getUser() in the route
 * handler to return null, the API returns 401, and all status buttons
 * silently do nothing.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Write onto the request so downstream route handlers see the refresh.
          request.cookies.set({ name, value, ...options } as never)
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          // Write onto the response so the browser stores the new token.
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options } as never)
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  // This is the key call: it validates the session and refreshes if needed.
  // The result is intentionally unused here — the side effect (cookie write) is what matters.
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Run on all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - Public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
