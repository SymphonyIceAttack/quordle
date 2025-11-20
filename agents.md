# Project Architecture & Agents

This document outlines the system architecture, AI agents, and core modules that power the Quordle & Squares Daily application.

## 1. Core System
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **AI Integration**: Vercel AI SDK
- **State Management**: React Hooks + LocalStorage (Persistence)

## 2. Content Generation Agents (Server-Side)
These "agents" are responsible for creating fresh daily content using AI.

### A. Quordle Generator
- **Source**: `lib/ai-wordpool.ts`
- **Role**: Generates the daily puzzle for the Quordle game mode.
- **Logic**:
  - Prompts the AI to generate 4 distinct, common 5-letter English words.
  - Injects the current date into the prompt to ensure daily variety.
  - **Caching**: Uses `unstable_cache` with a 24-hour lifetime (Tag: `daily-word-pool`).
  - **Fallback**: Provides a static set of words if generation fails.

### B. Squares Generator
- **Source**: `lib/squares-wordpool.ts`
- **Role**: Generates the daily 4x4 grid and word list for the Squares game mode.
- **Logic**:
  - Prompts the AI to create a 4x4 letter grid and a list of hidden words.
  - **Validation**: Implements a Depth-First Search (DFS) algorithm (`canFindWord`) to strictly verify that every generated word can physically be formed on the grid.
  - **Deduplication**: Ensures no duplicate words exist in the final puzzle.
  - **Caching**: Uses `unstable_cache` with a 24-hour lifetime (Tag: `daily-squares-pool`).

### C. Orchestrator (Cron/API)
- **Source**: `app/api/wordle-daily/route.ts`
- **Role**: Manages the lifecycle of daily content.
- **Function**:
  - Accepts secure POST requests (Token protected).
  - Triggers `revalidateTag` for both `daily-word-pool` and `daily-squares-pool`.
  - Forces a regeneration of both puzzles simultaneously.

## 3. Game Logic Modules (Client-Side)
These modules handle the interactive gameplay experience.

### A. Quordle Engine
- **Component**: `components/features/wordle-multi/WordleMultiGame.tsx`
- **Features**:
  - Manages 4 simultaneous Wordle boards.
  - Handles keyboard input, letter state (correct, present, absent), and win/loss conditions.
  - **Developer Mode**: Shows answers when `NEXT_PUBLIC_DEV_MODE=development`.

### B. Squares Engine
- **Component**: `components/features/squares/SquaresGame.tsx`
- **Features**:
  - Renders interactive 4x4 grid with drag-to-select and touch gesture support.
  - **Visuals**: Draws SVG connection lines between selected tiles.
  - **Sorting**: Toggles word list between "By Order" and "By Length".
  - **Tools**: Includes Smart Hint system and Share functionality.
  - **Progress**: Tracks "Words Found" vs "Total Words".

### C. Statistics Manager
- **Source**: `lib/stats.ts`
- **Role**: Persists user progress.
- **Storage**: Uses `localStorage` to save:
  - Games played/won.
  - Current/Max streaks.
  - Guess distribution charts.

## 4. Routing & Navigation
- **Home (`/`)**: Hosts the Quordle game.
- **Squares (`/squares`)**: Hosts the Squares game.
- **Shared Layout**: Both pages share a responsive layout, theme provider, and navigation elements.
