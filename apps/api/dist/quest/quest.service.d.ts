import { PrismaService } from 'database';
export interface GuildQuest {
    id: string;
    name: string;
    target: number;
    current: number;
    description: string;
    rewardXp: number;
}
export declare class QuestService {
    private readonly prisma;
    private quests;
    constructor(prisma: PrismaService);
    getGlobalLeaderboard(): Promise<({
        user: {
            name: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
        };
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
    })[]>;
    getDailyQuests(): Promise<GuildQuest[]>;
    incrementQuestProgress(questId: string, amount: number): Promise<GuildQuest | null>;
}
