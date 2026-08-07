import { StatsController } from './stats.controller';
import { PrismaService } from 'database';

describe('StatsController', () => {
  let controller: StatsController;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      companion: {
        count: jest.fn(),
      },
      companionMemory: {
        count: jest.fn(),
      },
    } as any;

    controller = new StatsController(prisma);
  });

  it('should calculate stats and return them with correct format', async () => {
    (prisma.companion.count as jest.Mock)
      .mockResolvedValueOnce(100)  // total
      .mockResolvedValueOnce(15)   // hatched
      .mockResolvedValueOnce(5)     // deaths
      .mockResolvedValueOnce(2);    // famished

    (prisma.companionMemory.count as jest.Mock).mockResolvedValueOnce(50); // adventures

    const stats = await controller.getForestStats();

    expect(stats).toEqual({
      total: 100,
      hatched: 15,
      adventures: 50,
      deaths: 5,
      famished: 2,
    });

    expect(prisma.companion.count).toHaveBeenCalledTimes(4);
    expect(prisma.companionMemory.count).toHaveBeenCalledTimes(1);
  });

  it('should serve subsequent calls from cache within 30 seconds', async () => {
    (prisma.companion.count as jest.Mock).mockResolvedValue(10);
    (prisma.companionMemory.count as jest.Mock).mockResolvedValue(5);

    // First call (populates cache)
    const stats1 = await controller.getForestStats();
    expect(stats1.total).toBe(10);

    // Reset mocks to verify they are NOT called again
    jest.clearAllMocks();

    // Second call (hits cache)
    const stats2 = await controller.getForestStats();
    expect(stats2.total).toBe(10);
    expect(prisma.companion.count).not.toHaveBeenCalled();
    expect(prisma.companionMemory.count).not.toHaveBeenCalled();
  });
});
