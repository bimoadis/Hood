import { Injectable } from '@nestjs/common';
import { PrismaService } from 'database';

@Injectable()
export class CompanionService {
  constructor(private readonly prisma: PrismaService) {}

  async hatchCompanion(xUserId: string, xScreenName: string, name?: string) {
    // 1. Ensure user exists in database
    let user = await this.prisma.user.findFirst({
      where: { email: `${xScreenName}@x.com` },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: `${xScreenName}@x.com`,
          name: xScreenName,
        },
      });
    }

    // 2. Check if user already has a companion
    const existing = await this.prisma.companion.findFirst({
      where: { userId: user.id },
    });
    if (existing) {
      console.log(`[CompanionService] Companion already exists for user ${xScreenName}: ${existing.name}`);
      return existing;
    }

    // 3. Random species and personality
    const speciesList = ['Fox', 'Owl', 'Deer', 'Wolf', 'Badger'];
    const personalities = ['Brave', 'Wise', 'Curious', 'Lazy'];
    const species = speciesList[Math.floor(Math.random() * speciesList.length)];
    const personality = personalities[Math.floor(Math.random() * personalities.length)];

    // 4. Create companion
    const companion = await this.prisma.companion.create({
      data: {
        userId: user.id,
        name: name || `${species} Outlaw`,
        species,
        personality,
        level: 1,
        xp: 0,
        energy: 100,
        health: 100,
        hunger: 0,
        happiness: 50,
      },
    });
    
    console.log(`[CompanionService] Hatched new companion: ${companion.name} (${companion.species}, ${companion.personality}) for user ${xScreenName}`);
    return companion;
  }
}
