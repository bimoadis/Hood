# 🌲 Hoodnest

Hoodnest is a forest virtual pet platform running on Solana and deeply integrated with 𝕏. Hatch a companion in Sherwood forest today, train it to become a legendary Robin Hood protector using custom Pixel Art composites, and raise it in public via autonomous interactive encounters on 𝕏.

**Contract Address (CA):** `H763R1ZUTpQJKrbRfT6geyMswsbw7XSJxCeTDqg8pump`

---

## ✨ Features

- **🥚 Autonomous Hatching & Training**: Interact with the platform on 𝕏 to hatch a companion and raise its stats (Friendship, Strength, Intelligence, Luck, etc.).
- **🎨 Hand-Rendered Composite Cards**: Dynamically generates visual companion cards with clean rounded corners and reactive border glows.
- **🐦 𝕏 (Twitter) Integration**: Completely native experience where the companion system listens to tweets, interprets natural language actions, and replies directly on-thread.
- **🎁 $NEST Airdrop Countdown**: An active 3-hour countdown displaying the top-3 pets leaderboard reward distribution of `10,000 $NEST`.
- **🛠️ Monorepo Architecture**: Clean separation of packages and apps built using TypeScript, NestJS, Next.js, and Prisma.

---

## 📂 Project Structure

This monorepo uses **npm workspaces** to separate logical boundaries:

```
├── apps/
│   ├── web/      # Next.js frontend web dashboard & live stats
│   └── api/      # NestJS backend API gateway & event processors
├── packages/
│   ├── database/ # Prisma ORM Client & PostgreSQL schemas
│   ├── renderer/ # Dynamic pixel art companion image rendering engine
│   └── shared/   # Shared TypeScript definitions & config metadata
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or newer)
- **PostgreSQL** database instance
- **Developer Account on 𝕏** (Optional, for bot reply integration)

### 1. Configuration (`.env`)
Create a `.env` file in the root workspace folder:

```env
# Database Settings
DATABASE_URL="postgresql://user:password@localhost:5432/hoodnest?schema=public"

# API Base Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"

# 𝕏 (Twitter) Developer API Credentials (Optional)
X_CONSUMER_KEY="your_consumer_key"
X_CONSUMER_SECRET="your_consumer_secret"
X_ACCESS_TOKEN="your_access_token"
X_ACCESS_TOKEN_SECRET="your_access_token_secret"
```

### 2. Setup & Installation
Install all workspaces dependencies from the root directory:
```bash
npm install
```

### 3. Generate Database Client & Seed
Generate the Prisma ORM client:
```bash
npm run build:api
```

---

## 🛠️ Development Workflow

Run both front-end and backend services concurrently:

1. **Start Backend API** (runs on port `3001`):
   ```bash
   npm run dev:api
   ```
2. **Start Frontend Web Client** (runs on port `3000`/`3002`):
   ```bash
   npm run dev:web
   ```

---

## 📦 Production Builds

Compile all monorepo components for production distribution:

```bash
# Build NestJS API & shared packages
npm run build:api

# Build Next.js Web Frontend
npm run build:web
```
