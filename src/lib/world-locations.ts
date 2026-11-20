export type POICategory = 'money' | 'weapons' | 'drugs' | 'ammo' | 'vehicles' | 'misc'

export interface WorldLocation {
  id: string
  name: string
  category: POICategory
  area: string
  description: string
  tip: string
  coordinates?: string   // rough in-game map label
}

export const WORLD_LOCATIONS: WorldLocation[] = [
  // ── MONEY ──────────────────────────────────────────────────────────────────
  {
    id: 'money-01',
    name: 'Leonida Keys Cash Stash',
    category: 'money',
    area: 'Leonida Keys',
    description: 'Briefcase under the dock at the southernmost fishing pier near Malibu Bay. Respawns every in-game day.',
    tip: 'Easiest early-game cash. Dive from the dock — it\'s wedged under the third post. Swim back to shore before the shark patrol spawns.',
    coordinates: 'South Keys, dock row',
  },
  {
    id: 'money-02',
    name: 'Port Gellhorn Shipping Office Safe',
    category: 'money',
    area: 'Port Gellhorn',
    description: 'Office safe on the second floor of the harbor master building. Unlocked by a keycard found on a patrolling guard outside.',
    tip: 'Kill the night guard (11 PM–3 AM window), grab the keycard, go straight up. Safe holds $6,000–$9,000. The building resets daily.',
    coordinates: 'Port Gellhorn, Harbor Master Blvd',
  },
  {
    id: 'money-03',
    name: 'Vice City Pawnshop Register Run',
    category: 'money',
    area: 'Vice City — Little Haiti',
    description: 'Three pawnshops in Little Haiti within 400m of each other. Each register holds $800–$1,200. All three can be hit in under 4 minutes.',
    tip: 'Hit them 7–9 AM before the area gets busy. Two stars max if you\'re fast. Drive the getaway car around the block first to scope exits.',
    coordinates: 'Little Haiti strip, near Dominguez Ave',
  },
  {
    id: 'money-04',
    name: 'Cartel Stash House — Westport',
    category: 'money',
    area: 'Vice City — Westport',
    description: 'Cartel-run stash house with two guards. Interior holds cash bags worth $14,000–$18,000 total. Resets every 48 in-game hours.',
    tip: 'Come with suppressed weapons. The rear window is unwatched. One guard patrols inside — wait for him to face away. Bags are in the back bedroom and bathroom.',
    coordinates: 'Westport, 7th and Crescent',
  },
  {
    id: 'money-05',
    name: 'Racetrack Bookmaker',
    category: 'money',
    area: 'Leonida Keys — Crescent Park',
    description: 'Illegal bookmaker operating out of a trailer at the Keys racetrack. The cashbox resets every race event (every 2 in-game days).',
    tip: 'No guards inside the trailer — just the bookie. Threaten him (don\'t shoot) and he hands over $5,000–$7,000. Zero wanted level if no one sees you enter.',
    coordinates: 'Crescent Park Raceway, north lot',
  },
  {
    id: 'money-06',
    name: 'Sunken Armored Truck — Ocean Beach',
    category: 'money',
    area: 'Vice City — Ocean Beach',
    description: 'An armored truck is submerged 15m off the Ocean Beach pier. Blew off the road in a Ch2 cutscene. Cash inside: $22,000.',
    tip: 'Needs a boat and decent lung capacity. Bring a scuba tank item if you have one. The rear door is already cracked — just reach in. One-time pickup.',
    coordinates: 'Ocean Beach pier, 15m east',
  },
  {
    id: 'money-07',
    name: 'Heder Family Ranch Safe',
    category: 'money',
    area: 'North Leonida',
    description: 'Hidden safe behind a painting in the Heder Ranch main house. Accessible from Ch3 onward. Holds $11,000.',
    tip: 'Available only after Meet the Heders. The safe is behind the elk painting in the study. No alarm — just don\'t get caught by Brian. Wait for the cutscene to end before entering.',
    coordinates: 'Heder Ranch, north of Hamlet',
  },

  // ── WEAPONS ─────────────────────────────────────────────────────────────────
  {
    id: 'weapon-01',
    name: 'Free Shotgun — Keys Bait Shop',
    category: 'weapons',
    area: 'Leonida Keys',
    description: 'Pump-action shotgun leaning against the wall inside the Keys Bait & Tackle shop. Grab it without paying. No wanted level.',
    tip: 'Available from the game\'s very start. Great early weapon. The shop owner is unarmed — just walk in and take it off the wall. Respawns after one in-game day.',
    coordinates: 'Keys Bait & Tackle, Main Keys Rd',
  },
  {
    id: 'weapon-02',
    name: 'Suppressed Pistol — Cartel Lieutenant Body',
    category: 'weapons',
    area: 'Port Gellhorn',
    description: 'A cartel lieutenant drops a suppressed pistol after the Ch1 mission Clean Up After Donnie. Body stays on map for 24 in-game hours.',
    tip: 'After the mission ends, backtrack to the alley. The suppressed pistol is a major early-game upgrade — saves money on a suppressor attachment.',
    coordinates: 'Port Gellhorn docks alley',
  },
  {
    id: 'weapon-03',
    name: 'Sniper Rifle — Lighthouse Roof',
    category: 'weapons',
    area: 'Leonida Keys — Cape Malibu',
    description: 'Bolt-action sniper rifle on the roof of the Cape Malibu lighthouse. Requires climbing the exterior ladder on the east side.',
    tip: 'No enemies. The ladder is easy to miss — it\'s on the ocean-facing wall. Grab it in Ch1 and keep it; sniper ammo is expensive at shops.',
    coordinates: 'Cape Malibu Lighthouse',
  },
  {
    id: 'weapon-04',
    name: 'SMG Cache — Abandoned Sugar Mill',
    category: 'weapons',
    area: 'North Leonida',
    description: 'Crate of SMGs (3 weapons + 300 rounds) stashed in the boiler room of the derelict sugar mill north of Port Gellhorn.',
    tip: 'The mill has two Redneck Militia guards on the perimeter. Take them out or sprint past — they\'re slow. The boiler room door is rusted but can be kicked open.',
    coordinates: 'Old Sugar Mill, Route 7 north',
  },
  {
    id: 'weapon-05',
    name: 'Military Assault Rifle — VCIA Cargo Drop',
    category: 'weapons',
    area: 'Vice City — Airport District',
    description: 'After the VCIA Takedown heist in Ch4, a military crate is left near the south terminal. Contains a M4-equivalent assault rifle.',
    tip: 'Available immediately after the heist cutscene ends. Sprint to the south terminal cargo area before it despawns (10-minute window). Best rifle in the game to this point.',
    coordinates: 'Vice City Airport, south terminal cargo bay',
  },
  {
    id: 'weapon-06',
    name: 'Grenade Launcher — National Guard Outpost',
    category: 'weapons',
    area: 'Central Leonida',
    description: 'Grenade launcher inside a locked armory at the National Guard outpost. Requires a keycard from the captain\'s desk.',
    tip: 'The captain is at his desk 9 AM–5 PM. Pickpocket him (crouch + approach from behind) for the keycard. Armory is the third door on the left. Guards inside are unarmed.',
    coordinates: 'Ft. Leonida Outpost, Central Rd',
  },

  // ── DRUGS ───────────────────────────────────────────────────────────────────
  {
    id: 'drug-01',
    name: 'Cartel Coke Stash — Keys Wetlands',
    category: 'drugs',
    area: 'Leonida Keys',
    description: 'Cocaine bricks (×6) hidden in a waterproofed bag under a mangrove root deep in the Keys wetlands. Sellable to any drug fence for $4,500 each.',
    tip: 'Easiest to reach by airboat. The root cluster is marked by a red rag tied to a branch — look for it in the third bend north of the launch point. No enemies; occasional gator.',
    coordinates: 'Keys Wetlands, third bend north',
  },
  {
    id: 'drug-02',
    name: 'Lab Seizure — Port Gellhorn Warehouse',
    category: 'drugs',
    area: 'Port Gellhorn',
    description: 'Meth lab in an unmarked Port Gellhorn warehouse. Six guards. Inside: bulk meth worth $28,000 at fence prices.',
    tip: 'Hit it at night — four of the six guards rotate inside and can be isolated. Use suppressed weapons. The lab itself has a secondary explosion risk — shoot anywhere except the cook station.',
    coordinates: 'Port Gellhorn, Industrial Row warehouse C',
  },
  {
    id: 'drug-03',
    name: 'Cocaine Shipment Intercept — Ocean Highway',
    category: 'drugs',
    area: 'South Leonida Highway',
    description: 'A cartel convoy runs the Ocean Highway between 10 PM and 2 AM carrying cocaine bricks. 3 vehicles, 8 guards total.',
    tip: 'Spike strip the lead vehicle using the crafted item (or buy from fence). When the convoy stops, the rear guard panics first — take him out and work forward. Cargo: 12 bricks, $54,000 at fence. High two-star wanted level.',
    coordinates: 'Ocean Hwy, mile marker 14–18',
  },
  {
    id: 'drug-04',
    name: 'Vice City Club Supplier',
    category: 'drugs',
    area: 'Vice City — Neon Strip',
    description: 'Club promoter at the Neon Strip back entrance sells coke and pills at reduced prices and buys stolen supply at premium. Available after Ch3.',
    tip: 'He only appears 10 PM–4 AM. Approach from the alley — going through the front triggers the club\'s security flagging you. Best price: $2,800/brick buy, $5,200/brick sell.',
    coordinates: 'Neon Strip, Club Equinox back alley',
  },
  {
    id: 'drug-05',
    name: 'Backroom Pills — Little Haiti Pharmacy',
    category: 'drugs',
    area: 'Vice City — Little Haiti',
    description: 'Prescription opioids and street pills in the back of a Little Haiti pharmacy. The pharmacist locks the storeroom at 6 PM.',
    tip: 'Go in before 6 PM and ask to use the restroom — the guard will escort you past the locked door. Duck into the storeroom instead. Pills worth $1,200 at any fence. Zero wanted.',
    coordinates: 'Little Haiti, 3rd Ave pharmacy',
  },

  // ── AMMO ────────────────────────────────────────────────────────────────────
  {
    id: 'ammo-01',
    name: 'Free Ammo Crate — Keys Army Surplus',
    category: 'ammo',
    area: 'Leonida Keys',
    description: 'Unlocked ammo crate outside the Army Surplus on the Keys main road. 50 rounds of pistol, 30 shotgun shells. Respawns daily.',
    tip: 'Free early-game resource. No crime to take it — it\'s listed as a display item. Good for stocking up between missions in Ch1.',
    coordinates: 'Keys Main Rd, Army Surplus',
  },
  {
    id: 'ammo-02',
    name: 'Hidden Rifle Ammo — Cartel Roof Cache',
    category: 'ammo',
    area: 'Port Gellhorn',
    description: '200 rifle rounds in a duffel bag on the roof of the Port Gellhorn processing plant. Reachable via the fire escape on the north side.',
    tip: 'No guards on the roof. Worth grabbing before the Ch2 combat stretch. Saves $600+ at Ammu-Nation.',
    coordinates: 'Port Gellhorn Processing Plant, north roof',
  },

  // ── VEHICLES ─────────────────────────────────────────────────────────────────
  {
    id: 'vehicle-01',
    name: 'Supercar Spawn — Ocean Beach Marina',
    category: 'vehicles',
    area: 'Vice City — Ocean Beach',
    description: 'A high-end sports car (Zorrusso or Infernus class) spawns at the Ocean Beach marina parking lot between 8 AM and noon. Available from Ch3.',
    tip: 'Save it to your garage immediately — it despawns after 2 in-game hours if not stored. Fastest road vehicle available before the Ch4 vehicle missions.',
    coordinates: 'Ocean Beach Marina, west lot',
  },
  {
    id: 'vehicle-02',
    name: 'Helicopter — Vice City Hospital Roof',
    category: 'vehicles',
    area: 'Vice City — Medical District',
    description: 'An unguarded helicopter sits on the hospital helipad. Accessible by taking the stairwell to the roof.',
    tip: 'Available after Ch2. The roof door is never locked. Helicopter starts at full fuel. Best way to cross Vice City without traffic. Keep it — the game won\'t flag a 1-star for taking it if you\'re undetected on the stairs.',
    coordinates: 'Vice City General Hospital, rooftop',
  },
  {
    id: 'vehicle-03',
    name: 'Armored Truck — Keys Militia Camp',
    category: 'vehicles',
    area: 'North Leonida',
    description: 'A military-grade armored truck is parked in the Redneck Militia camp north of the Keys. Six guards. Vehicle is unlocked.',
    tip: 'Easiest approach: steal it at dawn (5–6 AM) when guards are at shift change — only two are actively watching the truck. The armor means it tanks pursuit. Useful for the Ch2 bank job setup.',
    coordinates: 'Militia Camp, Route 9 north junction',
  },

  // ── MISC ─────────────────────────────────────────────────────────────────────
  {
    id: 'misc-01',
    name: 'Armor Vest — Swamp Cabin',
    category: 'misc',
    area: 'Keys Wetlands',
    description: 'Full body armor vest hanging on a peg inside an abandoned swamp cabin. Respawns every 48 in-game hours.',
    tip: 'Free full armor — worth $2,500 at shops. The cabin has no enemies. Reachable only by airboat or swimming. Stack with one from a shop for double armor on big missions.',
    coordinates: 'Wetlands, unmarked cabin north of launch 2',
  },
  {
    id: 'misc-02',
    name: 'Health Pack Stash — Keys Fishing Village',
    category: 'misc',
    area: 'Leonida Keys',
    description: 'Medical kit stash behind the dumpster at the back of the fishing village clinic. Holds 3 health packs. Respawns every in-game day.',
    tip: 'Free health recovery. Stack all three before long missions. No crime indicator.',
    coordinates: 'Keys Fishing Village, clinic alley',
  },
  {
    id: 'misc-03',
    name: 'Scuba Tank — Ocean Beach Dive Shop',
    category: 'misc',
    area: 'Vice City — Ocean Beach',
    description: 'Scuba tank in the back of the Ocean Beach Dive shop. Grabbable without purchase — the clerk faces away from the shelf.',
    tip: 'Required for the sunken armored truck pickup and some Ch4 waterside objectives. Grab one ahead of time and store it in Jason\'s backpack.',
    coordinates: 'Ocean Beach Dive, Shore Blvd',
  },
]

export const CATEGORIES: { key: POICategory; label: string; color: string; bg: string }[] = [
  { key: 'money',    label: 'Money',    color: 'text-[#ffdc9b]', bg: 'bg-[#ffd27a]/10 border-[#ffd27a]/25 hover:bg-[#ffd27a]/15' },
  { key: 'weapons',  label: 'Weapons',  color: 'text-[#8ce7ee]', bg: 'bg-[#72dce8]/10 border-[#72dce8]/25 hover:bg-[#72dce8]/15' },
  { key: 'drugs',    label: 'Drugs',    color: 'text-[#ff9bb5]', bg: 'bg-[#ff79a8]/10 border-[#ff79a8]/25 hover:bg-[#ff79a8]/15' },
  { key: 'ammo',     label: 'Ammo',     color: 'text-[#c3b4ff]', bg: 'bg-[#9b83ff]/10 border-[#9b83ff]/25 hover:bg-[#9b83ff]/15' },
  { key: 'vehicles', label: 'Vehicles', color: 'text-[#a8d8a8]', bg: 'bg-[#5fad5f]/10 border-[#5fad5f]/25 hover:bg-[#5fad5f]/15' },
  { key: 'misc',     label: 'Misc',     color: 'text-white/60',  bg: 'bg-white/[0.04] border-white/15 hover:bg-white/[0.07]' },
]

export const CATEGORY_ICON: Record<POICategory, string> = {
  money:    '💰',
  weapons:  '🔫',
  drugs:    '📦',
  ammo:     '🎯',
  vehicles: '🚗',
  misc:     '🗺️',
}
