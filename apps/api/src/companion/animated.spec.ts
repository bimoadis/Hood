import { renderAnimatedCard } from 'renderer';

describe('renderAnimatedCard', () => {
  it('should successfully render a companion card as an animated GIF buffer', async () => {
    const buffer = await renderAnimatedCard(
      'TestOutlaw',
      'Fox',
      1,
      undefined,
      100, // health
      80,  // energy
      10   // hunger
    );

    // Verify buffer exists and has data
    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(1000);

    // Verify magic bytes for GIF (GIF89a or GIF87a -> GIF8)
    const magicString = buffer.subarray(0, 4).toString('ascii');
    expect(magicString).toBe('GIF8');
  });

  it('should fallback gracefully when species assets do not exist', async () => {
    const buffer = await renderAnimatedCard(
      'NonExistent',
      'UnknownSpecies',
      1
    );

    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(1000);

    const magicString = buffer.subarray(0, 4).toString('ascii');
    expect(magicString).toBe('GIF8');
  });
});
