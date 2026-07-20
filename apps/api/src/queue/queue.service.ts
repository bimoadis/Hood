import { Injectable } from '@nestjs/common';
import { CompanionService } from '../companion/companion.service';

@Injectable()
export class QueueService {
  private queue: Array<{ id: string; event: any }> = [];

  constructor(private readonly companionService: CompanionService) {}

  async addEvent(event: any): Promise<void> {
    this.queue.push({
      id: Math.random().toString(36).substring(7),
      event,
    });
    await this.processQueue();
  }

  private async processQueue() {
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        const text = (item.event.text || '').toLowerCase();
        const user = item.event.user || {};
        const xUserId = user.id_str || 'mock_x_user_id';
        const xScreenName = user.screen_name || 'mock_user';

        // Auto-hatch a companion for the user on their first interaction if they don't have one
        await this.companionService.hatchCompanion(xUserId, xScreenName);

        let intent = 'CHAT';
        if (text.includes('feed') || text.includes('makan')) {
          intent = 'FEED';
        } else if (text.includes('summon') || text.includes('panggil') || text.includes('hatch')) {
          intent = 'SUMMON';
        }
        
        console.log(`[BullMQ Worker Pool] Classifying NLP input: "${text}" -> Intent: ${intent}`);
        
        if (intent === 'SUMMON') {
          // Parse name if present (e.g. summon "My Stag")
          const nameMatch = text.match(/["']([^"']+)["']/);
          const companionName = nameMatch ? nameMatch[1] : undefined;
          await this.companionService.hatchCompanion(xUserId, xScreenName, companionName);
        }
      }
    }
  }
}
