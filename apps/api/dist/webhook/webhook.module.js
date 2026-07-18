"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookModule = void 0;
const common_1 = require("@nestjs/common");
const webhook_service_1 = require("./webhook.service");
const webhook_controller_1 = require("./webhook.controller");
const lock_service_1 = require("../lock/lock.service");
const queue_service_1 = require("../queue/queue.service");
const companion_service_1 = require("../companion/companion.service");
const adventure_service_1 = require("../adventure/adventure.service");
const r2_service_1 = require("../r2/r2.service");
const inventory_service_1 = require("../inventory/inventory.service");
const quest_service_1 = require("../quest/quest.service");
let WebhookModule = class WebhookModule {
};
exports.WebhookModule = WebhookModule;
exports.WebhookModule = WebhookModule = __decorate([
    (0, common_1.Module)({
        providers: [
            webhook_service_1.WebhookService,
            lock_service_1.LockService,
            queue_service_1.QueueService,
            companion_service_1.CompanionService,
            adventure_service_1.AdventureService,
            r2_service_1.R2Service,
            inventory_service_1.InventoryService,
            quest_service_1.QuestService,
        ],
        controllers: [webhook_controller_1.WebhookController],
    })
], WebhookModule);
//# sourceMappingURL=webhook.module.js.map