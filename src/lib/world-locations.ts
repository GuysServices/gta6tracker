// ─────────────────────────────────────────────────────────────────────────────
// GTA VI World Locations
//
// MAP COORDINATE SYSTEM
// ---------------------
// The official Rockstar Leonida map poster used by this project is:
//   /map/Leonida_Map_Poster.08ir77j-.26ny.avif
//   Native size: 2805 × 3840 px (portrait)
//
// mapPosition { x, y } values are pixel coordinates on that poster.
// They are set ONLY when a location can be positioned with reasonable
// confidence on the poster image. If a location cannot be reliably placed,
// mapPosition is omitted and the UI shows "pin not available yet."
//
// ACCURACY vs STATUS
// ------------------
// accuracy  → how precisely we know WHERE on the map the location is
// status    → how reliable the underlying intel is
//
// These are independent. A community-reported location can have 'approximate'
// accuracy. A verified location can still only be pinned to a 'area'.
//
// STATUS DEFINITIONS
// ------------------
// verified  → Supported by direct in-game evidence (screenshots, video, confirmed by multiple sources)
// community → Reported by multiple players or established GTA community resources
// rumored   → Single unconfirmed report or speculation; treat with caution
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
  /** Human-readable coordinate description shown in the UI */
  coordinates?: string
  description: string
  tip?: string
  reward?: string
  /**
   * Pixel position on the official Leonida poster (2805 × 3840).
   * Omit if the location cannot be reliably placed on the poster.
   */
  mapPosition?: { x: number; y: number }
  /** Official Rockstar grid reference printed on the poster, if visible */
  gridReference?: string
  accuracy?: POIAccuracy
  /** Short explanation of what evidence supports this entry */
  evidence?: string
  status: POIStatus
  sourceName?: string
  sourceUrl?: string
}

export const CATEGORIES: {
  key: POICategory
  label: string
  color: string
  bg: string
}[] = [
  {
    key: 'money',
    label: 'Money',
    color: 'text-[#ffdc9b]',
    bg: 'bg-[#ffd27a]/10 border-[#ffd27a]/25 hover:bg-[#ffd27a]/15',
  },
  {
    key: 'weapons',
    label: 'Weapons',
    color: 'text-[#8ce7ee]',
    bg: 'bg-[#72dce8]/10 border-[#72dce8]/25 hover:bg-[#72dce8]/15',
  },
  {
    key: 'drugs',
    label: 'Drugs',
    color: 'text-[#ff9bb5]',
    bg: 'bg-[#ff79a8]/10 border-[#ff79a8]/25 hover:bg-[#ff79a8]/15',
  },
  {
    key: 'ammo',
    label: 'Ammo',
    color: 'text-[#c3b4ff]',
    bg: 'bg-[#9b83ff]/10 border-[#9b83ff]/25 hover:bg-[#9b83ff]/15',
  },
  {
    key: 'vehicles',
    label: 'Vehicles',
    color: 'text-[#a5e6a5]',
    bg: 'bg-[#5fad5f]/10 border-[#5fad5f]/25 hover:bg-[#5fad5f]/15',
  },
  {
    key: 'misc',
    label: 'Misc',
    color: 'text-[#b8b8d0]',
    bg: 'bg-[#8888aa]/10 border-[#8888aa]/25 hover:bg-[#8888aa]/15',
  },
  {
    key: 'secrets',
    label: 'Secrets',
    color: 'text-[#d5a6ff]',
    bg: 'bg-[#b77aff]/10 border-[#b77aff]/25 hover:bg-[#b77aff]/15',
  },
]

export const CATEGORY_ICON: Record<POICategory, string> = {
  money: '💰',
  weapons: '🔫',
  drugs: '📦',
  ammo: '🎯',
  vehicles: '🚗',
  misc: '🗺️',
  secrets: '🔎',
}

// ─────────────────────────────────────────────────────────────────────────────
// Source constants
// ─────────────────────────────────────────────────────────────────────────────

const JABBA_URL = 'https://jabbareviews.com/gta-6-loot-locations-money-cars-weapons/'
const JABBA_SRC = 'Jabba Reviews'
const JABBA_EVD =
  'Community loot guide using an unofficial player map. Describes general search areas; not exact in-game waypoints. Cross-reference with in-game observation before treating as confirmed.'

const GTABASE_URL = 'https://www.gtabase.com/gta-6/map/'
const GTABASE_SRC = 'GTABase'

// ─────────────────────────────────────────────────────────────────────────────
// Location database
//
// MAP POSITION NOTES
// ------------------
// The Leonida poster is portrait (taller than wide). North is at the top.
// Vice City occupies the lower-centre of the poster.
// The Florida Keys analog runs from the lower-left toward the bottom.
// Port Gellhorn is on the east coast, mid-height.
// North Leonida (rural/swamp) fills the upper portion.
//
// Coordinates below are calibrated against named poster landmarks:
//   - Vice City urban grid visible at roughly x:1150–1800, y:2200–3000
//   - The Keys island chain: x:300–1200, y:3200–3700
//   - Port Gellhorn harbour: x:2000–2400, y:1800–2400
//   - Hamlet / inland area: x:900–1400, y:1600–2000
//
// All mapPosition values without an 'exact' accuracy rating are approximate.
// ─────────────────────────────────────────────────────────────────────────────

export const WORLD_LOCATIONS: WorldLocation[] = [

  // ── MONEY ─────────────────────────────────────────────────────────────────

  {
    id: 'money-apollo-aggregates',
    name: 'Apollo Aggregates Warehouse',
    category: 'money',
    area: 'South Vice-Dale County, near Hamlet',
    coordinates: 'Near Hamlet, south of main highway',
    description:
      'A community-reported loot location at a red warehouse east of Hamlet. The surrounding industrial property is described as a mixed loot opportunity with multiple items to collect.',
    tip:
      'Look for the gravel yard and large rectangular pools beside the highway. Search the warehouse interior and surrounding property thoroughly.',
    reward:
      'Reported cash, sellable goods, three guns, and a valuable card. Some items must be sold before converting to cash.',
    accuracy: 'area',
    // Near Hamlet on the poster — rough area placement only
    mapPosition: { x: 1180, y: 1850 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  {
    id: 'money-three-sheets',
    name: 'Three Sheets Liquor Store',
    category: 'money',
    area: 'Key Lento, Leonida Keys',
    coordinates: 'Key Lento area',
    description:
      'A community-reported hidden cash opportunity at the Three Sheets Liquor Store. The discovery is associated with a parrot clue and a back-yard generator area.',
    tip:
      'Check the shop entrance, back yard, and generator vent. The reported route may involve guards and a brief side errand.',
    reward:
      'Reported hidden cash and a backroom safe. Exact payout unconfirmed.',
    accuracy: 'area',
    // Key Lento is in the Keys chain on the poster
    mapPosition: { x: 680, y: 3380 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  {
    id: 'money-motel-stash',
    name: 'Hamlet Motel Cash Stash',
    category: 'money',
    area: 'South of Hamlet',
    coordinates: 'Motel south of Hamlet',
    description:
      'A community-reported motel loot location south of Hamlet. The guide warns of a dangerous encounter when approaching.',
    tip:
      'Search the motel buildings and surrounding area. Be prepared for hostile NPCs before looting.',
    reward: 'Reported cash and a sniper rifle at the same location.',
    accuracy: 'area',
    mapPosition: { x: 1150, y: 1980 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  // ── WEAPONS ───────────────────────────────────────────────────────────────

  {
    id: 'weapon-industrial-shotgun',
    name: 'Industrial Shotgun Pickup',
    category: 'weapons',
    area: 'South of Hamlet',
    coordinates: 'Industrial storage, south Hamlet',
    description:
      'A community-reported weapon inside an industrial storage building near the highway south of Hamlet. Same general area as the motel cash stash.',
    tip:
      'Search the industrial buildings south of Hamlet. The storage building is described as adjacent to the highway.',
    reward: 'Reported unique shotgun and additional cash.',
    accuracy: 'area',
    mapPosition: { x: 1130, y: 2020 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  {
    id: 'weapon-motel-sniper',
    name: 'Hamlet Motel Sniper Rifle',
    category: 'weapons',
    area: 'South of Hamlet',
    coordinates: 'Motel south of Hamlet',
    description:
      'A sniper rifle reported alongside the cash stash at the Hamlet area motel. Same location as money-motel-stash — visit both together.',
    tip:
      'Combine with the cash stash visit. The sniper rifle and cash are reported to be at the same motel.',
    reward: 'Sniper rifle.',
    accuracy: 'area',
    mapPosition: { x: 1155, y: 1985 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  {
    id: 'weapon-permit-keys-boats',
    name: 'Permit Keys Stranded Boats',
    category: 'weapons',
    area: 'Permit Keys, Leonida Keys',
    coordinates: 'Offshore around Permit Keys',
    description:
      'Two stranded boats around Permit Keys are reported to contain weapon loot. Requires water transport to reach.',
    tip:
      'Bring a boat or jet ski. Explore the surrounding shoreline and check both stranded vessels.',
    reward: 'Reported suppressed pistol and shotgun across the two boats.',
    accuracy: 'area',
    // Permit Keys is in the Keys chain area
    mapPosition: { x: 820, y: 3450 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  // ── DRUGS ─────────────────────────────────────────────────────────────────

  {
    id: 'drugs-fishing-shacks',
    name: 'Wetman Bay Fishing Shacks',
    category: 'drugs',
    area: 'Wetman Bay',
    coordinates: 'Wetman Bay fishing area',
    description:
      'A community-reported illegal operation around the Wetman Bay fishing shacks. Described as armed gang territory with multiple loot opportunities.',
    tip:
      'Approach carefully. Clear the area before searching the shacks and nearby buildings.',
    reward: 'Reported unique rifle and cash.',
    accuracy: 'area',
    // Wetman Bay is on the east coast area of the map
    mapPosition: { x: 2100, y: 2000 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  // ── VEHICLES ──────────────────────────────────────────────────────────────

  {
    id: 'vehicle-vice-city-rare',
    name: 'Vice City Rare Vehicle Sightings',
    category: 'vehicles',
    area: 'Vice City',
    coordinates: 'Vice City streets and parking areas',
    description:
      'Community-reported rare vehicle sighting areas across Vice City. These are general sighting regions — not confirmed fixed spawn points. Vehicle appearances can vary by time of day and progression.',
    tip:
      'Check parking structures, beachfront roads, and the club district. Time of day and story progression reportedly affect spawns.',
    accuracy: 'area',
    // Vice City urban core on poster
    mapPosition: { x: 1420, y: 2550 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  {
    id: 'vehicle-capri-rare',
    name: 'Capri Rare Vehicle Area',
    category: 'vehicles',
    area: 'Capri',
    coordinates: 'Capri area',
    description:
      'Community-reported rare vehicle sightings around the Capri area. General sighting region only.',
    tip:
      'Check roads and parking areas in the Capri region. Treat as a search area.',
    accuracy: 'area',
    mapPosition: { x: 1650, y: 2350 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  {
    id: 'vehicle-m7-junkyard',
    name: 'M7 Junkyard Vehicle Area',
    category: 'vehicles',
    area: 'Near Hamlet',
    coordinates: 'M7 junkyard, Hamlet area',
    description:
      'A community-reported rare vehicle area around the M7 junkyard near Hamlet. Specific spawn conditions are not confirmed.',
    tip:
      'Explore the junkyard and nearby roads. Treat this as a search area rather than a guaranteed spawn.',
    accuracy: 'area',
    mapPosition: { x: 1200, y: 1820 },
    evidence: JABBA_EVD,
    status: 'community',
    sourceName: JABBA_SRC,
    sourceUrl: JABBA_URL,
  },

  // ── MISC / POINTS OF INTEREST ─────────────────────────────────────────────

  {
    id: 'misc-vice-city-centre',
    name: 'Vice City — Downtown',
    category: 'misc',
    area: 'Vice City',
    coordinates: 'Central Vice City',
    description:
      'The main urban centre of Vice City. Major hub for missions, services, shops, and social activity. The poster shows the full city grid including the beach strip to the west.',
    tip:
      'Use as a navigation anchor on the map. Most story missions and services are within or near this area.',
    accuracy: 'exact',
    // Vice City is clearly visible and labelled on the official poster
    mapPosition: { x: 1400, y: 2600 },
    evidence: 'Labelled on the official Rockstar Leonida map poster.',
    status: 'verified',
    sourceName: 'Official Rockstar Map',
    sourceUrl: 'https://www.rockstargames.com/VI',
  },

  {
    id: 'misc-port-gellhorn',
    name: 'Port Gellhorn',
    category: 'misc',
    area: 'East Coast, Port Gellhorn',
    coordinates: 'Port Gellhorn harbour',
    description:
      'The main port city on the east coast of Leonida. Industrial area with docks, warehouses, and significant story mission presence across multiple chapters.',
    tip:
      'Chapter 2 is set here. Many side missions and loot opportunities are in the surrounding industrial district.',
    accuracy: 'approximate',
    mapPosition: { x: 2200, y: 2050 },
    evidence: 'Named location on official Rockstar promotional materials and in-game.',
    status: 'verified',
    sourceName: 'Official Rockstar Materials',
    sourceUrl: 'https://www.rockstargames.com/VI',
  },

  {
    id: 'misc-leonida-keys-main',
    name: 'Leonida Keys',
    category: 'misc',
    area: 'Leonida Keys',
    coordinates: 'The island chain, south Leonida',
    description:
      'The Florida Keys analog. A chain of small islands connected by bridges running south-west. Chapter 1 of the story is set here. Various loot and side mission opportunities scattered across the islands.',
    tip:
      'Chapter 1 home base. The Keys contain several community-reported loot locations. Explore thoroughly before moving north.',
    accuracy: 'approximate',
    mapPosition: { x: 750, y: 3400 },
    evidence: 'Named location visible on official Rockstar Leonida map poster.',
    status: 'verified',
    sourceName: 'Official Rockstar Map',
    sourceUrl: 'https://www.rockstargames.com/VI',
  },

  {
    id: 'misc-hamlet',
    name: 'Hamlet',
    category: 'misc',
    area: 'South Vice-Dale County',
    coordinates: 'Hamlet, inland Leonida',
    description:
      'A rural inland town with significant mission presence. Multiple community-reported loot locations in the surrounding area including the M7 junkyard and industrial warehouses.',
    tip:
      'Use as a waypoint for nearby loot runs. The industrial south area has multiple community-reported pickups.',
    accuracy: 'approximate',
    mapPosition: { x: 1200, y: 1780 },
    evidence: 'Named location on the official Rockstar Leonida map poster.',
    status: 'verified',
    sourceName: 'Official Rockstar Map',
    sourceUrl: 'https://www.rockstargames.com/VI',
  },

  // ── SECRETS / EASTER EGGS ─────────────────────────────────────────────────

  {
    id: 'secrets-underwater-research',
    name: 'Underwater Research Notes',
    category: 'secrets',
    area: 'Vice City coastline',
    coordinates: 'Unknown — coastal waters',
    description:
      'Early community speculation about collectible documents hidden underwater near Vice City. No confirmed locations have been established yet.',
    tip:
      'Treat this as unconfirmed. No verified source for exact location. Worth investigating during diving segments.',
    accuracy: 'area',
    evidence:
      'Speculation based on GTA series history and early community exploration. No direct evidence for GTA VI as of this writing.',
    status: 'rumored',
  },

  {
    id: 'secrets-hidden-bunker',
    name: 'Underground Bunker Area',
    category: 'secrets',
    area: 'North Leonida, rural interior',
    coordinates: 'Unknown — rural north',
    description:
      'Community speculation about hidden underground structures in the rural north of the map, based on terrain anomalies noted in early footage.',
    tip:
      'Treat as unconfirmed rumor. No direct evidence. Watch for unusual terrain or map markers in north Leonida.',
    accuracy: 'area',
    evidence:
      'Speculation from pre-launch trailer analysis and community discussion. No confirmed source.',
    status: 'rumored',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// COORDINATE CALIBRATION NOTES FOR CONTRIBUTORS
// ─────────────────────────────────────────────────────────────────────────────
//
// To add a location with a reliable map pin:
//
// 1. Open the official poster (2805 × 3840 px) in an image editor.
// 2. Find the location using named labels visible on the poster.
// 3. Record the pixel X and Y position.
// 4. Set mapPosition: { x, y } and accuracy: 'approximate' or 'exact'.
//
// Do NOT copy pixel coordinates from GTADB, YANIS, or other fan-made maps
// without first confirming they align correctly with the Rockstar poster,
// as those maps use a different coordinate system.
//
// If you cannot verify a location on the poster, omit mapPosition entirely.
// ─────────────────────────────────────────────────────────────────────────────
