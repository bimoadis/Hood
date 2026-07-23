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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanionController = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
const companion_service_1 = require("./companion.service");
let CompanionController = class CompanionController {
    constructor(prisma, companionService) {
        this.prisma = prisma;
        this.companionService = companionService;
    }
    async getLatestCompanions() {
        const companions = await this.prisma.companion.findMany({
            orderBy: { createdAt: 'desc' },
            take: 4,
            include: {
                user: true,
            },
        });
        return companions.map((c, index) => {
            return {
                id: c.id,
                name: c.name,
                species: c.species,
                level: c.level,
                evolutionLvl: c.evolutionLvl,
                xp: c.xp,
                health: c.health,
                energy: c.energy,
                hunger: c.hunger,
                happiness: c.happiness,
                friendship: c.friendship,
                strength: c.strength,
                mood: c.mood,
                cardNumber: `#0${417 + index}`,
                userEmail: c.user?.email || 'unknown@x.com',
            };
        });
    }
    async getCompanionByUser(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                companions: {
                    include: {
                        memories: {
                            orderBy: { createdAt: 'desc' },
                            take: 5,
                        },
                        inventory: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const companion = user.companions[0] || null;
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            companion,
        };
    }
    async hatch(body) {
        const screenName = body.email.split('@')[0];
        const companion = await this.companionService.hatchCompanion(screenName + '_id', screenName, body.name);
        return companion;
    }
};
exports.CompanionController = CompanionController;
__decorate([
    (0, common_1.Get)('latest'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompanionController.prototype, "getLatestCompanions", null);
__decorate([
    (0, common_1.Get)('user/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompanionController.prototype, "getCompanionByUser", null);
__decorate([
    (0, common_1.Post)('hatch'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanionController.prototype, "hatch", null);
exports.CompanionController = CompanionController = __decorate([
    (0, common_1.Controller)('api/companion'),
    __metadata("design:paramtypes", [database_1.PrismaService,
        companion_service_1.CompanionService])
], CompanionController);
//# sourceMappingURL=companion.controller.js.map