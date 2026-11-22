'use client'

import { useState } from 'react'
import { ShoppingBag, MapPin, Star, TrendingUp, Lock } from 'lucide-react'
import clsx from 'clsx'

// ─── Types ───────────────────────────────────────────────────────────────────

type PayoutTier = 'low' | 'mid' | 'high' | 'premium' | 'commission'

interface AcceptedCategory {
  label: string
  rate: string
}

interface Fence {
  id: string
  name: string
  contact: string
  area: string
  location: string
  chapterUnlock: number
  unlockNote?: string
  payoutTier: PayoutTier
  accepts: AcceptedCategory[]
  specialFeatures: string[]
  tip: string
  hotItems: string    // what they overpay on
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FENCES: Fence[] = [
  {
    id: 'brians-lockup',
    name: "Brian's Lockup",
    contact: 'Brian',
    area: 'Leonida Keys',
    location: 'Stilt warehouse, south Key Lento dock road',
    chapterUnlock: 1,
    payoutTier: 'low',
    accepts: [
      { label: 'General goods', rate: '35%' },
      { label: 'Weapons (stolen)', rate: '30%' },
      { label: 'Drugs (small quantities)', rate: '32%' },
      { label: 'Electronics', rate: '30%' },
    ],
    specialFeatures: [
      'Always open — no appointment, no cooldown',
      'No heat — selling here adds zero wanted level risk',
      'First fence in the game, available Ch1 start',
    ],
    hotItems: 'Nothing specific — Brian buys everything at the same flat low rate.',
    tip: 'Use Brian only when you need to offload fast and can\'t reach a better fence. His rates are the worst in the game but he\'s always available and risk-free. Good for clearing inventory before the Ch1 PONR.',
  },
  {
    id: 'kenton-dives',
    name: "Kenton's Dive Spots",
    contact: 'Kenton',
    area: 'Leonida Keys',
    location: 'Marlin Cove, Keys coast — meets at the dock',
    chapterUnlock: 1,
    unlockNote: 'Talk to Kenton at Marlin Cove dock after completing Gone Fishing.',
    payoutTier: 'mid',
    accepts: [
      { label: 'Underwater salvage', rate: '50%' },
      { label: 'Recovered maritime goods', rate: '48%' },
      { label: 'Antique/historical items', rate: '55%' },
    ],
    specialFeatures: [
      'Exclusive to underwater loot — cannot sell street goods here',
      'Antique bonus: items flagged as historical get +5% over listed rate',
      'Gives dive spot map markers on first meeting',
    ],
    hotItems: 'Antique items recovered from the Keys shipwrecks — consistent 55% payout.',
    tip: 'Niche but worth knowing. The dive spots Kenton marks have high-value unique items that can\'t be found on land. If you spend any time underwater in the Keys, do his intro first.',
  },
  {
    id: 'moses',
    name: 'Moses',
    contact: 'Moses',
    area: 'Port Gellhorn',
    location: 'Slim Jim lot, Harbour Road east',
    chapterUnlock: 2,
    unlockNote: 'Automatically introduced during the Chapter 2 Coffee Break mission.',
    payoutTier: 'mid',
    accepts: [
      { label: 'Registered vehicles', rate: '55%' },
      { label: 'Unregistered vehicles', rate: '40%' },
      { label: 'Vehicle parts', rate: '45%' },
      { label: 'General goods', rate: '40%' },
    ],
    specialFeatures: [
      'Vehicle registration — eliminates tracker, makes car permanently sellable',
      'Slim Jim tool — allows silent car entry without breaking windows',
      'Scooter Bros network access — required to buy the franchise',
      'Owns Scooter Bros Franchise unlock prerequisite',
    ],
    hotItems: 'Registered vehicles — a registered car pays 55% vs 40% unregistered. Always register before selling.',
    tip: 'The Scooter Bros franchise ($200k, $3,200/wk) requires Moses as a contact. Talk to him early in Ch2 and register everything through him — the volume discount from owning the franchise saves real money on registration fees.',
  },
  {
    id: 'dunk',
    name: 'Dunk',
    contact: 'Dunk',
    area: 'Kelly County',
    location: 'Old barn, County Road 7, north Kelly',
    chapterUnlock: 2,
    unlockNote: 'Unlocks after completing the Gear Shift mission in Chapter 2.',
    payoutTier: 'high',
    accepts: [
      { label: 'Hot vehicles (no questions)', rate: '60%' },
      { label: 'Vehicle parts', rate: '55%' },
      { label: 'Heavy vehicles', rate: '58%' },
      { label: 'Motorcycles', rate: '62%' },
    ],
    specialFeatures: [
      'Takes stolen vehicles with no registration required',
      'No cooldown between vehicle sales',
      'Motorcycles get +2% bonus vs other vehicle types',
      'Warehouse bonus: owning Port Gellhorn Warehouse raises all Dunk payouts by +10%',
    ],
    hotItems: 'Motorcycles — 62% base, 72% with warehouse bonus. Best single-sale return in Ch2.',
    tip: 'Dunk is the go-to for hot car sales. If you buy the Port Gellhorn Warehouse, Dunk\'s rates jump to 70% on vehicles — that combination is the best car-flipping setup in the game before Ch3 fences unlock.',
  },
  {
    id: 'tyrone',
    name: 'Tyrone',
    contact: 'Tyrone',
    area: 'Vice City — Bayside',
    location: 'Loading dock behind Bayside Fish Market',
    chapterUnlock: 3,
    unlockNote: 'Introduced automatically at the start of Chapter 3.',
    payoutTier: 'high',
    accepts: [
      { label: 'General goods', rate: '70%' },
      { label: 'Drugs', rate: '68%' },
      { label: 'Weapons', rate: '65%' },
      { label: 'Electronics', rate: '65%' },
      { label: 'Clothing/luxury', rate: '70%' },
    ],
    specialFeatures: [
      'Highest general-goods rate in the game',
      'Accepts drugs with no extra heat',
      'No daily sell limit — can offload full inventory in one visit',
      'Available 06:00–02:00 in-game time',
    ],
    hotItems: 'General goods and clothing — 70% flat across the board. Best destination for mixed hauls.',
    tip: 'Route everything through Tyrone that isn\'t electronics or Wish List. 70% on clothing and general goods is the ceiling for non-specialist fences. Closed between 02:00–06:00 — only fence in the game with a time window.',
  },
  {
    id: 'yasmani',
    name: 'Yasmani',
    contact: 'Yasmani',
    area: 'Vice City — Ocean Drive',
    location: 'Back of the Havana Electronics repair shop, Ocean Drive North',
    chapterUnlock: 3,
    unlockNote: 'Introduced during Chapter 3 — available after the second Bayside mission.',
    payoutTier: 'premium',
    accepts: [
      { label: 'Electronics (phones, tablets, cameras)', rate: '75%' },
      { label: 'Luxury goods (watches, jewellery)', rate: '72%' },
      { label: 'High-end vehicles', rate: '65%' },
      { label: 'General goods', rate: '55%' },
    ],
    specialFeatures: [
      'Highest electronics rate in the game — 40% more than Moses',
      'Jewellery from heists gets an additional +5% premium',
      'Daily electronics cap: $12,000 worth — visit daily for high-volume runs',
      'Will appraise Randy Wish List electronics items (increases commission rate)',
    ],
    hotItems: 'Electronics — 75% is 10–15% above every other fence. If you\'re doing phone/laptop runs, all roads lead to Yasmani.',
    tip: 'The $12k daily electronics cap means high-volume runs need to be split across days. If you have a full haul, sell $12k to Yasmani first at 75%, then dump the rest at Tyrone at 65%. Never sell electronics to anyone else.',
  },
  {
    id: 'randy',
    name: "Randy's Wish List",
    contact: 'Randy',
    area: 'Vice City — Midtown',
    location: 'Randy\'s Auto Salvage, Midtown Industrial',
    chapterUnlock: 3,
    unlockNote: 'Randy\'s Wish List system unlocks mid-Chapter 3 after the Tools of the Trade mission.',
    payoutTier: 'commission',
    accepts: [
      { label: 'Wish List commissioned items only', rate: '80–92%' },
      { label: 'No walk-in sales accepted', rate: 'N/A' },
    ],
    specialFeatures: [
      'Commission-based system — steal what Randy\'s clients want, name your price',
      '80–92% payout depending on item rarity and condition',
      'Wish List refreshes every 48 in-game hours with new commissions',
      'Rare commissions pay up to $45,000 per item',
      'Yasmani appraisal boosts electronics commissions by +3–5%',
      'Three active commissions at a time — prioritize by payout',
    ],
    hotItems: 'Rare commissioned vehicles and bespoke jewellery — highest single-item payouts in the game.',
    tip: 'Randy is the ceiling. 80–92% on commissioned items beats every flat-rate fence. Keep an active commission at all times — even a mid-tier one pays better than Tyrone. Check the Wish List every 48 hours; rare items cycle out.',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const tierConfig: Record<PayoutTier, { label: string; color: string; barColor: string; barWidth: string }> = {
  low:        { label: 'Low',        color: 'border-white/15 bg-white/[0.04] text-white/40',           barColor: 'bg-white/25',         barWidth: 'w-[20%]' },
  mid:        { label: 'Mid',        color: 'border-[#72dce8]/25 bg-[#72dce8]/[0.07] text-[#72dce8]',  barColor: 'bg-[#72dce8]/60',     barWidth: 'w-[45%]' },
  high:       { label: 'High',       color: 'border-[#ffd27a]/30 bg-[#ffd27a]/[0.08] text-[#ffd27a]',  barColor: 'bg-[#ffd27a]/70',     barWidth: 'w-[65%]' },
  premium:    { label: 'Premium',    color: 'border-[#ff79a8]/35 bg-[#ff79a8]/[0.09] text-[#ff9bb5]',  barColor: 'bg-[#ff79a8]/70',     barWidth: 'w-[82%]' },
  commission: { label: 'Commission', color: 'border-emerald-500/35 bg-emerald-900/20 text-emerald-300', barColor: 'bg-emerald-400/70',   barWidth: 'w-full'  },
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FenceDirectory() {
  const [chFilter, setChFilter] = useState<'all' | 1 | 2 | 3>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const visible = FENCES.filter(f =>
    chFilter === 'all' || f.chapterUnlock <= chFilter
  )

  const CH_FILTERS: { key: 'all' | 1 | 2 | 3; label: string }[] = [
    { key: 'all', label: 'All Fences' },
    { key: 1,     label: 'Available Ch1' },
    { key: 2,     label: 'Available Ch2' },
    { key: 3,     label: 'Available Ch3+' },
  ]

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-7 sm:px-6 sm:py-9">

      {/* Header */}
      <div className="rounded-xl border border-white/[0.07] bg-[#11121d]/60 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ffd27a]">Fence Directory</p>
        <p className="mt-1 text-sm text-white/50 leading-relaxed">
          Every fence in the game — what they buy, what they pay, and what makes them worth the detour.
          Filter by chapter to see what's accessible at your current point.
        </p>
      </div>

      {/* Payout tier legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(tierConfig) as [PayoutTier, typeof tierConfig[PayoutTier]][]).map(([tier, cfg]) => (
          <span key={tier} className={clsx('flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]', cfg.color)}>
            <span className={clsx('h-1.5 w-6 rounded-full', cfg.barColor, cfg.barWidth === 'w-full' ? 'w-6' : '')} />
            {cfg.label}
          </span>
        ))}
        <span className="text-[9px] text-white/25 self-center">— payout tier</span>
      </div>

      {/* Chapter filter */}
      <div className="flex flex-wrap gap-1.5">
        {CH_FILTERS.map(f => (
          <button
            key={String(f.key)}
            onClick={() => setChFilter(f.key)}
            className={clsx(
              'rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition',
              chFilter === f.key
                ? 'border-[#ff79a8]/50 bg-[#ff79a8]/10 text-[#ff9bb5]'
                : 'border-white/10 bg-white/[0.03] text-white/35 hover:text-white/55',
            )}
          >{f.label}</button>
        ))}
      </div>

      {/* Fence cards */}
      <div className="flex flex-col gap-3">
        {visible.map(fence => {
          const cfg = tierConfig[fence.payoutTier]
          const isExpand = expanded === fence.id

          return (
            <article
              key={fence.id}
              className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#11121d]/90 transition duration-200 hover:border-white/[0.14]"
            >
              {/* Header row */}
              <button
                onClick={() => setExpanded(isExpand ? null : fence.id)}
                aria-expanded={isExpand}
                className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-white/[0.02] sm:px-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <ShoppingBag size={16} className="text-white/40" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-bold text-white">{fence.name}</span>
                    <span className={clsx('rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em]', cfg.color)}>
                      {cfg.label}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/30">
                      Ch{fence.chapterUnlock}+
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-white/35 mt-0.5">
                    <MapPin size={9} className="text-white/20" />{fence.location}
                  </span>
                </div>

                {/* Payout bar visual */}
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                  <span className="text-[9px] text-white/25 uppercase tracking-[0.12em]">Payout</span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.08]">
                    <div className={clsx('h-full rounded-full', cfg.barColor, cfg.barWidth)} />
                  </div>
                  <span className={clsx('text-[9px] font-bold', cfg.color.split(' ').find(c => c.startsWith('text-')))}>
                    {fence.payoutTier === 'commission' ? '80–92%' : fence.accepts[0]?.rate}
                  </span>
                </div>

                <Star
                  size={14}
                  className={clsx(
                    'mt-1 shrink-0 transition-transform duration-200',
                    isExpand ? 'rotate-180 text-[#ff79a8]' : 'text-white/20',
                  )}
                />
              </button>

              {/* Expanded detail */}
              {isExpand && (
                <div className="border-t border-white/[0.07] bg-black/15">
                  {fence.unlockNote && (
                    <div className="flex items-start gap-2 border-b border-amber-500/15 bg-amber-900/[0.1] px-4 py-2.5 sm:px-5">
                      <Lock size={11} className="mt-0.5 shrink-0 text-amber-400/60" />
                      <p className="text-[11px] text-amber-300/70">{fence.unlockNote}</p>
                    </div>
                  )}

                  <div className="grid gap-px bg-white/[0.055] sm:grid-cols-3">
                    {/* Accepts + rates */}
                    <div className="bg-[#0e0f1b] px-4 py-4 sm:px-5">
                      <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#72dce8]/60">Accepts & Rates</p>
                      <div className="flex flex-col gap-2">
                        {fence.accepts.map((cat, i) => (
                          <div key={i} className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-white/50">{cat.label}</span>
                            <span className={clsx(
                              'shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold',
                              cat.rate === 'N/A'
                                ? 'border-white/10 text-white/25'
                                : 'border-emerald-500/30 bg-emerald-900/20 text-emerald-300',
                            )}>{cat.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special features */}
                    <div className="bg-[#0e0f1b] px-4 py-4 sm:px-5">
                      <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#ffd27a]/60">Special Features</p>
                      <ul className="flex flex-col gap-1.5">
                        {fence.specialFeatures.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] text-white/50">
                            <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffd27a]/35" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Hot items + tip */}
                    <div className="bg-[#0e0f1b] px-4 py-4 sm:px-5">
                      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#ff79a8]/60">Best Items to Sell Here</p>
                      <p className="mb-3.5 text-[11px] leading-relaxed text-white/50">{fence.hotItems}</p>
                      <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30 mb-1">Tip</p>
                        <p className="text-[11px] leading-relaxed text-white/45">{fence.tip}</p>
                      </div>
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
