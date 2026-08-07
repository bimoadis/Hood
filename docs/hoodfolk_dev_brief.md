# HOODFOLK dev brief

Ordered by impact divided by effort. Ship top to bottom. Each item states what it is, why it matters, how to build it, and how you know it is done.

Stack assumed: TypeScript monorepo, NestJS API, Next.js web, Prisma over Postgres, node canvas renderer package, BullMQ over Redis, twitter-api-v2.

---

## P0 · Animated cards

**Estimated: 2 days. This is the highest leverage item in the entire backlog.**

### Why this first

Every reply the bot sends is currently a static PNG. Moving media is weighted differently in timeline distribution than a still image, and unlike every other item here, this one improves every single reply forever rather than being a one time announcement. The renderer already exists. You are adding frames to something that already draws.

### Build

Render N frames off one pre composited background, then encode to GIF.

```ts
// packages/renderer/src/animated.ts
import { createCanvas, loadImage, Canvas } from 'canvas';
import GIFEncoder from 'gifencoder';

const W = 1200, H = 675;
const FPS = 12;
const FRAMES = 24; // 2 second loop

export async function renderAnimatedCard(state: CompanionState): Promise<Buffer> {
  // 1. Composite the static layers ONCE. This is the performance trick.
  const bg = createCanvas(W, H);
  const bgx = bg.getContext('2d');
  await drawCardBase(bgx, state);      // template, frame, text, labels
  const bgBuf = bg.toBuffer('image/png');
  const bgImg = await loadImage(bgBuf);

  // 2. Load only the sprite layers that move.
  const body = await loadImage(spritePath(state, 'base'));
  const outfit = await loadImage(spritePath(state, 'outfit'));

  const encoder = new GIFEncoder(W, H);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(Math.round(1000 / FPS));
  encoder.setQuality(10);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  for (let f = 0; f < FRAMES; f++) {
    const t = f / FRAMES;
    ctx.drawImage(bgImg, 0, 0);

    // idle bob: 3px sine, reads as breathing
    const bob = Math.sin(t * Math.PI * 2) * 3;
    ctx.drawImage(body, 450, 100 + bob, 300, 300);
    ctx.drawImage(outfit, 450, 100 + bob, 300, 300);

    // stat bars fill over the first half of the loop, then hold
    drawBars(ctx, state, Math.min(1, t * 2));

    encoder.addFrame(ctx as any);
  }

  encoder.finish();
  return encoder.out.getData();
}
```

Install: `npm i gifencoder` inside `packages/renderer`.

**Do not re render the background per frame.** Compositing the template, text and labels 24 times is what will blow your render budget. Draw it once, convert to an image, and blit it.

### What moves

Keep it cheap and legible at thumbnail size.

The sprite bobs 3px on a sine, which reads as breathing.
Stat bars fill from zero over the first second, then hold.
On a feed action, the affected bar flashes once. Hunger bar on a feed, energy bar on an adventure.
Nothing else. Resist particles.

### Queue

Add a separate BullMQ queue with its own concurrency limit. Animated renders cost roughly twenty to thirty times a static render, so they must not share a worker pool with normal replies.

```ts
// apps/api/src/render/render.queue.ts
BullModule.registerQueue(
  { name: 'render-static' },                       // concurrency 10
  { name: 'render-animated', limiter: {            // concurrency 2
      max: 30, duration: 60_000 } },
);
```

**Fallback is mandatory.** If the animated job times out or the queue is saturated, fall through to the static PNG and reply anyway. A slow reply is a lost user, so never let this path block a response.

### Rollout

Animate the hatching card and the adventure result card first. Those are the two people screenshot. Leave feeding and status on static PNG until the cost per render is measured.

### Done when

A hatch reply posts a looping GIF under 3MB, the loop is seamless with no visible jump, the static fallback fires when the animated job exceeds 8 seconds, and you have a measured cost per animated render written down somewhere.

---

## P0 · Famished mention

**Estimated: half a day. Highest value per line of code you will write this month.**

### Why

Your own published analysis says roughly twenty nine percent of check in gaps exceed the thirty hour neglect window for a once daily player. Those users lose a companion without ever being told it was in trouble. This converts a silent ten hour countdown into a visible one, and it is the single biggest retention fix available.

### Build

The background scheduler already exists. Add one job.

Prisma migration:

```prisma
model Companion {
  // ...
  famishedNotifiedAt DateTime?
}
```

Job, running on the same hourly tick as vitals decay:

```ts
// apps/api/src/scheduler/famine.job.ts
@Cron(CronExpression.EVERY_HOUR)
async notifyFamished() {
  const cutoff = new Date(Date.now() - 24 * 3600_000);

  const at_risk = await this.prisma.companion.findMany({
    where: {
      hunger: { gte: 100 },
      health: { gt: 0 },
      OR: [
        { famishedNotifiedAt: null },
        { famishedNotifiedAt: { lt: cutoff } },
      ],
    },
    include: { user: true },
    take: 50, // respect X posting limits, drain across ticks
  });

  for (const c of at_risk) {
    const hoursLeft = Math.ceil(c.health / 10);
    await this.replyQueue.add('famine-warning', {
      handle: c.user.xHandle,
      companionId: c.id,
      hoursLeft,
    });
    await this.prisma.companion.update({
      where: { id: c.id },
      data: { famishedNotifiedAt: new Date() },
    });
  }
}
```

The `famishedNotifiedAt` field is what stops you mentioning the same person every hour for ten hours. Do not skip it.

### Copy

```
@{handle} your {species} is famished.

Health is dropping 10 an hour. {hoursLeft} hours before the Ledger
records it.

Feed it.
```

Attach the current status card. Seeing the bars is more persuasive than reading the number.

### Rate limits

Fifty per tick is a deliberate cap. If you have more at risk than that, the backlog drains over subsequent ticks and the oldest warnings go first because `famishedNotifiedAt: null` sorts before any timestamp. Do not raise the cap without checking your posting quota first.

### Done when

A companion crossing hunger 100 receives exactly one mention, does not receive a second within twenty four hours, and the job survives a tick where two hundred companions are famished at once.

---

## P0 · Live forest stats on the site

**Estimated: half a day. Fixes the worst thing about the current homepage.**

### Why

The site currently shows "No companion records found in database" and a leaderboard stuck loading. A visitor arriving from a launch post sees an empty product. Numbers moving on a page are the cheapest possible proof that something is running.

### Backend

```ts
// apps/api/src/stats/stats.controller.ts
@Get('forest')
async forest() {
  const cached = await this.redis.get('stats:forest');
  if (cached) return JSON.parse(cached);

  const since = new Date(Date.now() - 24 * 3600_000);
  const [total, hatched, adventures, deaths, famished] = await Promise.all([
    this.prisma.companion.count(),
    this.prisma.companion.count({ where: { createdAt: { gte: since } } }),
    this.prisma.adventure.count({ where: { createdAt: { gte: since } } }),
    this.prisma.companion.count({ where: { health: 0, updatedAt: { gte: since } } }),
    this.prisma.companion.count({ where: { hunger: { gte: 100 }, health: { gt: 0 } } }),
  ]);

  const payload = { total, hatched, adventures, deaths, famished };
  await this.redis.setex('stats:forest', 30, JSON.stringify(payload));
  return payload;
}
```

Cache for thirty seconds. These are count queries on a growing table and you do not want them running per pageview.

### Frontend

A single monospace strip near the top of the homepage, polling every thirty seconds. Animate the digit change so the eye catches it.

```
FOREST POPULATION  1,284
HATCHED TODAY         96
ADVENTURES TODAY     311
FAMISHED RIGHT NOW    17
LOST TODAY             3
```

`FAMISHED RIGHT NOW` in oxblood is the line that makes the page feel like a place rather than a landing page, because it is the only number a visitor can do something about.

### Done when

The strip renders on first paint with cached values, updates without a page reload, and degrades to hidden rather than showing zeros if the endpoint fails.

---

## P1 · One metered x402 endpoint

**Estimated: 2 days. This is what makes your earlier announcement true.**

### Scope discipline

Do not build companion to companion payments first. Build one metered public endpoint, prove the payment path end to end, then expand. One endpoint that genuinely works beats four that half work.

Chosen endpoint: card rendering as a service. It is stateless, it has obvious external demand, it cannot corrupt game state if abused, and it is the safest possible surface to learn on.

### Build

```
POST /v1/render/card
Body: { species, evolution, level, stats, name }
Price: $0.001 USDC per call
```

Use the Coinbase x402 reference implementation server side. In NestJS it sits naturally as a guard in front of the controller.

```ts
// apps/api/src/x402/x402.guard.ts
@Injectable()
export class X402Guard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const header = req.headers['x-payment'];

    if (!header) {
      const res = ctx.switchToHttp().getResponse();
      res.status(402).json(this.paymentRequirements());
      return false;
    }

    const ok = await this.facilitator.verify(header, this.paymentRequirements());
    if (!ok) throw new PaymentRequiredException();

    await this.facilitator.settle(header);
    return true;
  }
}
```

Use the public facilitator. There is no fee on it, which means your only cost here is engineering time.

### Non negotiable controls

Per caller daily spend cap.
Per endpoint rate limit independent of payment.
A kill switch environment variable that returns 503 on every metered route without a redeploy.

An autonomous agent with a wallet and a bug is an expensive and novel kind of incident. Build the brakes before the engine.

### Also do this

Add x402 to the README and put the integration somewhere findable in the tree. You announced this publicly and the repo does not currently show it, which means anyone verifying the claim comes away empty. A `packages/x402` directory with a real README is worth more than the code being technically present but invisible.

### Done when

An unpaid request returns 402 with valid payment requirements, a paid request returns a rendered card, settlement appears on chain, the spend cap rejects a caller that exceeds it, and the kill switch works without a deploy.

---

## P1 · Sprite stacking 3D preview

**Estimated: 1 weekend. Do this before spending any money on voxel models.**

### Why

It tests whether players actually want dimensional companions using assets you already own, at close to zero art cost. If nobody engages with it, you just saved yourself the entire Forge phase budget.

### Build

Pure frontend, no backend, no new assets. Slice the existing sprite into horizontal bands and offset them along a vertical axis.

```tsx
// apps/web/components/StackedSprite.tsx
const LAYERS = 24;

export function StackedSprite({ src, angle }: { src: string; angle: number }) {
  return (
    <div style={{ perspective: 800 }}>
      {Array.from({ length: LAYERS }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            transform: `rotateX(60deg) rotateZ(${angle}deg) translateZ(${i * 2}px)`,
            backgroundImage: `url(${src})`,
            backgroundPosition: `0 -${i * (SPRITE_H / LAYERS)}px`,
            width: SPRITE_W,
            height: SPRITE_H / LAYERS,
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  );
}
```

`imageRendering: 'pixelated'` is load bearing. Without it the browser smooths the sprite and the whole effect collapses into mush.

Drive `angle` from a slow auto rotate, with pointer drag to override.

### Where it goes

One companion on the homepage, above the fold, slowly rotating. Not the whole roster. One is a demonstration, twelve is a performance problem.

### Done when

It holds sixty frames per second on a mid range phone, falls back to the static sprite when `prefers-reduced-motion` is set, and does not add more than 20KB to the initial bundle.

---

## P2 · The seven second hatch video

For the launch post. Specification rather than code.

```
Duration     7 seconds, seamless loop
Format       MP4, H.264, 1080x1080 square
Sound        none, it will autoplay muted
Text         burned in, because most viewers never unmute or click
```

Beat sheet:

```
0.0 - 1.5s   A tweet being typed, close on the text:
             "@HoodFolkTech hatch my hoodling"
             Real UI, not a mockup. Mockups are visible.

1.5 - 2.5s   Send. Brief pause. Let the empty beat sit.

2.5 - 4.5s   The reply card arrives and fills the frame.
             The sprite bobs. Stat bars fill.

4.5 - 6.0s   Cut to a feeding reply, then an adventure result.
             Fast, two beats, no transitions.

6.0 - 7.0s   Hold on the card. Small monospace line appears:
             "free forever · hoodfolk.tech"
```

Rules for whoever cuts it: no logo animation at the start, because the first two seconds are the only ones you are guaranteed. Everything shown must be real product output. Loop point must be invisible.

---

## Explicitly not now

Voxel models before sprite stacking tells you anyone wants them.
Companion to companion payments before one metered endpoint works.
Guild treasuries before provisions differ by value.
An in browser model editor, ever, in the next two years.
Animating feeding and status cards before the animated render cost is measured.

---

## Two things to measure this week

Cost per interaction, actually measured rather than estimated. Model call plus render plus storage, per reply. Then the number that governs every roadmap decision after it: at what daily active user count does treasury runway end.

Median time to match in the adventure queue. You published a paper with a threshold in it and promised a follow up note reporting what your own queue does. That measurement is a `SELECT` over adventure timestamps and it is the difference between keeping a public promise and quietly dropping one.
