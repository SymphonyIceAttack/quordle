# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
# Start development server
pnpm dev

# Build for production (Next.js)
pnpm build

# Build for Cloudflare Workers/Pages
pnpm build:worker

# Deploy to Cloudflare
pnpm deploy

# Lint and format code
pnpm lint
pnpm format
```

## Project Overview

Quordle & Squares is a daily puzzle game built with Next.js 16 (App Router) that features two game modes:
- **Quordle**: Four simultaneous Wordle-style boards
- **Squares**: Interactive 4x4 word search puzzle with AI-generated daily content

The app uses AI (DeepSeek API) to generate fresh daily puzzles, with caching via Cloudflare KV/R2/D1.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **Linting/Formatting**: Biome (v2.2.4)
- **Deployment**: Cloudflare Workers/Pages (@opennextjs/cloudflare)
- **AI**: DeepSeek API via Vercel AI SDK
- **Storage**: KV, R2, D1, Durable Objects Queue

## Common Commands

### Development
```bash
pnpm dev              # Start Next.js dev server (http://localhost:3000)
pnpm start            # Start production server after build
pnpm lint             # Run Biome linter (check only)
pnpm format           # Format code with Biome (auto-fixes files)
```

### Cloudflare Deployment
```bash
pnpm build:worker     # Build for Cloudflare Workers/Pages
pnpm preview          # Preview Cloudflare deployment locally
pnpm deploy           # Deploy to Cloudflare Workers/Pages
pnpm upload           # Upload to Cloudflare
pnpm cf-typegen       # Generate Cloudflare TypeScript types
```

### Environment Setup
- Uses **devbox/devenv** for development environment management
- Environment variables required (`.env`):
  - `DEEPSEEK_API_KEY`: DeepSeek API key for AI puzzle generation
  - `API_SECRET`: Secret token for cache revalidation endpoint
  - `NEXT_PUBLIC_DEV_MODE`: Set to "development" to show answers in dev
  - `NEXT_PUBLIC_APP_URL`: Public app URL for sharing features
  - Cloudflare-specific: `NEXT_INC_CACHE_R2_PREFIX`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CF_ACCOUNT_ID`

## Code Architecture

### Content Generation (Server-Side)

**AI-Powered Daily Content**: Two server-side modules generate daily puzzles using DeepSeek API with 24-hour caching:

1. **Quordle Generator** (`lib/ai-wordpool.ts`)
   - Generates 4 distinct 5-letter words per day
   - Uses `unstable_cache` with tag `daily-word-pool`
   - Fallback to static words if AI fails

2. **Squares Generator** (`lib/squares-wordpool.ts`)
   - Creates 4x4 letter grid + word list
   - Validates with DFS algorithm (`canFindWord`) to ensure all words exist on grid
   - Uses `unstable_cache` with tag `daily-squares-pool`

3. **Cache Revalidation** (`app/api/wordle-daily/route.ts`)
   - POST endpoint (token-protected) to force regeneration
   - Triggers `revalidateTag` for both cache tags

### Game Engines (Client-Side)

1. **Quordle Game** (`components/features/wordle-multi/`)
   - `WordleMultiGame.tsx`: Manages 4 simultaneous boards
   - `WordleKeyboard.tsx`: Virtual keyboard with letter states
   - `WordlePuzzleBoard.tsx`: Individual puzzle board component
   - Tracks correct/present/absent letter states
   - Developer mode shows answers when `NEXT_PUBLIC_DEV_MODE=development`

2. **Squares Game** (`components/features/squares/`)
   - `SquaresGame.tsx`: Interactive 4x4 grid with drag-to-select
   - SVG connection lines for selected tiles
   - Smart hint system and share functionality
   - Word list sorting (by order or length)

### UI Components (`components/`)

- `ui/`: Reusable shadcn/ui components (button, card, progress, etc.)
- `features/`: Feature-specific components grouped by game mode
- `theme-provider.tsx`: Next-themes integration

### Utility Modules (`lib/`)

- `lib/stats.ts`: localStorage persistence for game statistics
- `lib/utils.ts`: Shared utilities (cn helper, etc.)
- `lib/wordle-multi.ts`: Quordle game logic
- `lib/daily-squares-generator.ts`: Squares generation logic
- `lib/sound-manager.ts`: Web Audio API-based sound effects system
  - Singleton pattern with localStorage for user preferences
  - Provides game feedback sounds (key press, success, error, victory)
  - Volume control and enable/disable toggle

### Routing Structure

- `/` - Quordle game (default)
- `/squares` - Squares game
- `/api/wordle-daily` - Cache revalidation endpoint
- `/robots.ts`, `/sitemap.ts` - SEO configuration

## Cloudflare Configuration

The app is optimized for Cloudflare Workers/Pages deployment:

- **R2 Incremental Cache**: `NEXT_INC_CACHE_R2_BUCKET` binding to `next-bucket` for static assets
- **Durable Objects Queue**: `NEXT_CACHE_DO_QUEUE` binding with `DOQueueHandler` class
- **D1 Tag Cache**: `NEXT_TAG_CACHE_D1` for cache revalidation (required for on-demand revalidation)
- **Assets Binding**: `.open-next/assets` directory
- **Worker Self-Reference**: Service binding for internal requests

⚠️ **Note**: Durable Objects don't work in local dev (`next dev`), use `wrangler pages dev` or deploy to preview/production.

## Development Notes

- Uses **pnpm** as package manager
- **Biome** configured in `biome.json`:
  - Disabled rules: `noArrayIndexKey`, `noSvgWithoutTitle`, `noStaticElementInteractions`, `useExhaustiveDependencies`
  - Auto-organizes imports on save
  - 2-space indentation
- TypeScript strict mode enabled
- Image optimization disabled (`next.config.ts`) for Cloudflare compatibility
- App Router with Server Components by default, client components marked with "use client"
- **devenv/devbox** used for reproducible development environments
