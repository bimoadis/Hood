# Technical Specification & System Architecture Blueprint: Hoodlings

**Document Version:** 2.2.0  
**Author:** Principal Systems Architect & Senior Software Engineer  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Vision

Hoodlings is an asynchronous, event-driven virtual pet simulation and RPG-lite ecosystem set in a medieval fantasy "Robin Hood" universe. The system operates cross-platform: natively on X (formerly Twitter) via real-time mention hooks, and through a high-performance monospaced web application.

The core differentiator is **sentience simulation**: companions are not static chatbots. They possess dynamic state machines, continuous semantic vector memories, distinct personalities that modify event outcomes, and are capable of executing autonomous co-op adventures.

---

## 2. Dynamic Companion State Machine & Mathematics

Every companion runs on a deterministic tick-based state engine. Below are the formulas and states governing the lifecycle of a Hoodling.

```
                  ┌────────────────────────────────┐
                  │        Hatch (Initial)         │
                  └───────────────┬────────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
             ┌─────►│    Satisfied / Active      │◄───────────┐
             │      └─────────────┬──────────────┘            │
             │                    │                           │
             │                    │ Hunger > 50               │ Item Used /
             │                    ▼                           │ Fed
             │              ┌────────────┐                    │
             │              │  Peckish   │                    │
             │              └─────┬──────┘                    │
             │                    │                           │
             │                    │ Hunger == 100             │
             │                    ▼                           │
             │              ┌────────────┐                    │
             │              │  Famished  │────────────────────┘
             │              └─────┬──────┘
             │                    │
             │                    │ Ticks spent at Hunger 100
             │                    ▼
             │              ┌────────────┐
             │              │    Dead    │
             └──────────────┴────────────┘
                      Revive / Potion
```

### A. Vitals State Equations
Vitals decay or accumulate over periodic intervals (ticks). A system tick is defined as $T = 1 \text{ hour}$.

1.  **Hunger Accumulation ($H_t$):**
    $$H_t = \min(100, H_{t-1} + \Delta H)$$
    Where $\Delta H = +5$ per tick ($T$). If $H_t \ge 50$, the state transitions to `Peckish`. If $H_t = 100$, state transitions to `Famished`.
2.  **Energy Recovery ($E_t$):**
    *   *Passive recovery:* $E_t = \min(100, E_{t-1} + 10)$ per tick when idle.
    *   *Action cost:* Mentions/Chats cost $-5$ energy. Adventures cost $-20$ energy.
3.  **Health Decay ($HP_t$):**
    If the companion is in a `Famished` state ($H_t = 100$):
    $$HP_t = \max(0, HP_{t-1} - 10)$$
    If $HP_t = 0$, the companion enters the `Dead` state and requires a *Revive Potion* to restore functions.

### B. Personality Influence Modifiers
A companion's personality acts as a coefficient vector applied to RPG dice rolls during adventure events:

$$\text{Roll} = \text{Base D20} + \text{Stat Modifier} + \delta_{\text{personality}}$$

| Personality | Primary Mod | Positive Event Modifier | Negative Event Modifier |
| :--- | :--- | :--- | :--- |
| **Brave** | Strength | $+4$ on combat encounters | $-2$ on stealth traps |
| **Wise** | Intelligence | $+4$ on riddle traps | $-2$ on physical combat |
| **Curious** | Luck | $+3$ on discovery/loot | $+2$ encounter danger rate |
| **Lazy** | Energy | $-50\%$ passive Energy decay | $-3$ on speed check quests |

---

## 3. High-Throughput Webhook & Event Sourcing Architecture

To scale X (Twitter) interactions without hitting rate limits or dropping events during viral surges, the backend implements an event-sourcing model backed by Redis and BullMQ.

```
                    [ X (Twitter) Timeline ]
                                │
                       Webhook Mentions
                                │
                                ▼
                   ┌──────────────────────────┐
                   │   NestJS Gateway API     │
                   │  - SHA256 Signature Val  │
                   │  - CRC Challenge Handler │
                   └────────────┬─────────────┘
                                │
                       Push Raw Event
                                │
                                ▼
                       ┌────────────────┐
                       │ Redis (BullMQ) │
                       └────────┬───────┘
                                │
                       Consume from Queue
                                │
                                ▼
                   ┌──────────────────────────┐
                   │    Queue Worker Pool     │
                   │  - Intent Classifier     │
                   │  - State Modifier Engine │
                   └────────────┬─────────────┘
                                │
                      Dispatch Action
                                │
                                ▼
                ┌──────────────────────────────┐
                │   Prisma ORM & Postgres DB   │
                └──────────────────────────────┘
```

### A. Webhook Signature Verification Algorithm
Every payload from X contains a `x-twitter-signatures` header. To prevent replay and spoofing attacks, we verify the signature:

```typescript
import * as crypto from 'crypto';

export function verifyXSignature(payload: string, signature: string, clientSecret: string): boolean {
  const hmac = crypto.createHmac('sha256', clientSecret).update(payload).digest('base64');
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
}
```

### B. Concurrency Control (Locking Mechanism)
To prevent race conditions (e.g., a user sending two rapid tweets to feed a pet twice simultaneously), we utilize Redis-based distributed locks (`Redlock`):

```typescript
const lockKey = `lock:companion:${companionId}`;
const lock = await this.redis.set(lockKey, 'locked', 'PX', 5000, 'NX');
if (!lock) {
  throw new ConflictException('Companion is currently processing another action.');
}
```

---

## 4. AI Prompting, Memory & Retrieval-Augmented Generation (RAG)

The communication layer abstracts the LLM provider using a driver-based strategy.

### A. Semantic Memory Retrieval Vector Search
To enable long-term memory, user messages are embedded via standard text-embedding models and queried against the PostgreSQL database using `pgvector`:

```sql
SELECT id, memory_key, memory_value, 1 - (embedding <=> :queryEmbedding) AS similarity
FROM "CompanionMemory"
WHERE "companionId" = :companionId AND 1 - (embedding <=> :queryEmbedding) > 0.78
ORDER BY similarity DESC
LIMIT 3;
```

### B. Contextual System Prompt Construction
The final context generated dynamically for the LLM input follows a structured schema:

```
[System Context]
Role: You are a Virtual Companion.
Name: {name}
Species: {species}
Personality: {personality}
Stats: Strength={strength}, Intelligence={intelligence}, Luck={luck}

[Vitals State]
Current Level: {level}
Evolution Stage: {evolutionLvl}
Mood: {mood} (Hunger: {hunger}/100, Energy: {energy}/100)

[Retrieved Memories]
- {memory_1}
- {memory_2}

[User Action]
{userInteractionMessage}

[Output Constraints]
- Speak strictly in character.
- Max 180 characters.
- Reflect your current mood and evolution stage in your tone.
```

---

## 5. Media & Card Rendering System

To generate the response cards dynamically, the system completely replaces legacy ASCII representations with a high-fidelity **Pixel Art Composite Rendering Engine**.

### A. Asset Layering Pipeline
Companions are compiled dynamically from layered transparent PNG sprites ($300 \times 300\text{ px}$):
1.  **Base Body Layer:** Unique woodland creature frame (e.g., Fox, Stag, Badger, Owl).
2.  **Outfit Overlay Layer:** Green outlaw jubah/hood variations mapping directly to companion `evolutionLvl` stages (Hatchling, Scout, Guardian).
3.  **Weapon/Equipped Overlay Layer:** Transparent weapon frames (e.g., Bow, Staff) mapped to equipped inventory items.

### B. Front-End Web Renderer (Next.js CSS Overlay)
On the web portal, assets are stacked in a relative container using Z-indexing:

```tsx
interface PixelPetProps {
  species: string;
  evolution: number;
  weaponId?: string;
}

export default function PixelPetRenderer({ species, evolution, weaponId }: PixelPetProps) {
  return (
    <div className="relative w-48 h-48 bg-[#F2F2EC] rounded-xl border border-black/10 flex items-center justify-center overflow-hidden">
      {/* Layer 1: Base Body */}
      <img src={`/assets/pets/${species}/base.png`} className="absolute z-10 w-full h-full object-contain" alt={species} />
      
      {/* Layer 2: Clothing mapped to Evolution */}
      <img src={`/assets/pets/${species}/outfit_stage_${evolution}.png`} className="absolute z-20 w-full h-full object-contain" alt="outfit" />
      
      {/* Layer 3: Weapon Attachment overlay */}
      {weaponId && (
        <img src={`/assets/equipments/${weaponId}.png`} className="absolute z-35 w-full h-full object-contain" alt="weapon" />
      )}
    </div>
  );
}
```

### C. Backend Composite Engine (NestJS node-canvas)
For X (Twitter) replies, the server generates card images ($1200 \times 675\text{ px}$) by composition on the backend canvas prior to upload:

```typescript
import { createCanvas, loadImage } from 'canvas';

async function compileCard(species: string, evolution: number, weapon?: string): Promise<Buffer> {
  const canvas = createCanvas(1200, 675);
  const ctx = canvas.getContext('2d');
  
  // 1. Draw card layout frame background
  const bg = await loadImage('./assets/card_base.png');
  ctx.drawImage(bg, 0, 0);
  
  // 2. Draw layered companion layers in the center frame
  const body = await loadImage(`./assets/pets/${species}/base.png`);
  const outfit = await loadImage(`./assets/pets/${species}/outfit_stage_${evolution}.png`);
  
  ctx.drawImage(body, 450, 100, 300, 300);
  ctx.drawImage(outfit, 450, 100, 300, 300);
  
  if (weapon) {
    const weaponImg = await loadImage(`./assets/equipments/${weapon}.png`);
    ctx.drawImage(weaponImg, 450, 100, 300, 300);
  }
  
  return canvas.toBuffer('image/webp');
}
```

---

## 6. Monorepo Structure Spec

```
hoodlings/
├── apps/
│   ├── web/                     # Next.js 15 Web Portal (Pages: /, /docs, /dashboard)
│   │   ├── src/app/             # App router routing layouts
│   │   ├── src/components/      # Reusable monospaced UI components
│   │   └── src/hooks/           # React Query logic hooks
│   └── api/                     # NestJS Monolith REST API Gateway
│       ├── src/auth/            # Better Auth config (Google, Discord, X strategies)
│       ├── src/webhook/         # Twitter Webhook & CRC challenge handlers
│       ├── src/companion/       # Hatching & Feed state modifiers
│       ├── src/adventure/       # Asynchronous BullMQ workers
│       └── src/memory/          # pgvector embedding retrieval pipeline
├── packages/
│   ├── database/                # Prisma client config, schemas, and migrations
│   ├── shared/                  # Common TypeScript interfaces & validator schemas (Zod)
│   ├── ai/                      # Swappable AIProvider core connector drivers
│   ├── renderer/                # Node-Canvas based WebP visual card generator
│   └── config/                  # Global environmental settings
```

---

## 7. Database Model (Prisma Schema Reference)

```prisma
model Companion {
  id           String      @id @default(uuid())
  userId       String
  user         User        @relation(fields: [userId], references: [id])
  name         String
  species      String      // Fox, Owl, etc.
  personality  String      // Brave, Lazy, Wise, etc.
  evolutionLvl Int         @default(1) // Stage 1, 2, or 3
  level        Int         @default(1)
  xp           Int         @default(0)
  
  // Vitals
  mood         String      @default("Happy")
  energy       Int         @default(100)
  health       Int         @default(100)
  hunger       Int         @default(0)
  happiness    Int         @default(50)
  
  // Stats
  strength     Int         @default(10)
  intelligence Int         @default(10)
  luck         Int         @default(10)
  friendship   Int         @default(0)

  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}
```

---

## 8. Execution Roadmap & Milestones

### Phase 1 (MVP) — Core Pipeline & Playability
*   **Database & Schema Setup (`pgvector` + Prisma):** Configure PostgreSQL instances with `pgvector` enabled to store continuous semantic vector memory embeddings. Write Prisma schemas for mapped User-Companion models.
*   **Webhook Gateway & Concurrency (NestJS + X Activity API):** Register webhook endpoints and implement X-compliant SHA256 cryptographic signature validation alongside real-time CRC challenge handlers. Prevent action racing conditions using distributed lock models (`Redlock` in Redis).
*   **Natural Language Intent Parsing:** Leverage swappable LLM provider drivers to classify incoming user posts into semantic commands (`SUMMON`, `FEED`, `CHAT`) and map inputs to dynamic state parameters.
*   **Next.js Frontend Scaffolding:** Build responsive web portals implementing design tokens (parchment white bases and neon highlights) with CSS marquees and component layouts.

### Phase 2 (RPG Expansion) — Social Outings & Rendering Engine
*   **Asynchronous Adventure Queue (BullMQ + Redis):** Introduce a matchmaking queue to pair active companions for mutual expeditions. Utilize the LLM to generate narrative outcomes based on stats (`Strength`, `Intelligence`, `Luck`) and personalities.
*   **Visual Card Generation Engine (`packages/renderer`):** Build a Canvas rendering system to output WebP responsive cards (1200x675 px) containing Pixel Art layered assets, vitals displays, and event logs.
*   **Inventory & Equipment Customization:** Standardize database items (Bows, Cloaks, Boots) modifying companion RPG stats and overlaying customized symbols onto the visual layout structures.

### Phase 3 (Scale, Web3 & Community) — Retention & Optimization
*   **Live Web Gallery Dashboard (`hoodlings.xyz`):** Deploy a public showcase tracker displaying stats, evolution progress, logs, and profiles for every active companion.
*   **Optional Web3/NFT Ownership Mapping:** Allow users to bridge X credentials with non-custodial wallets to represent companion ownership on-chain (Robinhood Chain/Ethereum L2).
*   **Global Leaderboards & Guild Quests:** Implement competitive index tables and cooperative group milestones alongside daily reward tasks.
*   **Mobile PWA Optimization:** Setup service worker caching and push notifications to alert users when companion energy is replenished.
