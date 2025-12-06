# AGENTS.md - Working with the Quordle Codebase

This document provides essential information for AI agents working in the Quordle codebase.

## Project Overview

**Quordle Daily** is a Next.js word puzzle game that allows users to solve 4 Wordle-style puzzles simultaneously. The project is deployed on Cloudflare Workers with complex caching infrastructure.

**Key Technologies:**
- Next.js 16 with App Router
- TypeScript (strict mode)
- Cloudflare Workers + OpenNext
- Biome for linting/formatting
- Tailwind CSS v4
- shadcn/ui components with Radix UI

## Essential Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production (Vercel/local)
npm run start        # Start production server
npm run lint         # Run Biome linter
npm run format       # Format code with Biome
```

### Cloudflare Deployment
```bash
npm run build:worker # Build for Cloudflare Workers
npm run preview      # Preview Cloudflare deployment
npm run deploy       # Deploy to Cloudflare Workers
npm run upload       # Upload to Cloudflare
npm run cf-typegen   # Generate Cloudflare type definitions
```

## Code Organization & Structure

### Directory Structure
```
app/                    # Next.js App Router pages
├── layout.tsx         # Root layout with metadata
├── page.tsx           # Home page
├── about/             # Static pages
├── contact/           
├── privacy-policy/
├── terms-of-service/
├── squares/           # Alternative game mode
├── api/               # API routes
│   ├── actions/       # Server actions
│   └── wordle-daily/  # Daily word APIs
├── globals.css        # Global styles
└── loading.tsx        # Loading UI

components/            # React components
├── ui/               # shadcn/ui base components
├── features/         # Feature-specific components
│   ├── wordle-multi/ # Main game components
│   ├── squares/      # Squares game mode
│   ├── celebration/  # Win animations
│   ├── daily-banner/ # Daily challenge UI
│   └── placeholder/  # Loading states
├── animated-entrance.tsx
├── breadcrumbs.tsx
├── site-footer.tsx
├── structured-data.tsx
└── theme-provider.tsx

lib/                   # Business logic & utilities
├── wordle-daily-words.ts     # Daily word generation
├── advanced-wordlist.ts      # Advanced word sources
├── wordlist-dictionary.ts    # Fallback word sources
├── squares-*.ts              # Squares game logic
├── stats.ts                  # Game statistics
├── sound-manager.ts          # Audio management
├── utils.ts                  # Utility functions (cn, etc.)
├── wordle-multi.ts           # Multi-Wordle logic
└── *.ts                      # Other game utilities

types/                 # TypeScript type definitions
├── WordPool.ts        # Daily word types with Zod validation
└── WordleMulti.ts     # Multi-game types

public/               # Static assets
├── icons/            # PWA icons
├── favicon.ico
└── site.webmanifest
```

## Code Patterns & Conventions

### TypeScript & Type Safety
- **Strict mode enabled** - All types must be properly defined
- **Path aliases** - Use `@/*` for imports (e.g., `@/components/ui/button`)
- **Zod validation** - Runtime type validation for data structures
- **Type definitions** - Custom types in `/types` directory

### Component Architecture
- **Server/Client separation** - Use `"use client"` for interactive components
- **Async server components** - Server pages use `async function Page()`
- **Client component pattern** - `Page` component → `PageClient` component
- **Props interface** - Always define TypeScript interfaces for component props

### UI Components (shadcn/ui pattern)
```tsx
// Button component usage
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

<Button variant="default" size="default" className="custom-class" />
```

### Styling Patterns
- **Tailwind CSS v4** - Uses `@import "tailwindcss"`
- **CSS variables** - Comprehensive design system with oklch colors
- **Dark mode** - next-themes with `suppressHydrationWarning`
- **cn() utility** - Merge Tailwind classes: `cn("base-class", condition && "conditional-class")`

### State Management
- **React hooks** - `useState`, `useEffect`, `useTheme`
- **Local storage** - Game statistics persistence
- **No global state** - Components manage their own state

## Configuration Files

### biome.json
- **Linter/Formatter** - Biome replaces ESLint/Prettier
- **Rules** - Recommended Next.js + React rules
- **2-space indentation** - Consistent formatting
- **Some rules disabled** - Accessibility and exhaustive dependencies

### next.config.ts
- **TypeScript errors NOT ignored** - Build fails on type errors
- **Images unoptimized** - For Cloudflare deployment
- **Remote patterns** - Allow HTTPS images from all domains
- **Typed environment** - Experimental typed env support

### wrangler.jsonc & open-next.config.ts
- **Cloudflare Workers** - Serverless deployment
- **R2 storage** - Incremental caching
- **D1 database** - Tag-based cache
- **Durable Objects** - Queue handling

## Business Logic Patterns

### Word Generation System
```typescript
// Three-tier fallback system:
1. Advanced wordlist (primary)
2. Basic wordlist (fallback)  
3. Hardcoded words (emergency)
```

### Daily Word Caching
- **unstable_cache** - Next.js caching for daily words
- **Date-based keys** - Consistent daily puzzles
- **Difficulty levels** - easy/medium/hard word pools

### Game State Management
- **Local persistence** - Statistics stored in localStorage
- **Turn validation** - Strict 5-letter word validation
- **Multi-board logic** - 4 simultaneous Wordle boards

## Important Gotchas & Pitfalls

### Cloudflare Deployment
- **Complex build process** - Requires `build:worker` for Cloudflare
- **Type generation** - Run `cf-typegen` after Cloudflare config changes
- **Environment variables** - Use `NEXT_PUBLIC_*` for client-side access

### TypeScript Strictness
- **Build fails on type errors** - Fix all TypeScript issues before building
- **Unused variables** - Some imports may show as unused but are required (like fonts)
- **Deprecated warnings** - Some icon imports show deprecation warnings

### Performance Considerations
- **Image optimization disabled** - All images served as-is for Cloudflare
- **Bundle size** - Multiple word lists increase bundle size
- **Cache strategy** - Complex caching requires proper cache headers

### Code Quality
- **Biome formatter** - Always run `npm run format` before commits
- **Chinese comments** - Some comments are in Chinese, don't remove
- **Mixed language** - Interface with both English and Chinese comments

## Testing & Quality

### No Test Suite Found
- **No Jest/Vitest** - No automated testing setup detected
- **Manual testing required** - Test features manually after changes
- **Type safety** - Rely on TypeScript strict mode for error prevention

### Linting & Formatting
```bash
npm run lint    # Check for issues
npm run format  # Auto-fix formatting
```
- Biome handles both linting and formatting
- Some accessibility rules are intentionally disabled
- Next.js and React specific rules enabled

## Development Workflow

### Making Changes
1. **Run dev server**: `npm run dev`
2. **Make changes** with TypeScript strict mode
3. **Format code**: `npm run format`
4. **Check linting**: `npm run lint`
5. **Test locally**: `npm run build && npm run start`

### Deployment Process
1. **Build for Cloudflare**: `npm run build:worker`
2. **Preview**: `npm run preview`
3. **Deploy**: `npm run deploy`

### Adding New Features
1. **Create components** in appropriate `components/features/` directory
2. **Add types** to `/types` directory with Zod validation
3. **Update lib/** functions for business logic
4. **Add pages** in `app/` directory
5. **Update metadata** in layout.tsx if needed

## Troubleshooting Common Issues

### Build Errors
- **Type errors** - Fix all TypeScript issues, they block builds
- **Import errors** - Use `@/*` aliases, check file paths
- **CSS errors** - Ensure Tailwind classes are valid

### Runtime Errors
- **Client/server mismatch** - Ensure "use client" on interactive components
- **Theme issues** - Check ThemeProvider setup in layout.tsx
- **Cache problems** - Verify unstable_cache usage in lib functions

### Development Issues
- **Port conflicts** - Next.js runs on :3000 by default
- **Module resolution** - Check tsconfig.json paths configuration
- **Hot reload** - Works automatically in development

## Key Dependencies

### Core Framework
- **next**: ^16.0.7 (App Router)
- **react**: ^19.2.0 & **react-dom**: ^19.2.0
- **typescript**: ^5.9.3

### UI & Styling
- **tailwindcss**: ^4.1.17 (v4)
- **@radix-ui/***: Various components (accordion, dropdown, progress, slot)
- **class-variance-authority**: Component variants
- **clsx** + **tailwind-merge**: ClassName utilities
- **lucide-react**: Icon library

### Cloudflare Integration
- **@opennextjs/cloudflare**: Next.js Cloudflare adapter
- **wrangler**: Cloudflare CLI
- **@cloudflare/workers-types**: TypeScript types

### Validation & Utils
- **zod**: Runtime type validation
- **@biomejs/biome**: Linting and formatting

## Environment Setup

### Required Environment Variables
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000  # App base URL
# Add others as needed for production
```

### Development Dependencies
```bash
npm install          # Install all dependencies
npm run dev         # Start development
```

This codebase is well-structured with modern patterns but requires attention to Cloudflare deployment specifics and TypeScript strictness.