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
exports.StatsController = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
let StatsController = class StatsController {
    constructor(prisma) {
        this.prisma = prisma;
        this.cachedStats = null;
        this.cacheExpiry = 0;
    }
    async getForestStats() {
        const now = Date.now();
        if (this.cachedStats && now < this.cacheExpiry) {
            return this.cachedStats;
        }
        try {
            const since = new Date(now - 24 * 3600_000);
            const [total, hatched, adventures, deaths, famished] = await Promise.all([
                this.prisma.companion.count(),
                this.prisma.companion.count({
                    where: { createdAt: { gte: since } },
                }),
                this.prisma.companionMemory.count({
                    where: {
                        memoryKey: 'last_adventure',
                        createdAt: { gte: since },
                    },
                }),
                this.prisma.companion.count({
                    where: {
                        health: 0,
                        updatedAt: { gte: since },
                    },
                }),
                this.prisma.companion.count({
                    where: {
                        hunger: { gte: 100 },
                        health: { gt: 0 },
                    },
                }),
            ]);
            const payload = {
                total,
                hatched,
                adventures,
                deaths,
                famished,
            };
            this.cachedStats = payload;
            this.cacheExpiry = now + 30_000;
            return payload;
        }
        catch (err) {
            console.error('[StatsController] Error fetching forest stats:', err);
            return {
                total: 0,
                hatched: 0,
                adventures: 0,
                deaths: 0,
                famished: 0,
            };
        }
    }
};
exports.StatsController = StatsController;
__decorate([
    (0, common_1.Get)('forest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatsController.prototype, "getForestStats", null);
exports.StatsController = StatsController = __decorate([
    (0, common_1.Controller)('stats'),
    __metadata("design:paramtypes", [database_1.PrismaService])
], StatsController);
//# sourceMappingURL=stats.controller.js.map