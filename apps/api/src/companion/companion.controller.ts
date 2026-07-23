import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'database';
import { CompanionService } from './companion.service';

@Controller('api/companion')
export class CompanionController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companionService: CompanionService,
  ) {}

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
