'use client'

import { useState } from 'react'
import { Copy, Check, Zap, Shield, Crosshair, Car, Cloud, Trophy, AlertCircle, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = 'health' | 'weapons' | 'wanted' | 'vehicles' | 'world' | 'character'

interface Cheat {
  id: string
  name: string
  category: Category
  code: string          // phone number format
  effect: string
  storyFree: boolean    // usable without any story progress
  storyNote?: string    // if not story-free, what's required
  stackable?: string    // if it stacks (e.g. slow-mo x5)
  disablesAchievements: boolean
  tip?: string
}

// ─── Cheat Database ───────────────────────────────────────────────────────────
// Entered via in-game phone keypad — open phone, dial number, call.
// Note: Codes sourced from community reporting. Verify in-game before relying on them.

const CHEATS: Cheat[] = [
  // ── HEALTH ────────────────────────────────────────────────────────────────
  {
    id: 'restore-health',
    name: 'Restore Health',
    category: 'health',
    code: '1-999-482-753',
    effect: 'Fully restores current character health to max.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Usable mid-combat. Doesn\'t restore armour — use Max Health + Armour if you need both.',
  },
  {
    id: 'max-health-armour',
    name: 'Max Health + Armour',
    category: 'health',
    code: '1-999-887-853',
    effect: 'Fully restores health AND armour to maximum.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Preferred over Restore Health in any firefight. Same cooldown, twice the value.',
  },
  {
    id: 'invincibility',
    name: 'Invincibility (5 min)',
    category: 'health',
    code: '1-999-724-862',
    effect: 'Grants invincibility for 5 real-world minutes. Expires automatically — re-enter to extend.',
    storyFree: true,
    disablesAchievements: true,
    stackable: 'Re-entering resets the 5-minute timer, effectively extending indefinitely.',
    tip: 'The 5-minute limit is real-time, not in-game time. Set a timer on your phone if you\'re using it for a long grind.',
  },
  {
    id: 'recharge-special',
    name: 'Recharge Special Ability',
    category: 'health',
    code: '1-999-769-3787',
    effect: "Fully recharges the active character's special ability.",
    storyFree: false,
    storyNote: 'Requires both Lucia and Jason to be unlocked (Coffee Break, Ch2). Only works once Coffee Break is active.',
    disablesAchievements: true,
    tip: 'More useful once you\'ve upgraded the special ability via fitness/activities. Early game it\'s a minor boost.',
  },

  // ── WEAPONS ───────────────────────────────────────────────────────────────
  {
    id: 'weapons-1',
    name: 'Weapon Set 1 — Sidearms',
    category: 'weapons',
    code: '1-999-866-587',
    effect: 'Grants pistol, SMG, combat shotgun, and knife with ammo.',
    storyFree: true,
    disablesAchievements: true,
  },
  {
    id: 'weapons-2',
    name: 'Weapon Set 2 — Rifles',
    category: 'weapons',
    code: '1-999-423-682',
    effect: 'Grants assault rifle, carbine rifle, and sniper rifle with ammo.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'The sniper in this set has a fixed scope. If you\'ve already upgraded your sniper in-game, don\'t use this — it replaces attachments.',
  },
  {
    id: 'weapons-3',
    name: 'Weapon Set 3 — Heavy',
    category: 'weapons',
    code: '1-999-752-463',
    effect: 'Grants RPG, minigun, grenade launcher, and flashbangs.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'The minigun in this set depletes fast. Pair with Explosive Ammo if you want sustained chaos.',
  },
  {
    id: 'explosive-ammo',
    name: 'Explosive Ammo Rounds',
    category: 'weapons',
    code: '1-999-444-439',
    effect: 'All bullets fired cause small explosions on impact. Applies to all equipped weapons.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Deactivate before interacting with friendly NPCs or story triggers — it one-shots everything including mission-critical targets.',
  },
  {
    id: 'flaming-bullets',
    name: 'Flaming Bullets',
    category: 'weapons',
    code: '1-999-352-648',
    effect: 'All bullets set targets on fire. Great for vehicle destruction.',
    storyFree: true,
    disablesAchievements: true,
  },
  {
    id: 'explosive-melee',
    name: 'Explosive Melee',
    category: 'weapons',
    code: '1-999-468-842',
    effect: 'Melee hits cause explosive force, sending enemies and objects flying.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Pairs absurdly well with Super Jump — launch into a crowd, one punch, everything flies.',
  },

  // ── WANTED ────────────────────────────────────────────────────────────────
  {
    id: 'clear-wanted',
    name: 'Clear Wanted Level',
    category: 'wanted',
    code: '1-999-529-448',
    effect: 'Immediately drops wanted level to zero regardless of star count.',
    storyFree: true,
    disablesAchievements: false,
    tip: 'One of two cheats that does NOT disable achievements. Usable freely without consequence.',
  },
  {
    id: 'raise-wanted',
    name: 'Raise Wanted Level',
    category: 'wanted',
    code: '1-999-724-548',
    effect: 'Adds one star to your current wanted level each use.',
    storyFree: true,
    disablesAchievements: false,
    tip: 'Also achievement-safe. Use to farm cop-encounter events or test combat against higher wanted levels.',
  },
  {
    id: 'never-wanted',
    name: 'Never Wanted (Timed)',
    category: 'wanted',
    code: '1-999-625-348',
    effect: 'Disables wanted level generation for 10 real-world minutes. Re-enter to extend.',
    storyFree: true,
    disablesAchievements: true,
    stackable: 'Each re-entry resets the 10-minute window.',
    tip: 'Different from Clear Wanted — this prevents new stars from generating. Use when doing fencing runs or collectible hunting in hot areas.',
  },

  // ── VEHICLES ──────────────────────────────────────────────────────────────
  {
    id: 'spawn-sports',
    name: 'Spawn Sports Car',
    category: 'vehicles',
    code: '1-999-776-234',
    effect: 'Spawns a Pegassi Zefato (sports coupe) in front of the player.',
    storyFree: true,
    disablesAchievements: true,
  },
  {
    id: 'spawn-heli',
    name: 'Spawn Helicopter',
    category: 'vehicles',
    code: '1-999-359-285',
    effect: 'Spawns a Maverick helicopter above the player\'s position.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Spawns above you, not at ground level. Make sure you\'re not under a roof. The Maverick is a solid all-rounder but not armoured.',
  },
  {
    id: 'spawn-motorcycle',
    name: 'Spawn Motorcycle',
    category: 'vehicles',
    code: '1-999-468-562',
    effect: 'Spawns a Pegassi Bati 801 motorcycle.',
    storyFree: true,
    disablesAchievements: true,
  },
  {
    id: 'spawn-boat',
    name: 'Spawn Speedboat',
    category: 'vehicles',
    code: '1-999-266-837',
    effect: 'Spawns a Speeder speedboat. Only works near water — spawns at the nearest shoreline.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Must be within ~300m of water or the code has no effect. No error message — it just silently fails.',
  },
  {
    id: 'spawn-military',
    name: 'Spawn Military Truck',
    category: 'vehicles',
    code: '1-999-865-842',
    effect: 'Spawns an armoured military transport truck.',
    storyFree: false,
    storyNote: 'Requires completing at least one VCIA-related mission in Chapter 4 for the military spawn to become available.',
    disablesAchievements: true,
    tip: 'Worth the story gating — the military truck tanks 5-star wanted level far better than any civilian vehicle.',
  },
  {
    id: 'slidey-cars',
    name: 'Slidey Cars',
    category: 'vehicles',
    code: '1-999-754-337',
    effect: 'All vehicles have massively reduced traction — they slide on any surface.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Deactivate with the same code. Deactivates automatically on death or mission start.',
  },

  // ── WORLD ─────────────────────────────────────────────────────────────────
  {
    id: 'change-weather',
    name: 'Change Weather',
    category: 'world',
    code: '1-999-932-273',
    effect: 'Cycles through weather conditions: Clear → Overcast → Rain → Thunder → Fog → Clear.',
    storyFree: true,
    disablesAchievements: false,
    stackable: 'Enter multiple times to cycle to the desired weather state.',
    tip: 'Achievement-safe. Thunder weather makes high-speed driving harder but looks incredible — good for screenshots. Fog reduces cop visibility range significantly.',
  },
  {
    id: 'slow-motion',
    name: 'Slow Motion',
    category: 'world',
    code: '1-999-756-884',
    effect: 'Activates slow motion (approx 50% speed). Stack up to 5× for near-freeze.',
    storyFree: true,
    disablesAchievements: true,
    stackable: 'Enter up to 5 times to stack. 5th entry exits slow motion.',
    tip: 'At 4× stack the game is nearly paused. Good for getting screenshots mid-action.',
  },
  {
    id: 'drunk-mode',
    name: 'Drunk Mode',
    category: 'world',
    code: '1-999-547-861',
    effect: 'Character stumbles, camera sways, and all vehicle handling becomes erratic.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Deactivates on death or time skip. Funniest with Explosive Melee active.',
  },
  {
    id: 'moon-gravity',
    name: 'Moon Gravity',
    category: 'world',
    code: '1-999-356-842',
    effect: 'Massively reduced gravity — vehicles and bodies float on impact or launch.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Vehicles still accelerate normally — a car hit at speed will float into the stratosphere.',
  },
  {
    id: 'skyfall',
    name: 'Skyfall',
    category: 'world',
    code: '1-999-759-532',
    effect: 'Teleports the player high into the sky in freefall. No parachute equipped.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'You will die unless you dial the Parachute code immediately after. The freefall is fast — have the next code ready.',
  },
  {
    id: 'parachute',
    name: 'Give Parachute',
    category: 'world',
    code: '1-999-759-348',
    effect: 'Equips a parachute regardless of current inventory.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Enter while in freefall (from Skyfall or a helicopter jump) to prevent death. Opens normally with the parachute button.',
  },

  // ── CHARACTER ─────────────────────────────────────────────────────────────
  {
    id: 'super-jump',
    name: 'Super Jump',
    category: 'character',
    code: '1-999-468-468',
    effect: 'Massive jump height. Hold jump button for maximum height.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Hold the jump button the entire time — a quick tap gives maybe 3× normal height. Holding for a full second sends you to rooftop level.',
  },
  {
    id: 'fast-run',
    name: 'Fast Run',
    category: 'character',
    code: '1-999-228-253',
    effect: 'Sprint speed increased to approximately 2.5× normal.',
    storyFree: true,
    disablesAchievements: true,
  },
  {
    id: 'fast-swim',
    name: 'Fast Swim',
    category: 'character',
    code: '1-999-468-253',
    effect: 'Swim speed increased to approximately 2.5× normal.',
    storyFree: true,
    disablesAchievements: true,
    tip: 'Pairs well with Kenton\'s dive spots — covers large underwater areas quickly.',
  },
]

// ─── Fastest Unlock Guide ─────────────────────────────────────────────────────

const UNLOCK_GUIDE = [
  {
    cheat: 'Recharge Special Ability',
    minimum: 'Chapter 2 — Coffee Break mission',
    path: [
      'Start a new save and complete Ch1 as fast as possible — do ONLY the main missions, skip everything optional.',
      'At the Ch1 end, make sure you\'ve stashed $5k in Family Savings before Tourist Trap.',
      'In Ch2, ignore side content until Coffee Break triggers after the third main mission.',
      'Coffee Break unlocks character switching — the Recharge Special cheat activates immediately after.',
    ],
    estimatedTime: '2–3 hours of focused play',
  },
  {
    cheat: 'Spawn Military Truck',
    minimum: 'Chapter 4 — first VCIA mission',
    path: [
      'Rush Ch1–Ch3 on main missions only. Ch3 has 26 missions — accept all pacing tips from the game\'s markers.',
      'The Ch3 payout ($120k) funds the Ch4 lawyer fee (Abe). Do NOT waste money in Ch3.',
      'Enter Ch4 and complete the first VCIA-flagged mission — it appears approximately 4–5 missions into the chapter.',
      'Once that mission resolves, the military truck spawn code is live.',
    ],
    estimatedTime: '8–12 hours of focused play',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

type CategoryMeta = { label: string; icon: React.ElementType; color: string }

const CAT_META: Record<Category, CategoryMeta> = {
  health:    { label: 'Health',    icon: Shield,    color: 'text-rose-400' },
  weapons:   { label: 'Weapons',   icon: Crosshair, color: 'text-[#ff79a8]' },
  wanted:    { label: 'Wanted',    icon: AlertCircle, color: 'text-amber-400' },
  vehicles:  { label: 'Vehicles',  icon: Car,       color: 'text-[#72dce8]' },
  world:     { label: 'World',     icon: Cloud,     color: 'text-[#ffd27a]' },
  character: { label: 'Character', icon: Zap,       color: 'text-emerald-400' },
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className={clsx(
        'flex items-center gap-1 rounded border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] transition',
        copied
          ? 'border-emerald-500/40 bg-emerald-900/25 text-emerald-300'
          : 'border-white/15 bg-white/[0.04] text-white/40 hover:border-white/30 hover:text-white/70',
      )}
    >
      {copied ? <Check size={9} /> : <Copy size={9} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CheatCodes() {
  const [catFilter, setCatFilter] = useState<'all' | Category>('all')
  const [storyFreeOnly, setStoryFreeOnly] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const filtered = CHEATS.filter(c => {
    if (catFilter !== 'all' && c.category !== catFilter) return false
    if (storyFreeOnly && !c.storyFree) return false
    return true
  })

  const achievementSafe = filtered.filter(c => !c.disablesAchievements)

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-7 sm:px-6 sm:py-9">

      {/* Header */}
      <div className="rounded-xl border border-white/[0.07] bg-[#11121d]/60 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#72dce8]">Cheat Codes</p>
        <p className="mt-1 text-sm text-white/50 leading-relaxed">
          All known codes entered via the in-game phone keypad — open phone, dial, call.
          Community-sourced: verify each code in-game before relying on it in a session.
        </p>
      </div>

      {/* Achievement warning */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-900/[0.12] px-4 py-3">
        <Trophy size={14} className="mt-0.5 shrink-0 text-amber-400/70" />
        <div>
          <p className="text-xs font-semibold text-amber-300">Most cheats disable achievements for the session</p>
          <p className="mt-0.5 text-[11px] text-amber-200/55">
            Once a cheat is entered, achievements/trophies are locked until you reload a save made BEFORE using cheats.
            Clear Wanted Level and Raise Wanted Level are the only two codes that are achievement-safe.
            If you care about trophies, complete them first.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category filters */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setCatFilter('all')}
            className={clsx(
              'rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition',
              catFilter === 'all'
                ? 'border-[#ff79a8]/50 bg-[#ff79a8]/10 text-[#ff9bb5]'
                : 'border-white/10 bg-white/[0.03] text-white/35 hover:text-white/55',
            )}
          >All</button>
          {(Object.entries(CAT_META) as [Category, CategoryMeta][]).map(([cat, meta]) => {
            const Icon = meta.icon
            return (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={clsx(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition',
                  catFilter === cat
                    ? 'border-[#ff79a8]/50 bg-[#ff79a8]/10 text-[#ff9bb5]'
                    : 'border-white/10 bg-white/[0.03] text-white/35 hover:text-white/55',
                )}
              >
                <Icon size={10} className={catFilter === cat ? '' : meta.color} />
                {meta.label}
              </button>
            )
          })}
        </div>

        {/* Story-free toggle */}
        <button
          onClick={() => setStoryFreeOnly(v => !v)}
          className={clsx(
            'ml-auto flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition',
            storyFreeOnly
              ? 'border-emerald-500/40 bg-emerald-900/20 text-emerald-300'
              : 'border-white/10 bg-white/[0.03] text-white/35 hover:text-white/55',
          )}
        >
          <Zap size={10} />
          No Story Required
        </button>
      </div>

      {/* Count line */}
      <p className="text-[10px] text-white/25">
        Showing {filtered.length} of {CHEATS.length} codes
        {achievementSafe.length > 0 && filtered.some(c => !c.disablesAchievements) &&
          ` · ${filtered.filter(c => !c.disablesAchievements).length} achievement-safe`
        }
      </p>

      {/* Cheat cards */}
      <div className="grid gap-2 sm:grid-cols-2">
        {filtered.map(cheat => {
          const meta = CAT_META[cheat.category]
          const Icon = meta.icon
          return (
            <div
              key={cheat.id}
              className={clsx(
                'rounded-xl border bg-[#11121d]/90 p-4 transition duration-200',
                !cheat.storyFree
                  ? 'border-amber-500/20'
                  : cheat.disablesAchievements
                    ? 'border-white/[0.08]'
                    : 'border-emerald-500/25',
              )}
            >
              {/* Top row */}
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon size={12} className={meta.color} />
                  <span className="text-xs font-semibold text-white">{cheat.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {!cheat.storyFree && (
                    <span className="rounded border border-amber-500/30 bg-amber-900/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-amber-400">
                      Story
                    </span>
                  )}
                  {!cheat.disablesAchievements && (
                    <span className="rounded border border-emerald-500/30 bg-emerald-900/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-emerald-300">
                      ✓ Trophies
                    </span>
                  )}
                </div>
              </div>

              {/* Phone code */}
              <div className="mb-2 flex items-center gap-2">
                <code className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm font-bold tracking-widest text-[#72dce8]">
                  {cheat.code}
                </code>
                <CopyButton code={cheat.code} />
              </div>

              {/* Effect */}
              <p className="text-[11px] leading-relaxed text-white/45">{cheat.effect}</p>

              {/* Stackable note */}
              {cheat.stackable && (
                <p className="mt-1.5 text-[10px] text-[#ffd27a]/60">↺ {cheat.stackable}</p>
              )}

              {/* Story requirement */}
              {!cheat.storyFree && cheat.storyNote && (
                <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-900/[0.1] px-2.5 py-1.5">
                  <p className="text-[10px] text-amber-300/70">{cheat.storyNote}</p>
                </div>
              )}

              {/* Tip */}
              {cheat.tip && (
                <p className="mt-2 border-t border-white/[0.06] pt-2 text-[10px] leading-relaxed text-white/35">
                  {cheat.tip}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Fastest Unlock Guide ── */}
      <div className="mt-2 overflow-hidden rounded-xl border border-[#ff79a8]/20 bg-[#11121d]/80">
        <button
          onClick={() => setShowGuide(v => !v)}
          className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-white/[0.02]"
        >
          <Zap size={14} className="text-[#ff79a8]" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Fastest Unlock Guide</p>
            <p className="text-[11px] text-white/35">Minimum story path to unlock the story-gated cheat codes</p>
          </div>
          <ChevronDown size={15} className={clsx('text-white/25 transition-transform duration-200', showGuide && 'rotate-180')} />
        </button>

        {showGuide && (
          <div className="border-t border-white/[0.07] bg-black/15 px-5 py-4">
            <p className="mb-4 text-[11px] leading-relaxed text-white/40">
              All codes except the two below are available from the moment you load into the game — no story progress needed.
              For the story-gated codes, here is the minimum path.
            </p>
            <div className="flex flex-col gap-5">
              {UNLOCK_GUIDE.map((guide, i) => (
                <div key={i}>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-bold text-white">{guide.cheat}</span>
                    <span className="rounded border border-amber-500/30 bg-amber-900/20 px-2 py-0.5 text-[9px] font-semibold text-amber-400">
                      {guide.minimum}
                    </span>
                    <span className="text-[9px] text-white/25">{guide.estimatedTime}</span>
                  </div>
                  <ol className="flex flex-col gap-2">
                    {guide.path.map((step, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] font-display text-[10px] font-bold text-white/40">
                          {j + 1}
                        </span>
                        <p className="text-[11px] leading-relaxed text-white/50">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
