"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stats_controller_1 = require("./stats.controller");
describe('StatsController', () => {
    let controller;
    let prisma;
    beforeEach(() => {
        prisma = {
            companion: {
                count: jest.fn(),
            },
            companionMemory: {
                count: jest.fn(),
            },
        };
        controller = new stats_controller_1.StatsController(prisma);
    });
    it('should calculate stats and return them with correct format', async () => {
        prisma.companion.count
            .mockResolvedValueOnce(100)
            .mockResolvedValueOnce(15)
            .mockResolvedValueOnce(5)
            .mockResolvedValueOnce(2);
        prisma.companionMemory.count.mockResolvedValueOnce(50);
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
        prisma.companion.count.mockResolvedValue(10);
        prisma.companionMemory.count.mockResolvedValue(5);
        const stats1 = await controller.getForestStats();
        expect(stats1.total).toBe(10);
        jest.clearAllMocks();
        const stats2 = await controller.getForestStats();
        expect(stats2.total).toBe(10);
        expect(prisma.companion.count).not.toHaveBeenCalled();
        expect(prisma.companionMemory.count).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=stats.controller.spec.js.map