import { Injectable } from '@nestjs/common';
import { CompanionService } from '../companion/companion.service';
import { PrismaService } from 'database';

@Injectable()
export class QueueService {
  private queue: Array<{ id: string; event: any }> = [];

  constructor(
    private readonly companionService: CompanionService,
    private readonly prisma: PrismaService,
  ) {}

  async addEvent(event: any): Promise<void> {
    this.queue.push({
      id: Math.random().toString(36).substring(7),
      event,
    });
    await this.processQueue();
  }

  private async processQueue() {
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        const text = (item.event.text || '').toLowerCase();
        const user = item.event.user || {};
        const xUserId = user.id_str || 'mock_x_user_id';
        const xScreenName = user.screen_name || 'mock_user';

        // Auto-hatch/retrieve a companion for the user on their first interaction
        const companion = await this.companionService.hatchCompanion(xUserId, xScreenName);

        // Save incoming reply/tweet interaction into CompanionMemory
        if (item.event.text) {
          await this.prisma.companionMemory.create({
            data: {
              companionId: companion.id,
              memoryKey: 'reply_history',
              memoryValue: item.event.text,
            },
          });
          console.log(`[QueueService] Saved reply history to CompanionMemory: "${item.event.text}"`);
        }

        // Calculate EXP, Friendship, and Happiness changes based on reply length (if not sick)
        let xpGained = 0;
        let friendshipGained = 0;
        let happinessGained = 0;

        const isSick = companion.health === 0;

        if (text.length < 10) {
          xpGained = isSick ? 0 : 5;
          friendshipGained = 1;
        } else {
          xpGained = isSick ? 0 : 10;
          friendshipGained = 2;
          happinessGained = 1;
        }

        // Feed System check
        let hungerChange = 0;
        let healthChange = 0;
        let happinessChange = 0;
        const isFeedCommand = text.includes('feed') || text.includes('makan');
        if (isFeedCommand) {
          hungerChange = -25;
          healthChange = 2;
          happinessChange = 5;
        }

        // Natural hunger decay per interaction
        const naturalHungerIncrease = 10;

        // Apply new vitals changes, clamped between 0 and 100
        let newHunger = Math.min(100, Math.max(0, companion.hunger + hungerChange + naturalHungerIncrease));
        let newHappiness = Math.min(100, Math.max(0, companion.happiness + happinessGained + happinessChange));
        let newFriendship = Math.min(100, Math.max(0, companion.friendship + friendshipGained));
        let newHealth = Math.min(100, Math.max(0, companion.health + healthChange));

        // Hunger side effect: Hunger > 80 => Health -5, Happiness -5
        if (newHunger > 80) {
          newHealth = Math.max(0, newHealth - 5);
          newHappiness = Math.max(0, newHappiness - 5);
        }

        // Apply EXP
        let newXp = companion.xp + xpGained;

        // Determine Level Up: Lv1 (0-99), Lv2 (100-299), Lv3 (>= 300)
        let newLevel = companion.level;
        if (newXp >= 300) {
          newLevel = 3;
        } else if (newXp >= 100) {
          newLevel = 2;
        } else {
          newLevel = 1;
        }

        let strengthIncrement = 0;
        let healthIncrement = 0;
        let energyIncrement = 0;

        if (newLevel > companion.level) {
          const levelsGained = newLevel - companion.level;
          for (let i = 0; i < levelsGained; i++) {
            strengthIncrement += Math.floor(Math.random() * 10) + 1; // Random 1-10
            healthIncrement += 5;
            energyIncrement += 5;
          }
          console.log(`[QueueService] Level Up! ${companion.name} reached Level ${newLevel}. Strength +${strengthIncrement}, Health +${healthIncrement}, Energy +${energyIncrement}`);
        }

        newHealth = Math.min(100, newHealth + healthIncrement);
        let newEnergy = Math.min(100, Math.max(0, companion.energy - 10 + energyIncrement)); // Deduct 10 energy per interaction

        // Update companion record
        const updatedCompanion = await this.prisma.companion.update({
          where: { id: companion.id },
          data: {
            xp: newXp,
            level: newLevel,
            evolutionLvl: newLevel,
            strength: companion.strength + strengthIncrement,
            health: newHealth,
            hunger: newHunger,
            happiness: newHappiness,
            friendship: newFriendship,
            energy: newEnergy,
          },
        });

        // AI Response Generation based on stats
        let aiResponse = '';
        if (updatedCompanion.health === 0) {
          aiResponse = `*Cough* I feel so sick... I cannot gain any EXP until I'm healed...`;
        } else if (updatedCompanion.hunger > 80) {
          aiResponse = `I'm starving! Can you please feed me some food? *stomach growls*`;
        } else if (updatedCompanion.energy < 20) {
          aiResponse = `*yawn* So sleepy... I need some rest... zzz...`;
        } else if (updatedCompanion.happiness > 80) {
          aiResponse = `Yay! I'm having so much fun with you! Let's do more!`;
        } else if (updatedCompanion.friendship > 50) {
          aiResponse = `You are the best owner ever, ${xScreenName}! I'm so glad we are together.`;
        } else {
          aiResponse = `Hello ${xScreenName}! I'm ready for our next adventure!`;
        }

        // Save AI Response to CompanionMemory
        await this.prisma.companionMemory.create({
          data: {
            companionId: updatedCompanion.id,
            memoryKey: 'bot_response',
            memoryValue: aiResponse,
          },
        });

        console.log(`[QueueService] AI Response: "${aiResponse}" saved to CompanionMemory.`);
      }
    }
  }
}
