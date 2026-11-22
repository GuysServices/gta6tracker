'use client'

import { useState } from 'react'
import { ChevronDown, AlertTriangle, Key, DollarSign, MapPin, Skull, Archive, Clock } from 'lucide-react'
import clsx from 'clsx'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChapterData {
  id: string
  number: number
  name: string
  subtitle: string
  protagonist: 'lucia' | 'jason' | 'both'
  missionCount: number
  area: string
  pointOfNoReturn: string
  ponrNote: string
  missables: { item: string; note: string }[]
  keyUnlocks: string[]
  moneyTips: string[]
  lose: string[]
  keep: string[]
  storyPayout?: string
  requiresAmount?: string
}

// ─── Chapter Data ─────────────────────────────────────────────────────────────

const CHAPTERS: ChapterData[] = [
  {
    id: 'ch1',
    number: 1,
    name: 'Just Like Paradise',
    subtitle: 'The Leonida Keys. Jason runs with Donnie and Cal.',
    protagonist: 'both',
    missionCount: 21,
    area: 'Leonida Keys · Key Lento',
    pointOfNoReturn: 'Tourist Trap — "Take Up Mattia\'s Offer"',
    ponrNote: 'Once you accept, you lose pocket cash, floor stash, BuckMe checking balance, Jason\'s house, and all fitness gains. Put $5k in Family Savings FIRST.',
    missables: [
      { item: 'Get Shirley\'s Rum', note: 'Missable side errand — appears only in Ch1. Shirley\'s outside the bait shop after Gone Fishing.' },
      { item: 'Steal the Scooter', note: 'Short optional job for Cal. Miss it and it doesn\'t come back.' },
      { item: 'Balcony meditation (trophy)', note: 'Sit in the chair on Jason\'s balcony at dawn. Unlocks a trophy/achievement — only available while you own the house.' },
      { item: 'Donnie\'s H&L .38 (Don Gone)', note: 'During "Don Gone" check the trunk of Donnie\'s car before leaving — unique pistol, not found elsewhere.' },
      { item: 'Mandy\'s cigar (Pipework)', note: 'Inside the trailer during Pipework. Take it off the table before the cutscene ends.' },
      { item: 'Camp trailer cash (Gone Fishing)', note: 'Open the Kingfisher camp trailer near the unload point — loose cash on the shelf, gone after the mission.' },
      { item: 'Lucia\'s 5 errands', note: 'Five short optional tasks for Lucia before Tourist Trap. All are brief; completing all five unlocks a Ch3 contact.' },
      { item: 'Jason\'s house repairs', note: 'Three cheap repairs (kitchen, porch, roof) that permanently raise resale value and add stash space. Must be done before Tourist Trap.' },
    ],
    keyUnlocks: [
      'BuckMe bank app — deposit/withdraw from anywhere',
      'Coastal Auto Care mod shop — first vehicle customization',
      'Police scanner app — 90-second early-warning on wanted level',
      'Brian\'s lockup fence — sell stolen goods, low rates but always available',
      'Kenton\'s treasure dives — underwater loot spots on the Keys coast',
      'First meditation spot — fitness mechanic introduction',
    ],
    moneyTips: [
      'Deposit exactly $5,000 into Family Savings BEFORE Tourist Trap — that\'s the carry limit and it transfers to Ch2.',
      'Sell your duplicate weapons to Brian before the chapter ends — they convert to cash, not carry forward.',
      'Check every trailer and boat shack for loose cash. The Keys have the highest density of lootable environments in the game.',
      'Do NOT upgrade Jason\'s Ganado — you lose the car at chapter end. Full waste.',
    ],
    lose: ['Pocket cash (above $5k Family Savings)', 'BuckMe checking balance', 'Floor stash at Jason\'s house', 'Jason\'s house itself', 'All fitness gains', 'Jason\'s personal vehicle garage'],
    keep: ['Family Savings (up to $5,000)', 'Unique/quest weapons', 'Clothing', 'Phone contacts'],
  },
  {
    id: 'ch2',
    number: 2,
    name: 'Paradise Lost',
    subtitle: 'Starlet Motel. The mainland begins.',
    protagonist: 'both',
    missionCount: 11,
    area: 'Starlet Motel · Port Gellhorn · Kelly County',
    pointOfNoReturn: 'Checking Out — "Move to Vice City"',
    ponrNote: 'Requires $15,000 to trigger the finale. Farm cars or hit the optional robberies first. Starlet Motel as a base disappears after this.',
    requiresAmount: '$15,000 to unlock the finale mission',
    missables: [
      { item: 'McKittrick Farm questline', note: 'Three-part optional chain in Kelly County. Miss any step and the whole questline locks. Start by talking to Earl outside the feed store.' },
      { item: 'Thrillbillies intro (Mud Club)', note: 'Visit Mud Club after Gear Shift and speak to Billy before the chapter finale. This unlocks them as Ch3 contacts — skip it and they\'re gone.' },
      { item: 'Avery Pawn robbery (optional)', note: 'Marked on the map at the start of Ch2. Gives $4,200 — worth hitting before Checking Out.' },
      { item: 'Kingpin Bowling robbery (optional)', note: 'Time-limited optional. Rewards the unique Gutterball Moreland 850 shotgun — only way to get it.' },
    ],
    keyUnlocks: [
      'Moses fence — Slim Jim, car registration, full Scooter Bros network',
      'Dunk fence — better rates than Brian\'s, takes hot vehicles',
      'Port Gellhorn garage — first full-service garage on the mainland',
      'Coffee Break — free character switching between Lucia and Jason',
      'RydeMe taxi network — fast travel across Kelly County and Port Gellhorn',
    ],
    moneyTips: [
      'Selling stolen cars through Moses is the fastest money in Ch2. Register them to prevent tracking.',
      'Avery Pawn and Kingpin Bowling are both quick — do both before the finale.',
      'The $15k requirement isn\'t a gate on earning — you can exceed it. Overage carries into Ch3.',
      'Unique weapon from Kingpin Bowling: Gutterball Moreland 850 shotgun. Take it even if you don\'t need a shotgun — it\'s a keeper.',
    ],
    lose: ['Starlet Motel as a base', 'Some Kelly County-exclusive fences', 'McKittrick questline (if skipped)'],
    keep: ['All money', 'Registered vehicles (via Moses)', 'Weapons', 'Phone contacts'],
  },
  {
    id: 'ch3',
    number: 3,
    name: 'Tits Ass Drug Money',
    subtitle: 'Vice City. The cartel job. Everything escalates.',
    protagonist: 'both',
    missionCount: 26,
    area: 'Bayside Apartment · Vice City · Ocean Drive',
    pointOfNoReturn: 'The Cartel Heist',
    ponrNote: 'Money, guns, and cars all carry forward. No significant permanent losses. This is the longest chapter — pace your spend.',
    storyPayout: '$120,000 story payout at end of Ch3',
    missables: [
      { item: 'Race Against Yago', note: 'Time-sensitive street race. Available for a 48-hour window after first contact — do it immediately when it appears.' },
      { item: 'Monty\'s 1992 Pistol (The Missing Link)', note: 'During "The Missing Link" — pick up the pistol from the desk in the second room before leaving. It\'s the only copy.' },
      { item: 'Dubious Provenance Part 3', note: 'Three-part optional art theft chain. For Part 3 you must choose "trust Halifax" — the other choice locks the payout permanently.' },
    ],
    keyUnlocks: [
      'Tyrone fence — highest-paying general fence in the game',
      'Yasmani fence — specializes in electronics and luxury goods',
      'Randy fence — Wish List system (commission-based custom theft)',
      'Key Cloner — clone car keys, enables stealing locked vehicles silently',
      'Snap Gun — bypasses most padlocks and deadbolts',
      'Dye pack jammer — nullifies bank dye pack traps',
      'Cut-off tool — opens security cages and steel-reinforced compartments',
      'Bank robberies unlocked (last third of chapter)',
      'Jewelry store robberies unlocked',
      'Payday loan office robberies unlocked',
    ],
    moneyTips: [
      'Randy\'s Wish List is the highest-margin theft method in the game — always have an active commission.',
      'The $120k story payout hits at chapter end. Don\'t blow your reserves before then — you\'ll flush the chapter ahead of budget.',
      'Bank and jewelry robberies take planning. Each has a scout mission — do the scout before you approach.',
      'Yasmani pays 40% more than Moses for electronics. Route your phone/tablet thefts to him.',
    ],
    lose: ['Nothing significant'],
    keep: ['All money', 'All weapons', 'All registered vehicles', 'All tools'],
  },
  {
    id: 'ch4',
    number: 4,
    name: 'Vice City, Baby',
    subtitle: 'Y Hotel. Ocean Beach. The long game.',
    protagonist: 'both',
    missionCount: 25,
    area: 'Y Hotel · Ocean Beach · Vice City proper',
    pointOfNoReturn: 'Making Gainz → VCIA Takedown (can\'t be seen together)',
    ponrNote: 'Multiple endings. Make a MANUAL SAVE before the last mission — the game\'s autosave doesn\'t give you a revert point here.',
    missables: [
      { item: 'This Is a Free Call From… (Lucia-only)', note: 'Time-sensitive. Play as Lucia within 20 minutes of the trigger call or the mission disappears permanently.' },
      { item: 'That\'s Where The Money Is (bank robbery intro)', note: 'Up to $205k available but requires pre-mission scouting. The intro window closes after a certain story beat — do the scout early.' },
      { item: 'Pay Abe\'s Fee (Lawyer Up)', note: 'Not missable, but you need cash available on demand. If you\'re broke when this triggers, you stall the storyline.' },
    ],
    keyUnlocks: [
      'BuckMe Black account — $2,000,000 balance ceiling (up from $500k)',
      'Pilot Pete\'s cargo flights — smuggling route side income',
      'Bank vault robberies — highest single-score jobs in the game',
      'Lawyer Abe — legal buffer that reduces wanted-level escalation speed',
      'Vice City penthouse access (story progression)',
    ],
    moneyTips: [
      'BuckMe Black raises your ceiling to $2m. If you\'ve been depositing, you\'ve already been capped — the upgrade is automatic but costs $50k to activate.',
      'Pilot Pete\'s cargo flights pay $8k–$22k per run depending on cargo. Low-risk, run them between missions.',
      'Bank vault jobs require a crew cut — don\'t go in with randoms if you can recruit your own.',
      'Save before the finale. Seriously. The choice at the end is permanent and affects a Ch5 cutscene.',
    ],
    lose: ['Depends on ending choice'],
    keep: ['All money', 'All weapons', 'BuckMe Black account', 'All registered vehicles'],
  },
  {
    id: 'ch5',
    number: 5,
    name: 'Top of the World, Ma',
    subtitle: 'The final act. Everything comes due.',
    protagonist: 'both',
    missionCount: 7,
    area: 'Vice City · Final locations',
    pointOfNoReturn: 'The End of the Road (final mission)',
    ponrNote: 'No major resource loss in this chapter. This is the resolution. The only thing to do before the finale: spend your money.',
    missables: [
      { item: 'No major missables in Ch5', note: 'The chapter is short and linear. All significant missables occur in earlier chapters.' },
    ],
    keyUnlocks: [
      'Post-game free-roam unlocks after the finale',
      'All story collectibles become trackable on the map',
      'Final weapon variants unlock at Randy\'s',
    ],
    moneyTips: [
      'No floor on spending in Ch5. If you want a property, buy it now — post-game income slows significantly.',
      'Vinny\'s final offer is a fixed price — don\'t try to negotiate.',
      'Abe\'s legal fee for the finale is deducted automatically. Have at least $80k liquid.',
    ],
    lose: ['Nothing — post-game retains all assets'],
    keep: ['Everything'],
  },
]

// ─── Section Components ───────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div className={clsx('mb-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]', color)}>
      <Icon size={10} />
      {label}
    </div>
  )
}

function Tag({ children, color = 'default' }: { children: React.ReactNode; color?: 'red' | 'cyan' | 'gold' | 'green' | 'default' }) {
  const styles = {
    red: 'border-rose-500/30 bg-rose-900/20 text-rose-300',
    cyan: 'border-[#72dce8]/25 bg-[#72dce8]/[0.08] text-[#72dce8]',
    gold: 'border-[#ffd27a]/25 bg-[#ffd27a]/[0.08] text-[#ffd27a]',
    green: 'border-emerald-500/25 bg-emerald-900/20 text-emerald-300',
    default: 'border-white/10 bg-white/[0.04] text-white/50',
  }[color]
  return (
    <span className={clsx('inline-block rounded border px-1.5 py-0.5 text-[10px]', styles)}>
      {children}
    </span>
  )
}

// ─── Individual Chapter Panel ─────────────────────────────────────────────────

function ChapterPanel({ chapter }: { chapter: ChapterData }) {
  const [open, setOpen] = useState(false)

  const accentColors = {
    lucia: { border: 'border-[#ff79a8]/40', glow: 'shadow-[0_0_30px_rgba(255,121,168,.05)]', num: 'border-l-[#ff79a8] text-[#ff9bb5]', label: 'Lucia' },
    jason: { border: 'border-[#72dce8]/30', glow: 'shadow-[0_0_30px_rgba(114,220,232,.04)]', num: 'border-l-[#72dce8] text-[#8ce7ee]', label: 'Jason' },
    both:  { border: 'border-[#ffd27a]/25', glow: 'shadow-[0_0_30px_rgba(255,210,122,.03)]', num: 'border-l-[#ffd27a] text-[#ffdc9b]', label: 'Lucia + Jason' },
  }[chapter.protagonist]

  return (
    <article className={clsx(
      'overflow-hidden rounded-2xl border bg-[#11121d]/90 shadow-[0_12px_45px_rgba(0,0,0,.14)] transition duration-300',
      open ? accentColors.border + ' ' + accentColors.glow : 'border-white/[0.085] hover:border-white/[0.14]',
    )}>
      {/* ── Header ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-white/[0.025] sm:gap-4 sm:px-5"
      >
        <div className={clsx(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-l-[3px] bg-gradient-to-br from-white/[0.07] to-white/[0.015] font-display text-xl font-bold shadow-inner sm:h-12 sm:w-12',
          accentColors.num,
        )}>
          {String(chapter.number).padStart(2, '0')}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="font-display text-lg font-bold tracking-wide text-white sm:text-xl">{chapter.name}</h2>
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/40">
              {accentColors.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/40">{chapter.subtitle}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-[10px] text-white/35">
              <MapPin size={9} className="text-white/25" />
              {chapter.area}
            </span>
            <span className="text-[10px] text-white/25">·</span>
            <span className="flex items-center gap-1 text-[10px] text-white/35">
              <Clock size={9} className="text-white/25" />
              {chapter.missionCount} missions
            </span>
            {chapter.requiresAmount && (
              <>
                <span className="text-[10px] text-white/25">·</span>
                <span className="flex items-center gap-1 text-[10px] text-[#ffd27a]/70">
                  <DollarSign size={9} />
                  Requires {chapter.requiresAmount}
                </span>
              </>
            )}
            {chapter.storyPayout && (
              <>
                <span className="text-[10px] text-white/25">·</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400/70">
                  <DollarSign size={9} />
                  Payout: {chapter.storyPayout}
                </span>
              </>
            )}
          </div>
        </div>

        <ChevronDown
          size={16}
          className={clsx('mt-1 shrink-0 text-white/30 transition-transform duration-300', open && 'rotate-180 text-[#ff79a8]')}
        />
      </button>

      {/* ── Expanded Content ── */}
      {open && (
        <div className="border-t border-white/[0.07] bg-black/20">

          {/* Point of No Return — always first, always prominent */}
          <div className="border-b border-amber-500/20 bg-amber-900/[0.12] px-4 py-3.5 sm:px-5">
            <SectionLabel icon={AlertTriangle} label="Point of No Return" color="text-amber-400" />
            <p className="font-display text-sm font-semibold text-amber-200">{chapter.pointOfNoReturn}</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-200/60">{chapter.ponrNote}</p>
          </div>

          {/* Three-column grid for desktop, stacked on mobile */}
          <div className="grid gap-px bg-white/[0.055] sm:grid-cols-2 lg:grid-cols-3">

            {/* Missables */}
            <div className="bg-[#0e0f1b] px-4 py-4 sm:px-5">
              <SectionLabel icon={Skull} label="Missables" color="text-rose-400" />
              <div className="flex flex-col gap-2.5">
                {chapter.missables.map((m, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-rose-200/80">{m.item}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-white/35">{m.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Unlocks */}
            <div className="bg-[#0e0f1b] px-4 py-4 sm:px-5">
              <SectionLabel icon={Key} label="Key Unlocks" color="text-[#72dce8]" />
              <ul className="flex flex-col gap-1.5">
                {chapter.keyUnlocks.map((u, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-white/50">
                    <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#72dce8]/40" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>

            {/* Money Tips + What You Lose/Keep */}
            <div className="bg-[#0e0f1b] px-4 py-4 sm:col-span-2 sm:px-5 lg:col-span-1">
              <SectionLabel icon={DollarSign} label="Money Tips" color="text-[#ffd27a]" />
              <ul className="mb-4 flex flex-col gap-1.5">
                {chapter.moneyTips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-white/50">
                    <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffd27a]/35" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/[0.06] pt-3">
                <SectionLabel icon={Archive} label="What Carries Over" color="text-white/30" />
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                  <div>
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-rose-400/60">You Lose</p>
                    <div className="flex flex-wrap gap-1">
                      {chapter.lose.map((item, i) => <Tag key={i} color="red">{item}</Tag>)}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#72dce8]/60">You Keep</p>
                    <div className="flex flex-wrap gap-1">
                      {chapter.keep.map((item, i) => <Tag key={i} color="cyan">{item}</Tag>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </article>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ChapterGuide() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-7 sm:px-6 sm:py-9">
      {/* Intro banner */}
      <div className="rounded-xl border border-white/[0.07] bg-[#11121d]/60 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ff79a8]">Chapter Guide</p>
        <p className="mt-1 text-sm text-white/50 leading-relaxed">
          Per-chapter breakdown: missables, key unlocks, money tips, and what transfers when the chapter ends.
          Expand any chapter to see the full detail. Points of no return are always shown first.
        </p>
      </div>

      {CHAPTERS.map(chapter => (
        <ChapterPanel key={chapter.id} chapter={chapter} />
      ))}
    </div>
  )
}
