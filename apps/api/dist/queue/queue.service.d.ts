import { CompanionService } from '../companion/companion.service';
import { PrismaService } from 'database';
import { TwitterService } from '../webhook/twitter.service';
export declare class QueueService {
    private readonly companionService;
    private readonly prisma;
    private readonly twitterService;
    private queue;
    constructor(companionService: CompanionService, prisma: PrismaService, twitterService: TwitterService);
    addEvent(event: any): Promise<void>;
    private processQueue;
}
