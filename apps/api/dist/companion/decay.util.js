"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDecay = calculateDecay;
function calculateDecay(companion, now = new Date()) {
    const lastTicked = new Date(companion.lastTickedAt || companion.updatedAt);
    const elapsedMs = now.getTime() - lastTicked.getTime();
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    if (elapsedHours < 1) {
        return null;
    }
    const hoursToTick = Math.floor(elapsedHours);
    let newHunger = Math.min(100, companion.hunger + (hoursToTick * 5));
    const energyDecayRate = companion.personality === 'Lazy' ? 1 : 2;
    let newEnergy = Math.max(0, companion.energy - (hoursToTick * energyDecayRate));
    let newHealth = companion.health;
    let currentHunger = companion.hunger;
    for (let h = 0; h < hoursToTick; h++) {
        currentHunger = Math.min(100, currentHunger + 5);
        if (currentHunger === 100) {
            newHealth = Math.max(0, newHealth - 10);
        }
    }
    let rolledMood = companion.mood;
    let moodStatus = "";
    if (newHealth === 0) {
        rolledMood = 'Sick';
        moodStatus = " Currently sick and incapacitated, unable to train until healed.";
    }
    else if (newHunger > 80) {
        rolledMood = 'Starving';
        moodStatus = " Holding their stomach in extreme hunger, begging for food.";
    }
    else if (newEnergy < 20) {
        rolledMood = 'Tired';
        moodStatus = " Yawning sluggishly, looking like they could use a quick nap.";
    }
    const baselineDesc = companion.description.split(" Currently")[0].split(" Holding")[0].split(" Yawning")[0] || "A loyal companion.";
    const dynamicDescription = moodStatus ? `${baselineDesc}${moodStatus}` : baselineDesc;
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
//# sourceMappingURL=decay.util.js.map