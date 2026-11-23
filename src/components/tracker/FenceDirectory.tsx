'use client'

import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

type RateLevel = 'best' | 'high' | 'medium' | 'low' | 'very-low' | 'n/a'

interface Fence {
  id: string
  name: string
  realName: string
  location: string
  area: string
  unlockMission: string
  chapter: number
  type: 'goods' | 'vehicles'
  gone: boolean
  goneWhen?: string
  narcotics: RateLevel
  jewelry: RateLevel
  markedBills: RateLevel
  vehicles: RateLevel
  saleMethod: string
  tip: string
  accentColor: string
}

const FENCES: Fence[] = [
  {
    id: 'brian',
    name: "Brian's Lockup",
    realName: 'Brian',
    location: 'South Key Lento',
    area: 'Leonida Keys',
    unlockMission: 'Lab Fees — Ch. 1 mission 2',
    chapter: 1,
    type: 'goods',
    gone: true,
    goneWhen: 'Mostly unavailable after Chapter 1 ends (Tourist Trap)',
    narcotics: 'low',
    jewelry: 'low',
    markedBills: 'very-low',
    vehicles: 'n/a',
    saleMethod: 'Drop box — partner drives off, payment arrives later in BuckMe',
    tip: 'First fence in the game. Very low rates but always open in Ch. 1. Sell anything you have before Tourist Trap — fencing access gets complicated in Ch. 2 until Dunk unlocks.',
    accentColor: '#72dce8',
  },
  {
    id: 'donnie',
    name: "Donnie's Trailer",
    realName: 'Donnie',
    location: 'North Key Lento (opposite Nifty Threads Island Wear)',
    area: 'Leonida Keys',
    unlockMission: 'Clean Up After Donnie — Ch. 1',
    chapter: 1,
    type: 'goods',
    gone: true,
    goneWhen: 'Gone after Don Gone mission — Donnie disappears in Ch. 1',
    narcotics: 'low',
    jewelry: 'low',
    markedBills: 'very-low',
    vehicles: 'n/a',
    saleMethod: 'Drop box — payment delayed',
    tip: 'Short-lived fence. Use him early Ch. 1 for the first batch of narcotics. REMEMBER: grab his H&L .38 pistol from his car boot during Don Gone before you destroy the car or it\'s gone forever.',
    accentColor: '#ff79a8',
  },
  {
    id: 'moses',
    name: "Moses Auto Shop (Mo Watkins)",
    realName: 'Moses',
    location: 'Port Gellhorn (near Port Gellhorn Station Garage)',
    area: 'Kelly County',
    unlockMission: 'Moses — Ch. 2 (Take a Vehicle to Moses)',
    chapter: 2,
    type: 'vehicles',
    gone: false,
    narcotics: 'n/a',
    jewelry: 'n/a',
    markedBills: 'n/a',
    vehicles: 'medium',
    saleMethod: 'In-person. Bring stolen car to Moses. Must be untracked (use WAINK app to scan). First registration free, then small fee per car.',
    tip: 'Cars without trackers only. Scan every car with the WAINK app before driving to Moses. The Slim Jim unlocks here too — open doors without breaking glass. Sell consistent daily earners for the fastest Ch. 2 income.',
    accentColor: '#4ade80',
  },
  {
    id: 'dunk',
    name: "Dunk's Trailer",
    realName: 'Dunk',
    location: 'South Port Gellhorn, Kelly County',
    area: 'Kelly County',
    unlockMission: 'Slam Dunk — Ch. 2 mission 12',
    chapter: 2,
    type: 'goods',
    gone: false,
    narcotics: 'low',
    jewelry: 'low',
    markedBills: 'very-low',
    vehicles: 'n/a',
    saleMethod: 'Drop box — partner delivers, payment arrives in BuckMe account',
    tip: 'First goods fence in Ch. 2. Low rates across the board — use him only while waiting for Ch. 3 fences to unlock. He also marks two optional robbery locations after Slam Dunk.',
    accentColor: '#ffd27a',
  },
  {
    id: 'tyrone',
    name: "Tyrone — La Perle",
    realName: 'Tyrone',
    location: 'La Perle, Vice City',
    area: 'Vice City',
    unlockMission: 'Here, Kitty Kitty — Ch. 3 mission 5',
    chapter: 3,
    type: 'goods',
    gone: false,
    narcotics: 'best',
    jewelry: 'medium',
    markedBills: 'medium',
    vehicles: 'n/a',
    saleMethod: 'In-person or through Garage drop-off (after Yasmani\'s Payday Loan jobs in Ch. 3)',
    tip: 'BEST fence for narcotics from Ch. 3 onward. All 39 Gang Operations drop narcotics. Stack gang op runs and sell the whole bag to Tyrone for maximum payout. Leave narcotics in your garage for his pickup service.',
    accentColor: '#ff9bb5',
  },
  {
    id: 'yasmani',
    name: "Yasmani — Little Cuba",
    realName: 'Yasmani',
    location: 'Little Cuba, Vice City',
    area: 'Vice City',
    unlockMission: 'Boobie Time — Ch. 3 mission 8',
    chapter: 3,
    type: 'goods',
    gone: false,
    narcotics: 'medium',
    jewelry: 'best',
    markedBills: 'best',
    vehicles: 'n/a',
    saleMethod: 'In-person or Garage drop-off. Also tips on armored truck routes for $10,000.',
    tip: 'BEST fence for jewelry and marked bills. Jewelry stores open through his jobs. Bank vaults pay in marked bills — launder everything through Yasmani. His two Payday Loan jobs unlock the Garage drop-off service. The Dye Pack Jammer (Ch. 3, Credit Check) must be obtained before he\'ll accept marked bills.',
    accentColor: '#d5a6ff',
  },
  {
    id: 'randy',
    name: "Randy — Balsero, Vice City",
    realName: 'Randy Kozlov',
    location: 'Balsero district, Vice City',
    area: 'Vice City',
    unlockMission: 'Clonin\' Keys, Makin\' GS (Steal the Zorrusso for Randy) — Ch. 3',
    chapter: 3,
    type: 'vehicles',
    gone: false,
    narcotics: 'n/a',
    jewelry: 'n/a',
    markedBills: 'n/a',
    vehicles: 'best',
    saleMethod: 'Deliver specific cars from his 22-vehicle Wish List. Each delivery earns cash + rewards.',
    tip: 'BEST payout for high-end tracked vehicles. The Key Cloner (Ch. 3) is required for most of his wishlist cars. Randy also takes cars that Moses won\'t touch (advanced tracker cars). Complete his Wish List for the highest vehicle income in the game.',
    accentColor: '#f97316',
  },
]

const RATE_META: Record<RateLevel, { label: string; color: string; bg: string }> = {
  'best':     { label: 'BEST',     color: '#4ade80', bg: '#4ade8018' },
  'high':     { label: 'High',     color: '#72dce8', bg: '#72dce818' },
  'medium':   { label: 'Medium',   color: '#ffd27a', bg: '#ffd27a18' },
  'low':      { label: 'Low',      color: '#f97316', bg: '#f9731618' },
  'very-low': { label: 'Very Low', color: '#ff79a8', bg: '#ff79a818' },
  'n/a':      { label: '—',        color: '#ffffff30', bg: 'transparent' },
}

function RateBadge({ rate }: { rate: RateLevel }) {
  const m = RATE_META[rate]
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em]"
      style={{ color: m.color, background: m.bg, border: `0.5px solid ${m.color}30` }}
    >
      {m.label}
    </span>
  )
}

export default function FenceDirectory() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">

      {/* Header */}
      <div className="mb-7">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff79a8]">Black Market</p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">Fence Directory</h2>
        <p className="mt-1.5 text-xs text-white/40">All 7 fences — who pays best for what, when they unlock, and how to sell.</p>
      </div>

      {/* Quick reference */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11121d]/90">
        <div className="border-b border-white/[0.07] px-5 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">Quick Reference — Best Rates</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-white/[0.07]">
          {[
            { label: 'Narcotics', value: 'Tyrone', sub: 'La Perle, Ch. 3', color: '#ff9bb5' },
            { label: 'Jewelry + Marked Bills', value: 'Yasmani', sub: 'Little Cuba, Ch. 3', color: '#d5a6ff' },
            { label: 'Cars', value: 'Randy', sub: 'Balsero, Ch. 3', color: '#f97316' },
          ].map(r => (
            <div key={r.label} className="px-4 py-3 text-center">
              <p className="mb-0.5 text-[8px] uppercase tracking-[0.1em] text-white/30">{r.label}</p>
              <p className="text-sm font-bold" style={{ color: r.color }}>{r.value}</p>
              <p className="text-[9px] text-white/30">{r.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How marked bills work */}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-4 py-3">
        <span className="text-sm">⚠️</span>
        <p className="text-xs leading-5 text-[#ffdc9b]/80">
          <strong>Marked Bills:</strong> Banks and Payday Loans pay out in marked bills — but no fence accepts them until you get the <strong>Dye Pack Jammer</strong>. That unlocks in Ch. 3 mission <em>Credit Check</em>. Without it, bills trigger a dye explosion and stain your clothes.
        </p>
      </div>

      {/* Fence cards */}
      <div className="flex flex-col gap-3">
        {FENCES.map(f => {
          const isOpen = expanded === f.id
          return (
            <article key={f.id} className={clsx(
              'overflow-hidden rounded-2xl border transition',
              f.gone ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-white/[0.08] bg-[#11121d]/90'
            )}>
              <button
                onClick={() => setExpanded(isOpen ? null : f.id)}
                className="flex w-full items-start gap-3 px-5 py-4 text-left"
              >
                <div
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: f.accentColor }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white/90">{f.name}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]"
                      style={{ color: f.accentColor, background: `${f.accentColor}18`, border: `0.5px solid ${f.accentColor}40` }}
                    >
                      Ch. {f.chapter}
                    </span>
                    {f.gone && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-red-400">
                        Limited
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/40">{f.location}</p>
                </div>
                <div className="shrink-0">
                  <span className="text-[9px] text-white/30 uppercase tracking-[0.08em]">
                    {f.type === 'vehicles' ? 'Cars' : 'Goods'}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={13} className="shrink-0 mt-1 text-white/30" /> : <ChevronDown size={13} className="shrink-0 mt-1 text-white/30" />}
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.07] bg-black/15 px-5 pb-4 pt-3 space-y-3">

                  {f.gone && f.goneWhen && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-3 py-2">
                      <p className="text-[11px] text-red-400">⚠️ {f.goneWhen}</p>
                    </div>
                  )}

                  {/* Unlock */}
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                    <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white/30">Unlocks After</p>
                    <p className="text-xs text-white/70">{f.unlockMission}</p>
                  </div>

                  {/* Rate table */}
                  {f.type === 'goods' && (
                    <div>
                      <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.1em] text-white/30">Payout Rates</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Narcotics', rate: f.narcotics },
                          { label: 'Jewelry', rate: f.jewelry },
                          { label: 'Marked Bills', rate: f.markedBills },
                        ].map(r => (
                          <div key={r.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-2 text-center">
                            <p className="mb-1 text-[8px] text-white/30">{r.label}</p>
                            <RateBadge rate={r.rate as RateLevel} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {f.type === 'vehicles' && (
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center">
                      <p className="mb-1 text-[8px] text-white/30">Vehicles</p>
                      <RateBadge rate={f.vehicles} />
                    </div>
                  )}

                  {/* Sale method */}
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                    <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white/30">How to Sell</p>
                    <p className="text-[11px] leading-5 text-white/65">{f.saleMethod}</p>
                  </div>

                  {/* Tip */}
                  <div className="flex items-start gap-2 rounded-xl border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-3 py-2.5">
                    <span className="text-sm">💡</span>
                    <p className="text-[11px] leading-5 text-[#ffdc9b]/80">{f.tip}</p>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <a
        href="https://www.keengamer.com/articles/guides/how-to-fence-stolen-goods-in-gta-6-all-fence-locations-and-marked-bills/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-xs text-white/40 transition hover:bg-white/[0.06] hover:text-white/70"
      >
        <ExternalLink size={12} />
        Full Fence Guide + Marked Bills (KeenGamer)
      </a>

      <p className="mt-5 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Source: KeenGamer · PowerPyx · Bloxodes · November 2026
      </p>
    </div>
  )
}
