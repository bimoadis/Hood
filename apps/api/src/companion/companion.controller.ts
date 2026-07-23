import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'database';
import { CompanionService } from './companion.service';

@Controller('api/companion')
export class CompanionController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companionService: CompanionService,
  ) {}

  @Get('latest')
  async getLatestCompanions() {
    const companions = await this.prisma.companion.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: {
        user: true,
      },
    });

    return companions.map((c, index) => {
      return {
        id: c.id,
        name: c.name,
        species: c.species,
        level: c.level,
        evolutionLvl: c.evolutionLvl,
        xp: c.xp,
        health: c.health,
        energy: c.energy,
        hunger: c.hunger,
        happiness: c.happiness,
        friendship: c.friendship,
        strength: c.strength,
        intelligence: c.intelligence,
        luck: c.luck,
        role: c.role,
        group: c.group,
        description: c.description,
        mood: c.mood,
        cardNumber: `#0${417 + index}`,
        userEmail: c.user?.email || 'unknown@x.com',
      };
    });
  }

  @Get('user/:email')
  async getCompanionByUser(@Param('email') email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        companions: {
          include: {
            memories: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
            inventory: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const companion = user.companions[0] || null;
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      companion,
    };
  }

  @Post('hatch')
  async hatch(@Body() body: { email: string; name?: string }) {
    const screenName = body.email.split('@')[0];
    const companion = await this.companionService.hatchCompanion(
      screenName + '_id',
      screenName,
      body.name
    );
    return companion;
  }
}
