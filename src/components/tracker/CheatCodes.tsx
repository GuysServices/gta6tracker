'use client'

import { useState, useMemo } from 'react'
import { Copy, Check, ExternalLink, Search, X } from 'lucide-react'
import clsx from 'clsx'

type CheatCat = 'all' | 'player' | 'combat' | 'vehicles' | 'environment' | 'filters'
type UnlockDiff = 'easy' | 'medium' | 'hard' | 'story'

interface Cheat {
  id: string
  name: string
  description: string
  code: string | null
  category: CheatCat
  unlock: string
  diff: UnlockDiff
  hasCode: boolean
  fastestWay?: string
}

const CHEATS: Cheat[] = [
  // ── PLAYER ───────────────────────────────────────────────────────────────
  {
    id: 'p-250k',
    name: '$250,000',
    description: 'Instantly gives you $250,000 cash.',
    code: '↑ → ↓ ← ↑ ← ↓ →',
    category: 'player',
    unlock: 'Complete the main story',
    diff: 'story',
    hasCode: true,
  },
  {
    id: 'p-drunk',
    name: 'Drunk',
    description: 'Instantly makes you and your partner drunk.',
    code: null,
    category: 'player',
    unlock: 'Spend $2,500 on alcohol',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Hit any bar or liquor store repeatedly. Stack drinks at Skeeter\'s bar in Hamlet or any Vice City bar. Total $2,500 needed — takes about 10–15 visits.',
  },
  {
    id: 'p-raise-heat',
    name: 'Raise Heat Level',
    description: 'Raises your level of heat across the map.',
    code: '← ↓ → ↓ ↑ ↓ ↑',
    category: 'player',
    unlock: 'Escape a 3-star wanted level 25 times',
    diff: 'medium',
    hasCode: true,
    fastestWay: 'Get 3 stars, then lose the cops using Pay \'n\' Spray or the tunnel trick in Vice City. Repeat. Each clean escape counts. Aim for 3–5 per session.',
  },
  {
    id: 'p-raise-wanted',
    name: 'Raise Wanted Level',
    description: 'Raises your wanted level across the map.',
    code: null,
    category: 'player',
    unlock: 'Escape a 3-star wanted level 50 times',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'Same as Raise Heat but 50 escapes needed. Stack with the Raise Heat unlock — both track the same 3-star escapes. 50 escapes at 5/session = 10 sessions.',
  },
  {
    id: 'p-unlimited-focus',
    name: 'Unlimited Focus',
    description: 'Focus (slow-motion aim) never runs out.',
    code: '↓ ↑ ↑ ↓ ↑ ↓ ↑ ↓ ↑ →',
    category: 'player',
    unlock: 'Complete the main story',
    diff: 'story',
    hasCode: true,
  },
  {
    id: 'p-no-fall-damage',
    name: 'No Fall Damage',
    description: 'Immune to fall damage.',
    code: null,
    category: 'player',
    unlock: 'Survive a freefall from 40 feet 20 times',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Find any cliff or roof about 40 feet high. Jump, survive. The cheapest and fastest: the Starlet Motel roof in Kelly County. Repeat 20 times in one session.',
  },
  {
    id: 'p-parachute',
    name: 'Parachute',
    description: 'Adds a parachute to your loadout.',
    code: null,
    category: 'player',
    unlock: 'Complete 50 skydives or base jumps from 300 feet or higher',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'Pilot Pete\'s cargo missions include repeated airplane runs — skydive out every time. 50 jumps takes roughly 50 plane sessions. The Mount Kalaga cliff at 300ft+ also counts.',
  },
  {
    id: 'p-body-armor',
    name: 'Body Armor',
    description: 'Adds body armor to your loadout.',
    code: '↓ ↑ ← ↑ ↑ ↑ ↑ ↑ ↓ ↓',
    category: 'player',
    unlock: 'Complete 100 workouts',
    diff: 'medium',
    hasCode: true,
    fastestWay: 'Work out at any gym or outdoor equipment location. Each session counts as 1 workout — do two or three in a row at the same location. 100 workouts at 3/day = ~33 in-game days.',
  },
  {
    id: 'p-repair-vehicle',
    name: 'Repair Vehicle',
    description: 'Fully repairs your current vehicle.',
    code: null,
    category: 'player',
    unlock: 'Get 1st place in 10 races at Gellhorn Raceway, Thrillbilly Mud Club, and Boone Speedway',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'Enter races at all three tracks. Easiest to grind: Gellhorn Raceway in Port Gellhorn — short circuit, easy to repeat. Win 10 total across all three venues.',
  },
  {
    id: 'p-unlimited-nitrous',
    name: 'Unlimited Nitrous',
    description: 'Nitrous and fuel never run out on vehicles.',
    code: null,
    category: 'player',
    unlock: 'Complete 50 stunt jumps',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Yellow stunt jump markers appear across Leonida. The highest concentration is in Vice City. Chain multiple in one drive. 50 jumps at 5–10/session = ~6 sessions.',
  },

  // ── COMBAT ───────────────────────────────────────────────────────────────
  {
    id: 'c-max-ammo',
    name: 'Max Ammo',
    description: 'Fills all ammo to maximum.',
    code: '↓ ↑ → ↓ ← ← ↑ ↑ ↓ ←',
    category: 'combat',
    unlock: 'Win 25 bronze medals or higher at shooting ranges',
    diff: 'easy',
    hasCode: true,
    fastestWay: 'Shooting ranges are marked on the map (gun icon). Bronze is easy on beginner courses. 25 medals = ~25 visits. Fastest: Port Gellhorn range, beginner pistol challenge, repeat.',
  },
  {
    id: 'c-infinite-ammo',
    name: 'Infinite Ammo',
    description: 'Ammo never runs out.',
    code: '↓ ↑ → ↓ ← ← ↑ ↓ ↓ ↓',
    category: 'combat',
    unlock: 'Win 25 silver medals or higher at shooting ranges',
    diff: 'medium',
    hasCode: true,
    fastestWay: 'Same as Max Ammo but silver required. Practice the pistol beginner course 10+ times first to build aim, then push for silver on intermediate.',
  },
  {
    id: 'c-no-reload',
    name: 'No Reload',
    description: 'Ammo never runs out, no need to reload.',
    code: '↓ ↑ → ↓ ← ← ↑ ↓ ↓ ↑',
    category: 'combat',
    unlock: 'Win 25 gold medals at shooting ranges',
    diff: 'hard',
    hasCode: true,
    fastestWay: 'Gold is the hardest shooting range requirement. Focus on beginner course gold before moving up. Use the SMG course — faster fire rate = more targets hit in time.',
  },
  {
    id: 'c-attack-force',
    name: 'Attack Force',
    description: 'Bullets and melee attacks launch targets on impact.',
    code: '↓ ↑ ← ← → ↓ ↓ ↑ ↓',
    category: 'combat',
    unlock: 'Complete the main story',
    diff: 'story',
    hasCode: true,
  },
  {
    id: 'c-exploding-balls',
    name: 'Exploding Balls',
    description: 'Sports balls explode on impact.',
    code: '↓ ↑ ← ← → ↓ ↓ ↑ →',
    category: 'combat',
    unlock: 'Hit 20 enemies with explosive damage',
    diff: 'easy',
    hasCode: true,
    fastestWay: 'Throw grenades at any gang operation. 20 kills with explosive damage across any session — happens naturally from Ch. 2 gang ops. Fast if you use the H-AT Launcher from the RV Park Bunker.',
  },
  {
    id: 'c-vehicle-force',
    name: 'Vehicle Force',
    description: 'Vehicle collisions launch targets.',
    code: '↓ ↑ ← ← → ↓ ← ↑ ↓',
    category: 'combat',
    unlock: 'Kill 25 enemies with a vehicle',
    diff: 'easy',
    hasCode: true,
    fastestWay: 'Drive into any gang operation or crowd. 25 vehicle kills happens within 2–3 gang op raids. Fastest: get a heavy vehicle, raid a Kingfisher camp. Done in one session.',
  },
  {
    id: 'c-hauners-hat',
    name: 'Hauners H-AT Launcher',
    description: 'Adds a Hauners H-AT to your loadout.',
    code: null,
    category: 'combat',
    unlock: 'Blow up 100 vehicles',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'Blow up parked cars with grenades at impound lots and parking garages. Stealing cop cars and blowing them also counts. 100 vehicles takes 3–4 extended sessions.',
  },
  {
    id: 'c-incendiary-ammo',
    name: 'Incendiary Ammo',
    description: 'All ammo is incendiary.',
    code: null,
    category: 'combat',
    unlock: 'Burn 100 enemies with fire damage',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Molotovs from the RV Park Bunker (free early). Raid gang ops and throw Molotovs into groups. 100 burns across 10–15 gang op raids.',
  },
  {
    id: 'c-explosive-shotgun',
    name: 'Explosive Shotgun',
    description: 'Adds a Mason & Keen Shortstraw that fires explosive shells.',
    code: null,
    category: 'combat',
    unlock: 'Hit 100 enemies with explosive damage',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Same as Exploding Balls grind. Stack: use grenades + H-AT Launcher on gang ops. 100 explosive hits across regular gang op farming.',
  },

  // ── VEHICLES ─────────────────────────────────────────────────────────────
  {
    id: 'v-boomazoom',
    name: 'Maibatsu Boomazoom',
    description: 'Spawns a Maibatsu Boomazoom.',
    code: '← ↑ → ↓ ← ← ↑ ←',
    category: 'vehicles',
    unlock: 'Complete 5 shopping challenges',
    diff: 'easy',
    hasCode: true,
    fastestWay: 'Shopping challenges appear in the Challenges menu (Progress > Challenges > Shopping). Buy items at different store types — clothing, liquor, food, electronics. 5 challenges = roughly 5 different purchases at different store categories.',
  },
  {
    id: 'v-mtl-pumper',
    name: 'MTL Pumper (Fire Truck)',
    description: 'Spawns an MTL Pumper.',
    code: '← ↑ → ↓ ← → → ↑',
    category: 'vehicles',
    unlock: 'Unknown — discovered in-game',
    diff: 'easy',
    hasCode: true,
  },
  {
    id: 'v-bulldozer',
    name: 'HVY Bulldozer',
    description: 'Spawns an HVY Bulldozer.',
    code: '← ↑ → ↓ ← → → ↓',
    category: 'vehicles',
    unlock: 'Discover the HVY Bulldozer in the Progress menu',
    diff: 'easy',
    hasCode: true,
    fastestWay: 'Find and interact with an HVY Bulldozer in the world (construction sites, Port Gellhorn docks, any active build site). Once it registers in the Progress menu as "Discovered," the cheat unlocks.',
  },
  {
    id: 'v-sanchez',
    name: 'Maibatsu Sanchez',
    description: 'Spawns a Maibatsu Sanchez dirt bike.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete 5 criminal challenges',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Criminal challenges: rob stores, complete gang ops, sell to fences. 5 criminal challenge completions happens naturally within the first 2 hours of open-world play in Ch. 1.',
  },
  {
    id: 'v-airboat',
    name: 'Airboat 09',
    description: 'Spawns an Airboat 09.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete 5 survival challenges',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Survival challenges: escape wanted levels, survive gang fights, complete ambushes. 5 challenges happens within normal gameplay in Ch. 1–2.',
  },
  {
    id: 'v-bmx',
    name: 'Tuff BMX',
    description: 'Spawns a Tuff BMX.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete 5 fitness challenges',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Fitness challenges: work out at gyms, go for runs, swim. 5 challenges is very quick — do 5 gym sessions in Key Lento in Ch. 1.',
  },
  {
    id: 'v-lapwing',
    name: 'Lapwing Mallard',
    description: 'Spawns a Lapwing Mallard plane.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete 5 vehicle challenges',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Vehicle challenges: win races, complete stunt jumps, drive long distances. 5 vehicle challenges completes within the first few Ch. 2 racing activities.',
  },
  {
    id: 'v-sea-sparrow',
    name: 'Nagasaki Sea Sparrow',
    description: 'Spawns a Nagasaki Sea Sparrow helicopter.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete 5 exploration challenges',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Exploration challenges: discover new areas, scan landmarks with WAINK, find POIs. Travel the map broadly in Ch. 1 and 5 challenges unlock naturally.',
  },
  {
    id: 'v-speeder',
    name: 'Speeder 700 GT',
    description: 'Spawns a Speeder 700 GT boat.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete 5 combat challenges',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Combat challenges: kill enemies, survive shootouts, land headshots. 5 combat challenges completes within normal Ch. 1 gang op farming.',
  },
  {
    id: 'v-taxi',
    name: 'Vapid Stanier G2 Taxi',
    description: 'Spawns a Vapid Stanier G2 Taxi.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete 5 sports challenges',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Sports challenges: play golf, tennis, go to the shooting range, swim races. 5 sports challenges — hit Gellhorn Raceway and a golf course in the same session.',
  },
  {
    id: 'v-carbon-rs',
    name: 'Nagasaki Carbon RS',
    description: 'Spawns a Nagasaki Carbon RS bike.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete all exploration challenges',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'All exploration challenges: discover every region, scan all WAINK landmarks and curiosities, find all POIs. Use the WAINK app constantly during open-world travel. This takes the full playthrough to complete.',
  },
  {
    id: 'v-dominator-65',
    name: '\'65 Vapid Dominator',
    description: 'Spawns a \'65 Vapid Dominator classic muscle car.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete all fitness challenges',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'All fitness challenges: max out workout stat, swim long distances, run long distances, complete all gym challenges. Grind workout sessions daily across both characters for fastest completion.',
  },
  {
    id: 'v-progen-emerus',
    name: 'Progen Emerus',
    description: 'Spawns a Progen Emerus supercar.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete all vehicle challenges',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'All vehicle challenges: win all races, complete all stunt jumps, all knife flights, all base jumps. This is a major grind requiring nearly all of the vehicle-based side content.',
  },
  {
    id: 'v-thrax',
    name: 'Truffade Thrax',
    description: 'Spawns a Truffade Thrax (Bugatti).',
    code: null,
    category: 'vehicles',
    unlock: 'Complete all shopping challenges',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'All shopping challenges: buy from every store type, spend set amounts at different categories. Track in Progress > Challenges > Shopping. Can be done naturally over Ch. 3–4 if you shop consistently.',
  },
  {
    id: 'v-zombie-bobber',
    name: 'Western Zombie Bobber',
    description: 'Spawns a Western Zombie Bobber motorcycle.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete all criminal challenges',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'All criminal challenges: rob all store types, complete all gang ops, all bank jobs, reach selling milestones. The longest criminal grind in the game — plan across all chapters.',
  },
  {
    id: 'v-bravado-banshee',
    name: 'Bravado Banshee',
    description: 'Spawns a Bravado Banshee sports car.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete all combat challenges',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'All combat challenges: get gold medals at all shooting ranges, all headshot/kill milestones, survive max wanted levels. Stack with the No Reload shooting range grind.',
  },
  {
    id: 'v-golfer',
    name: 'Brimstone Golfer',
    description: 'Spawns a Brimstone Golfer golf cart.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete all sports challenges',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'All sports challenges: win at every sport (golf, tennis, pool, races, bowling, shooting range gold medals). The golf completion is the hardest — practice on easy courses first.',
  },
  {
    id: 'v-rhino-tank',
    name: 'Hauners Rhino Tank',
    description: 'Spawns a Hauners Rhino Tank.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete all survival challenges',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'All survival challenges: survive high wanted levels, complete all gang ops, all ambush events. The 6-star wanted level survival challenge is the hardest — tank or helicopter recommended.',
  },
  {
    id: 'v-ambulance',
    name: 'Interstate Ambulance',
    description: 'Spawns an Interstate Ambulance.',
    code: null,
    category: 'vehicles',
    unlock: 'Discover the Interstate Ambulance in the Progress menu',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Steal any ambulance. Hospitals always have one parked. Hospitals: Vice City General, Port Gellhorn Memorial, Key Lento Clinic. Drive it briefly and it registers as discovered.',
  },
  {
    id: 'v-lazer',
    name: 'Hauners P-996 Lazer',
    description: 'Spawns a Hauners P-996 Lazer fighter jet.',
    code: null,
    category: 'vehicles',
    unlock: 'Complete ALL challenges',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'Every single challenge in the game must be completed. This is the final vehicle cheat — obtainable only after 100% challenge completion. The ultimate long-term goal.',
  },
  {
    id: 'v-flamingo',
    name: 'Inflatable Flamingo',
    description: 'Spawns an Inflatable Flamingo pool toy.',
    code: null,
    category: 'vehicles',
    unlock: 'Destroy 50 cocaine flamingos',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Cocaine flamingos are small pink collectibles scattered across Leonida (100 total). Shoot or run them over. 50 destroyed = this cheat. Use the PowerPyx flamingo map for fastest route.',
  },

  // ── ENVIRONMENT ──────────────────────────────────────────────────────────
  {
    id: 'e-move-time',
    name: 'Move Time Forward',
    description: 'Moves the time of day forward.',
    code: null,
    category: 'environment',
    unlock: 'Find 10 collectible watches',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Collectible watches are found on bodies, in safes, and in gang operations. 10 watches is achievable within the first 15 gang op raids.',
  },
  {
    id: 'e-pause-time',
    name: 'Pause Time of Day',
    description: 'Pauses the time of day.',
    code: null,
    category: 'environment',
    unlock: 'Find 20 collectible watches',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Same as Move Time Forward — find 20 total watches. Doubles as the full watch collectible set for 100% completion.',
  },
  {
    id: 'e-cycle-weather',
    name: 'Cycle Weather',
    description: 'Adjusts the weather conditions.',
    code: '↓ → ↑ ↓ → ↑ →',
    category: 'environment',
    unlock: 'Complete the main story',
    diff: 'story',
    hasCode: true,
  },

  // ── SCREEN FILTERS ───────────────────────────────────────────────────────
  {
    id: 'f-cataclysm',
    name: 'Cataclysm',
    description: 'Fills the world with murky smoke.',
    code: '↓ ↓ ↑ → → ↑ ← ← → →',
    category: 'filters',
    unlock: 'Discover Martha\'s Vamos in the Progress menu',
    diff: 'easy',
    hasCode: true,
    fastestWay: 'Find Martha\'s Vamos — a unique vehicle. It appears as a random street encounter in rural Kelly County and Mariana County. Drive it briefly for it to register.',
  },
  {
    id: 'f-dollhouse',
    name: 'Dollhouse',
    description: 'Vivid filter with a narrow aspect ratio.',
    code: '↓ ↓ ↑ → → ↑ ← ← ↓ →',
    category: 'filters',
    unlock: 'Spend 8 hours with your partner',
    diff: 'easy',
    hasCode: true,
    fastestWay: 'Activities with your partner count: eat together, watch TV, work out, go to bars. 8 in-game hours = roughly 16 real minutes at normal speed. Stack couple activities in Ch. 3+ when both are always available.',
  },
  {
    id: 'f-faded-glory',
    name: 'Faded Glory',
    description: 'Color CRT TV filter.',
    code: '↓ ↓ ↑ → → ↑ ← ← ← →',
    category: 'filters',
    unlock: 'Rob 50 stores with your partner',
    diff: 'medium',
    hasCode: true,
    fastestWay: 'Stores to rob: convenience stores, liquor stores, clothing stores. Switch to partner before entering. 50 store robberies across Ch. 2–4. Fastest: chain convenience store robberies in Vice City, 5–6 per session.',
  },
  {
    id: 'f-fast-forward',
    name: 'Fast Forward',
    description: 'Motion blur + accelerated cloud movement.',
    code: null,
    category: 'filters',
    unlock: 'Complete 50 meditations',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Meditation spots are marked on the map (lotus icon). 18 total spots in Leonida. Rotate through all 18 spots, then repeat. 50 meditations = roughly 3 full rotations of all spots.',
  },
  {
    id: 'f-fisheye',
    name: 'Fisheye',
    description: 'Applies a fisheye filter.',
    code: null,
    category: 'filters',
    unlock: 'Catch 100 fish',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Fish at any body of water (rod from Ammu-Nation or tackle shops). Cal\'s fishing quest in Ch. 1 gives early practice. 100 fish across all sessions — aim for 10 per fishing session.',
  },
  {
    id: 'f-videotape',
    name: 'Videotape',
    description: 'Videotape-style filter.',
    code: null,
    category: 'filters',
    unlock: 'Complete 50 activities with your partner',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Activities: eat, work out, go to bars, watch movies, play pool. Each activity = 1 count. 50 activities across Ch. 3–4 when partner is always available.',
  },
  {
    id: 'f-bubblegum',
    name: 'Bubblegum',
    description: 'Turns world purple and yellow with sparkles.',
    code: null,
    category: 'filters',
    unlock: 'Find all 24 collectible cards for the Vice City Flamingos',
    diff: 'hard',
    hasCode: false,
    fastestWay: '24 specific collectible cards from the Vice City Flamingos set. Cards found in safes, gang ops, and pawn shops. Use PowerPyx Flamingos card location guide.',
  },
  {
    id: 'f-migraine',
    name: 'Migraine',
    description: 'Blurred, distorted filter.',
    code: null,
    category: 'filters',
    unlock: 'Survive 6 minutes with a 6-star wanted level',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'Needs max 6-star wanted level. Get in a tank or military vehicle. Find a defensible position (tunnel entrance, narrow alley). 6 real minutes is a long time under full military assault.',
  },
  {
    id: 'f-dark-mirror',
    name: 'Dark Mirror',
    description: 'Flips the world upside down and turns it black.',
    code: null,
    category: 'filters',
    unlock: 'Make $500,000 selling vehicles',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'Sell cars to Moses and Randy consistently from Ch. 2 onwards. At $5,000–$15,000 per car, need 35–100 sales. Fully doable by mid-Ch. 3 with consistent car stealing.',
  },
  {
    id: 'f-hellscape',
    name: 'Hellscape',
    description: 'Turns the world red and orange with heat haze.',
    code: null,
    category: 'filters',
    unlock: 'Steal 100 cop vehicles',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Steal police cars during 1-2 star wanted levels. The easiest: get 1 star, let a cop get out, steal the car, drive to Pay \'n\' Spray, repeat. 100 cop cars at 10/session = 10 sessions.',
  },
  {
    id: 'f-pixel-art',
    name: 'Pixel Art',
    description: 'Applies a pixelated filter.',
    code: null,
    category: 'filters',
    unlock: 'Make $250,000 selling collectibles',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Sell collectible cards, watches, and unique items to pawn shops and fences. Stack with the Dime on the Dollar trophy grind. Collectible cards sell for $500–$6,000 each.',
  },
  {
    id: 'f-neon-jungle',
    name: 'Neon Jungle',
    description: 'Applies neon highlights to the world.',
    code: null,
    category: 'filters',
    unlock: 'Discover all 16 Girlypop Vehicles',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Girlypop Vehicles are uniquely patterned cars found across Leonida. Find and interact with all 16 — they appear in the Progress > Discoveries menu once found.',
  },
  {
    id: 'f-yesteryear',
    name: 'Yesteryear',
    description: 'Black & white CRT TV filter.',
    code: null,
    category: 'filters',
    unlock: 'Discover the Ridgeway in the Progress menu',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Find the Ridgeway — a specific location in Leonida. Drive the rural northern roads (Lummox County or Mariana County) until it registers in Progress > Discoveries.',
  },
  {
    id: 'f-pinhole',
    name: 'Pinhole',
    description: 'Pinhole camera filter.',
    code: null,
    category: 'filters',
    unlock: 'Clear 25 gang operations with your partner',
    diff: 'medium',
    hasCode: false,
    fastestWay: 'Gang ops: yellow icons on the map. Switch to partner before clearing. 25 gang ops with partner present = roughly 25 raids. Stack with the Tyrone narcotics grind.',
  },
  {
    id: 'f-powdered-sugar',
    name: 'Powdered Sugar',
    description: 'Turns the world white with sparkling highlights.',
    code: null,
    category: 'filters',
    unlock: 'Scan all space debris with WAINK',
    diff: 'hard',
    hasCode: false,
    fastestWay: 'Space debris are specific items scattered across Leonida, scanned with the WAINK app. Use PowerPyx WAINK Curiosities guide for all locations.',
  },
  {
    id: 'f-golden-hour',
    name: 'Golden Hour',
    description: 'Golden filter with widescreen aspect ratio.',
    code: null,
    category: 'filters',
    unlock: 'Spend 4 hours holding hands with your partner',
    diff: 'easy',
    hasCode: false,
    fastestWay: 'Walk anywhere holding your partner\'s hand (hold the partner interact button while walking). 4 in-game hours = ~8 real minutes. Easy to stack during story walks in Ch. 3.',
  },
]

const CAT_LABELS: { key: CheatCat; label: string; color: string }[] = [
  { key: 'all',         label: 'All',         color: '#888' },
  { key: 'player',     label: 'Player',       color: '#72dce8' },
  { key: 'combat',     label: 'Combat',       color: '#ff79a8' },
  { key: 'vehicles',   label: 'Vehicles',     color: '#ffd27a' },
  { key: 'environment',label: 'Environment',  color: '#4ade80' },
  { key: 'filters',    label: 'Filters',      color: '#d5a6ff' },
]

const DIFF_META: Record<UnlockDiff, { label: string; color: string }> = {
  easy:   { label: 'Easy',    color: '#4ade80' },
  medium: { label: 'Medium',  color: '#ffd27a' },
  hard:   { label: 'Hard',    color: '#ff79a8' },
  story:  { label: 'Story',   color: '#72dce8' },
}

export default function CheatCodes() {
  const [cat, setCat]           = useState<CheatCat>('all')
  const [query, setQuery]       = useState('')
  const [diffFilter, setDiff]   = useState<UnlockDiff | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied]     = useState<string | null>(null)

  const list = useMemo(() => {
    return CHEATS.filter(c => {
      const matchCat  = cat === 'all' || c.category === cat
      const matchDiff = diffFilter === 'all' || c.diff === diffFilter
      const q = query.toLowerCase()
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.unlock.toLowerCase().includes(q)
      return matchCat && matchDiff && matchQ
    })
  }, [cat, query, diffFilter])

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const confirmed = CHEATS.filter(c => c.hasCode).length
  const total = CHEATS.length

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">

      {/* Header */}
      <div className="mb-7">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff79a8]">Cheats</p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">Cheat Codes</h2>
        <p className="mt-1.5 text-xs text-white/40">
          All 61 cheats — {confirmed} confirmed D-pad codes, {total - confirmed} unlock requirements pending community discovery.
        </p>
      </div>

      {/* How cheats work */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11121d]/90">
        <div className="border-b border-white/[0.07] px-5 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">How Cheats Work in GTA VI</p>
        </div>
        <div className="space-y-2 px-5 py-4">
          {[
            '⚠️ Cheats DISABLE trophies/achievements and saving. Only use in separate save files.',
            '📋 All 61 cheats must be unlocked FIRST by meeting their requirement. Inputting the code without unlocking it does nothing.',
            '📱 To input: press ↑ (D-pad up) to open phone → hold L1/LB → press R1/RB → enter the D-pad sequence.',
            '📋 All cheats appear in Progress Menu → Cheats once unlocked.',
            '💰 No money cheat exists in GTA VI. The $250k cheat only unlocks after finishing the story.',
          ].map((tip, i) => (
            <p key={i} className="text-[11px] leading-5 text-white/60">{tip}</p>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-4 gap-2">
        {[
          { label: 'Total', value: total },
          { label: 'Codes Found', value: confirmed },
          { label: 'Pending', value: total - confirmed },
          { label: 'Story Locked', value: CHEATS.filter(c => c.diff === 'story').length },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.08] bg-[#11121d]/90 px-2 py-2.5 text-center">
            <p className="text-base font-bold text-white">{s.value}</p>
            <p className="text-[8px] text-white/30 uppercase tracking-[0.08em]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CAT_LABELS.map(c => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={clsx(
              'rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition',
              cat === c.key ? 'border-white/25 bg-white/[0.08] text-white' : 'border-white/[0.07] text-white/30 hover:text-white/60'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mb-5 flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search cheats…"
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-2 pl-9 pr-4 text-sm text-white placeholder-white/25 outline-none focus:border-[#ff79a8]/50"
          />
          {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"><X size={11}/></button>}
        </div>
        {/* Difficulty */}
        <select
          value={diffFilter}
          onChange={e => setDiff(e.target.value as UnlockDiff | 'all')}
          className="rounded-xl border border-white/[0.1] bg-[#11121d] px-3 py-2 text-xs text-white/60 outline-none"
        >
          <option value="all">All Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="story">Story</option>
        </select>
      </div>

      <p className="mb-3 text-[10px] text-white/30">{list.length} cheats shown</p>

      {/* Cheat list */}
      <div className="flex flex-col gap-2">
        {list.map(c => {
          const dm = DIFF_META[c.diff]
          const isOpen = expanded === c.id
          return (
            <article key={c.id} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#11121d]/90">
              <button
                onClick={() => setExpanded(isOpen ? null : c.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white/90">{c.name}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em]"
                      style={{ color: dm.color, background: `${dm.color}18`, border: `0.5px solid ${dm.color}30` }}
                    >
                      {dm.label}
                    </span>
                    {!c.hasCode && (
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[8px] text-white/30">
                        Code TBC
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/40">{c.description}</p>
                </div>
                {/* Code badge or TBC */}
                {c.hasCode && c.code ? (
                  <div
                    className="hidden sm:flex items-center gap-1.5 cursor-pointer rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-white/60 hover:bg-white/[0.07]"
                    onClick={e => { e.stopPropagation(); copyCode(c.id, c.code!) }}
                  >
                    {copied === c.id ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                    <span>{c.code}</span>
                  </div>
                ) : null}
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.07] bg-black/15 px-4 pb-4 pt-3 space-y-3">

                  {/* Code */}
                  {c.hasCode && c.code ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                      <div>
                        <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white/30">D-Pad Code</p>
                        <p className="font-mono text-sm text-white">{c.code}</p>
                      </div>
                      <button
                        onClick={() => copyCode(c.id, c.code!)}
                        className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/[0.08]"
                      >
                        {copied === c.id ? <><Check size={11} className="text-green-400" /> Copied</> : <><Copy size={11} /> Copy</>}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
                      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/25">D-Pad Code</p>
                      <p className="mt-0.5 text-xs text-white/35">Not yet discovered by community</p>
                    </div>
                  )}

                  {/* Unlock */}
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                    <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-white/30">🔑 Unlock Requirement</p>
                    <p className="text-xs text-white/70">{c.unlock}</p>
                  </div>

                  {/* Fastest way */}
                  {c.fastestWay && (
                    <div className="flex items-start gap-2 rounded-xl border border-[#4ade80]/15 bg-[#4ade80]/[0.05] px-3 py-2.5">
                      <span className="text-sm">⚡</span>
                      <div>
                        <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[#4ade80]/70">Fastest Way to Unlock</p>
                        <p className="text-[11px] leading-5 text-white/65">{c.fastestWay}</p>
                      </div>
                    </div>
                  )}
                  {c.diff === 'story' && (
                    <div className="flex items-start gap-2 rounded-xl border border-[#72dce8]/15 bg-[#72dce8]/[0.05] px-3 py-2.5">
                      <span className="text-sm">📖</span>
                      <p className="text-[11px] leading-5 text-white/55">Unlocks automatically after completing the main story. No other requirement.</p>
                    </div>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>

      <a
        href="https://www.powerpyx.com/gta-6-all-cheats/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-xs text-white/40 transition hover:bg-white/[0.06] hover:text-white/70"
      >
        <ExternalLink size={12} />
        Full Cheat Code List with Unlock Requirements (PowerPyx)
      </a>

      <p className="mt-5 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Source: PowerPyx · TheClick.gg · Mobalytics · November 2026 · 61 total cheats
      </p>
    </div>
  )
}
