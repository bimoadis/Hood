import { Injectable } from '@nestjs/common';
import { PrismaService } from 'database';

export interface GuildQuest {
  id: string;
  name: string;
  target: number;
  current: number;
  description: string;
  rewardXp: number;
}

@Injectable()
export class QuestService {
  private quests: GuildQuest[] = [
    {
      id: 'quest_1',
      name: 'Sherwood Reconnaissance',
      target: 5,
      current: 2,
      description: 'Send companions on 5 successful adventure outings collectively.',
      rewardXp: 50,
    },
    {
      id: 'quest_2',
      name: 'Feast of the Greenwoods',
      target: 10,
      current: 4,
      description: 'Feed hungry companions a total of 10 times.',
      rewardXp: 30,
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async getGlobalLeaderboard() {
    return this.prisma.companion.findMany({
      orderBy: [
        { level: 'desc' },
        { xp: 'desc' },
      ],
      take: 20,
      include: {
        user: true,
      },
    });
  }

  async getDailyQuests(): Promise<GuildQuest[]> {
    return this.quests;
  }

  async incrementQuestProgress(questId: string, amount: number): Promise<GuildQuest | null> {
    const quest = this.quests.find(q => q.id === questId);
    if (quest) {
      quest.current = Math.min(quest.target, quest.current + amount);
      console.log(`[Guild Quests] Updated progress for "${quest.name}": ${quest.current}/${quest.target}`);
      return quest;
    }
    return null;
  }
}
