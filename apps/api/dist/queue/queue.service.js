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
const shared_1 = require("shared");
const twitter_service_1 = require("../webhook/twitter.service");
const decay_util_1 = require("../companion/decay.util");
let QueueService = class QueueService {
    constructor(companionService, prisma, twitterService) {
        this.companionService = companionService;
        this.prisma = prisma;
        this.twitterService = twitterService;
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
                let companion = await this.companionService.hatchCompanion(xUserId, xScreenName);
                const decayUpdate = (0, decay_util_1.calculateDecay)(companion, new Date());
                if (decayUpdate) {
                    companion = await this.prisma.companion.update({
                        where: { id: companion.id },
                        data: decayUpdate,
                    });
                }
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
                let feedCooldownActive = false;
                let lastFedAtUpdate = companion.lastFedAt;
                const isFeedCommand = text.includes('feed') || text.includes('makan');
                if (isFeedCommand) {
                    const now = new Date();
                    const lastFed = new Date(companion.lastFedAt || companion.createdAt);
                    const diffMinutes = (now.getTime() - lastFed.getTime()) / (1000 * 60);
                    if (diffMinutes < 60) {
                        feedCooldownActive = true;
                    }
                    else {
                        lastFedAtUpdate = now;
                        const isHeavy = /ramen|feast|meal|pizza|burger|gyoza/i.test(text);
                        const isLight = /snack|cookie|strawberry|apple|candy|bread/i.test(text);
                        if (isHeavy) {
                            hungerChange = -companion.hunger;
                            healthChange = 10;
                            happinessChange = 15;
                        }
                        else if (isLight) {
                            hungerChange = -25;
                            healthChange = 2;
                            happinessChange = 5;
                        }
                        else {
                            hungerChange = -50;
                            healthChange = 5;
                            happinessChange = 10;
                        }
                    }
                }
                let newHunger = feedCooldownActive ? companion.hunger : Math.min(100, Math.max(0, companion.hunger + hungerChange));
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
                let intelligenceIncrement = 0;
                let luckIncrement = 0;
                let healthIncrement = 0;
                let energyIncrement = 0;
                if (newLevel > companion.level) {
                    const levelsGained = newLevel - companion.level;
                    for (let i = 0; i < levelsGained; i++) {
                        strengthIncrement += Math.floor(Math.random() * 10) + 1;
                        intelligenceIncrement += Math.floor(Math.random() * 10) + 1;
                        luckIncrement += Math.floor(Math.random() * 10) + 1;
                        healthIncrement += 5;
                        energyIncrement += 5;
                    }
                    console.log(`[QueueService] Level Up! ${companion.name} reached Level ${newLevel}. Strength +${strengthIncrement}, Intelligence +${intelligenceIncrement}, Luck +${luckIncrement}`);
                }
                newHealth = Math.min(100, newHealth + healthIncrement);
                let newEnergy = Math.min(100, Math.max(0, companion.energy - 5 + energyIncrement));
                const moods = ['Happy', 'Excited', 'Calm', 'Tired', 'Starving', 'Energetic', 'Sick', 'Playful', 'Serious'];
                const rolledMood = moods[Math.floor(Math.random() * moods.length)];
                const characterRoleKey = Object.keys(shared_1.CHARACTER_ROLES).find(key => shared_1.CHARACTER_ROLES[key].characterName === companion.name) ||
                    Object.keys(shared_1.CHARACTER_ROLES).find(key => shared_1.CHARACTER_ROLES[key].role === companion.role) ||
                    Object.keys(shared_1.CHARACTER_ROLES).find(key => {
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
                        return speciesMap[key]?.toLowerCase() === companion.species?.toLowerCase();
                    });
                const baselineDesc = characterRoleKey ? shared_1.CHARACTER_ROLES[characterRoleKey].description : "A loyal companion.";
                let moodStatus = "";
                switch (rolledMood) {
                    case 'Happy':
                        moodStatus = " Currently feeling very happy and content with their achievements.";
                        break;
                    case 'Excited':
                        moodStatus = " Bursting with excitement, looking around eagerly for the next quest!";
                        break;
                    case 'Calm':
                        moodStatus = " Sitting quietly under the shade of a large oak tree, resting peacefully.";
                        break;
                    case 'Tired':
                        moodStatus = " Yawning sluggishly, looking like they could use a quick nap.";
                        break;
                    case 'Starving':
                        moodStatus = " Rubbing their stomach hungrily, wishing for a delicious forest gyoza.";
                        break;
                    case 'Energetic':
                        moodStatus = " Bouncing on their feet, fully energized and ready for action!";
                        break;
                    case 'Sick':
                        moodStatus = " Shivering slightly and sneezing, in need of some medicine and rest.";
                        break;
                    case 'Playful':
                        moodStatus = " Doing flips and playfully trying to grab your attention!";
                        break;
                    case 'Serious':
                        moodStatus = " Focused and highly alert, eyes darting around to scan the surroundings.";
                        break;
                }
                if (newHealth === 0) {
                    moodStatus = " Currently sick and incapacitated, unable to train until healed.";
                }
                else if (newHunger > 80) {
                    moodStatus = " Holding their stomach in extreme hunger, begging for food.";
                }
                const dynamicDescription = `${baselineDesc}${moodStatus}`;
                const updatedCompanion = await this.prisma.companion.update({
                    where: { id: companion.id },
                    data: {
                        xp: newXp,
                        level: newLevel,
                        evolutionLvl: newLevel,
                        strength: companion.strength + strengthIncrement,
                        intelligence: companion.intelligence + intelligenceIncrement,
                        luck: companion.luck + luckIncrement,
                        health: newHealth,
                        hunger: newHunger,
                        happiness: newHappiness,
                        friendship: newFriendship,
                        energy: newEnergy,
                        mood: rolledMood,
                        description: dynamicDescription,
                        lastFedAt: lastFedAtUpdate,
                        lastTickedAt: new Date(),
                    },
                });
                let aiResponse = '';
                if (feedCooldownActive) {
                    aiResponse = `*burp* I'm still full! Please wait a bit before feeding me again.`;
                }
                else if (updatedCompanion.health === 0) {
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
                aiResponse += `\n\n🏹 Your companion awaits. Hatch, train, and level up at hoodfolk.tech`;
                await this.prisma.companionMemory.create({
                    data: {
                        companionId: updatedCompanion.id,
                        memoryKey: 'bot_response',
                        memoryValue: aiResponse,
                    },
                });
                console.log(`[QueueService] AI Response: "${aiResponse}" saved to CompanionMemory.`);
                const replyTweetId = item.event.id_str;
                if (replyTweetId && replyTweetId !== 'test_companion') {
                    try {
                        const replyText = `🏹 Your companion awaits. Hatch, train, and level up at hoodfolk.tech`;
                        await this.twitterService.replyToTweet(replyText, replyTweetId);
                    }
                    catch (err) {
                        console.error(`[QueueService] Error posting tweet reply back to Twitter:`, err);
                    }
                }
            }
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [companion_service_1.CompanionService,
        database_1.PrismaService,
        twitter_service_1.TwitterService])
], QueueService);
//# sourceMappingURL=queue.service.js.map