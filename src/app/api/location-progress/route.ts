import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { GTA6_LOCATIONS } from '@/lib/gta6route-locations'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in to view saved map progress.' }, { status: 401 })
  const { data, error } = await supabase.from('user_location_progress').select('location_id,is_completed,is_favorite,note').eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in to save map progress.' }, { status: 401 })
  let body: { location_id?: number; is_completed?: boolean; is_favorite?: boolean }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }) }
  const locationId = Number(body.location_id)
  if (!Number.isInteger(locationId) || !GTA6_LOCATIONS.some(location => location.id === locationId)) {
    return NextResponse.json({ error: 'Unknown map location.' }, { status: 400 })
  }
  const isCompleted = Boolean(body.is_completed)
  const isFavorite = Boolean(body.is_favorite)
  if (!isCompleted && !isFavorite) {
    const { error } = await supabase.from('user_location_progress').delete().eq('user_id', user.id).eq('location_id', locationId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }
  const { error } = await supabase.from('user_location_progress').upsert({
    user_id: user.id, location_id: locationId, is_completed: isCompleted, is_favorite: isFavorite, updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,location_id' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
