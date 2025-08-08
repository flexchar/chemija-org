## Chemija.org Design Guidelines

A concise record of the UI rules and traits applied during the 2025-08 refresh. The goals: minimalistic, spacious, calm visuals with tasteful motion, appealing to Gen Z while staying professional and readable.

### Stack assumptions

- **Astro 5** with **Tailwind v4** and **DaisyUI v5**.
- Prefer **DaisyUI** components/utilities for built‑in themes and dark mode.
- Use project import aliases (e.g., `@/components/*`).

### Layout & rhythm

- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` for pages.
- **Vertical rhythm**: sections spaced by `mt-16` (homepage), with inner elements using `gap-6` or `py-4/5`.
- **Radii**: large for hero surfaces (`rounded-3xl`), default/medium for cards.
- **Density**: keep plenty of whitespace; avoid crowding multiple accents in one block.

### Typography

- **Headings**: bold, compact leading; e.g., `text-4xl sm:text-6xl font-extrabold` for the hero, `text-3xl sm:text-4xl font-semibold` for section titles.
- **Body**: lower contrast copy using `text-base-content/70` for secondary text.
- **Links in lists/cards**: gain subtle color emphasis on hover; avoid underlines unless needed for affordance.

### Color & theming

- Base surfaces: translucent neutrals for depth without heaviness:
    - Cards: `bg-base-100/60` with `border border-base-200/70`.
    - Lists/rows: same as cards for consistency.
- **Accents**: use primary color sparingly as an accent (borders/labels/hover states). Avoid multi‑hue gradients except in the hero headline.
- **Hover emphasis**: change border tint (`hover:border-primary/40`) and text (`group-hover:text-primary`), not the entire background unless very subtle (`hover:bg-base-200`).

### Motion & interaction

- **Duration**: `transition-all duration-200` (or 300 for hero image scale) with minimal transforms.
- **Hover pattern for cards**: subtle shadow + border tint on hover; no scale by default.
    - Example: `card bg-base-100/60 border border-base-200/70 transition-all hover:border-primary/40 hover:shadow-lg group`.

### Buttons

- Default to neutral **ghost** buttons in lists/cards to reduce color noise:
    - `btn btn-ghost btn-sm hover:bg-base-200 hover:text-primary`.
- Use **primary** buttons for key CTAs (e.g., hero, “Visas archyvas”). Keep sizes consistent (`btn-lg` in hero, `btn-sm` in compact rows).

### Hero (homepage)

- **Surface**: soft gradient container that still reads as neutral: `hero rounded-3xl bg-gradient-to-br from-base-200/90 via-base-200/60 to-transparent border ring`.
- **Headline**: tasteful gradient text: `bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent`.
- **CTAs**: one primary, one ghost.

### Articles (homepage)

- Card list with subtle depth and hover:
    - Container pattern: `card bg-base-100/60 backdrop-blur border border-base-200/70 hover:border-primary/40 shadow-sm hover:shadow-lg`.
    - Meta row uses subdued text: `text-sm text-base-content/60` with optional category `badge badge-outline` and date.
    - Title gains emphasis on hover: `group-hover:text-primary`.

### Exams (homepage)

- Intro callout: minimal neutral card (no rainbow/brand gradient):
    - `card bg-base-100/60 border border-base-200/70`, concise copy in `text-base-content/70`.
- Top 3 exam items: same neutral card pattern as articles, with hover emphasis only on border/shadow/title.
- Per‑exam actions are neutral buttons (ghost) with hover emphasis.

### Component conventions

- `ArticleCard.astro`
    - Hover elevates shadow; title emphasizes on hover.
    - Meta badges/labels are minimal; avoid strong color fills unless the category needs branding.
- `ExamCard.astro`
    - Card: `bg-base-100/60 border-base-200/70` + `hover:border-primary/40 hover:shadow-lg group`.
    - Title: `group-hover:text-primary`.
    - Buttons: `btn btn-ghost btn-sm hover:bg-base-200 hover:text-primary`.
    - Year display normalized to `YYYY` (from `exam.year`).

### Imagery

- SVG illustrations with soft drop shadow: `drop-shadow-xl`.
- Responsive sizing (hero image: `w-56 sm:w-72 lg:w-80`).

### Accessibility & quality

- Maintain sufficient contrast; reserve bright accents for small UI elements.
- Hover should not be the only cue (border and text color change together).
- Reduce motion by default; no aggressive scaling on lists.

### Snippet library

Minimal card with hover border/tint and title emphasis:

```html
<article
    class="card bg-base-100/60 border border-base-200/70 transition-all hover:border-primary/40 hover:shadow-lg group"
>
    <div class="card-body">
        <h3 class="card-title group-hover:text-primary">Title</h3>
        <p class="text-base-content/70">Secondary copy</p>
    </div>
    <!-- optional actions -->
    <div class="card-actions">
        <a class="btn btn-ghost btn-sm hover:bg-base-200 hover:text-primary"
            >Action</a
        >
    </div>
    <!-- ... -->
</article>
```

Primary + ghost CTA pair (hero):

```html
<div class="flex gap-3">
    <a class="btn btn-primary btn-lg">Pirminis</a>
    <a class="btn btn-ghost btn-lg">Antrinis</a>
</div>
```

### Change log (this iteration)

- Homepage hero modernized with spacious layout and gradient headline.
- Articles list converted to minimal cards with hover border/tint and larger titles.
- Exams section simplified: neutral intro callout; top 3 exams use the same minimal card pattern; actions converted to ghost buttons with hover emphasis.
