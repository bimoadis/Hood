import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from 'database';
export declare class SchedulerService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private intervalId;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    tickAllCompanions(): Promise<void>;
}
