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
let SchedulerService = class SchedulerService {
    constructor(prisma) {
        this.prisma = prisma;
        this.intervalId = null;
    }
    onModuleInit() {
        console.log('[SchedulerService] Initializing automated background decay checks...');
        this.intervalId = setInterval(() => this.tickAllCompanions(), 10000);
    }
    onModuleDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
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
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map