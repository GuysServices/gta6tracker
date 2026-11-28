'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { CATEGORY_META, GTA6Location } from '@/lib/gta6route-locations'

type Props = { locations: GTA6Location[] }

const WORLD_SIZE = 32768
const WORLD_MIN = -16384
const WORLD_MAX = 16384
const TILE_SIZE = 256
const MAX_TILE_Z = 6
const TILE_URL = 'https://raw.githubusercontent.com/rolux/gtadb.org/main/maps/tiles/6/day'

const TILE_RANGES: Record<number, [[number, number], [number, number]]> = {
  0: [[0, 0], [2, 3]],
  1: [[1, 1], [5, 6]],
  2: [[2, 2], [10, 12]],
  3: [[4, 4], [20, 25]],
  4: [[8, 8], [41, 51]],
  5: [[17, 17], [83, 103]],
  6: [[34, 34], [167, 206]],
}

type TileEntry = { image: HTMLImageElement; loaded: boolean; failed: boolean }

export default function GTADBMapCanvas({ locations }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const tilesRef = useRef<Map<string, TileEntry>>(new Map())
  const redrawRef = useRef<() => void>(() => {})
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; centerX: number; centerY: number; moved: boolean } | null>(null)
  const [size, setSize] = useState({ width: 900, height: 650 })
  const [center, setCenter] = useState({ x: -4000, y: 2000 })
  const [zoom, setZoom] = useState(1)
  const [selected, setSelected] = useState<GTA6Location | null>(null)

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
  // Keep DOM pins on the exact same world-to-screen scale as the GTADB tile renderer.
  const mapScale = (1024 * Math.pow(2, zoom)) / WORLD_SIZE

  useEffect(() => {
    const element = wrapperRef.current
    if (!element) return
    const observer = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect
      if (rect) setSize({ width: Math.max(1, rect.width), height: Math.max(1, rect.height) })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = size.width
    const height = size.height
    const pixelWidth = Math.round(width * dpr)
    const pixelHeight = Math.round(height * dpr)
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = '#24313a'
    ctx.fillRect(0, 0, width, height)

    const tileZ = Math.min(Math.ceil(zoom), MAX_TILE_Z)
    const tileScale = Math.pow(2, zoom - tileZ)
    const tileScreenSize = TILE_SIZE * tileScale
    const mapScale = (1024 * Math.pow(2, zoom)) / WORLD_SIZE
    const centerPixelX = (center.x - WORLD_MIN) * mapScale
    const centerPixelY = (WORLD_MAX - center.y) * mapScale
    const offsetX = width / 2 - centerPixelX * tileScale
    const offsetY = height / 2 - centerPixelY * tileScale
    const minTileX = Math.floor(-offsetX / tileScreenSize)
    const maxTileX = Math.ceil((width - offsetX) / tileScreenSize)
    const minTileY = Math.floor(-offsetY / tileScreenSize)
    const maxTileY = Math.ceil((height - offsetY) / tileScreenSize)
    const range = TILE_RANGES[tileZ]

    if (!range) return
    for (let y = minTileY; y <= maxTileY; y++) {
      for (let x = minTileX; x <= maxTileX; x++) {
        const screenX = offsetX + x * tileScreenSize
        const screenY = offsetY + y * tileScreenSize
        if (x < range[0][0] || x > range[1][0] || y < range[0][1] || y > range[1][1]) {
          continue
        }
        const key = `${tileZ}/${y}/${x}`
        let tile = tilesRef.current.get(key)
        if (!tile) {
          const image = new Image()
          tile = { image, loaded: false, failed: false }
          tilesRef.current.set(key, tile)
          image.onload = () => {
            const entry = tilesRef.current.get(key)
            if (entry) entry.loaded = true
            redrawRef.current()
          }
          image.onerror = () => {
            const entry = tilesRef.current.get(key)
            if (entry) entry.failed = true
          }
          image.src = `${TILE_URL}/${tileZ}/${tileZ},${y},${x}.jpg`
        }
        if (tile.loaded && tile.image.naturalWidth > 0) {
          ctx.drawImage(tile.image, screenX, screenY, tileScreenSize, tileScreenSize)
        }
      }
    }

    // Subtle contrast layer keeps tracker pins readable without replacing GTADB imagery.
    const shade = ctx.createLinearGradient(0, 0, 0, height)
    shade.addColorStop(0, 'rgba(4, 8, 13, 0.05)')
    shade.addColorStop(1, 'rgba(4, 8, 13, 0.22)')
    ctx.fillStyle = shade
    ctx.fillRect(0, 0, width, height)
  }, [center.x, center.y, size.height, size.width, zoom])

  useEffect(() => { redrawRef.current = draw; draw() }, [draw])

  const pinPositions = locations.filter(loc => loc.mapCoords).map(loc => {
    // Pins use the same native GTADB in-game coordinates as the tile map.
    const worldX = loc.mapCoords!.x
    const worldY = loc.mapCoords!.y
    const left = size.width / 2 + (worldX - center.x) * mapScale
    const top = size.height / 2 - (worldY - center.y) * mapScale
    return { loc, left, top }
  })

  const zoomAt = (nextZoom: number, anchorX = size.width / 2, anchorY = size.height / 2) => {
    const clampedZoom = clamp(nextZoom, 0, 7)
    const oldScale = WORLD_SIZE / (1024 * Math.pow(2, zoom))
    const newScale = WORLD_SIZE / (1024 * Math.pow(2, clampedZoom))
    const dx = anchorX - size.width / 2
    const dy = anchorY - size.height / 2
    setCenter(current => ({
      x: clamp(current.x + dx * (oldScale - newScale), WORLD_MIN, WORLD_MAX),
      y: clamp(current.y + dy * (newScale - oldScale), WORLD_MIN, WORLD_MAX),
    }))
    setZoom(clampedZoom)
  }

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    zoomAt(zoom - event.deltaY * 0.0025, event.clientX - rect.left, event.clientY - rect.top)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      centerX: center.x,
      centerY: center.y,
      moved: false,
    }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true
    if (!drag.moved) return
    setCenter({
      x: clamp(drag.centerX - dx / mapScale, WORLD_MIN, WORLD_MAX),
      y: clamp(drag.centerY + dy / mapScale, WORLD_MIN, WORLD_MAX),
    })
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#24313a] select-none"
      style={{ aspectRatio: '1 / 0.78', touchAction: 'none', overscrollBehavior: 'contain', cursor: dragRef.current ? 'grabbing' : 'grab' }}
      onWheelCapture={event => { event.preventDefault(); event.stopPropagation(); onWheel(event) }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
      {pinPositions.map(({ loc, left, top }) => {
        if (left < -40 || top < -50 || left > size.width + 40 || top > size.height + 20) return null
        const meta = CATEGORY_META[loc.category]
        const isSelected = selected?.id === loc.id
        return (
          <button
            key={loc.id}
            type="button"
            title={loc.name}
            onPointerDown={event => event.stopPropagation()}
            onClick={event => { event.stopPropagation(); setSelected(current => current?.id === loc.id ? null : loc) }}
            className="absolute z-10 -translate-x-1/2 -translate-y-full rounded-full border-2 border-[#080910] shadow-lg transition-transform hover:scale-125"
            style={{
              left,
              top,
              width: isSelected ? 19 : 13,
              height: isSelected ? 19 : 13,
              backgroundColor: meta.color,
              boxShadow: isSelected ? `0 0 0 4px ${meta.color}55, 0 0 16px ${meta.color}` : undefined,
            }}
          />
        )
      })}

      <div className="absolute left-3 top-3 z-20 rounded-lg border border-white/10 bg-[#080910]/75 px-2.5 py-1.5 text-[10px] text-white/75 backdrop-blur">
        {pinPositions.length} pins · GTADB GTA VI layer
      </div>

      <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#080910]/80 shadow-xl backdrop-blur">
        <button type="button" aria-label="Zoom in" onClick={() => zoomAt(zoom + 0.5)} className="p-2 text-white/80 hover:bg-white/10"><Plus size={15} /></button>
        <div className="h-px bg-white/10" />
        <button type="button" aria-label="Zoom out" onClick={() => zoomAt(zoom - 0.5)} className="p-2 text-white/80 hover:bg-white/10"><Minus size={15} /></button>
      </div>

      {selected && (
        <div className="absolute bottom-4 left-1/2 z-30 w-72 max-w-[calc(100%-24px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0d0e1c]/95 p-4 shadow-2xl backdrop-blur-md">
          <button type="button" onClick={() => setSelected(null)} className="absolute right-3 top-3 text-white/40 hover:text-white/80"><X size={14} /></button>
          <div className="mb-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest" style={{ backgroundColor: CATEGORY_META[selected.category].color + '28', color: CATEGORY_META[selected.category].color }}>
            {CATEGORY_META[selected.category].icon} {CATEGORY_META[selected.category].label}
          </div>
          <p className="mt-1.5 text-sm font-semibold leading-snug text-white">{selected.name}</p>
          <p className="mt-1 text-xs text-white/45">{selected.area}</p>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-1.5 right-2 z-20 rounded bg-[#080910]/55 px-1.5 py-0.5 text-[8px] text-white/60">
        GTA VI Map Tiles (CC BY 4.0) · map.gtadb.org
      </div>
    </div>
  )
}
