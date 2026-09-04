# 🌲 Hoodieworld — Virtual Pet Ecosystem on Robinhood Chain

![Hoodieworld Banner](./apps/web/public/banner.png)

> **An AI-driven virtual pet & RPG simulation running on Robinhood Chain, integrated natively with 𝕏 (Twitter).**  
> Hatch, feed, and train digital companions in Sherwood forest via autonomous interactive encounters on 𝕏.

**Contract Address (CA):** `0xfab6fcc99db2a1c64fb28c70c54bc9ce661db175`  
**Live Web Dashboard:** [https://hoodieworld.xyz](https://hoodieworld.xyz)

---

## 🗺️ System Architecture & Web Flow

Hoodieworld connects cross-platform user interactions on 𝕏 with a high-performance Next.js Web Dashboard and NestJS event processor backend.

```
                  ┌─────────────────────────────────────────┐
                  │          𝕏 (Twitter) User               │
                  │   Mentions @Hoodiepets "hatch pet"     │
                  └────────────────────┬────────────────────┘
                                       │
                                       ▼ (X Account Activity Webhook)
                  ┌─────────────────────────────────────────┐
                  │          NestJS API Gateway             │
                  │      (/api/webhooks/x CRC & HMAC)       │
                  └────────────────────┬────────────────────┘
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
            ┌──────────────────────────┐   ┌──────────────────────────┐
            │   Prisma & PostgreSQL    │   │  Canvas Card Renderer    │
            │ Dynamic State & Decay    │   │ Generates Composite PNG  │
            └────────────┬─────────────┘   └────────────┬─────────────┘
                         │                              │
                         └─────────────┬────────────────┘
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │       Next.js Web Dashboard             │
                  │   Live Leaderboard, Gallery & $HXYZ     │
                  └─────────────────────────────────────────┘
```

### 🔄 End-to-End User Journey

1. **Summoning / Hatching (𝕏 Integration)**:
   - Users tag `@Hoodiepets` on 𝕏 with natural language prompts (e.g., *"hatch my hoodieworld"*, *"summon a companion"*).
   - The autonomous engine assigns a unique Pixel Art companion with an AI-generated name, species (Fox, Deer, Bear, Wolf, Hare, Crow, etc.), RPG role, and initial stats.

2. **Care & Training**:
   - Users interact with their pet on 𝕏 timeline via natural conversation (e.g., *"give my pet ramen"*, *"train agility"*).
   - Dynamic tick engines manage continuous state decay (Hunger, Health, Energy, Happiness, Friendship).

3. **Autonomous Encounters & Evolution**:
   - Companions evolve as they level up (unlocking new outfits, weapons, and RPG titles).
   - Encounters occur autonomously between companions, generating custom composite Pixel Art cards.

4. **Live Web Portal & $HXYZ Leaderboard**:
   - The Next.js web application displays a live terminal dashboard, outlaw gallery, and real-time **$HXYZ Airdrop Leaderboard** distributing rewards to top companions.

---

## ✨ Key Features

- **🥚 Autonomous Hatching & Natural Language RPG**: No rigid syntax required. Natural language processing interprets user intent to trigger pet actions.
- **🎨 Hand-Rendered Composite Companion Cards**: Layered transparent PNG sprite composition with reactive border glows, stats overlay, and evolution tiers.
- **🐦 Native 𝕏 (Twitter) Webhook Integration**: Full HMAC-SHA256 signature verification and CRC verification built into the NestJS gateway.
- **🎁 $HXYZ Airdrop Reward Engine**: Active countdown timer tracking companion exp and friendship levels for the top-3 reward distribution pool of `10,000 $HXYZ`.
- **🛠️ High-Performance Monorepo Architecture**: Clean separation of frontend, backend, renderer, database, and shared TypeScript libraries.

---

## 📂 Project Structure

This project is organized as an **npm workspace monorepo**:

```
├── apps/
│   ├── web/      # Next.js 15 Web Dashboard, Gallery, Docs & Live Terminal
│   └── api/      # NestJS API Gateway, Webhook Handlers & Event Processing Queue
├── packages/
│   ├── database/ # Prisma ORM, PostgreSQL Schemas & Migration Scripts
│   ├── renderer/ # Node-Canvas Composite Image Rendering Engine
│   └── shared/   # Shared TypeScript Interfaces, Role Definitions & Schemas
└── public/
    └── banner.png # Official Hoodieworld Web Banner
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **PostgreSQL**: `v14` or higher database instance
- **npm**: `v9` or higher

### 1. Environment Configuration (`.env`)

Create a `.env` file in the root directory:

```env
# Database Connection String
DATABASE_URL="postgresql://user:password@localhost:5432/hoodieworld?schema=public"

# Public API Gateway URL
NEXT_PUBLIC_API_URL="https://hood-r7yu.onrender.com"

# 𝕏 (Twitter) Developer API Credentials
X_CONSUMER_KEY="your_consumer_key"
X_CONSUMER_SECRET="your_consumer_secret"
X_ACCESS_TOKEN="your_access_token"
X_ACCESS_TOKEN_SECRET="your_access_token_secret"

# OAuth 2.0 Credentials
X_CLIENT_ID="your_client_id"
X_CLIENT_SECRET="your_client_secret"
```

### 2. Installation & Build

Install all monorepo dependencies:
```bash
npm install
```

Build shared packages and API gateway:
```bash
npm run build:api
```

---

## 🛠️ Development & Production Commands

| Command | Action |
| :--- | :--- |
| `npm run dev:web` | Starts the Next.js web application dev server (`http://localhost:3000`) |
| `npm run dev:api` | Starts the NestJS API gateway dev server (`http://localhost:3001`) |
| `npm run build:web` | Compiles production build for Next.js web application |
| `npm run build:api` | Compiles shared packages, renderer engine, and NestJS API |

---

## 🛡️ License & Acknowledgments

Built for **Hoodieworld** running on **Robinhood Chain**.  
© 2026 Hoodieworld — *A trading terminal for tiny lives.*
