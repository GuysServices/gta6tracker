import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=missing_code`)
  }

  const redirectTo = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          redirectTo.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          redirectTo.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[auth/callback] exchangeCodeForSession error:', error?.message)
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }

  // Build a safe username from whatever the OAuth provider returns.
  // Multiple fallbacks + a guaranteed non-empty default prevent FK violations
  // on user_progress (which references profiles.id).
  const meta = data.user.user_metadata ?? {}
  const rawName =
    meta.user_name ??
    meta.full_name ??
    meta.name ??
    data.user.email?.split('@')[0] ??
    'player'

  // Sanitise: lowercase, spaces→dashes, strip non-alphanumeric except - and _,
  // trim to 32 chars, then guarantee at least one character remains.
  const sanitised = rawName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '')
    .slice(0, 32)

  // If sanitisation produced an empty string (e.g. all-emoji name), fall back
  // to the first 8 hex chars of the user UUID so the row is always valid.
  const username = sanitised.length > 0 ? sanitised : data.user.id.slice(0, 8)

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: data.user.id,
        username,
        avatar_url: meta.avatar_url ?? null,
      },
      { onConflict: 'id', ignoreDuplicates: true },
    )

  if (profileError) {
    // Log but don't block the redirect — the user is authenticated even if
    // profile creation fails. The next login attempt will retry.
    console.error('[auth/callback] profile upsert error:', profileError.message)
  }

  return redirectTo
}
