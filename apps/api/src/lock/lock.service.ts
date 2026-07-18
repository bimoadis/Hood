import { Injectable, ConflictException } from '@nestjs/common';

@Injectable()
export class LockService {
  private locks = new Set<string>();

  async acquireLock(companionId: string, ttl: number = 5000): Promise<boolean> {
    const lockKey = `lock:companion:${companionId}`;
    if (this.locks.has(lockKey)) {
      throw new ConflictException('Companion is currently processing another action.');
    }
    this.locks.add(lockKey);
    setTimeout(() => {
      this.locks.delete(lockKey);
    }, ttl);
    return true;
  }

  async releaseLock(companionId: string): Promise<void> {
    const lockKey = `lock:companion:${companionId}`;
    this.locks.delete(lockKey);
  }
}
