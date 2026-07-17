import { Controller, Get, Post, Query, Req, Headers, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('api/webhooks/x')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Get()
  handleCRC(@Query('crc_token') crcToken: string) {
    const clientSecret = process.env.X_CONSUMER_SECRET || 'test_secret';
    return this.webhookService.verifyCRC(crcToken, clientSecret);
  }

  @Post()
  async handleIncomingEvents(
    @Req() req: any,
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

    return { status: 'processed', count: tweet_create_events.length };
  }
}
