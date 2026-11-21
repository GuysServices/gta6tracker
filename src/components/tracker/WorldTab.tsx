'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import {
  WORLD_LOCATIONS,
  CATEGORIES,
  CATEGORY_ICON,
  POICategory,
  POIStatus,
} from '@/lib/world-locations'
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ExternalLink,
  Crosshair,
  Gift,
  ShieldCheck,
  Users,
  CircleHelp,
  Info,
} from 'lucide-react'
import clsx from 'clsx'

// ── Map poster dimensions ────────────────────────────────────────────────────
const MAP_W = 2805
const MAP_H = 3840
const MIN_ZOOM = 0.5
const MAX_ZOOM = 4.0

// ── Category pin colours ─────────────────────────────────────────────────────
const CAT_COLOR: Record<POICategory, string> = {
  money:    '#ffd27a',
  weapons:  '#72dce8',
  drugs:    '#ff79a8',
  ammo:     '#9b83ff',
  vehicles: '#5fad5f',
  misc:     '#8888aa',
  secrets:  '#d5a6ff',
}

// ── Verification status display ───────────────────────────────────────────────
const STATUS_META: Record<
  POIStatus,
  { label: string; color: string; background: string; border: string; icon: typeof ShieldCheck }
> = {
  verified: {
    label: 'Verified',
    color: '#4ade80',
    background: 'rgba(74,222,128,0.12)',
    border: 'rgba(74,222,128,0.4)',
    icon: ShieldCheck,
  },
  community: {
    label: 'Community',
    color: '#38bdf8',
    background: 'rgba(56,189,248,0.12)',
    border: 'rgba(56,189,248,0.4)',
    icon: Users,
  },
  rumored: {
    label: 'Rumored',
    color: '#fbbf24',
    background: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.4)',
    icon: CircleHelp,
  },
}

const ACCURACY_META = {
  exact:       'Exact position',
  approximate: 'Approximate — within a small area',
  area:        'General search area only',
}

function StatusBadge({ status }: { status: POIStatus }) {
  const meta = STATUS_META[status]
  const Icon = meta.icon
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]"
      style={{ color: meta.color, backgroundColor: meta.background, borderColor: meta.border }}
    >
      <Icon size={9} />
      {meta.label}
    </span>
  )
}

export default function WorldTab() {
  const [activeCategory, setActiveCategory] = useState<POICategory | 'all'>('all')
  const [activeStatus, setActiveStatus] = useState<POIStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [mapHeight, setMapHeight] = useState(520)

  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // ── Responsive map height ────────────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      setMapHeight(window.innerWidth < 640 ? 360 : window.innerWidth < 1024 ? 460 : 560)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ── Filtered locations ───────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      WORLD_LOCATIONS.filter(
        loc =>
          (activeCategory === 'all' || loc.category === activeCategory) &&
          (activeStatus === 'all' || loc.status === activeStatus),
      ),
    [activeCategory, activeStatus],
  )

  const filteredIds = useMemo(() => new Set(filtered.map(l => l.id)), [filtered])

  const counts = useMemo(
    () => ({
      verified:  WORLD_LOCATIONS.filter(l => l.status === 'verified').length,
      community: WORLD_LOCATIONS.filter(l => l.status === 'community').length,
      rumored:   WORLD_LOCATIONS.filter(l => l.status === 'rumored').length,
    }),
    [],
  )

  const selectedLocation = expandedId
    ? WORLD_LOCATIONS.find(l => l.id === expandedId) ?? null
    : null

  // ── Zoom / pan helpers ───────────────────────────────────────────────────
  const clampZoom = (v: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v))

  const zoomAround = useCallback((delta: number, cx: number, cy: number) => {
    setZoom(prev => {
      const next = clampZoom(prev + delta)
      const ratio = next / prev
      setPan(p => ({ x: cx - (cx - p.x) * ratio, y: cy - (cy - p.y) * ratio }))
      return next
    })
  }, [])

  // Passive-false wheel handler attached via ref (required by browsers)
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      zoomAround(e.deltaY < 0 ? 0.25 : -0.25, e.clientX - rect.left, e.clientY - rect.top)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [zoomAround])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    setDragging(true)
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y }
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !dragStart.current) return
    setPan({
      x: dragStart.current.px + e.clientX - dragStart.current.mx,
      y: dragStart.current.py + e.clientY - dragStart.current.my,
    })
  }, [dragging])

  const stopDrag = useCallback(() => { setDragging(false); dragStart.current = null }, [])

  // Touch support
  const touchStart = useRef<{ tx: number; ty: number; px: number; py: number; dist?: number } | null>(null)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStart.current = {
        tx: e.touches[0].clientX,
        ty: e.touches[0].clientY,
        px: pan.x,
        py: pan.y,
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      touchStart.current = {
        tx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        ty: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        px: pan.x,
        py: pan.y,
        dist: Math.hypot(dx, dy),
      }
    }
  }, [pan])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (!touchStart.current) return
    if (e.touches.length === 1) {
      setPan({
        x: touchStart.current.px + e.touches[0].clientX - touchStart.current.tx,
        y: touchStart.current.py + e.touches[0].clientY - touchStart.current.ty,
      })
    } else if (e.touches.length === 2 && touchStart.current.dist) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const delta = (dist - touchStart.current.dist) * 0.004
      const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2
      const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2
      const rect = mapRef.current?.getBoundingClientRect()
      if (rect) zoomAround(delta, cx - rect.left, cy - rect.top)
      touchStart.current.dist = dist
    }
  }, [zoomAround])

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const selectLocation = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
    setHoveredId(null)
  }

  const focusPin = (id: string) => {
    const loc = WORLD_LOCATIONS.find(l => l.id === id)
    if (!loc?.mapPosition || !mapRef.current) return
    setExpandedId(id)
    // Centre the pin in the viewport
    const rect = mapRef.current.getBoundingClientRect()
    const targetZoom = 2
    const pinXPct = loc.mapPosition.x / MAP_W
    const pinYPct = loc.mapPosition.y / MAP_H
    // We need to work out rendered map size at zoom=1
    // The map is rendered at 100% width of the container, height = width * (MAP_H/MAP_W)
    const renderedW = rect.width
    const renderedH = renderedW * (MAP_H / MAP_W)
    const pinX = pinXPct * renderedW
    const pinY = pinYPct * renderedH
    setPan({
      x: rect.width / 2 - pinX * targetZoom,
      y: rect.height / 2 - pinY * targetZoom,
    })
    setZoom(targetZoom)
    mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const catMeta = (key: POICategory) => CATEGORIES.find(c => c.key === key)

  const locationsWithPins = WORLD_LOCATIONS.filter(l => l.mapPosition).length

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9">

      {/* Header */}
      <div className="mb-5">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff9bb5]">Leonida intel</p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">World Locations</h2>
        <p className="mt-1 text-xs text-white/40">
          Locations, loot, secrets, and points of interest across Leonida.
        </p>
      </div>

      {/* Verification overview cards */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        {(['verified', 'community', 'rumored'] as POIStatus[]).map(key => {
          const meta = STATUS_META[key]
          const Icon = meta.icon
          return (
            <button
              key={key}
              onClick={() => setActiveStatus(prev => prev === key ? 'all' : key)}
              className="rounded-xl border p-3 text-left transition"
              style={{
                borderColor: activeStatus === key ? meta.border : 'rgba(255,255,255,0.08)',
                backgroundColor: activeStatus === key ? meta.background : 'rgba(255,255,255,0.025)',
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <Icon size={14} style={{ color: meta.color }} />
                <span className="text-lg font-bold text-white">{counts[key]}</span>
              </div>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em]" style={{ color: meta.color }}>
                {meta.label}
              </p>
            </button>
          )
        })}
      </div>

      {/* Coordinate accuracy notice */}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#ffd27a]/15 bg-[#ffd27a]/[0.05] px-4 py-3">
        <Info size={13} className="mt-0.5 shrink-0 text-[#ffdc9b]/70" />
        <p className="text-[11px] leading-5 text-[#ffdc9b]/70">
          <strong className="font-semibold">Map pin accuracy:</strong> Pins marked{' '}
          <em>General search area</em> are approximate placements on the official Rockstar poster.
          Exact in-game positions may differ. Verification status and coordinate accuracy are shown
          separately for every location.
        </p>
      </div>

      {/* ── Map ───────────────────────────────────────────────────────────── */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#06111f]">

        {/* Map toolbar */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
            Official Leonida map — {filtered.length} locations · {locationsWithPins} pinned
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { const rect = mapRef.current?.getBoundingClientRect(); if (rect) zoomAround(0.4, rect.width / 2, rect.height / 2) }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white"
              aria-label="Zoom in"
            ><ZoomIn size={13} /></button>
            <button
              onClick={() => { const rect = mapRef.current?.getBoundingClientRect(); if (rect) zoomAround(-0.4, rect.width / 2, rect.height / 2) }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white"
              aria-label="Zoom out"
            ><ZoomOut size={13} /></button>
            <button
              onClick={resetView}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white"
              aria-label="Reset view"
            ><Maximize2 size={12} /></button>
          </div>
        </div>

        {/* Map viewport — fixed height so the portrait poster doesn't dominate */}
        <div
          ref={mapRef}
          data-map-viewport
          className="relative overflow-hidden select-none"
          style={{
            height: `${mapHeight}px`,
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => { touchStart.current = null }}
        >
          {/* Transformed map layer */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              willChange: 'transform',
              position: 'absolute',
              top: 0,
              left: 0,
              // Width at zoom=1 is 100% of the container. Height follows the aspect ratio.
              width: '100%',
            }}
          >
            {/* Poster image in an aspect-ratio box */}
            <div className="relative w-full" style={{ paddingBottom: `${(MAP_H / MAP_W) * 100}%` }}>
              <img
                src="/map/Leonida_Map_Poster.08ir77j-.26ny.avif"
                alt="Official Rockstar Leonida road map"
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />

              {/* Category legend */}
              <div className="absolute left-2 top-2 rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-sm">
                <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-white/55">Categories</p>
                {CATEGORIES.map(cat => (
                  <div key={cat.key} className="mb-0.5 flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: CAT_COLOR[cat.key] }} />
                    <span className="text-[8px]" style={{ color: CAT_COLOR[cat.key] }}>{cat.label}</span>
                  </div>
                ))}
              </div>

              {/* Status legend */}
              <div className="absolute right-2 top-2 rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-sm">
                <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-white/55">Intel status</p>
                {(Object.keys(STATUS_META) as POIStatus[]).map(s => (
                  <div key={s} className="mb-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_META[s].color }} />
                    <span className="text-[8px]" style={{ color: STATUS_META[s].color }}>{STATUS_META[s].label}</span>
                  </div>
                ))}
              </div>

              {/* Location pins */}
              {WORLD_LOCATIONS.map(loc => {
                if (!loc.mapPosition) return null
                const inFilter = filteredIds.has(loc.id)
                const isHovered = hoveredId === loc.id
                const isSelected = expandedId === loc.id
                const color = CAT_COLOR[loc.category]
                const statusMeta = STATUS_META[loc.status]

                return (
                  <button
                    key={loc.id}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); selectLocation(loc.id) }}
                    onMouseEnter={() => setHoveredId(loc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute transition-all duration-150"
                    style={{
                      left: `${(loc.mapPosition.x / MAP_W) * 100}%`,
                      top:  `${(loc.mapPosition.y / MAP_H) * 100}%`,
                      transform: `translate(-50%, -100%) scale(${isHovered || isSelected ? 1.35 : 1})`,
                      opacity: inFilter ? 1 : 0.15,
                      zIndex: isHovered || isSelected ? 25 : 10,
                    }}
                    title={`${loc.name} — ${statusMeta.label}`}
                    aria-label={`Show details for ${loc.name}`}
                  >
                    {/* Pin head */}
                    <span
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 shadow-lg"
                      style={{
                        backgroundColor: color,
                        borderColor: isSelected ? '#fff' : statusMeta.color,
                        boxShadow: `0 0 0 2px rgba(0,0,0,0.6), 0 0 14px ${statusMeta.color}60`,
                      }}
                    >
                      <span className="text-[11px] leading-none">{CATEGORY_ICON[loc.category]}</span>
                    </span>
                    {/* Pin tail */}
                    <span
                      className="absolute -bottom-[3px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 rotate-45"
                      style={{ backgroundColor: color }}
                    />
                    {/* Hover tooltip */}
                    {isHovered && (
                      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-[#0d0e1a]/95 px-2.5 py-1.5 text-left shadow-xl">
                        <span className="block text-[11px] font-semibold text-white">{loc.name}</span>
                        <span className="block text-[9px] text-white/45">{loc.area}</span>
                        <span className="mt-0.5 block text-[8px] font-bold uppercase" style={{ color: statusMeta.color }}>{statusMeta.label}</span>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected location panel */}
          {selectedLocation && (
            <div
              className="absolute bottom-3 left-3 right-3 max-h-[55%] overflow-y-auto rounded-xl border border-white/15 bg-[#0d0e1a]/96 p-4 shadow-2xl backdrop-blur-sm sm:left-auto sm:right-3 sm:w-80"
              style={{ zIndex: 40 }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">{selectedLocation.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/40">
                    <MapPin size={10} />{selectedLocation.area}
                  </p>
                </div>
                <button onClick={() => setExpandedId(null)} className="shrink-0 text-white/30 transition hover:text-white" aria-label="Close">
                  <X size={14} />
                </button>
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedLocation.status} />
                {catMeta(selectedLocation.category) && (
                  <span className={clsx('rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase', catMeta(selectedLocation.category)!.bg, catMeta(selectedLocation.category)!.color)}>
                    {selectedLocation.category}
                  </span>
                )}
              </div>

              <p className="mb-2.5 text-[11px] leading-5 text-white/60">{selectedLocation.description}</p>

              {selectedLocation.reward && (
                <div className="mb-2.5 flex items-start gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-2">
                  <Gift size={12} className="mt-0.5 shrink-0 text-emerald-300" />
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-300">Reward / loot</p>
                    <p className="mt-0.5 text-[10px] leading-4 text-white/65">{selectedLocation.reward}</p>
                  </div>
                </div>
              )}

              {selectedLocation.tip && (
                <div className="mb-2.5 flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-2.5 py-2">
                  <span className="text-[10px]">💡</span>
                  <p className="text-[10px] leading-[1.6] text-[#ffdc9b]/80">{selectedLocation.tip}</p>
                </div>
              )}

              {selectedLocation.accuracy && (
                <div className="mb-2 flex items-center gap-1.5 text-[9px] text-white/40">
                  <Crosshair size={10} />
                  <span>Position: {ACCURACY_META[selectedLocation.accuracy]}</span>
                </div>
              )}

              {selectedLocation.gridReference && (
                <p className="mb-2 text-[9px] text-white/40">Map grid: {selectedLocation.gridReference}</p>
              )}

              {selectedLocation.evidence && (
                <p className="mb-2.5 text-[10px] leading-4 text-white/35">Evidence: {selectedLocation.evidence}</p>
              )}

              {selectedLocation.sourceName && selectedLocation.sourceUrl && (
                <a
                  href={selectedLocation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[10px] text-[#72dce8] transition hover:text-white"
                >
                  <ExternalLink size={10} />
                  Source: {selectedLocation.sourceName}
                </a>
              )}
            </div>
          )}

          {/* Hint */}
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/[0.08] bg-black/50 px-3 py-1 text-[9px] text-white/35 backdrop-blur-sm" style={{ zIndex: 5 }}>
            Scroll to zoom · Drag to pan · Pinch to zoom on mobile
          </div>
        </div>

        {/* Zoom bar */}
        <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-2">
          <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">
            {Math.round(zoom * 100)}%
          </span>
          <div className="h-0.5 flex-1 rounded bg-white/[0.06]">
            <div
              className="h-full rounded bg-white/25 transition-all"
              style={{ width: `${((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100}%` }}
            />
          </div>
          <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">{filtered.length} shown</span>
        </div>
      </div>

      {/* ── Status filter ─────────────────────────────────────────────────── */}
      <div className="mb-4">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">Filter by intel status</p>
        <div className="flex flex-wrap gap-2">
          {(['all', 'verified', 'community', 'rumored'] as (POIStatus | 'all')[]).map(key => {
            const isAll = key === 'all'
            const meta = isAll ? null : STATUS_META[key]
            const count = isAll ? WORLD_LOCATIONS.length : counts[key as POIStatus]
            const selected = activeStatus === key
            return (
              <button
                key={key}
                onClick={() => setActiveStatus(key)}
                className="rounded-full border px-3 py-1.5 text-[10px] font-semibold transition"
                style={{
                  borderColor: selected && meta ? meta.border : selected ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                  backgroundColor: selected && meta ? meta.background : selected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.025)',
                  color: selected && meta ? meta.color : selected ? 'white' : 'rgba(255,255,255,0.45)',
                }}
              >
                {isAll ? 'All statuses' : STATUS_META[key as POIStatus].label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Category filter ───────────────────────────────────────────────── */}
      <div className="mb-5">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">Filter by category</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={clsx(
              'rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
              activeCategory === 'all'
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/10 bg-white/[0.03] text-white/40 hover:bg-white/[0.07] hover:text-white/70',
            )}
          >
            All ({WORLD_LOCATIONS.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = WORLD_LOCATIONS.filter(l => l.category === cat.key).length
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={clsx(
                  'rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
                  activeCategory === cat.key
                    ? `${cat.bg} ${cat.color}`
                    : 'border-white/10 bg-white/[0.03] text-white/40 hover:bg-white/[0.07] hover:text-white/70',
                )}
              >
                {CATEGORY_ICON[cat.key]} {cat.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Location list ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/[0.08] bg-[#11121d]/90 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-white/60">No locations found</p>
            <p className="mt-1 text-xs text-white/30">No locations match the current filters.</p>
          </div>
        )}

        {filtered.map(loc => {
          const cat = catMeta(loc.category)
          const isOpen = expandedId === loc.id
          const statusMeta = STATUS_META[loc.status]

          return (
            <article
              key={loc.id}
              className="overflow-hidden rounded-xl border border-white/[0.085] bg-[#11121d]/90 transition hover:border-white/[0.14]"
            >
              <button
                onClick={() => selectLocation(loc.id)}
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left sm:px-5"
                aria-expanded={isOpen}
              >
                <span
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: statusMeta.color, boxShadow: `0 0 7px ${statusMeta.color}55` }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white/90">{loc.name}</span>
                    {cat && (
                      <span className={clsx('rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em]', cat.bg, cat.color)}>
                        {cat.label}
                      </span>
                    )}
                    <StatusBadge status={loc.status} />
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-white/35">
                    <MapPin size={10} />
                    <span>{loc.area}</span>
                    {loc.accuracy && (
                      <><span className="text-white/20">·</span><span className="text-white/25">{ACCURACY_META[loc.accuracy]}</span></>
                    )}
                  </div>

                  {!isOpen && <p className="mt-1.5 line-clamp-1 text-xs text-white/40">{loc.description}</p>}

                  {loc.reward && !isOpen && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-300/70">
                      <Gift size={10} />Reward available
                    </p>
                  )}
                </div>

                {isOpen
                  ? <ChevronUp size={15} className="mt-1 shrink-0 text-white/30" />
                  : <ChevronDown size={15} className="mt-1 shrink-0 text-white/30" />}
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.07] bg-black/15 px-4 pb-4 pt-3.5 sm:px-5">
                  <p className="mb-3 text-xs leading-[1.65] text-white/55">{loc.description}</p>

                  {loc.reward && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2.5">
                      <Gift size={13} className="mt-0.5 shrink-0 text-emerald-300" />
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">Reward / loot</p>
                        <p className="mt-1 text-[11px] leading-5 text-white/65">{loc.reward}</p>
                      </div>
                    </div>
                  )}

                  {loc.tip && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-3 py-2.5">
                      <span className="mt-0.5 text-xs">💡</span>
                      <p className="text-[11px] leading-5 text-[#ffdc9b]/85">{loc.tip}</p>
                    </div>
                  )}

                  <div className="mb-3 flex flex-wrap items-center gap-2 text-[9px] text-white/35">
                    <StatusBadge status={loc.status} />
                    {loc.accuracy && <span>· {ACCURACY_META[loc.accuracy]}</span>}
                    {loc.gridReference && <span>· Grid {loc.gridReference}</span>}
                  </div>

                  {loc.evidence && (
                    <p className="mb-3 text-[10px] leading-4 text-white/40">
                      <span className="font-semibold text-white/50">Evidence:</span> {loc.evidence}
                    </p>
                  )}

                  {loc.sourceName && loc.sourceUrl && (
                    <a
                      href={loc.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-3 inline-flex items-center gap-1.5 text-[10px] text-[#72dce8] transition hover:text-white"
                    >
                      <ExternalLink size={10} />
                      Source: {loc.sourceName}
                    </a>
                  )}

                  {loc.mapPosition ? (
                    <button
                      onClick={() => focusPin(loc.id)}
                      className="flex items-center gap-1.5 text-[10px] text-white/35 transition hover:text-[#72dce8]"
                    >
                      <MapPin size={10} />
                      Centre on map ↑
                    </button>
                  ) : (
                    <p className="text-[10px] text-white/25">
                      <MapPin size={10} className="mr-1 inline" />
                      Map pin not available — exact position on the Leonida poster is unconfirmed
                    </p>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>

      <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Community intel · Coordinate accuracy varies · Sources shown where available · Not affiliated with Rockstar Games
      </p>
    </div>
  )
}
