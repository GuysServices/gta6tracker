'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { WORLD_LOCATIONS, CATEGORIES, CATEGORY_ICON, POICategory } from '@/lib/world-locations'
import { MapPin, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react'
import clsx from 'clsx'

// ─── Map pin positions as % of the base 900×640 viewBox ─────────────────────
// These match the SVG coordinates in leonida-map.svg exactly.
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

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const rect = mapRef.current!.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    zoomAround(e.deltaY < 0 ? 0.2 : -0.2, cx, cy)
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

  // Convert SVG coordinate (900×640 space) to % of rendered container
  const toPercent = (x: number, y: number) => ({
    left: `${(x / MAP_W) * 100}%`,
    top:  `${(y / MAP_H) * 100}%`,
  })

  const catMeta = (key: POICategory) => CATEGORIES.find(c => c.key === key)!
  const hoveredLoc = hoveredId ? WORLD_LOCATIONS.find(l => l.id === hoveredId) : null

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
          className="relative overflow-hidden"
          style={{ height: '460px', cursor: dragging ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
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
            {/* Map background — real Vice City / Leonida geography SVG */}
            <div className="relative w-full" style={{ paddingBottom: `${(MAP_H / MAP_W) * 100}%` }}>

              {/* Background SVG — full Leonida geography */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="absolute inset-0 w-full h-full"
              >
                <defs>
                  <radialGradient id="og" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#0a2540"/>
                    <stop offset="100%" stopColor="#05101a"/>
                  </radialGradient>
                  <radialGradient id="vcGlow" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#ff79a8" stopOpacity="0.12"/>
                    <stop offset="100%" stopColor="#ff79a8" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="pgGlow" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#72dce8" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="#72dce8" stopOpacity="0"/>
                  </radialGradient>
                  <filter id="fs"><feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.5"/></filter>
                  <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
                </defs>

                {/* Ocean */}
                <rect width={MAP_W} height={MAP_H} fill="url(#og)"/>
                {/* Ocean shimmer */}
                {[80,160,240,320,400,480,560].map(y => (
                  <line key={y} x1="0" y1={y} x2={MAP_W} y2={y} stroke="#1a4a7a" strokeWidth="0.4" opacity="0.25"/>
                ))}

                {/* North Leonida — mainland */}
                <path d="M520,20 L900,20 L900,285 L775,315 L695,292 L645,262 L618,222 L578,202 L538,172 L508,132 L503,82 Z"
                      fill="#243d24" stroke="#162616" strokeWidth="1.5"/>
                {/* Forest overlay */}
                <path d="M520,20 L900,20 L900,285 L775,315 L695,292 L645,262 L618,222 L578,202 L538,172 L508,132 L503,82 Z"
                      fill="#1a3a1a" opacity="0.4"/>
                {/* North roads */}
                <path d="M598,162 L718,202 L818,242" stroke="#6a8a6a" strokeWidth="2" fill="none" opacity="0.5"/>
                <path d="M648,82 L678,182 L698,292" stroke="#6a8a6a" strokeWidth="1.5" fill="none" opacity="0.4"/>
                {/* Route label */}
                <text x="720" y="175" textAnchor="middle" fontSize="8" fill="#8aaa8a" opacity="0.5" letterSpacing="1">ROUTE 7</text>

                {/* Port Gellhorn glow */}
                <ellipse cx="720" cy="385" rx="95" ry="75" fill="url(#pgGlow)"/>
                {/* Port Gellhorn landmass */}
                <path d="M645,262 L775,315 L818,362 L798,422 L758,442 L698,452 L658,432 L628,392 L618,342 L628,302 Z"
                      fill="#2a3a2a" stroke="#1a2a1a" strokeWidth="1.5"/>
                {/* Port buildings */}
                {[[680,340,6,8],[695,347,5,10],[712,338,8,12],[728,342,5,9],[690,362,9,6],[706,358,6,11],[722,355,8,8],[738,362,5,10]].map(([x,y,w,h],i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="#4a7a6a" opacity="0.6"/>
                ))}
                {/* Port docks */}
                <path d="M778,382 L820,377 L824,397 L778,402 Z" fill="#1a2a2a" stroke="#3a6a6a" strokeWidth="1" opacity="0.8"/>
                <path d="M788,387 L812,385" stroke="#5a9a98" strokeWidth="1.5" opacity="0.5"/>
                <path d="M788,392 L814,390" stroke="#5a9a98" strokeWidth="1.5" opacity="0.5"/>
                <text x="718" y="418" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7accd8" letterSpacing="1" opacity="0.85">PORT GELLHORN</text>

                {/* Central connector */}
                <path d="M628,392 L618,442 L578,472 L538,482 L498,472 L478,452 L488,422 L518,402 L568,392 Z"
                      fill="#2a3a1a" stroke="#1a2a0a" strokeWidth="1.5"/>

                {/* Vice City glow */}
                <ellipse cx="308" cy="418" rx="165" ry="108" fill="url(#vcGlow)"/>
                {/* Vice City landmass */}
                <path d="M118,292 L278,272 L398,282 L478,322 L498,382 L488,452 L458,492 L398,512 L318,522 L238,512 L178,492 L128,462 L98,422 L93,372 Z"
                      fill="#2a2040" stroke="#1a1030" strokeWidth="1.5"/>
                {/* City grid */}
                {[150,200,250,300,350,400,450].map(x => (
                  <line key={x} x1={x} y1="285" x2={x} y2="515" stroke="#4a3a6a" strokeWidth="0.6" opacity="0.35"/>
                ))}
                {[330,370,410,450].map(y => (
                  <line key={y} x1="103" x2="490" y1={y} y2={y} stroke="#4a3a6a" strokeWidth="0.6" opacity="0.35"/>
                ))}
                {/* Skyline silhouette */}
                {[[200,312,8,30],[215,306,6,36],[228,316,10,26],[245,300,7,42],[260,308,9,34],[275,295,6,47],[290,310,8,32],[305,302,7,40],[320,312,9,30],[338,298,6,44],[352,308,8,34],[368,316,7,26]].map(([x,y,w,h],i) => (
                  <rect key={i} x={x} y={y} width={w} height={h} rx="1" fill="#4a3875" opacity="0.5"/>
                ))}
                {/* Neon strip highlight */}
                <path d="M228,332 L378,332" stroke="#ff79a8" strokeWidth="1.5" opacity="0.35" strokeDasharray="4,3"/>
                <text x="303" y="328" textAnchor="middle" fontSize="6.5" fill="#ff9bb5" opacity="0.4" letterSpacing="1">NEON STRIP</text>
                {/* Ocean Beach */}
                <path d="M118,292 L148,352 L128,422 L98,462 L83,442 L78,392 L88,342 Z"
                      fill="#1e2d40" stroke="#152030" strokeWidth="1"/>
                <path d="M83,382 L118,372 L116,432 L83,442 Z" fill="#b89860" opacity="0.35"/>
                <text x="300" y="470" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ff9bb5" letterSpacing="1.5" opacity="0.9">VICE CITY</text>
                <text x="300" y="484" textAnchor="middle" fontSize="7" fill="#c8a8c8" letterSpacing="2" opacity="0.55">LEONIDA STATE</text>

                {/* Leonida Keys */}
                {[
                  [160,570,55,22],[260,590,45,18],[350,600,40,15],[430,608,30,12],[495,613,22,10]
                ].map(([cx,cy,rx,ry],i) => (
                  <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#243a24" stroke="#162616" strokeWidth="1.2"/>
                ))}
                {/* Keys bridges */}
                <path d="M210,570 L218,570" stroke="#c8b870" strokeWidth="2" opacity="0.55"/>
                <path d="M298,585 L312,588" stroke="#c8b870" strokeWidth="2" opacity="0.55"/>
                <path d="M383,598 L393,601" stroke="#c8b870" strokeWidth="2" opacity="0.55"/>
                <path d="M453,608 L465,610" stroke="#c8b870" strokeWidth="2" opacity="0.55"/>
                <text x="160" y="577" textAnchor="middle" fontSize="8" fontWeight="700" fill="#90d890" letterSpacing="0.5" opacity="0.85">LEONIDA KEYS</text>
                {/* Lighthouse */}
                <circle cx="110" cy="563" r="3" fill="#fffab0" stroke="#c8c870" strokeWidth="1"/>

                {/* Ocean Hwy */}
                <path d="M198,512 L213,542 L198,567" stroke="#c8b870" strokeWidth="2" fill="none" opacity="0.45" strokeDasharray="5,3"/>

                {/* Water labels */}
                <text x="55" y="195" textAnchor="middle" fontSize="10" fill="#3a7aaf" opacity="0.4" letterSpacing="2" transform="rotate(-15,55,195)">ATLANTIC</text>
                <text x="822" y="560" textAnchor="middle" fontSize="9" fill="#3a7aaf" opacity="0.35" letterSpacing="1.5">GULF</text>
                <text x="210" y="635" textAnchor="middle" fontSize="8" fill="#3a7aaf" opacity="0.3" letterSpacing="2">FLORIDA STRAITS</text>

                {/* Legend */}
                <rect x="12" y="12" width="118" height="125" rx="6" fill="#080910" fillOpacity="0.9" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1"/>
                <text x="71" y="29" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="white" letterSpacing="1.5" opacity="0.75">LEGEND</text>
                {([
                  ['#ffd27a','Money'],
                  ['#72dce8','Weapons'],
                  ['#ff79a8','Drugs'],
                  ['#9b83ff','Ammo'],
                  ['#5fad5f','Vehicles'],
                  ['#8888aa','Misc'],
                ] as const).map(([color, label], i) => (
                  <g key={label} transform={`translate(20,${38 + i * 16})`}>
                    <circle cx="5" cy="4" r="5" fill={color}/>
                    <text x="15" y="8" fontSize="8" fill={color}>{label}</text>
                  </g>
                ))}

                {/* Compass */}
                <g transform="translate(856,28)">
                  <text x="0" y="-3" textAnchor="middle" fontSize="7" fill="white" opacity="0.35">N</text>
                  <line x1="0" y1="0" x2="0" y2="-10" stroke="white" strokeWidth="1" opacity="0.35"/>
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="white" strokeWidth="0.5" opacity="0.2"/>
                </g>
              </svg>

              {/* ── Pins overlay — absolutely positioned over the SVG ── */}
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
                {/* Colored dot matching pin */}
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
                      // map already shown above
                      // scroll map into view
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
