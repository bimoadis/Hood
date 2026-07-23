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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const companion_service_1 = require("../companion/companion.service");
const database_1 = require("database");
let QueueService = class QueueService {
    constructor(companionService, prisma) {
        this.companionService = companionService;
        this.prisma = prisma;
        this.queue = [];
    }
    async addEvent(event) {
        this.queue.push({
            id: Math.random().toString(36).substring(7),
            event,
        });
        await this.processQueue();
    }
    async processQueue() {
        while (this.queue.length > 0) {
            const item = this.queue.shift();
            if (item) {
                const text = (item.event.text || '').toLowerCase();
                const user = item.event.user || {};
                const xUserId = user.id_str || 'mock_x_user_id';
                const xScreenName = user.screen_name || 'mock_user';
                const companion = await this.companionService.hatchCompanion(xUserId, xScreenName);
                if (item.event.text) {
                    await this.prisma.companionMemory.create({
                        data: {
                            companionId: companion.id,
                            memoryKey: 'reply_history',
                            memoryValue: item.event.text,
                        },
                    });
                    console.log(`[QueueService] Saved reply history to CompanionMemory: "${item.event.text}"`);
                }
                let xpGained = 0;
                let friendshipGained = 0;
                let happinessGained = 0;
                const isSick = companion.health === 0;
                if (text.length < 10) {
                    xpGained = isSick ? 0 : 5;
                    friendshipGained = 1;
                }
                else {
                    xpGained = isSick ? 0 : 10;
                    friendshipGained = 2;
                    happinessGained = 1;
                }
                let hungerChange = 0;
                let healthChange = 0;
                let happinessChange = 0;
                const isFeedCommand = text.includes('feed') || text.includes('makan');
                if (isFeedCommand) {
                    hungerChange = -25;
                    healthChange = 2;
                    happinessChange = 5;
                }
                const naturalHungerIncrease = 10;
                let newHunger = Math.min(100, Math.max(0, companion.hunger + hungerChange + naturalHungerIncrease));
                let newHappiness = Math.min(100, Math.max(0, companion.happiness + happinessGained + happinessChange));
                let newFriendship = Math.min(100, Math.max(0, companion.friendship + friendshipGained));
                let newHealth = Math.min(100, Math.max(0, companion.health + healthChange));
                if (newHunger > 80) {
                    newHealth = Math.max(0, newHealth - 5);
                    newHappiness = Math.max(0, newHappiness - 5);
                }
                let newXp = companion.xp + xpGained;
                let newLevel = companion.level;
                if (newXp >= 300) {
                    newLevel = 3;
                }
                else if (newXp >= 100) {
                    newLevel = 2;
                }
                else {
                    newLevel = 1;
                }
                let strengthIncrement = 0;
                let healthIncrement = 0;
                let energyIncrement = 0;
                if (newLevel > companion.level) {
                    const levelsGained = newLevel - companion.level;
                    for (let i = 0; i < levelsGained; i++) {
                        strengthIncrement += Math.floor(Math.random() * 10) + 1;
                        healthIncrement += 5;
                        energyIncrement += 5;
                    }
                    console.log(`[QueueService] Level Up! ${companion.name} reached Level ${newLevel}. Strength +${strengthIncrement}, Health +${healthIncrement}, Energy +${energyIncrement}`);
                }
                newHealth = Math.min(100, newHealth + healthIncrement);
                let newEnergy = Math.min(100, Math.max(0, companion.energy - 10 + energyIncrement));
                const updatedCompanion = await this.prisma.companion.update({
                    where: { id: companion.id },
                    data: {
                        xp: newXp,
                        level: newLevel,
                        evolutionLvl: newLevel,
                        strength: companion.strength + strengthIncrement,
                        health: newHealth,
                        hunger: newHunger,
                        happiness: newHappiness,
                        friendship: newFriendship,
                        energy: newEnergy,
                    },
                });
                let aiResponse = '';
                if (updatedCompanion.health === 0) {
                    aiResponse = `*Cough* I feel so sick... I cannot gain any EXP until I'm healed...`;
                }
                else if (updatedCompanion.hunger > 80) {
                    aiResponse = `I'm starving! Can you please feed me some food? *stomach growls*`;
                }
                else if (updatedCompanion.energy < 20) {
                    aiResponse = `*yawn* So sleepy... I need some rest... zzz...`;
                }
                else if (updatedCompanion.happiness > 80) {
                    aiResponse = `Yay! I'm having so much fun with you! Let's do more!`;
                }
                else if (updatedCompanion.friendship > 50) {
                    aiResponse = `You are the best owner ever, ${xScreenName}! I'm so glad we are together.`;
                }
                else {
                    aiResponse = `Hello ${xScreenName}! I'm ready for our next adventure!`;
                }
                await this.prisma.companionMemory.create({
                    data: {
                        companionId: updatedCompanion.id,
                        memoryKey: 'bot_response',
                        memoryValue: aiResponse,
                    },
                });
                console.log(`[QueueService] AI Response: "${aiResponse}" saved to CompanionMemory.`);
            }
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [companion_service_1.CompanionService,
        database_1.PrismaService])
], QueueService);
//# sourceMappingURL=queue.service.js.map