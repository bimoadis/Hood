# Comprehensive Project Tasks Tracker: Hoodlings

This document outlines the complete developmental lifecycle execution checklist and verification test targets derived directly from the **Hoodlings Technical Specification & Brief**.

---

## 1. Phase 1 (MVP) — Core Pipeline & Playability

### A. Development Tasks
- [ ] Repository Infrastructure Setup
  - [ ] Initialize PNPM/NPM workspaces configurations
  - [ ] Map directories: `apps/web`, `apps/api`, and `packages/` library components
- [ ] Database Implementation (PostgreSQL + Prisma)
  - [ ] Enable `pgvector` extension in target database instances
  - [ ] Build models for `User`, `Companion`, `CompanionMemory`, and `Inventory`
  - [ ] Generate Prisma Client bindings and execute initial migrations (`prisma migrate dev`)
- [ ] Webhook Gateway & Authentication (NestJS)
  - [ ] Setup Better Auth configurations (Google, Discord, X strategies)
  - [ ] Register Webhook route handlers for X mention ingestions
  - [ ] Implement SHA256 Signature verification helper validators
  - [ ] Integrate Redlock Redis locking to prevent companion concurrent state updates
  - [ ] Implement BullMQ event worker pool to classify NLP inputs asynchronously
- [ ] AI & Memory Core (Packages)
  - [ ] Implement abstract interface wrappers for Grok, Gemini, and OpenAI
  - [ ] Connect embeddings generator pipelines and cosine similarity query retrievals
- [x] Next.js Frontend Scaffolding
  - [x] Setup parchment-white and green neon global themes
  - [x] Polish landing section with scrolling marquee tickers

### B. Phase 1 Verification Tests
- [x] Run CRC webhook validation tests (Challenge-response checks)
- [ ] Run Redlock locking stress tests (Verify concurrent request rejection)
- [ ] Run LLM NLP intent parser mock test (Assert classifications for summon vs feed)
- [ ] Run memory vector search mock query (Verify cosine distance threshold matches)
- [x] Execute `npm run build` on Next.js to verify zero TS compilation warnings

---

## 2. Phase 2 (RPG Expansion) — Social Outings & Rendering Engine

### A. Development Tasks
- [ ] Asynchronous Adventure Queue (BullMQ + Redis)
  - [ ] Introduce a matchmaking queue to pair active companions for mutual expeditions
  - [ ] Hook up LLM to generate narrative outcomes based on stats & personalities
- [ ] Visual Card Generation Engine (`packages/renderer`)
  - [ ] Install `canvas` in packages/renderer dependencies
  - [ ] Write `CardRendererService` to compile layered Pixel Art sprites (Base body, jubah overlays, weapons) to WebP format
  - [ ] Hook up Cloudflare R2 client to upload generated card buffers
- [ ] Inventory & Equipment Customization
  - [x] Create `PixelPetRenderer.tsx` component with Z-indexed layers for the dashboard
  - [ ] Map static items catalog (Bows, Cloaks) to stats and overlays

### B. Phase 2 Verification Tests
- [ ] Run Canvas composite image generator unit tests (Assert WebP size > 1000 bytes)
- [ ] Run BullMQ adventure worker integration tests (Verify adventure logs write to database)
- [ ] Run Cloudflare R2 bucket upload mock tests
- [ ] Perform visual check of `/components/PixelPetRenderer` layering layouts on multiple screen breakpoints

---

## 3. Phase 3 (Scale, Web3 & Community) — Retention & Optimization

### A. Development Tasks
- [ ] Live Web Gallery Dashboard
  - [ ] Deploy a public showcase tracker displaying stats, evolution progress, and logs
- [ ] Optional Web3/NFT Ownership Mapping
  - [ ] Bridge X credentials with non-custodial wallet addresses on-chain
- [ ] Global Leaderboards & Guild Quests
  - [ ] Write cooperative milestones event workers and leaderboard indices
- [ ] Mobile PWA Optimization
  - [ ] Setup service worker caching and push notification triggers

### B. Phase 3 Verification Tests
- [ ] Run PWA Lighthouse audits (Confirm offline caching capabilities & service worker registrations)
- [ ] Run API endpoint stress tests using `autocannon` to verify high-concurrency response times
- [ ] Verify non-custodial wallet signature mappings
