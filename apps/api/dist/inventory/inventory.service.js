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
exports.InventoryService = exports.ITEMS_CATALOG = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("database");
exports.ITEMS_CATALOG = {
    'Long Bow': { name: 'Long Bow', type: 'Weapon', statModifier: 3 },
    'Recurve Bow': { name: 'Recurve Bow', type: 'Weapon', statModifier: 4 },
    'Outlaw Cloak': { name: 'Outlaw Cloak', type: 'Cloak', statModifier: 2 },
    'Swift Boots': { name: 'Swift Boots', type: 'Boots', statModifier: 1 },
};
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtainItem(companionId, itemName) {
        const itemTemplate = exports.ITEMS_CATALOG[itemName];
        if (!itemTemplate) {
            throw new common_1.BadRequestException(`Item "${itemName}" is not defined in the catalog.`);
        }
        return this.prisma.inventory.create({
            data: {
                companionId,
                itemName: itemTemplate.name,
                itemType: itemTemplate.type,
                statModifier: itemTemplate.statModifier,
                equipped: false,
            },
        });
    }
    async equipItem(companionId, itemId) {
        const item = await this.prisma.inventory.findFirst({
            where: { id: itemId, companionId },
        });
        if (!item) {
            throw new common_1.BadRequestException('Item not found in companion inventory.');
        }
        await this.prisma.inventory.updateMany({
            where: { companionId, itemType: item.itemType, equipped: true },
            data: { equipped: false },
        });
        const updatedItem = await this.prisma.inventory.update({
            where: { id: itemId },
            data: { equipped: true },
        });
        const companion = await this.prisma.companion.findUnique({
            where: { id: companionId },
            include: { inventory: true },
        });
        if (companion) {
            let strength = 10;
            let intelligence = 10;
            let luck = 10;
            for (const invItem of companion.inventory) {
                if (invItem.equipped) {
                    if (invItem.itemType === 'Weapon')
                        strength += invItem.statModifier;
                    if (invItem.itemType === 'Cloak')
                        intelligence += invItem.statModifier;
                    if (invItem.itemType === 'Boots')
                        luck += invItem.statModifier;
                }
            }
            await this.prisma.companion.update({
                where: { id: companionId },
                data: { strength, intelligence, luck },
            });
        }
        return updatedItem;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map