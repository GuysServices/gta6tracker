'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Search, X, Map, List, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import GTADBMapCanvas from './GTADBMapCanvas'
import {
  GTA6_LOCATIONS,
  CATEGORY_META,
  ALL_CATEGORIES,
  GTA6Location,
  GTA6Category,
} from '@/lib/gta6route-locations'

// ─── View toggle ─────────────────────────────────────────────────────────────

type ViewMode = 'map' | 'list'

// ─── Category filter pill ─────────────────────────────────────────────────────

function CategoryPill({
  cat,
  active,
  onClick,
}: {
  cat: GTA6Category
  active: boolean
  onClick: () => void
}) {
  const meta = CATEGORY_META[cat]
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition whitespace-nowrap',
        active
          ? 'border-transparent text-[#080910]'
          : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/20',
      )}
      style={active ? { backgroundColor: meta.color } : {}}
    >
      <span>{meta.icon}</span>
      <span>{meta.label}</span>
    </button>
  )
}

// ─── Map pin ──────────────────────────────────────────────────────────────────

function MapPin({
  loc,
  selected,
  onClick,
}: {
  loc: GTA6Location
  selected: boolean
  onClick: () => void
}) {
  const meta = CATEGORY_META[loc.category]
  return (
    <button
      onClick={onClick}
      title={loc.name}
      className="absolute -translate-x-1/2 -translate-y-full group"
      style={{ left: `${loc.mapPos.x}%`, top: `${loc.mapPos.y}%` }}
    >
      <svg
        width={selected ? 22 : 16}
        height={selected ? 29 : 21}
        viewBox="0 0 32 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-150 drop-shadow-lg group-hover:scale-125"
        style={{ filter: selected ? `drop-shadow(0 0 6px ${meta.color})` : undefined }}
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16c0 10 16 26 16 26S32 26 32 16C32 7.163 24.837 0 16 0z"
          fill={meta.color}
        />
        <circle cx="16" cy="16" r="10" fill="#080910" fillOpacity="0.7" />
        <text x="16" y="21" textAnchor="middle" fontSize="12" fontFamily="system-ui">
          {meta.icon}
        </text>
      </svg>
    </button>
  )
}

// ─── Detail popup ─────────────────────────────────────────────────────────────

function DetailCard({ loc, onClose }: { loc: GTA6Location; onClose: () => void }) {
  const meta = CATEGORY_META[loc.category]
  return (
    <div className="absolute bottom-4 left-1/2 z-30 w-72 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0d0e1c]/95 p-4 shadow-2xl backdrop-blur-md sm:w-80">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 text-white/30 hover:text-white/70 transition"
      >
        <X size={14} />
      </button>
      <div className="mb-1 flex items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: meta.color + '28', color: meta.color }}
        >
          {meta.icon} {meta.label}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-semibold text-white leading-snug">{loc.name}</p>
      <p className="mt-1 text-xs text-white/45">{loc.area}</p>
    </div>
  )
}

// ─── Map view ─────────────────────────────────────────────────────────────────

function MapView({
  locations,
  activeCategories,
}: {
  locations: GTA6Location[]
  activeCategories: Set<GTA6Category>
}) {
  const [selected, setSelected] = useState<GTA6Location | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const visible = useMemo(
    () =>
      locations.filter(
        l => activeCategories.size === 0 || activeCategories.has(l.category),
      ),
    [locations, activeCategories],
  )

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelected(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-white/[0.08]"
      style={{ aspectRatio: '1 / 0.78' }}
    >
      {/* Map image */}
      <img
        src="/map/Leonida_Map_Poster.08ir77j-.26ny.avif"
        alt="Leonida map"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Dark overlay so pins pop */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      {/* Pins */}
      {visible.map(loc => (
        <MapPin
          key={loc.id}
          loc={loc}
          selected={selected?.id === loc.id}
          onClick={() => setSelected(prev => (prev?.id === loc.id ? null : loc))}
        />
      ))}

      {/* Detail card */}
      {selected && <DetailCard loc={selected} onClose={() => setSelected(null)} />}

      {/* Attribution */}
      <div className="pointer-events-none absolute bottom-1.5 right-2 text-[8px] text-white/25">
        Location data: gtadb.org · CC BY 4.0
      </div>

      {/* Pin count */}
      <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[9px] text-white/50 backdrop-blur-sm">
        {visible.length} pins
      </div>
    </div>
  )
}

// ─── List view ────────────────────────────────────────────────────────────────

function LocationRow({ loc }: { loc: GTA6Location }) {
  const meta = CATEGORY_META[loc.category]
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3 transition hover:bg-white/[0.045]">
      <span className="mt-0.5 text-base">{meta.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">{loc.name}</p>
        <p className="mt-0.5 truncate text-[11px] text-white/40">{loc.area}</p>
      </div>
      <span
        className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold"
        style={{ backgroundColor: meta.color + '22', color: meta.color }}
      >
        {meta.label}
      </span>
    </div>
  )
}

function ListView({
  locations,
  activeCategories,
  query,
  communityOnly,
}: {
  locations: GTA6Location[]
  activeCategories: Set<GTA6Category>
  query: string
  communityOnly: boolean
}) {
  const q = query.toLowerCase()
  const filtered = useMemo(
    () =>
      locations.filter(l => {
        const catOk = activeCategories.size === 0 || activeCategories.has(l.category)
        const communityOk = !communityOnly || Boolean(l.isCommunity)
        const qOk =
          !q ||
          l.name.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q) ||
          l.categoryLabel.toLowerCase().includes(q)
        return catOk && communityOk && qOk
      }),
    [locations, activeCategories, q, communityOnly],
  )

  return (
    <div className="flex flex-col gap-1.5">
      <p className="mb-1 text-[10px] text-white/30">{filtered.length} locations</p>
      {filtered.map(loc => (
        <LocationRow key={loc.id} loc={loc} />
      ))}
      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-white/30">no locations match</p>
      )}
    </div>
  )
}

// ─── Category dropdown ────────────────────────────────────────────────────────

function CategoryDropdown({
  active,
  onToggle,
  onClear,
  communityOnly,
  onToggleCommunity,
}: {
  active: Set<GTA6Category>
  onToggle: (c: GTA6Category) => void
  onClear: () => void
  communityOnly: boolean
  onToggleCommunity: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition',
          active.size > 0 || communityOnly
            ? 'border-[#ff79a8]/50 bg-[#ff79a8]/10 text-[#ff79a8]'
            : 'border-white/10 text-white/40 hover:text-white/70',
        )}
      >
        Categories
        {(active.size > 0 || communityOnly) && (
          <span className="rounded-full bg-[#ff79a8] px-1.5 py-0.5 text-[9px] font-bold text-[#080910]">
            {active.size + (communityOnly ? 1 : 0)}
          </span>
        )}
        <ChevronDown size={11} className={clsx('transition', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-80 w-56 overflow-y-auto rounded-xl border border-white/[0.12] bg-[#0d0e1c] p-2 shadow-2xl">
          {active.size > 0 && (
            <button
              onClick={() => { onClear(); setOpen(false) }}
              className="mb-1.5 w-full rounded-lg bg-white/5 px-2 py-1.5 text-left text-[10px] text-white/50 hover:text-white/80 transition"
            >
              Clear all filters
            </button>
          )}
          <div className="mb-1.5 border-b border-white/[.07] pb-2">
            <button onClick={onToggleCommunity} className={clsx('flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] font-bold tracking-[.12em] transition', communityOnly ? 'bg-[#ff79a8]/15 text-[#ff9bb5]' : 'text-white/55 hover:bg-white/[.05] hover:text-white')}>
              <span className={clsx('flex h-4 w-4 items-center justify-center rounded border text-[9px]', communityOnly ? 'border-[#ff79a8] bg-[#ff79a8] text-[#080910]' : 'border-white/20 text-transparent')}>✓</span>
              <span>🌐 COMMUNITY</span><span className="ml-auto text-[9px] text-white/30">Reported</span>
            </button>
            <p className="px-2.5 pt-1 text-[9px] leading-4 text-white/30">Community-reported discoveries, kept separate from verified GTADB entries.</p>
          </div>
          <div className="flex flex-col gap-0.5">
            {ALL_CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat]
              const on = active.has(cat)
              return (
                <button
                  key={cat}
                  onClick={() => onToggle(cat)}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11px] transition',
                    on ? 'text-white' : 'text-white/40 hover:text-white/70',
                  )}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: on ? meta.color : '#ffffff22' }}
                  />
                  {meta.icon} {meta.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main MapTab ──────────────────────────────────────────────────────────────

export default function MapTab() {
  const [view, setView] = useState<ViewMode>('map')
  const [query, setQuery] = useState('')
  const [activeCategories, setActiveCategories] = useState<Set<GTA6Category>>(new Set())
  const [communityOnly, setCommunityOnly] = useState(false)

  const toggleCategory = useCallback((cat: GTA6Category) => {
    setActiveCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  const clearCategories = useCallback(() => setActiveCategories(new Set()), [])

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {/* ── Header ── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Leonida Map</h2>
          <p className="mt-0.5 text-xs text-white/35">
            716 locations · 39 categories · data: gtadb.org (CC BY 4.0)
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => setView('map')}
              className={clsx(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition',
                view === 'map' ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60',
              )}
            >
              <Map size={12} /> Map
            </button>
            <button
              onClick={() => setView('list')}
              className={clsx(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition',
                view === 'list' ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60',
              )}
            >
              <List size={12} /> List
            </button>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {/* Search (list mode only) */}
        {view === 'list' && (
          <div className="relative min-w-[180px] flex-1">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search locations…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-white/10 bg-white/5 pl-8 pr-3 text-xs text-white/90 placeholder-white/25 outline-none focus:border-white/20"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
              >
                <X size={11} />
              </button>
            )}
          </div>
        )}

        {/* Category filter */}
        <CategoryDropdown
          active={activeCategories}
          onToggle={toggleCategory}
          onClear={() => { clearCategories(); setCommunityOnly(false) }}
          communityOnly={communityOnly}
          onToggleCommunity={() => setCommunityOnly(value => !value)}
        />

        {/* Quick-pick pills (top 8 most useful) */}
        {(['easter-eggs', 'rare-cars', 'safehouses', 'military', 'gun-stores', 'landmarks', 'curiosities', 'entertainment'] as GTA6Category[]).map(cat => (
          <CategoryPill
            key={cat}
            cat={cat}
            active={activeCategories.has(cat)}
            onClick={() => toggleCategory(cat)}
          />
        ))}
      </div>

      {/* ── View ── */}
      {view === 'map' ? (
        <>
          {communityOnly && <p className="mb-2 rounded-lg border border-[#ff79a8]/20 bg-[#ff79a8]/[.05] px-3 py-2 text-[10px] leading-4 text-[#ffb4ca]/80">COMMUNITY filter is on. Only entries with verified GTADB coordinates can appear as pins; unconfirmed community discoveries are listed in List view.</p>}
          <GTADBMapCanvas locations={GTA6_LOCATIONS.filter(l => (!communityOnly || l.isCommunity) && (activeCategories.size === 0 || activeCategories.has(l.category)))} />
        </>
      ) : (
        <ListView
          locations={GTA6_LOCATIONS}
          activeCategories={activeCategories}
          query={query}
          communityOnly={communityOnly}
        />
      )}
    </div>
  )
}
