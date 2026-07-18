import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { LockService } from '../lock/lock.service';
import { QueueService } from '../queue/queue.service';
import { CompanionService } from '../companion/companion.service';
import { AdventureService } from '../adventure/adventure.service';
import { R2Service } from '../r2/r2.service';
import { InventoryService } from '../inventory/inventory.service';
import { QuestService } from '../quest/quest.service';

@Module({
  providers: [
    WebhookService,
    LockService,
    QueueService,
    CompanionService,
    AdventureService,
    R2Service,
    InventoryService,
    QuestService,
  ],
  controllers: [WebhookController],
})
export class WebhookModule {}
