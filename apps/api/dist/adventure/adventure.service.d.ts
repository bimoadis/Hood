import { PrismaService } from 'database';
export declare class AdventureService {
    private readonly prisma;
    private matchmakingQueue;
    constructor(prisma: PrismaService);
    joinQueue(companionId: string): Promise<{
        status: string;
        queueLength: number;
    }>;
    private triggerExpedition;
}
