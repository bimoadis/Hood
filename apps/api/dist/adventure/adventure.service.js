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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdventureService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
let AdventureService = class AdventureService {
    constructor(prisma) {
        this.prisma = prisma;
        this.matchmakingQueue = [];
    }
    async joinQueue(companionId) {
        const companion = await this.prisma.companion.findUnique({
            where: { id: companionId },
        });
        if (!companion) {
            throw new common_1.BadRequestException('Companion not found.');
        }
        if (companion.energy < 20) {
            throw new common_1.BadRequestException(`Companion ${companion.name} does not have enough energy (needs 20).`);
        }
        if (this.matchmakingQueue.includes(companionId)) {
            throw new common_1.BadRequestException('Companion is already in the queue.');
        }
        this.matchmakingQueue.push(companionId);
        console.log(`[Adventure Queue] Companion ${companion.name} joined the queue. Queue size: ${this.matchmakingQueue.length}`);
        if (this.matchmakingQueue.length >= 2) {
            const p1 = this.matchmakingQueue.shift();
            const p2 = this.matchmakingQueue.shift();
            await this.triggerExpedition([p1, p2]);
        }
        return { status: 'queued', queueLength: this.matchmakingQueue.length };
    }
    async triggerExpedition(companionIds) {
        console.log(`[Adventure Matchmaker] Found a match! Starting adventure for: ${companionIds.join(', ')}`);
        const companions = await this.prisma.companion.findMany({
            where: { id: { in: companionIds } },
        });
        for (const companion of companions) {
            await this.prisma.companion.update({
                where: { id: companion.id },
                data: {
                    energy: Math.max(0, companion.energy - 20),
                    xp: companion.xp + 15,
                    level: companion.xp + 15 >= companion.level * 100 ? companion.level + 1 : companion.level,
                },
            });
        }
        const results = companions.map(c => {
            let roll = Math.floor(Math.random() * 20) + 1;
            let statModifier = Math.floor((c.strength - 10) / 2);
            let personalityMod = 0;
            if (c.personality === 'Brave')
                personalityMod = 4;
            if (c.personality === 'Wise')
                personalityMod = 3;
            if (c.personality === 'Curious')
                personalityMod = 2;
            if (c.personality === 'Lazy')
                personalityMod = -3;
            const totalRoll = roll + statModifier + personalityMod;
            return { companion: c, totalRoll };
        });
        const success = results.some(r => r.totalRoll >= 12);
        let logText = '';
        if (success) {
            logText = `The expedition was a success! ${companions.map(c => c.name).join(' and ')} combined their skills to defeat a band of woodland bandits and discover treasure.`;
        }
        else {
            logText = `The expedition ended in failure. ${companions.map(c => c.name).join(' and ')} fell into a trap and lost their way in the misty Sherwood forest.`;
        }
        console.log(`[Adventure Outcome] Log: ${logText}`);
        for (const companion of companions) {
            await this.prisma.companionMemory.create({
                data: {
                    companionId: companion.id,
                    memoryKey: 'last_adventure',
                    memoryValue: logText,
                },
            });
        }
    }
};
exports.AdventureService = AdventureService;
exports.AdventureService = AdventureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], AdventureService);
//# sourceMappingURL=adventure.service.js.map