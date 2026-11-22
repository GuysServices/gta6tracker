'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, Key, DollarSign, Skull, BookOpen, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChapterData {
  id: number
  title: string
  subtitle: string
  location: string
  missionCount: number
  playableAs: string
  accentColor: string
  pointOfNoReturn: string
  pornr: string            // point of no return description
  keeps: string[]
  loses: string[]
  missables: { item: string; when: string; tip: string }[]
  unlocks: { item: string; desc: string }[]
  moneyTips: { tip: string; amount?: string }[]
  warnings: string[]
  guideUrl: string
}

// ─── Chapter Data — all sourced from verified walkthroughs ───────────────────

const CHAPTERS: ChapterData[] = [
  {
    id: 1,
    title: 'Chapter 1',
    subtitle: 'Just Like Paradise',
    location: 'Leonida Keys — Key Lento',
    missionCount: 21,
    playableAs: 'Mostly Jason, Lucia joins midway',
    accentColor: '#72dce8',
    pointOfNoReturn: 'Tourist Trap — "Take Up Mattia\'s Offer"',
    pornr: 'Once you accept Mattia\'s offer, you are locked into a chain of back-to-back missions with no free roam. Everything listed below under "You Lose" is gone the moment this starts.',
    keeps: [
      'Unique weapons you have already picked up',
      'Money in Family Savings (up to $5,000 Chapter 1 cap)',
      'Guns bought at Ammu-Nation',
    ],
    loses: [
      'ALL pocket cash in your wallet',
      'Your BuckMe checking account balance',
      'Cash in Jason\'s floor stash — empty it first',
      'Jason\'s house in Key Lento — permanently',
      'Personal vehicles including Ultimate Edition cars',
      'Jason\'s fitness gains (drop while he recovers early Ch2)',
      'Access to Shirley\'s optional errands',
    ],
    missables: [
      {
        item: 'Balcony Meditation with Lucia',
        when: 'After Down to Earth — Chapter 1 only',
        tip: 'Talk to Lucia in the kitchen the morning after Down to Earth and say yes when she suggests meditating on the balcony. Only meditation spot in Chapter 1. Required for Positive Mental Attitude trophy (18 meditations total).',
      },
      {
        item: 'Donnie\'s H&L .38 Pistol — Unique Weapon',
        when: 'During Don Gone mission',
        tip: 'Open the boot of Donnie\'s car and take the pistol BEFORE you destroy the car. Blow up the car first and the weapon is gone forever.',
      },
      {
        item: 'Get Shirley\'s Rum',
        when: 'Before Tourist Trap starts',
        tip: 'Complete Shirley\'s optional rum errand before accepting Mattia\'s offer. Gone once Tourist Trap begins.',
      },
      {
        item: 'Steal the Scooter (and Shirley\'s Penumbra FF)',
        when: 'Before Tourist Trap starts',
        tip: 'Complete Shirley\'s scooter task before Tourist Trap. The Penumbra FF (Paul Walker Eclipse) goes with it.',
      },
      {
        item: 'Cash in the Kingfisher Camp Trailer',
        when: 'During Gone Fishing — first mission',
        tip: 'On the way to the plane in Gone Fishing, the red-and-white trailer in the Kingfisher camp has cash. It cannot be accessed after the mission ends.',
      },
      {
        item: 'Mandy\'s Cigar (Pipework)',
        when: 'During Pipework mission',
        tip: 'Mandy throws a Macizo cigar on the floor after the sink job. Pick it up before leaving — story item, sells to a fence.',
      },
      {
        item: 'Lucia\'s 5 Release Errands + House Repairs',
        when: 'Before Coming Home mission',
        tip: 'Groceries, flowers, necklace, haircut, clothes + house repairs (roof, steps, railing). All must be done before you pick Lucia up. Affects relationship starting tier and story dialogue.',
      },
      {
        item: 'The Necklace — Buy It',
        when: 'Before Coming Home — optional but consequential',
        tip: 'Buy the gold necklace (~$425–475) at The Siren\'s Chest. Lucia uses it as collateral at the Starlet Motel in Chapter 2 (Overnight Charges). You get it back in Behind on Payments.',
      },
      {
        item: 'Find the Lost Drugs — All 4 Areas',
        when: 'Chapter 1 only, disappears at Tourist Trap',
        tip: 'Search Recreation Area, Burned Houses, Pelican Valley and Thorpe Adventures. Sell drugs to a fence afterward.',
      },
      {
        item: 'Clock Out — Pick Up Lucia from Work',
        when: 'After Day Release — single call, time-sensitive',
        tip: 'Lucia calls once to be picked up before 4pm. Miss the call or turn up on foot and it\'s gone. May require relationship at 3/4 (Crazy in Love) to trigger.',
      },
    ],
    unlocks: [
      { item: 'Jason\'s House', desc: 'Base of operations in Key Lento. Gone at Tourist Trap.' },
      { item: 'Coastal Auto Care Mod Shop', desc: 'Free engine repair and respray from Joey. Unlocks after Just a Scratch.' },
      { item: 'Police Scanner App', desc: 'Plays police chatter while committing crimes. Unlocks after Unwanted Attention.' },
      { item: 'Brian\'s Lockup Fence', desc: 'Sell narcotics, jewellery and marked bills. Green icon on map.' },
      { item: 'BuckMe + Family Savings', desc: 'Bank app + savings account. Family Savings survives chapter end — checking does not.' },
      { item: 'Kenton\'s Treasure Dives', desc: 'Best early money farm. 7 sets, ~$2,400+ each. Unlocks via Island Dreams.' },
      { item: 'First Meditation Spot', desc: 'Jason\'s house balcony. Chapter 1 only. Required for trophy.' },
    ],
    moneyTips: [
      { tip: 'Move at least $5,000 to Family Savings BEFORE Tourist Trap. It\'s the only money that survives Chapter 1.', amount: '$5,000 goal' },
      { tip: 'Do Kenton\'s treasure dives — 7 sets at ~$2,400 each with zero combat. Best early farm.', amount: '~$2,400/set' },
      { tip: 'DO NOT upgrade Jason\'s Ganado. The story replaces it at the end of Chapter 1 and all mods go with it.' },
      { tip: 'Sell narcotics, jewellery and marked bills to Brian\'s lockup before Tourist Trap. Fences can close after the chapter ends.' },
      { tip: 'Pocket cash above $999 must go through BuckMe ATMs. Death or arrest takes pocket cash — keep it low.' },
      { tip: 'Lab Fees and Clean Up After Donnie pay $600 each — arrives in the mailbox, not instantly. Check it.' },
    ],
    warnings: [
      'Save in a NEW SLOT before Recalibration — last safe point before back-to-back finale missions.',
      'Tourist Trap = point of no return. Once started, Shirley\'s errands, free roam and your house are gone.',
      'No mission replay in GTA VI. Manual save at start and end of every chapter.',
    ],
    guideUrl: 'https://readdork.com/gaming/gta-6-walkthrough',
  },
  {
    id: 2,
    title: 'Chapter 2',
    subtitle: 'Paradise Lost',
    location: 'Starlet Motel — Port Gellhorn, Kelly County',
    missionCount: 11,
    playableAs: 'Mostly Lucia. Both after Coffee Break.',
    accentColor: '#ff79a8',
    pointOfNoReturn: 'Checking Out — "Move to Vice City"',
    pornr: 'Once Checking Out triggers, the Starlet Motel stops being your base and some fences disappear permanently. Requires $15,000 to trigger.',
    keeps: [
      'Money in BuckMe and Family Savings (carry forward)',
      'Guns and weapons carry into Chapter 3',
      'Personal vehicles carry forward',
    ],
    loses: [
      'Starlet Motel as a base of operations',
      'Some fences and magazine locations (sell to Dunk first)',
      'Chapter 2 optional missable side quests',
    ],
    missables: [
      {
        item: 'Check Out McKittrick Farm (Kyle\'s Quest)',
        when: 'Chapter 2 — before Checking Out',
        tip: 'Meet Kyle to begin his optional questline. Must be started in Chapter 2.',
      },
      {
        item: 'Thrillbillies — Billy\'s Mud Club',
        when: 'After Coffee Break — before Checking Out',
        tip: 'Visit the Mud Club and meet Billy after Wyman introduces you at Coffee Break. This starts Billy\'s optional mission chain (Twist Wrist, Smash, Grab follows).',
      },
      {
        item: 'Gutterball Moreland 850 Shotgun — Unique Weapon',
        when: 'During Hit Kingpin Bowling optional mission',
        tip: 'Three key valuables inside: luxury watch, Gutterball Moreland 850 shotgun, and the safe. Take all three for the Let\'s Go Bowling trophy. Use sticky bombs on the safe.',
      },
      {
        item: 'Necklace Collateral — Overnight Charges',
        when: 'Chapter 2 start, based on Chapter 1 choice',
        tip: 'If you bought the necklace in Chapter 1, Lucia automatically hands it to Linda as collateral. You get it back in Behind on Payments. Miss it in Chapter 1 = gone.',
      },
    ],
    unlocks: [
      { item: 'Moses — Slim Jim + Car Registration', desc: 'Opens car theft properly. First registration free. Unlocks Scooter Bros delivery app.' },
      { item: 'Dunk as a Fence', desc: 'Better rates than Brian. Marks two robbery locations after Slam Dunk.' },
      { item: 'Port Gellhorn Garage', desc: 'Gift from Moses after Daily Driver. Buy garages from Vice City Real Estate app.' },
      { item: 'Free Character Switching', desc: 'Unlocks at Coffee Break. Hold right on D-pad to switch. Train together for double stat progress.' },
      { item: 'RydeMe Taxi App', desc: 'Opens after Chapter 2. Fast travel ~$100 anywhere on the map.' },
      { item: 'Avery Pawn + Kingpin Bowling Robberies', desc: 'Two optional robberies with significant loot. Dunk flags them after Slam Dunk.' },
    ],
    moneyTips: [
      { tip: 'You need $15,000 to trigger Checking Out. This is the main money gate of Chapter 2.', amount: '$15,000 needed' },
      { tip: 'Sell untracked stolen cars to Moses — fastest consistent income in Chapter 2. Short cooldown between sales.' },
      { tip: 'Hit Kingpin Bowling and Avery Pawn optional robberies — both have significant cash and unique loot.' },
      { tip: 'Search Dr Bill\'s body after Slam Dunk for ~$1,000. Easy pickup.' },
      { tip: 'Afternoon Delight pays $10,000 through BuckMe the next day — biggest single payout of Chapter 2.' },
      { tip: 'Daily Driver bonus: Deliver the \'82 Canis Crawler to Moses with no damage for a $500 bonus on top of $1,250.' },
    ],
    warnings: [
      'Sell stolen goods to Dunk BEFORE Checking Out — fences disappear as the story moves on.',
      'Make a manual save before Checking Out. No mission replay.',
      'Bug: dying during the Chapter 2 finale bike ride can get you stuck. Restart the mission if it happens.',
    ],
    guideUrl: 'https://readdork.com/gaming/gta-6-walkthrough',
  },
  {
    id: 3,
    title: 'Chapter 3',
    subtitle: 'Tits Ass Drug Money',
    location: 'Bayside Apartment 201 — Vice City',
    missionCount: 26,
    playableAs: 'Both Jason and Lucia',
    accentColor: '#ffd27a',
    pointOfNoReturn: 'The Cartel Heist — Sinfrontera National Bank',
    pornr: 'The Cartel Heist is the chapter finale. Sell all stolen goods before starting it. Some fences and locations vanish after.',
    keeps: [
      'Money, guns and cars all carry into Chapter 4',
      '$120,000 story payout at end of Chapter 3',
    ],
    loses: [
      'Some fences and magazine locations post-finale',
      'Race Against Yago — expires if you wait too long (timed)',
      'Dubious Provenance Part 3 — expires at chapter end if not pursued',
    ],
    missables: [
      {
        item: 'Race Against Yago — Time-Sensitive',
        when: 'Chapter 3 — hourglass marker means it expires',
        tip: 'An hourglass appears next to the mission marker when it goes live. Complete Race Against Yago THE MOMENT it appears. Missing it closes Yago\'s full optional quest chain (Brother to Brother).',
      },
      {
        item: 'Monty\'s 1992 Pistol — Unique Weapon',
        when: 'During The Missing Link mission only',
        tip: 'Pick up Monty\'s 1992 Pistol during The Missing Link. It is ONLY available inside the mission — cannot be collected after.',
      },
      {
        item: 'Dubious Provenance Part 3 — Halifax Storage Unit',
        when: 'Must trust Halifax before Chapter 3 ends',
        tip: 'Hand over the statue AND choose to trust Halifax in Part 2. Part 3 opens a storage unit with ~$2,500 in jewellery and cash. If you refuse or never give the statue before the chapter ends, Part 3 is gone.',
      },
      {
        item: 'Veteran Hunted — Bret\'s Hunting Quest',
        when: 'Chapter 2 as Jason — carries into Chapter 3',
        tip: 'Play as Jason and meet Bret to begin his hunting-related objectives. Can start in Chapter 2 and continues into Chapter 3.',
      },
    ],
    unlocks: [
      { item: 'Tyrone, Yasmani + Randy as Fences', desc: 'Three new fences. Yasmani offers highest rates post-Ch3. Randy runs the Wish List car side quest.' },
      { item: 'Key Cloner', desc: 'Steal cars with advanced trackers — supercars, exotic vehicles. Unlocks Yasmani\'s jewellery jobs.' },
      { item: 'Snap Gun', desc: 'Opens any door. Unlocks if you take Yasmani\'s optional jewellery jobs.' },
      { item: 'Dye Pack Jammer', desc: 'Required for bank robberies. Opens payday loan, jewellery and bank jobs on the map.' },
      { item: 'Cut-Off Tool', desc: 'New tool for certain missions and heist setups.' },
      { item: 'Randy\'s Wish List', desc: '22 rare and unique cars to find across Leonida. Register with Randy for rewards.' },
      { item: 'Pay \'n\' Spray Car Sales', desc: 'Sell cars at Pay \'n\' Spray — opens in Chapter 3.' },
    ],
    moneyTips: [
      { tip: '$120,000 story payout lands at the end of Chapter 3 — the biggest story-paid sum before Chapter 4.', amount: '$120,000' },
      { tip: 'Yasmani offers the highest fence rates in Chapter 3+ for drugs, marked bills and jewellery.' },
      { tip: 'Key Cloner lets you steal supercars — register with Moses at Pay \'n\' Spray for full value sales.' },
      { tip: 'Start Randy\'s Wish List early. 22 cars, each with a cash reward on delivery. Some require Key Cloner.' },
      { tip: 'Jewellery jobs via Yasmani (optional) unlock the Snap Gun — do not skip them.' },
      { tip: 'Sell ALL stolen goods to a fence before The Cartel Heist finale — some locations close post-chapter.' },
    ],
    warnings: [
      'Race Against Yago is the ONLY timed mission in Chapter 3. Complete it the moment the hourglass appears.',
      'Save before The Cartel Heist finale — point of no return for this chapter.',
      'No mission replay. Manual save at start of chapter and before the finale.',
      'Chapter 3 is the longest chapter: 26 main missions. Budget time before big sessions.',
    ],
    guideUrl: 'https://readdork.com/gaming/gta-6-walkthrough',
  },
  {
    id: 4,
    title: 'Chapter 4',
    subtitle: 'Vice City, Baby',
    location: 'Y Hotel, Room 701 — Ocean Beach, Vice City',
    missionCount: 25,
    playableAs: 'Both Jason and Lucia',
    accentColor: '#d5a6ff',
    pointOfNoReturn: 'Last Chapter 4 Mission — Multiple Endings',
    pornr: 'Chapter 4 has more than one ending. Make a manual save before the LAST mission of Chapter 4. No replay exists.',
    keeps: [
      'Money, guns and cars carry into Chapter 5',
      'BuckMe Black account ($2m checking limit)',
      'Family Savings balance',
    ],
    loses: [
      'Jason and Lucia cannot be seen together in public from Making Gainz to the VCIA Takedown — plan accordingly',
      'Some story branches close based on Chapter 4 ending choice',
    ],
    missables: [
      {
        item: 'That\'s Where The Money Is — Bank Vault Robberies',
        when: 'Near end of Chapter 4 — optional quest',
        tip: 'Complete the bank robbery introduction mission to unlock repeatable vault runs. Each run pays up to $205,000. This is the highest single cash source in the game — do not skip it.',
      },
      {
        item: 'This Is a Free Call From… — Lucia-only',
        when: 'Chapter 4 — time-sensitive, Lucia only',
        tip: 'Play as Lucia when this appears (shown with an hourglass). Time-sensitive pickup involving Shayna. Miss it and it\'s gone.',
      },
      {
        item: 'Chapter 4 Ending Choice — Save Before Last Mission',
        when: 'Final mission of Chapter 4',
        tip: 'The story has multiple endings and no replay. Make a manual save in a NEW SLOT before the final Chapter 4 mission.',
      },
      {
        item: 'Pay Abe\'s Fee — Lawyer Up',
        when: 'After Lawyer Up mission',
        tip: 'An additional objective appears after Lawyer Up requiring you to pay Abe\'s fee. Make sure you have enough cash when you reach Ocean Beach or progress stalls.',
      },
    ],
    unlocks: [
      { item: 'BuckMe Black Account', desc: '$2,000,000 checking limit. Unlocks once you complete enough savings goals.' },
      { item: 'Pilot Pete\'s Cargo Flights', desc: 'Opens early in Chapter 4. Repeatable cargo mission income.' },
      { item: 'Bank Vault Robberies', desc: 'Up to $205,000 per run. Unlocks near the end of Chapter 4 via That\'s Where The Money Is.' },
      { item: 'Full Vice City Access', desc: 'Y Hotel as base, full city open for businesses, properties and activities.' },
    ],
    moneyTips: [
      { tip: 'That\'s Where The Money Is unlocks bank vault runs up to $205,000 each. Do it as soon as it appears.', amount: 'Up to $205,000/run' },
      { tip: 'Pilot Pete\'s cargo flights are repeatable income — no combat, just flying.', amount: 'Repeatable' },
      { tip: 'Have cash ready for Abe\'s fee after Lawyer Up — the story gates on this payment.' },
      { tip: 'BuckMe Black gives $2m checking limit — finally enough room to hold serious money.' },
    ],
    warnings: [
      'Save in a NEW SLOT before the last Chapter 4 mission — multiple endings, no replay.',
      'Jason and Lucia cannot be seen together in public between Making Gainz and VCIA Takedown.',
      'Have enough cash available for Abe\'s fee after Lawyer Up or story progression stalls.',
    ],
    guideUrl: 'https://readdork.com/gaming/gta-6-walkthrough',
  },
  {
    id: 5,
    title: 'Chapter 5',
    subtitle: 'Top of the World, Ma',
    location: 'Vice City — Final Chapter',
    missionCount: 7,
    playableAs: 'Both Jason and Lucia',
    accentColor: '#f97316',
    pointOfNoReturn: 'The End of the Road — Final Mission',
    pornr: 'Chapter 5 is the finale. Only 7 missions. No second chances — make your save before the final mission.',
    keeps: [
      'All money, guns and cars carry through',
      'Family Savings and BuckMe Black balance',
    ],
    loses: [
      'Post-credits access depends on ending choice — some content may close',
    ],
    missables: [
      {
        item: 'Manual Save Before The End of the Road',
        when: 'Before the final mission',
        tip: 'Save in a new slot before the final mission. The ending is permanent and cannot be replayed.',
      },
      {
        item: 'Family Savings Ending Bonus',
        when: 'Chapter 5 credits',
        tip: 'How you invested money throughout the game reportedly has a bearing on the ending. Prioritise Family Savings throughout all chapters.',
      },
    ],
    unlocks: [
      { item: 'The End of the Road', desc: 'Final mission. Mattia, lawyer Abe and Vinny all figure in the finale.' },
      { item: 'Post-Game Access', desc: 'Depends on choices made throughout. Continue exploring Leonida after credits.' },
    ],
    moneyTips: [
      { tip: 'By Chapter 5, bank vault runs ($205k each) are your best income source. Keep running them.' },
      { tip: 'Family Savings balance may affect the ending — keep investing throughout the chapter.' },
      { tip: 'Sell any remaining loot to Yasmani (best rates) before the final mission.' },
    ],
    warnings: [
      'Only 7 missions — the game ends fast once Chapter 5 starts.',
      'Save in a new slot before The End of the Road. No replay, no second chances.',
      'Choices throughout the entire game feed into this ending.',
    ],
    guideUrl: 'https://readdork.com/gaming/gta-6-walkthrough',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

type Section = 'missables' | 'unlocks' | 'money' | 'warnings'

export default function ChapterGuide() {
  const [activeChapter, setActiveChapter] = useState<number>(1)
  const [openSection, setOpenSection] = useState<Section | null>('missables')

  const chapter = CHAPTERS.find(c => c.id === activeChapter)!

  const toggle = (s: Section) => setOpenSection(openSection === s ? null : s)

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">

      {/* Header */}
      <div className="mb-7">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff79a8]">Story Progression</p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">Chapter Guide</h2>
        <p className="mt-1.5 text-xs text-white/40">
          Every missable, unlock and money tip per chapter. No spoilers beyond what you need to know.
        </p>
      </div>

      {/* Chapter selector */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {CHAPTERS.map(ch => (
          <button
            key={ch.id}
            onClick={() => { setActiveChapter(ch.id); setOpenSection('missables') }}
            className={clsx(
              'flex-shrink-0 rounded-xl border px-4 py-2.5 text-left transition',
              activeChapter === ch.id
                ? 'border-white/25 bg-white/[0.08] text-white'
                : 'border-white/[0.08] bg-transparent text-white/35 hover:bg-white/[0.04] hover:text-white/60'
            )}
          >
            <div
              className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.1em]"
              style={{ color: ch.accentColor }}
            >
              CH {ch.id}
            </div>
            <div className="text-xs font-semibold">{ch.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Chapter Hero Card */}
      <div
        className="mb-5 overflow-hidden rounded-2xl border p-5"
        style={{ borderColor: `${chapter.accentColor}30`, background: `${chapter.accentColor}08` }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 flex-wrap">
              <span
                className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
                style={{ color: chapter.accentColor, background: `${chapter.accentColor}20`, border: `0.5px solid ${chapter.accentColor}40` }}
              >
                {chapter.missionCount} Missions
              </span>
              <span className="text-[9px] text-white/30">{chapter.playableAs}</span>
            </div>
            <h3 className="text-lg font-bold text-white">{chapter.title}: {chapter.subtitle}</h3>
            <p className="mt-0.5 text-xs text-white/40">📍 {chapter.location}</p>
          </div>
        </div>

        {/* Point of no return */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] px-3 py-2.5">
          <div className="mb-1 flex items-center gap-1.5">
            <Skull size={10} className="text-red-400" />
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-red-400">Point of No Return</p>
          </div>
          <p className="text-xs font-semibold text-white/80">{chapter.pointOfNoReturn}</p>
          <p className="mt-1 text-[11px] leading-5 text-white/50">{chapter.pornr}</p>
        </div>

        {/* Keeps / Loses */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-green-500/15 bg-green-500/[0.05] px-3 py-2.5">
            <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-green-400">✓ You Keep</p>
            {chapter.keeps.map((k, i) => (
              <p key={i} className="mb-0.5 text-[11px] leading-5 text-white/55">· {k}</p>
            ))}
          </div>
          <div className="rounded-xl border border-red-500/15 bg-red-500/[0.05] px-3 py-2.5">
            <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-red-400">✗ You Lose</p>
            {chapter.loses.map((l, i) => (
              <p key={i} className="mb-0.5 text-[11px] leading-5 text-white/55">· {l}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion sections */}
      <div className="flex flex-col gap-3">

        {/* Missables */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11121d]/90">
          <button
            onClick={() => toggle('missables')}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-sm font-semibold text-white">
                Missables ({chapter.missables.length})
              </span>
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-red-400">
                Don't skip
              </span>
            </div>
            {openSection === 'missables' ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
          </button>
          {openSection === 'missables' && (
            <div className="border-t border-white/[0.07] px-5 pb-4 pt-3 space-y-3">
              {chapter.missables.map((m, i) => (
                <div key={i} className="rounded-xl border border-red-500/10 bg-red-500/[0.04] px-3 py-3">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-white/90">{m.item}</span>
                  </div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.08em] text-red-400/70">{m.when}</p>
                  <p className="text-[11px] leading-5 text-white/55">{m.tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unlocks */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11121d]/90">
          <button
            onClick={() => toggle('unlocks')}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <Key size={14} className="text-[#72dce8]" />
              <span className="text-sm font-semibold text-white">
                What This Chapter Unlocks ({chapter.unlocks.length})
              </span>
            </div>
            {openSection === 'unlocks' ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
          </button>
          {openSection === 'unlocks' && (
            <div className="border-t border-white/[0.07] px-5 pb-4 pt-3 space-y-2">
              {chapter.unlocks.map((u, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#72dce8]" />
                  <div>
                    <p className="text-xs font-semibold text-white/85">{u.item}</p>
                    <p className="mt-0.5 text-[11px] leading-5 text-white/45">{u.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Money tips */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11121d]/90">
          <button
            onClick={() => toggle('money')}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <DollarSign size={14} className="text-[#ffd27a]" />
              <span className="text-sm font-semibold text-white">
                Money Tips ({chapter.moneyTips.length})
              </span>
            </div>
            {openSection === 'money' ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
          </button>
          {openSection === 'money' && (
            <div className="border-t border-white/[0.07] px-5 pb-4 pt-3 space-y-2">
              {chapter.moneyTips.map((m, i) => (
                <div key={i} className="flex gap-3 items-start rounded-xl border border-[#ffd27a]/10 bg-[#ffd27a]/[0.04] px-3 py-2.5">
                  <span className="mt-0.5 text-sm">💰</span>
                  <div className="flex-1">
                    <p className="text-[11px] leading-5 text-white/65">{m.tip}</p>
                    {m.amount && (
                      <span className="mt-1 inline-block rounded-full bg-[#ffd27a]/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#ffd27a]">
                        {m.amount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warnings */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11121d]/90">
          <button
            onClick={() => toggle('warnings')}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen size={14} className="text-[#ff9bb5]" />
              <span className="text-sm font-semibold text-white">
                Critical Reminders ({chapter.warnings.length})
              </span>
            </div>
            {openSection === 'warnings' ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
          </button>
          {openSection === 'warnings' && (
            <div className="border-t border-white/[0.07] px-5 pb-4 pt-3 space-y-2">
              {chapter.warnings.map((w, i) => (
                <div key={i} className="flex gap-2.5 items-start rounded-xl border border-orange-500/15 bg-orange-500/[0.05] px-3 py-2.5">
                  <AlertTriangle size={11} className="mt-0.5 shrink-0 text-orange-400" />
                  <p className="text-[11px] leading-5 text-white/65">{w}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full walkthrough link */}
      <a
        href={chapter.guideUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-xs text-white/40 transition hover:bg-white/[0.06] hover:text-white/70"
      >
        <ExternalLink size={12} />
        Full Chapter {activeChapter} Walkthrough (Dork / Readdork)
      </a>

      <p className="mt-5 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Sourced from verified walkthroughs · November 2026
      </p>
    </div>
  )
}
