import { Module } from '@nestjs/common';
import { WebhookModule } from './webhook/webhook.module';
import { PrismaModule } from 'database';
import { BetterAuthConfig } from './auth/auth.config';
import { LockService } from './lock/lock.service';
import { QueueService } from './queue/queue.service';
import { CompanionService } from './companion/companion.service';
import { AdventureService } from './adventure/adventure.service';
import { R2Service } from './r2/r2.service';
import { InventoryService } from './inventory/inventory.service';
import { QuestService } from './quest/quest.service';

@Module({
  imports: [PrismaModule, WebhookModule],
  providers: [
    BetterAuthConfig,
    LockService,
    QueueService,
    CompanionService,
    AdventureService,
    R2Service,
    InventoryService,
    QuestService,
  ],
  exports: [
    BetterAuthConfig,
    LockService,
    QueueService,
    CompanionService,
    AdventureService,
    R2Service,
    InventoryService,
    QuestService,
  ],
})
export class AppModule {}
