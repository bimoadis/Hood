import { PrismaService } from 'database';
export interface CatalogItem {
    name: string;
    type: string;
    statModifier: number;
}
export declare const ITEMS_CATALOG: Record<string, CatalogItem>;
export declare class InventoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    obtainItem(companionId: string, itemName: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companionId: string;
        itemName: string;
        itemType: string;
        statModifier: number;
        equipped: boolean;
    }>;
    equipItem(companionId: string, itemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companionId: string;
        itemName: string;
        itemType: string;
        statModifier: number;
        equipped: boolean;
    }>;
}
