
export type POICategory =
  | 'money'
  | 'weapons'
  | 'drugs'
  | 'ammo'
  | 'vehicles'
  | 'misc'
  | 'secrets'

export type POIStatus = 'verified' | 'rumored' | 'community'

export interface WorldLocation {
  id: string
  name: string
  category: POICategory
  area: string
  coordinates?: string
  description: string
  tip?: string
  mapPosition?: { x: number; y: number }
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

export const WORLD_LOCATIONS: WorldLocation[] = [
  // MONEY
  {
    id: 'money-apollo-aggregates',
    name: 'Apollo Aggregates Warehouse',
    category: 'money',
    area: 'Near Hamlet',
    description:
      'Reported cash and loot opportunity around the Apollo Aggregates industrial warehouse.',
    tip: 'Search the warehouse and surrounding industrial property.',
    mapPosition: { x: 486, y: 3348 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'money-three-sheets',
    name: 'Three Sheets Liquor Stash',
    category: 'money',
    area: 'Key Lento',
    description:
      'Reported hidden cash stash associated with the Three Sheets Liquor location.',
    tip: 'Check the shop entrance and back-yard area.',
    mapPosition: { x: 710, y: 356 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'money-motel',
    name: 'Motel Cash Stash',
    category: 'money',
    area: 'South of Hamlet',
    description:
      'Reported motel loot location with cash and a sniper rifle.',
    tip: 'Search the motel buildings and surrounding area.',
    mapPosition: { x: 632, y: 2088 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'money-bank-robbery',
    name: 'Bank Robbery Locations',
    category: 'money',
    area: 'Leonida',
    description:
      'Bank locations associated with robbery opportunities. Individual targets and access requirements may vary.',
    tip: 'Check the map for bank locations and possible entry points.',
    mapPosition: { x: 1924, y: 708 },
    status: 'community',
    sourceName: 'GTABase',
    sourceUrl: MAP_SOURCE,
  },

  // WEAPONS
  {
    id: 'weapon-industrial-shotgun',
    name: 'Industrial Shotgun Pickup',
    category: 'weapons',
    area: 'South of Hamlet',
    description:
      'Reported weapon pickup in an industrial area.',
    tip: 'Search around the industrial buildings.',
    mapPosition: { x: 2211, y: 2136 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'weapon-permit-keys',
    name: 'Permit Keys Weapon Wrecks',
    category: 'weapons',
    area: 'Permit Keys',
    description:
      'Reported weapon-related wreck locations around Permit Keys.',
    tip: 'Explore the wrecks and nearby shoreline.',
    mapPosition: { x: 1364, y: 2178 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'weapon-gellhorn-outfitters',
    name: 'Gellhorn Outfitters',
    category: 'weapons',
    area: 'Port Gellhorn',
    description:
      'A reported Ammu-Nation gun shop location.',
    tip: 'Check for available weapons, attachments and ammunition.',
    mapPosition: { x: 1050, y: 1500 },
    status: 'community',
    sourceName: 'Timesaver.GG',
    sourceUrl: 'https://timesaver.gg/tools/gta-6/map',
  },
  {
    id: 'weapon-ammu-nation',
    name: 'Ammu-Nation Locations',
    category: 'weapons',
    area: 'Leonida',
    description:
      'Gun shop locations across Leonida.',
    tip: 'Use the map to locate nearby gun shops.',
    mapPosition: { x: 1780, y: 2780 },
    status: 'community',
    sourceName: 'GTABase',
    sourceUrl: MAP_SOURCE,
  },

  // DRUGS
  {
    id: 'drugs-fishing-shacks',
    name: 'Fishing Shacks Operation',
    category: 'drugs',
    area: 'Wetman Bay',
    description:
      'Reported illegal operation around the Fishing Shacks area.',
    tip: 'Explore the surrounding shacks and shoreline.',
    mapPosition: { x: 872, y: 3516 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'drugs-illegal-operation-01',
    name: 'Illegal Operation',
    category: 'drugs',
    area: 'Leonida',
    description:
      'Community marker for a reported illegal operation. Exact activity and rewards need confirmation.',
    tip: 'Investigate nearby buildings and entrances.',
    mapPosition: { x: 1500, y: 1100 },
    status: 'rumored',
    sourceName: 'GTABase',
    sourceUrl: MAP_SOURCE,
  },
  {
    id: 'drugs-illegal-operation-02',
    name: 'Hidden Supply Operation',
    category: 'drugs',
    area: 'Leonida',
    description:
      'Placeholder for another illegal operation or hidden supply location.',
    tip: 'Treat this as an approximate search area.',
    mapPosition: { x: 2050, y: 3100 },
    status: 'rumored',
    sourceName: 'Community research',
  },

  // AMMO
  {
    id: 'ammo-gellhorn',
    name: 'Port Gellhorn Ammo Supply',
    category: 'ammo',
    area: 'Port Gellhorn',
    description:
      'Approximate ammunition supply marker near the reported Gellhorn Outfitters gun shop.',
    tip: 'Check the gun shop for ammunition availability.',
    mapPosition: { x: 1150, y: 1450 },
    status: 'community',
    sourceName: 'Timesaver.GG',
    sourceUrl: 'https://timesaver.gg/tools/gta-6/map',
  },
  {
    id: 'ammo-vice-city',
    name: 'Vice City Ammo Supply',
    category: 'ammo',
    area: 'Vice City',
    description:
      'Approximate marker for ammunition and weapon resupply.',
    tip: 'Check nearby weapon shops.',
    mapPosition: { x: 2250, y: 900 },
    status: 'community',
    sourceName: 'GTABase',
    sourceUrl: MAP_SOURCE,
  },
  {
    id: 'ammo-rodgers-range',
    name: 'Rodgers Ranch Shooting Range',
    category: 'ammo',
    area: 'North-east of Port Gellhorn',
    description:
      'Reported shooting range location. Added as an ammunition and target-practice point of interest.',
    tip: 'Explore the ranch and shooting range.',
    mapPosition: { x: 1640, y: 650 },
    status: 'community',
    sourceName: 'Timesaver.GG',
    sourceUrl: 'https://timesaver.gg/tools/gta-6/map',
  },

  // VEHICLES
  {
    id: 'vehicle-m7-junkyard',
    name: 'M7 Junkyard Rare Vehicle Area',
    category: 'vehicles',
    area: 'Near Hamlet',
    description:
      'Reported rare vehicle sighting area around the M7 junkyard.',
    tip: 'Check the junkyard and nearby roads for vehicle spawns.',
    mapPosition: { x: 950, y: 2500 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'vehicle-vice-city',
    name: 'Vice City Rare Vehicle Sightings',
    category: 'vehicles',
    area: 'Vice City',
    description:
      'Reported rare vehicle sightings around Vice City.',
    tip: 'Vehicle appearances may be random. Check the surrounding streets.',
    mapPosition: { x: 2350, y: 1200 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'vehicle-capri',
    name: 'Capri Rare Vehicle Sightings',
    category: 'vehicles',
    area: 'Capri',
    description:
      'Reported rare vehicle sightings around Capri.',
    tip: 'Explore the roads and parking areas around Capri.',
    mapPosition: { x: 2500, y: 1900 },
    status: 'community',
    sourceName: 'Jabba Reviews',
    sourceUrl: LOOT_SOURCE,
  },
  {
    id: 'vehicle-gas-stations',
    name: 'Gas Station Locations',
    category: 'vehicles',
    area: 'Leonida',
    description:
      'Gas station locations across the map.',
    tip: 'Useful as navigation points and places to explore.',
    mapPosition: { x: 650, y: 2900 },
    status: 'community',
    sourceName: 'GTABase',
    sourceUrl: MAP_SOURCE,
  },

  // MISC
  {
    id: 'misc-rodgers-range',
    name: 'Rodgers Ranch',
    category: 'misc',
    area: 'Kelly County',
    description:
      'Ranch and shooting-range point of interest north-east of Port Gellhorn.',
    tip: 'Explore the property and nearby structures.',
    mapPosition: { x: 1924, y: 708 },
    status: 'community',
    sourceName: 'Timesaver.GG',
    sourceUrl: 'https://timesaver.gg/tools/gta-6/map',
  },
  {
    id: 'misc-gas-stations',
    name: 'Service & Supply Stops',
    category: 'misc',
    area: 'Leonida',
    description:
      'General service locations and useful stops across Leonida.',
    tip: 'Use these as exploration and navigation points.',
    mapPosition: { x: 350, y: 1700 },
    status: 'community',
    sourceName: 'GTABase',
    sourceUrl: MAP_SOURCE,
  },
  {
    id: 'misc-landmarks',
    name: 'Landmarks & Discoveries',
    category: 'misc',
    area: 'Leonida',
    description:
      'General landmark and discovery marker for points of interest.',
    tip: 'Explore the surrounding area for additional discoveries.',
    mapPosition: { x: 1450, y: 3200 },
    status: 'community',
    sourceName: 'GTABase',
    sourceUrl: MAP_SOURCE,
  },

  // SECRETS
  {
    id: 'secret-skunk-ape',
    name: 'Skunk Ape Encounter',
    category: 'secrets',
    area: 'Grassrivers Swamps, south of Hamlet',
    description:
      'Reported mysterious creature encounter in the swamp region.',
    tip: 'Explore the wetlands and isolated swamp paths.',
    mapPosition: { x: 520, y: 2250 },
    status: 'community',
    sourceName: 'GTABase',
    sourceUrl: MAP_SOURCE,
  },
  {
    id: 'secret-ufo-abduction',
    name: 'UFO Abduction Encounter',
    category: 'secrets',
    area: 'Kelly County, near Starlet Motel',
    description:
      'Reported UFO-related encounter near the motel.',
    tip: 'Investigate the surrounding area.',
    mapPosition: { x: 1800, y: 1800 },
    status: 'community',
    sourceName: 'LeonidaGuide',
  },
  {
    id: 'secret-tv-tower-egg',
    name: 'Hidden Easter Egg Tower Nest',
    category: 'secrets',
    area: 'Vice City',
    description:
      'Reported hidden Easter egg around a tall radio tower.',
    tip: 'Look around the tower structure and nearby access points.',
    mapPosition: { x: 2300, y: 500 },
    status: 'community',
    sourceName: 'GTA6Bugs',
  },
  {
    id: 'secret-dog-island',
    name: 'Cool Dog',
    category: 'secrets',
    area: 'Hidden Island',
    description:
      'Community-reported dog discovery on a hidden island.',
    tip: 'Explore the smaller islands and shoreline.',
    mapPosition: { x: 2700, y: 3300 },
    status: 'community',
    sourceName: 'GTA6Bugs',
  },
  {
    id: 'secret-crab-research',
    name: 'Pelican Valley Crab Research Outpost',
    category: 'secrets',
    area: 'Pelican Valley',
    description:
      'Community-reported research outpost and unusual crab discovery.',
    tip: 'Search around the research buildings.',
    mapPosition: { x: 1200, y: 2750 },
    status: 'community',
    sourceName: 'GTA6Wiki',
  },
  {
    id: 'secret-mount-kalaga-meteorite',
    name: 'Smoking Meteorite',
    category: 'secrets',
    area: 'Mount Kalaga',
    description:
      'Reported meteorite discovery with unusual visual effects.',
    tip: 'Explore the mountain region.',
    mapPosition: { x: 1650, y: 300 },
    status: 'community',
    sourceName: "Enzo's Domain",
  },
  {
    id: 'secret-talking-parrot',
    name: 'Three Sheets Talking Parrot',
    category: 'secrets',
    area: 'Key Lento',
    description:
      'Reported talking parrot Easter egg near Three Sheets.',
    tip: 'Look around the shop and nearby outdoor areas.',
    mapPosition: { x: 820, y: 600 },
    status: 'community',
    sourceName: 'GamesRadar',
  },
  {
    id: 'secret-giant-crab',
    name: 'Giant Monster Crab',
    category: 'secrets',
    area: 'Coastal Leonida',
    description:
      'Rumored giant crab discovery.',
    tip: 'Explore coastal areas and beaches.',
    mapPosition: { x: 2600, y: 2500 },
    status: 'rumored',
    sourceName: 'TheGTA6Map',
  },
  {
    id: 'secret-abandoned-site-alien',
    name: 'Abandoned Site Alien Discovery',
    category: 'secrets',
    area: 'Leonida',
    description:
      'Rumored alien-related discovery at an abandoned location.',
    tip: 'Search abandoned structures and isolated properties.',
    mapPosition: { x: 400, y: 950 },
    status: 'rumored',
    sourceName: 'TheGTA6Map',
  },
  {
    id: 'secret-dexter-apartment',
    name: 'Dexter Morgan Apartment',
    category: 'secrets',
    area: 'Vice City',
    description:
      'Community-reported television reference and apartment discovery.',
    tip: 'Explore the surrounding apartment buildings.',
    mapPosition: { x: 2150, y: 1500 },
    status: 'community',
    sourceName: 'GTA Zone',
  },
  {
    id: 'secret-paul-walker-car',
    name: 'Paul Walker Tribute Car',
    category: 'secrets',
    area: 'Leonida',
    description:
      'Community-reported tribute vehicle discovery.',
    tip: 'Check the reported vehicle area and surrounding roads.',
    mapPosition: { x: 1050, y: 3100 },
    status: 'community',
    sourceName: 'GTA Zone',
  },
  {
    id: 'secret-mount-kalaga-ufo-recording',
    name: 'Mount Kalaga UFO Recording',
    category: 'secrets',
    area: 'Mount Kalaga',
    description:
      'Community-reported UFO recording discovery in the Mount Kalaga region.',
    tip: 'Explore the mountain area and look for unusual activity.',
    mapPosition: { x: 1900, y: 450 },
    status: 'community',
    sourceName: 'GTA6Bugs',
  },
  {
    id: 'secret-swamp-bunker',
    name: 'Hidden Swamp Bunker',
    category: 'secrets',
    area: 'Grassrivers',
    description:
      'Rumored hidden bunker in the swamp region.',
    tip: 'Search isolated structures and swamp paths.',
    mapPosition: { x: 300, y: 2500 },
    status: 'rumored',
    sourceName: 'TheGTA6Map',
  },
  {
    id: 'secret-space-debris',
    name: 'Space Debris Collectibles',
    category: 'secrets',
    area: 'Leonida',
    description:
      'Community-reported unusual debris and collectible discoveries.',
    tip: 'Explore remote areas for unusual objects.',
    mapPosition: { x: 2450, y: 3000 },
    status: 'community',
    sourceName: 'TheGTA6Map',
  },
]
