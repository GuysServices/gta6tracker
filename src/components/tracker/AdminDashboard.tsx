'use client'

import { useMemo, useState } from 'react'
import { Activity, CheckCircle2, ClipboardList, MapPin, Search, ShieldCheck, Users } from 'lucide-react'
import type { Chapter } from '@/lib/missions'

type AdminUser = {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
  completed: number
  totalProgress: number
  lastActive: string | null
}
type Location = { id: number; name: string; area: string; categoryLabel: string }

type Props = {
  users: AdminUser[]
  chapters: Chapter[]
  locations: Location[]
  totalCompletions: number
}

type Section = 'overview' | 'users' | 'missions' | 'map'

const NAV: { id: Section; label: string; icon: typeof Activity }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'missions', label: 'Missions', icon: ClipboardList },
  { id: 'map', label: 'Map Manager', icon: MapPin },
]

function dateLabel(value: string | null) {
  if (!value) return 'No activity yet'
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminDashboard({ users, chapters, locations, totalCompletions }: Props) {
  const [section, setSection] = useState<Section>('overview')
  const [userSearch, setUserSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const now = Date.now()
  const activeToday = users.filter(u => u.lastActive && now - new Date(u.lastActive).getTime() < 86400000).length
  const activeWeek = users.filter(u => u.lastActive && now - new Date(u.lastActive).getTime() < 7 * 86400000).length
  const newUsers = users.filter(u => now - new Date(u.created_at).getTime() < 7 * 86400000).length
  const filteredUsers = useMemo(() => users.filter(u => (u.username + ' ' + u.id).toLowerCase().includes(userSearch.toLowerCase())), [users, userSearch])
  const filteredLocations = useMemo(() => locations.filter(l => (l.name + ' ' + l.area + ' ' + l.categoryLabel).toLowerCase().includes(locationSearch.toLowerCase())), [locations, locationSearch])
  const selected = users.find(u => u.id === selectedUser)
  const missionCount = chapters.reduce((sum, chapter) => sum + chapter.missions.length, 0)

  const metrics = [
    { label: 'Registered users', value: users.length, detail: `+${newUsers} this week`, icon: Users },
    { label: 'Active today', value: activeToday, detail: `${activeWeek} active this week`, icon: Activity },
    { label: 'Mission completions', value: totalCompletions, detail: 'Across the community', icon: CheckCircle2 },
    { label: 'Map locations', value: locations.length, detail: 'In the current location catalog', icon: MapPin },
  ]

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 py-7 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.24em] text-[#ff9bb5]"><ShieldCheck size={13}/> Private owner area</div>
          <h1 className="font-display text-3xl font-bold text-white">Control Center</h1>
          <p className="mt-1 text-sm text-white/40">Manage and monitor your Leonida Tracker.</p>
        </div>
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[.06] px-3 py-2 text-xs text-emerald-300">Owner access verified</div>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-white/[.08] bg-[#0d0e18] p-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setSection(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold transition ${section === id ? 'bg-[#ff79a8]/15 text-[#ff9bb5]' : 'text-white/45 hover:bg-white/[.04] hover:text-white'}`}>
            <Icon size={14}/>{label}
          </button>
        ))}
      </div>

      {section === 'overview' && <>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({label,value,detail,icon:Icon}) => <div key={label} className="rounded-xl border border-white/[.08] bg-[#11121d] p-5">
            <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/40">{label}</span><Icon size={17} className="text-[#ff9bb5]"/></div>
            <div className="mt-3 font-display text-3xl font-bold text-white">{value.toLocaleString()}</div>
            <div className="mt-1 text-xs text-white/35">{detail}</div>
          </div>)}
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-5">
            <h2 className="font-display text-lg font-bold">Recent registrations</h2>
            <div className="mt-4 divide-y divide-white/[.06]">
              {users.slice().sort((a,b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0,6).map(u => <div key={u.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0"><div className="truncate text-sm font-medium text-white">{u.username}</div><div className="text-[11px] text-white/35">{dateLabel(u.created_at)}</div></div>
                <span className="shrink-0 rounded-md bg-white/[.05] px-2 py-1 text-[10px] text-white/45">{u.completed} completed</span>
              </div>)}
              {!users.length && <p className="py-5 text-sm text-white/35">No registered users yet.</p>}
            </div>
          </div>
          <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-5">
            <h2 className="font-display text-lg font-bold">Tracker inventory</h2>
            <div className="mt-4 space-y-4">
              <div><div className="flex justify-between text-xs"><span className="text-white/45">Story chapters</span><b>{chapters.length}</b></div><div className="mt-2 h-1.5 rounded-full bg-white/[.07]"><div className="h-full rounded-full bg-[#ff79a8]" style={{width:'100%'}}/></div></div>
              <div><div className="flex justify-between text-xs"><span className="text-white/45">Tracked missions</span><b>{missionCount}</b></div><div className="mt-2 h-1.5 rounded-full bg-white/[.07]"><div className="h-full rounded-full bg-[#ff79a8]" style={{width:'100%'}}/></div></div>
              <div><div className="flex justify-between text-xs"><span className="text-white/45">Map locations</span><b>{locations.length}</b></div><div className="mt-2 h-1.5 rounded-full bg-white/[.07]"><div className="h-full rounded-full bg-[#ff79a8]" style={{width:'100%'}}/></div></div>
            </div>
            <p className="mt-5 rounded-lg border border-amber-300/10 bg-amber-300/[.04] p-3 text-[11px] leading-5 text-amber-100/55">Activity is calculated from saved mission progress. Map popularity analytics will need location-visit tracking before it can show real rankings.</p>
          </div>
        </div>
      </>}

      {section === 'users' && <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-display text-lg font-bold">User directory</h2><p className="text-xs text-white/40">{users.length} registered accounts</p></div><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"/><input value={userSearch} onChange={e=>setUserSearch(e.target.value)} placeholder="Search username or ID" className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#ff79a8]/50 sm:w-64"/></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wider text-white/35"><tr><th className="pb-3">User</th><th className="pb-3">Joined</th><th className="pb-3">Last activity</th><th className="pb-3">Completed</th><th className="pb-3"></th></tr></thead><tbody className="divide-y divide-white/[.06]">
          {filteredUsers.map(u=><tr key={u.id}><td className="py-3"><div className="font-semibold text-white">{u.username}</div><div className="mt-1 max-w-[190px] truncate text-[10px] text-white/25">{u.id}</div></td><td className="py-3 text-white/50">{dateLabel(u.created_at)}</td><td className="py-3 text-white/50">{dateLabel(u.lastActive)}</td><td className="py-3 text-white">{u.completed}</td><td className="py-3 text-right"><button onClick={()=>setSelectedUser(selectedUser===u.id?null:u.id)} className="rounded-md border border-white/10 px-3 py-1.5 text-[10px] text-white/60 hover:border-[#ff79a8]/40 hover:text-white">{selectedUser===u.id?'Close':'View progress'}</button></td></tr>)}
        </tbody></table>{!filteredUsers.length && <p className="py-8 text-center text-sm text-white/35">No users match that search.</p>}</div>
        {selected && <div className="mt-5 rounded-lg border border-[#ff79a8]/20 bg-[#ff79a8]/[.04] p-4"><div className="font-semibold">{selected.username} — progress summary</div><div className="mt-2 flex gap-5 text-xs text-white/55"><span>{selected.completed} completed</span><span>{selected.totalProgress} saved statuses</span><span>Joined {dateLabel(selected.created_at)}</span></div><p className="mt-3 text-[10px] text-white/35">Read-only account view. Destructive actions such as bans and progress resets are not enabled yet.</p></div>}
      </div>}

      {section === 'missions' && <div className="space-y-3">
        <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-5"><h2 className="font-display text-lg font-bold">Mission catalog</h2><p className="mt-1 text-xs text-white/40">{missionCount} missions across {chapters.length} chapters. This view reflects the current built-in catalog.</p></div>
        {chapters.map(ch=><details key={ch.id} className="group rounded-xl border border-white/[.08] bg-[#11121d]"><summary className="flex cursor-pointer list-none items-center justify-between p-4"><div><div className="text-sm font-semibold text-white">Chapter {ch.number}: {ch.name}</div><div className="mt-1 text-[11px] text-white/35">{ch.missions.length} missions</div></div><span className="text-xs text-[#ff9bb5]">View missions +</span></summary><div className="divide-y divide-white/[.05] border-t border-white/[.06] px-4">{ch.missions.map(m=><div key={m.id} className="flex items-start justify-between gap-4 py-3"><div><div className="text-xs font-medium text-white">{m.name}</div><div className="mt-1 text-[10px] text-white/35">{m.id} · {m.type} · {m.protagonist}</div></div><span className="max-w-[55%] text-right text-[10px] leading-4 text-white/35">{m.description}</span></div>)}</div></details>)}
        <p className="rounded-lg border border-amber-300/10 bg-amber-300/[.04] p-3 text-[11px] leading-5 text-amber-100/55">Mission editing is not enabled yet because missions currently live in the source catalog. This page is a safe read-only preview.</p>
      </div>}

      {section === 'map' && <div className="rounded-xl border border-white/[.08] bg-[#11121d] p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-display text-lg font-bold">Map location catalog</h2><p className="text-xs text-white/40">{locations.length} known locations</p></div><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"/><input value={locationSearch} onChange={e=>setLocationSearch(e.target.value)} placeholder="Search locations" className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#ff79a8]/50 sm:w-64"/></div></div>
        <div className="max-h-[620px] overflow-auto"><table className="w-full min-w-[500px] text-left text-xs"><thead className="sticky top-0 bg-[#11121d] text-[10px] uppercase tracking-wider text-white/35"><tr><th className="pb-3">Location</th><th className="pb-3">Category</th><th className="pb-3">Area</th></tr></thead><tbody className="divide-y divide-white/[.05]">{filteredLocations.map(l=><tr key={l.id}><td className="py-3 font-medium text-white">{l.name}</td><td className="py-3 text-white/45">{l.categoryLabel}</td><td className="py-3 text-white/45">{l.area}</td></tr>)}</tbody></table>{!filteredLocations.length&&<p className="py-8 text-center text-sm text-white/35">No locations found.</p>}</div>
        <p className="mt-4 text-[10px] text-white/35">Coordinates and location editing remain read-only so the live GTADB map pins are not accidentally changed.</p>
      </div>}
    </section>
  )
}
