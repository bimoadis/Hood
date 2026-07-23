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
        memories: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return companions.map((c, index) => {
      const latestMemory = c.memories[0];
      let cardType = "Status card";
      let title = "Status Normal";
      let description = `Companion ${c.name} is active in Sherwood.`;

      if (latestMemory) {
        if (latestMemory.memoryKey === 'last_adventure') {
          cardType = "Adventure card";
          title = "Adventure log";
          description = latestMemory.memoryValue;
        } else if (latestMemory.memoryKey === 'reply_history') {
          cardType = "Interaction card";
          title = "Command post";
          description = latestMemory.memoryValue;
        } else if (latestMemory.memoryKey === 'bot_response') {
          cardType = "Status card";
          title = "AI Response";
          description = latestMemory.memoryValue;
        }
      } else {
        cardType = "Hatching card";
        title = "New Outlaw Alert";
        description = `${c.name} the ${c.species} has joined the outlaws in Sherwood forest.`;
      }

      return {
        id: c.id,
        cardType,
        cardNumber: `#0${417 + index}`,
        companionName: c.name,
        species: c.species,
        evolutionLvl: c.evolutionLvl,
        title,
        description,
        bottomLeft: `Level ${c.level}`,
        bottomRight: c.mood,
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
