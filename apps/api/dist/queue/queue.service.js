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
let QueueService = class QueueService {
    constructor(companionService) {
        this.companionService = companionService;
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
                let intent = 'CHAT';
                if (text.includes('feed') || text.includes('makan')) {
                    intent = 'FEED';
                }
                else if (text.includes('summon') || text.includes('panggil') || text.includes('hatch')) {
                    intent = 'SUMMON';
                }
                console.log(`[BullMQ Worker Pool] Classifying NLP input: "${text}" -> Intent: ${intent}`);
                if (intent === 'SUMMON') {
                    const nameMatch = text.match(/["']([^"']+)["']/);
                    const companionName = nameMatch ? nameMatch[1] : undefined;
                    await this.companionService.hatchCompanion(xUserId, xScreenName, companionName);
                }
            }
        }
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [companion_service_1.CompanionService])
], QueueService);
//# sourceMappingURL=queue.service.js.map