import { Injectable, Logger } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private client: TwitterApi | null = null;

  constructor() {
    const appKey = process.env.X_CONSUMER_KEY || '';
    const appSecret = process.env.X_CONSUMER_SECRET || '';
    const accessToken = process.env.X_ACCESS_TOKEN || '';
    const accessSecret = process.env.X_ACCESS_TOKEN_SECRET || '';

    if (!appKey || !appSecret || !accessToken || !accessSecret) {
      this.logger.warn('Twitter API credentials are not fully configured in environment variables. Twitter postings will be mocked.');
      return;
    }

    this.client = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });
  }

  async replyToTweet(text: string, inReplyToTweetId: string): Promise<any> {
    if (!this.client) {
      this.logger.log(`[MOCK] Replying to tweet ${inReplyToTweetId}: "${text}"`);
      return { mock: true };
    }

    try {
      this.logger.log(`Posting reply to tweet ${inReplyToTweetId}: "${text}"`);
      const response = await this.client.v2.reply(text, inReplyToTweetId);
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to post reply to Twitter:`, error);
      throw error;
    }
  }
}
