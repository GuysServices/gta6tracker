import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { MissionStatus } from '@/types'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    mission_id: string
    status: MissionStatus
    note?: string
  }

  if (!body.mission_id || !body.status) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      mission_id: body.mission_id,
      status: body.status,
      note: body.note ?? null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,mission_id' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(request: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const mission_id = searchParams.get('mission_id')

  if (!mission_id) {
    return NextResponse.json({ error: 'Missing mission_id' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('mission_id', mission_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
