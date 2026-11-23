'use client'

import { useState } from 'react'
import { Home, Car, ExternalLink, Info } from 'lucide-react'
import clsx from 'clsx'

type PropType = 'all' | 'story' | 'purchasable' | 'exclusive'

interface Property {
  id: string
  name: string
  location: string
  area: string
  price: string
  priceNum: number
  spaces: number
  type: PropType
  unlock: string
  features: string[]
  tip: string
}

const PROPERTIES: Property[] = [
  // ── Free story properties ──────────────────────────────────────────────────
  {
    id: 'jasons-house',
    name: "Jason's House",
    location: 'Key Lento',
    area: 'Leonida Keys',
    price: 'Free',
    priceNum: 0,
    spaces: 1,
    type: 'story',
    unlock: 'Chapter 1 — Start of game',
    features: ['Personal safehouse', 'Save point', 'Base of operations Ch. 1', 'Floor stash for cash'],
    tip: 'Empty the floor stash before Tourist Trap — pocket cash above the stash is lost at chapter end. This property is gone after Ch. 1.',
  },
  {
    id: 'starlet-motel',
    name: 'Starlet Motel Room',
    location: 'Kelly County — Port Gellhorn',
    area: 'Kelly County',
    price: 'Free',
    priceNum: 0,
    spaces: 1,
    type: 'story',
    unlock: 'Chapter 2 — Home Sweet Home',
    features: ['Chapter 2 base', 'Save point', 'Lucia\'s necklace stored here', 'Free room from Linda'],
    tip: 'Sell all loot to Dunk before Checking Out — the motel closes at the end of Ch. 2.',
  },
  {
    id: 'bayside-apt',
    name: 'Bayside Apartment 201',
    location: 'Vice City — Bayside',
    area: 'Vice City',
    price: 'Free',
    priceNum: 0,
    spaces: 1,
    type: 'story',
    unlock: 'Chapter 3 — Welcome to Vice City',
    features: ['Chapter 3 base', 'Save point', 'Jason + Lucia shared space'],
    tip: 'The $120k story payout at end of Ch. 3 is best saved here before the chapter finale.',
  },
  {
    id: 'y-hotel-701',
    name: 'Y Hotel Room 701',
    location: 'Ocean Beach, Vice City',
    area: 'Vice City',
    price: 'Free',
    priceNum: 0,
    spaces: 1,
    type: 'story',
    unlock: 'Chapter 4 — Ocean Beach',
    features: ['Chapter 4 base', 'Premium hotel suite', 'Weapon locker', 'Save point'],
    tip: 'The best story safehouse. BuckMe Black unlocks here — $2m checking limit.',
  },
  {
    id: 'port-gellhorn-garage',
    name: 'Port Gellhorn Station Garage',
    location: 'North Port Gellhorn (near Moses)',
    area: 'Kelly County',
    price: 'Free',
    priceNum: 0,
    spaces: 1,
    type: 'story',
    unlock: 'Chapter 2 — Daily Driver (gift from Moses)',
    features: ['1 vehicle space', 'First owned garage', 'Close to Moses auto shop'],
    tip: 'Moses gives this automatically. Use it to safely store your first big steal before you can afford other garages.',
  },
  // ── Edition-exclusive ──────────────────────────────────────────────────────
  {
    id: 'paradise-garage',
    name: 'Paradise Garage',
    location: 'Watson Bay',
    area: 'Watson Bay / Grassrivers',
    price: 'Free (Ultimate Edition)',
    priceNum: 0,
    spaces: 1,
    type: 'exclusive',
    unlock: 'Chapter 2+ — Ultimate Edition only. Unlocks after Daily Driver.',
    features: ['1 vehicle space', 'Watson Bay location', 'Weapon locker', 'Exclusive Edition bonus'],
    tip: 'Located near the gold Lamborghini and Watson Bay cartel compounds — very convenient base for loot runs in that area.',
  },
  {
    id: 'shore-court-garage',
    name: 'Shore Court Garage',
    location: 'Shore Drive, Ocean Beach',
    area: 'Vice Beach, Vice City',
    price: 'Free (Vintage Vice City Pack)',
    priceNum: 0,
    spaces: 1,
    type: 'exclusive',
    unlock: 'Chapter 3+ — Pre-order Vintage Vice City Pack bonus. All editions.',
    features: ['1 vehicle space', 'Steps from Ocean Beach', 'Weapon locker', 'Comes with \'55 Vapid Stanier'],
    tip: 'The best-located free garage. Right next to the Ocean Beach strip, Y Hotel and Vice City\'s best car spawns.',
  },
  // ── Purchasable garages ────────────────────────────────────────────────────
  {
    id: 'mitchel-auto',
    name: 'Mitchel Auto Center',
    location: 'Central Kelly County, Port Gellhorn',
    area: 'Kelly County',
    price: '$4,000',
    priceNum: 4000,
    spaces: 1,
    type: 'purchasable',
    unlock: 'Chapter 2+ — Vice City Real Estate app (after Daily Driver)',
    features: ['1 vehicle space', 'Cheapest purchasable garage', 'Kelly County coverage', 'Weapon locker'],
    tip: 'Best first purchase. At $4k it\'s affordable early Ch. 2. Covers Port Gellhorn and Kelly County operations.',
  },
  {
    id: 'persistence-road',
    name: 'Persistence Road Garage',
    location: 'Western Belville, Leonard County',
    area: 'Leonard County',
    price: '$9,500',
    priceNum: 9500,
    spaces: 1,
    type: 'purchasable',
    unlock: 'Chapter 2+ — Vice City Real Estate app',
    features: ['1 vehicle space', 'Leonard County base', 'Near Belville mystery house'],
    tip: 'Good mid-map coverage. Useful if you spend time in Leonard County or Ambrosia area.',
  },
  {
    id: '7th-avenue-garage',
    name: '7th Avenue Garage',
    location: 'Vice-Dale County (east of airport)',
    area: 'Vice-Dale County',
    price: '$12,000',
    priceNum: 12000,
    spaces: 1,
    type: 'purchasable',
    unlock: 'Chapter 2+ — Vice City Real Estate app',
    features: ['1 vehicle space', 'Near airport', 'Vice-Dale County coverage'],
    tip: 'Useful during Ch. 3 when Vice City opens up. Close to the South Vice-Dale money warehouse.',
  },
  {
    id: 'store-n-bolt-ambrosia',
    name: 'Store N\' Bolt',
    location: 'Ambrosia, Leonard County',
    area: 'Ambrosia',
    price: '$16,800',
    priceNum: 16800,
    spaces: 1,
    type: 'purchasable',
    unlock: 'Chapter 2+ — Vice City Real Estate app',
    features: ['1 vehicle space', 'Ambrosia base', 'Near NFS BMW M3 GTR garage'],
    tip: 'Good for Ch. 3+ when you\'re running Ambrosia and Leonard County operations.',
  },
  {
    id: 'wyatt-motors',
    name: 'Wyatt Motors',
    location: 'Ambrosia, Leonard County',
    area: 'Ambrosia',
    price: '$21,600',
    priceNum: 21600,
    spaces: 1,
    type: 'purchasable',
    unlock: 'Chapter 2+ — Vice City Real Estate app',
    features: ['1 vehicle space', 'Second Ambrosia garage option'],
    tip: 'Second garage in Ambrosia. If you\'re based there, having two spots nearby is useful for car rotation.',
  },
  {
    id: 'vela-rota-capri',
    name: 'Vela Rota Drive Garage',
    location: 'Capri',
    area: 'Vice City — Capri',
    price: '$24,000',
    priceNum: 24000,
    spaces: 1,
    type: 'purchasable',
    unlock: 'Chapter 2+ — Vice City Real Estate app',
    features: ['1 vehicle space', 'Capri/Vice City area'],
    tip: 'Mid-tier price, mid-map location. Good if you work the Capri and central Vice City area heavily.',
  },
  {
    id: 'bonita-court',
    name: 'Bonita Court Garage',
    location: 'Washington Island — east Vice City',
    area: 'Washington Island',
    price: '$34,000',
    priceNum: 34000,
    spaces: 1,
    type: 'purchasable',
    unlock: 'Chapter 2+ — Vice City Real Estate app',
    features: ['1 vehicle space', 'Washington Island coverage', 'Near Dexter Easter Egg apartment'],
    tip: 'Premium location on Washington Island. Good if you work the northeast Vice City area or Vespucci Islands.',
  },
  {
    id: 'atlantic-court',
    name: 'Atlantic Court Garage',
    location: 'Ocean Beach — south of Y Hotel',
    area: 'Ocean Beach, Vice City',
    price: '$40,000',
    priceNum: 40000,
    spaces: 1,
    type: 'purchasable',
    unlock: 'Chapter 2+ — Vice City Real Estate app',
    features: ['1 vehicle space', 'Premium Ocean Beach location', 'Near Y Hotel + VYB Club'],
    tip: 'Most expensive but best Vice City location. Steps from your Ch. 4 safehouse and all Vice Beach activities.',
  },
]

const FILTER_LABELS: { key: PropType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'story', label: 'Story' },
  { key: 'exclusive', label: 'Edition Bonus' },
  { key: 'purchasable', label: 'Purchasable' },
]

const TYPE_COLOR: Record<string, string> = {
  story: '#72dce8',
  exclusive: '#d5a6ff',
  purchasable: '#ffd27a',
}

export default function PropertyTracker() {
  const [filter, setFilter] = useState<PropType | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const list = filter === 'all' ? PROPERTIES : PROPERTIES.filter(p => p.type === filter)
  const totalCost = PROPERTIES.filter(p => p.type === 'purchasable').reduce((s, p) => s + p.priceNum, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">

      {/* Header */}
      <div className="mb-7">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff79a8]">Real Estate</p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">Property Tracker</h2>
        <p className="mt-1.5 text-xs text-white/40">
          Every garage and safehouse in GTA VI — story unlocks, edition bonuses, and all 8 purchasable garages.
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Total Properties', value: PROPERTIES.length },
          { label: 'Purchasable', value: PROPERTIES.filter(p => p.type === 'purchasable').length },
          { label: 'Total Cost (all 8)', value: `$${totalCost.toLocaleString()}` },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.08] bg-[#11121d]/90 px-3 py-2.5 text-center">
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="text-[9px] text-white/35 uppercase tracking-[0.1em]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* How to buy */}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-4 py-3">
        <Info size={13} className="mt-0.5 shrink-0 text-[#ffd27a]" />
        <p className="text-xs leading-5 text-[#ffdc9b]/80">
          Purchasable garages unlock after completing <strong>Daily Driver</strong> in Chapter 2. The Vice City Real Estate app is installed on your phone automatically. No passive income — garages are purely vehicle storage (1 car each).
        </p>
      </div>

      {/* Filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTER_LABELS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as PropType | 'all')}
            className={clsx(
              'rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition',
              filter === f.key
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/[0.08] text-white/35 hover:text-white/70'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Property list */}
      <div className="flex flex-col gap-3">
        {list.map(p => {
          const color = TYPE_COLOR[p.type] ?? '#888'
          const isOpen = expanded === p.id
          return (
            <article key={p.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11121d]/90">
              <button
                onClick={() => setExpanded(isOpen ? null : p.id)}
                className="flex w-full items-start gap-3 px-5 py-4 text-left"
              >
                <Home size={14} className="mt-0.5 shrink-0" style={{ color }} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white/90">{p.name}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]"
                      style={{ color, background: `${color}18`, border: `0.5px solid ${color}40` }}
                    >
                      {p.type === 'story' ? 'Story' : p.type === 'exclusive' ? 'Edition' : 'Buy'}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40">{p.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold" style={{ color: p.priceNum === 0 ? '#4ade80' : '#ffd27a' }}>
                    {p.price}
                  </p>
                  <p className="text-[9px] text-white/30">{p.spaces} car slot</p>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-white/[0.07] bg-black/15 px-5 pb-4 pt-3 space-y-3">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                    <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.1em] text-white/30">🔑 How to Unlock</p>
                    <p className="text-xs text-white/70">{p.unlock}</p>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white/30">Features</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.features.map((f, i) => (
                        <span key={i} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-white/55">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-3 py-2">
                    <span className="text-sm">💡</span>
                    <p className="text-[11px] leading-5 text-[#ffdc9b]/80">{p.tip}</p>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <a
        href="https://www.powerpyx.com/gta-6-all-garage-locations/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-xs text-white/40 transition hover:bg-white/[0.06] hover:text-white/70"
      >
        <ExternalLink size={12} />
        Full Garage Guide with Map (PowerPyx)
      </a>

      <p className="mt-5 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        No passive income in GTA VI story mode · Garages = vehicle storage only
      </p>
    </div>
  )
}
