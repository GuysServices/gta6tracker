
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

const LOOT_SOURCE =
  'https://jabbareviews.com/gta-6-loot-locations-money-cars-weapons/'

const MAP_SOURCE = 'https://www.gtabase.com/gta-6/map/'

const LOOT_EVIDENCE =
  'Listed by a community loot guide. The guide uses an unofficial community map and describes general search areas, not exact in-game waypoints.'

export const WORLD_LOCATIONS: WorldLocation[] = [
  {
    id: 'money-apollo-aggregates',
    name: 'Apollo Aggregates Warehouse',
    category: 'money',
    area: 'South Vice-Dale County, near Hamlet',
    description:
      'A reported loot location at a red warehouse east of Hamlet. The surrounding industrial property is described as a mixed loot opportunity.',
    tip:
      'Look for the gravel yard and large rectangular pools beside the highway. The guide recommends searching the warehouse and its surrounding property.',
    reward:
      'Reported cash, sellable goods, three guns, and a valuable card. Some items must be sold before they become cash.',
    accuracy: 'area',
    evidence: LOOT_EVIDENCE,
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'money-three-sheets',
    name: 'Three Sheets Liquor Store Stash',
    category: 'money',
    area: 'Key Lento',
    description:
      'A reported hidden cash opportunity at the Three Sheets Liquor Store. The discovery is associated with a parrot clue and a back-yard area.',
    tip:
      'Check the shop entrance, back yard, and generator vent. The reported route may involve guards and a side errand.',
    reward:
      'Reported hidden cash and a backroom safe. Exact payout has not been established here.',
    accuracy: 'area',
    evidence: LOOT_EVIDENCE,
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'weapon-industrial-shotgun',
    name: 'Industrial Shotgun Pickup',
    category: 'weapons',
    area: 'South of Hamlet',
    description:
      'A reported weapon pickup inside an industrial storage building near the highway.',
    tip:
      'Search the industrial buildings south of Hamlet. Look for the storage building described in the loot guide.',
    reward:
      'Reported unique shotgun and additional cash.',
    accuracy: 'area',
    evidence: LOOT_EVIDENCE,
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'money-motel-sniper',
    name: 'Motel Cash and Sniper Rifle',
    category: 'money',
    area: 'Hamlet area, south of Hamlet',
    description:
      'A reported motel loot location. The guide warns that reaching the loot may involve a dangerous encounter.',
    tip:
      'Search the motel buildings and surrounding area. Be prepared for hostile NPCs.',
    reward:
      'Reported cash and a sniper rifle.',
    accuracy: 'area',
    evidence: LOOT_EVIDENCE,
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'weapon-permit-keys-wrecks',
    name: 'Permit Keys Weapon Wrecks',
    category: 'weapons',
    area: 'Permit Keys',
    description:
      'Two reported stranded boats around Permit Keys contain weapon loot.',
    tip:
      'Bring a boat or jet ski to reach the stranded boats. Explore the surrounding shoreline.',
    reward:
      'Reported suppressed pistol and shotgun.',
    accuracy: 'area',
    evidence: LOOT_EVIDENCE,
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'drugs-fishing-shacks',
    name: 'Fishing Shacks Operation',
    category: 'drugs',
    area: 'Wetman Bay',
    description:
      'A reported illegal operation around the Fishing Shacks area. The location is described as an armed gang territory.',
    tip:
      'Approach carefully and search the fishing shacks and nearby buildings.',
    reward:
      'Reported unique rifle and cash.',
    accuracy: 'area',
    evidence: LOOT_EVIDENCE,
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'vehicle-rare-vice-city-capri',
    name: 'Vice City and Capri Rare Vehicle Sightings',
    category: 'vehicles',
    area: 'Vice City and Capri',
    description:
      'Community-reported rare vehicle sighting areas around Vice City and Capri. These are general sighting regions rather than confirmed fixed spawn points.',
    tip:
      'Check nearby streets, parking areas, and roads. Vehicle appearances may vary.',
    accuracy: 'area',
    evidence: LOOT_EVIDENCE,
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'vehicle-m7-junkyard',
    name: 'M7 Junkyard Rare Vehicle Area',
    category: 'vehicles',
    area: 'Near Hamlet',
    description:
      'A reported rare vehicle sighting area around the M7 junkyard.',
    tip:
      'Explore the junkyard and nearby roads. Treat this as a search area rather than a guaranteed vehicle spawn.',
    accuracy: 'area',
    evidence: LOOT_EVIDENCE,
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
]
