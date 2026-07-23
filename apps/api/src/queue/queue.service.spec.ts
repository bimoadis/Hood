import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { CompanionService } from '../companion/companion.service';
import { PrismaService } from 'database';

describe('QueueService', () => {
  let queueService: QueueService;
  let mockCompanionService: any;
  let mockPrismaService: any;

  beforeEach(async () => {
    mockCompanionService = {
      hatchCompanion: jest.fn(),
    };
    mockPrismaService = {
      companionMemory: {
        create: jest.fn(),
      },
      companion: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        { provide: CompanionService, useValue: mockCompanionService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    queueService = module.get<QueueService>(QueueService);
  });

  it('should process short reply (< 10 chars) correctly', async () => {
    const companionMock = {
      id: 'comp1',
      name: 'Robin Fox',
      species: 'Fox',
      personality: 'Brave',
      xp: 10,
      level: 1,
      health: 100,
      hunger: 0,
      happiness: 50,
      friendship: 0,
      energy: 100,
      strength: 10,
      intelligence: 10,
      luck: 10,
      mood: 'Happy',
    };
    mockCompanionService.hatchCompanion.mockResolvedValue(companionMock);
    mockPrismaService.companion.update.mockResolvedValue({
      ...companionMock,
      xp: 15,
      friendship: 1,
      energy: 90,
      hunger: 10,
    });

    await queueService.addEvent({
      text: 'hi',
      user: { id_str: 'user1', screen_name: 'testuser' },
    });

    expect(mockCompanionService.hatchCompanion).toHaveBeenCalledWith('user1', 'testuser');
    expect(mockPrismaService.companionMemory.create).toHaveBeenCalled();
    expect(mockPrismaService.companion.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'comp1' },
      data: expect.objectContaining({
        xp: 15,
        friendship: 1,
      }),
    }));
  });

  it('should process long reply (>= 10 chars) and level up correctly', async () => {
    const companionMock = {
      id: 'comp1',
      name: 'Robin Fox',
      species: 'Fox',
      personality: 'Brave',
      xp: 95,
      level: 1,
      health: 100,
      hunger: 0,
      happiness: 50,
      friendship: 0,
      energy: 100,
      strength: 10,
      intelligence: 10,
      luck: 10,
      mood: 'Happy',
    };
    mockCompanionService.hatchCompanion.mockResolvedValue(companionMock);
    mockPrismaService.companion.update.mockResolvedValue({
      ...companionMock,
      xp: 105,
      level: 2,
    });

    await queueService.addEvent({
      text: 'hello companion friend', // length 22 >= 10
      user: { id_str: 'user1', screen_name: 'testuser' },
    });

    expect(mockPrismaService.companion.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'comp1' },
      data: expect.objectContaining({
        xp: 105,
        level: 2,
        evolutionLvl: 2,
        strength: expect.any(Number),
      }),
    }));
  });
});
