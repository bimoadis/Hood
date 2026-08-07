import { PrismaService } from 'database';
export declare class StatsController {
    private readonly prisma;
    private cachedStats;
    private cacheExpiry;
    constructor(prisma: PrismaService);
    getForestStats(): Promise<any>;
}
