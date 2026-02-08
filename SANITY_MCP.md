# SANITY MCP Notes

Quick reference for working with Chemija.org content through Sanity MCP.

## Known Project Settings

- Project ID: `lv5ajubm`
- Dataset: `production`
- Workspace name for schema-aware MCP calls: `chemija-org-studio`

## Supported Schema Types (Source of Truth)

Schema registry file: `studio/src/schemaTypes/index.ts`

### Document Types

#### `article` (`studio/src/schemaTypes/documents/article.ts`)

- `title`: `string`
- `slug`: `slug` (source: `title`, `maxLength: 96`)
- `mainImage`: `image` (`hotspot: true`)
- `body`: `blockContent`
- `categories`: `array` of `reference` -> `category`
- `legacy_urls`: `array` of `string`
- `views`: `number` (`readOnly: true`)

Preview selection:

- `title`: `title`
- `media`: `mainImage`

#### `category` (`studio/src/schemaTypes/documents/category.ts`)

- `title`: `string`
- `slug`: `slug` (source: `title`, `maxLength: 96`)
- `description`: `text`

#### `exam` (`studio/src/schemaTypes/documents/exam.ts`)

- `year`: `date` (format: `YYYY`)
- `level`: `string` (radio list: `Valstybinis`, `Mokyklinis`)
- `session`: `string` (radio list: `Pagrindinė sesija`, `Pakartotinė sesija`, `Pavyzdinė užduotis`)
- `answers`: `file`
- `questions`: `file`
- `notes`: `string`

Orderings:

- `yearDesc`: by `year desc`

Preview title format:

- `${year} ${VBE|MBE} ${first session word}`

#### `questionnaire` (`studio/src/schemaTypes/documents/questionnaire.ts`)

- `category`: `string`
- `question`: `text` (`rows: 2`)
- `answer`: `text` (`rows: 2`)
- `points`: `number`

Preview:

- `title`: `question`
- `subtitle`: `category`

### Object Types

#### `blockContent` (`studio/src/schemaTypes/objects/blockContent.tsx`)

Array members:

- `block`
- `image` (`hotspot: true`)
- `youtube`
- `table`

Block styles:

- `normal`, `h1`, `h2`, `h3`, `h4`, `blockquote`

Block list types:

- `bullet`, `number`

Decorators:

- `strong`, `em`, `code`, `underline`, `strike-through`, `sub`, `sup`

Annotations:

- `link` object with `href: url`

#### `youtube` (`studio/src/schemaTypes/objects/youtube.ts`)

- `url`: `url`

#### `table` (`studio/src/schemaTypes/objects/table.ts`)

- `rows`: `array` of `row`
- `row.cells`: `array` of `text`

## What Worked Well

- Retrieve top articles by views:
    - GROQ: `*[_type == "article"] | order(views desc) [0...10] {title, "slug": slug.current, views}`
- Fetch one article by slug:
    - GROQ: `*[_type == "article" && slug.current == "oksidacijos-laipsnis"][0]`
- Rewrite content safely into draft:
    - Use `sanity_patch_document_from_json` with `set: [{path: "body", value: [...] }]`
    - This creates/updates `drafts.<id>` and keeps the published document unchanged.

## Important Lessons

- If MCP returns schema errors, first resolve workspace name:
    - Run `sanity_list_workspace_schemas`
    - Pass `workspaceName: "chemija-org-studio"` in schema-aware operations.
- `sanity_patch_document_from_markdown` may merge/append in some cases on existing rich content.
    - For full body replacement, prefer `sanity_patch_document_from_json` and set `body` directly.
- If a draft becomes messy, discard it cleanly:
    - `sanity_discard_drafts` with published ID (for example `imported-article-47`).

## Article Rewrite Workflow (Recommended)

1. Query article by slug and get `_id`
2. Draft improved content (same reading level, cleaner structure)
3. Prepare COMPLETE body structure in advance
4. Replace `body` via ONE `patch_document_from_json` call with full array
5. Verify draft with GROQ (block count, headings, key text checks)
6. Publish only after human review/approval

Critical: Use ONE patch operation for complete body rewrites. Incremental patching creates empty blocks and missing text spans.

Rules:

- Update content to 6th grade Lithuanian level for pupils education
- Add proper chemical/mathematical formatting using schema (not unicode symbols)
- Improve structure and readability
- Convert YouTube links to HTTPS format
- Remove numbering (01., 25., etc.) from article title if exists

## Portable Text Notes for This Studio

- Rich text schema: `studio/src/schemaTypes/objects/blockContent.tsx`
- Supported decorators include:
    - `strong`, `em`, `code`, `underline`, `strike-through`
    - `sub` (subscript), `sup` (superscript)
- Supported block list types:
    - `bullet`, `number`

## Safety Rules

- Prefer draft updates first; do not publish automatically.
- Keep structure clean: remove empty blocks, broken characters, malformed list fragments.
- Preserve article metadata (`title`, `slug`, `categories`, `mainImage`, `legacy_urls`) unless explicitly asked to change.
