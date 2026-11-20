import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { MissionStatus } from '@/types'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  // getUser() validates the JWT server-side — does not trust the client.
  // With middleware in place, the session is always fresh by the time we get here.
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('[/api/progress POST] auth error:', authError?.message ?? 'no user')
    return NextResponse.json(
      { error: 'Unauthorized — please sign in again.' },
      { status: 401 },
    )
  }

  let body: { mission_id?: string; status?: MissionStatus; note?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { mission_id, status, note } = body

  if (!mission_id || !status) {
    return NextResponse.json({ error: 'Missing fields: mission_id and status are required' }, { status: 400 })
  }

  const validStatuses: MissionStatus[] = ['incomplete', 'completed', 'failed', 'skipped']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 })
  }

  // Resetting to incomplete: delete the row so the DB stays clean.
  // Storing an "incomplete" row causes upsert noop edge cases where
  // .single() returns null and RLS blocks the read-back after insert.
  if (status === 'incomplete') {
    const { error: deleteError } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('mission_id', mission_id)

    if (deleteError) {
      console.error('[/api/progress POST] delete error:', deleteError.message, deleteError.details)
      return NextResponse.json(
        { error: `Failed to reset mission: ${deleteError.message}` },
        { status: 500 },
      )
    }

    // Return a synthetic incomplete record so the client can update its state.
    return NextResponse.json({
      data: {
        user_id: user.id,
        mission_id,
        status: 'incomplete' as MissionStatus,
        note: null,
        updated_at: new Date().toISOString(),
      },
    })
  }

  // Upsert: insert on first save, update on subsequent saves.
  // onConflict targets the unique(user_id, mission_id) constraint defined in the schema.
  const { data, error: upsertError } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: user.id,
        mission_id,
        status,
        note: note ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,mission_id' },
    )
    .select()
    .single()

  if (upsertError) {
    console.error('[/api/progress POST] upsert error:', upsertError.message, upsertError.details, upsertError.hint)
    return NextResponse.json(
      { error: `Failed to save mission: ${upsertError.message}` },
      { status: 500 },
    )
  }

  if (!data) {
    // Upsert ran but returned no row — almost always an RLS read-back issue.
    // The row WAS written (upsert succeeded with no error), but the SELECT
    // is blocked. Return a synthetic record so the UI still updates.
    console.warn('[/api/progress POST] upsert returned no data for', mission_id, '— RLS may be blocking SELECT after upsert')
    return NextResponse.json({
      data: {
        user_id: user.id,
        mission_id,
        status,
        note: note ?? null,
        updated_at: new Date().toISOString(),
      },
    })
  }

  return NextResponse.json({ data })
}

export async function DELETE(request: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('[/api/progress DELETE] auth error:', authError?.message ?? 'no user')
    return NextResponse.json(
      { error: 'Unauthorized — please sign in again.' },
      { status: 401 },
    )
  }

  const { searchParams } = new URL(request.url)
  const mission_id = searchParams.get('mission_id')

  if (!mission_id) {
    return NextResponse.json({ error: 'Missing mission_id query param' }, { status: 400 })
  }

  const { error: deleteError } = await supabase
    .from('user_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('mission_id', mission_id)

  if (deleteError) {
    console.error('[/api/progress DELETE] error:', deleteError.message)
    return NextResponse.json(
      { error: `Failed to delete: ${deleteError.message}` },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
