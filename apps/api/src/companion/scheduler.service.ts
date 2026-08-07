import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from 'database';
import { calculateDecay } from './decay.util';
import { TwitterService } from '../webhook/twitter.service';

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
  private intervalId: NodeJS.Timeout | null = null;
  private famineIntervalId: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly twitterService: TwitterService
  ) {}

  onModuleInit() {
    console.log('[SchedulerService] Initializing automated background decay checks...');
    // Check every 10 seconds for decay ticks
    this.intervalId = setInterval(() => this.tickAllCompanions(), 10000);

    // Check every hour for famished companion alerts (3600000 ms)
    this.famineIntervalId = setInterval(() => this.notifyFamished(), 3600000);

    // Initial check in 5 seconds
    setTimeout(() => this.notifyFamished(), 5000);
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.famineIntervalId) {
      clearInterval(this.famineIntervalId);
    }
  }

  async tickAllCompanions() {
    try {
      const companions = await this.prisma.companion.findMany();
      const now = new Date();

      for (const companion of companions) {
        const update = calculateDecay(companion, now);
        if (update) {
          await this.prisma.companion.update({
            where: { id: companion.id },
            data: update,
          });
          console.log(`[SchedulerService] Auto-decay updated companion ${companion.name}: hunger=${update.hunger}, energy=${update.energy}, health=${update.health}`);
        }
      }
    } catch (error) {
      console.error('[SchedulerService] Error ticking companions:', error);
    }
  }

  async notifyFamished() {
    try {
      const cutoff = new Date(Date.now() - 24 * 3600_000);

      const atRisk = await this.prisma.companion.findMany({
        where: {
          hunger: { gte: 100 },
          health: { gt: 0 },
          OR: [
            { famishedNotifiedAt: null },
            { famishedNotifiedAt: { lt: cutoff } }
          ]
        },
        include: { user: true },
        take: 50
      });

      if (atRisk.length === 0) {
        return;
      }

      console.log(`[SchedulerService] Found ${atRisk.length} famished companion(s) to notify.`);

      for (const c of atRisk) {
        const hoursLeft = Math.ceil(c.health / 10);
        const handle = c.user.name || 'adventurer';
        const species = c.species || 'companion';
        const tweetText = `@${handle} your ${species} is famished.\n\nHealth is dropping 10 an hour. ${hoursLeft} hours before the Ledger records it.\n\nFeed it.`;

        try {
          await this.twitterService.postTweet(tweetText);
          await this.prisma.companion.update({
            where: { id: c.id },
            data: { famishedNotifiedAt: new Date() }
          });
          console.log(`[SchedulerService] Dispatched famine warning tweet for companion ${c.name} (@${handle})`);
        } catch (tweetErr) {
          console.error(`[SchedulerService] Failed to send famine alert for ${c.name}:`, tweetErr);
        }
      }
    } catch (error) {
      console.error('[SchedulerService] Error in notifyFamished task:', error);
    }
  }
}
