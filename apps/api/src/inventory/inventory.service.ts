import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'database';

export interface CatalogItem {
  name: string;
  type: string;
  statModifier: number;
}

export const ITEMS_CATALOG: Record<string, CatalogItem> = {
  'Long Bow': { name: 'Long Bow', type: 'Weapon', statModifier: 3 },
  'Recurve Bow': { name: 'Recurve Bow', type: 'Weapon', statModifier: 4 },
  'Outlaw Cloak': { name: 'Outlaw Cloak', type: 'Cloak', statModifier: 2 },
  'Swift Boots': { name: 'Swift Boots', type: 'Boots', statModifier: 1 },
};

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async obtainItem(companionId: string, itemName: string) {
    const itemTemplate = ITEMS_CATALOG[itemName];
    if (!itemTemplate) {
      throw new BadRequestException(`Item "${itemName}" is not defined in the catalog.`);
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

  async equipItem(companionId: string, itemId: string) {
    const item = await this.prisma.inventory.findFirst({
      where: { id: itemId, companionId },
    });

    if (!item) {
      throw new BadRequestException('Item not found in companion inventory.');
    }

    // 1. Unequip any currently equipped items of the same type
    await this.prisma.inventory.updateMany({
      where: { companionId, itemType: item.itemType, equipped: true },
      data: { equipped: false },
    });

    // 2. Equip target item
    const updatedItem = await this.prisma.inventory.update({
      where: { id: itemId },
      data: { equipped: true },
    });

    // 3. Recalculate stats based on equipment
    const companion = await this.prisma.companion.findUnique({
      where: { id: companionId },
      include: { inventory: true },
    });

    if (companion) {
      // Base stats
      let strength = 10;
      let intelligence = 10;
      let luck = 10;

      // Apply equipped items modifiers
      for (const invItem of companion.inventory) {
        if (invItem.equipped) {
          if (invItem.itemType === 'Weapon') strength += invItem.statModifier;
          if (invItem.itemType === 'Cloak') intelligence += invItem.statModifier;
          if (invItem.itemType === 'Boots') luck += invItem.statModifier;
        }
      }

      await this.prisma.companion.update({
        where: { id: companionId },
        data: { strength, intelligence, luck },
      });
    }

    return updatedItem;
  }
}
