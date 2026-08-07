import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from 'database';
import { TwitterService } from '../webhook/twitter.service';
export declare class SchedulerService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly twitterService;
    private intervalId;
    private famineIntervalId;
    constructor(prisma: PrismaService, twitterService: TwitterService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    tickAllCompanions(): Promise<void>;
    notifyFamished(): Promise<void>;
}
