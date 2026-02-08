# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chemija.org is a chemistry resource website in Lithuanian, built as a monorepo with Astro (frontend) and Sanity CMS (content management). The site features chemistry articles, exam archives, and interactive calculators.

## Stack

- **Astro 5+**: Static site generator (remember to use `---` to start and end Astro blocks)
- **Sanity Studio**: Headless CMS with GROQ API for queries
- **TailwindCSS 4**: Enabled in `astro-app/src/assets/app.css`
- **DaisyUI**: Always prefer DaisyUI classes over raw Tailwind for built-in dark mode support
- **React 19**: Used for calculator components (`.jsx` files)

## Workspace Structure

This is a monorepo with three npm workspaces:

1. **`astro-app/`**: Frontend Astro application
2. **`studio/`**: Sanity Studio for content management

## Common Development Commands

### Root Level

```bash
npm run dev                    # Run both Astro dev server and Sanity Studio concurrently
```

### Astro App (`astro-app/`)

```bash
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run safe:build             # Type check, then build (runs astro check && tsc --noEmit && astro build)
npm run preview                # Preview production build
```

### Sanity Studio (`studio/`)

```bash
npm run dev                    # Start Sanity Studio dev server
npm run build                  # Build Sanity Studio
npm run deploy                 # Deploy Studio to Sanity's hosted service
npm run typegen                # Generate TypeScript types from schemas
```

## Architecture

### URL Structure

- Article detail pages: `/{slug}` (root-level for optimal SEO)
- Article index: `/straipsniai`
- Legacy URLs: `/straipsniai/{slug}` → redirect 301 to `/{slug}`
- Calculators: `/skaiciuotuvas`
- Exams: `/egzaminai`

### Import Aliases

The `@/` alias points to `astro-app/src/`:

```typescript
import { getArticles } from '@/utils/sanity';
```

Always use this alias when working in the `astro-app/` directory.

### Data Flow

1. Content is managed in Sanity Studio (`studio/src/schemaTypes/`)
2. Astro app fetches content via GROQ queries in `astro-app/src/utils/sanity.ts`
3. Generated TypeScript types are in `astro-app/src/types/sanity.types.ts`

### Content Schemas (Sanity)

Located in `studio/src/schemaTypes/`:

- **Documents**: `article`, `category`, `exam`, `questionnaire`
- **Objects**: `blockContent` (rich text), `table`, `youtube` (embeds)

### Key Files

- `astro-app/src/utils/sanity.ts`: All GROQ queries and Sanity data fetching functions
- `astro-app/vercel.json`: Generated file (do not edit manually)

### Calculator Components

- Located in `astro-app/src/components/math/`
- Written in React 19 (`.jsx` files)
- Used on `/skaiciuotuvas` page
- Requires `@astrojs/react` integration

### Rich Text Rendering

- Sanity portable text is rendered using `astro-portabletext`
- Custom components in `astro-app/src/components/blocks/`
- Main component: `PortableText.astro`

## Deployment

- **Platform**: Vercel
- **Analytics**: Vercel Web Analytics enabled
- **Redirects**: Generated automatically from Sanity data (articles with `legacy_urls`)
- **Fallback**: Unmatched paths proxy to `chemija-legacy.netlify.app` for gradual migration

## Environment Variables

Required for Sanity integration:

- `PUBLIC_SANITY_STUDIO_PROJECT_ID`
- `PUBLIC_SANITY_STUDIO_DATASET` (usually "production")
- `SANITY_API_KEY` (for write operations in scripts)

## Sanity MCP Reference

- Before Sanity MCP write operations, read `SANITY_MCP.md` for:
    - Verified project/dataset/workspace values
    - Draft-first update workflow
    - Known MCP behavior and fallback strategy (`patch_document_from_json` for full `body` replacement)
    - Portable Text decorator/list values from studio schema

## TypeScript Configuration

- Strict mode enabled
- ESNext target
- Path alias: `@/*` → `astro-app/src/*`
- JSX: preserve (for Astro)
