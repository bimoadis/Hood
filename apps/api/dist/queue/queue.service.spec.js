"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const queue_service_1 = require("./queue.service");
const companion_service_1 = require("../companion/companion.service");
const database_1 = require("database");
const twitter_service_1 = require("../webhook/twitter.service");
describe('QueueService', () => {
    let queueService;
    let mockCompanionService;
    let mockPrismaService;
    let mockTwitterService;
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
        mockTwitterService = {
            replyToTweet: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                queue_service_1.QueueService,
                { provide: companion_service_1.CompanionService, useValue: mockCompanionService },
                { provide: database_1.PrismaService, useValue: mockPrismaService },
                { provide: twitter_service_1.TwitterService, useValue: mockTwitterService },
            ],
        }).compile();
        queueService = module.get(queue_service_1.QueueService);
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
            lastFedAt: new Date(),
            lastTickedAt: new Date(),
            updatedAt: new Date(),
            createdAt: new Date(),
        };
        mockCompanionService.hatchCompanion.mockResolvedValue(companionMock);
        mockPrismaService.companion.update.mockResolvedValue({
            ...companionMock,
            xp: 15,
            friendship: 1,
            energy: 95,
            hunger: 0,
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
            lastFedAt: new Date(),
            lastTickedAt: new Date(),
            updatedAt: new Date(),
            createdAt: new Date(),
        };
        mockCompanionService.hatchCompanion.mockResolvedValue(companionMock);
        mockPrismaService.companion.update.mockResolvedValue({
            ...companionMock,
            xp: 105,
            level: 2,
        });
        await queueService.addEvent({
            text: 'hello companion friend',
            user: { id_str: 'user1', screen_name: 'testuser' },
        });
        expect(mockPrismaService.companion.update).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 'comp1' },
            data: expect.objectContaining({
                xp: 105,
                level: 2,
                evolutionLvl: 2,
                strength: expect.any(Number),
                intelligence: expect.any(Number),
                luck: expect.any(Number),
                description: expect.any(String),
            }),
        }));
    });
});
//# sourceMappingURL=queue.service.spec.js.map