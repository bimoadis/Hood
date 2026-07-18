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
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const webhook_service_1 = require("./webhook.service");
const lock_service_1 = require("../lock/lock.service");
const queue_service_1 = require("../queue/queue.service");
let WebhookController = class WebhookController {
    constructor(webhookService, lockService, queueService) {
        this.webhookService = webhookService;
        this.lockService = lockService;
        this.queueService = queueService;
    }
    handleCRC(crcToken) {
        const clientSecret = process.env.X_CONSUMER_SECRET || 'test_secret';
        return this.webhookService.verifyCRC(crcToken, clientSecret);
    }
    async handleIncomingEvents(req, signature) {
        const clientSecret = process.env.X_CONSUMER_SECRET || 'test_secret';
        const rawBody = JSON.stringify(req.body);
        const isValid = this.webhookService.verifyXSignature(rawBody, signature, clientSecret);
        if (!isValid && process.env.NODE_ENV === 'production') {
            throw new common_1.UnauthorizedException('Invalid payload signature');
        }
        const { tweet_create_events } = req.body;
        if (!tweet_create_events) {
            return { status: 'ignored' };
        }
        for (const event of tweet_create_events) {
            const companionId = event.user?.id_str || 'test_companion';
            await this.lockService.acquireLock(companionId);
            await this.queueService.addEvent(event);
            await this.lockService.releaseLock(companionId);
        }
        return { status: 'processed', count: tweet_create_events.length };
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('crc_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebhookController.prototype, "handleCRC", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('x-twitter-signatures')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleIncomingEvents", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('api/webhooks/x'),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService,
        lock_service_1.LockService,
        queue_service_1.QueueService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map