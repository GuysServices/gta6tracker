import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // No code — Supabase never reached the callback (config issue or user cancelled).
  if (!code) {
    return NextResponse.redirect(`${origin}/?error=missing_code`)
  }

  // Build the redirect response FIRST so we can set session cookies directly
  // onto it. Using cookies() from next/headers and then returning a separate
  // NextResponse.redirect() would put the cookies on a different response
  // object — the browser would never see them and the session would be lost.
  const redirectTo = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read incoming cookies from the request (e.g. PKCE code verifier).
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // Write session cookies directly onto the redirect response so the
        // browser receives them in the same HTTP round-trip.
        set(name: string, value: string, options: CookieOptions) {
          redirectTo.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          redirectTo.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[auth/callback] exchangeCodeForSession error:', error?.message)
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }

  // Upsert profile row on first login.
  // GitHub exposes user_name; Google exposes full_name / name.
  const meta = data.user.user_metadata ?? {}
  const rawName =
    meta.user_name ??
    meta.full_name ??
    meta.name ??
    data.user.email?.split('@')[0] ??
    'player'

  const username = rawName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .slice(0, 32)

  await supabase
    .from('profiles')
    .upsert(
      {
        id: data.user.id,
        username,
        avatar_url: meta.avatar_url ?? null,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )

  // Session cookies are already on redirectTo — just return it.
  return redirectTo
}
