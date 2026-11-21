
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
} from 'lucide-react'
import clsx from 'clsx'

const CAT_COLOR: Record<POICategory, string> = {
  money: '#ffd27a',
  weapons: '#72dce8',
  drugs: '#ff79a8',
  ammo: '#9b83ff',
  vehicles: '#5fad5f',
  misc: '#8888aa',
  secrets: '#d5a6ff',
}

const MAP_W = 2805
const MAP_H = 3840
const MIN_ZOOM = 0.9
const MAX_ZOOM = 2.5

type Accuracy = 'exact' | 'approximate' | 'area'

interface EnhancedLocation {
  id: string
  name: string
  category: POICategory
  area: string
  coordinates?: string
  description: string
  tip?: string
  mapPosition?: { x: number; y: number }
  status: POIStatus
  sourceName?: string
  sourceUrl?: string
  reward?: string
  gridReference?: string
  accuracy?: Accuracy
  evidence?: string
}

const LOCATIONS = WORLD_LOCATIONS as EnhancedLocation[]

const STATUS_META: Record<
  POIStatus,
  {
    label: string
    color: string
    background: string
    border: string
    icon: typeof ShieldCheck
  }
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

const ACCURACY_META: Record<Accuracy, string> = {
  exact: 'Exact position',
  approximate: 'Approximate position',
  area: 'General search area',
}

function StatusBadge({ status }: { status: POIStatus }) {
  const meta = STATUS_META[status]
  const Icon = meta.icon

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]"
      style={{
        color: meta.color,
        backgroundColor: meta.background,
        borderColor: meta.border,
      }}
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

  const dragStart = useRef<{
    mx: number
    my: number
    px: number
    py: number
  } | null>(null)

  const mapRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    return LOCATIONS.filter(location => {
      const categoryMatches =
        activeCategory === 'all' || location.category === activeCategory

      const statusMatches =
        activeStatus === 'all' || location.status === activeStatus

      return categoryMatches && statusMatches
    })
  }, [activeCategory, activeStatus])

  const filteredIds = useMemo(
    () => new Set(filtered.map(location => location.id)),
    [filtered],
  )

  const counts = useMemo(
    () => ({
      verified: LOCATIONS.filter(location => location.status === 'verified').length,
      community: LOCATIONS.filter(location => location.status === 'community').length,
      rumored: LOCATIONS.filter(location => location.status === 'rumored').length,
    }),
    [],
  )

  const selectedLocation = expandedId
    ? LOCATIONS.find(location => location.id === expandedId) ?? null
    : null

  const clampZoom = (value: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))

  const zoomAround = useCallback((delta: number, cx: number, cy: number) => {
    setZoom(previous => {
      const next = clampZoom(previous + delta)
      const ratio = next / previous

      setPan(current => ({
        x: cx - (cx - current.x) * ratio,
        y: cy - (cy - current.y) * ratio,
      }))

      return next
    })
  }, [])

  useEffect(() => {
    const element = mapRef.current
    if (!element) return

    const handler = (event: WheelEvent) => {
      event.preventDefault()

      const rect = element.getBoundingClientRect()
      zoomAround(
        event.deltaY < 0 ? 0.2 : -0.2,
        event.clientX - rect.left,
        event.clientY - rect.top,
      )
    }

    element.addEventListener('wheel', handler, { passive: false })

    return () => element.removeEventListener('wheel', handler)
  }, [zoomAround])

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return

      setDragging(true)
      dragStart.current = {
        mx: event.clientX,
        my: event.clientY,
        px: pan.x,
        py: pan.y,
      }
    },
    [pan],
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!dragging || !dragStart.current) return

      setPan({
        x: dragStart.current.px + event.clientX - dragStart.current.mx,
        y: dragStart.current.py + event.clientY - dragStart.current.my,
      })
    },
    [dragging],
  )

  const stopDrag = useCallback(() => {
    setDragging(false)
    dragStart.current = null
  }, [])

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const catMeta = (key: POICategory) =>
    CATEGORIES.find(category => category.key === key)

  const selectLocation = (id: string) => {
    setExpandedId(previous => previous === id ? null : id)
    setHoveredId(null)
  }

  const focusLocation = (id: string) => {
    setExpandedId(id)

    document.querySelector('[data-map-viewport]')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const statusOptions: {
    key: POIStatus | 'all'
    label: string
    count: number
  }[] = [
    { key: 'all', label: 'All statuses', count: LOCATIONS.length },
    { key: 'verified', label: 'Verified', count: counts.verified },
    { key: 'community', label: 'Community', count: counts.community },
    { key: 'rumored', label: 'Rumored', count: counts.rumored },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9">

      {/* Header */}

      <div className="mb-5">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff9bb5]">
          Leonida intel
        </p>

        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          World Locations
        </h2>

        <p className="mt-1 text-xs text-white/40">
          Explore locations, discoveries, loot, and secrets across Leonida.
        </p>
      </div>

      {/* Status overview */}

      <div className="mb-5 grid grid-cols-3 gap-2">
        {statusOptions.slice(1).map(option => {
          const meta = STATUS_META[option.key as POIStatus]
          const Icon = meta.icon

          return (
            <button
              key={option.key}
              onClick={() =>
                setActiveStatus(previous =>
                  previous === option.key ? 'all' : option.key as POIStatus
                )
              }
              className="rounded-xl border p-3 text-left transition"
              style={{
                borderColor:
                  activeStatus === option.key ? meta.border : 'rgba(255,255,255,0.08)',
                backgroundColor:
                  activeStatus === option.key ? meta.background : 'rgba(255,255,255,0.025)',
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <Icon size={14} style={{ color: meta.color }} />
                <span className="text-lg font-bold text-white">
                  {option.count}
                </span>
              </div>

              <p
                className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em]"
                style={{ color: meta.color }}
              >
                {option.label}
              </p>
            </button>
          )
        })}
      </div>

      {/* Map */}

      <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#06111f]">

        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
            Leonida map — {filtered.length} locations
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(value => clampZoom(value + 0.3))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white"
              aria-label="Zoom in"
            >
              <ZoomIn size={13} />
            </button>

            <button
              onClick={() => setZoom(value => clampZoom(value - 0.3))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white"
              aria-label="Zoom out"
            >
              <ZoomOut size={13} />
            </button>

            <button
              onClick={resetView}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white"
              aria-label="Reset map"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>

        <div
          ref={mapRef}
          data-map-viewport
          className="relative overflow-hidden"
          style={{
            aspectRatio: `${MAP_W} / ${MAP_H}`,
            width: '100%',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              willChange: 'transform',
            }}
          >
            <div
              className="relative w-full"
              style={{ paddingBottom: `${(MAP_H / MAP_W) * 100}%` }}
            >
              <img
                src="/map/Leonida_Map_Poster.08ir77j-.26ny.avif"
                alt="Official Leonida road map"
                className="absolute inset-0 h-full w-full select-none object-contain"
                draggable={false}
              />

              {/* Category legend */}

              <div className="absolute left-2 top-2 rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-sm">
                <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-white/60">
                  Categories
                </p>

                {CATEGORIES.map(category => (
                  <div key={category.key} className="mb-0.5 flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: CAT_COLOR[category.key] }}
                    />
                    <span
                      className="text-[8px]"
                      style={{ color: CAT_COLOR[category.key] }}
                    >
                      {category.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status legend */}

              <div className="absolute right-2 top-2 rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-sm">
                <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-white/60">
                  Intel status
                </p>

                {(Object.keys(STATUS_META) as POIStatus[]).map(status => (
                  <div key={status} className="mb-1 flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: STATUS_META[status].color }}
                    />
                    <span
                      className="text-[8px]"
                      style={{ color: STATUS_META[status].color }}
                    >
                      {STATUS_META[status].label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Location pins */}

              {LOCATIONS.map(location => {
                const position = location.mapPosition

                if (!position || !filteredIds.has(location.id)) return null

                const isHovered = hoveredId === location.id
                const isSelected = expandedId === location.id
                const color = CAT_COLOR[location.category]
                const status = STATUS_META[location.status]

                return (
                  <button
                    key={location.id}
                    onMouseDown={event => event.stopPropagation()}
                    onClick={event => {
                      event.stopPropagation()
                      selectLocation(location.id)
                    }}
                    onMouseEnter={() => setHoveredId(location.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="absolute -translate-x-1/2 -translate-y-full transition-all duration-150"
                    style={{
                      left: `${(position.x / MAP_W) * 100}%`,
                      top: `${(position.y / MAP_H) * 100}%`,
                      transform: `translate(-50%, -100%) scale(${isHovered || isSelected ? 1.3 : 1})`,
                      zIndex: isHovered || isSelected ? 25 : 10,
                    }}
                    title={`${location.name} — ${status.label}`}
                    aria-label={`Show ${location.name}`}
                  >
                    <span
                      className="flex h-[25px] w-[25px] items-center justify-center rounded-full border-2 shadow-lg"
                      style={{
                        backgroundColor: color,
                        borderColor: status.color,
                        boxShadow: `0 0 0 2px rgba(0,0,0,0.65), 0 0 12px ${status.color}55`,
                      }}
                    >
                      <span className="text-[10px] leading-none">
                        {CATEGORY_ICON[location.category]}
                      </span>
                    </span>

                    <span
                      className="absolute -bottom-[3px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 rotate-45"
                      style={{ backgroundColor: color }}
                    />

                    {isHovered && (
                      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-[#0d0e1a]/95 px-2.5 py-1.5 text-left shadow-xl">
                        <span className="block text-[11px] font-semibold text-white">
                          {location.name}
                        </span>
                        <span className="block text-[9px] text-white/45">
                          {location.area}
                        </span>
                        <span
                          className="mt-0.5 block text-[8px] font-bold uppercase"
                          style={{ color: status.color }}
                        >
                          {status.label}
                        </span>
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
              className="absolute bottom-3 left-3 right-3 max-h-[55%] overflow-y-auto rounded-xl border border-white/15 bg-[#0d0e1a]/95 p-4 shadow-2xl backdrop-blur-sm sm:left-auto sm:right-3 sm:w-80"
              style={{ zIndex: 40 }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-white">
                    {selectedLocation.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
                    <MapPin size={10} />
                    {selectedLocation.area}
                  </p>
                </div>

                <button
                  onClick={() => setExpandedId(null)}
                  className="shrink-0 text-white/30 transition hover:text-white"
                  aria-label="Close details"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedLocation.status} />

                <span
                  className={clsx(
                    'rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase',
                    catMeta(selectedLocation.category)?.bg,
                    catMeta(selectedLocation.category)?.color,
                  )}
                >
                  {selectedLocation.category}
                </span>
              </div>

              <p className="mb-2.5 text-[11px] leading-5 text-white/60">
                {selectedLocation.description}
              </p>

              {selectedLocation.reward && (
                <div className="mb-2.5 flex items-start gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-2">
                  <Gift size={12} className="mt-0.5 shrink-0 text-emerald-300" />
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wider text-emerald-300">
                      Reward / loot
                    </p>
                    <p className="mt-0.5 text-[10px] leading-4 text-white/65">
                      {selectedLocation.reward}
                    </p>
                  </div>
                </div>
              )}

              {selectedLocation.tip && (
                <div className="mb-2.5 flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-2.5 py-2">
                  <span className="text-[10px]">💡</span>
                  <p className="text-[10px] leading-[1.6] text-[#ffdc9b]/80">
                    {selectedLocation.tip}
                  </p>
                </div>
              )}

              {(selectedLocation.gridReference || selectedLocation.accuracy) && (
                <div className="mb-2.5 flex flex-wrap gap-2">
                  {selectedLocation.gridReference && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[9px] text-white/55">
                      <Crosshair size={10} />
                      Grid {selectedLocation.gridReference}
                    </span>
                  )}

                  {selectedLocation.accuracy && (
                    <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[9px] text-white/55">
                      {ACCURACY_META[selectedLocation.accuracy]}
                    </span>
                  )}
                </div>
              )}

              {selectedLocation.evidence && (
                <p className="mb-2.5 text-[10px] leading-4 text-white/40">
                  Evidence: {selectedLocation.evidence}
                </p>
              )}

              {selectedLocation.sourceName && selectedLocation.sourceUrl && (
                <a
                  href={selectedLocation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={event => event.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-[10px] text-[#72dce8] transition hover:text-white"
                >
                  <ExternalLink size={10} />
                  Source: {selectedLocation.sourceName}
                </a>
              )}
            </div>
          )}

          <div
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/[0.08] bg-black/50 px-3 py-1 text-[9px] text-white/40 backdrop-blur-sm"
            style={{ zIndex: 5 }}
          >
            Scroll to zoom · Drag to pan
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-2">
          <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">
            Zoom {Math.round(zoom * 100)}%
          </span>

          <div className="h-0.5 flex-1 rounded bg-white/[0.06]">
            <div
              className="h-full rounded bg-white/30 transition-all"
              style={{
                width: `${((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100}%`,
              }}
            />
          </div>

          <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">
            {filtered.length} shown
          </span>
        </div>
      </div>

      {/* Status filters */}

      <div className="mb-5">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
          Filter by intel status
        </p>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map(option => {
            const selected = activeStatus === option.key
            const meta = option.key === 'all' ? null : STATUS_META[option.key]

            return (
              <button
                key={option.key}
                onClick={() => setActiveStatus(option.key)}
                className="rounded-full border px-3 py-1.5 text-[10px] font-semibold transition"
                style={{
                  borderColor: selected && meta ? meta.border : 'rgba(255,255,255,0.1)',
                  backgroundColor: selected && meta ? meta.background : selected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.025)',
                  color: selected && meta ? meta.color : selected ? 'white' : 'rgba(255,255,255,0.45)',
                }}
              >
                {option.label} ({option.count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Category filters */}

      <div className="mb-5">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">
          Filter by category
        </p>

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
            All ({LOCATIONS.length})
          </button>

          {CATEGORIES.map(category => {
            const count = LOCATIONS.filter(
              location => location.category === category.key,
            ).length

            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={clsx(
                  'rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
                  activeCategory === category.key
                    ? `${category.bg} ${category.color}`
                    : 'border-white/10 bg-white/[0.03] text-white/40 hover:bg-white/[0.07] hover:text-white/70',
                )}
              >
                {CATEGORY_ICON[category.key]} {category.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Location list */}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/[0.08] bg-[#11121d]/90 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-white/60">
              No locations found
            </p>
            <p className="mt-1 text-xs text-white/30">
              There are no locations matching these filters.
            </p>
          </div>
        )}

        {filtered.map(location => {
          const category = catMeta(location.category)
          const isOpen = expandedId === location.id

          return (
            <article
              key={location.id}
              className="overflow-hidden rounded-xl border border-white/[0.085] bg-[#11121d]/90 transition hover:border-white/[0.14]"
            >
              <button
                onClick={() => selectLocation(location.id)}
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left sm:px-5"
                aria-expanded={isOpen}
              >
                <span
                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: STATUS_META[location.status].color,
                    boxShadow: `0 0 8px ${STATUS_META[location.status].color}55`,
                  }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white/90">
                      {location.name}
                    </span>

                    {category && (
                      <span
                        className={clsx(
                          'rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em]',
                          category.bg,
                          category.color,
                        )}
                      >
                        {category.label}
                      </span>
                    )}

                    <StatusBadge status={location.status} />
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-white/35">
                    <MapPin size={10} />
                    <span>{location.area}</span>

                    {location.gridReference && (
                      <>
                        <span className="text-white/20">·</span>
                        <span>Grid {location.gridReference}</span>
                      </>
                    )}

                    {location.coordinates && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="italic text-white/25">
                          {location.coordinates}
                        </span>
                      </>
                    )}
                  </div>

                  {!isOpen && (
                    <p className="mt-1.5 line-clamp-1 text-xs text-white/40">
                      {location.description}
                    </p>
                  )}

                  {location.reward && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-300/70">
                      <Gift size={10} />
                      Reward information available
                    </p>
                  )}
                </div>

                {isOpen ? (
                  <ChevronUp size={15} className="mt-1 shrink-0 text-white/30" />
                ) : (
                  <ChevronDown size={15} className="mt-1 shrink-0 text-white/30" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.07] bg-black/15 px-4 pb-4 pt-3.5 sm:px-5">
                  <p className="mb-3 text-xs leading-[1.65] text-white/55">
                    {location.description}
                  </p>

                  {location.reward && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2.5">
                      <Gift size={13} className="mt-0.5 shrink-0 text-emerald-300" />
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                          Reward / loot
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-white/65">
                          {location.reward}
                        </p>
                      </div>
                    </div>
                  )}

                  {location.tip && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-3 py-2.5">
                      <span className="mt-0.5 text-xs">💡</span>
                      <p className="text-[11px] leading-5 text-[#ffdc9b]/85">
                        {location.tip}
                      </p>
                    </div>
                  )}

                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.12em] text-white/30">
                      Intel status:
                    </span>
                    <StatusBadge status={location.status} />
                  </div>

                  {location.gridReference && (
                    <p className="mb-2 text-[10px] text-white/45">
                      Official map grid: {location.gridReference}
                    </p>
                  )}

                  {location.accuracy && (
                    <p className="mb-2 text-[10px] text-white/35">
                      Position confidence: {ACCURACY_META[location.accuracy]}
                    </p>
                  )}

                  {location.evidence && (
                    <p className="mb-3 text-[10px] leading-4 text-white/40">
                      Evidence: {location.evidence}
                    </p>
                  )}

                  {location.sourceName && location.sourceUrl && (
                    <a
                      href={location.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mb-3 inline-flex items-center gap-1.5 text-[10px] text-[#72dce8] transition hover:text-white"
                    >
                      <ExternalLink size={10} />
                      View source: {location.sourceName}
                    </a>
                  )}

                  {location.mapPosition ? (
                    <button
                      onClick={() => focusLocation(location.id)}
                      className="flex items-center gap-1.5 text-[10px] text-white/35 transition hover:text-[#72dce8]"
                    >
                      <MapPin size={10} />
                      See on map above ↑
                    </button>
                  ) : (
                    <p className="text-[10px] text-white/25">
                      <MapPin size={10} className="mr-1 inline" />
                      Map pin not available yet
                    </p>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>

      <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Community intel · Position accuracy varies · Sources shown where available
      </p>
    </div>
  )
}
