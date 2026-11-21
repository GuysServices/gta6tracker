
export type POICategory =
  | 'money'
  | 'weapons'
  | 'drugs'
  | 'ammo'
  | 'vehicles'
  | 'misc'

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

  // Position on the map, using the 900 × 640 map coordinate system.
  mapPosition?: {
    x: number
    y: number
  }

  // Keep unconfirmed information clearly identified.
  status: POIStatus

  // Optional source used to verify this location.
  sourceName?: string
  sourceUrl?: string
}

export const WORLD_LOCATIONS: WorldLocation[] = [
  {
    id: 'test-money-01',
    name: 'TEST — Money Location',
    category: 'money',
    area: 'Test Area',
    coordinates: 'Test coordinates',
    description: 'Temporary test marker for the Money category.',
    tip: 'This is a test pin. Not a confirmed GTA VI location.',
    mapPosition: { x: 486, y: 3348 },
    status: 'community',
  },
  {
    id: 'test-weapons-01',
    name: 'TEST — Weapons Location',
    category: 'weapons',
    area: 'Test Area',
    coordinates: 'Test coordinates',
    description: 'Temporary test marker for the Weapons category.',
    tip: 'This is a test pin. Not a confirmed GTA VI location.',
    mapPosition: { x: 2211, y: 2136 },
    status: 'community',
  },
  {
    id: 'test-drugs-01',
    name: 'TEST — Drugs Location',
    category: 'drugs',
    area: 'Test Area',
    coordinates: 'Test coordinates',
    description: 'Temporary test marker for the Drugs category.',
    tip: 'This is a test pin. Not a confirmed GTA VI location.',
    mapPosition: 	{ x: 632, y: 2088 },
    status: 'community',
  },
  {
    id: 'test-ammo-01',
    name: 'TEST — Ammo Location',
    category: 'ammo',
    area: 'Test Area',
    coordinates: 'Test coordinates',
    description: 'Temporary test marker for the Ammo category.',
    tip: 'This is a test pin. Not a confirmed GTA VI location.',
    mapPosition: { x: 1364, y: 2178 },
    status: 'community',
  },
  {
    id: 'test-vehicles-01',
    name: 'TEST — Vehicles Location',
    category: 'vehicles',
    area: 'Test Area',
    coordinates: 'Test coordinates',
    description: 'Temporary test marker for the Vehicles category.',
    tip: 'This is a test pin. Not a confirmed GTA VI location.',
    mapPosition: { x: 872, y: 3516 },
    status: 'community',
  },
  {
    id: 'test-misc-01',
    name: 'TEST — Misc Location',
    category: 'misc',
    area: 'Test Area',
    coordinates: 'Test coordinates',
    description: 'Temporary test marker for the Misc category.',
    tip: 'This is a test pin. Not a confirmed GTA VI location.',
    mapPosition: { x: 1924, y: 708 },
    status: 'community',
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
]

export const CATEGORY_ICON: Record<POICategory, string> = {
  money: '💰',
  weapons: '🔫',
  drugs: '📦',
  ammo: '🎯',
  vehicles: '🚗',
  misc: '🗺️',
}
