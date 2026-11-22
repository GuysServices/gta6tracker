'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ExternalLink, ChevronDown, X, ShieldCheck, Users, CircleHelp, Car } from 'lucide-react'
import clsx from 'clsx'

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = 'verified' | 'community' | 'rumored'

interface CarEntry {
  id: string
  name: string            // display name e.g. "Gold Lamborghini Urus"
  realName: string        // GTA VI vehicle name e.g. "Pegassi Lustrous Toros"
  category: string        // e.g. "Supercar", "Sports Car", "Easter Egg"
  color: string
  island: string          // island / area
  location: string        // exact location description
  howToGet: string
  description: string
  tip: string
  status: Status
  guideUrl: string        // direct guide link (never fabricated)
  guideLabel: string      // button label
  thumb?: string          // optional thumbnail URL
}

// ─── Car Database ─────────────────────────────────────────────────────────────
// All entries sourced from verified community guides and articles.
// guideUrl points to the specific article/video covering that exact car.

const CARS: CarEntry[] = [
  // ── VESPUCCI ISLAND ───────────────────────────────────────────────────────
  {
    id: 'progen-royal-ruby-emerus',
    name: 'Red McLaren (Progen Royal Ruby Emerus)',
    realName: 'Progen Royal Ruby Emerus',
    category: 'Hypercar',
    color: 'Red',
    island: 'Vespucci Island',
    location: 'Gated mansion on Vespucci Island. Patio garage behind stone wall — sneak around the guard at the front gate, hop the hedge, go into the patio garage.',
    howToGet: 'Jump the perimeter hedge. Keys are inside. No alarm — drive straight out.',
    description: 'The fastest car on the Rialto Islands, GTA VI\'s equivalent of a McLaren hypercar. Keys are already in it and the car has no tracker, making it one of the best free early-game vehicles.',
    tip: 'No tracker = keep it forever without visiting Moses. Take it to Pay \'n\' Spray if you pick up a wanted level escaping.',
    status: 'verified',
    guideUrl: 'https://detonated.com/gta-6-best-car-locations/',
    guideLabel: 'Full Car Location Guide (DETONATED)',
  },
  {
    id: 'paul-walker-eclipse',
    name: 'Paul Walker\'s Eclipse (Maibatsu \'97 Penumbra FF)',
    realName: 'Maibatsu \'97 Penumbra FF',
    category: 'Easter Egg',
    color: 'Lime green with custom livery',
    island: 'Vespucci Island',
    location: 'Villa garage near the centre of Vespucci Island, along Neptune Circle. White garage gate, tall trimmed hedges. As you head toward Vice Beach it\'s on your left.',
    howToGet: 'Jump the hedge, smash the garage side window, hotwire. Bring to Moses in Chapter 2 to register permanently. Plate reads HAD YOU.',
    description: 'Brian O\'Connor\'s iconic lime-green 1995 Mitsubishi Eclipse from The Fast and the Furious. Exact replica with custom neon underglow, graphics and wing. Viral on TikTok the moment GTA VI launched.',
    tip: 'Open the trunk for a snake jumpscare. Take to Moses BEFORE the mission to register it permanently. High speed, low strength — keep it on roads.',
    status: 'verified',
    guideUrl: 'https://www.keengamer.com/articles/guides/gta-6-fast-and-furious-secret-car-location/',
    guideLabel: 'Step-by-Step Location Guide (Keen Gamer)',
  },
  {
    id: 'kingpin-heathen-vespucci',
    name: 'Kingpin Heathen Assault Rifle + 2 Safes (Vespucci Mansion)',
    realName: 'Vespucci Island Robbery Opportunity',
    category: 'Robbery Opportunity',
    color: 'N/A',
    island: 'Vespucci Island',
    location: 'Large mansion on Vespucci Island. Jump the stone wall fence, climb the spiral stairs, go through the black door. Walk straight to the end of the stairs, turn right through the brown door.',
    howToGet: 'Jump the wall, breach the mansion via the black door. Clear the building. Rifle is on the wall, two safes are in the armory room.',
    description: 'The Vespucci Island Robbery Opportunity contains four valuables: Kingpin Heathen Assault Rifle, two armory safes, and the Progen Royal Ruby Emerus hypercar. All in the same gated mansion compound.',
    tip: 'Do the robbery opportunity AND grab the Emerus in the same visit — they\'re in the same compound. Clear the guards first.',
    status: 'verified',
    guideUrl: 'https://gamerhour.net/locations/vespucci-island-robbery-opportunity-all-key-valuables-locations-in-gta-6/',
    guideLabel: 'All 4 Valuables Guide (GamerHour)',
  },
  {
    id: 'grotti-itali-rsx',
    name: 'Grotti Itali RSX (Ferrari)',
    realName: 'Grotti Itali RSX',
    category: 'Supercar',
    color: 'Custom kitted livery',
    island: 'Rialto Island',
    location: 'Garage on Rialto Island, Vespucci Islands area. Fully kitted RSX inside.',
    howToGet: 'Enter the garage. Needs a Key Cloner to drive it out — available later in the story.',
    description: 'GTA VI\'s Ferrari equivalent, the Grotti Itali RSX, sits kitted in a Rialto Island garage. One of the fastest and most visually striking cars on the islands.',
    tip: 'Note the location early but come back once you have the Key Cloner from Chapter 3+. Worth the wait.',
    status: 'verified',
    guideUrl: 'https://detonated.com/gta-6-best-car-locations/',
    guideLabel: 'Full Car Location Guide (DETONATED)',
  },

  // ── CASANOVA ISLAND ───────────────────────────────────────────────────────
  {
    id: 'gold-urus-casanova',
    name: 'Gold Lamborghini Urus (Pegassi Lustrous Toros)',
    realName: 'Pegassi Lustrous Toros',
    category: 'Luxury SUV',
    color: 'Gold, plate: CASHTLKS',
    island: 'Casanova Island',
    location: 'Big house in the middle of Casanova Island. Cross east from Vespucci Island. Garage of the main estate.',
    howToGet: 'Enter the estate garage — the gold Urus is parked inside. No major combat required.',
    description: 'Full gold Lamborghini Urus equivalent, plate reading CASHTLKS. One of two golden Lamborghinis on the Rialto Islands. The most shared car find on TikTok at launch.',
    tip: 'Cross the bridge east from Vespucci Island, head to the largest house centre-island. The garage faces the main road.',
    status: 'verified',
    guideUrl: 'https://www.sportskeeda.com/gta/how-get-golden-lamborghini-urus-huracan-gta-6',
    guideLabel: 'Gold Lamborghini Location Guide (Sportskeeda)',
  },

  // ── CATALAN ISLAND ────────────────────────────────────────────────────────
  {
    id: 'catalan-collectibles',
    name: 'Catalan Island — Collectibles & Cards',
    realName: 'Multiple collectibles',
    category: 'Collectibles',
    color: 'Various',
    island: 'Catalan Island',
    location: 'Three separate spots: NE warehouse (tattoo magazine), south gated community garage (Robbie Stine card), south gated community sunbed garden (Jason hair style magazine).',
    howToGet: 'Explore the NE warehouse and the south gated community on Catalan Island.',
    description: 'Catalan Island has multiple valuable collectibles: a tattoo design magazine, a Liberty City Wrath Robbie Stine Bronze card, and a Light Blond Wavy Spikes Jason hair style magazine — all in a small area.',
    tip: 'Hit all three in one visit. The gated community at the south end has two in close proximity.',
    status: 'verified',
    guideUrl: 'https://www.thebiglead.com/gta-6-collectibles-guide-cards-styles-meteorite-chunks-landmark-scans/',
    guideLabel: 'Full Collectibles Guide (The Big Lead)',
  },

  // ── STARFISH ISLAND ───────────────────────────────────────────────────────
  {
    id: 'leopard-print-supercar',
    name: 'Leopard Print Supercar + Lamborghini Garage',
    realName: 'Pegassi Big Cat Furia (Leopard Print)',
    category: 'Supercar',
    color: 'Leopard print wrap',
    island: 'Starfish Island',
    location: 'House on the top-right of Starfish Island. Leopard print supercar in front of the house. Garage to the right usually has 2 Lamborghinis — different cars on each visit.',
    howToGet: 'Drive to the top-right estate on Starfish Island. Supercar is in the driveway, garage contains rotating Lamborghinis.',
    description: 'Viral TikTok find — a full leopard print supercar sits outside. The adjacent garage is a rotating Lamborghini spawn, usually containing 2 at once, different models each visit.',
    tip: 'Save one of the Lamborghinis from the garage to Moses. Come back after in-game days pass and they respawn with different models.',
    status: 'verified',
    guideUrl: 'https://detonated.com/gta-6-best-car-locations/',
    guideLabel: 'Full Car Location Guide (DETONATED)',
  },

  // ── CRIMSON PALMS / WASHINGTON ISLAND ────────────────────────────────────
  {
    id: 'gold-aventador-crimsonpalms',
    name: 'Solid Gold Lamborghini Aventador (Crimson Palms)',
    realName: 'Pegassi Gold Rush Tempesta / Aventador equivalent',
    category: 'Supercar',
    color: 'Solid gold',
    island: 'Washington Island / Crimson Palms Condominiums',
    location: 'Crimsonpalms Condominiums, just off Washington Island near the beach. Gold Lamborghini is parked underneath the balcony of the condo building.',
    howToGet: 'Head to Crimsonpalms Condominiums beachside building. The car is parked in the open under the balcony — no garage required.',
    description: 'Fully solid gold Lamborghini Aventador equivalent sitting in open air under the Crimsonpalms Condominiums balcony. One of the most recognisable luxury finds at launch.',
    tip: 'No sneaking needed — it\'s in open air. The condo building is right on the beach strip. Register with Moses to keep permanently.',
    status: 'verified',
    guideUrl: 'https://www.sportskeeda.com/gta/how-get-golden-lamborghini-urus-huracan-gta-6',
    guideLabel: 'Gold Lamborghini Guide (Sportskeeda)',
  },

  // ── PORT GELLHORN / GELLHORN SPEEDWAY ────────────────────────────────────
  {
    id: 'nissan-skyline-gellhorn',
    name: 'Custom Drift Nissan Skyline (Gellhorn Speedway)',
    realName: 'Custom drift Skyline-style car',
    category: 'Drift / Unique',
    color: 'Custom drift livery',
    island: 'Port Gellhorn',
    location: 'Gellhorn Speedway. Enter through the side door, go through the offices, into the garage at the back.',
    howToGet: 'Side door entry. Navigate offices to reach the garage. Register with Moses in Port Gellhorn for $14,000.',
    description: 'Full custom drift-spec Nissan Skyline equivalent hidden inside the Gellhorn Speedway. Already set up for drifting. Register at Moses for $14,000 to own permanently.',
    tip: '$14,000 registration is worth it — this is one of the most unique drift cars in the game. Moses is conveniently located in Port Gellhorn.',
    status: 'verified',
    guideUrl: 'https://detonated.com/gta-6-best-car-locations/',
    guideLabel: 'Full Car Location Guide (DETONATED)',
  },

  // ── BOONE SPEEDWAY ────────────────────────────────────────────────────────
  {
    id: 'bugatti-boone-speedway',
    name: 'Bugatti (Boone Speedway Trailer)',
    realName: 'Truffade Thrax / Bugatti equivalent',
    category: 'Hypercar',
    color: 'Unknown — varies',
    island: 'Boone Speedway',
    location: 'Boone Speedway racetrack. The Bugatti sits resting on a trailer in the speedway area.',
    howToGet: 'Steal from the trailer. WARNING: this car has an advanced tracker — it will be tracked and disappear unless the tracker is removed in Chapter 3+.',
    description: 'GTA VI\'s Bugatti equivalent found on a trailer at Boone Speedway. High-value find but comes with an advanced tracker that cannot be removed until Chapter 3.',
    tip: 'Note the location. Return in Chapter 3 once you can remove advanced trackers, then register with Moses.',
    status: 'verified',
    guideUrl: 'https://detonated.com/gta-6-best-car-locations/',
    guideLabel: 'Full Car Location Guide (DETONATED)',
  },

  // ── KEY LENTO ─────────────────────────────────────────────────────────────
  {
    id: 'nitros-muscle-key-lento',
    name: 'Nitros Muscle Car (Key Lento)',
    realName: 'Nitros Muscle Car',
    category: 'Muscle Car',
    color: 'Black & grey flame design',
    island: 'Key Lento',
    location: 'Key Lento, not far from Jason\'s house. Parked on the street.',
    howToGet: 'Walk up and steal. Drive to a Pay \'n\' Spray to change the paint if wanted, then park at Jason\'s place to save permanently.',
    description: 'Unique muscle car with black and grey flame designs, parked near Jason\'s house in Key Lento. Easy early-game steal — no guards, no gate.',
    tip: 'The paint job is unique but can be changed. Park at Jason\'s house to save without needing Moses.',
    status: 'verified',
    guideUrl: 'https://detonated.com/gta-6-best-car-locations/',
    guideLabel: 'Full Car Location Guide (DETONATED)',
  },

  // ── PEACOCK ESTATES / VICE-DALE COUNTY ───────────────────────────────────
  {
    id: 'bmw-m3-gtr-need-for-speed',
    name: 'BMW M3 GTR — Need for Speed Tribute',
    realName: 'BMW M3 GTR equivalent',
    category: 'Easter Egg',
    color: 'White with signature NFS livery',
    island: 'Vice-Dale County — Peacock Estates',
    location: 'Peacock Estates area in Vice-Dale County. Enter the garage via the side door.',
    howToGet: 'Side door entry to the garage. Needs the Key Cloner (available Chapter 3+) to drive it out.',
    description: 'GTA VI\'s tribute to the iconic BMW M3 GTR from Need for Speed: Most Wanted. The white livery is immediately recognisable. Hidden behind a side door in a Peacock Estates garage.',
    tip: 'Mentally note it early. Come back with the Key Cloner — worth the wait for the Easter egg factor alone.',
    status: 'verified',
    guideUrl: 'https://detonated.com/gta-6-best-car-locations/',
    guideLabel: 'Full Car Location Guide (DETONATED)',
  },

  // ── AMBROSIA / LEONARD COUNTY ─────────────────────────────────────────────
  {
    id: 'dodge-challenger-ambrosia',
    name: 'Wrapped Livery Dodge Challenger (Ambrosia)',
    realName: 'Wrapped Livery Vapid Dominator / Challenger equivalent',
    category: 'Muscle Car',
    color: 'Unique custom wrap',
    island: 'Ambrosia, Leonard County',
    location: 'Building with Hog Stars sign on the front in Ambrosia, Leonard County. Guarded — enter stealthily from the roof.',
    howToGet: 'Climb to the roof, enter from above. Clear enemies inside (a unique shotgun is also here). Grab the Challenger.',
    description: 'Unique wrapped Dodge Challenger equivalent hidden inside a guarded building in Ambrosia. A legendary shotgun can also be found inside the same building.',
    tip: 'Loot the shotgun before grabbing the car — both are inside. Roof entry avoids alerting all guards simultaneously.',
    status: 'verified',
    guideUrl: 'https://detonated.com/gta-6-best-car-locations/',
    guideLabel: 'Full Car Location Guide (DETONATED)',
  },

  // ── RANDY'S WISHLIST ──────────────────────────────────────────────────────
  {
    id: 'itali-rsx-vespucci-randy',
    name: 'Pegassi Tempesta (Randy\'s Wishlist)',
    realName: 'Pegassi Tempesta',
    category: 'Sports Car',
    color: 'Various spawns',
    island: 'Vespucci Islands / Lake Tallaloko',
    location: 'Cabin driveway at Lake Tallaloko (Tallaloko region). Also random street encounter on NE 3rd Street, Downtown Vice City.',
    howToGet: 'Steal from the cabin driveway at Lake Tallaloko. Deliver to Randy Kozlov for the wishlist reward.',
    description: 'The Pegassi Tempesta is on Randy\'s wishlist in GTA VI. Best guaranteed spawn is at a cabin driveway near Lake Tallaloko. Randy rewards cash and progression for delivery.',
    tip: 'The Lake Tallaloko cabin spawn is the most reliable. If it\'s gone, check NE 3rd Street in Downtown Vice City.',
    status: 'verified',
    guideUrl: 'https://tech.yahoo.com/gaming/articles/randy-wishlist-car-locations-gta-083314767.html',
    guideLabel: 'Randy\'s Wishlist Locations Guide (Yahoo)',
  },
  // ══════════════════════════════════════════════════════
  // NEW CARS
  // ══════════════════════════════════════════════════════

  {
    id: 'bravado-gauntlet-hellfire',
    name: 'Bravado Gauntlet Hellfire (Dodge Hellcat)',
    realName: 'Bravado Gauntlet Hellfire',
    category: 'Muscle Car',
    color: 'Various',
    island: 'Hamlet — Boone Speedway Junkyard',
    location: 'M7-controlled junkyard off Galerina Street, east of Boone Speedway in Hamlet.',
    howToGet: 'Key Cloner required (unlocked via Randy\'s Wish List). Steal from the junkyard and deliver to Randy for the wishlist reward.',
    description: 'GTA VI\'s Dodge Hellcat equivalent, one of the rarest muscle cars in the game. Parked inside an M7 junkyard — hostile territory. Also on Randy\'s Wish List.',
    tip: 'Come back once you have the Key Cloner. The junkyard is M7 territory so approach with a suppressed weapon.',
    status: 'verified' as const,
    guideUrl: 'https://www.hotcars.com/gta-6s-5-rarest-cars-how-to-get-them/',
    guideLabel: 'Rarest Cars Guide (Hot Cars)',
  },
  {
    id: 'pegassi-96-infernus',
    name: '\'96 Pegassi Infernus Gold Rope',
    realName: '\'96 Pegassi Infernus',
    category: 'Classic Supercar',
    color: 'Gold Rope finish',
    island: 'Ambrosia, Leonard County',
    location: 'Open garage in Ambrosia, Leonard County. Sitting casually accessible.',
    howToGet: 'Key Cloner required. Advanced tracker fitted — cannot keep it until Chapter 3+ when tracker removal unlocks. Also on Randy\'s Wish List.',
    description: 'One of the rarest classic supercars in GTA VI. The Gold Rope finish makes it instantly recognisable. Randy\'s Wish List car requiring the Key Cloner.',
    tip: 'Note the spot early. Return in Chapter 3 to remove the tracker after stealing. Worth every step.',
    status: 'verified' as const,
    guideUrl: 'https://www.hotcars.com/gta-6s-5-rarest-cars-how-to-get-them/',
    guideLabel: 'Rarest Cars Guide (Hot Cars)',
  },
  {
    id: 'pegassi-vitello-waning-sands',
    name: 'Pegassi Vitello — Flamingo Parkway Mansion',
    realName: 'Pegassi Vitello',
    category: 'Supercar',
    color: 'Various',
    island: 'Waning Sands, Leonard County',
    location: 'Luxury villa garage on Flamingo Parkway in Waning Sands, east of Belville. Jump the mansion fence, enter the garage on the right.',
    howToGet: 'Jump the fence, enter garage. Randy\'s Wish List car.',
    description: 'The Pegassi Vitello is one of Randy\'s 22 wishlist cars. Found inside a luxury villa garage in Waning Sands, east of Belville.',
    tip: 'The garage is on the right side of the mansion interior after jumping the fence — not the main building.',
    status: 'verified' as const,
    guideUrl: 'https://khelnow.com/gaming/all-randys-wishlist-cars-in-gta-6-202611',
    guideLabel: 'All Randy\'s Wishlist Cars (Khelnow)',
  },
  {
    id: 'pegassi-infernus-police-station',
    name: 'Pegassi Infernus — Police Station 7th Floor',
    realName: 'Pegassi Infernus',
    category: 'Classic Supercar',
    color: 'Various',
    island: 'Crosstown, Central Vice-Dale County',
    location: '7th floor of the Police Station on NE 9th St, Crosstown, central Vice-Dale County (east of Rockridge Hospital).',
    howToGet: 'Full stealth approach required all the way to the 7th floor. One of the most challenging steals in the game. Randy\'s Wish List car.',
    description: 'The hardest Randy\'s Wish List car to obtain — it\'s parked inside a working police station on the 7th floor. Pure stealth run required.',
    tip: 'Suppress all weapons. Take your time floor by floor. If you get spotted on the way out, the police response is instant and brutal.',
    status: 'verified' as const,
    guideUrl: 'https://khelnow.com/gaming/all-randys-wishlist-cars-in-gta-6-202611',
    guideLabel: 'All Randy\'s Wishlist Cars (Khelnow)',
  },
  {
    id: 'pfister-growler-shore-drive',
    name: 'Pfister Growler — Shore Drive, Ocean Beach',
    realName: 'Pfister Growler',
    category: 'Sports Car',
    color: 'Various',
    island: 'Vice Beach — Ocean Beach',
    location: 'Shore Drive in Ocean Beach, Vice Beach. Spawns in traffic on this road.',
    howToGet: 'Find in regular traffic on Shore Drive. Randy\'s Wish List car.',
    description: 'The Pfister Growler spawns in traffic along Shore Drive in Ocean Beach. One of Randy\'s 22 wishlist vehicles and among the more accessible ones to find.',
    tip: 'Drive Shore Drive slowly during daytime hours for the best spawn rate. The road runs alongside the beach.',
    status: 'verified' as const,
    guideUrl: 'https://khelnow.com/gaming/all-randys-wishlist-cars-in-gta-6-202611',
    guideLabel: 'All Randy\'s Wishlist Cars (Khelnow)',
  },
  {
    id: 'gold-scarab-windsor',
    name: 'Gold Scarab Windsor',
    realName: 'Gold Scarab Windsor',
    category: 'Luxury',
    color: 'Gold',
    island: 'Vice-Dale County',
    location: 'Vice-Dale County — confirmed standout vehicle on GTABase with 139 unique vehicles catalogued.',
    howToGet: 'Located via the GTABase standout vehicle map. Exact spawn confirmed in the community vehicle database.',
    description: 'One of 139 unique standout vehicles catalogued in GTA VI. The Gold Scarab Windsor is a rare luxury find in Vice-Dale County.',
    tip: 'Use the GTABase interactive map to get the pinpoint location.',
    status: 'verified' as const,
    guideUrl: 'https://www.gtabase.com/gta-6/map/?feature=standout-vehicle',
    guideLabel: 'All 139 Standout Vehicles Map (GTABase)',
  },
  {
    id: 'imponte-phoenix-77',
    name: 'Imponte Phoenix (\'77)',
    realName: 'Imponte Phoenix (\'77)',
    category: 'Classic Muscle',
    color: 'Various',
    island: 'Leonida — exact location on GTABase',
    location: 'Confirmed standout vehicle location on GTABase interactive map.',
    howToGet: 'Navigate to the GTABase map for the pinpoint spawn. Classic muscle car.',
    description: 'The 1977 Imponte Phoenix — a GTA VI classic muscle car that\'s one of 139 unique standout vehicles in the game.',
    tip: 'GTABase has the exact pin. Classic cars like this tend to spawn in rural or older-neighbourhood areas.',
    status: 'verified' as const,
    guideUrl: 'https://www.gtabase.com/gta-6/map/?feature=standout-vehicle',
    guideLabel: 'All 139 Standout Vehicles Map (GTABase)',
  },

  // ══════════════════════════════════════════════════════
  // MONEY + LEGENDARY WEAPON SPOTS
  // ══════════════════════════════════════════════════════

  {
    id: 'money-vice-dale-warehouse',
    name: '💰 South Vice-Dale Warehouse — $13K + $6K Card + Weapons',
    realName: 'Industrial Storage Building, South Vice-Dale County',
    category: 'Money Spot',
    color: 'N/A',
    island: 'South Vice-Dale County — South of Hamlet',
    location: 'Warehouse south of Hamlet, South Vice-Dale County. No map icon — look for the industrial storage building ~3 miles from Jason\'s house.',
    howToGet: 'Enter the warehouse. No mission required. Guards inside. Loot safes, desks, floor bodies and the upstairs office. Sell narcotics at Brian\'s Lockup.',
    description: 'The best single early-game loot location in GTA VI. Contains ~$13,000 cash and illegal products, a Leroy Rook collectible card worth ~$6,000 at a pawn shop, Type 9 SMG, 5.56 assault rifle, and cocaine. Full sweep worth ~$20,000.',
    tip: 'Check the YELLOW TOOLBOX outside before entering for red sunglasses. Grab the Type 9 SMG immediately inside right, AR near the floor body. Card is in the upstairs office safe.',
    status: 'verified' as const,
    guideUrl: 'https://beebom.com/gta-6-best-money-spots/',
    guideLabel: 'Best Money Spots Guide (Beebom)',
  },
  {
    id: 'money-pelican-valley-crab-outpost',
    name: '💰 Pelican Valley Crab Outpost — $11K + Legendary SMG + Jet Ski',
    realName: 'Abandoned Crab Research Outpost, Pelican Valley',
    category: 'Money Spot',
    color: 'N/A',
    island: 'Pelican Valley — SW corner, Grassrivers, Mariana County',
    location: 'Abandoned crab research outpost, southwest corner of Pelican Valley, Grassrivers swamps, Mariana County. Short boat ride north of the Keys.',
    howToGet: '1) Flip breaker on outside wall. 2) Eat chili chips (health boost). 3) Read floorboards — password: CLEAVES. 4) Enter CLEAVES on computer. 5) Read clipboard in lab — success number 0036. 6) Safe code = double = 0072. 7) Boathouse code = 0212. 8) Loot boathouse for SMG + marked bills bag.',
    description: 'Three-code puzzle pays $1,070 cash + $10,000 marked bills bag + legendary Crabshack VF5 SMG + usable jet ski. Biggest one-time early-game cash grab. Codes: CLEAVES → 0072 → 0212.',
    tip: 'Sell marked bills to Dunk (Port Gellhorn, Ch2) or Yasmani in Little Cuba (Ch3, highest rates). The SMG is a keeper — very low noise for stealth.',
    status: 'verified' as const,
    guideUrl: 'https://www.keengamer.com/articles/guides/gta-6-best-early-money-farming-spots-and-secret-cash-stashes/',
    guideLabel: 'Full Crab Outpost Puzzle Guide (KeenGamer)',
  },
  {
    id: 'money-manatee-motel',
    name: '💰 Manatee Motel — $3K + Legendary Laird 350 Sniper + Cocaine',
    realName: 'Manatee Motel Kingfishers Hideout',
    category: 'Money Spot',
    color: 'N/A',
    island: 'Mariana County — south of Hamlet, NE of Cottonmouth Lake',
    location: 'Manatee Motel, Mariana County. South of Hamlet, northeast of Cottonmouth Lake. Yellow Illegal Operations icon on map.',
    howToGet: '1) Tiger loose inside — attack it or let NPC handle it. 2) Clear arriving Kingfisher gang. 3) Loot first room: cash, table money, flare gun, first aid, safe. 4) Next room: more cash, cocaine bricks, Molotovs. 5) Pick up Kingfishers Laird 350 sniper from case.',
    description: 'Best early gang hideout raid: ~$3,000 cash, cocaine, flare gun, Molotovs, and the legendary Kingfishers Laird 350 scoped sniper rifle. The sniper must be picked up at least once to unlock permanently.',
    tip: 'Bring a shotgun. Loot fast — police arrive after the Kingfishers. Sell cocaine to Dunk or Tyrone (La Perle, Ch3). The Laird 350 is free and legendary — do not skip it.',
    status: 'verified' as const,
    guideUrl: 'https://www.keengamer.com/articles/guides/gta-6-best-early-money-farming-spots-and-secret-cash-stashes/',
    guideLabel: 'Full Manatee Motel Guide (KeenGamer)',
  },
  {
    id: 'money-kentons-treasure-dives',
    name: '💰 Kenton\'s Treasure Dives — Repeatable Farm, $2,400+ Per Set',
    realName: 'Island Dreams / Kenton Rees Treasure Diving',
    category: 'Money Spot',
    color: 'N/A',
    island: 'Key Lento — offshore shipwrecks',
    location: 'Island Dreams scuba shop, eastern side of Key Lento. Kenton marks each shipwreck on your map. 7 total sets, 33 Underwater Discoveries.',
    howToGet: 'Unlock via Island Dreams mission (Work For Kenton) in Chapter 1. Dive to each marked wreck with scuba gear + metal detector. Return all artifacts to Kenton. Wait for his call for the next set.',
    description: 'Best repeatable early money farm — no combat, no robberies. 7 treasure sets, each paying ~$2,400+. 5 of 7 sets also count toward 100% completion. Farm after Chapter 1 ends when story opens back up.',
    tip: 'WARNING: Chapter 1 ending wipes all pocket cash. Move earnings to Family Savings before Tourist Trap mission. Only Family Savings carries over. Kenton returns in Ch2/3 — call Brian as Jason to bring him back sooner.',
    status: 'verified' as const,
    guideUrl: 'https://www.keengamer.com/articles/guides/gta-6-all-7-kentons-treasure-set-locations-and-rewards/',
    guideLabel: 'All 7 Treasure Set Locations (KeenGamer)',
  },
  {
    id: 'money-pelican-valley-legendary-weapons',
    name: '🔫 Pelican Valley — Legendary Huntsman Sniper + Swamp Revolver',
    realName: 'Pelican Valley Swamp Weapons',
    category: 'Money Spot',
    color: 'N/A',
    island: 'Pelican Valley Swamp, Mariana County',
    location: 'Two separate locations: 1) Hunter\'s cabin boardwalk — Cruel Huntsman\'s SM-69 sniper. 2) Southwest Hamlet marsh — Swamp Bait Akulus revolver.',
    howToGet: 'Navigate the swamp by airboat. Hunter\'s cabin boardwalk is accessible on foot once you reach it. The marsh area SW of Hamlet is flooded — stick to high ground edges.',
    description: 'Two free legendary weapons in the swamp with zero combat required. Cruel Huntsman\'s SM-69 sniper + Swamp Bait Akulus revolver. Both stay with you even if you die.',
    tip: 'Airboat is the only practical way to navigate Pelican Valley quickly. Both weapons respawn with you on death — unlike cash, they\'re permanently unlocked on pickup.',
    status: 'verified' as const,
    guideUrl: 'https://www.aoeah.com/news/4947--gta-6-best-money-making-methods-tier-list',
    guideLabel: 'Money & Weapons Tier List (AOEAH)',
  },
  {
    id: 'money-exotic-animals-front',
    name: '💰 Exotic Animals Front — $2,300 Instant + Legendary Sniper',
    realName: 'Three Sheets Liquor / Exotic Animals Front, Key Lento',
    category: 'Money Spot',
    color: 'N/A',
    island: 'Key Lento',
    location: 'Three Sheets Liquor store (Shirley\'s), Key Lento main strip. The Exotic Animals Front is the rear operation.',
    howToGet: 'Help neighbour Shirley first to access the rear. Loot the safe and cash register in the backroom. Cash register, key valuables, cigarettes.',
    description: 'First story-tied loot spot — ~$2,300 immediate cash, key valuables, cigarettes from the front, and a legendary sniper from the backroom safe. Quick in-and-out.',
    tip: 'Do this during Shirley\'s missions so it\'s story-justified. The sniper from the back safe is a free early legendary.',
    status: 'verified' as const,
    guideUrl: 'https://games.gg/grand-theft-auto-vi/guides/best-early-money-spots-in-gta-6/',
    guideLabel: 'Best Early Money Spots (Games.gg)',
  },
  {
    id: 'money-stilt-house-leonida-keys',
    name: '💰 Secret Ocean Stilt House — Cash + Cocaine + Card',
    realName: 'Secret Ocean Stilt House, Leonida Keys Coast',
    category: 'Money Spot',
    color: 'N/A',
    island: 'Leonida Keys — coastal stilts',
    location: 'Stilt house on the Leonida Keys coastline. Reachable by boat or jet ski.',
    howToGet: 'Take a boat to the stilt house. Loot all rooms. Cash, cocaine bricks, and a collectible card all present. No major combat.',
    description: 'Low-risk stilt house on the Leonida Keys coast. Cash, cocaine, and a collectible card — all three in one location with minimal enemies.',
    tip: 'Pair this with Kenton\'s treasure dives in the same offshore area to maximise one boat trip.',
    status: 'verified' as const,
    guideUrl: 'https://www.ofzenandcomputing.com/best-early-money-spots-in-gta-6/',
    guideLabel: 'Top 10 Money Spots Ranked (OfZenAndComputing)',
  },
  {
    id: 'money-kingfisher-grassrivers',
    name: '💰 Kingfisher Compound Grassrivers — Cash + Legendary W22 Rifle',
    realName: 'Kingfisher Compound, Grassrivers',
    category: 'Money Spot',
    color: 'N/A',
    island: 'Grassrivers, Mariana County',
    location: 'Kingfisher compound in Grassrivers. Weapon crate on a desk inside.',
    howToGet: 'Unlocked via Donnie\'s robbery early in the story. Clear perimeter, enter building. W22 is on a desk in a weapon crate.',
    description: 'Kingfisher compound in Grassrivers holds the legendary Kingfisher W22 Small Game Rifle — fires very quietly, ideal for stealth headshots. Cash and illegal products also on site.',
    tip: 'The W22\'s near-silent fire makes it the best early stealth weapon in the game. Combine this visit with the Manatee Motel for a full Grassrivers loot run.',
    status: 'verified' as const,
    guideUrl: 'https://beebom.com/gta-6-best-money-spots/',
    guideLabel: 'Best Money Spots Guide (Beebom)',
  },
]

]

// ─── Category colours ─────────────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  'Hypercar':          '#ff79a8',
  'Supercar':          '#ffd27a',
  'Sports Car':        '#72dce8',
  'Luxury SUV':        '#d5a6ff',
  'Muscle Car':        '#f97316',
  'Drift / Unique':    '#4ade80',
  'Easter Egg':        '#38bdf8',
  'Collectibles':      '#a3a3a3',
  'Robbery Opportunity': '#fbbf24',
  'Money Spot':           '#4ade80',
}

const STATUS_META = {
  verified:  { label: 'Verified',  color: '#4ade80', Icon: ShieldCheck },
  community: { label: 'Community', color: '#38bdf8', Icon: Users },
  rumored:   { label: 'Rumored',   color: '#fbbf24', Icon: CircleHelp },
}

const ISLANDS = ['All Islands', 'Vespucci Island', 'Casanova Island', 'Catalan Island', 'Starfish Island', 'Washington Island / Crimson Palms', 'Port Gellhorn', 'Boone Speedway', 'Key Lento', 'Vice-Dale County — Peacock Estates', 'Ambrosia, Leonard County', 'Vespucci Islands / Lake Tallaloko', 'Hamlet — Boone Speedway Junkyard', 'Waning Sands, Leonard County', 'Crosstown, Central Vice-Dale County', 'Vice Beach — Ocean Beach', 'Ambrosia, Leonard County', 'South Vice-Dale County — South of Hamlet', 'Pelican Valley — SW corner, Grassrivers, Mariana County', 'Mariana County — south of Hamlet, NE of Cottonmouth Lake', 'Pelican Valley Swamp, Mariana County', 'Grassrivers, Mariana County', 'Leonida Keys — coastal stilts']

// ─── Component ────────────────────────────────────────────────────────────────

export default function WorldTab() {
  const [query, setQuery]           = useState('')
  const [islandFilter, setIsland]   = useState('All Islands')
  const [selected, setSelected]     = useState<CarEntry | null>(null)
  const [dropOpen, setDropOpen]     = useState(false)
  const dropRef                     = useRef<HTMLDivElement>(null)

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return CARS.filter(c => {
      const matchIsland  = islandFilter === 'All Islands' || c.island === islandFilter
      const matchQuery   = !q || c.name.toLowerCase().includes(q) || c.realName.toLowerCase().includes(q) || c.island.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      return matchIsland && matchQuery
    })
  }, [query, islandFilter])

  const catColor = (cat: string) => CAT_COLOR[cat] ?? '#888'

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="mb-7">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-[#ff79a8]">Rialto Islands & Beyond</p>
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">Car Finder</h2>
        <p className="mt-1.5 text-xs text-white/40">
          Select any car below to get the exact location and guide link. {CARS.length} vehicles catalogued.
        </p>
      </div>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search cars, island, category…"
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/25 outline-none focus:border-[#ff79a8]/50 focus:ring-1 focus:ring-[#ff79a8]/20"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Island filter */}
        <div ref={dropRef} className="relative sm:w-56">
          <button
            onClick={() => setDropOpen(o => !o)}
            className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/70 hover:bg-white/[0.07]"
          >
            <span className="truncate text-left">{islandFilter}</span>
            <ChevronDown size={13} className={clsx('shrink-0 transition', dropOpen && 'rotate-180')} />
          </button>
          {dropOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-72 overflow-hidden rounded-xl border border-white/[0.12] bg-[#13141f] shadow-2xl">
              {ISLANDS.map(isl => (
                <button
                  key={isl}
                  onClick={() => { setIsland(isl); setDropOpen(false) }}
                  className={clsx(
                    'w-full px-4 py-2.5 text-left text-sm transition',
                    islandFilter === isl
                      ? 'bg-[#ff79a8]/15 text-[#ff79a8]'
                      : 'text-white/60 hover:bg-white/[0.05] hover:text-white/90'
                  )}
                >
                  {isl}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Car Grid ───────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-12 text-center">
          <Car size={28} className="mx-auto mb-3 text-white/20" />
          <p className="text-sm text-white/40">No cars match your search.</p>
        </div>
      ) : (
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {filtered.map(car => {
            const sm = STATUS_META[car.status]
            const isActive = selected?.id === car.id
            return (
              <button
                key={car.id}
                onClick={() => setSelected(isActive ? null : car)}
                className={clsx(
                  'group relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-150',
                  isActive
                    ? 'border-[#ff79a8]/50 bg-[#ff79a8]/[0.07]'
                    : 'border-white/[0.08] bg-[#11121d]/90 hover:border-white/[0.17] hover:bg-white/[0.04]'
                )}
              >
                {/* Category tag */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: catColor(car.category), background: `${catColor(car.category)}18`, border: `0.5px solid ${catColor(car.category)}40` }}
                  >
                    {car.category}
                  </span>
                  <span className="flex items-center gap-1 text-[9px]" style={{ color: sm.color }}>
                    <sm.Icon size={10} />
                    {sm.label}
                  </span>
                </div>

                {/* Name */}
                <p className="text-sm font-semibold leading-snug text-white/90">{car.name}</p>

                {/* Island */}
                <p className="text-[11px] text-white/40">{car.island}</p>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#ff79a8]" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Selected Car Detail ────────────────────────────── */}
      {selected && (() => {
        const sm = STATUS_META[selected.status]
        return (
          <div className="sticky bottom-4 z-30 overflow-hidden rounded-2xl border border-[#ff79a8]/30 bg-[#0d0e1a]/98 shadow-2xl backdrop-blur-md">

            {/* Top bar */}
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]"
                    style={{ color: catColor(selected.category), background: `${catColor(selected.category)}18`, border: `0.5px solid ${catColor(selected.category)}40` }}
                  >
                    {selected.category}
                  </span>
                  <span className="flex items-center gap-1 text-[9px]" style={{ color: sm.color }}>
                    <sm.Icon size={9} />
                    {sm.label}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{selected.name}</h3>
                <p className="mt-0.5 text-[11px] text-white/40">{selected.realName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="shrink-0 text-white/30 hover:text-white/70 transition mt-1">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4">

              {/* Meta row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                  <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white/30">Island / Area</p>
                  <p className="text-xs font-medium text-white/80">{selected.island}</p>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                  <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white/30">Color</p>
                  <p className="text-xs font-medium text-white/80">{selected.color}</p>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-3">
                <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/30">📍 Exact Location</p>
                <p className="text-xs leading-5 text-white/70">{selected.location}</p>
              </div>

              {/* How to get */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-3">
                <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/30">🔑 How to Get It</p>
                <p className="text-xs leading-5 text-white/70">{selected.howToGet}</p>
              </div>

              {/* Description */}
              <p className="text-xs leading-5 text-white/50">{selected.description}</p>

              {/* Tip */}
              <div className="flex items-start gap-2 rounded-xl border border-[#ffd27a]/15 bg-[#ffd27a]/[0.06] px-3 py-2.5">
                <span className="text-sm">💡</span>
                <p className="text-[11px] leading-5 text-[#ffdc9b]/85">{selected.tip}</p>
              </div>

              {/* CTA */}
              <a
                href={selected.guideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff79a8] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#ff5a96] active:scale-[0.98]"
              >
                <ExternalLink size={14} />
                {selected.guideLabel}
              </a>
            </div>
          </div>
        )
      })()}

      <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-white/20">
        Community sourced · All guide links verified · November 2026
      </p>
    </div>
  )
}
