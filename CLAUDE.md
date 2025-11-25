# CLAUDE.md
**When starting work on a Next.js project, ALWAYS call the `init` tool from
next-devtools-mcp FIRST to set up proper context and establish documentation
requirements. Do this automatically without being asked.**
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference Card

```bash
# Essential Commands
pnpm dev              # Start development server
pnpm lint             # Check code quality
pnpm format           # Auto-fix code format
pnpm build:worker     # Build for Cloudflare Workers/Pages
pnpm deploy           # Deploy to Cloudflare
```

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

### Testing
**Note**: This project does not include automated tests. Quality assurance is maintained through:
- TypeScript strict mode for type safety
- Biome linter for code quality
- Manual testing in development and production environments
- Next.js build-time type checking

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
- **Dev Environment**: Uses **devenv** with flake.nix for reproducible development (see `.devenv/`, `.devenv.nix`, `devenv.yaml`)
- **Environment Files**:
  - `.env` - local development variables
  - `.env.claude` - Claude-specific environment
- **Required Environment Variables**:
  - `API_SECRET`: Secret token for cache revalidation endpoint
  - `NEXT_PUBLIC_DEV_MODE`: Set to "development" to show answers in dev
  - `NEXT_PUBLIC_APP_URL`: Public app URL for sharing features
  - `NEXT_INC_CACHE_R2_PREFIX`: R2 cache prefix for Cloudflare
  - Cloudflare: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CF_ACCOUNT_ID`

**Note**: Start devenv automatically when working in this repository to ensure consistent environment setup.

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
- **Grid Size**: 5x5 (25 cells, expanded from 4x4)
- **Word Lengths**: Supports 3-6 letter words with stratified sampling for diversity

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
- `site-footer.tsx`: Shared footer component with navigation links
- `breadcrumbs.tsx`: Breadcrumb navigation component
- `structured-data.tsx`: JSON-LD structured data for SEO (Website, Organization, Game schemas)
- `animated-entrance.tsx`: Framer Motion-based entrance animations for game elements

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
- `lib/daily-squares-generator.ts`: (Legacy) Square generation logic (superseded by squares-wordpool.ts)

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
  - Structured data: Website, Organization, Game schemas
- `/squares` - Squares game
  - Uses `app/squares/page.tsx` with custom layout in `app/squares/layout.tsx`
  - Blue/Purple theme color (#3b82f6)
  - Independent favicon and metadata (squares-favicon.ico, squares-icon-*.png)
  - Separate favicon from root domain
- `/about`, `/contact`, `/privacy-policy`, `/terms-of-service` - Legal/SEO pages
  - Required for AdSense and SEO compliance
  - Linked in site footer
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

### AdSense & SEO Compliance

The project includes comprehensive SEO optimizations for AdSense approval:

- **Required Pages**: All 4 pages implemented (`/about`, `/contact`, `/privacy-policy`, `/terms-of-service`)
- **Structured Data**: JSON-LD schemas for Website, Organization, and Game entities
- **SEO Files**: Custom `robots.ts` and `sitemap.ts` for search engines
- **AdSense Guide**: See `ADSENSE-SETUP.md` for complete implementation details
- **Footer Links**: All legal pages linked in site footer for compliance

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

### Recent Critical Bug Fixes & Changes (2025-11-25)

#### 1. **Word Length Filter Bug** (`lib/squares-dfs-generator.ts:558-560`)
**Issue**: Despite stratified sampling supporting 3-6 letter words, a downstream filter restricted words to only 4-5 letters
```typescript
// BEFORE (Bug): Only 4-5 letters
const availableWords = squaresData.words.filter(
  (w) => w.length >= 4 && w.length <= 5,  // ❌ Only 4-5 letters
);

// AFTER (Fixed): 3-6 letters
const availableWords = squaresData.words.filter(
  (w) => w.length >= 3 && w.length <= 6,  // ✅ 3-6 letters
);
```
**Impact**: Proper word length diversity (e.g., SLY-3, TOMB-4, MONKS-5, RESIN-5)
**Verification**: Check `/squares` to see word length distribution

#### 2. **Code Cleanup & Optimization**
- **Removed**: Unused `_DIRECTIONS` variable from `squares-dfs-generator.ts`
- **Removed**: Console.log statements from production code (`squares-dfs-generator.ts`, `advanced-wordlist.ts`, `wordlist-dictionary.ts`)
- **Removed**: Outdated documentation (`agents.md`)
- **Updated**: All files formatted with Biome v2.2.4
- **Fixed**: All TypeScript compilation errors

#### 3. **AdSense & SEO Enhancements**
- **Added**: Complete legal pages (About, Contact, Privacy Policy, Terms of Service)
- **Added**: Comprehensive structured data (Website, Organization, Game schemas)
- **Added**: Breadcrumb navigation component
- **Added**: Custom site footer with proper links
- **Created**: `ADSENSE-SETUP.md` guide for monetization

### Type Definitions
- **Cloudflare**: Generated via `wrangler types` → `cloudflare-env.d.ts`
  - Command: `pnpm cf-typegen` (after binding changes)
- **App Types**: Custom type definitions in `types/` directory
  - `WordPool.ts`: Types for wordlist-based word pools
  - `WordleMulti.ts`: Types for Quordle game state

### Common Development Tasks

#### Adding a New Component
1. Use shadcn/ui components when possible: `npx shadcn-ui add [component]`
2. Place feature-specific components in `components/features/[feature-name]/`
3. Add to relevant game client component
4. Ensure proper TypeScript types are defined

#### Modifying Wordlists
1. **Basic words**: Edit `lib/wordlist-dictionary.ts` (~1700+ words)
2. **Advanced words**: Edit `lib/advanced-wordlist.ts` (~2000+ words)
3. Add to appropriate difficulty tier
4. Words are selected deterministically by date

#### Deploying to Cloudflare
1. Build: `pnpm build:worker`
2. Preview locally: `pnpm preview`
3. Deploy: `pnpm deploy`
4. Upload artifacts: `pnpm upload`

#### Cache Revalidation
- **Endpoint**: POST `/api/wordle-daily`
- **Auth**: Include API_SECRET in request header
- **Effect**: Regenerates daily words for both games
- **Tags**: Revalidates `daily-word-pool` and `daily-squares-pool`