import { Injectable } from '@nestjs/common';
import { PrismaService } from 'database';
import { CHARACTER_ROLES } from 'shared';

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

    // 3. Randomly choose one character role from CHARACTER_ROLES
    const characterNames = Object.keys(CHARACTER_ROLES);
    const chosenCharacterName = characterNames[Math.floor(Math.random() * characterNames.length)];
    const characterInfo = CHARACTER_ROLES[chosenCharacterName];

    // Map character/role to species
    const speciesMap: Record<string, string> = {
      'Robin Fox': 'Fox',
      'Hartley': 'Deer',
      'Little John': 'Bear',
      'Harelock': 'Hare',
      'Nutley': 'Squirrel',
      'Badgerick': 'Badger',
      'Olliver': 'Owl',
      'Willow': 'Fox',
      'Prickle': 'Hedgehog',
      'Rook': 'Rook',
      'Merry': 'Mouse',
      'Cawthorne': 'Crow'
    };

    const species = speciesMap[chosenCharacterName] || 'Fox';
    const personalities = ['Brave', 'Wise', 'Curious', 'Lazy'];
    const personality = personalities[Math.floor(Math.random() * personalities.length)];

    // 4. Create companion
    const companion = await this.prisma.companion.create({
      data: {
        userId: user.id,
        name: name || characterInfo.characterName,
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
