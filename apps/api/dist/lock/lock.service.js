"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockService = void 0;
const common_1 = require("@nestjs/common");
let LockService = class LockService {
    constructor() {
        this.locks = new Set();
    }
    async acquireLock(companionId, ttl = 5000) {
        const lockKey = `lock:companion:${companionId}`;
        if (this.locks.has(lockKey)) {
            throw new common_1.ConflictException('Companion is currently processing another action.');
        }
        this.locks.add(lockKey);
        setTimeout(() => {
            this.locks.delete(lockKey);
        }, ttl);
        return true;
    }
    async releaseLock(companionId) {
        const lockKey = `lock:companion:${companionId}`;
        this.locks.delete(lockKey);
    }
};
exports.LockService = LockService;
exports.LockService = LockService = __decorate([
    (0, common_1.Injectable)()
], LockService);
//# sourceMappingURL=lock.service.js.map