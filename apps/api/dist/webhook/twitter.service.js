"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TwitterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterService = void 0;
const common_1 = require("@nestjs/common");
const twitter_api_v2_1 = require("twitter-api-v2");
let TwitterService = TwitterService_1 = class TwitterService {
    constructor() {
        this.logger = new common_1.Logger(TwitterService_1.name);
        this.client = null;
        const appKey = process.env.X_CONSUMER_KEY || '';
        const appSecret = process.env.X_CONSUMER_SECRET || '';
        const accessToken = process.env.X_ACCESS_TOKEN || '';
        const accessSecret = process.env.X_ACCESS_TOKEN_SECRET || '';
        if (!appKey || !appSecret || !accessToken || !accessSecret) {
            this.logger.warn('Twitter API credentials are not fully configured in environment variables. Twitter postings will be mocked.');
            return;
        }
        this.client = new twitter_api_v2_1.TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });
    }
    async replyToTweet(text, inReplyToTweetId) {
        if (!this.client) {
            this.logger.log(`[MOCK] Replying to tweet ${inReplyToTweetId}: "${text}"`);
            return { mock: true };
        }
        try {
            this.logger.log(`Posting reply to tweet ${inReplyToTweetId}: "${text}"`);
            const response = await this.client.v2.reply(text, inReplyToTweetId);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to post reply to Twitter:`, error);
            throw error;
        }
    }
    async postTweet(text) {
        if (!this.client) {
            this.logger.log(`[MOCK] Posting tweet: "${text}"`);
            return { mock: true };
        }
        try {
            this.logger.log(`Posting new tweet: "${text}"`);
            const response = await this.client.v2.tweet(text);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to post tweet:`, error);
            throw error;
        }
    }
};
exports.TwitterService = TwitterService;
exports.TwitterService = TwitterService = TwitterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TwitterService);
//# sourceMappingURL=twitter.service.js.map