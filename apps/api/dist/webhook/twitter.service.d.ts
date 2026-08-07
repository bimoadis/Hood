export declare class TwitterService {
    private readonly logger;
    private client;
    constructor();
    replyToTweet(text: string, inReplyToTweetId: string): Promise<any>;
    postTweet(text: string): Promise<any>;
}
