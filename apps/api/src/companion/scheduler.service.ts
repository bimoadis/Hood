import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from 'database';
import { calculateDecay } from './decay.util';

@Injectable()
export class SchedulerService implements OnModuleInit, OnModuleDestroy {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    console.log('[SchedulerService] Initializing automated background decay checks...');
    // Check every 10 seconds for decay ticks
    this.intervalId = setInterval(() => this.tickAllCompanions(), 10000);
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
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
}
