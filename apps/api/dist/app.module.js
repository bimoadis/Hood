"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const webhook_module_1 = require("./webhook/webhook.module");
const database_1 = require("database");
const auth_config_1 = require("./auth/auth.config");
const lock_service_1 = require("./lock/lock.service");
const queue_service_1 = require("./queue/queue.service");
const companion_service_1 = require("./companion/companion.service");
const adventure_service_1 = require("./adventure/adventure.service");
const r2_service_1 = require("./r2/r2.service");
const inventory_service_1 = require("./inventory/inventory.service");
const quest_service_1 = require("./quest/quest.service");
const companion_controller_1 = require("./companion/companion.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [database_1.PrismaModule, webhook_module_1.WebhookModule],
        controllers: [companion_controller_1.CompanionController],
        providers: [
            auth_config_1.BetterAuthConfig,
            lock_service_1.LockService,
            queue_service_1.QueueService,
            companion_service_1.CompanionService,
            adventure_service_1.AdventureService,
            r2_service_1.R2Service,
            inventory_service_1.InventoryService,
            quest_service_1.QuestService,
        ],
        exports: [
            auth_config_1.BetterAuthConfig,
            lock_service_1.LockService,
            queue_service_1.QueueService,
            companion_service_1.CompanionService,
            adventure_service_1.AdventureService,
            r2_service_1.R2Service,
            inventory_service_1.InventoryService,
            quest_service_1.QuestService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map