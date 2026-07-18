import { Controller, Get, Post, Query, Req, Headers, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { LockService } from '../lock/lock.service';
import { QueueService } from '../queue/queue.service';

@Controller('api/webhooks/x')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly lockService: LockService,
    private readonly queueService: QueueService
  ) {}

  @Get()
  handleCRC(@Query('crc_token') crcToken: string) {
    const clientSecret = process.env.X_CONSUMER_SECRET || 'test_secret';
    return this.webhookService.verifyCRC(crcToken, clientSecret);
  }

  @Post()
  async handleIncomingEvents(
    @Req() req: { body: { tweet_create_events?: unknown[] } },
    @Headers('x-twitter-signatures') signature: string
  ) {
    const clientSecret = process.env.X_CONSUMER_SECRET || 'test_secret';
    const rawBody = JSON.stringify(req.body);

    const isValid = this.webhookService.verifyXSignature(rawBody, signature, clientSecret);
    if (!isValid && process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Invalid payload signature');
    }

    const { tweet_create_events } = req.body;
    if (!tweet_create_events) {
      return { status: 'ignored' };
    }

    for (const event of tweet_create_events) {
      const companionId = (event as any).user?.id_str || 'test_companion';
      // Acquire Lock, Add event to BullMQ, and release Lock
      await this.lockService.acquireLock(companionId);
      await this.queueService.addEvent(event);
      await this.lockService.releaseLock(companionId);
    }

    return { status: 'processed', count: tweet_create_events.length };
  }
}
