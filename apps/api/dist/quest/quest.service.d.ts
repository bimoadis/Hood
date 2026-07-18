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
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
        };
    } & {
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
    })[]>;
    getDailyQuests(): Promise<GuildQuest[]>;
    incrementQuestProgress(questId: string, amount: number): Promise<GuildQuest | null>;
}
