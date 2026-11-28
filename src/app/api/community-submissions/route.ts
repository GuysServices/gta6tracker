import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in to submit a community discovery.' }, { status: 401 })
  let body: { name?: string; area?: string; category?: string; description?: string; evidence_url?: string | null }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }) }
  const name = body.name?.trim()
  const area = body.area?.trim()
  const category = body.category?.trim() || 'Discovery'
  const description = body.description?.trim()
  const evidenceUrl = body.evidence_url?.trim() || null
  if (!name || !area || !description) return NextResponse.json({ error: 'Name, area, and details are required.' }, { status: 400 })
  if (name.length > 100 || area.length > 160 || description.length > 1500 || category.length > 40 || (evidenceUrl && evidenceUrl.length > 500)) {
    return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 400 })
  }
  if (evidenceUrl) {
    try { const parsed = new URL(evidenceUrl); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error() }
    catch { return NextResponse.json({ error: 'Evidence must be a valid http or https URL.' }, { status: 400 }) }
  }
  const { data, error } = await supabase.from('community_submissions').insert({
    user_id: user.id, name, area, category, description, evidence_url: evidenceUrl,
  }).select('id,status,created_at').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
