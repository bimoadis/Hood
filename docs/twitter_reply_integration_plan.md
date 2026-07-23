# Twitter/X Reply Posting Integration Plan

This document outlines the architecture, requirements, and steps to integrate automated posting of replies back to Twitter/X.

## 1. Requirements & Prerequisites
To post tweets programmatically, the bot needs credentials from the Twitter Developer Portal:
- **Developer Account**: Access to Twitter API v2 (minimum Free tier for posting tweets, though Basic or Pro tier is recommended for higher limits).
- **App Permissions**: Set to **Read and Write** (essential to post replies).
- **Environment Variables** (added to `.env`):
  ```env
  X_CONSUMER_KEY=your_consumer_key
  X_CONSUMER_SECRET=your_consumer_secret
  X_ACCESS_TOKEN=your_access_token
  X_ACCESS_TOKEN_SECRET=your_access_token_secret
  ```

---

## 2. Library Selection
We will use the official/community-standard SDK:
- **Package**: `twitter-api-v2`
- **Installation**:
  ```bash
  npm install twitter-api-v2 -w apps/api
  ```

---

## 3. Architecture & Implementation Steps

### A. Twitter Integration Service
Create a dedicated `TwitterService` in the backend API to handle all interactions with the X API.

```typescript
// apps/api/src/twitter/twitter.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);
  private client: TwitterApi;

  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.X_CONSUMER_KEY || '',
      appSecret: process.env.X_CONSUMER_SECRET || '',
      accessToken: process.env.X_ACCESS_TOKEN || '',
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET || '',
    });
  }

  /**
   * Post a reply to a specific tweet ID
   */
  async replyToTweet(text: string, inReplyToTweetId: string): Promise<any> {
    try {
      this.logger.log(`Sending reply to tweet ${inReplyToTweetId}: "${text}"`);
      const response = await this.client.v2.tweet(text, {
        reply: {
          in_reply_to_tweet_id: inReplyToTweetId,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to post reply to Twitter:`, error);
      throw error;
    }
  }
}
```

### B. Integration into Event Loop (`QueueService`)
In `apps/api/src/queue/queue.service.ts`, integrate the `TwitterService` to dispatch the reply once the AI response is calculated.

```typescript
// Inside QueueService.processQueue()
// After generating the AI response:

// 1. Save AI Response to CompanionMemory
await this.prisma.companionMemory.create({
  data: {
    companionId: updatedCompanion.id,
    memoryKey: 'bot_response',
    memoryValue: aiResponse,
  },
});

// 2. Dispatch the actual tweet reply back to X/Twitter
const incomingTweetId = item.event.id_str;
if (incomingTweetId && incomingTweetId !== 'test_companion') {
  try {
    await this.twitterService.replyToTweet(aiResponse, incomingTweetId);
  } catch (err) {
    console.error(`[QueueService] Error posting tweet reply back to Twitter:`, err);
    // Queue retry or fallback handling
  }
}
```

---

## 4. Operational Considerations
- **Rate Limits**: The Twitter API v2 Free tier has a limit of 17 tweets per 24 hours (user context), while Basic tier allows 100 per 24 hours. Rate limit handling and back-offs should be managed in the queue worker to prevent getting suspended or hitting limits.
- **Failures & Retries**: Since the webhook events are queued, we can build a retry mechanism in the BullMQ worker for failed Twitter API calls (e.g., due to transient network issues).
