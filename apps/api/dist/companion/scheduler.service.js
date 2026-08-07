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
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
const decay_util_1 = require("./decay.util");
const twitter_service_1 = require("../webhook/twitter.service");
let SchedulerService = class SchedulerService {
    constructor(prisma, twitterService) {
        this.prisma = prisma;
        this.twitterService = twitterService;
        this.intervalId = null;
        this.famineIntervalId = null;
    }
    onModuleInit() {
        console.log('[SchedulerService] Initializing automated background decay checks...');
        this.intervalId = setInterval(() => this.tickAllCompanions(), 10000);
        this.famineIntervalId = setInterval(() => this.notifyFamished(), 3600000);
        setTimeout(() => this.notifyFamished(), 5000);
    }
    onModuleDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        if (this.famineIntervalId) {
            clearInterval(this.famineIntervalId);
        }
    }
    async tickAllCompanions() {
        try {
            const companions = await this.prisma.companion.findMany();
            const now = new Date();
            for (const companion of companions) {
                const update = (0, decay_util_1.calculateDecay)(companion, now);
                if (update) {
                    await this.prisma.companion.update({
                        where: { id: companion.id },
                        data: update,
                    });
                    console.log(`[SchedulerService] Auto-decay updated companion ${companion.name}: hunger=${update.hunger}, energy=${update.energy}, health=${update.health}`);
                }
            }
        }
        catch (error) {
            console.error('[SchedulerService] Error ticking companions:', error);
        }
    }
    async notifyFamished() {
        try {
            const cutoff = new Date(Date.now() - 24 * 3600_000);
            const atRisk = await this.prisma.companion.findMany({
                where: {
                    hunger: { gte: 100 },
                    health: { gt: 0 },
                    OR: [
                        { famishedNotifiedAt: null },
                        { famishedNotifiedAt: { lt: cutoff } }
                    ]
                },
                include: { user: true },
                take: 50
            });
            if (atRisk.length === 0) {
                return;
            }
            console.log(`[SchedulerService] Found ${atRisk.length} famished companion(s) to notify.`);
            for (const c of atRisk) {
                const hoursLeft = Math.ceil(c.health / 10);
                const handle = c.user.name || 'adventurer';
                const species = c.species || 'companion';
                const tweetText = `@${handle} your ${species} is famished.\n\nHealth is dropping 10 an hour. ${hoursLeft} hours before the Ledger records it.\n\nFeed it.`;
                try {
                    await this.twitterService.postTweet(tweetText);
                    await this.prisma.companion.update({
                        where: { id: c.id },
                        data: { famishedNotifiedAt: new Date() }
                    });
                    console.log(`[SchedulerService] Dispatched famine warning tweet for companion ${c.name} (@${handle})`);
                }
                catch (tweetErr) {
                    console.error(`[SchedulerService] Failed to send famine alert for ${c.name}:`, tweetErr);
                }
            }
        }
        catch (error) {
            console.error('[SchedulerService] Error in notifyFamished task:', error);
        }
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        twitter_service_1.TwitterService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map