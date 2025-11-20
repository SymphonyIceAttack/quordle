# Cloudflare Deployment Guide

## Prerequisites

1. Cloudflare account
2. Wrangler CLI installed: `npm install -g wrangler`
3. KV namespace created for puzzle caching

## Setup Steps

### 1. Create KV Namespace

\`\`\`bash
# Create production KV namespace
wrangler kv:namespace create "PUZZLE_CACHE"

# Create preview KV namespace for development
wrangler kv:namespace create "PUZZLE_CACHE" --preview
\`\`\`

Copy the namespace IDs and update `wrangler.toml`.

### 2. Set Environment Secrets

\`\`\`bash
# Set your DeepSeek API key
wrangler secret put DEEPSEEK_API_KEY

# If using other services, set their keys too
wrangler secret put XAI_API_KEY
wrangler secret put GROQ_API_KEY
\`\`\`

### 3. Update Import Paths

To use Cloudflare-compatible cache, update your imports:

**Option A: Conditional Imports (Recommended)**

Create `lib/ai-wordpool.ts`:
\`\`\`typescript
// Auto-detect environment and use appropriate implementation
export * from process.env.CF_PAGES 
  ? './ai-wordpool.cloudflare' 
  : './ai-wordpool'
\`\`\`

**Option B: Build-time replacement**

In `next.config.mjs`:
\`\`\`javascript
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (process.env.CF_PAGES) {
      config.resolve.alias['@/lib/ai-wordpool'] = '@/lib/ai-wordpool.cloudflare'
      config.resolve.alias['@/lib/squares-wordpool'] = '@/lib/squares-wordpool.cloudflare'
    }
    return config
  },
}
\`\`\`

### 4. Build and Deploy

\`\`\`bash
# Install dependencies
npm install

# Build for Cloudflare Pages
npm run build

# Deploy to Cloudflare Pages
npx @cloudflare/next-on-pages

# Or use Wrangler
wrangler pages deploy .vercel/output/static
\`\`\`

### 5. Configure Cloudflare Pages

1. Go to your Cloudflare dashboard
2. Navigate to Workers & Pages
3. Create a new Pages project
4. Connect to your Git repository
5. Set build command: `npx @cloudflare/next-on-pages`
6. Set build output: `.vercel/output/static`
7. Add KV binding: `PUZZLE_CACHE` → (your KV namespace)

## Cache Strategy on Cloudflare

### How it works:

1. **KV Storage**: Puzzles are cached in Cloudflare KV with 24-hour TTL
2. **Edge Caching**: Cloudflare's edge network caches responses globally
3. **Daily Rotation**: Cache keys include the date, auto-rotating at midnight UTC

### Manual Cache Invalidation:

\`\`\`bash
# Clear specific puzzle cache
wrangler kv:key delete --binding=PUZZLE_CACHE "daily-word-pool:2024-01-15"
wrangler kv:key delete --binding=PUZZLE_CACHE "daily-squares-puzzle:2024-01-15"

# Or via API endpoint
curl -X POST https://your-domain.pages.dev/api/wordle-daily
\`\`\`

## Performance Optimization

1. **Edge Caching**: Enable on Cloudflare dashboard
2. **Cache Rules**: Create page rule for `/*` with:
   - Browser Cache TTL: 4 hours
   - Edge Cache TTL: 2 hours
3. **Compress**: Enable Brotli compression

## Monitoring

Check KV usage:
\`\`\`bash
wrangler kv:key list --binding=PUZZLE_CACHE
\`\`\`

View worker logs:
\`\`\`bash
wrangler tail
\`\`\`

## Troubleshooting

**Issue**: KV not available in development
- **Solution**: Use `wrangler pages dev` instead of `next dev`

**Issue**: Cache not working
- **Solution**: Verify KV binding name matches `PUZZLE_CACHE` in code

**Issue**: API limits
- **Solution**: Implement rate limiting or upgrade Cloudflare plan
