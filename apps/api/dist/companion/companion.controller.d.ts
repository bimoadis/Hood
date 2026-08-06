import { PrismaService } from 'database';
import { CompanionService } from './companion.service';
export declare class CompanionController {
    private readonly prisma;
    private readonly companionService;
    constructor(prisma: PrismaService, companionService: CompanionService);
    getLatestCompanions(): Promise<{
        id: string;
        name: string;
        species: string;
        level: number;
        evolutionLvl: number;
        xp: number;
        health: number;
        energy: number;
        hunger: number;
        happiness: number;
        friendship: number;
        strength: number;
        intelligence: number;
        luck: number;
        role: string;
        group: string;
        description: string;
        mood: string;
        cardNumber: string;
        userEmail: string;
    }[]>;
    getTopCompanions(): Promise<{
        id: string;
        name: string;
        species: string;
        level: number;
        xp: number;
        role: string;
        group: string;
        userEmail: string;
        trend: string;
    }[]>;
    getCompanionByUser(email: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
        };
        companion: {
            memories: {
                id: string;
                createdAt: Date;
                memoryKey: string;
                memoryValue: string;
                embedding: import("@prisma/client/runtime/client").JsonValue | null;
                companionId: string;
            }[];
            inventory: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                companionId: string;
                itemName: string;
                itemType: string;
                statModifier: number;
                equipped: boolean;
            }[];
        } & {
            name: string;
            id: string;
            userId: string;
            species: string;
            personality: string;
            role: string;
            group: string;
            description: string;
            evolutionLvl: number;
            level: number;
            xp: number;
            mood: string;
            energy: number;
            health: number;
            hunger: number;
            happiness: number;
            strength: number;
            intelligence: number;
            luck: number;
            friendship: number;
            lastFedAt: Date;
            lastTickedAt: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    hatch(body: {
        email: string;
        name?: string;
    }): Promise<{
        name: string;
        id: string;
        userId: string;
        species: string;
        personality: string;
        role: string;
        group: string;
        description: string;
        evolutionLvl: number;
        level: number;
        xp: number;
        mood: string;
        energy: number;
        health: number;
        hunger: number;
        happiness: number;
        strength: number;
        intelligence: number;
        luck: number;
        friendship: number;
        lastFedAt: Date;
        lastTickedAt: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
