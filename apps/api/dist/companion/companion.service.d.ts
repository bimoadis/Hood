import { PrismaService } from 'database';
export declare class CompanionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    hatchCompanion(xUserId: string, xScreenName: string, name?: string): Promise<{
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
