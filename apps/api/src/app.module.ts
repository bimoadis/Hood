import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { PrismaModule } from 'database';
import { BetterAuthConfig } from './auth/auth.config';
import { LockService } from './lock/lock.service';
import { QueueService } from './queue/queue.service';
import { CompanionService } from './companion/companion.service';
import { SchedulerService } from './companion/scheduler.service';
import { AdventureService } from './adventure/adventure.service';
import { R2Service } from './r2/r2.service';
import { InventoryService } from './inventory/inventory.service';
import { QuestService } from './quest/quest.service';
import { CompanionController } from './companion/companion.controller';
import { CardRendererService } from 'renderer';
import { StatsController } from './stats/stats.controller';

@Module({
  imports: [PrismaModule, WebhookModule],
  controllers: [CompanionController, StatsController],
  providers: [
    BetterAuthConfig,
    LockService,
    QueueService,
    CompanionService,
    SchedulerService,
    AdventureService,
    R2Service,
    InventoryService,
    QuestService,
    CardRendererService,
  ],
  exports: [
    BetterAuthConfig,
    LockService,
    QueueService,
    CompanionService,
    SchedulerService,
    AdventureService,
    R2Service,
    InventoryService,
    QuestService,
    CardRendererService,
  ],
})
export class AppModule {}
