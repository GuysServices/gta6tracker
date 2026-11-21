
export type POICategory =
  | 'money'
  | 'weapons'
  | 'drugs'
  | 'ammo'
  | 'vehicles'
  | 'misc'
  | 'secrets'

export type POIStatus =
  | 'verified'
  | 'rumored'
  | 'community'

export interface WorldLocation {
  id: string
  name: string
  category: POICategory
  area: string
  coordinates?: string
  description: string
  tip?: string

  // Pixel position on the original 2805 x 3840 map image.
  mapPosition?: {
    x: number
    y: number
  }

  status: POIStatus
  sourceName?: string
  sourceUrl?: string
}

export const WORLD_LOCATIONS: WorldLocation[] = [
  {
    id: 'secret-skunk-ape',
    name: 'Skunk Ape Encounter',
    category: 'secrets',
    area: 'Grassrivers Swamps, south of Hamlet',
    description:
      'Leonida’s version of Bigfoot. The Skunk Ape can be spotted near Cottonmouth Lake eating a deer carcass before running into the woods.',
    tip:
      'Follow the creature to a strange wooden effigy. Investigating it triggers a hidden encounter. Kirk also has a related cryptid-hunting mission line.',
    status: 'verified',
    sourceName: 'GTABase',
    sourceUrl:
      'https://www.gtabase.com/gta-6/articles/gta-6-bigfoot-location-how-to-find-the-skunk-ape',
  },
  {
    id: 'secret-ufo-abduction',
    name: 'UFO Abduction Encounter',
    category: 'secrets',
    area: 'Kelly County, near Starlet Motel',
    description:
      'A nighttime UFO encounter involving a roadside vehicle, strange lights, and an abduction in the woods.',
    tip:
      'Finish Chapter 1 and investigate the roads near Starlet Motel after approximately 2 AM. Look for a vehicle with flashing lights.',
    status: 'verified',
    sourceName: 'LeonidaGuide',
    sourceUrl:
      'https://leonidaguide.gg/en/guides/easter-eggs/gta-6-easter-egg/',
  },
  {
    id: 'secret-tv-tower-egg',
    name: 'Hidden Easter Egg Tower Nest',
    category: 'secrets',
    area: 'Vice City, tallest radio tower',
    description:
      'A hidden nest containing painted Easter eggs at the top of the tallest radio or television tower.',
    tip:
      'Climb to the top of the tower, collect an egg, and throw it from the platform to trigger a special scene.',
    status: 'verified',
    sourceName: 'GTA6Bugs',
    sourceUrl:
      'https://gta6bugs.com/easter-eggs',
  },
  {
    id: 'secret-dog-island',
    name: 'Cool Dog — Hidden Island',
    category: 'secrets',
    area: 'Open water, around Gambit Bay',
    description:
      'A strange random encounter involving a dog wearing sunglasses that arrives on a jet ski and rescues stranded players.',
    tip:
      'Explore offshore waters and stay stranded long enough for the encounter to potentially trigger. Gambit Bay is a reported location.',
    status: 'community',
    sourceName: 'GTA6Bugs',
    sourceUrl:
      'https://gta6bugs.com/easter-eggs',
  },
  {
    id: 'secret-crab-research',
    name: 'Pelican Valley Crab Research Outpost',
    category: 'secrets',
    area: 'Pelican Valley, near the Leonida Keys',
    description:
      'An abandoned research laboratory containing failed crab experiments, a hidden safe, and a special weapon.',
    tip:
      'Turn on the exterior power switch. Computer password: CLEAVES. Safe code: 0072. Dock building keypad: 0212. Reported rewards include cash and the Crabshack VF5 SMG.',
    status: 'community',
    sourceName: 'GTA6Wiki',
    sourceUrl:
      'https://gta6wiki.eu/easter-eggs/pelican-valley-crab-research-outpost/',
  },
  {
    id: 'secret-mount-kalaga-meteorite',
    name: 'Smoking Meteorite',
    category: 'secrets',
    area: 'Mount Kalaga National Park',
    description:
      'A meteorite discovery near a mountain campsite, with a crater and unusual glowing smoke.',
    tip:
      'Search around the hillside campsite and inspect the crater for a meteorite collectible.',
    status: 'community',
    sourceName: 'Enzo’s Domain',
    sourceUrl:
      'https://www.enzoalder.com/gta-vi/easter-eggs',
  },
  {
    id: 'secret-talking-parrot',
    name: 'Three Sheets Talking Parrot',
    category: 'secrets',
    area: 'Three Sheets Liquor Store',
    description:
      'A talking parrot behind a liquor store gives players a clue about a hidden cash stash.',
    tip:
      'Complete Shirley’s rum errand, investigate the noises behind the store, and climb the fence to find the hidden exotic-animal operation. Listen to the parrot for the stash clue.',
    status: 'community',
    sourceName: 'GamesRadar',
    sourceUrl:
      'https://www.gamesradar.com/games/grand-theft-auto/exotic-animals-front-illegal-operation-gta-6/',
  },
  {
    id: 'secret-giant-crab',
    name: 'Giant Monster Crab',
    category: 'secrets',
    area: 'Unknown — reported house encounter',
    description:
      'A reported giant mutant crab encounter that can trigger a short cutscene.',
    tip:
      'The exact location and trigger conditions have not been established. Keep this marked as a mystery until more evidence appears.',
    status: 'rumored',
    sourceName: 'TheGTA6Map',
    sourceUrl:
      'https://thegta6map.com/easter-eggs',
  },
  {
    id: 'secret-abandoned-site-alien',
    name: 'Abandoned Site Alien Discovery',
    category: 'secrets',
    area: 'Grassrivers, northeast of Cottonmouth Lake',
    description:
      'A reported unusual alien discovery behind a keypad-controlled entrance at an abandoned site.',
    tip:
      'Investigate the abandoned site. A keypad code has circulated online, but reports disagree about whether it works.',
    status: 'rumored',
    sourceName: 'TheGTA6Map',
    sourceUrl:
      'https://thegta6map.com/easter-eggs',
  },
  {
    id: 'secret-dexter-apartment',
    name: 'Dexter Morgan Apartment',
    category: 'secrets',
    area: 'Washington Island, Vice Beach',
    description:
      'A hidden television-series reference recreating the distinctive apartment building associated with Dexter Morgan.',
    tip:
      'Look for Trinity Apartments on Washington Island. The exterior walkway and corner apartment are the main details to investigate.',
    status: 'community',
    sourceName: 'GTA Zone',
    sourceUrl:
      'https://gta-zone.com/news/gta-6-easter-eggs/',
  },
  {
    id: 'secret-paul-walker-car',
    name: 'Paul Walker Tribute Car',
    category: 'secrets',
    area: 'Vespucci Island, Vice City',
    description:
      'A reported green sports car referencing Brian O’Conner’s Mitsubishi Eclipse from The Fast and the Furious.',
    tip:
      'Investigate the villa garage and look for the distinctive green sports car.',
    status: 'community',
    sourceName: 'GTA Zone',
    sourceUrl:
      'https://gta-zone.com/news/gta-6-easter-eggs/',
  },
  {
    id: 'secret-mount-kalaga-ufo-recording',
    name: 'Mount Kalaga UFO Recording',
    category: 'secrets',
    area: 'Mount Kalaga National Park',
    description:
      'A hidden phone recording reportedly documents a UFO sighting near a mountain campsite.',
    tip:
      'Search the campsite trails for a dropped phone and investigate the nearby meteorite area.',
    status: 'community',
    sourceName: 'GTA6Bugs',
    sourceUrl:
      'https://gta6bugs.com/easter-eggs',
  },
  {
    id: 'secret-swamp-bunker',
    name: 'Hidden Swamp Bunker',
    category: 'secrets',
    area: 'Grassrivers',
    description:
      'A reported hidden bunker in the swamp region. Its exact entrance and contents need further confirmation.',
    tip:
      'Investigate unusual structures and entrances around the swamp. Exact coordinates are not yet established.',
    status: 'rumored',
    sourceName: 'TheGTA6Map',
    sourceUrl:
      'https://thegta6map.com/easter-eggs',
  },
  {
    id: 'secret-space-debris',
    name: 'Space Debris Collectibles',
    category: 'secrets',
    area: 'Various locations throughout Leonida',
    description:
      'Unusual pieces of space debris scattered around the world that can be scanned using the WAiNK app.',
    tip:
      'Use WAiNK to scan unusual debris. Reported completion reward: the Powdered Sugar screen filter cheat.',
    status: 'community',
    sourceName: 'TheGTA6Map',
    sourceUrl:
      'https://thegta6map.com/easter-eggs',
  },
]

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
    color: 'text-[#a8d8a8]',
    bg: 'bg-[#5fad5f]/10 border-[#5fad5f]/25 hover:bg-[#5fad5f]/15',
  },
  {
    key: 'misc',
    label: 'Misc',
    color: 'text-white/60',
    bg: 'bg-white/[0.04] border-white/15 hover:bg-white/[0.07]',
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
