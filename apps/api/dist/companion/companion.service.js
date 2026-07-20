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
exports.CompanionService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
const shared_1 = require("shared");
let CompanionService = class CompanionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async hatchCompanion(xUserId, xScreenName, name) {
        let user = await this.prisma.user.findFirst({
            where: { email: `${xScreenName}@x.com` },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: `${xScreenName}@x.com`,
                    name: xScreenName,
                },
            });
        }
        const existing = await this.prisma.companion.findFirst({
            where: { userId: user.id },
        });
        if (existing) {
            console.log(`[CompanionService] Companion already exists for user ${xScreenName}: ${existing.name}`);
            return existing;
        }
        const characterNames = Object.keys(shared_1.CHARACTER_ROLES);
        const chosenCharacterName = characterNames[Math.floor(Math.random() * characterNames.length)];
        const characterInfo = shared_1.CHARACTER_ROLES[chosenCharacterName];
        const speciesMap = {
            'Robin Fox': 'Fox',
            'Hartley': 'Deer',
            'Little John': 'Bear',
            'Harelock': 'Hare',
            'Nutley': 'Squirrel',
            'Badgerick': 'Badger',
            'Olliver': 'Owl',
            'Willow': 'Fox',
            'Prickle': 'Hedgehog',
            'Rook': 'Rook',
            'Merry': 'Mouse',
            'Cawthorne': 'Crow'
        };
        const species = speciesMap[chosenCharacterName] || 'Fox';
        const personalities = ['Brave', 'Wise', 'Curious', 'Lazy'];
        const personality = personalities[Math.floor(Math.random() * personalities.length)];
        const companion = await this.prisma.companion.create({
            data: {
                userId: user.id,
                name: name || characterInfo.characterName,
                species,
                personality,
                level: 1,
                xp: 0,
                energy: 100,
                health: 100,
                hunger: 0,
                happiness: 50,
            },
        });
        console.log(`[CompanionService] Hatched new companion: ${companion.name} (${companion.species}, ${companion.personality}) for user ${xScreenName}`);
        return companion;
    }
};
exports.CompanionService = CompanionService;
exports.CompanionService = CompanionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], CompanionService);
//# sourceMappingURL=companion.service.js.map