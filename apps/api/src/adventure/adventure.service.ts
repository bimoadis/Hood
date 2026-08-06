import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'database';

@Injectable()
export class AdventureService {
  private matchmakingQueue: string[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async joinQueue(companionId: string) {
    const companion = await this.prisma.companion.findUnique({
      where: { id: companionId },
    });

    if (!companion) {
      throw new BadRequestException('Companion not found.');
    }

    if (companion.energy < 20) {
      throw new BadRequestException(`Companion ${companion.name} does not have enough energy (needs 20).`);
    }

    if (this.matchmakingQueue.includes(companionId)) {
      throw new BadRequestException('Companion is already in the queue.');
    }

    this.matchmakingQueue.push(companionId);
    console.log(`[Adventure Queue] Companion ${companion.name} joined the queue. Queue size: ${this.matchmakingQueue.length}`);

    // If we have at least 2 companions, start matchmaking!
    if (this.matchmakingQueue.length >= 2) {
      const p1 = this.matchmakingQueue.shift()!;
      const p2 = this.matchmakingQueue.shift()!;
      await this.triggerExpedition([p1, p2]);
    }

    return { status: 'queued', queueLength: this.matchmakingQueue.length };
  }

  private async triggerExpedition(companionIds: string[]) {
    console.log(`[Adventure Matchmaker] Found a match! Starting adventure for: ${companionIds.join(', ')}`);
    
    const companions = await this.prisma.companion.findMany({
      where: { id: { in: companionIds } },
    });

    // 1. Check & deduct energy
    for (const companion of companions) {
      await this.prisma.companion.update({
        where: { id: companion.id },
        data: {
          energy: Math.max(0, companion.energy - 20),
          xp: companion.xp + 15,
          level: companion.xp + 15 >= companion.level * 100 ? companion.level + 1 : companion.level,
        },
      });
    }

    // 2. Determine encounter type
    const encounterTypes = ['Combat', 'Stealth', 'Riddles'];
    const chosenEncounter = encounterTypes[Math.floor(Math.random() * encounterTypes.length)];

    // 3. Roll narrative logic based on stats & personalities
    const results = companions.map(c => {
      let roll = Math.floor(Math.random() * 20) + 1; // Base D20
      let statModifier = 0;
      let personalityMod = 0;
      let targetDifficulty = 12;

      if (chosenEncounter === 'Combat') {
        statModifier = Math.floor((c.strength - 10) / 2);
        if (c.personality === 'Brave') personalityMod = 4;
        if (c.personality === 'Wise') personalityMod = -2;
        if (c.personality === 'Curious') {
          personalityMod = 0;
          targetDifficulty += 2; // curious increases danger difficulty
        }
        if (c.personality === 'Lazy') personalityMod = -3;
      } else if (chosenEncounter === 'Stealth') {
        statModifier = Math.floor((c.luck - 10) / 2);
        if (c.personality === 'Brave') personalityMod = -2;
        if (c.personality === 'Curious') personalityMod = 3;
        if (c.personality === 'Lazy') personalityMod = -3;
      } else { // Riddles
        statModifier = Math.floor((c.intelligence - 10) / 2);
        if (c.personality === 'Wise') personalityMod = 4;
        if (c.personality === 'Curious') personalityMod = 2;
        if (c.personality === 'Lazy') personalityMod = -3;
      }

      const totalRoll = roll + statModifier + personalityMod;
      return { companion: c, totalRoll, targetDifficulty };
    });

    // Determine outcome narrative
    const success = results.some(r => r.totalRoll >= r.targetDifficulty);
    let logText = '';
    
    if (success) {
      if (chosenEncounter === 'Combat') {
        logText = `The expedition was a combat success! ${companions.map(c => c.name).join(' and ')} combined their strength to defeat a band of woodland bandits.`;
      } else if (chosenEncounter === 'Stealth') {
        logText = `The expedition was a stealth success! ${companions.map(c => c.name).join(' and ')} successfully sneaked past the sheriff's guards to retrieve the map.`;
      } else {
        logText = `The expedition was a wisdom success! ${companions.map(c => c.name).join(' and ')} solved Olliver's riddles to unlock the secret path.`;
      }
    } else {
      if (chosenEncounter === 'Combat') {
        logText = `The combat expedition ended in failure. ${companions.map(c => c.name).join(' and ')} were overwhelmed by the bandits.`;
      } else if (chosenEncounter === 'Stealth') {
        logText = `The stealth expedition failed. ${companions.map(c => c.name).join(' and ')} stepped on crunchy twigs and were spotted by guards.`;
      } else {
        logText = `The expedition failed. ${companions.map(c => c.name).join(' and ')} failed to answer the riddle and got lost.`;
      }
    }

    console.log(`[Adventure Outcome] Log: ${logText}`);
    
    // Save adventure narrative to memory
    for (const companion of companions) {
      await this.prisma.companionMemory.create({
        data: {
          companionId: companion.id,
          memoryKey: 'last_adventure',
          memoryValue: logText,
        },
      });
    }
  }
}
