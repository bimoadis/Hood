import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'database';

@Controller('stats')
export class StatsController {
  private cachedStats: any = null;
  private cacheExpiry: number = 0;

  constructor(private readonly prisma: PrismaService) {}

  @Get('forest')
  async getForestStats() {
    const now = Date.now();
    
    // Serve from in-memory cache if valid (30-second TTL)
    if (this.cachedStats && now < this.cacheExpiry) {
      return this.cachedStats;
    }

    try {
      const since = new Date(now - 24 * 3600_000);

      const [total, hatched, adventures, deaths, famished] = await Promise.all([
        // Total active population
        this.prisma.companion.count(),
        // Hatched today
        this.prisma.companion.count({
          where: { createdAt: { gte: since } },
        }),
        // Adventures today
        this.prisma.companionMemory.count({
          where: {
            memoryKey: 'last_adventure',
            createdAt: { gte: since },
          },
        }),
        // Lost/Dead today (health is 0)
        this.prisma.companion.count({
          where: {
            health: 0,
            updatedAt: { gte: since },
          },
        }),
        // Famished right now (hunger is at maximum/100)
        this.prisma.companion.count({
          where: {
            hunger: { gte: 100 },
            health: { gt: 0 },
          },
        }),
      ]);

      const payload = {
        total,
        hatched,
        adventures,
        deaths,
        famished,
      };

      this.cachedStats = payload;
      this.cacheExpiry = now + 30_000; // Cache for 30 seconds

      return payload;
    } catch (err) {
      console.error('[StatsController] Error fetching forest stats:', err);
      // Fallback response instead of throwing 500
      return {
        total: 0,
        hatched: 0,
        adventures: 0,
        deaths: 0,
        famished: 0,
      };
    }
  }
}
