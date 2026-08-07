import { PrismaService } from 'database';
export declare class CompanionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    hatchCompanion(xUserId: string, xScreenName: string, name?: string): Promise<{
        name: string;
        level: number;
        xp: number;
        friendship: number;
        evolutionLvl: number;
        strength: number;
        intelligence: number;
        luck: number;
        description: string;
        id: string;
        userId: string;
        species: string;
        personality: string;
        role: string;
        group: string;
        mood: string;
        energy: number;
        health: number;
        hunger: number;
        happiness: number;
        lastFedAt: Date;
        lastTickedAt: Date;
        famishedNotifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
