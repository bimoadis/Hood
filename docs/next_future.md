# HOODFOLK Development Roadmap & Implementation Plan

This document provides a detailed implementation roadmap for the HOODFOLK project, categorized by priority phases (P0, P1, P2), deferred items, and key metrics to measure.

---

## 🌲 Phase 0 (P0) · Core Experience & Retention

### 1. Animated Cards (Highest Leverage)
* **Goal**: Transition from static PNG companion replies to looping animated GIFs to optimize social feed distribution and user engagement.
* **Estimated Effort**: 2 days
* **Implementation Steps**:
  1. Install `gifencoder` inside `packages/renderer`:
     ```bash
     npm i gifencoder
     ```
  2. Implement composite performance optimizations: render the base background layers (labels, static frames, layout) only **once**, convert to an image buffer, and draw moving frames over it.
  3. Animate sprite vertical bobbing (3px sine wave to simulate breathing).
  4. Animate stats progress bars filling from zero to actual values during the first second.
  5. Setup a separate BullMQ queue for animated rendering with concurrency limits:
     ```ts
     BullModule.registerQueue(
       { name: 'render-static' },
       { name: 'render-animated', limiter: { max: 30, duration: 60000 } }
     );
     ```
  6. Implement a mandatory fallback to static PNGs if the animated rendering job exceeds 8 seconds.
* **Done When**: A hatch/adventure reply posts a seamless GIF under 3MB, falling back to static PNG on timeouts or queue saturation.

### 2. Famished Mention (High Value Retention Fix)
* **Goal**: Alert users when their companion's hunger reaches critical levels (`hunger >= 100`) before they lose them due to the 30-hour neglect window.
* **Estimated Effort**: 0.5 days
* **Implementation Steps**:
  1. Add a tracking field to the Prisma schema:
     ```prisma
     model Companion {
       // ...
       famishedNotifiedAt DateTime?
     }
     ```
  2. Implement an hourly cron task that checks for at-risk companions:
     ```ts
     @Cron(CronExpression.EVERY_HOUR)
     async notifyFamished() {
       const cutoff = new Date(Date.now() - 24 * 3600000);
       const atRisk = await this.prisma.companion.findMany({
         where: {
           hunger: { gte: 100 },
           health: { gt: 0 },
           OR: [
             { famishedNotifiedAt: null },
             { famishedNotifiedAt: { lt: cutoff } }
           ]
         },
         include: { user: true },
         take: 50 // Rate limit safety
       });
       // ... send alerts and update famishedNotifiedAt
     }
     ```
  3. Format the mention notification template with direct action call-to-action (`Feed it.`).
* **Done When**: At-risk companions receive exactly one alert every 24 hours, and the job scales successfully to handle 200+ concurrent alerts.

### 3. Live Forest Stats on Website
* **Goal**: Replace empty state placeholders on the homepage with live, cached server statistics to show actual network activity.
* **Estimated Effort**: 0.5 days
* **Implementation Steps**:
  1. Create a cached statistics controller endpoint (`GET /v1/stats/forest`) with a 30-second Redis TTL.
  2. Aggregate totals: overall population, companions hatched today, active adventures today, lost (dead) companions today, and currently famished companions.
  3. Render a monospace ticking banner on the Next.js homepage using subtle micro-animations for numbers change. Highlight the `FAMISHED RIGHT NOW` metric in oxblood color to drive user interaction.
* **Done When**: Homepage renders cached statistics on initial paint, auto-polls every 30 seconds, and hides gracefully if the endpoint fails.

---

## 🛡️ Phase 1 (P1) · Monetization & 3D Interactive Previews

### 1. One Metered x402 Endpoint
* **Goal**: Deploy a metered public API endpoint for card rendering to prove end-to-end Web3 micro-payment rails.
* **Estimated Effort**: 2 days
* **Implementation Steps**:
  1. Setup a public POST endpoint: `/v1/render/card` charging `$0.001 USDC` per call.
  2. Integrate the Coinbase x402 reference guard inside NestJS to verify on-chain headers.
  3. Build non-negotiable controls: daily spending caps per caller, rate limits, and an emergency global kill-switch env variable.
  4. Write a dedicated `packages/x402` package with a clean developer guide.
* **Done When**: Unpaid calls return 402 with billing metadata, paid calls render a valid companion card, and the emergency kill-switch immediately suspends the metered routing.

### 2. Sprite Stacking 3D Preview
* **Goal**: Render a pseudo-3D rotating preview of pixel-art sprites using slice-stacking CSS/HTML techniques to gauge demand for 3D/voxel models.
* **Estimated Effort**: 1 weekend
* **Implementation Steps**:
  1. Create `StackedSprite.tsx` component slicing the 2D sprite into 24 Z-indexed horizontal layers:
     ```tsx
     // Slice logic using CSS perspective and rotateZ / translateZ
     ```
  2. Add mouse/pointer drag handlers to rotate the sprite.
  3. Support `prefers-reduced-motion` fallbacks to standard 2D view.
* **Done When**: Rotating preview runs smoothly at 60 FPS on mobile, falls back when user settings request reduced motion, and adds less than 20KB to the bundle size.

---

## 🎬 Phase 2 (P2) · Promotion & Assets

### 1. The 7-Second Hatch Video
* **Goal**: Produce a high-quality square looping video showing the tweet-to-hatch action loop for social media promotion.
* **Done When**: Video is created in H.264 MP4 1080x1080 format, containing clear burned-in text captions, showing actual product output, and looping seamlessly without any intro logo delays.

---

## 🚫 Deferred Items (Explicitly Not Now)

* **Voxel Assets**: Do not build until Sprite Stacking previews prove demand.
* **Coop Payments**: Deferred until the card-rendering x402 pipeline is fully operational.
* **Guild Features & In-Browser Model Editor**: Planned as post-launch long-term milestones.

---

## 📊 Key Metrics to Monitor
1. **Cost per Interaction**: Real-time logging of LLM tokens, canvas renders, and storage costs.
2. **Treasury Runway**: Projecting cash flow requirements relative to DAU growth.
3. **Queue Wait Times**: Monitoring median matching speeds in the matchmaking database.
