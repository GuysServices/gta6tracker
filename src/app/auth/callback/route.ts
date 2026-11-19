import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Upsert profile on first login
      // GitHub: user_name | Google: full_name / name
      const meta = data.user.user_metadata ?? {}
      const username = (meta.user_name ?? meta.full_name ?? meta.name ?? data.user.email?.split('@')[0] ?? 'player')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')
        .slice(0, 32)

      await supabase.from('profiles').upsert({
        id: data.user.id,
        username,
        avatar_url: meta.avatar_url ?? null,
      }, { onConflict: 'id', ignoreDuplicates: true })

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
