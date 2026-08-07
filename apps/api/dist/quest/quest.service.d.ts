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
    })[]>;
    getDailyQuests(): Promise<GuildQuest[]>;
    incrementQuestProgress(questId: string, amount: number): Promise<GuildQuest | null>;
}
