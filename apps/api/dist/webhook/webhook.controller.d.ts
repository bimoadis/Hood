import { WebhookService } from './webhook.service';
import { LockService } from '../lock/lock.service';
import { QueueService } from '../queue/queue.service';
export declare class WebhookController {
    private readonly webhookService;
    private readonly lockService;
    private readonly queueService;
    constructor(webhookService: WebhookService, lockService: LockService, queueService: QueueService);
    handleCRC(crcToken: string): {
        response_token: string;
    };
    handleIncomingEvents(req: any, signature: string): Promise<{
        status: string;
        count?: undefined;
    } | {
        status: string;
        count: any;
    }>;
}
