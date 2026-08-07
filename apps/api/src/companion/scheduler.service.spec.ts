import { SchedulerService } from './scheduler.service';
import { PrismaService } from 'database';
import { TwitterService } from '../webhook/twitter.service';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let prisma: PrismaService;
  let twitterService: TwitterService;

  beforeEach(() => {
    prisma = {
      companion: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    twitterService = {
      postTweet: jest.fn().mockResolvedValue({ id: 'tweet123' }),
    } as any;

    service = new SchedulerService(prisma, twitterService);
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  it('should notify and update companions that are famished and have not been notified in 24 hours', async () => {
    const mockCompanions = [
      {
        id: 'comp-1',
        name: 'Foxy',
        species: 'Fox',
        hunger: 100,
        health: 50,
        famishedNotifiedAt: null,
        user: { name: 'testuser' },
      },
    ];

    (prisma.companion.findMany as jest.Mock).mockResolvedValue(mockCompanions);

    await service.notifyFamished();

    // Verify finding companions query
    expect(prisma.companion.findMany).toHaveBeenCalled();

    // Verify posting tweet
    expect(twitterService.postTweet).toHaveBeenCalledWith(
      expect.stringContaining('@testuser your Fox is famished.')
    );
    expect(twitterService.postTweet).toHaveBeenCalledWith(
      expect.stringContaining('5 hours before the Ledger records it.')
    );

    // Verify updating famishedNotifiedAt field
    expect(prisma.companion.update).toHaveBeenCalledWith({
      where: { id: 'comp-1' },
      data: { famishedNotifiedAt: expect.any(Date) },
    });
  });

  it('should ignore companions that have already been notified within 24 hours', async () => {
    (prisma.companion.findMany as jest.Mock).mockResolvedValue([]);

    await service.notifyFamished();

    expect(twitterService.postTweet).not.toHaveBeenCalled();
    expect(prisma.companion.update).not.toHaveBeenCalled();
  });
});
