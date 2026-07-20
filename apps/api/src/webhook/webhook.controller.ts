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

    let events: any[] = [];
    if (req.body.tweet_create_events && Array.isArray(req.body.tweet_create_events)) {
      events = req.body.tweet_create_events;
    } else if (req.body.data && req.body.data.payload) {
      const data = req.body.data;
      const payload = data.payload;
      const author = data.includes?.users?.find((u: any) => u.id === payload.author_id) || {};
      
      events.push({
        id_str: payload.id,
        text: payload.text,
        user: {
          id_str: payload.author_id,
          screen_name: author.username || 'mock_user',
          name: author.name || 'mock_user_name',
        }
      });
    }

    if (events.length === 0) {
      console.log('No supported events found in body. Ignoring.');
      return { status: 'ignored' };
    }

    console.log(`Processing ${events.length} incoming events.`);

    for (const event of events) {
      const companionId = event.user?.id_str || 'test_companion';
      console.log(`Adding event to queue for companion: ${companionId}`);
      // Acquire Lock, Add event to BullMQ, and release Lock
      await this.lockService.acquireLock(companionId);
      await this.queueService.addEvent(event);
      await this.lockService.releaseLock(companionId);
    }

    return { status: 'processed', count: events.length };
  }
}
