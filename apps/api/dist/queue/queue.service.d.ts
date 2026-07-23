import { CompanionService } from '../companion/companion.service';
import { PrismaService } from 'database';
export declare class QueueService {
    private readonly companionService;
    private readonly prisma;
    private queue;
    constructor(companionService: CompanionService, prisma: PrismaService);
    addEvent(event: any): Promise<void>;
    private processQueue;
}
