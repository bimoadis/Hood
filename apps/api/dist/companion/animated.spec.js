"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderer_1 = require("renderer");
describe('renderAnimatedCard', () => {
    it('should successfully render a companion card as an animated GIF buffer', async () => {
        const buffer = await (0, renderer_1.renderAnimatedCard)('TestOutlaw', 'Fox', 1, undefined, 100, 80, 10);
        expect(buffer).toBeDefined();
        expect(buffer.length).toBeGreaterThan(1000);
        const magicString = buffer.subarray(0, 4).toString('ascii');
        expect(magicString).toBe('GIF8');
    });
    it('should fallback gracefully when species assets do not exist', async () => {
        const buffer = await (0, renderer_1.renderAnimatedCard)('NonExistent', 'UnknownSpecies', 1);
        expect(buffer).toBeDefined();
        expect(buffer.length).toBeGreaterThan(1000);
        const magicString = buffer.subarray(0, 4).toString('ascii');
        expect(magicString).toBe('GIF8');
    });
});
//# sourceMappingURL=animated.spec.js.map