import { CompanionService } from '../companion/companion.service';
export declare class QueueService {
    private readonly companionService;
    private queue;
    constructor(companionService: CompanionService);
    addEvent(event: any): Promise<void>;
    private processQueue;
}
