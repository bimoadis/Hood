import { Companion } from '@prisma/client';

export interface VitalsUpdate {
  hunger: number;
  energy: number;
  health: number;
  mood: string;
  description: string;
  lastTickedAt: Date;
}

export function calculateDecay(companion: Companion, now: Date = new Date()): VitalsUpdate | null {
  const lastTicked = new Date(companion.lastTickedAt || companion.updatedAt);
  const elapsedMs = now.getTime() - lastTicked.getTime();
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  if (elapsedHours < 1) {
    return null; // Less than an hour has passed, no tick yet
  }

  const hoursToTick = Math.floor(elapsedHours);
  
  // 1. Hunger decay (+5 per hour, max 100)
  let newHunger = Math.min(100, companion.hunger + (hoursToTick * 5));

  // 2. Energy decay: -2 per hour (standard), -1 per hour (Lazy)
  const energyDecayRate = companion.personality === 'Lazy' ? 1 : 2;
  let newEnergy = Math.max(0, companion.energy - (hoursToTick * energyDecayRate));

  // 3. Health decay: If famished (hunger == 100), health falls 10 per hour
  let newHealth = companion.health;
  
  // Calculate health decay hour-by-hour to handle hunger transitioning to 100 mid-tick
  let currentHunger = companion.hunger;
  for (let h = 0; h < hoursToTick; h++) {
    currentHunger = Math.min(100, currentHunger + 5);
    if (currentHunger === 100) {
      newHealth = Math.max(0, newHealth - 10);
    }
  }

  // Determine mood status based on new vitals
  let rolledMood = companion.mood;
  let moodStatus = "";
  if (newHealth === 0) {
    rolledMood = 'Sick';
    moodStatus = " Currently sick and incapacitated, unable to train until healed.";
  } else if (newHunger > 80) {
    rolledMood = 'Starving';
    moodStatus = " Holding their stomach in extreme hunger, begging for food.";
  } else if (newEnergy < 20) {
    rolledMood = 'Tired';
    moodStatus = " Yawning sluggishly, looking like they could use a quick nap.";
  }

  // Update description baseline
  const baselineDesc = companion.description.split(" Currently")[0].split(" Holding")[0].split(" Yawning")[0] || "A loyal companion.";
  const dynamicDescription = moodStatus ? `${baselineDesc}${moodStatus}` : baselineDesc;

  // Set new lastTickedAt incremented by the exact hours ticked
  const nextTickedAt = new Date(lastTicked.getTime() + hoursToTick * 60 * 60 * 1000);

  return {
    hunger: newHunger,
    energy: newEnergy,
    health: newHealth,
    mood: rolledMood,
    description: dynamicDescription,
    lastTickedAt: nextTickedAt
  };
}
