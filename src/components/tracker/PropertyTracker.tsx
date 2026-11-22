'use client'

import { useState, useEffect } from 'react'
import { Building2, DollarSign, TrendingUp, MapPin, Clock, CheckSquare, Square, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

// ─── Types ───────────────────────────────────────────────────────────────────

type PropertyType = 'residential' | 'business' | 'story'
type SortKey = 'roi' | 'price_asc' | 'price_desc' | 'income'

interface Property {
  id: string
  name: string
  type: PropertyType
  location: string
  area: string
  price: number | null        // null = story-locked, can't buy
  weeklyIncome: number | null // null = no passive income
  chapterAvailable: number    // 0 = from start
  perks: string[]
  notes: string
  requiresUnlock?: string     // specific unlock condition
}

// ─── Data ────────────────────────────────────────────────────────────────────

const PROPERTIES: Property[] = [
  // ── Story Properties (reference only) ──────────────────────────────────
  {
    id: 'jason-house',
    name: "Jason's Stilt House",
    type: 'story',
    location: 'Key Lento, east shore',
    area: 'Leonida Keys',
    price: null,
    weeklyIncome: null,
    chapterAvailable: 1,
    perks: ['Personal vehicle garage (2 cars)', 'Weapon stash', 'Floor stash space', 'Medkit spawn on counter'],
    notes: 'Jason\'s starting base. Lost permanently at the Chapter 1 point of no return. Upgrade the kitchen, porch, and roof before Tourist Trap — raises resale value and adds stash space.',
  },
  {
    id: 'starlet-motel',
    name: 'Starlet Motel Room',
    type: 'story',
    location: 'Starlet Motel, north wing',
    area: 'Port Gellhorn',
    price: null,
    weeklyIncome: null,
    chapterAvailable: 2,
    perks: ['Neutral safe house', 'Moses contact nearby', 'Free vending machine on lot'],
    notes: 'Chapter 2 base. Lost at Checking Out. No upgrades available but Moses is 90 seconds away — ideal for car-selling runs.',
  },
  {
    id: 'bayside-apt',
    name: 'Bayside Apartment',
    type: 'story',
    location: 'Bayside District, 4th floor',
    area: 'Vice City',
    price: null,
    weeklyIncome: null,
    chapterAvailable: 3,
    perks: ['City-centre spawn', 'Garage (2 cars)', 'Proximity to Tyrone and Yasmani fences', 'Roof access'],
    notes: 'Chapter 3 base. Retained after Chapter 3 ends as a secondary safe house. Good central Vice City spawn.',
  },
  {
    id: 'y-hotel',
    name: 'Y Hotel Suite',
    type: 'story',
    location: 'Ocean Beach strip, 7th floor',
    area: 'Vice City',
    price: null,
    weeklyIncome: null,
    chapterAvailable: 4,
    perks: ['Premium ocean view spawn', 'Valet garage (4 cars)', 'Rooftop helipad', 'Lawyer Abe on speed dial'],
    notes: 'Chapter 4 base. Retained post-game. Best vanilla spawn point in Vice City proper — helipad makes it the fastest way in and out of Ocean Beach.',
  },

  // ── Purchasable Residential ─────────────────────────────────────────────
  {
    id: 'keys-cottage',
    name: 'Keys Cottage',
    type: 'residential',
    location: 'South Key Lento, waterfront',
    area: 'Leonida Keys',
    price: 45000,
    weeklyIncome: null,
    chapterAvailable: 2,
    perks: ['2-car garage', 'Dock with boat spawn', 'Hidden stash under the porch', 'Low wanted-level zone'],
    notes: 'Best-value early property. Buyable in Ch2 when you first get spending money. The dock lets you skip the ferry entirely for Keys access in post-game.',
  },
  {
    id: 'gellhorn-bungalow',
    name: 'Port Gellhorn Bungalow',
    type: 'residential',
    location: 'Harbour Road, west end',
    area: 'Port Gellhorn',
    price: 85000,
    weeklyIncome: null,
    chapterAvailable: 2,
    perks: ['2-car garage', 'Tool shed (bonus stash)', 'Moses fence walkable distance', 'Kelly County border access'],
    notes: 'Solid Ch2 purchase if you want a permanent base after losing the Starlet Motel. Proximity to Moses makes it the best car-flipping hub on the mainland.',
  },
  {
    id: 'kelly-farmhouse',
    name: 'Kelly County Farmhouse',
    type: 'residential',
    location: 'Old Cattle Road, north Kelly',
    area: 'Kelly County',
    price: 125000,
    weeklyIncome: 1200,
    chapterAvailable: 2,
    perks: ['4-car barn', 'Trailer spawn (heavy vehicle)', 'Large weapon cache', '$1,200/wk tenant income', 'Low police density'],
    notes: 'Only residential property with passive income — tenants pay rent. Best off-grid base in the game. The trailer spawn is unique and needed for two optional Ch3 jobs.',
  },
  {
    id: 'ocean-condo',
    name: 'Ocean Drive Condo',
    type: 'residential',
    location: 'Ocean Drive North, 3rd floor',
    area: 'Vice City',
    price: 280000,
    weeklyIncome: 800,
    chapterAvailable: 3,
    perks: ['2-car garage', '$800/wk short-term rental income', 'Beach spawn', 'Proximity to Yasmani'],
    notes: 'Short-term rental income is Airbnb-style — fluctuates ±15% weekly. ROI is slower than pure businesses but useful as a Vice City spawn near Yasmani.',
  },
  {
    id: 'vespucci-villa',
    name: 'Vespucci Island Villa',
    type: 'residential',
    location: 'Neptune Circle, gated north end',
    area: 'Vespucci Island',
    price: 340000,
    weeklyIncome: null,
    chapterAvailable: 3,
    perks: ['4-car garage', 'Private pool (health regen zone)', 'Helicopter landing area', 'Zero spawn aggro'],
    notes: 'Premium residential, no income. Worth it as a Vespucci Island base — the pool is a confirmed health regen zone, fastest passive heal in the game. Near the Paul Walker Easter Egg car.',
  },
  {
    id: 'vc-penthouse',
    name: 'Vice City Penthouse',
    type: 'residential',
    location: 'Malibu Tower, top floor',
    area: 'Vice City',
    price: 750000,
    weeklyIncome: null,
    chapterAvailable: 4,
    perks: ['6-car garage', 'Rooftop helipad', 'Private elevator (police skip)', 'VIP bouncer — cops can\'t enter without escalation', 'Full weapon loadout spawn'],
    notes: 'Most expensive residential property. The police elevator block is the unique mechanic — if you enter the building while wanted, the star level freezes while inside. Good end-game flex purchase.',
  },

  // ── Purchasable Businesses ──────────────────────────────────────────────
  {
    id: 'avery-pawn',
    name: 'Avery Pawn Shop',
    type: 'business',
    location: 'Central Port Gellhorn',
    area: 'Port Gellhorn',
    price: 45000,
    weeklyIncome: 600,
    chapterAvailable: 2,
    perks: ['$600/wk passive income', 'Staff fence — sell direct at 45% (better than Brian)', 'No heat on goods sold here'],
    notes: 'Cheapest business with a fence perk attached. After buying, you can sell goods through the shop at 45% rate — better than Brian and no questions asked. ROI in 75 weeks pure, but the fence saves money on runs.',
    requiresUnlock: 'Available for purchase after the optional Avery Pawn robbery in Ch2.',
  },
  {
    id: 'car-wash',
    name: 'Wash & Go Car Wash',
    type: 'business',
    location: 'South Vice City Boulevard',
    area: 'Vice City',
    price: 65000,
    weeklyIncome: 950,
    chapterAvailable: 3,
    perks: ['$950/wk passive income', 'Free vehicle respray (2×/week)', 'Cleans heat off registered vehicles'],
    notes: 'The free respray perk has real value — cleaning a hot car at the car wash doesn\'t cost you anything if you own it. Pairs well with car-flipping through Moses.',
  },
  {
    id: 'marina-berth',
    name: 'Vice City Marina Berth',
    type: 'business',
    location: 'Port Marina, slip 7',
    area: 'Vice City',
    price: 95000,
    weeklyIncome: 1100,
    chapterAvailable: 3,
    perks: ['$1,100/wk slip rental income', 'Personal boat storage (3 vessels)', 'Fast water travel south Vice City', 'Pilot Pete contact nearby'],
    notes: 'Best ROI business under $100k. The boat storage and Pilot Pete adjacency make this genuinely useful beyond the income. Pilot Pete\'s cargo flights pay more if you own the berth.',
  },
  {
    id: 'kingpin-bowling',
    name: 'Kingpin Bowling',
    type: 'business',
    location: 'Westside Port Gellhorn',
    area: 'Port Gellhorn',
    price: 95000,
    weeklyIncome: 1400,
    chapterAvailable: 2,
    perks: ['$1,400/wk passive income', 'Dunk fence on premises after purchase', 'Back room weapon stash'],
    notes: 'Second-best ROI in the game. Only available if you completed the Kingpin Bowling robbery optional in Ch2 — the robbery is also the only way to get the Gutterball Moreland 850 shotgun.',
    requiresUnlock: 'Must complete the Kingpin Bowling optional robbery in Ch2 first.',
  },
  {
    id: 'warehouse',
    name: 'Port Gellhorn Warehouse',
    type: 'business',
    location: 'Industrial Dock Road',
    area: 'Port Gellhorn',
    price: 155000,
    weeklyIncome: 1800,
    chapterAvailable: 2,
    perks: ['$1,800/wk storage rental income', '12-slot vehicle storage', 'Dunk fence bonus (+10% on vehicles sold)', 'Shipping container stash'],
    notes: 'Best vehicle-focused business. The Dunk bonus stacks with the warehouse — if you route stolen cars through Dunk while owning the warehouse you get 70% payout instead of 60%.',
  },
  {
    id: 'sunrise-motel',
    name: 'Sunrise Motel (10 units)',
    type: 'business',
    location: 'North Vice City strip',
    area: 'Vice City',
    price: 180000,
    weeklyIncome: 2400,
    chapterAvailable: 3,
    perks: ['$2,400/wk rental income', 'Staff fence at 50%', '4-car lot', 'Low-profile safe house room (unit 7)'],
    notes: 'Highest single income of any business under $200k. The staff fence at 50% is decent for quick offloads. Unit 7 functions as a hidden safe house — cops don\'t check the rooms.',
  },
  {
    id: 'scooter-bros',
    name: 'Scooter Bros Franchise',
    type: 'business',
    location: 'Multiple Vice City locations',
    area: 'Vice City',
    price: 200000,
    weeklyIncome: 3200,
    chapterAvailable: 2,
    perks: ['$3,200/wk highest passive income', 'Free scooter spawn at any branch', 'Moses network discount (cars registered cheaper)', 'Delivery job income on top'],
    notes: 'Best ROI in the game at 62.5 weeks. Requires Moses contact from Ch2. The Moses network discount reduces car registration cost by 20% — meaningful if you flip volume.',
    requiresUnlock: 'Requires Moses contact unlocked in Chapter 2.',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function roiWeeks(price: number, income: number): number {
  return Math.ceil(price / income)
}

function fmt(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
}

function roiBadgeColor(weeks: number): string {
  if (weeks <= 70)  return 'border-emerald-500/40 bg-emerald-900/25 text-emerald-300'
  if (weeks <= 100) return 'border-[#ffd27a]/30 bg-[#ffd27a]/10 text-[#ffd27a]'
  return 'border-rose-500/30 bg-rose-900/20 text-rose-300'
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PropertyTracker() {
  const [owned, setOwned]     = useState<Set<string>>(new Set())
  const [filter, setFilter]   = useState<'all' | PropertyType>('all')
  const [sort, setSort]       = useState<SortKey>('roi')
  const [expanded, setExpanded] = useState<string | null>(null)

  // localStorage persistence
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gta6-owned-properties')
      if (raw) setOwned(new Set(JSON.parse(raw) as string[]))
    } catch {}
  }, [])

  const toggleOwned = (id: string) => {
    setOwned(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      try { localStorage.setItem('gta6-owned-properties', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  const filtered = PROPERTIES
    .filter(p => filter === 'all' || p.type === filter)
    .sort((a, b) => {
      if (sort === 'price_asc') return (a.price ?? 0) - (b.price ?? 0)
      if (sort === 'price_desc') return (b.price ?? 0) - (a.price ?? 0)
      if (sort === 'income') return (b.weeklyIncome ?? 0) - (a.weeklyIncome ?? 0)
      // ROI: businesses with income first, by fastest break-even
      const roiA = a.weeklyIncome && a.price ? roiWeeks(a.price, a.weeklyIncome) : 9999
      const roiB = b.weeklyIncome && b.price ? roiWeeks(b.price, b.weeklyIncome) : 9999
      return roiA - roiB
    })

  const typeLabel: Record<PropertyType, string> = {
    story: 'Story', residential: 'Residential', business: 'Business',
  }
  const typeColor: Record<PropertyType, string> = {
    story:       'border-white/15 bg-white/[0.05] text-white/40',
    residential: 'border-[#72dce8]/25 bg-[#72dce8]/[0.07] text-[#72dce8]',
    business:    'border-emerald-500/30 bg-emerald-900/20 text-emerald-300',
  }

  const FILTERS: { key: 'all' | PropertyType; label: string }[] = [
    { key: 'all',         label: 'All' },
    { key: 'story',       label: 'Story' },
    { key: 'residential', label: 'Residential' },
    { key: 'business',    label: 'Businesses' },
  ]
  const SORTS: { key: SortKey; label: string }[] = [
    { key: 'roi',        label: 'Best ROI' },
    { key: 'income',     label: 'Income ↓' },
    { key: 'price_asc',  label: 'Price ↑' },
    { key: 'price_desc', label: 'Price ↓' },
  ]

  const totalWeekly = [...owned].reduce((acc, id) => {
    const p = PROPERTIES.find(x => x.id === id)
    return acc + (p?.weeklyIncome ?? 0)
  }, 0)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-7 sm:px-6 sm:py-9">

      {/* ── Header ── */}
      <div className="rounded-xl border border-white/[0.07] bg-[#11121d]/60 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">Property Tracker</p>
            <p className="mt-1 text-sm text-white/50 leading-relaxed">
              All purchasable properties and story bases. Toggle owned to track your portfolio. Income-generating businesses sorted by ROI.
            </p>
          </div>
          {totalWeekly > 0 && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 px-4 py-2.5 text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-400/70">Weekly Income</p>
              <p className="font-display text-lg font-bold text-emerald-300">${totalWeekly.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Filters + Sort ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                'rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition',
                filter === f.key
                  ? 'border-[#ff79a8]/50 bg-[#ff79a8]/10 text-[#ff9bb5]'
                  : 'border-white/10 bg-white/[0.03] text-white/35 hover:text-white/55',
              )}
            >{f.label}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          {SORTS.map(s => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={clsx(
                'rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition',
                sort === s.key
                  ? 'border-[#ffd27a]/40 bg-[#ffd27a]/10 text-[#ffd27a]'
                  : 'border-white/10 bg-white/[0.03] text-white/35 hover:text-white/55',
              )}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* ── Property Cards ── */}
      <div className="flex flex-col gap-3">
        {filtered.map(prop => {
          const isOwned  = owned.has(prop.id)
          const isExpand = expanded === prop.id
          const roi      = prop.price && prop.weeklyIncome ? roiWeeks(prop.price, prop.weeklyIncome) : null

          return (
            <article
              key={prop.id}
              className={clsx(
                'overflow-hidden rounded-xl border bg-[#11121d]/90 transition duration-200',
                isOwned
                  ? 'border-emerald-500/35 shadow-[0_0_20px_rgba(52,211,153,.05)]'
                  : 'border-white/[0.08] hover:border-white/[0.14]',
              )}
            >
              {/* Card header */}
              <div className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
                {/* Owned toggle */}
                {prop.type !== 'story' && (
                  <button
                    onClick={() => toggleOwned(prop.id)}
                    className="mt-0.5 shrink-0 text-white/25 transition hover:text-emerald-400"
                    aria-label={isOwned ? 'Mark as not owned' : 'Mark as owned'}
                  >
                    {isOwned
                      ? <CheckSquare size={17} className="text-emerald-400" />
                      : <Square size={17} />
                    }
                  </button>
                )}
                {prop.type === 'story' && (
                  <div className="mt-0.5 shrink-0">
                    <Building2 size={17} className="text-white/20" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-bold text-white">{prop.name}</span>
                    <span className={clsx('rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em]', typeColor[prop.type])}>
                      {typeLabel[prop.type]}
                    </span>
                    {prop.chapterAvailable > 0 && (
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/30">
                        Ch{prop.chapterAvailable}+
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-white/35">
                      <MapPin size={9} className="text-white/20" />{prop.location}, {prop.area}
                    </span>
                  </div>
                </div>

                {/* Price / income / ROI */}
                <div className="shrink-0 text-right">
                  {prop.price !== null ? (
                    <p className="font-display text-sm font-bold text-white">{fmt(prop.price)}</p>
                  ) : (
                    <p className="text-xs text-white/25 italic">Story</p>
                  )}
                  {prop.weeklyIncome && (
                    <p className="text-[10px] text-emerald-400">+${prop.weeklyIncome.toLocaleString()}/wk</p>
                  )}
                  {roi && (
                    <span className={clsx('mt-0.5 inline-block rounded border px-1.5 py-0.5 text-[9px] font-bold', roiBadgeColor(roi))}>
                      {roi}w ROI
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setExpanded(isExpand ? null : prop.id)}
                  className="mt-0.5 shrink-0"
                  aria-expanded={isExpand}
                >
                  <ChevronDown
                    size={15}
                    className={clsx('text-white/25 transition-transform duration-200', isExpand && 'rotate-180')}
                  />
                </button>
              </div>

              {/* Expanded detail */}
              {isExpand && (
                <div className="border-t border-white/[0.07] bg-black/15 px-4 py-3.5 sm:px-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#72dce8]/60">Perks</p>
                      <ul className="flex flex-col gap-1.5">
                        {prop.perks.map((perk, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-white/50">
                            <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#72dce8]/35" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#ffd27a]/60">Notes</p>
                      <p className="text-[11px] leading-relaxed text-white/45">{prop.notes}</p>
                      {prop.requiresUnlock && (
                        <div className="mt-2.5 rounded-lg border border-amber-500/25 bg-amber-900/15 px-3 py-2">
                          <p className="text-[10px] text-amber-300/80">{prop.requiresUnlock}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
