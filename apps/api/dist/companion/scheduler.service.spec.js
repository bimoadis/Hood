"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scheduler_service_1 = require("./scheduler.service");
describe('SchedulerService', () => {
    let service;
    let prisma;
    let twitterService;
    beforeEach(() => {
        prisma = {
            companion: {
                findMany: jest.fn(),
                update: jest.fn(),
            },
        };
        twitterService = {
            postTweet: jest.fn().mockResolvedValue({ id: 'tweet123' }),
        };
        service = new scheduler_service_1.SchedulerService(prisma, twitterService);
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
        prisma.companion.findMany.mockResolvedValue(mockCompanions);
        await service.notifyFamished();
        expect(prisma.companion.findMany).toHaveBeenCalled();
        expect(twitterService.postTweet).toHaveBeenCalledWith(expect.stringContaining('@testuser your Fox is famished.'));
        expect(twitterService.postTweet).toHaveBeenCalledWith(expect.stringContaining('5 hours before the Ledger records it.'));
        expect(prisma.companion.update).toHaveBeenCalledWith({
            where: { id: 'comp-1' },
            data: { famishedNotifiedAt: expect.any(Date) },
        });
    });
    it('should ignore companions that have already been notified within 24 hours', async () => {
        prisma.companion.findMany.mockResolvedValue([]);
        await service.notifyFamished();
        expect(twitterService.postTweet).not.toHaveBeenCalled();
        expect(prisma.companion.update).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=scheduler.service.spec.js.map