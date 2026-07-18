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
    @Req() req: any,
    @Headers('x-twitter-webhooks-signature') signature: string
  ) {
    console.log('Incoming Webhook POST Request Received');
    console.log('Headers:', JSON.stringify(req.headers));
    console.log('Signature:', signature);
    console.log('Body:', JSON.stringify(req.body));

    const clientSecret = process.env.X_CONSUMER_SECRET || 'test_secret';
    const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);

    const isValid = this.webhookService.verifyXSignature(rawBody, signature, clientSecret);
    console.log('Signature verification result:', isValid);

    if (!isValid && process.env.NODE_ENV === 'production') {
      console.warn('Signature verification failed in production! Rejecting request.');
      throw new UnauthorizedException('Invalid payload signature');
    }

    const { tweet_create_events } = req.body;
    if (!tweet_create_events) {
      console.log('No tweet_create_events found in body. Ignoring.');
      return { status: 'ignored' };
    }

    console.log(`Processing ${tweet_create_events.length} incoming events.`);

    for (const event of tweet_create_events) {
      const companionId = (event as any).user?.id_str || 'test_companion';
      console.log(`Adding event to queue for companion: ${companionId}`);
      // Acquire Lock, Add event to BullMQ, and release Lock
      await this.lockService.acquireLock(companionId);
      await this.queueService.addEvent(event);
      await this.lockService.releaseLock(companionId);
    }

    return { status: 'processed', count: tweet_create_events.length };
  }
}
