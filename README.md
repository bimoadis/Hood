# Hoodlings (Hoodnest)

Hoodnest is a forest virtual pet platform on X — hatch a companion in Sherwood forest today, and train it to be a legendary Robin Hood protector using custom Pixel Art composites, running on Solana.

**Contract Address (CA):** `H763R1ZUTpQJKrbRfT6geyMswsbw7XSJxCeTDqg8pump`

## Project Structure

This project is organized as a monorepo using npm workspaces:

- **`apps/web`**: Next.js frontend web application.
- **`apps/api`**: NestJS backend API gateway.
- **`packages/database`**: Database client layer (Prisma ORM with PostgreSQL).
- **`packages/renderer`**: Dynamic pixel art pet renderer.
- **`packages/shared`**: Shared TypeScript definitions and config data.

## Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and PostgreSQL installed and running. Create a `.env` file in the root directory and configure `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hoodlings?schema=public"
```

### Setup & Installation

Install dependencies from the root directory:

```bash
npm install
```

Generate Prisma Client:

```bash
npm run build:api
```

### Running Locally

Run both services in development mode:

1. **Start Backend API** (runs on port 3001):
   ```bash
   npm run dev:api
   ```
2. **Start Frontend Web Client** (runs on port 3000/3002):
   ```bash
   npm run dev:web
   ```

## Production Build

Build the workspace components for production:

```bash
# Build NestJS API and dependency packages
npm run build:api

# Build Next.js Web Frontend
npm run build:web
```
