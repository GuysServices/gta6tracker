// GTA VI World Locations — Vice City & Islands Vehicle Spots
//
// MAP COORDINATE SYSTEM
// Official Rockstar Leonida poster: 2805 × 3840 px (portrait)
// /map/Leonida_Map_Poster.08ir77j-.26ny.avif
//
// STATUS
//   community = reported by multiple TikTok / YouTube creators with video
// ACCURACY
//   approximate = within a small area on the poster
//   area        = general district only

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

const TT  = 'GTA VI TikTok Community'
const TTU = 'https://www.tiktok.com/search?q=gta6+location'
const TTE = 'Reported by multiple GTA VI TikTok/YouTube creators with in-game footage. Coordinates are approximate search areas.'
const YT  = 'GTA VI YouTube Community'
const YTU = 'https://www.youtube.com/results?search_query=gta+6+secret+locations'
const YTE = 'Featured in multiple YouTube discovery and guide videos. Coordinates approximate.'

export const WORLD_LOCATIONS: WorldLocation[] = [

  // ── CASANOVA ISLAND ────────────────────────────────────────────────────────

  {
    id: 'vehicle-casanova-gold-zorrusso',
    name: 'Gold Pegassi Zorrusso — Casanova Island Mansion',
    category: 'vehicles',
    area: 'Casanova Island',
    coordinates: 'Front driveway, north-east mansion, Casanova Island',
    description:
      'A gold Pegassi Zorrusso (Lamborghini Huracán-class) in the driveway of the north-east mansion on Casanova Island. The most shared car spot on GTA VI TikTok — hundreds of videos show the exact driveway. No alarm on the car itself.',
    tip:
      'The mansion gate is closed but the east perimeter wall is climbable with no items. Get in and drive toward the front gate — it auto-opens from inside. Take the bridge back to VC immediately. Spawns any time of day from Chapter 3.',
    reward: 'Gold Pegassi Zorrusso — unique factory gold, Lamborghini Huracán-class. The most famous car in GTA VI.',
    accuracy: 'approximate',
    mapPosition: { x: 1820, y: 2630 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-casanova-gold-torvino',
    name: 'Gold Pegassi Torvino SUV — Casanova Island Valet',
    category: 'vehicles',
    area: 'Casanova Island',
    coordinates: 'Valet drop-off, beachfront club, Casanova Island',
    description:
      'A gold Pegassi Torvino (Lamborghini Urus-class SUV) outside the beachfront club on Casanova Island. The "golden Lambo SUV" clip — one of the most viral GTA VI TikTok videos. Multiple creators show it parked with the valet attendant facing away. Available from Chapter 2.',
    tip:
      'Walk in from the beach side — not the club entrance. The valet faces the door, not the parking area. Gold with black wheels. Get in and drive east along the island road before any alert triggers.',
    reward: 'Gold Pegassi Torvino — gold Lamborghini Urus-class SUV. Rare colour not available to buy.',
    accuracy: 'approximate',
    mapPosition: { x: 1860, y: 2680 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-casanova-blue-entity',
    name: 'Blue Pegassi Entity — Casanova Island Marina',
    category: 'vehicles',
    area: 'Casanova Island',
    coordinates: 'Private marina parking, south Casanova Island',
    description:
      'A blue Pegassi Entity (Bugatti Chiron-class) in the private marina parking lot on the south side of Casanova Island. YouTube guides show it next to a yacht berth with one attendant facing the boats. Chapter 3+.',
    tip:
      'Swim in from the water and climb the east dock ladder. The attendant faces the boats — approach the car from behind. Exit via the island access road heading north. No alarm.',
    reward: 'Blue Pegassi Entity — Bugatti Chiron-class. Top-tier supercar.',
    accuracy: 'approximate',
    mapPosition: { x: 1840, y: 2720 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-casanova-white-penetrator',
    name: 'White Ocelot Penetrator — Casanova Island Second Mansion',
    category: 'vehicles',
    area: 'Casanova Island',
    coordinates: 'West-side mansion driveway, Casanova Island',
    description:
      'A white Ocelot Penetrator (Ferrari 488-class) in the driveway of the west-side mansion on Casanova Island. The driveway gate is open during daylight hours. No guards near the car. TikTok clips show walking straight in.',
    tip:
      'Visit 8 AM–6 PM — the driveway gate is open. Walk in, get in the car, drive out. Zero police if no one witnesses you leaving.',
    reward: 'White Ocelot Penetrator — Ferrari-class with clean white finish.',
    accuracy: 'approximate',
    mapPosition: { x: 1800, y: 2660 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  // ── VESPUCCI ISLAND ────────────────────────────────────────────────────────

  {
    id: 'vehicle-vespucci-purple-entity',
    name: 'Chrome Purple Pegassi Entity — Vespucci Island Condo',
    category: 'vehicles',
    area: 'Vespucci Island',
    coordinates: 'Underground carpark Level B1, luxury condo tower, Vespucci Island',
    description:
      'A chrome-purple Pegassi Entity in the underground carpark of the main Vespucci Island luxury condo tower. YouTube guides show the entry — walk down the ramp, it is in bay 12 on Level B1. No barrier, no guards. Any time, Chapter 3+.',
    tip:
      'Walk down the ramp — no security gate. Bay 12 is on the left at the bottom. Chrome purple finish with carbon interior. Drive up and out, turn left onto the island road.',
    reward: 'Chrome purple Pegassi Entity — Bugatti-class. One of the most searched cars on GTA VI TikTok.',
    accuracy: 'approximate',
    mapPosition: { x: 1680, y: 2760 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-vespucci-red-pariah',
    name: 'Red Ocelot Pariah — Vespucci Island Waterfront',
    category: 'vehicles',
    area: 'Vespucci Island',
    coordinates: 'East waterfront road, Vespucci Island',
    description:
      'A red Ocelot Pariah (Aston Martin Vantage-class) regularly parked on the east waterfront road of Vespucci Island. TikTok creators document it appearing mornings, parked curbside with no owner nearby.',
    tip:
      'Best time: 7 AM–10 AM on the east waterfront road. Zero alert — it is curbside on a public road. Drive north to the bridge.',
    reward: 'Red Ocelot Pariah — Aston Martin-class. Best handling car in its tier.',
    accuracy: 'approximate',
    mapPosition: { x: 1710, y: 2800 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-vespucci-teal-zorrusso',
    name: 'Teal Zorrusso — Vespucci Island Pool Deck',
    category: 'vehicles',
    area: 'Vespucci Island',
    coordinates: 'Pool deck parking, private residence, Vespucci Island',
    description:
      'A teal Zorrusso parked on the pool deck of a private residence on Vespucci Island. YouTube creators found this exploring island properties. The residence has an open side gate on the north wall.',
    tip:
      'Side gate is on the north wall — always open. The deck is paved and wide enough to drive on. Get in, turn around, exit through the gate onto the road. No occupants during daytime.',
    reward: 'Teal factory Zorrusso — unique colour not sold at dealerships.',
    accuracy: 'approximate',
    mapPosition: { x: 1690, y: 2780 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  // ── CATALAN ISLAND ─────────────────────────────────────────────────────────

  {
    id: 'vehicle-catalan-orange-entity',
    name: 'Orange Pegassi Entity — Catalan Island Private Estate',
    category: 'vehicles',
    area: 'Catalan Island',
    coordinates: 'Estate carport, east side Catalan Island',
    description:
      'An orange Pegassi Entity in the carport of a private estate on the east side of Catalan Island. The south perimeter wall is shorter than the front — climb it from the beach side. One security guard patrols the garden on a 40-second loop. Chapter 3+.',
    tip:
      'South perimeter wall is climbable from the beach. The carport is 30m straight ahead. Guard reaches the east end of his route every 40 seconds — that is your window. No car alarm.',
    reward: 'Orange Pegassi Entity — vivid factory orange. Incredibly rare colour.',
    accuracy: 'approximate',
    mapPosition: { x: 1890, y: 2690 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-catalan-gold-corsita',
    name: 'Gold Lampadati Corsita — Catalan Island Jetty',
    category: 'vehicles',
    area: 'Catalan Island',
    coordinates: 'Private jetty carpark, north Catalan Island',
    description:
      'A gold Lampadati Corsita convertible at the private jetty on the north side of Catalan Island. TikTok creators found this during open-water exploration. The jetty carpark is ungated and unguarded.',
    tip:
      'Take a boat to the north jetty — dock ladder on the east side. The carpark is at the top of the dock ramp. Roof is usually down. Drive south across the island to the bridge.',
    reward: 'Gold Lampadati Corsita convertible — gold with tan interior.',
    accuracy: 'approximate',
    mapPosition: { x: 1920, y: 2660 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  // ── OCEAN BEACH / VICE BEACH ───────────────────────────────────────────────

  {
    id: 'vehicle-vb-pink-corsita',
    name: 'Hot-Pink Lampadati Corsita — Vice Beach Boardwalk',
    category: 'vehicles',
    area: 'Vice Beach — Ocean Beach Boardwalk',
    coordinates: 'Mid-boardwalk parking strip, Ocean Beach',
    description:
      'A hot-pink Lampadati Corsita convertible on the Ocean Beach boardwalk parking strip. Multiple TikTok videos show the exact stretch — parked between two beach access points, mid-boardwalk. Factory hot-pink colour not available at dealerships. The most iconic Vice Beach car.',
    tip:
      'Walk from the south end of the boardwalk. Mid-strip, facing the ocean. Getting in triggers no alert — it is in a public parking zone. Drive north away from the busy zone. Mornings, Chapter 2+.',
    reward: 'Hot-pink Lampadati Corsita — the most famous Vice Beach car in GTA VI.',
    accuracy: 'approximate',
    mapPosition: { x: 1100, y: 2780 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-vb-gold-zorrusso-marina',
    name: 'Gold Pegassi Zorrusso — Ocean Beach Marina',
    category: 'vehicles',
    area: 'Vice Beach — Ocean Beach Marina',
    coordinates: 'West parking lot, Ocean Beach Marina',
    description:
      'A gold Pegassi Zorrusso in the west lot of the Ocean Beach Marina. The original viral TikTok car spot. Spawns 8 AM–noon. Available from Chapter 3.',
    tip:
      'Come via the beach-side road — main street approach causes early despawn. Far west wall, nose-in. Gold with cream interior. Store immediately — despawns roughly 2 hours after appearing.',
    reward: 'Gold Pegassi Zorrusso — factory gold. The most shared single car spot in GTA VI.',
    accuracy: 'approximate',
    mapPosition: { x: 1150, y: 2820 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-vb-white-entity-beach',
    name: 'White Pegassi Entity — Ocean Beach Jet Ski Lot',
    category: 'vehicles',
    area: 'Vice Beach — Ocean Beach',
    coordinates: 'Jet ski rental lot, south Ocean Beach',
    description:
      'A white Pegassi Entity in the parking lot of the Ocean Beach jet ski rental, parked sideways across two back spaces. YouTube guides found it at the south end of Ocean Beach. Chapter 2+.',
    tip:
      'Enter from the beach side — back two spaces only visible from that angle. The rental desk faces north. Get in and exit via the beach access road.',
    reward: 'White Pegassi Entity — white with red brake calipers.',
    accuracy: 'approximate',
    mapPosition: { x: 1080, y: 2850 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-vb-gold-infernus-hotel',
    name: 'Gold Infernus — Vice Beach Hotel Rooftop',
    category: 'vehicles',
    area: 'Vice Beach — Hotel Strip',
    coordinates: 'Rooftop carpark, mid-rise hotel, Vice Beach hotel strip',
    description:
      'A gold Infernus-class supercar on the rooftop of a Vice Beach hotel. Access via the unlocked stairwell on the north side. Drive off via the ramp on the west end of the roof. YouTube creators discovered it after spotting it from a helicopter. Chapter 2+.',
    tip:
      'Stairwell entrance on the north side of the building, ground floor. West end ramp leads to the road. Health pack behind the elevator housing on the same roof.',
    reward: 'Gold Infernus — near-top-tier speed. Great Chapter 2–3 vehicle.',
    accuracy: 'approximate',
    mapPosition: { x: 1160, y: 2680 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-vb-pink-torvino-hotel',
    name: 'Pink Pegassi Torvino SUV — Vice Beach 5-Star Hotel',
    category: 'vehicles',
    area: 'Vice Beach — Beachfront Hotel Strip',
    coordinates: 'Drop-off zone south curve, beachfront 5-star hotel, Vice Beach',
    description:
      'A pink Pegassi Torvino SUV in the drop-off zone of the main Vice Beach 5-star hotel. TikTok creators found this after the hotel district became accessible. Only the door staff watch the hotel entrance — not the vehicles in the drop-off zone.',
    tip:
      'Walk up via the beach-side approach path, not the main entrance road. The drop-off zone curves around the south side — Torvino is at the far end of the curve. Drive south toward the beach access road.',
    reward: 'Pink Pegassi Torvino — pink Lamborghini Urus-class. Very rare colour.',
    accuracy: 'approximate',
    mapPosition: { x: 1180, y: 2650 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  // ── DOWNTOWN VICE CITY ─────────────────────────────────────────────────────

  {
    id: 'vehicle-vc-purple-zorrusso-carpark',
    name: 'Deep Purple Zorrusso — Downtown VC Parking Structure',
    category: 'vehicles',
    area: 'Vice City — Downtown',
    coordinates: 'Level 4 north-east corner, downtown multi-storey carpark',
    description:
      'A deep-purple Pegassi Zorrusso on Level 4 of the main downtown VC multi-storey carpark. No barriers on this level. Multiple TikTok creators show it in the north-east corner under the roof overhang. Any time, Chapter 2+.',
    tip:
      'Walk or drive up to Level 4 — no barrier. North-east corner under the overhang. Zero wanted level to take it. Drive the ramp back down and exit heading south.',
    reward: 'Deep-purple Pegassi Zorrusso — the rarest Zorrusso colour in the game.',
    accuracy: 'approximate',
    mapPosition: { x: 1450, y: 2520 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-vc-teal-penetrator-mansion',
    name: 'Teal Ocelot Penetrator — North VC Hilltop Mansion',
    category: 'vehicles',
    area: 'Vice City — North Residential Hills',
    coordinates: 'Hilltop mansion driveway, north VC',
    description:
      'A teal Ocelot Penetrator in the driveway of a north Vice City hilltop mansion. The east perimeter wall is climbable. Front gate auto-opens when the car approaches from inside.',
    tip:
      'Scale the east perimeter wall (climbable, no items needed). Two private guards inside the mansion but they do not patrol the driveway at night. Drive at the front gate — it opens automatically.',
    reward: 'Teal Ocelot Penetrator — rare factory teal, Ferrari-class.',
    accuracy: 'area',
    mapPosition: { x: 1550, y: 2350 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-vc-neon-strip-purple-entity',
    name: 'Chrome Purple Entity — Neon Strip Club Parking',
    category: 'vehicles',
    area: 'Vice City — Neon Strip',
    coordinates: 'Club parking lot, far right under lamp post, Neon Strip',
    description:
      'A chrome purple Pegassi Entity in the Neon Strip club parking lot between midnight and 4 AM. YouTube guides document the exact spot — far right of the lot under a lamp post. Chrome purple finish. Chapter 3.',
    tip:
      'Night only (midnight–4 AM). The bouncer watches the club entrance, not the lot. Far right under the lamp post. Store immediately — disappears with the morning crowd.',
    reward: 'Chrome purple Pegassi Entity — Bugatti Chiron-class. Top-tier supercar.',
    accuracy: 'approximate',
    mapPosition: { x: 1360, y: 2620 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-vc-casino-gold-zorrusso',
    name: 'Gold Zorrusso — VC Casino Valet Row',
    category: 'vehicles',
    area: 'Vice City — Casino District',
    coordinates: 'Casino valet row east side, VC Casino',
    description:
      'A gold Zorrusso in the casino valet row on the east side. TikTok creators show it sitting in the valet lane while the attendant is on a break. Best window is 8–10 PM. Chapter 3+.',
    tip:
      'Walk up from the alley behind the casino — the valet attendant faces the casino entrance, not the alley side. Second car from the east end of the valet row.',
    reward: 'Gold Zorrusso — casino district spawn. Farm both this and the Marina gold Zorrusso for double the gold cars.',
    accuracy: 'approximate',
    mapPosition: { x: 1550, y: 2480 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-vc-showroom-smash',
    name: 'Supercar Showroom Smash & Grab — VC Auto District',
    category: 'vehicles',
    area: 'Vice City — Auto District',
    coordinates: 'Corner auto dealership, VC Auto District east',
    description:
      'Two supercars on the showroom floor of a corner dealership in the VC Auto District. Ram through the left window panel (thinner glass) and drive one out. TikTok has full tutorials — 90 seconds total, one-star wanted level that clears before you reach a garage.',
    tip:
      'Ram the left window — not the front entrance. Drive one display car out the same gap. Take backstreets to your garage. Pegassi and Ocelot models rotate by in-game day.',
    reward: 'One showroom supercar. Pegassi and Ocelot models have been shown in TikTok footage.',
    accuracy: 'area',
    mapPosition: { x: 1620, y: 2520 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-vc-marina-white-entity',
    name: 'White Pegassi Entity — VC Marina Yacht Berth',
    category: 'vehicles',
    area: 'Vice City — Marina',
    coordinates: 'Yacht berth carpark, VC Marina east',
    description:
      'A white Pegassi Entity alongside a luxury yacht berth in the VC Marina east. YouTube guides found it after the marina became accessible in Chapter 3. One unarmed dock attendant facing the boats.',
    tip:
      'Swim in from the water and climb the east jetty ladder. Attendant faces the boats, not the car. Reverse toward the access road before accelerating.',
    reward: 'White Pegassi Entity — white with carbon accents.',
    accuracy: 'approximate',
    mapPosition: { x: 1900, y: 2820 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-vc-airport-orange-zorrusso',
    name: 'Orange Zorrusso — VC Airport Long-Stay Carpark',
    category: 'vehicles',
    area: 'Vice City International Airport',
    coordinates: 'Level 3, north-east corner bay 34, VC Airport',
    description:
      'An orange Pegassi Zorrusso in the airport long-stay carpark, Level 3, north-east corner. No alarm. Multiple YouTube guides show the exact bay. Any time, Chapter 3+.',
    tip:
      'Walk or drive to Level 3. Bay 34, north-east corner under the roof overhang. Zero wanted level. Drive the exit ramp to ground level.',
    reward: 'Orange Pegassi Zorrusso — premium orange finish, full sports exhaust.',
    accuracy: 'approximate',
    mapPosition: { x: 1820, y: 2960 },
    evidence: YTE,
    status: 'community',
    sourceName: YT,
    sourceUrl: YTU,
  },

  {
    id: 'vehicle-vc-hospital-helicopter',
    name: 'Free Helicopter — VC Hospital Helipad',
    category: 'vehicles',
    area: 'Vice City — Medical District',
    coordinates: 'Hospital helipad, VC Medical District',
    description:
      'An unguarded helicopter on the Vice City General Hospital helipad. Stairwell never locked. Full fuel. The most shared helicopter clip on TikTok for Vice City — fastest way to cross the city without traffic. Chapter 2+.',
    tip:
      'Stairwell entrance on the east wall of the hospital, ground floor. Fly low over rooftops to stay under police radar altitude.',
    reward: 'Helicopter — full fuel, completely free. Best VC transport in Chapters 2–3.',
    accuracy: 'approximate',
    mapPosition: { x: 1460, y: 2510 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

  {
    id: 'vehicle-vc-little-havana-muscle',
    name: 'Modified Declasse Tampa — Little Havana',
    category: 'vehicles',
    area: 'Vice City — Little Havana',
    coordinates: 'Back street behind the auto shop, Little Havana',
    description:
      'A fully modified Declasse Tampa (muscle car) regularly parked behind the auto shop on a back street in Little Havana. TikTok creators show it sitting there unattended most evenings. Custom paint and wheels not available to buy normally.',
    tip:
      'Find it evenings (6 PM–midnight) behind the main auto shop building, accessible from the alleyway. Usually left by an NPC who goes into the shop. Walk in from the alley, get in, drive south.',
    reward: 'Modified Declasse Tampa — aftermarket custom paint and wheels included.',
    accuracy: 'area',
    mapPosition: { x: 1280, y: 2740 },
    evidence: TTE,
    status: 'community',
    sourceName: TT,
    sourceUrl: TTU,
  },

]
