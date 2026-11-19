export type MissionType = 'main' | 'side' | 'heist' | 'strangers'
export type Protagonist = 'lucia' | 'jason' | 'both'

export interface Mission {
  id: string
  name: string
  type: MissionType
  protagonist: Protagonist
  description: string
}

export interface Chapter {
  id: string
  number: number
  name: string
  protagonist: Protagonist
  description: string
  missions: Mission[]
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    name: 'Leonida Dreams',
    protagonist: 'both',
    description: 'Two outlaws, one shot at something better.',
    missions: [
      { id: 'ch1-m1', name: 'The Arrival', type: 'main', protagonist: 'both', description: 'Lucia and Jason land in Leonida.' },
      { id: 'ch1-m2', name: 'First Score', type: 'main', protagonist: 'both', description: 'A quick job to get back on their feet.' },
      { id: 'ch1-m3', name: 'Old Contacts', type: 'side', protagonist: 'jason', description: 'Jason reconnects with someone from before.' },
      { id: 'ch1-m4', name: 'The Stash House', type: 'heist', protagonist: 'both', description: 'Small operation, big consequences.' },
      { id: 'ch1-m5', name: 'Vice City Limits', type: 'main', protagonist: 'lucia', description: 'Lucia scouts the city for opportunity.' },
      { id: 'ch1-m6', name: 'Tourist Season', type: 'strangers', protagonist: 'both', description: 'A stranger with a strange request.' },
    ],
  },
  {
    id: 'ch2',
    number: 2,
    name: 'Vice City',
    protagonist: 'both',
    description: 'The city opens up. So do the dangers.',
    missions: [
      { id: 'ch2-m1', name: 'Neon & Chrome', type: 'main', protagonist: 'both', description: 'First real contact with the Vice City underworld.' },
      { id: 'ch2-m2', name: 'The Club', type: 'main', protagonist: 'lucia', description: 'Lucia works an angle inside a Vice City nightclub.' },
      { id: 'ch2-m3', name: 'Swamp Run', type: 'side', protagonist: 'jason', description: 'Jason handles business out in the wetlands.' },
      { id: 'ch2-m4', name: 'Offshore', type: 'heist', protagonist: 'both', description: 'A job that requires a boat and a plan.' },
      { id: 'ch2-m5', name: 'The Connection', type: 'main', protagonist: 'both', description: 'Meeting the people who run this city.' },
      { id: 'ch2-m6', name: 'Heat', type: 'main', protagonist: 'both', description: 'The law starts paying attention.' },
      { id: 'ch2-m7', name: 'Ghost Town', type: 'strangers', protagonist: 'jason', description: 'Something strange out in the abandoned development.' },
    ],
  },
  {
    id: 'ch3',
    number: 3,
    name: 'The Setup',
    protagonist: 'both',
    description: 'Building toward the score of a lifetime.',
    missions: [
      { id: 'ch3-m1', name: 'Moving Weight', type: 'main', protagonist: 'both', description: 'A logistics job that reveals the bigger picture.' },
      { id: 'ch3-m2', name: 'Inside Man', type: 'main', protagonist: 'lucia', description: 'Lucia goes undercover.' },
      { id: 'ch3-m3', name: 'The Everglades Job', type: 'heist', protagonist: 'both', description: 'Deep in the wetlands, the heat is everywhere.' },
      { id: 'ch3-m4', name: 'Loose Ends', type: 'side', protagonist: 'jason', description: 'Old business resurfaces.' },
      { id: 'ch3-m5', name: 'Double Cross', type: 'main', protagonist: 'both', description: 'Someone in the crew is not who they say.' },
      { id: 'ch3-m6', name: 'Regroup', type: 'main', protagonist: 'both', description: 'After the fallout, a new plan.' },
      { id: 'ch3-m7', name: 'The Broker', type: 'strangers', protagonist: 'lucia', description: 'A contact who can open doors — for a price.' },
      { id: 'ch3-m8', name: 'Night Freight', type: 'heist', protagonist: 'both', description: 'Midnight interception on the highway.' },
    ],
  },
  {
    id: 'ch4',
    number: 4,
    name: 'Kings of Leonida',
    protagonist: 'both',
    description: 'The empire or the exit — no middle ground.',
    missions: [
      { id: 'ch4-m1', name: 'Taking the Crown', type: 'main', protagonist: 'both', description: 'A power vacuum and two people ready to fill it.' },
      { id: 'ch4-m2', name: 'The Governor', type: 'main', protagonist: 'lucia', description: 'Politics meets crime at the highest level.' },
      { id: 'ch4-m3', name: 'Cartel Business', type: 'main', protagonist: 'both', description: 'The outside party wants their cut.' },
      { id: 'ch4-m4', name: 'Southside Ops', type: 'side', protagonist: 'jason', description: 'Ground-level work to hold the territory.' },
      { id: 'ch4-m5', name: 'The Grand Heist', type: 'heist', protagonist: 'both', description: 'Everything built toward this.' },
      { id: 'ch4-m6', name: 'Aftermath', type: 'main', protagonist: 'both', description: 'The fallout from the biggest score.' },
      { id: 'ch4-m7', name: 'No Loose Ends', type: 'main', protagonist: 'both', description: 'Cleaning up before the finale.' },
    ],
  },
  {
    id: 'ch5',
    number: 5,
    name: 'The Long Goodbye',
    protagonist: 'both',
    description: 'Get out, or go down trying.',
    missions: [
      { id: 'ch5-m1', name: 'Burn It Down', type: 'main', protagonist: 'both', description: 'The city burns and so does the plan.' },
      { id: 'ch5-m2', name: 'Last Run', type: 'main', protagonist: 'both', description: 'One final job. No second chances.' },
      { id: 'ch5-m3', name: 'The Reckoning', type: 'main', protagonist: 'both', description: 'Settling every score before the end.' },
      { id: 'ch5-m4', name: 'Sunset', type: 'main', protagonist: 'both', description: 'The ending. What you built, what you lost.' },
    ],
  },
]

export function getTotalMissions(): number {
  return CHAPTERS.reduce((acc, ch) => acc + ch.missions.length, 0)
}

export function getMissionById(id: string): Mission | undefined {
  for (const ch of CHAPTERS) {
    const m = ch.missions.find(m => m.id === id)
    if (m) return m
  }
}
