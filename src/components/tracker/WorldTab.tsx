'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { WORLD_LOCATIONS, CATEGORIES, CATEGORY_ICON, POICategory } from '@/lib/world-locations'
import { MapPin, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react'
import clsx from 'clsx'

// ─── Map pin positions as % of the base 900×640 viewBox ─────────────────────
// These match the leonida-map.png dimensions exactly.
const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
  'money-01':   { x: 156, y: 558 },
  'money-02':   { x: 710, y: 356 },
  'money-03':   { x: 203, y: 348 },
  'money-04':   { x: 438, y: 363 },
  'money-05':   { x: 280, y: 586 },
  'money-06':   { x:  76, y: 396 },
  'money-07':   { x: 618, y: 118 },
  'weapon-01':  { x: 193, y: 566 },
  'weapon-02':  { x: 770, y: 400 },
  'weapon-03':  { x: 108, y: 563 },
  'weapon-04':  { x: 666, y:  73 },
  'weapon-05':  { x: 363, y: 323 },
  'weapon-06':  { x: 563, y: 208 },
  'drug-01':    { x: 228, y: 570 },
  'drug-02':    { x: 738, y: 428 },
  'drug-03':    { x: 176, y: 516 },
  'drug-04':    { x: 246, y: 360 },
  'drug-05':    { x: 183, y: 386 },
  'ammo-01':    { x: 150, y: 580 },
  'ammo-02':    { x: 698, y: 338 },
  'vehicle-01': { x:  98, y: 408 },
  'vehicle-02': { x: 298, y: 378 },
  'vehicle-03': { x: 728, y: 153 },
  'misc-01':    { x: 258, y: 588 },
  'misc-02':    { x: 313, y: 598 },
  'misc-03':    { x: 118, y: 423 },
}

const CAT_COLOR: Record<POICategory, string> = {
  money:    '#ffd27a',
  weapons:  '#72dce8',
  drugs:    '#ff79a8',
  ammo:     '#9b83ff',
  vehicles: '#5fad5f',
  misc:     '#8888aa',
}

const MAP_W = 900
const MAP_H = 640
const MIN_ZOOM = 0.9
const MAX_ZOOM = 4

export default function WorldTab() {
  const [activeCategory, setActiveCategory] = useState<POICategory | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => activeCategory === 'all'
      ? WORLD_LOCATIONS
      : WORLD_LOCATIONS.filter(l => l.category === activeCategory),
    [activeCategory],
  )
  const filteredIds = useMemo(() => new Set(filtered.map(l => l.id)), [filtered])

  // ── zoom helpers ──────────────────────────────────────────────────────────
  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))

  const zoomAround = useCallback((delta: number, cx: number, cy: number) => {
    setZoom(prev => {
      const next = clampZoom(prev + delta)
      const ratio = next / prev
      setPan(p => ({
        x: cx - (cx - p.x) * ratio,
        y: cy - (cy - p.y) * ratio,
      }))
      return next
    })
  }, [])

  // ── non-passive wheel listener — prevents page scroll while zooming ────────
  // React's synthetic onWheel is passive by default in modern browsers, so
  // e.preventDefault() inside it does nothing. We attach directly to the DOM
  // element with { passive: false } so the browser actually honours the prevent.
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      zoomAround(e.deltaY < 0 ? 0.2 : -0.2, cx, cy)
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [zoomAround])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    setDragging(true)
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y }
  }, [pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return
    setPan({
      x: dragStart.current.px + (e.clientX - dragStart.current.mx),
      y: dragStart.current.py + (e.clientY - dragStart.current.my),
    })
  }, [dragging])

  const stopDrag = useCallback(() => { setDragging(false); dragStart.current = null }, [])

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const catMeta = (key: POICategory) => CATEGORIES.find(c => c.key === key)!

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9">

      {/* Header */}
      <div className="mb-5">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff9bb5]">Leonida intel</p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">World Locations</h2>
        <p className="mt-1 text-xs text-white/40">Scroll to zoom · drag to pan · click a pin for details</p>
      </div>

      {/* ── Interactive map ───────────────────────────────────────── */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#06111f]">

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
            Leonida Map — {filtered.length} location{filtered.length !== 1 ? 's' : ''} shown
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(z => clampZoom(z + 0.4))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white/80"
              title="Zoom in"
            ><ZoomIn size={13}/></button>
            <button
              onClick={() => setZoom(z => clampZoom(z - 0.4))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white/80"
              title="Zoom out"
            ><ZoomOut size={13}/></button>
            <button
              onClick={resetView}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white/80"
              title="Reset view"
            ><Maximize2 size={12}/></button>
          </div>
        </div>

        {/* Map viewport */}
        <div
          ref={mapRef}
          data-map-viewport
          className="relative overflow-hidden"
          style={{ height: '460px', cursor: dragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {/* Transformed map layer */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              willChange: 'transform',
            }}
          >
            {/* Map background + pins container */}
            <div className="relative w-full" style={{ paddingBottom: `${(MAP_H / MAP_W) * 100}%` }}>

              {/* ── Real Leonida map image ── */}
              {/* Drop your map image at public/map/leonida-map.png */}
              <img
                src="/map/Leonida_Map_Poster.08ir77j-.26ny.avif"
                alt="Leonida map"
                className="absolute inset-0 w-full h-full object-cover select-none"
                draggable={false}
              />

              {/* ── Legend overlay ── */}
              <div className="absolute top-2 left-2 rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-sm">
                <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-white/60">Legend</p>
                {([
                  ['#ffd27a', 'Money'],
                  ['#72dce8', 'Weapons'],
                  ['#ff79a8', 'Drugs'],
                  ['#9b83ff', 'Ammo'],
                  ['#5fad5f', 'Vehicles'],
                  ['#8888aa', 'Misc'],
                ] as const).map(([color, label]) => (
                  <div key={label} className="flex items-center gap-1.5 mb-0.5">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }}/>
                    <span className="text-[8px]" style={{ color }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* ── Pins overlay — absolutely positioned over the image ── */}
              {WORLD_LOCATIONS.map(loc => {
                const pos = PIN_POSITIONS[loc.id]
                if (!pos) return null
                const isFiltered = filteredIds.has(loc.id)
                const isHovered = hoveredId === loc.id
                const color = CAT_COLOR[loc.category]

                return (
                  <button
                    key={loc.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedId(prev => prev === loc.id ? null : loc.id)
                      setHoveredId(null)
                    }}
                    onMouseEnter={() => setHoveredId(loc.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute -translate-x-1/2 -translate-y-full transition-all duration-150"
                    style={{
                      left: `${(pos.x / MAP_W) * 100}%`,
                      top:  `${(pos.y / MAP_H) * 100}%`,
                      opacity: isFiltered ? 1 : 0.15,
                      transform: `translate(-50%, -100%) scale(${isHovered ? 1.3 : 1})`,
                      zIndex: isHovered ? 20 : 10,
                    }}
                    title={loc.name}
                  >
                    {/* Pin shape */}
                    <svg width="22" height="30" viewBox="0 0 22 30">
                      <path
                        d="M11 0C4.9 0 0 4.9 0 11c0 6.9 11 19 11 19S22 17.9 22 11C22 4.9 17.1 0 11 0z"
                        fill={color}
                        opacity={isHovered ? 1 : 0.9}
                      />
                      <circle cx="11" cy="11" r="6" fill="rgba(0,0,0,0.5)"/>
                      <text x="11" y="15" textAnchor="middle" fontSize="8" fontFamily="system-ui">
                        {CATEGORY_ICON[loc.category]}
                      </text>
                    </svg>

                    {/* Hover tooltip */}
                    {isHovered && (
                      <div
                        className="pointer-events-none absolute left-1/2 bottom-full mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-[#0d0e1a]/95 px-2.5 py-1.5 text-left shadow-xl"
                        style={{ zIndex: 30 }}
                      >
                        <p className="text-[11px] font-semibold text-white">{loc.name}</p>
                        <p className="text-[9px] text-white/45">{loc.area}</p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected pin detail panel — floats over map */}
          {expandedId && (() => {
            const loc = WORLD_LOCATIONS.find(l => l.id === expandedId)
            if (!loc) return null
            const cat = catMeta(loc.category)
            return (
              <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 rounded-xl border border-white/15 bg-[#0d0e1a]/96 p-4 shadow-2xl backdrop-blur-sm" style={{ zIndex: 40 }}>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{loc.name}</span>
                      <span className={clsx('rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]', cat.bg, cat.color)}>
                        {cat.label}
                      </span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/40">
                      <MapPin size={9}/>{loc.area}
                    </p>
                  </div>
                  <button onClick={() => setExpandedId(null)} className="shrink-0 text-white/30 hover:text-white/70 transition mt-0.5">
                    <X size={14}/>
                  </button>
                </div>
                <p className="mb-2.5 text-[11px] leading-5 text-white/55">{loc.description}</p>
                <div className="flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-2.5 py-2">
                  <span className="text-[10px]">💡</span>
                  <p className="text-[10px] leading-[1.6] text-[#ffdc9b]/80">{loc.tip}</p>
                </div>
              </div>
            )
          })()}

          {/* Zoom hint */}
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 text-[9px] text-white/30 backdrop-blur-sm" style={{ zIndex: 5 }}>
            scroll to zoom · drag to pan
          </div>
        </div>

        {/* Zoom indicator */}
        <div className="border-t border-white/[0.06] px-4 py-2 flex items-center gap-3">
          <span className="text-[9px] text-white/25 uppercase tracking-[0.15em]">
            Zoom {Math.round(zoom * 100)}%
          </span>
          <div className="flex-1 h-0.5 rounded bg-white/[0.06]">
            <div
              className="h-full rounded bg-white/20 transition-all"
              style={{ width: `${((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100}%` }}
            />
          </div>
          <span className="text-[9px] text-white/25 uppercase tracking-[0.15em]">
            Pin colors match category filter below
          </span>
        </div>
      </div>

      {/* ── Category filter ────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap gap-2">
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

      {/* ── Location list ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {filtered.map(loc => {
          const cat = catMeta(loc.category)
          const isOpen = expandedId === loc.id

          return (
            <article
              key={loc.id}
              className="overflow-hidden rounded-xl border border-white/[0.085] bg-[#11121d]/90 transition hover:border-white/[0.14]"
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : loc.id)}
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left sm:px-5"
                aria-expanded={isOpen}
              >
                <span
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CAT_COLOR[loc.category] }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white/90">{loc.name}</span>
                    <span className={clsx('rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em]', cat.bg, cat.color)}>
                      {cat.label}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/35">
                    <MapPin size={10}/>
                    <span>{loc.area}</span>
                    {loc.coordinates && (
                      <><span className="text-white/20">·</span><span className="italic text-white/25">{loc.coordinates}</span></>
                    )}
                  </div>
                  {!isOpen && <p className="mt-1.5 line-clamp-1 text-xs text-white/40">{loc.description}</p>}
                </div>
                {isOpen ? <ChevronUp size={15} className="shrink-0 mt-1 text-white/30"/> : <ChevronDown size={15} className="shrink-0 mt-1 text-white/30"/>}
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.07] bg-black/15 px-4 pb-4 pt-3.5 sm:px-5">
                  <p className="mb-3 text-xs leading-[1.65] text-white/55">{loc.description}</p>
                  <div className="flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-3 py-2.5">
                    <span className="mt-0.5 text-xs">💡</span>
                    <p className="text-[11px] leading-5 text-[#ffdc9b]/85">{loc.tip}</p>
                  </div>
                  <button
                    onClick={() => {
                      setExpandedId(loc.id)
                      document.querySelector('[data-map-viewport]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    }}
                    className="mt-2.5 flex items-center gap-1.5 text-[10px] text-white/30 transition hover:text-[#72dce8]"
                  >
                    <MapPin size={9}/>
                    <span>See on map above ↑</span>
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Community intel · Coordinates approximate · Subject to game updates
      </p>
    </div>
  )
}
