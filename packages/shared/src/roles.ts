export interface CharacterRoleInfo {
  characterName: string;
  role: string;
  group: string;
  description: string;
}

export const CHARACTER_ROLES: Record<string, CharacterRoleInfo> = {
  'Robin Fox': {
    characterName: 'Robin Fox',
    role: 'Ranger',
    group: 'Forest Rangers',
    description: 'Group leader. Expert in archery, strategizing, and leading ambush or rescue missions. Intelligent and quick to make decisions.'
  },
  'Hartley': {
    characterName: 'Hartley',
    role: 'Hunter',
    group: 'Forest Rangers',
    description: 'Master hunter and tracker. Proficient with long-range bows and skilled at identifying enemy and animal tracks in the forest.'
  },
  'Little John': {
    characterName: 'Little John',
    role: 'Guardian',
    group: 'Forest Rangers',
    description: 'Team protector with high physical strength. Stands on the front line to shield allies during combat.'
  },
  'Harelock': {
    characterName: 'Harelock',
    role: 'Scout',
    group: 'Recon Corps',
    description: 'The fastest scout. Responsible for exploring areas, opening maps, sending messages, and providing early warnings.'
  },
  'Nutley': {
    characterName: 'Nutley',
    role: 'Rogue',
    group: 'Shadow Guild',
    description: 'Expert in infiltration and resource gathering. Skilled at lockpicking, retrieving vital items, and moving silently.'
  },
  'Badgerick': {
    characterName: 'Badgerick',
    role: 'Quartermaster',
    group: 'Logistics & Engineering Corps',
    description: 'Manages supplies, builds camps, repairs equipment, and ensures the team\'s needs are always met.'
  },
  'Olliver': {
    characterName: 'Olliver',
    role: 'Sage',
    group: 'Wisdom & Command Council',
    description: 'Advisor and guardian of knowledge. Analyzes situations, reads nature\'s signs, and provides the best strategies.'
  },
  'Willow': {
    characterName: 'Willow',
    role: 'Elite Archer',
    group: 'Forest Rangers',
    description: 'Elite marksman capable of attacking from a distance with high accuracy. Suited for eliminating high-value targets.'
  },
  'Prickle': {
    characterName: 'Prickle',
    role: 'Inventor',
    group: 'Logistics & Engineering Corps',
    description: 'Expert in creating traps, simple gadgets, and designing defensive or offensive tactics.'
  },
  'Rook': {
    characterName: 'Rook',
    role: 'Smuggler',
    group: 'Shadow Guild',
    description: 'A spy who gathers information stealthily. Experienced in infiltration and smuggling.'
  },
  'Merry': {
    characterName: 'Merry',
    role: 'Strategist',
    group: 'Wisdom & Command Council',
    description: 'Expert in team formation and coordinating members during battle. Despite being small, their intellect is highly valuable.'
  },
  'Cawthorne': {
    characterName: 'Cawthorne',
    role: 'Courier',
    group: 'Recon Corps',
    description: 'Aerial messenger and intelligence gatherer. Watches the area from above and reports enemy movements.'
  }
};
