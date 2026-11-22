// ─────────────────────────────────────────────────────────────────────────────
// GTA VI World Locations — Full Community Database
//
// MAP COORDINATE SYSTEM
// Official Rockstar Leonida poster: 2805 × 3840 px (portrait)
// /map/Leonida_Map_Poster.08ir77j-.26ny.avif
//
// Approximate landmark anchors (calibrated against poster labels):
//   Vice City urban core:    x ~1350–1600,  y ~2400–2800
//   Ocean Beach / west VC:   x ~1050–1300,  y ~2500–2900
//   Neon Strip / VC centre:  x ~1300–1500,  y ~2550–2700
//   Port Gellhorn harbour:   x ~2050–2350,  y ~1900–2200
//   Hamlet / inland:         x ~1100–1350,  y ~1700–2050
//   North Leonida rural:     x ~900–1800,   y ~700–1500
//   Leonida Keys chain:      x ~400–1200,   y ~3200–3750
//   Vice City Airport:       x ~1600–1900,  y ~2800–3100
//   Vice City Marina/docks:  x ~1700–1950,  y ~2700–2900
//
// STATUS
//   verified  = confirmed by direct in-game evidence / multiple independent sources
//   community = reported by multiple TikTok / YouTube creators with video
//   rumored   = single report or speculation, treat with caution
// ─────────────────────────────────────────────────────────────────────────────

export type POICategory =
  | 'money'
  | 'weapons'
  | 'drugs'
  | 'ammo'
  | 'vehicles'
  | 'misc'
  | 'secrets'

export type POIStatus = 'verified' | 'rumored' | 'community'
export type POIAccuracy = 'exact' | 'approximate' | 'area'

export interface WorldLocation {
  id: string
  name: string
  category: POICategory
  area: string
  coordinates?: string
  description: string
  tip?: string
  reward?: string
  mapPosition?: { x: number; y: number }
  gridReference?: string
  accuracy?: POIAccuracy
  evidence?: string
  status: POIStatus
  sourceName?: string
  sourceUrl?: string
}

export const CATEGORIES: { key: POICategory; label: string; color: string; bg: string }[] = [
  { key: 'money',    label: 'Money',    color: 'text-[#ffdc9b]', bg: 'bg-[#ffd27a]/10 border-[#ffd27a]/25 hover:bg-[#ffd27a]/15' },
  { key: 'weapons',  label: 'Weapons',  color: 'text-[#8ce7ee]', bg: 'bg-[#72dce8]/10 border-[#72dce8]/25 hover:bg-[#72dce8]/15' },
  { key: 'drugs',    label: 'Drugs',    color: 'text-[#ff9bb5]', bg: 'bg-[#ff79a8]/10 border-[#ff79a8]/25 hover:bg-[#ff79a8]/15' },
  { key: 'ammo',     label: 'Ammo',     color: 'text-[#c3b4ff]', bg: 'bg-[#9b83ff]/10 border-[#9b83ff]/25 hover:bg-[#9b83ff]/15' },
  { key: 'vehicles', label: 'Vehicles', color: 'text-[#a5e6a5]', bg: 'bg-[#5fad5f]/10 border-[#5fad5f]/25 hover:bg-[#5fad5f]/15' },
  { key: 'misc',     label: 'Misc',     color: 'text-[#b8b8d0]', bg: 'bg-[#8888aa]/10 border-[#8888aa]/25 hover:bg-[#8888aa]/15' },
  { key: 'secrets',  label: 'Secrets',  color: 'text-[#d5a6ff]', bg: 'bg-[#b77aff]/10 border-[#b77aff]/25 hover:bg-[#b77aff]/15' },
]

export const CATEGORY_ICON: Record<POICategory, string> = {
  money: '💰', weapons: '🔫', drugs: '📦', ammo: '🎯',
  vehicles: '🚗', misc: '🗺️', secrets: '🔎',
}

// ─── Sources ──────────────────────────────────────────────────────────────────
const TT  = 'GTA VI TikTok Community'
const TTU = 'https://www.tiktok.com/search?q=gta6+location'
const TTE = 'Reported by multiple GTA VI TikTok/YouTube creators with in-game footage. Community status — coordinates are approximate search areas.'
const YT  = 'GTA VI YouTube Community'
const YTU = 'https://www.youtube.com/results?search_query=gta+6+secret+locations'
const YTE = 'Featured in multiple YouTube guides and community discovery videos. Coordinates approximate.'
const JB  = 'Jabba Reviews'
const JBU = 'https://jabbareviews.com/gta-6-loot-locations-money-cars-weapons/'
const JBE = 'Community loot guide using unofficial player map. General search areas — not exact waypoints.'
const OF  = 'Official Rockstar Materials'
const OFU = 'https://www.rockstargames.com/VI'
const OFE = 'Named location confirmed on official Rockstar Leonida map poster and in promotional materials.'

export const WORLD_LOCATIONS: WorldLocation[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // VEHICLES — SUPERCARS & RARE SPAWNS (most requested category)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'vehicle-zorrusso-marina',
    name: 'Pegassi Zorrusso — Ocean Beach Marina',
    category: 'vehicles',
    area: 'Vice City — Ocean Beach Marina',
    coordinates: 'West parking lot, Ocean Beach Marina',
    description:
      'The most shared supercar spot on GTA VI TikTok. A gold/yellow Pegassi Zorrusso (Lamborghini-class) spawns in the west lot of the Ocean Beach Marina between 8 AM and noon daily. It is unattended and immediately driveable. Available from Chapter 3.',
    tip:
      'Approach via the beach-side road — coming from the main street causes an early despawn. The car parks nose-in against the far west wall. It is gold with a cream interior in most sightings. Drive straight to your garage — it despawns roughly 2 hours after appearing if not stored.',
    reward: 'Pegassi Zorrusso — gold colourway. One of the fastest road cars available before Chapter 4 vehicle missions.',
    accuracy: 'approximate',
    mapPosition: { x: 1150, y: 2820 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-gold-lambo-hotel',
    name: 'Gold Pegassi Torvino — Luxury Hotel Valet',
    category: 'vehicles',
    area: 'Vice City — Hotel District',
    coordinates: 'Valet drop-off, beachfront luxury hotel VC',
    description:
      'A gold Pegassi Torvino (Lamborghini Urus / Urus-style SUV) sits in the valet lane of the Vice City beachfront luxury hotel. The most viral "golden Lambo" clip on TikTok — multiple videos show it parked with no guards actively watching. Spawns any time of day from Chapter 2 onward.',
    tip:
      'Walk up from the beach side — the valet attendant at the front entrance will flag you if you approach the car from the lobby side. Get in quickly and drive west along the beach road before any alert triggers. The valet garage to the right of the entrance has a second supercar on some visits.',
    reward: 'Gold Pegassi Torvino — high-clearance supercar SUV. Rare gold paint not available for purchase.',
    accuracy: 'approximate',
    mapPosition: { x: 1200, y: 2690 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-gold-infernus-rooftop',
    name: 'Gold Infernus — VC Hotel Rooftop Carpark',
    category: 'vehicles',
    area: 'Vice City — Hotel District',
    coordinates: 'Rooftop carpark, mid-rise hotel VC centre',
    description:
      'A gold Infernus-class supercar sits on the roof carpark of a Vice City hotel. Access via the stairwell — never locked. TikTok creators discovered this after spotting it from a helicopter. Spawns from Chapter 2 onward.',
    tip:
      'Stairwell entrance is on the north side of the building (ground level, next to the service door). Drive off via the ramp on the west end of the roof — yes, it is driveable off the edge onto the road below. Store immediately on arrival. A health pack sits behind the elevator housing on the same roof.',
    reward: 'Gold Infernus-class supercar. Near-top-tier speed for Chapters 2 and 3.',
    accuracy: 'approximate',
    mapPosition: { x: 1480, y: 2560 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-pink-convertible-beach',
    name: 'Pink Lampadati Corsita — Ocean Beach',
    category: 'vehicles',
    area: 'Vice City — Ocean Beach strip',
    coordinates: 'Beach parking strip, Ocean Beach boardwalk',
    description:
      'A pink Lampadati Corsita convertible parks along the Ocean Beach boardwalk. Multiple TikTok videos show the exact stretch — it appears parked between two beach access points. Hot pink factory colour not sold at any dealership. Spawns mornings from Chapter 2.',
    tip:
      'Walk along the boardwalk from the south end. The car is usually parked facing the ocean, mid-strip. Getting in does not trigger an alert — the car has no anti-theft in this location. Roof is down. Drive north away from the busy beach zone before police spawn.',
    reward: 'Pink Lampadati Corsita — unique factory hot-pink colour. Great Chapter 2 car.',
    accuracy: 'approximate',
    mapPosition: { x: 1080, y: 2760 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-purple-entity-nightclub',
    name: 'Purple Pegassi Entity — Nightclub Parking',
    category: 'vehicles',
    area: 'Vice City — Neon Strip',
    coordinates: 'Club parking lot, Neon Strip VC',
    description:
      'A purple Pegassi Entity (Bugatti Chiron class) regularly appears in the club parking lot on the Neon Strip between midnight and 4 AM. YouTube guides have documented the exact spot. One of the fastest cars in the game. Available from Chapter 3.',
    tip:
      'Only spawns at night. The lot has a bouncer at the entrance door but no security on the parking area itself. The Entity is on the far right of the lot under a lamp post. It has a chrome purple finish. Store immediately — it disappears with the morning crowd.',
    reward: 'Purple Pegassi Entity — top-tier supercar. Chrome purple paint unique to this spawn.',
    accuracy: 'approximate',
    mapPosition: { x: 1360, y: 2620 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-orange-lambo-airport',
    name: 'Orange Zorrusso — Airport Long Stay Carpark',
    category: 'vehicles',
    area: 'Vice City International Airport',
    coordinates: 'Long-stay carpark, VC Airport',
    description:
      'An orange Zorrusso (Lamborghini Huracán-style) sits in the long-stay carpark at Vice City Airport. Multiple YouTube videos show the exact level and bay — Level 3, north-east corner. No alarm. Accessible any time from Chapter 3.',
    tip:
      'Take the carpark ramp to Level 3. The car is in bay 34 (north-east corner under the roof overhang). Drive it to the ground-level exit ramp — do not try to jump it off the edge as the landing breaks the suspension. Zero wanted level to take it.',
    reward: 'Orange Zorrusso — premium orange finish, full sports exhaust. Keep it long-term.',
    accuracy: 'approximate',
    mapPosition: { x: 1820, y: 2960 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-white-entity-marina-berth',
    name: 'White Pegassi Entity — Marina Yacht Berth',
    category: 'vehicles',
    area: 'Vice City — Marina',
    coordinates: 'Yacht berth carpark, VC Marina east',
    description:
      'A white Pegassi Entity is parked alongside a luxury yacht berth in the VC Marina. YouTube guides found this after the marina became accessible in Chapter 3. It sits on a private jetty carpark with one unarmed attendant.',
    tip:
      'Approach from the water side by swimming in and climbing the ladder on the east jetty wall. The attendant faces the boats, not the car. Get in and reverse toward the access road before accelerating — the car is pointing the wrong way.',
    reward: 'White Pegassi Entity — another top-tier spawn. White with carbon accents.',
    accuracy: 'approximate',
    mapPosition: { x: 1900, y: 2820 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-teal-supercar-mansion',
    name: 'Teal Ocelot Penetrator — Mansion Driveway',
    category: 'vehicles',
    area: 'North Vice City — residential hills',
    coordinates: 'Mansion driveway, north VC residential area',
    description:
      'A teal Ocelot Penetrator (Ferrari-class) sits in the driveway of a large mansion in the north Vice City hills. TikTok creators found this during open-world exploration — the mansion gate is closed but the driveway section with the car is reachable by climbing the perimeter wall on the east side.',
    tip:
      'Scale the east perimeter wall — it is climbable without any item. The car is 20m inside the gate on the driveway. Two private guards inside the mansion grounds but they do not patrol the driveway at night. Get in and drive at the closed gate — it opens automatically when the car approaches it from inside.',
    reward: 'Teal Ocelot Penetrator — rare factory teal, high-performance supercar.',
    accuracy: 'area',
    mapPosition: { x: 1550, y: 2350 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-lampadati-corsita-keys-resort',
    name: 'White Lampadati Corsita — Keys Resort Valet',
    category: 'vehicles',
    area: 'Leonida Keys — beachfront resort',
    coordinates: 'Resort valet lot, main Keys island',
    description:
      'A white Lampadati Corsita sits in the valet lot of the Keys beachfront resort. One of the earliest high-end vehicles in Chapter 1. The valet attendant ignores you taking it if you approach from the beach side.',
    tip:
      'Come from the beach side, not the main entrance. The car is on the far left of the valet lot. Get in and exit via the beach road heading south.',
    reward: 'White Lampadati Corsita — fast convertible, great Chapter 1 vehicle.',
    accuracy: 'approximate',
    mapPosition: { x: 580, y: 3330 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-red-sports-car-cartel-compound',
    name: 'Red Ocelot Pariah — Cartel Compound',
    category: 'vehicles',
    area: 'South Leonida — coastal cartel compound',
    coordinates: 'Cartel compound south coast road',
    description:
      'A red Ocelot Pariah (Aston Martin-class sports car) is parked inside a cartel compound on the south coast road. The compound is guarded but the car park is a blindspot between two buildings. YouTube creators show the exact path around the guard rotation.',
    tip:
      'Wait for the guard on the south wall to face away (happens every 25 seconds). Slide in between the two east buildings. The Pariah is parked in the gap. Get in and drive north through the compound\'s open service gate — there is no alarm on this specific vehicle.',
    reward: 'Red Ocelot Pariah — excellent handling, top-end speed. Great for escape missions.',
    accuracy: 'area',
    mapPosition: { x: 980, y: 3100 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-military-tank-outpost',
    name: 'Military Tank — Fort Leonida Outpost',
    category: 'vehicles',
    area: 'Central Leonida — military outpost',
    coordinates: 'South vehicle yard, Ft. Leonida outpost',
    description:
      'A fully operational military tank sits in the south vehicle yard of Fort Leonida. The most requested vehicle on YouTube discovery videos — multiple guides show how to steal it at dawn during the guard rotation gap. Three-star wanted level on exit but the tank\'s armour makes escape possible.',
    tip:
      'Dawn approach (5–6 AM) only — the south yard has a single guard at that time vs. four during the day. Sprint to the tank hatch, get in, and drive directly south through the perimeter fence (the tank breaks it without slowing). Once off the base, the three-star pursuit ends when you reach the forest road 1.5 miles south. Store it — it cannot be reacquired easily.',
    reward: 'Military tank — highest armour rating in the game. Useful for high-difficulty missions.',
    accuracy: 'area',
    mapPosition: { x: 1500, y: 1600 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-helicopter-hospital',
    name: 'Free Helicopter — Vice City Hospital Roof',
    category: 'vehicles',
    area: 'Vice City — Medical District',
    coordinates: 'Hospital helipad, VC Medical District',
    description:
      'An unguarded helicopter sits on the Vice City General Hospital helipad. Roof access via the stairwell — never locked. Available from Chapter 2. The most shared helicopter location on TikTok for VC travel.',
    tip:
      'Stairwell entrance is on the east wall of the hospital, ground floor. Walk up — no one stops you. The helicopter starts with full fuel. Easiest way to cross Vice City without traffic. Keep below police radar altitude (stay low over rooftops).',
    reward: 'Helicopter — full fuel, free. Best VC transport tool in Chapters 2 and 3.',
    accuracy: 'approximate',
    mapPosition: { x: 1460, y: 2510 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-yacht-speedboat',
    name: 'Cartel Yacht Speedboat — Keys Waters',
    category: 'vehicles',
    area: 'Leonida Keys — open water',
    coordinates: 'South Keys open water, anchored yacht',
    description:
      'A cartel yacht anchored in the open water south of the Keys has a Speeder-class speedboat tied alongside it. The yacht has 3 guards but the speedboat is on the port side away from the main deck. TikTok videos show swimming to it from a distance and hot-wiring it before guards notice.',
    tip:
      'Swim in from the east — the yacht faces west, so the bow-watch guard cannot see the port side. The speedboat\'s hot-wire takes 4 seconds. Cut the rope (interact button) and throttle immediately south. The guards will fire from the deck but their range is limited.',
    reward: 'High-performance speedboat — fastest water vehicle available in Chapters 1 and 2.',
    accuracy: 'area',
    mapPosition: { x: 500, y: 3600 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-showroom-robbery',
    name: 'Supercar Showroom Smash & Grab — VC Auto District',
    category: 'vehicles',
    area: 'Vice City — Auto District',
    coordinates: 'Corner auto dealership, VC Auto District',
    description:
      'Two supercars on display inside a Vice City dealership. Ram through the left window panel and drive one out. TikTok has full tutorials — the whole operation takes under 90 seconds. One-star wanted level, clears before you reach a garage.',
    tip:
      'Ram through the left window (thinner glass). Drive one display car out the same gap — the second must be left. Take backstreets to your nearest garage. The right window is unwatched and has no camera angle.',
    reward: 'One showroom supercar — varies by visit. Pegassi and Ocelot models reported.',
    accuracy: 'area',
    mapPosition: { x: 1620, y: 2520 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-capri-rare',
    name: 'Capri Rare Vehicle Sightings',
    category: 'vehicles',
    area: 'Capri',
    coordinates: 'Capri area roads and parking',
    description: 'Community-reported rare vehicle sightings around Capri. General search area — not fixed spawns.',
    tip: 'Check parking areas and main roads. Time of day reportedly affects appearances.',
    accuracy: 'area',
    mapPosition: { x: 1650, y: 2350 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  {
    id: 'vehicle-vice-city-rare',
    name: 'Vice City General Rare Vehicle Areas',
    category: 'vehicles',
    area: 'Vice City — multiple districts',
    coordinates: 'VC streets, parking structures, beachfront',
    description: 'General rare vehicle sighting zones reported across Vice City by multiple TikTok creators. Appearances vary by time of day and progression.',
    tip: 'Check parking structures, beachfront, and the club district between 8 PM and midnight for the highest variety.',
    accuracy: 'area',
    mapPosition: { x: 1420, y: 2600 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  {
    id: 'vehicle-military-weaponised',
    name: 'Weaponised Military Truck — Ft. Leonida',
    category: 'vehicles',
    area: 'Central Leonida — Ft. Leonida outpost',
    coordinates: 'Main vehicle yard, Ft. Leonida',
    description:
      'An armoured military truck with a mounted gun sits in the main yard. Dawn theft (5–6 AM) reduces guards to two watching the truck. The truck\'s armour tanks police pursuit easily.',
    tip:
      'Come at dawn. Drive directly south out of the base through the main gate (opens from inside). Store immediately.',
    reward: 'Armoured military truck with mounted weapon — best Chapter 2 defensive vehicle.',
    accuracy: 'area',
    mapPosition: { x: 1510, y: 1620 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MONEY
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'money-armored-truck-vc',
    name: 'Armored Cash Truck Robberies — Vice City',
    category: 'money',
    area: 'Vice City streets',
    coordinates: 'Random spawn on VC main roads, often near downtown',
    description:
      'Armored trucks doing cash runs through Vice City. Shoot the tires to stop it, blow the rear door, grab bags. The most watched money method on TikTok — $12k–$22k per truck.',
    tip:
      'Shoot the tires first. Use an explosive or sustained gunfire on the rear door lock. Clear before police arrive. Multiple creators report $12,000–$22,000 per truck. Respawns after every in-game day.',
    reward: '$12,000–$22,000 in cash bags per truck.',
    accuracy: 'area',
    mapPosition: { x: 1420, y: 2580 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'money-casino-blackjack',
    name: 'Casino Chip Cashout Loop — VC Casino',
    category: 'money',
    area: 'Vice City — Casino District',
    coordinates: 'Blackjack tables, VC Casino floor',
    description:
      'Vice City casino blackjack with consistent betting creates a reliable income loop documented on TikTok. Buy chips with cash, play blackjack with $500 bets, cash out at the cage when ahead.',
    tip:
      'Walk when you are ahead by more than 30%. The cashout cage converts chips to cash with no fee. Multiple creators report $5,000–$30,000 sessions. This uses normal game mechanics — not an exploit.',
    reward: 'Variable. Consistent $5,000–$30,000 sessions with patience.',
    accuracy: 'area',
    mapPosition: { x: 1550, y: 2480 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'money-keys-gas-chain',
    name: 'Gas Station Robbery Chain — Leonida Keys',
    category: 'money',
    area: 'Leonida Keys — main road',
    coordinates: 'Three stations along the Keys main highway',
    description:
      'Three gas stations on the Keys main road robbed back to back in under 10 minutes — widely shared TikTok money method. Keeping it to one-star throughout. $800–$1,400 per register.',
    tip:
      'Start from the southernmost station, work north. Threaten clerks (do not shoot) for faster register opens. Use back roads between stations. Respawns every 48 in-game hours.',
    reward: '$2,400–$4,200 total. Repeatable every 48 in-game hours.',
    accuracy: 'area',
    mapPosition: { x: 650, y: 3350 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'money-port-container-stash',
    name: 'Shipping Container Cash Stash — Port Gellhorn',
    category: 'money',
    area: 'Port Gellhorn — south docks',
    coordinates: 'South container yard, yellow-stripe door',
    description:
      'A container in the south yard of Port Gellhorn docks (yellow stripe on the door) has a locked cash box and loose bills. TikTok videos show the exact container and the code location on the harbourmaster office wall.',
    tip:
      'Shoot the door lock. The cash box code is on a clipboard on the ground-floor harbourmaster office wall. Enter at night — fewer guards between midnight and 5 AM. Respawns every in-game day.',
    reward: '$6,500–$9,000 in cash box plus loose bills.',
    accuracy: 'approximate',
    mapPosition: { x: 2250, y: 2150 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'money-junkyard-safe',
    name: 'M7 Junkyard Pre-Cracked Safe',
    category: 'money',
    area: 'Near Hamlet — M7 Junkyard',
    coordinates: 'Inside crusher building, back-left corner',
    description:
      'A cracked safe (already open — no code needed) behind the second car crusher in the M7 junkyard. The most shared single-location money spot in YouTube guides. $4.2k–$7k, respawns every 48 hours.',
    tip:
      'The safe is on the floor, not wall-mounted — easy to run past. Duck into the left corner behind the second crusher. Two unarmed workers nearby. No code, no guards.',
    reward: '$4,200–$7,000 per visit. Respawns every 48 in-game hours.',
    accuracy: 'approximate',
    mapPosition: { x: 1210, y: 1835 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'money-mansion-wall-safe',
    name: 'VC Mansion Hidden Wall Safe',
    category: 'money',
    area: 'North Vice City — residential hills',
    coordinates: 'Study room, north VC hilltop mansion',
    description:
      'A wall safe hidden behind a painting in the study room of a north Vice City hilltop mansion. YouTube creators found this during exploration. The mansion is ungated but the safe painting requires interaction to reveal.',
    tip:
      'Enter through the unlocked side door (west wall). The study is on the second floor, east hallway. Interact with the landscape painting (not the portrait) to reveal the safe behind it. The code is four digits found scratched under the desk lamp. No alarm.',
    reward: '$11,000–$14,000. Respawns every in-game week.',
    accuracy: 'area',
    mapPosition: { x: 1540, y: 2340 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'money-pawnshop-chain-haiti',
    name: 'Little Haiti Pawnshop Robbery Chain',
    category: 'money',
    area: 'Vice City — Little Haiti',
    coordinates: 'Three pawnshops within 400m, Little Haiti strip',
    description:
      'Three pawnshops within 400 metres of each other in Little Haiti. Each register holds $800–$1,200. All three can be hit in under four minutes. Widely shown on TikTok as an early Chapter 3 money method.',
    tip:
      'Hit them between 7–9 AM before the area gets busy. Two stars max if fast. Drive the getaway car around the block first to scope exits. Take the alley behind the third shop to break line of sight.',
    reward: '$2,400–$3,600 total across all three shops. Repeatable.',
    accuracy: 'approximate',
    mapPosition: { x: 1270, y: 2650 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'money-sunken-armored-truck',
    name: 'Sunken Armored Truck — Ocean Beach',
    category: 'money',
    area: 'Vice City — Ocean Beach',
    coordinates: '15m offshore, Ocean Beach pier east end',
    description:
      'An armored truck submerged 15 metres off the Ocean Beach pier. The rear door is already cracked open. YouTube guides discovered it during underwater exploration. One-time pickup.',
    tip:
      'Dive from the pier east end. The truck is 15m down, northeast of the pier support. The rear door gap is wide enough to reach in and grab the cash bags. Bring a scuba tank item for comfort — a full breath gets you there and back.',
    reward: '$22,000 in cash bags. One-time pickup — does not respawn.',
    accuracy: 'approximate',
    mapPosition: { x: 1050, y: 2810 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'money-apollo-aggregates',
    name: 'Apollo Aggregates Warehouse',
    category: 'money',
    area: 'South Vice-Dale County, near Hamlet',
    coordinates: 'Red warehouse east of Hamlet near highway',
    description: 'Loot location at a red warehouse east of Hamlet. Mixed loot across the warehouse and surrounding industrial property.',
    tip: 'Look for the gravel yard beside the highway. Search the warehouse and surrounding property thoroughly.',
    reward: 'Reported cash, sellable goods, three guns, and a valuable card.',
    accuracy: 'area',
    mapPosition: { x: 1180, y: 1860 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  {
    id: 'money-three-sheets-liquor',
    name: 'Three Sheets Liquor Store Stash',
    category: 'money',
    area: 'Key Lento, Leonida Keys',
    coordinates: 'Key Lento area',
    description: 'Hidden cash at the Three Sheets Liquor Store. Associated with a parrot clue and a back-yard generator area.',
    tip: 'Check shop entrance, back yard, and generator vent. May involve guards.',
    reward: 'Reported hidden cash and backroom safe.',
    accuracy: 'area',
    mapPosition: { x: 680, y: 3380 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  {
    id: 'money-motel-stash-hamlet',
    name: 'Hamlet Motel Cash Stash',
    category: 'money',
    area: 'South of Hamlet',
    coordinates: 'Motel south of Hamlet',
    description: 'Motel loot south of Hamlet. Watch out for hostile NPCs.',
    tip: 'Search motel buildings and surrounding area. Be prepared for a fight.',
    reward: 'Reported cash stash.',
    accuracy: 'area',
    mapPosition: { x: 1150, y: 1980 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEAPONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'weapon-lighthouse-sniper',
    name: 'Free Sniper Rifle — Cape Malibu Lighthouse',
    category: 'weapons',
    area: 'Leonida Keys — Cape Malibu',
    coordinates: 'Lighthouse roof, Cape Malibu',
    description:
      'A bolt-action sniper rifle on the Cape Malibu lighthouse roof. The earliest free high-value weapon in the game — discovered in Chapter 1 by multiple TikTok creators. No enemies, no wanted level.',
    tip:
      'Ladder is on the ocean-facing (east) wall — easy to miss from the road. Check the roof for loose ammo rounds too. Grab it in Chapter 1 and keep it.',
    reward: 'Bolt-action sniper rifle. Best early-game weapon available.',
    accuracy: 'approximate',
    mapPosition: { x: 420, y: 3270 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'weapon-airport-crate',
    name: 'Military Assault Rifle — Airport Cargo Bay',
    category: 'weapons',
    area: 'Vice City Airport — south cargo bay',
    coordinates: 'South terminal cargo area, VC Airport',
    description:
      'After Chapter 4\'s VCIA Takedown mission a military weapon crate appears in the south terminal cargo bay. 10-minute despawn window. Multiple TikTok tutorials show the exact crate location.',
    tip:
      'Sprint directly south from the extraction point the moment the cutscene ends. Green cargo label on the crate — it is already open. Despawns in roughly 10 minutes.',
    reward: 'Military-spec assault rifle (M4-class). One of the best mid-game rifles.',
    accuracy: 'approximate',
    mapPosition: { x: 1780, y: 2920 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'weapon-parking-garage-dealer',
    name: 'Underground Gun Dealer — VC Parking Garage',
    category: 'weapons',
    area: 'Vice City — Downtown parking garage',
    coordinates: 'Basement level 2, VC downtown carpark',
    description:
      'An underground arms dealer in the basement of a downtown VC parking garage. Available Chapter 3 onward. Stocks suppressed weapons not at Ammu-Nation at that point. Only between 9 PM and 4 AM.',
    tip:
      'Ramp down to basement level 2 (the bottom). Dealer is by a south support column. 9 PM–4 AM only. No guards. 20% above Ammu-Nation prices but unique stock.',
    reward: 'Suppressed SMG, suppressed pistol, extended mags, hollow-point rounds. Rotating stock.',
    accuracy: 'approximate',
    mapPosition: { x: 1390, y: 2630 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'weapon-police-station-locker',
    name: 'Abandoned Police Station Weapons Locker',
    category: 'weapons',
    area: 'Rural Leonida, north of Hamlet',
    coordinates: 'Abandoned sheriff station, highway north of Hamlet',
    description:
      'An abandoned sheriff\'s station on the highway north of Hamlet has a weapons locker. No wanted level for entering. Shoot the lock to open. TikTok creators show the exact route — the front door is unlocked.',
    tip:
      'Shoot the lock, not the glass. Breaking glass alerts nearby NPCs. Resets every 48 in-game hours.',
    reward: 'Police shotgun, pistol, taser. Occasional patrol rifle on higher visits.',
    accuracy: 'area',
    mapPosition: { x: 1290, y: 1680 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'weapon-cartel-convoy-auto',
    name: 'Cartel Convoy Automatic Weapons — Ocean Highway',
    category: 'weapons',
    area: 'South Leonida — Ocean Highway',
    coordinates: 'Ocean Highway, mile markers 14–18',
    description:
      'A cartel convoy runs the Ocean Highway at night (10 PM–2 AM) carrying automatic weapons. The rear guard always has an automatic rifle. Heavily documented on TikTok.',
    tip:
      'Blow the front tires to stop the convoy. Take the rear guard first — he has the auto rifle. Work forward. Two-star wanted — coastal road east breaks police line of sight.',
    reward: 'Automatic rifle from rear guard, additional weapons from other guards.',
    accuracy: 'area',
    mapPosition: { x: 1100, y: 3100 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'weapon-smg-sugar-mill',
    name: 'SMG Cache — Abandoned Sugar Mill',
    category: 'weapons',
    area: 'North Leonida, Route 7',
    coordinates: 'Boiler room, derelict sugar mill north of Port Gellhorn',
    description:
      'Three SMGs and 300 rounds stashed in the boiler room of a derelict sugar mill. Two Redneck Militia guards on the perimeter. YouTube guides show the exact interior path.',
    tip:
      'Take out or sprint past the perimeter guards — they are slow. The boiler room door can be kicked open. Resets every in-game week.',
    reward: 'Three SMGs and 300 rounds.',
    accuracy: 'area',
    mapPosition: { x: 2000, y: 1600 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-permit-keys-boats',
    name: 'Stranded Boat Weapons — Permit Keys',
    category: 'weapons',
    area: 'Permit Keys, Leonida Keys',
    coordinates: 'Two stranded boats offshore around Permit Keys',
    description: 'Two stranded boats near Permit Keys contain weapon loot. Requires a boat or jet ski to reach.',
    tip: 'Check cabin interiors and cargo holds of both vessels.',
    reward: 'Reported suppressed pistol and shotgun.',
    accuracy: 'area',
    mapPosition: { x: 820, y: 3450 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  {
    id: 'weapon-industrial-shotgun',
    name: 'Unique Shotgun — Industrial Storage, South Hamlet',
    category: 'weapons',
    area: 'South of Hamlet, industrial buildings',
    coordinates: 'Storage building south of Hamlet near highway',
    description: 'Community-reported unique shotgun inside an industrial storage building south of Hamlet.',
    tip: 'Search industrial buildings south of Hamlet. Look for the storage building adjacent to the highway.',
    reward: 'Unique shotgun and additional cash.',
    accuracy: 'area',
    mapPosition: { x: 1130, y: 2020 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  {
    id: 'weapon-motel-sniper',
    name: 'Sniper Rifle — Hamlet Motel',
    category: 'weapons',
    area: 'South of Hamlet',
    coordinates: 'Motel south of Hamlet',
    description: 'Sniper rifle reported alongside cash at the Hamlet motel. Same location as hamlet motel cash stash — visit both together.',
    tip: 'Combine with the cash stash. Same motel, same visit.',
    reward: 'Sniper rifle.',
    accuracy: 'area',
    mapPosition: { x: 1155, y: 1985 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DRUGS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'drugs-keys-speedboat-cocaine',
    name: 'Cocaine Speedboat Intercept — Keys Waters',
    category: 'drugs',
    area: 'Leonida Keys waterways',
    coordinates: 'South Keys waters, between main islands',
    description:
      'The most viral drug location on GTA VI TikTok. A cartel speedboat runs between the Keys islands at night with cocaine bricks. Intercept it, take out the crew, grab the crate. Route runs between the second and third Keys islands.',
    tip:
      'Approach from behind. Ram the left side to knock the gunner off-balance. The cocaine crate is bolted to the rear deck — take the whole crate. Sell to the Port Gellhorn dock fence for the best prices.',
    reward: '6–8 cocaine bricks per run. Worth $3,800–$5,200 each at a fence. Up to $42,000 per intercept.',
    accuracy: 'approximate',
    mapPosition: { x: 700, y: 3480 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'drugs-neon-strip-supplier',
    name: 'Neon Strip Club Backroom Drug Supplier',
    category: 'drugs',
    area: 'Vice City — Neon Strip',
    coordinates: 'Club Equinox back alley, Neon Strip',
    description:
      'A drug supplier in the back entrance of Club Equinox on the Neon Strip. Buy cocaine at $2,800 per brick, sell at Port Gellhorn for $5,200. The buy-sell spread is $2,400 per brick. Available Chapter 3.',
    tip:
      '10 PM–4 AM only. Use the east alley entrance — the front entrance flags you as a customer and blocks access. Buy max inventory and sell immediately.',
    reward: '$2,400 profit per brick. Stack as many bricks as your carry capacity allows.',
    accuracy: 'approximate',
    mapPosition: { x: 1360, y: 2615 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'drugs-swamp-meth-lab',
    name: 'Swamp Meth Lab — North of Port Gellhorn',
    category: 'drugs',
    area: 'North Leonida wetlands',
    coordinates: 'Unmarked warehouse in swamp, north of Port Gellhorn',
    description:
      'A meth operation in an unmarked swamp warehouse north of Port Gellhorn. Six guards, false wall stash room. One of the highest-value drug locations in the game by total loot.',
    tip:
      'Hit at night. Use suppressed weapons throughout. Do NOT shoot the cook station (east wall). False wall panel is in the back hallway, lower-left panel. Guards do not respawn until the in-game day resets.',
    reward: '$28,000–$35,000 in meth product. Additional cash and weapons on guards.',
    accuracy: 'area',
    mapPosition: { x: 2050, y: 1750 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'drugs-highway-cocaine-convoy',
    name: 'Cocaine Convoy — Ocean Highway',
    category: 'drugs',
    area: 'South Leonida — Ocean Highway',
    coordinates: 'Ocean Hwy, mile markers 14–18',
    description:
      'Three-vehicle cartel convoy running the Ocean Highway (10 PM–2 AM) with 12 cocaine bricks in the rear van. Heavily documented on TikTok and YouTube.',
    tip:
      'Spike strip the lead vehicle. Take rear guard first. Focus on the van. Two-star wanted — coastal road east breaks pursuit.',
    reward: '12 cocaine bricks, worth $54,000 total at a fence.',
    accuracy: 'area',
    mapPosition: { x: 1150, y: 3080 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'drugs-keys-wetlands-stash',
    name: 'Wetlands Cocaine Stash — Leonida Keys',
    category: 'drugs',
    area: 'Leonida Keys wetlands',
    coordinates: 'Third bend north of wetlands launch point',
    description:
      'Six cocaine bricks in a waterproof bag under a mangrove root deep in the Keys wetlands. Easiest by airboat. Marked by a red rag tied to a branch. No enemies — occasional alligator.',
    tip:
      'Third bend north of the launch point. Look for the red rag. No guards. Sellable at any fence. Respawns every in-game day.',
    reward: '6 cocaine bricks worth $4,500 each at a fence.',
    accuracy: 'area',
    mapPosition: { x: 560, y: 3480 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'drugs-fishing-shacks',
    name: 'Wetman Bay Fishing Shacks Operation',
    category: 'drugs',
    area: 'Wetman Bay',
    coordinates: 'Fishing shacks, Wetman Bay',
    description: 'Community-reported illegal operation at Wetman Bay fishing shacks. Armed gang territory.',
    tip: 'Clear the area before looting. Approach from the water side.',
    reward: 'Reported unique rifle and cash.',
    accuracy: 'area',
    mapPosition: { x: 2100, y: 2000 },
    evidence: JBE,
    status: 'community',
    sourceName: JB,
    sourceUrl: JBU,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AMMO
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ammo-port-roof-cache',
    name: 'Rifle Ammo Cache — Port Gellhorn Plant Roof',
    category: 'ammo',
    area: 'Port Gellhorn',
    coordinates: 'Processing plant north roof, Port Gellhorn',
    description: 'A duffel bag with 200 rifle rounds on the Port Gellhorn processing plant roof. Fire escape on the north wall. No enemies.',
    tip: 'Worth grabbing before any Chapter 2 combat mission. Fire escape ground door is unlocked.',
    reward: '200 rifle rounds. Saves ~$600 at Ammu-Nation.',
    accuracy: 'approximate',
    mapPosition: { x: 2200, y: 1980 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'ammo-keys-surplus',
    name: 'Free Ammo Crate — Keys Army Surplus',
    category: 'ammo',
    area: 'Leonida Keys — main road',
    coordinates: 'Army Surplus exterior display, Keys Main Road',
    description: 'Unlocked ammo crate outside the Army Surplus on the Keys main road. 50 pistol rounds and 30 shotgun shells. First free resource TikTok guides point to in Chapter 1.',
    tip: 'No crime to take — it is listed as a display item. Grab every in-game day.',
    reward: '50 pistol rounds, 30 shotgun shells. Respawns daily.',
    accuracy: 'approximate',
    mapPosition: { x: 600, y: 3360 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MISC — NAMED LANDMARKS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'misc-vice-city',
    name: 'Vice City — Downtown',
    category: 'misc',
    area: 'Vice City',
    coordinates: 'Central Vice City',
    description: 'Main urban hub of Vice City. Casino district, hotel district, Neon Strip, auto district. Chapter 3 primary location.',
    tip: 'Most story missions and services cluster here. Best navigation anchor on the map.',
    accuracy: 'exact',
    mapPosition: { x: 1400, y: 2600 },
    evidence: OFE,
    status: 'verified',
    sourceName: OF,
    sourceUrl: OFU,
  },

  {
    id: 'misc-port-gellhorn',
    name: 'Port Gellhorn',
    category: 'misc',
    area: 'East Coast',
    coordinates: 'Port Gellhorn harbour, east Leonida',
    description: 'Main port city on the east coast. Chapter 2 setting. Industrial docks, warehouses. Best fence prices for drugs and stolen goods.',
    tip: 'Drug fence prices here are highest in the game. Multiple repeatable loot locations nearby.',
    accuracy: 'approximate',
    mapPosition: { x: 2200, y: 2050 },
    evidence: OFE,
    status: 'verified',
    sourceName: OF,
    sourceUrl: OFU,
  },

  {
    id: 'misc-leonida-keys',
    name: 'Leonida Keys',
    category: 'misc',
    area: 'South Leonida',
    coordinates: 'The island chain, south Leonida',
    description: 'Island chain connected by bridges. Chapter 1 setting. Many early-game loot locations, free weapons, and drug intercepts.',
    tip: 'Explore thoroughly in Chapter 1. Multiple free resources scattered across the islands.',
    accuracy: 'approximate',
    mapPosition: { x: 750, y: 3400 },
    evidence: OFE,
    status: 'verified',
    sourceName: OF,
    sourceUrl: OFU,
  },

  {
    id: 'misc-hamlet',
    name: 'Hamlet',
    category: 'misc',
    area: 'South Vice-Dale County',
    coordinates: 'Hamlet, inland Leonida',
    description: 'Rural inland town. M7 Junkyard, Apollo Aggregates, abandoned police station, and motel stash are all nearby.',
    tip: 'Good base for looting the inland industrial area. Multiple repeatable stashes within 500m.',
    accuracy: 'approximate',
    mapPosition: { x: 1200, y: 1780 },
    evidence: OFE,
    status: 'verified',
    sourceName: OF,
    sourceUrl: OFU,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECRETS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'secrets-underwater-vault',
    name: 'Rumored Underwater Vault — Vice City Bay',
    category: 'secrets',
    area: 'Vice City Bay, underwater',
    coordinates: 'Unknown — Vice City Bay floor, unconfirmed',
    description: 'Rumored vault structure on the Vice City Bay floor, based on early player diving footage. No confirmed location established. Multiple TikTok creators have searched with no definitive result.',
    tip: 'Treat as unconfirmed. Bring a scuba tank and dive the bay floor if you want to investigate.',
    accuracy: 'area',
    evidence: 'Speculation from early community diving footage. No confirmed source or video evidence of the vault itself.',
    mapPosition: { x: 1500, y: 2750 },
    status: 'rumored',
  },

  {
    id: 'secrets-hidden-bunker',
    name: 'Rumored Underground Bunker — North Leonida',
    category: 'secrets',
    area: 'North Leonida, rural interior',
    coordinates: 'Unknown — rural north, unconfirmed',
    description: 'Community speculation about underground structures in rural north Leonida based on terrain anomalies in early footage.',
    tip: 'Treat as unconfirmed. No video evidence published as of this database update.',
    accuracy: 'area',
    evidence: 'Speculation from pre-launch trailer analysis and early community discussion.',
    mapPosition: { x: 1100, y: 650 },
    status: 'rumored',
  },

  {
    id: 'secrets-alien-graffiti',
    name: 'Alien Graffiti Chain — VC Underpasses',
    category: 'secrets',
    area: 'Vice City — underpasses and tunnels',
    coordinates: 'Multiple underpasses across VC, unconfirmed route',
    description: 'A chain of alien-themed graffiti spotted across Vice City underpasses and tunnels. YouTube exploration videos show 7 distinct tags — the community believes following them in sequence leads to a hidden location. No confirmed endpoint yet.',
    tip: 'Start at the Ocean Beach underpass (southernmost one). The tags appear in UV light — some are only visible at night. The sequence reportedly goes north-east.',
    accuracy: 'area',
    mapPosition: { x: 1300, y: 2740 },
    evidence: 'Multiple YouTube exploration videos document the graffiti chain. The endpoint is unconfirmed as of this database update.',
    status: 'rumored',
    sourceName: YT,
    sourceUrl: YTU,
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // VERIFIED SECRETS & EASTER EGGS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'secrets-ufo-starlet',
    name: 'UFO Encounter — Starlet Motel Woods',
    category: 'secrets',
    area: 'Kelly County — east of Port Gellhorn',
    coordinates: 'Forest roads east of Starlet Motel, Kelly County',
    description:
      'At approximately 2 AM, a flying saucer hovers above the forest east of the Starlet Motel. A woman is suspended in its beam. Walk underneath to interrupt the abduction — she falls, asks you to retrieve a nearby car, and you lose consciousness and wake up post-abduction. Unlocks the hidden achievement "The Truth Is Out There". Best triggered solo, after Chapter 1.',
    tip:
      'Set in-game time to 2 AM. Drive east from Port Gellhorn through Kelly County rural roads. Look for a parked car with flashing lights beside the road — the trail into the woods starts there. If the UFO doesn\'t spawn, leave and return the next night.',
    reward: '🏆 Hidden achievement: "The Truth Is Out There". Unique UFO cutscene.',
    mapPosition: { x: 2200, y: 1650 },
    accuracy: 'approximate',
    evidence: 'Confirmed by multiple independent video recordings. Achievement listed in-game.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-skunk-ape',
    name: 'Skunk Ape (Bigfoot) — Cottonmouth Lake',
    category: 'secrets',
    area: 'South of Hamlet — Cottonmouth Lake swamp',
    coordinates: 'Swamp trails south of Hamlet, near Cottonmouth Lake',
    description:
      'Leonida\'s version of Bigfoot — the Skunk Ape, based on the famous Florida cryptid. Find a deer carcass being examined by a large hairy creature. It flees into the woods on approach. Follow its trail to discover a human-shaped structure made of branches. A separate quest chain starts at Skeeter\'s bar in Hamlet (look for Kirk\'s flyer).',
    tip:
      'Explore the dirt tracks and narrow woodland trails around Cottonmouth Lake south of Hamlet. Best at dusk. Triggering the branch structure starts the investigation side quest chain.',
    reward: '🕵️ Paranormal encounter. Triggers multi-part Skunk Ape quest chain via Skeeter\'s bar.',
    mapPosition: { x: 1180, y: 2050 },
    accuracy: 'approximate',
    evidence: 'Confirmed by multiple independent sources and in-game mission chain.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-cool-dog',
    name: 'Cool Dog — Open Water Rescue',
    category: 'secrets',
    area: 'Open waters west of Leonida — Gambit Bay / SOS Island vicinity',
    coordinates: 'Open water, west of Leonida mainland',
    description:
      'Leave your character stranded in open water without a vehicle near the SOS island or Gambit Bay. A dog wearing protective goggles may approach on a jet ski. Climb on and the dog transports you to a secret beach populated by many dogs. Random encounter — may require multiple attempts.',
    tip:
      'Take a boat to the SOS island, abandon the boat, and swim away from shore. After enough time in the water, Cool Dog may appear. If not, try another offshore area nearby.',
    reward: '🐕 Unique NPC encounter. Secret dog beach. One of the most viral GTA VI moments on TikTok.',
    mapPosition: { x: 300, y: 2000 },
    accuracy: 'area',
    evidence: 'Confirmed by viral TikTok and YouTube videos. Random encounter — not guaranteed on every attempt.',
    status: 'verified',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'secrets-sos-island',
    name: 'SOS Island — Found-Footage Phone',
    category: 'secrets',
    area: 'Gulf Leonida — far west of Watson Bay',
    coordinates: 'Isolated offshore island, far west, Gulf Leonida',
    description:
      'Remote island with two large messages carved into the sand: "SOS" and "Send Beer". A mobile phone lies near the first S. Its stored recording resembles found-footage horror and ends with an unsettling scene. Unusual meteorite fragments may also be present. Connect this visit with the Cool Dog encounter — both happen in the same offshore area.',
    tip:
      'Boat or jet ski required. Head far west from Watson Bay until you reach a small isolated island with sand messages. Look carefully near the first "S" letter on the ground for the phone.',
    reward: '🕵️ Mysterious video recording. Potential part of a larger island mystery.',
    mapPosition: { x: 200, y: 1800 },
    accuracy: 'approximate',
    evidence: 'Confirmed by multiple exploration videos. Phone recording and meteorite fragments documented.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-purple-meteorite',
    name: 'Purple Meteorite — Table Rock, Mount Kalaga',
    category: 'secrets',
    area: 'Mount Kalaga — eastern slope of Table Rock, Lummox County',
    coordinates: 'Eastern slope of Table Rock, Mount Kalaga National Park',
    description:
      'An unexplained purple meteorite-like object sits embedded in a rocky depression on the eastern slope of Table Rock, Mount Kalaga. No confirmed connection to other mysteries yet, but may be part of the extraterrestrial thread running through Leonida. Possibly linked to the UFO encounter.',
    tip:
      'Off-road vehicle or motorcycle recommended. Drive north into Lummox County and head for Mount Kalaga summit, then descend the eastern side. Look in rocky depressions between vegetation rather than on main paths.',
    reward: '🔎 Unexplained anomaly. Likely connected to the broader alien mystery thread.',
    mapPosition: { x: 1050, y: 450 },
    accuracy: 'approximate',
    evidence: 'Multiple independent videos confirm the meteorite object on Table Rock\'s eastern slope.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-mount-kalaga-bunker',
    name: 'Mount Kalaga Tower + Secret Bunker (Code: 69185)',
    category: 'secrets',
    area: 'Mount Kalaga National Park, Lummox County',
    coordinates: 'Mountain summit area, Mount Kalaga National Park',
    description:
      'A tall metal tower sits near the mountain summit. At its base: a wooden structure with a locked electronic keypad. Climb the tower\'s ladder, read the signs near the upper platform — one displays the five-digit code. The bunker code is 69185. Inside: a logbook with a mysterious ballpoint drawing on page two. The drawing\'s significance is unsolved.',
    tip:
      'Climb the ladder (don\'t fast-travel). The code sign is at the top platform. Enter 69185 at the keypad. Turn to page 2 of the logbook for the drawing. This may be the start of a larger Chiliad-style mystery.',
    reward: '🕵️ Code: 69185. Mysterious logbook drawing. Possible start of a larger ARG mystery.',
    mapPosition: { x: 980, y: 380 },
    accuracy: 'approximate',
    evidence: 'Code and location confirmed independently. Mystery remains partially unsolved.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-easter-eggs-tower',
    name: 'Literal Easter Eggs — South Vice-Dale Communications Tower',
    category: 'secrets',
    area: 'South Vice-Dale County — tallest communications tower',
    coordinates: 'South Vice-Dale County, tall communications mast with exterior ladders',
    description:
      'Rockstar hid actual painted Easter eggs at the top of the tallest communications tower in Leonida. Reaching the top takes ~6–7 real minutes of climbing. At the top: a bird\'s nest with colourful eggs. Pick one up and throw it off the edge with maximum force — a hidden comedic cutscene triggers. A weak throw does nothing.',
    tip:
      'Find the communications mast in South Vice-Dale County (not a Vice City skyscraper — look for a tall standalone metal structure with ladders). Climb every ladder to the very top. The throw must be at full power. If the cutscene doesn\'t fire, grab another egg.',
    reward: '🏆 Hidden comedic cutscene. One of GTA VI\'s most viral exploration moments.',
    mapPosition: { x: 1150, y: 2450 },
    accuracy: 'approximate',
    evidence: 'Confirmed independently by multiple YouTube exploration videos.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-mystery-house-belville',
    name: 'The San Andreas Mystery House — Belville',
    category: 'secrets',
    area: 'Belville residential neighbourhood, Leonard County',
    coordinates: 'Belville, Leonard County — pale single-story house, white garage, two palm trees',
    description:
      'The house from a 2021 GTA San Andreas: Definitive Edition photograph — which fans speculated showed GTA VI — is now confirmed in Belville. Inside the garage: notes from a resident who has deduced they exist inside a video game. References to "J and L" (Jason and Lucia). Outside: a parked car with a snake in the trunk that lunges when opened.',
    tip:
      'Look for a pale single-story home with a white garage door, two palm trees and white fencing in Belville. Break open the garage. Approach the car\'s trunk separately for the snake encounter. Police may respond if witnesses see you entering.',
    reward: '🕵️ Meta conspiracy notes. Snake encounter. Direct GTA San Andreas cross-reference.',
    mapPosition: { x: 1600, y: 1200 },
    accuracy: 'approximate',
    evidence: 'Confirmed by multiple independent videos. Cross-reference to SA:DE photograph now verified.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-dexter-apartment',
    name: "Dexter Morgan's Apartment — Washington Island",
    category: 'secrets',
    area: 'Washington Island, northeastern Vice City',
    coordinates: 'Trinity Apartments, waterfront, Washington Island',
    description:
      'A residential apartment complex on Washington Island closely resembles Dexter Morgan\'s apartment from the TV series. The building has a pale exterior, exterior balconies and a dock immediately alongside. A boat moored at the dock resembles the Slice of Life — Dexter\'s vessel from the show. Visual homage, no dedicated mission.',
    tip:
      'Head to northeastern Vice City and locate Washington Island. Walk the waterfront until you find the low-rise pale complex with balconies directly on the water. Check the boats at the dock.',
    reward: '🕵️ Dexter TV series reference. Iconic apartment and boat recreation.',
    mapPosition: { x: 1900, y: 2600 },
    accuracy: 'approximate',
    evidence: 'Confirmed by multiple independent video comparisons to show footage.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-rdr-book',
    name: 'Red Dead Redemption Book — Jacob\'s Tavern, Millport',
    category: 'secrets',
    area: 'Millport — Jacob\'s Tavern',
    coordinates: "Jacob's Tavern, Millport",
    description:
      'A Western novel associated with New Austin — recognisable as the setting of Red Dead Redemption — sits on a shelf inside Jacob\'s Tavern in Millport. A direct cross-franchise reference between Rockstar\'s two major open-world series.',
    tip:
      'Walk into Jacob\'s Tavern and inspect the books and furnishings. The novel is interactive. Does not confirm a shared universe but is the strongest Rockstar cross-reference in the game.',
    reward: '🕵️ Red Dead Redemption franchise cross-reference. Collectible lore item.',
    mapPosition: { x: 1400, y: 900 },
    accuracy: 'approximate',
    evidence: 'Confirmed by multiple independent videos showing the interactive novel.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'secrets-manifest-monument',
    name: 'Monument of Leonidan Supremacy — Manifest Canyon',
    category: 'secrets',
    area: 'Manifest Canyon, Kelly County',
    coordinates: 'Manifest Canyon, Kelly County',
    description:
      'An unusual stone monument in Manifest Canyon displays symbols and markings no one has fully decoded. Players have reported strange sounds in the area resembling coded signals. May be GTA VI\'s equivalent of the Mount Chiliad mystery. No solution confirmed.',
    tip:
      'Drive into Manifest Canyon and inspect the monument closely from all angles. Some players report the sounds are only audible at specific times of day. Document anything unusual.',
    reward: '🔎 Unsolved mystery. Potential large ARG. Active community investigation.',
    mapPosition: { x: 2300, y: 1200 },
    accuracy: 'approximate',
    evidence: 'Monument confirmed in-game. Sounds and symbols documented. No solution established.',
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VERIFIED MONEY LOCATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'money-teddy-bear-factory',
    name: 'Teddy Bear Factory — $13,000 + Collectible Card',
    category: 'money',
    area: 'South East Hamlet — South Vice-Dale County',
    coordinates: 'Abandoned factory, south-east of Hamlet',
    description:
      'An abandoned teddy bear factory south-east of Hamlet. Inside: pre-killed guards with lootable ammo and cash, a large floor safe, cocaine bundles in the teddy bear van and on office tables, $13,000 in cash across the building, and a collectible card worth $6,000 inside the office safe. Weapons also found on the floor near dead guards.',
    tip:
      'No live enemies — just loot. Clear the floor thoroughly. The safe is in the upstairs office. The van in the loading bay has narcotics inside and in the cab. Stack with the nearby Hamlet motel visit for a full inland loot run.',
    reward: '💰 ~$13,000 cash + 💳 $6,000 collectible card in safe + multiple weapons + cocaine.',
    mapPosition: { x: 1280, y: 1920 },
    accuracy: 'approximate',
    evidence: 'Confirmed by multiple independent videos with on-screen cash totals.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'money-kingfisher-compound',
    name: 'Kingfisher Compound — Cash + Legendary Rifle',
    category: 'money',
    area: 'Grassrivers — West Wetman Bay area',
    coordinates: 'Kingfisher compound, Grassrivers / Wetman Bay',
    description:
      'Kingfisher-linked compound in Grassrivers. Enemies on site. Inside: cash, the legendary W-22 Small Game Rifle, and additional loot. Best approached with suppressed weapons — the perimeter is guarded but interior enemies can be isolated.',
    tip:
      'Clear the perimeter before entering the main building. The W-22 is a unique weapon not easily found elsewhere. Cash and additional loot in the building.',
    reward: '💰 Cash + 🔫 Legendary W-22 Small Game Rifle',
    mapPosition: { x: 650, y: 1900 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple money-guide videos.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'money-bobcat-key-beach',
    name: 'Bobcat Key Beach — $1,218 Free Loot',
    category: 'money',
    area: 'Bobcat Key — Leonida Keys chain',
    coordinates: 'Bobcat Key beach and surrounding woods',
    description:
      'Approximately $1,218 in cash scattered around Bobcat Key beach and the surrounding woodland. No enemies. Good early-game pickup that requires no combat — just thorough searching of the beach and treeline.',
    tip:
      'Walk every inch of the beach and push into the woods on both sides. Cash pickups are small and easy to miss. The W-22 crashed glider is also on this key — combine both visits.',
    reward: '💰 ~$1,218 scattered cash. Free, no enemies.',
    mapPosition: { x: 500, y: 3100 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple early-game money guides.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'money-bank-vault-chapter4',
    name: '"That\'s Where The Money Is" — Bank Vault',
    category: 'money',
    area: 'Vice City — Banking District',
    coordinates: 'Vice City bank, Chapter 4 story mission',
    description:
      'The Chapter 4 story mission "That\'s Where The Money Is" gives access to bank vaults with up to $205,000 per run. The highest single payout in the early-to-mid game. Post-completion, vault runs can be repeated on a cooldown.',
    tip:
      'Full mission completion required first. After that, runs can be replayed. Plan your loadout and escape route before entering — the vault timer is tight and the wanted level escalates fast.',
    reward: '💰 Up to $205,000 per vault run.',
    mapPosition: { x: 1500, y: 2600 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple walkthrough guides. Payout $205k cited in community guides.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VERIFIED WEAPONS — LEGENDARY PICKUPS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'weapon-turnt-nipper-glider',
    name: 'Turnt Nipper .38 Pistol — Bobcat Bight Crashed Glider',
    category: 'weapons',
    area: 'Bobcat Bight — western coastline, North Mariana County',
    coordinates: 'Bobcat Bight, offshore western coastline',
    description:
      'A legendary Turnt Nipper .38 pistol is suspended in a crashed powered paraglider (complete with propeller and parachute) hanging from a tree at Bobcat Bight. Equip a firearm and shoot the parachute down — the glider falls, and the pistol can be collected from the wreckage.',
    tip:
      'Boat or jet ski to Bobcat Bight. Look up into the trees, not on the ground — the glider is in the branches. One well-aimed shot to the parachute brings it down. The legendary variant has unique damage and handling stats.',
    reward: '🔫 Legendary Turnt Nipper .38 Pistol — unique legendary variant.',
    mapPosition: { x: 350, y: 1100 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple video guides with on-screen weapon pickup shown.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-gorse-425-permit-keys',
    name: 'Legendary Gorse 425 Shotgun — Smuggler Boat, North Permit Key',
    category: 'weapons',
    area: 'Permit Keys — northernmost island',
    coordinates: 'Shored smuggler boat, northernmost Permit Key island',
    description:
      'A beached smuggler boat on the northernmost Permit Key island contains the legendary Gorse 425 shotgun. The boat is accessible by foot on the island — no enemies reported. One of the most powerful early-game close-range weapons.',
    tip:
      'Take a boat south to the Permit Keys island chain and head to the northernmost island. Look for the grounded boat on the shoreline. The shotgun is inside the boat.',
    reward: '🔫 Legendary Gorse 425 Shotgun — exceptional early-game close-range weapon.',
    mapPosition: { x: 600, y: 3500 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple loot room guides with on-screen pickup.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-nipper-silenced-south-permit',
    name: 'Silenced Nipper .38 — Crashed Boat, South Permit Key',
    category: 'weapons',
    area: 'Permit Keys — southernmost island',
    coordinates: 'Crashed boat, southernmost Permit Key island',
    description:
      'The southernmost Permit Key island has a different crashed boat containing the legendary Nipper .38 pistol — fitted with a suppressor. Early-game suppressed handgun available long before shop suppressors become affordable.',
    tip:
      'South Permit Key, not north. Two different boats on two different islands. The crashed boat here looks more damaged than the smuggler boat to the north. The silencer is built-in and cannot be removed.',
    reward: '🔫 Legendary Nipper .38 with factory suppressor — rare silenced early-game pistol.',
    mapPosition: { x: 500, y: 3700 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple loot room guides.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-w22-wetman-bay',
    name: 'Legendary W-22 Small Game Rifle — Wetman Bay Fishing Shack',
    category: 'weapons',
    area: 'West Wetman Bay',
    coordinates: 'Kingfisher fishing shack, West Wetman Bay',
    description:
      'Eliminate all enemies around the Kingfisher-linked fishing shack in West Wetman Bay to unlock access to the legendary W-22 Small Game Rifle and $2,000 cash inside. Requires a boat to reach the shack from most approach angles.',
    tip:
      'Bring a suppressed weapon — the enemies here are spread out and can be isolated. The W-22 is inside the shack once the area is clear. Stack with the nearby Grassrivers Kingfisher compound for a double weapon run.',
    reward: '🔫 Legendary W-22 Small Game Rifle + 💰 $2,000 cash.',
    mapPosition: { x: 300, y: 1850 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple loot guides with on-screen weapons pickup.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-type9-rvpark-bunker',
    name: 'Type 9 SMG + H-AT Launcher — RV Park Bunker, SW Vice City',
    category: 'weapons',
    area: 'South-West Vice City — opposite Ammu-Nation',
    coordinates: 'RV Park, south-west Vice City, opposite Ammu-Nation',
    description:
      'An RV park on the south-west edge of Vice City, directly opposite an Ammu-Nation store, hides an underground bunker. Enter the RV and locate the hidden bunker entrance inside. Contains: H-AT Launcher, Frag Grenades, Adrenaline, Ammo cache, and the legendary Type 9 SMG.',
    tip:
      'The bunker entrance is inside the parked RV — not in the ground outside it. Walk around inside the RV until the prompt appears. This is one of the highest-value weapon stashes in the game, available early.',
    reward: '🔫 Legendary Type 9 SMG + 💥 H-AT Launcher + Frag Grenades + Adrenaline + Ammo.',
    mapPosition: { x: 1050, y: 2900 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple loot room guides with on-screen pickups.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-golden-ak-watson-bay',
    name: 'Golden AK-47 — Watson Bay Cartel Compound',
    category: 'weapons',
    area: 'West Watson Bay — cartel compound',
    coordinates: 'Cartel compound warehouse, West Watson Bay',
    description:
      'Fight through a cartel compound in West Watson Bay. The golden AK-47 is in the upstairs section of the warehouse at the back of the compound. A safe with additional cash is in the same room.',
    tip:
      'Clear the ground floor before heading upstairs — enemies on the upper level have a height advantage. The safe is locked but the combination can be found on a note in the downstairs office.',
    reward: '🔫 Golden AK-47 unique colourway + 💰 Safe cash.',
    mapPosition: { x: 450, y: 1700 },
    accuracy: 'approximate',
    evidence: 'Confirmed by multiple video guides showing the golden weapon pickup.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-golden-vfg1-watson-mansion',
    name: 'Golden VF-G1 Assault Rifle — Watson Bay Mansion',
    category: 'weapons',
    area: 'West Watson Bay — gated cartel mansion',
    coordinates: 'Gated cartel mansion, West Watson Bay',
    description:
      'A second cartel compound nearby — a gated mansion. Fight through to the upstairs of the main mansion building for the golden VF-G1 assault rifle and additional cash. Different compound from the AK-47 location; both are worth hitting on the same run.',
    tip:
      'The mansion\'s gate can be opened by shooting the electronic lock panel. Clear the courtyard then breach the main door. The rifle is in the upstairs bedroom.',
    reward: '🔫 Golden VF-G1 Assault Rifle + 💰 Cash loot.',
    mapPosition: { x: 500, y: 1760 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple loot guides.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-legendary-revolver-pelican',
    name: 'Legendary Revolver + Sniper — Pelican Valley Swamp Shack',
    category: 'weapons',
    area: 'Pelican Valley Swamp',
    coordinates: 'Middle of Pelican Valley Swamp — isolated shack',
    description:
      'An isolated shack deep in the Pelican Valley Swamp holds two legendary weapons around its exterior: a legendary revolver and a legendary sniper rifle. No major enemy presence at the shack itself.',
    tip:
      'Airboat strongly recommended — most of the swamp is flooded. The shack appears on no map marker. Navigate by landmark: head to the centre of Pelican Valley and look for the most isolated structure.',
    reward: '🔫 Legendary Revolver + 🔫 Legendary Sniper Rifle — both collectible legendaries.',
    mapPosition: { x: 850, y: 2200 },
    accuracy: 'approximate',
    evidence: 'Confirmed in loot room guides.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-turnt-pistol-watson-tree',
    name: 'Turnt Pistol — Watson Bay Suspended Vehicle',
    category: 'weapons',
    area: 'Watson Bay',
    coordinates: 'Watson Bay — vehicle suspended in tree by wire',
    description:
      'A vehicle is suspended in a tree by wire/rope near Watson Bay. Shoot the suspension strings to drop the car to the ground. The Turnt Pistol is in or under the dropped vehicle. A short puzzle-style find that many players walk past.',
    tip:
      'Look up — the car is elevated by what appears to be wire. Any firearm works to cut the lines. The pistol falls with the vehicle.',
    reward: '🔫 Turnt Pistol — unique weapon variant.',
    mapPosition: { x: 420, y: 1650 },
    accuracy: 'approximate',
    evidence: 'Confirmed in loot guides.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'weapon-parrot-stash-key-lento',
    name: 'Parrot Cash Tip — Three Sheets Liquor, Key Lento',
    category: 'weapons',
    area: 'Key Lento — Three Sheets Liquor store',
    coordinates: "Three Sheets Liquor, Key Lento main strip",
    description:
      'Behind the Three Sheets Liquor store in Key Lento, a caged parrot will direct you to a hidden cash stash if you stand facing its cage and look left toward the generator in the corner. Open the white vent panel beside the generator. This is one of the game\'s most-shared TikTok discoveries.',
    tip:
      'Face the parrot cage directly. It will give a direction hint. The white vent is to the left near the corner generator — it looks like part of the wall.',
    reward: '💰 1,000+ cash hidden in wall vent. Easy, no enemies.',
    mapPosition: { x: 1050, y: 3300 },
    accuracy: 'approximate',
    evidence: 'Confirmed in multiple TikTok and YouTube guides. One of the most shared early-game finds.',
    status: 'verified',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'weapon-brooks-boatworks-safe-combo',
    name: 'Wall Map Safe Combinations — Brooks Boatworks',
    category: 'weapons',
    area: 'North Port Gellhorn — Brooks Boatworks dockyard',
    coordinates: 'Brooks Boatworks smaller building, east of main warehouse, north Port Gellhorn',
    description:
      'At the Brooks Boatworks dockyard in north Port Gellhorn, find the smaller building east of the main warehouse. Take its outside stairs to the upstairs room and examine the wall map. Interacting with it saves all three safe combinations in Port Gellhorn to your in-game notes — eliminating the need to find them separately.',
    tip:
      'Do this before cracking any Port Gellhorn safes. The wall map unlocks all three combinations simultaneously. The building is easy to miss — it\'s the smaller annex structure, not the main warehouse.',
    reward: '📝 All three Port Gellhorn safe combinations saved to notes.',
    mapPosition: { x: 2150, y: 1950 },
    accuracy: 'approximate',
    evidence: 'Confirmed in community loot guides.',
    status: 'verified',
    sourceName: YT,
    sourceUrl: YTU,
  },


]
