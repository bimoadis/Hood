import { PrismaService } from 'database';
export declare class CompanionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    hatchCompanion(xUserId: string, xScreenName: string, name?: string): Promise<{
        level: number;
        id: string;
        userId: string;
        name: string;
        species: string;
        personality: string;
        evolutionLvl: number;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
}
