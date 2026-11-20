'use client'

import { useState, useMemo } from 'react'
import { WORLD_LOCATIONS, CATEGORIES, CATEGORY_ICON, POICategory } from '@/lib/world-locations'
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

export default function WorldTab() {
  const [activeCategory, setActiveCategory] = useState<POICategory | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? WORLD_LOCATIONS
        : WORLD_LOCATIONS.filter(l => l.category === activeCategory),
    [activeCategory],
  )

  const catMeta = (key: POICategory) =>
    CATEGORIES.find(c => c.key === key)!

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-9">
      {/* Header */}
      <div className="mb-6">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff9bb5]">
          Leonida intel
        </p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          World Locations
        </h2>
        <p className="mt-1 text-xs text-white/40">
          Money stashes · weapons · drug caches · rare vehicles · supply routes
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
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
                  ? `border-opacity-60 ${cat.bg} ${cat.color} border`
                  : 'border-white/10 bg-white/[0.03] text-white/40 hover:bg-white/[0.07] hover:text-white/70',
              )}
            >
              {CATEGORY_ICON[cat.key]} {cat.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Location cards */}
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
                {/* Icon */}
                <span className="mt-0.5 shrink-0 text-lg leading-none">
                  {CATEGORY_ICON[loc.category]}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white/90">
                      {loc.name}
                    </span>
                    <span
                      className={clsx(
                        'rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.13em]',
                        cat.bg,
                        cat.color,
                      )}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-white/35">
                    <MapPin size={10} />
                    <span>{loc.area}</span>
                    {loc.coordinates && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="text-white/25">{loc.coordinates}</span>
                      </>
                    )}
                  </div>
                  {!isOpen && (
                    <p className="mt-1.5 line-clamp-1 text-xs text-white/40">
                      {loc.description}
                    </p>
                  )}
                </div>

                <span className="ml-1 mt-1 shrink-0 text-white/30">
                  {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.07] bg-black/15 px-4 pb-4 pt-3.5 sm:px-5">
                  <p className="mb-3 text-xs leading-5.5 text-white/55">
                    {loc.description}
                  </p>
                  <div className="flex items-start gap-2 rounded-lg border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-3 py-2.5">
                    <span className="mt-0.5 text-xs">💡</span>
                    <p className="text-[11px] leading-5 text-[#ffdc9b]/85">{loc.tip}</p>
                  </div>
                </div>
              )}
            </article>
          )
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-white/30">
            No locations in this category yet.
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Locations based on community intel · Coordinates are approximate in-game references
      </p>
    </div>
  )
}
