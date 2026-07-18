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
exports.QuestService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
let QuestService = class QuestService {
    constructor(prisma) {
        this.prisma = prisma;
        this.quests = [
            {
                id: 'quest_1',
                name: 'Sherwood Reconnaissance',
                target: 5,
                current: 2,
                description: 'Send companions on 5 successful adventure outings collectively.',
                rewardXp: 50,
            },
            {
                id: 'quest_2',
                name: 'Feast of the Greenwoods',
                target: 10,
                current: 4,
                description: 'Feed hungry companions a total of 10 times.',
                rewardXp: 30,
            },
        ];
    }
    async getGlobalLeaderboard() {
        return this.prisma.companion.findMany({
            orderBy: [
                { level: 'desc' },
                { xp: 'desc' },
            ],
            take: 20,
            include: {
                user: true,
            },
        });
    }
    async getDailyQuests() {
        return this.quests;
    }
    async incrementQuestProgress(questId, amount) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest) {
            quest.current = Math.min(quest.target, quest.current + amount);
            console.log(`[Guild Quests] Updated progress for "${quest.name}": ${quest.current}/${quest.target}`);
            return quest;
        }
        return null;
    }
};
exports.QuestService = QuestService;
exports.QuestService = QuestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], QuestService);
//# sourceMappingURL=quest.service.js.map