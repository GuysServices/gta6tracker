'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Heart, Search, Trophy } from 'lucide-react'
import { GTA6_LOCATIONS, ALL_CATEGORIES, CATEGORY_META, GTA6Category } from '@/lib/gta6route-locations'

type Saved = { location_id: number; is_completed: boolean; is_favorite: boolean; note: string | null }

export default function CompletionCenter() {
  const [saved, setSaved] = useState<Record<number, Saved>>({})
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<GTA6Category | 'all'>('all')
  const [mode, setMode] = useState<'all' | 'favorites' | 'remaining'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    fetch('/api/location-progress', { credentials: 'same-origin' })
      .then(async response => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'Could not load your map progress.')
        if (alive) {
          const next: Record<number, Saved> = {}
          for (const row of (payload.data ?? []) as Saved[]) next[row.location_id] = row
          setSaved(next)
        }
      })
      .catch(err => { if (alive) setError(err instanceof Error ? err.message : 'Could not load progress.') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  const completed = Object.values(saved).filter(item => item.is_completed).length
  const percent = Math.round((completed / GTA6_LOCATIONS.length) * 100)
  const filtered = useMemo(() => GTA6_LOCATIONS.filter(location => {
    const item = saved[location.id]
    const matchesQuery = !query || (location.name + ' ' + location.area).toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || location.category === category
    const matchesMode = mode === 'all' || (mode === 'favorites' ? item?.is_favorite : !item?.is_completed)
    return matchesQuery && matchesCategory && matchesMode
  }), [query, category, mode, saved])

  async function update(locationId: number, patch: Partial<Pick<Saved, 'is_completed' | 'is_favorite'>>) {
    const previous = saved[locationId]
    const next: Saved = { location_id: locationId, is_completed: false, is_favorite: false, note: null, ...previous, ...patch }
    setSaved(current => ({ ...current, [locationId]: next }))
    setError('')
    try {
      const response = await fetch('/api/location-progress', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location_id: locationId, is_completed: next.is_completed, is_favorite: next.is_favorite }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Could not save this location.')
    } catch (err) {
      setSaved(current => {
        const copy = { ...current }
        if (previous) copy[locationId] = previous
        else delete copy[locationId]
        return copy
      })
      setError(err instanceof Error ? err.message : 'Could not save this location.')
    }
  }

  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 py-7 sm:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.22em] text-[#ff9bb5]">Your personal checklist</p><h2 className="font-display text-3xl font-bold">100% Completion Center</h2><p className="mt-1 text-sm text-white/40">Track every known Leonida map location, save favorites, and work toward a full clear.</p></div>
        <div className="rounded-xl border border-white/10 bg-[#11121d] px-5 py-3"><div className="flex items-center gap-2 text-xs text-white/45"><Trophy size={14} className="text-[#ff9bb5]"/> Map completion</div><div className="mt-1 text-2xl font-bold">{percent}% <span className="text-xs font-normal text-white/35">{completed}/{GTA6_LOCATIONS.length}</span></div><div className="mt-2 h-1.5 w-48 max-w-full overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#ff79a8] transition-all" style={{ width: percent + '%' }}/></div></div>
      </div>
      {error && <p role="alert" className="mb-4 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{error}</p>}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[190px] flex-1"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search locations or areas" className="w-full rounded-lg border border-white/10 bg-[#11121d] py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-[#ff79a8]/50"/></div>
        <select value={category} onChange={e=>setCategory(e.target.value as GTA6Category | 'all')} className="rounded-lg border border-white/10 bg-[#11121d] px-3 py-2 text-xs text-white"><option value="all">All categories</option>{ALL_CATEGORIES.map(cat=><option key={cat} value={cat}>{CATEGORY_META[cat].label}</option>)}</select>
        <div className="flex rounded-lg border border-white/10 p-1">{(['all','remaining','favorites'] as const).map(value=><button key={value} onClick={()=>setMode(value)} className={`rounded-md px-3 py-1.5 text-[10px] font-semibold capitalize ${mode===value?'bg-[#ff79a8]/15 text-[#ff9bb5]':'text-white/40'}`}>{value}</button>)}</div>
      </div>
      <div className="mb-3 flex items-center justify-between text-[10px] text-white/35"><span>{filtered.length} locations shown</span><span>{loading ? 'Loading saved progress…' : 'Progress saves to your account'}</span></div>
      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map(location => {
          const item = saved[location.id]
          return <div key={location.id} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-[#11121d] p-3">
            <button onClick={()=>update(location.id,{is_completed:!item?.is_completed})} aria-label={item?.is_completed?'Mark incomplete':'Mark completed'} className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${item?.is_completed?'border-emerald-400/30 bg-emerald-400/10 text-emerald-300':'border-white/10 text-white/25 hover:text-white/70'}`}><CheckCircle2 size={16}/></button>
            <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold text-white/90">{location.name}</div><div className="mt-1 truncate text-[10px] text-white/35">{location.area} · {CATEGORY_META[location.category].label}{location.isCommunity?' · COMMUNITY':''}</div></div>
            <button onClick={()=>update(location.id,{is_favorite:!item?.is_favorite})} aria-label={item?.is_favorite?'Remove favorite':'Add favorite'} className={item?.is_favorite?'text-pink-300':'text-white/20 hover:text-pink-200'}><Heart size={15} fill={item?.is_favorite?'currentColor':'none'}/></button>
          </div>
        })}
      </div>
      {!filtered.length && <p className="py-12 text-center text-sm text-white/35">No locations match these filters.</p>}
      <p className="mt-5 text-[10px] text-white/25">Community-reported discoveries are included in your checklist but remain labeled as unverified.</p>
    </section>
  )
}
