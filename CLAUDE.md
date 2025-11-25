# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
# Development
pnpm dev                          # Start Next.js dev server (http://localhost:3000)
pnpm start                        # Start production server after build

# Cloudflare Workers/Pages
pnpm build:worker                 # Build for Cloudflare Workers/Pages
pnpm preview                      # Preview Cloudflare deployment locally
pnpm deploy                       # Deploy to Cloudflare Workers/Pages
pnpm upload                       # Upload to Cloudflare
pnpm cf-typegen                   # Generate Cloudflare TypeScript types

# Code Quality
pnpm lint                         # Run Biome linter (check only)
pnpm format                       # Format code with Biome (auto-fixes files)

# Other Tools
pnpm build                        # Build for standard Next.js deployment (not Cloudflare)
```

## Project Overview

Quordle & Squares is a daily puzzle game built with Next.js 16 (App Router) that features two game modes:
- **Quordle**: Four simultaneous Wordle-style boards
- **Squares**: Interactive 5x5 word search puzzle with wordlist-generated daily content

The app uses open source wordlists and DFS algorithm to generate fresh daily puzzles, with caching via Cloudflare R2/D1/Durable Objects.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 (no config file needed, uses @import in globals.css)
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Icons**: Lucide React
- **Linting/Formatting**: Biome (v2.2.4)
- **Deployment**: Cloudflare Workers/Pages (@opennextjs/cloudflare)
- **Word Lists**: Open source wordlists (Wordle official, Enable1, etc.)
- **Word Generation**: Local deterministic word selection (no external API)
- **Storage**: R2 (incremental cache), D1 (tag cache), Durable Objects (queue)
- **Environment**: devenv/devbox for reproducible development environments

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
- Uses **devenv** for reproducible development environments (see `.devenv/` directory)
- Environment variables required (`.env`):
  - `API_SECRET`: Secret token for cache revalidation endpoint
  - `NEXT_PUBLIC_DEV_MODE`: Set to "development" to show answers in dev
  - `NEXT_PUBLIC_APP_URL`: Public app URL for sharing features
  - Cloudflare-specific: `NEXT_INC_CACHE_R2_PREFIX`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CF_ACCOUNT_ID`

## Code Architecture

### Dual-Game Architecture

The app features two independent but related daily puzzle games, each with completely separate state management, UI, and branding:

#### 1. **Quordle** (`/`) - Four Simultaneous Wordles
- **Icon Theme**: Orange/Yellow (#f59e0b)
- **Core Logic**: `lib/wordle-multi.ts`
- **Game State**: Tracks 4 simultaneous boards with shared keyboard

#### 2. **Squares** (`/squares`) - 5x5 Word Search Puzzle
- **Icon Theme**: Blue/Purple (#3b82f6)
- **Core Logic**: `lib/squares-wordpool.ts` (wordlist-based), `lib/squares-dfs-generator.ts` (DFS validation)
- **Game State**: Interactive 5x5 grid with drag-to-select word finding
- **Word Lengths**: Supports 3-6 letter words (uses stratified sampling for diversity)

### Content Generation (Server-Side)

**Word List-Based Daily Content**: Two server-side modules generate daily puzzles using local wordlists with 24-hour caching:

1. **Quordle Generator** (`lib/wordle-daily-words.ts`)
   - Generates 4 distinct 5-letter words per day
   - Uses `unstable_cache` with tag `daily-word-pool`
   - Fallback to static words if generation fails
   - Multi-level wordlist system: Advanced → Basic → Fallback

2. **Squares Generator** (`lib/squares-wordpool.ts`)
   - Creates 5x5 letter grid + word list (25 cells, expanded from 16)
   - Validates with DFS algorithm (`canFindWord`) to ensure all words exist on grid
   - Uses `unstable_cache` with tag `daily-squares-pool`
   - Multi-tier fallback chain: Ultimate DFS → Advanced → Basic → Hardcoded FALLBACK_DATA
   - **Word Length Support**: 3-6 letter words with stratified sampling for diversity
   - Error handling with console logging for debugging failed generations

3. **Cache Revalidation** (`app/api/wordle-daily/route.ts`)
   - POST endpoint (token-protected) to force regeneration
   - Triggers `revalidateTag` for both cache tags

### Game Engines (Client-Side)

Each game has its own independent component hierarchy and state management:

1. **Quordle Game** (`components/features/wordle-multi/`)
   - `WordleMultiGame.tsx`: Manages 4 simultaneous boards
   - `WordleKeyboard.tsx`: Virtual keyboard with letter states
   - `WordlePuzzleBoard.tsx`: Individual puzzle board component
   - Tracks correct/present/absent letter states across all boards
   - Developer mode shows answers when `NEXT_PUBLIC_DEV_MODE=development`
   - Independent stats tracking via `lib/stats.ts`

2. **Squares Game** (`components/features/squares/`)
   - `SquaresGame.tsx`: Interactive 5x5 grid with drag-to-select (25 cells)
   - `SquaresPageClient.tsx`: Page-level state management
   - SVG connection lines for selected tiles
   - Smart hint system and share functionality
   - Word list sorting (by order or length)
   - Independent stats tracking via `lib/stats.ts`
   - **Word Length Display**: Shows mix of 3-6 letter words (e.g., SLY-3, TOMB-4, MONKS-5)

### UI Components (`components/`)

- `ui/`: Reusable shadcn/ui components (button, card, progress, etc.)
  - Generated via shadcn/ui CLI
  - Configured in `components.json` with "new-york" style
- `features/`: Feature-specific components grouped by game mode
  - `wordle-multi/`: Quordle game components
  - `squares/`: Squares game components
- `theme-provider.tsx`: Next-themes integration for dark/light mode

### Utility Modules (`lib/`)

- `lib/stats.ts`: localStorage persistence for game statistics (shared by both games)
- `lib/utils.ts`: Shared utilities (cn helper, etc.)
- `lib/wordle-multi.ts`: Quordle game logic (letter evaluation, win checking)
- `lib/wordle-daily-words.ts`: Wordlist-based daily word generation for Quordle
- `lib/wordlist-dictionary.ts`: Basic wordlist system (~1700+ words)
- `lib/advanced-wordlist.ts`: Advanced wordlist with themes and categories (2000+ words)
- `lib/squares-dfs-generator.ts`: DFS algorithm for Squares grid validation
- `lib/squares-wordpool.ts`: Wordlist-based Squares generation with multi-tier fallback
- `lib/sound-manager.ts`: Web Audio API-based sound effects system
  - Singleton pattern with localStorage for user preferences
  - Provides game feedback sounds (key press, success, error, victory)
  - Volume control and enable/disable toggle

### Wordlist Data

The project uses a multi-tier wordlist system:

- **Basic Wordlist** (`lib/wordlist-dictionary.ts`): 1700+ curated words organized by difficulty
  - Easy: 300 most common words (color, animals, food, etc.)
  - Medium: 200 moderately common words
  - Hard: 200 less common/technical words

- **Advanced Wordlist** (`lib/advanced-wordlist.ts`): 2000+ words with categorization
  - Word frequency-based classification (30% easy, 50% medium, 20% hard)
  - Thematic filtering (animals, colors, nature, food, emotions)
  - Deterministic date-based selection using seeded random algorithm

- **Word Selection Algorithm**: Uses date-based seeding to ensure consistent daily puzzles
  - `seededRandom()`: Hash-based pseudo-random number generator
  - `selectBySeed()`: Deterministic selection ensuring same words across all clients
  - No external API calls - all generation happens server-side with local data

### Routing Structure

- `/` - Quordle game (default route)
  - Uses `app/page.tsx` with root layout from `app/layout.tsx`
  - Orange/Yellow theme color (#f59e0b)
- `/squares` - Squares game
  - Uses `app/squares/page.tsx` with custom layout in `app/squares/layout.tsx`
  - Blue/Purple theme color (#3b82f6)
  - Independent favicon and metadata
- `/api/wordle-daily` - Cache revalidation endpoint (POST)
- `/robots.ts`, `/sitemap.ts` - SEO configuration

### Configuration Files

- **next.config.ts**: Next.js configuration
  - `typedEnv: true` for type-safe environment variables
  - Images disabled for Cloudflare compatibility
- **open-next.config.ts**: Cloudflare Workers build configuration
  - Enables R2 incremental cache, DO queue, and D1 tag cache
- **wrangler.jsonc**: Cloudflare deployment bindings
  - R2 bucket for static assets
  - Durable Objects for queue management
  - D1 database for tag cache
  - Assets directory binding
- **biome.json**: Code quality configuration
  - Disabled rules: `noArrayIndexKey`, `noSvgWithoutTitle`, `noStaticElementInteractions`, `useExhaustiveDependencies`
  - Auto-organizes imports on save

## Cloudflare Configuration

The app is optimized for Cloudflare Workers/Pages deployment with sophisticated caching:

### Build & Deployment
- **OpenNext**: Uses `@opennextjs/cloudflare` for seamless Next.js → Workers conversion
- **Build Output**: `.open-next/` directory contains Worker bundle and assets
- **Wrangler**: Cloudflare CLI for deployment and bindings management

### Cache Architecture

1. **R2 Incremental Cache** (`NEXT_INC_CACHE_R2_BUCKET`)
   - Stores static assets and cached pages
   - Bucket: `next-bucket`
   - Provides fast CDN-level caching

2. **Durable Objects Queue** (`NEXT_CACHE_DO_QUEUE`)
   - Class: `DOQueueHandler`
   - Manages cache invalidation and regeneration
   - SQLite-backed queue system

3. **D1 Tag Cache** (`NEXT_TAG_CACHE_D1`)
   - Database: `next-quordle`
   - Tracks cache tags for on-demand revalidation
   - Required for API cache revalidation (`/api/wordle-daily`)

4. **Assets Binding**
   - Directory: `.open-next/assets`
   - Binding: `ASSETS`
   - Serves static files directly from Workers

### Development Notes

⚠️ **Durable Objects Limitation**: DO classes don't work in local Next.js dev (`pnpm dev`)
- Use `wrangler pages dev` for local testing of DO features
- Or deploy to preview/production for full functionality

⚠️ **Type Generation**: Run `pnpm cf-typegen` after changes to Cloudflare bindings

## Development Notes

### Package & Tools
- **Package Manager**: pnpm (not npm/yarn/bun)
- **TypeScript**: Strict mode enabled in `tsconfig.json`
- **Code Quality**: Biome (v2.2.4) for linting and formatting
- **Styling**: Tailwind CSS v4 (no config file, uses @import in `app/globals.css`)
- **Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React icon library

### App Router Patterns
- **Server Components** by default (no "use client" directive)
- **Client Components** explicitly marked with "use client"
- Route segments use `page.tsx` files
- Layouts defined in `layout.tsx` files at each level
- Metadata exported directly from page components or layouts

### Environment Management
- **Reproducible Dev**: devenv with flake.nix support
- **Environment Files**: `.env` for local development
- **Typed Env**: Next.js `typedEnv: true` for type-safe access

### Image Handling
- Image optimization **disabled** in `next.config.ts` for Cloudflare compatibility
- Remote images allowed from any HTTPS domain
- Static images served from `/public/` directory

### Key Implementation Details

1. **Game State**: Each game mode maintains independent state (localStorage-based stats)
2. **Daily Puzzles**: Content generated server-side using local wordlists with 24-hour cache via `unstable_cache`
3. **Wordlist System**: Multi-level wordlists (Advanced → Basic → Fallback) with deterministic selection
4. **Sound System**: Singleton Web Audio API manager with user preferences
5. **Theme Support**: Next-themes with `ThemeProvider` wrapper for dark/light mode

### Troubleshooting

**Wordlist Generation Issues**:
- Check server logs for wordlist generation errors (console.log statements in `lib/squares-wordpool.ts`)
- Squares page shows "Loading daily puzzle..." if grid is undefined (defensive check in `SquaresPageClient.tsx`)
- Multi-tier fallback chain: Ultimate DFS → Advanced → Basic → FALLBACK_DATA
- Debug logging enabled in development mode for grid generation attempts
- Check `generateOptimalGrid()` logs to see how many words were found per attempt

**Performance Issues**:
- Cache hits: **< 10ms** (near-instant response)
- Cache misses: **< 100ms** (wordlist generation + grid validation)
- **Performance vs AI System**: Wordlist query is **600x faster** than old AI API (3000ms → 5ms)
- **Vocabulary Size**: 1700+ base words (vs 12 words/day with AI)
- Use `/api/wordle-daily` endpoint to revalidate cache manually
- R2/D1/Durable Objects caching only available in production, not local dev
- **DFS Algorithm**: Grid generation with 50 attempts max, average success rate 70-80%

**Common Errors**:
- "Invalid result from generateDailySquaresUltimate": Grid generation failed, fallback to advanced wordlist
- "No words selected for grid generation": Empty word list, will use fallback grid
- Durable Objects warnings in dev: Expected behavior, DOs only work in production deployment

### Recent Critical Bug Fix - Word Length Filter (2025-11-25)
**File**: `lib/squares-dfs-generator.ts` (lines 558-560)
**Issue**: Despite stratified sampling supporting 3-6 letter words, a downstream filter restricted words to only 4-5 letters
**Root Cause**:
```typescript
// BEFORE (Bug):
const availableWords = squaresData.words.filter(
  (w) => w.length >= 4 && w.length <= 5,  // ❌ Only 4-5 letters
);

// AFTER (Fixed):
const availableWords = squaresData.words.filter(
  (w) => w.length >= 3 && w.length <= 6,  // ✅ 3-6 letters
);
```
**Impact**:
- Before fix: All words were 5 letters only
- After fix: Proper mix of word lengths (e.g., SLY-3, TOMB-4, MONKS-5, RESIN-5)
- Server logs show proper distribution: `{"3":5,"4":15,"5":28,"6":3}`
**Verification**: Check daily puzzle at `/squares` to see word length diversity

### Recent Code Cleanup Tasks (2025-11-25)
- **Removed unused variable**: `_DIRECTIONS` from `squares-dfs-generator.ts`
- **Removed console.log statements** from production code:
  - `squares-dfs-generator.ts`
  - `advanced-wordlist.ts`
  - `wordlist-dictionary.ts`
- **Removed outdated documentation**: `agents.md` (replaced by accurate `CLAUDE.md` and `WORDLIST-UPGRADE.md`)
- **Code formatting**: All files formatted with Biome
- **Build verification**: All TypeScript compilation errors fixed, passes `biome check`

### Type Definitions
- **Cloudflare**: Generated via `wrangler types` → `cloudflare-env.d.ts`
- **App Types**: Custom type definitions in `types/` directory
  - `WordPool.ts`: Types for wordlist-based word pools
  - `WordleMulti.ts`: Types for Quordle game state
