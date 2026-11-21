
'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import {
  WORLD_LOCATIONS,
  CATEGORIES,
  CATEGORY_ICON,
  POICategory,
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
} from 'lucide-react'
import clsx from 'clsx'

// ─── Category colors ───────────────────────────────────────────────

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

// ─── Verification status styling ───────────────────────────────────

function getStatusMeta(status: string) {
  switch (status) {
    case 'verified':
      return {
        label: 'Verified',
        className: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
        dot: '#4ade80',
      }

    case 'rumored':
      return {
        label: 'Rumored',
        className: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
        dot: '#fbbf24',
      }

    default:
      return {
        label: 'Community',
        className: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
        dot: '#38bdf8',
      }
  }
}

export default function WorldTab() {
  const [activeCategory, setActiveCategory] = useState<POICategory | 'all'>('all')
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

  // ─── Filter locations ───────────────────────────────────────────

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? WORLD_LOCATIONS
        : WORLD_LOCATIONS.filter(location => location.category === activeCategory),
    [activeCategory],
  )

  const filteredIds = useMemo(
    () => new Set(filtered.map(location => location.id)),
    [filtered],
  )

  // ─── Zoom helpers ───────────────────────────────────────────────

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

  // ─── Mouse-wheel zoom ───────────────────────────────────────────

  useEffect(() => {
    const element = mapRef.current
    if (!element) return

    const handler = (event: WheelEvent) => {
      event.preventDefault()

      const rect = element.getBoundingClientRect()
      const cx = event.clientX - rect.left
      const cy = event.clientY - rect.top

      zoomAround(event.deltaY < 0 ? 0.2 : -0.2, cx, cy)
    }

    element.addEventListener('wheel', handler, { passive: false })

    return () => {
      element.removeEventListener('wheel', handler)
    }
  }, [zoomAround])

  // ─── Map dragging ───────────────────────────────────────────────

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
        x: dragStart.current.px + (event.clientX - dragStart.current.mx),
        y: dragStart.current.py + (event.clientY - dragStart.current.my),
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

  // ─── Category metadata ──────────────────────────────────────────

  const catMeta = (key: POICategory) =>
    CATEGORIES.find(category => category.key === key)

  const selectedLocation = expandedId
    ? WORLD_LOCATIONS.find(location => location.id === expandedId)
    : null

  const selectLocation = (id: string) => {
    setExpandedId(previous => (previous === id ? null : id))
    setHoveredId(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9">

      {/* ─── Header ─────────────────────────────────────────────── */}

      <div className="mb-5">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff9bb5]">
          Leonida intel
        </p>

        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          World Locations
        </h2>

        <p className="mt-1 text-xs text-white/40">
          Scroll to zoom · Drag to pan · Click a pin for details
        </p>
      </div>

      {/* ─── Interactive map ────────────────────────────────────── */}

      <div className="mb-6 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#06111f]">

        {/* Map toolbar */}

        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
            Leonida Map — {filtered.length} location{filtered.length !== 1 ? 's' : ''} shown
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(value => clampZoom(value + 0.4))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white/80"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn size={13} />
            </button>

            <button
              onClick={() => setZoom(value => clampZoom(value - 0.4))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white/80"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut size={13} />
            </button>

            <button
              onClick={resetView}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.07] hover:text-white/80"
              title="Reset view"
              aria-label="Reset map view"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>

        {/* Map viewport */}

        <div
          ref={mapRef}
          data-map-viewport
          className="relative overflow-hidden"
          style={{
            aspectRatio: `${MAP_W} / ${MAP_H}`,
            width: '100%',
            cursor: dragging ? 'grabbing' : 'grab',
          }}
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
            <div
              className="relative w-full"
              style={{
                paddingBottom: `${(MAP_H / MAP_W) * 100}%`,
              }}
            >
              {/* Map image */}

              <img
                src="/map/Leonida_Map_Poster.08ir77j-.26ny.avif"
                alt="Leonida map"
                className="absolute inset-0 h-full w-full select-none object-contain"
                draggable={false}
              />

              {/* Dynamic legend */}

              <div className="absolute left-2 top-2 rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-sm">
                <p className="mb-1.5 text-[7px] font-bold uppercase tracking-[0.15em] text-white/60">
                  Legend
                </p>

                {CATEGORIES.map(category => (
                  <div
                    key={category.key}
                    className="mb-0.5 flex items-center gap-1.5"
                  >
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{
                        backgroundColor: CAT_COLOR[category.key],
                      }}
                    />

                    <span
                      className="text-[8px]"
                      style={{
                        color: CAT_COLOR[category.key],
                      }}
                    >
                      {category.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Map pins */}

              {WORLD_LOCATIONS.map(location => {
                const position = location.mapPosition

                if (!position) return null
                if (!filteredIds.has(location.id)) return null

                const isHovered = hoveredId === location.id
                const color = CAT_COLOR[location.category]

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
                      transform: `translate(-50%, -100%) scale(${isHovered ? 1.3 : 1})`,
                      zIndex: isHovered ? 20 : 10,
                    }}
                    title={location.name}
                    aria-label={`Show ${location.name}`}
                  >
                    {/* Pin graphic */}

                    <svg width="22" height="30" viewBox="0 0 22 30">
                      <path
                        d="M11 0C4.9 0 0 4.9 0 11c0 6.9 11 19 11 19S22 17.9 22 11C22 4.9 17.1 0 11 0z"
                        fill={color}
                        opacity={isHovered ? 1 : 0.9}
                      />

                      <circle
                        cx="11"
                        cy="11"
                        r="6"
                        fill="rgba(0,0,0,0.5)"
                      />

                      <text
                        x="11"
                        y="15"
                        textAnchor="middle"
                        fontSize="8"
                        fontFamily="system-ui"
                      >
                        {CATEGORY_ICON[location.category]}
                      </text>
                    </svg>

                    {/* Hover tooltip */}

                    {isHovered && (
                      <div
                        className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-[#0d0e1a]/95 px-2.5 py-1.5 text-left shadow-xl"
                        style={{ zIndex: 30 }}
                      >
                        <p className="text-[11px] font-semibold text-white">
                          {location.name}
                        </p>

                        <p className="text-[9px] text-white/45">
                          {location.area}
                        </p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected location detail panel */}

          {selectedLocation && (() => {
            const category = catMeta(selectedLocation.category)
            const status = getStatusMeta(selectedLocation.status)

            return (
              <div
                className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/15 bg-[#0d0e1a]/95 p-4 shadow-2xl backdrop-blur-sm sm:left-auto sm:right-3 sm:w-80"
                style={{ zIndex: 40 }}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {selectedLocation.name}
                      </span>

                      {category && (
                        <span
                          className={clsx(
                            'rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]',
                            category.bg,
                            category.color,
                          )}
                        >
                          {category.label}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
                      <MapPin size={9} />
                      {selectedLocation.area}
                    </p>
                  </div>

                  <button
                    onClick={() => setExpandedId(null)}
                    className="mt-0.5 shrink-0 text-white/30 transition hover:text-white/70"
                    aria-label="Close location details"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={clsx(
                      'rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]',
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>
                </div>

                <p className="mb-2.5 text-[11px] leading-5 text-white/55">
                  {selectedLocation.description}
                </p>

                {selectedLocation.tip && (
                  <div className="mb-2.5 flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-2.5 py-2">
                    <span className="text-[10px]">💡</span>

                    <p className="text-[10px] leading-[1.6] text-[#ffdc9b]/80">
                      {selectedLocation.tip}
                    </p>
                  </div>
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
            )
          })()}

          {/* Map hint */}

          <div
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 text-[9px] text-white/30 backdrop-blur-sm"
            style={{ zIndex: 5 }}
          >
            Scroll to zoom · Drag to pan
          </div>
        </div>

        {/* Zoom indicator */}

        <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-2">
          <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">
            Zoom {Math.round(zoom * 100)}%
          </span>

          <div className="h-0.5 flex-1 rounded bg-white/[0.06]">
            <div
              className="h-full rounded bg-white/20 transition-all"
              style={{
                width: `${((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100}%`,
              }}
            />
          </div>

          <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">
            Pin colors match categories
          </span>
        </div>
      </div>

      {/* ─── Category filters ───────────────────────────────────── */}

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

        {CATEGORIES.map(category => {
          const count = WORLD_LOCATIONS.filter(
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

      {/* ─── Location list ──────────────────────────────────────── */}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/[0.08] bg-[#11121d]/90 px-5 py-8 text-center">
            <p className="text-sm font-semibold text-white/60">
              No locations found
            </p>

            <p className="mt-1 text-xs text-white/30">
              There are currently no locations in this category.
            </p>
          </div>
        )}

        {filtered.map(location => {
          const category = catMeta(location.category)
          const status = getStatusMeta(location.status)
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
                    backgroundColor: CAT_COLOR[location.category],
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

                    <span
                      className={clsx(
                        'rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]',
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-white/35">
                    <MapPin size={10} />

                    <span>{location.area}</span>

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
                </div>

                {isOpen ? (
                  <ChevronUp
                    size={15}
                    className="mt-1 shrink-0 text-white/30"
                  />
                ) : (
                  <ChevronDown
                    size={15}
                    className="mt-1 shrink-0 text-white/30"
                  />
                )}
              </button>

              {/* Expanded location information */}

              {isOpen && (
                <div className="border-t border-white/[0.07] bg-black/15 px-4 pb-4 pt-3.5 sm:px-5">
                  <p className="mb-3 text-xs leading-[1.65] text-white/55">
                    {location.description}
                  </p>

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

                    <span
                      className={clsx(
                        'rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]',
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>

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
                      onClick={() => {
                        setExpandedId(location.id)

                        document
                          .querySelector('[data-map-viewport]')
                          ?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                          })
                      }}
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

      {/* ─── Footer ─────────────────────────────────────────────── */}

      <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Community intel · Coordinates approximate · Subject to game updates
      </p>
    </div>
  )
}
