# AGENTS.md

This is the single source of truth for coding-agent guidance in this repository.
`CLAUDE.md` and `.cursorrules` are compatibility symlinks to this file.

## Project Overview

Chemija.org is a chemistry resource website in Lithuanian, built as a monorepo with Astro (frontend) and Sanity CMS (content management). The site features chemistry articles, exam archives, and interactive calculators.

## Stack

- **Astro 5+**: Static site generator (remember to use `---` to start and end Astro blocks)
- **Sanity Studio**: Headless CMS with GROQ API for queries
- **TailwindCSS 4**: Enabled in `astro-app/src/assets/app.css`
- **Styling**: Raw Tailwind utilities are the styling approach for new UI, following `DESIGN_DOCS.md`. DaisyUI remains installed and load-bearing in the calculator components, pagination, table and link blocks (~160 class usages) until those are migrated. Dark mode is deliberately disabled for now.
- **DaisyUI**: Legacy, still load-bearing. The five calculator components, the article pagination, and the portable-text table/link blocks depend on DaisyUI classes (`btn`, `input input-bordered`, `alert`, `label-text`, `table-zebra`, `link-primary`). Do not add new DaisyUI classes; do not remove the plugin without restyling those files first.
- **React 19**: Used for calculator components (`.jsx` files)
- **Bun**: Preferred package manager and runtime for all repository scripts. `bunfig.toml` at the repo root sets `minimumReleaseAge = 172800`, so `bun install` refuses packages published less than 2 days ago (supply-chain guard).

## Workspace Structure

This is a monorepo with two npm workspaces:

1. **`astro-app/`**: Frontend Astro application
2. **`studio/`**: Sanity Studio for content management

## Common Development Commands

### Root Level

```bash
bun run dev                    # Run both Astro dev server and Sanity Studio concurrently
```

### Astro App (`astro-app/`)

```bash
bun run dev                    # Start dev server
bun run build                  # Build for production
bun run safe:build             # Type check, then build (runs astro check && tsc --noEmit && astro build)
bun run preview                # Preview production build
```

### Sanity Studio (`studio/`)

```bash
bun run dev                    # Start Sanity Studio dev server
bun run build                  # Build Sanity Studio
bun run deploy                 # Deploy Studio to Sanity's hosted service
bun run typegen                # Generate TypeScript types from schemas
```

## Architecture

### Site Structure

- **Home page**: Navigation, latest articles, and latest chemistry exams
- **Articles page**: A statically rendered, paginated index whose cards show the title, excerpt, view count, and category hashtag
- **Article detail page**: Rich-content rendering
- **Exams page (`/egzaminai`)**: A five-column table of question and answer PDFs with downloads
- **Calculator page (`/skaiciuotuvas`)**: Interactive chemistry calculation tools

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

Use `.env.1pass` as the unresolved 1Password template and materialize the local, gitignored
`.env` file when its secrets change:

```bash
op inject -i .env.1pass -o .env --force
```

Bun automatically loads `.env`. Prefer `bun <script>` and Bun APIs for future scripts; do not
add Node-specific environment-loading wrappers.

## Sanity MCP Reference

- Before Sanity MCP write operations, read `SANITY_MCP.md` for:
    - Verified project/dataset/workspace values
    - Draft-first update workflow
    - Known MCP behavior and fallback strategy (`patch_document_from_json` for full `body` replacement)
    - Portable Text decorator/list values from studio schema

## Exam Data Provenance

`question-bank/extracted/<year>/REPORT.md` is the SOURCE OF TRUTH for every claim about exam PDFs:
which questions pair with which answer key, SHA-256 per file, page counts, and distributed
question-to-rubric spot checks. Notes on each Sanity `exam` document carry the same hashes and the
originating NSA URLs.

**Never restate a REPORT's conclusion anywhere else - link to it.** A restated claim rots silently:
a "2026 exam is mispaired and does not render" note lived in the business status doc for seven weeks
while the 2026 REPORT sat in this repo already classifying both pairs as verified. Re-verified
2026-09-01: the Sanity CDN bytes still hash-match the REPORT exactly, and all 65 exams render.

Two different things are both called "I dalis" - read carefully before believing a pairing bug:

- The published `VBE II dalies uzduotis` paper contains its OWN internal `I dalis` (20 x 1 pt) and
  `II dalis` (4 questions, 40 pt) sections, 60 pt total, covered by ONE scoring key. This is the
  paper the site archives. It is complete.
- `VBE I` is a SEPARATE grade-11 exam, and it IS published - just not as a PDF. Per the official
  exam description (https://www.nsa.smsm.lt/wp-content/uploads/2024/11/CHEM.pdf) its `Forma` is
  `Elektronine`, 40 pts, 90 min, centrally auto-scored, so no booklet ever existed. The papers live
  in NSA's Uzduociu bankas as QTI, open without registration only since 2026-08-28:
  `smp.emokykla.lt/qti/player/store/data/collection/hash.<hash>` returns the full paper as JSON
  (verified 2026-09-01: 2026 pagrindine = 40 items `I_01`..`I_40`, and 2026 pakartotine `I_01`
  matches the `1. Krekingas` line in the key we already hold). The questions are ALSO embedded in
  the `rezultatu-analizes` statistics PDFs, but as raster images - `pdftotext` shows nothing, use
  `pdfimages -png`. The 2025 analysis PDF stars the correct option, so it doubles as a key.
  None of this fits the `exam` schema's two file fields; do not force it in without a decision.

To re-verify a year: fetch `questions.asset->url` / `answers.asset->url` from Sanity, `shasum -a 256`
them against the REPORT, and check each PDF's own page-1 header declares the expected year, session
and part. That check takes a minute and settles these reports for good.

## TypeScript Configuration

- Strict mode enabled
- ESNext target
- Path alias: `@/*` → `astro-app/src/*`
- JSX: preserve (for Astro)

## Development Priorities

Completed foundations:

- [x] Create the enhanced article and exam Sanity schemas
- [x] Add Sanity content-fetching utilities and content types
- [x] Create the navigation menu component
- [x] Implement the home page layout

Remaining roadmap items:

- [ ] Implement an API route for updating view counts
- [ ] Add SEO metadata
- [ ] Add appropriate error pages (404 and 500)

## Technical Considerations

- Prefer static generation where possible for performance.
- Keep Sanity schema design, PDF handling, and rich-content rendering in mind when changing content flows.
