export declare class LockService {
    private locks;
    acquireLock(companionId: string, ttl?: number): Promise<boolean>;
    releaseLock(companionId: string): Promise<void>;
}
