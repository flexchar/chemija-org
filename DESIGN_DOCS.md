================================================================================
DESIGN SYSTEM: SCIENTIFIC DATABASE AESTHETIC
A Comprehensive Guide to the Solo-Builder Research Interface Genre
================================================================================

## PREAMBLE

This document codifies a specific design genre: the "developer's research
database" aesthetic. This style emerged from indie hackers and solo builders
who prioritize information architecture over visual polish. The result is
interfaces that feel like personal tools accidentally made public — functional,
information-dense, and earnestly nerdy.

The psychological effect: users perceive the product as trustworthy precisely
because it doesn't try to seduce them. The design communicates "I care about
accuracy, not about impressing you." This anti-marketing stance paradoxically
builds credibility in domains where trust matters (health, finance, research).

Reference touchstones: Notion databases, GitHub's interface, academic paper
formatting, PubMed, old-school web directories, technical documentation,
pharmaceutical data sheets.

================================================================================
PART I: FOUNDATIONAL PRINCIPLES
================================================================================

These five principles govern all decisions. When in doubt, return here.

## PRINCIPLE 1: INFORMATION DENSITY OVER VISUAL COMFORT

The interface should feel like a well-organized filing cabinet, not a magazine
spread. Users come to extract data, not to admire aesthetics. Every pixel
should either display information or create the negative space necessary to
parse that information.

This does not mean "cram everything together." It means: do not add visual
elements that exist purely for decoration. If a border, shadow, gradient, or
illustration does not aid comprehension or navigation, remove it.

Density is achieved through:

- Compact but readable typography
- Multi-column layouts that reduce scrolling
- Tables and grids over isolated hero sections
- Progressive disclosure (show summary, reveal detail on interaction)

The test: if you removed 30% of the visual elements, would the user lose any
information or navigational ability? If not, you have decoration, not design.

## PRINCIPLE 2: TYPOGRAPHY AS THE PRIMARY AESTHETIC LEVER

In this genre, typeface selection and treatment do 60-70% of the aesthetic
work. Color, spacing, and imagery are secondary.

The core move: use a monospace or technical sans-serif font for all interface
elements (navigation, labels, headings, tags, buttons). Reserve a neutral
sans-serif for body text only.

This single decision signals: "This is a technical tool. This is serious.
This is for people who read documentation."

Monospace fonts carry cultural connotations:

- Code and programming
- Terminal interfaces
- Scientific data and lab reports
- Typewritten academic papers
- Database fields and queries

These connotations are the aesthetic. You are borrowing the credibility of
technical contexts and applying it to your interface.

## PRINCIPLE 3: COLOR IS DATA, NOT DECORATION

Color should encode information (categories, status, hierarchy) rather than
create visual interest. The baseline is grayscale. Color appears only when
it communicates something specific.

This constraint forces clarity. When everything is gray except category
indicators, those indicators become immediately scannable. When color is
everywhere, nothing stands out.

The psychological effect: restraint signals rigor. Medical interfaces,
scientific papers, and legal documents use minimal color because
professionalism in these domains means letting content speak.

## PRINCIPLE 4: THE INTERFACE IS A DATABASE VIEW

Conceptualize every page as a query result. Users are not "browsing a website"
— they are "filtering a dataset." This mental model shapes everything:

- Collections are displayed as grids or tables, not carousels
- Filtering and sorting controls are prominent, not hidden
- Items have consistent, structured metadata (type, category, score, date)
- The user feels they are exploring a complete system, not a curated selection

This pattern builds trust through implied comprehensiveness. If you show
"151 compounds" with filter chips, users believe they have access to
everything, not a marketing-selected subset.

## PRINCIPLE 5: EARNEST OVER POLISHED

This aesthetic embraces a specific kind of imperfection. It should feel like
a smart person built it for themselves, then decided to share it. Not rough
or broken — but not agency-polished either.

Markers of earnestness:

- First-person copy ("I researched this" not "Our team analyzed")
- Direct, jargon-comfortable language (assume user sophistication)
- Functional elements that prioritize utility over elegance
- No stock photography, no illustrations except technical diagrams
- Visible structure (borders, dividers) rather than invisible grids

What to avoid:

- Marketing superlatives ("revolutionary," "game-changing")
- Overly smooth animations and transitions
- Perfectly balanced "designed" compositions
- Generic SaaS aesthetic (gradient blobs, 3D illustrations, etc.)

================================================================================
PART II: TYPOGRAPHY SYSTEM
================================================================================

## FONT SELECTION

Primary font (interface): Monospace or technical sans-serif
Recommended: JetBrains Mono, Space Mono, IBM Plex Mono, Fira Code,
SF Mono, Roboto Mono

For a softer technical feel without strict monospace:
Space Grotesk, IBM Plex Sans, DIN, Eurostile, Microgramma

Secondary font (body text): Neutral sans-serif
Recommended: Inter, System UI stack, Helvetica Neue, Arial,
IBM Plex Sans, Source Sans Pro

The body font should be invisible — it should not have personality.
Its job is pure readability.

## TYPOGRAPHIC TREATMENTS

Navigation items:

- Monospace font
- Uppercase (all caps)
- Letter-spacing: 0.05em to 0.1em
- Font weight: 400-500 (regular to medium)
- Size: 12-14px

Page headings:

- Monospace font
- Uppercase
- Letter-spacing: 0.1em to 0.15em
- Font weight: 400-500
- Size: 28-36px
- Often combined with a thin horizontal rule below

Section headings:

- Monospace font
- Uppercase
- Letter-spacing: 0.05em to 0.1em
- Font weight: 500-600
- Size: 14-18px

Card titles:

- Monospace font
- Uppercase
- Letter-spacing: 0.02em to 0.05em
- Font weight: 500-600
- Size: 14-16px

Category tags/labels:

- Monospace font
- Uppercase
- Letter-spacing: 0.05em
- Font weight: 400-500
- Size: 10-12px
- Often paired with subtle background color

Body text:

- Secondary sans-serif font
- Sentence case (normal capitalization)
- Letter-spacing: 0 (default)
- Font weight: 400
- Size: 14-16px
- Line-height: 1.5 to 1.7

Secondary/supporting text:

- Secondary sans-serif font
- Sentence case
- Font weight: 400
- Size: 13-14px
- Color: medium gray (not primary black)

## THE UPPERCASE PRINCIPLE

Uppercase text with wide letter-spacing creates a specific psychological
effect: it feels like a label, classification, or data field name rather
than prose meant to be read linearly.

This treatment says: "This is a category identifier" or "This is metadata."

Use uppercase for:

- Navigation
- Section headers
- Card titles
- Tags and labels
- Button text
- Column headers in tables
- Filter options

Do not use uppercase for:

- Body paragraphs
- Descriptions longer than one line
- Help text
- Error messages with detailed explanation

================================================================================
PART III: COLOR SYSTEM
================================================================================

## BASE PALETTE

Background hierarchy:
Level 0 (page): #FFFFFF (pure white) or #FAFAFA (off-white)
Level 1 (cards): #FFFFFF (white on off-white bg) or #F5F5F5 (gray on white)
Level 2 (inset): #F0F0F0 to #E8E8E8

Text hierarchy:
Primary text: #111111 to #1A1A1A (near-black, not pure black)
Secondary text: #666666 to #717171 (medium gray)
Tertiary text: #999999 to #A3A3A3 (light gray, for captions/metadata)
Disabled text: #CCCCCC to #D4D4D4

Structural elements:
Borders: #E5E5E5 to #EEEEEE (subtle, 1px)
Dividers: #E0E0E0 to #EBEBEB
Hover backgrounds: #F5F5F5 to #FAFAFA

## ACCENT COLORS FOR CATEGORIZATION

Purpose: to enable rapid visual scanning of item types within a collection.

Implementation: thin left border (3-4px) on cards, or small pill/tag
backgrounds. Never large color blocks.

Suggested category palette (adjust hues to your domain):

Category A: #10B981 (emerald/teal green)
Category B: #3B82F6 (clear blue)
Category C: #8B5CF6 (violet/purple)
Category D: #F59E0B (amber/yellow)
Category E: #EF4444 (red)
Category F: #EC4899 (pink)
Category G: #06B6D4 (cyan)
Category H: #84CC16 (lime green)

Rules for accent color usage:

1. Never use accents for large areas (backgrounds, buttons, etc.)
2. One accent color per item — do not combine multiple on one card
3. Maintain consistent mapping (if green = peptide, always green = peptide)
4. Use 20-30% opacity versions for tag backgrounds (not solid)
5. The accent system should be scannable at a glance

## PRIMARY ACTION COLOR

For buttons and interactive elements requiring emphasis:

Primary action: #000000 or #111111 (black)
Primary text: #FFFFFF (white)

Secondary action: #FFFFFF (white) with #000000 border
Secondary text: #000000 (black)

Tertiary action: #3B82F6 (blue) — use sparingly

Black as the primary action color maintains the restrained palette while
providing sufficient contrast. It also carries connotations of seriousness
and professionalism.

## DARK MODE ADAPTATION

Background hierarchy:
Level 0 (page): #0A0A0A to #111111
Level 1 (cards): #161616 to #1A1A1A
Level 2 (inset): #1F1F1F to #252525

Text hierarchy:
Primary text: #E5E5E5 to #EBEBEB (not pure white)
Secondary text: #A3A3A3 to #999999
Tertiary text: #717171 to #666666

Borders: #2A2A2A to #333333

Accent colors: maintain the same hues but ensure sufficient contrast
against dark backgrounds. May need to increase lightness by 5-10%.

================================================================================
PART IV: SPATIAL SYSTEM
================================================================================

## BASE UNIT

All spacing derives from an 8px base unit. This creates consistent rhythm
and simplifies decision-making.

4px - Minimal (inline padding, tight gaps)
8px - Extra small (icon margins, tag padding)
16px - Small (standard element gaps, input padding)
24px - Medium (card padding, section sub-gaps)
32px - Large (between card groups, component margins)
48px - Extra large (major section padding)
64px - 2XL (section separators)
96px - 3XL (page section vertical rhythm)
128px - 4XL (major page breaks)

## COMPONENT SPACING

Cards:
Internal padding: 20-24px
Gap between cards in grid: 16-24px
Margin below card groups: 48-64px

Navigation:
Horizontal gap between items: 24-32px
Vertical padding: 16-20px
Logo to nav items gap: 48px minimum

Page layout:
Max content width: 1200-1400px
Horizontal page padding: 24px (mobile) to 48px (desktop)
Top padding below nav: 48-64px
Between major sections: 96-128px

Forms:
Label to input gap: 8px
Between form fields: 24px
Input internal padding: 12-16px vertical, 16px horizontal

Tags/pills:
Internal padding: 4-6px vertical, 8-12px horizontal
Gap between multiple tags: 8px

Tables/lists:
Row height: 48-56px
Cell padding: 12-16px
Header to body gap: 8-16px

## GRID SYSTEM

Use a 12-column grid for flexibility.

Common layouts:
Full width content: 12 columns
Main + sidebar: 8 + 4 columns (or 9 + 3)
Three-card grid: 4 + 4 + 4 columns
Two-card grid: 6 + 6 columns
Centered content: 2 + 8 + 2 columns (8 center, 2 margin each side)

Card grids:
Desktop (>1200px): 3 columns
Tablet (768-1200px): 2 columns
Mobile (<768px): 1 column

Gutter width: 24px standard, 16px for denser layouts

================================================================================
PART V: COMPONENT SPECIFICATIONS
================================================================================

## NAVIGATION BAR

Structure:

- Fixed to top of viewport
- Full width with max-width content container
- Height: 60-72px
- Bottom border: 1px, light gray

Elements (left to right):

- Logo: small, minimal mark (no wordmark needed if name is in nav)
- Navigation links: monospace, uppercase, regular weight
- Utility items: theme toggle, sign in button (right-aligned)

Logo:

- Size: 32-40px square or similar proportion
- Style: minimal mark, works in single color
- Consider: monogram, simple geometric form, or domain-relevant symbol

Navigation links:

- Monospace, uppercase, 12-14px
- Letter-spacing: 0.05-0.1em
- Color: primary text color
- Hover: underline (simple) or slight color shift
- Active: underline or bolder weight
- Gap between items: 24-32px

Sign in button:

- Style: outlined/bordered (not filled)
- Border: 1px black
- Background: transparent or white
- Text: monospace, uppercase
- Padding: 8-12px vertical, 16-24px horizontal

## BUTTONS

Primary button:

- Background: #000000 (black)
- Text: #FFFFFF (white)
- Font: monospace, uppercase
- Letter-spacing: 0.05em
- Padding: 12-16px vertical, 24-32px horizontal
- Border-radius: 4px (subtle) or 0px (sharp)
- Hover: slight opacity reduction (0.9) or subtle background shift
- Include arrow icon (→) for CTA buttons

Secondary button:

- Background: #FFFFFF (white)
- Border: 1px solid #000000
- Text: #000000 (black)
- Same typography as primary
- Hover: background shifts to light gray or inverts to black/white

Tertiary button (text link style):

- Background: none
- Text: primary text color or blue accent
- Underline on hover
- Used for less prominent actions

Button icons:

- Arrow (→) for navigation/CTA
- Position: right side of text
- Gap between text and icon: 8px
- Icon size: match text size or slightly smaller

## CARDS

Standard card structure:

- Background: white
- Border: 1px solid light gray (#E5E5E5)
- Border-radius: 4-8px (subtle)
- Padding: 20-24px
- Optional: left accent border (4px) for categorization

Card content hierarchy:

1. Category tag(s) — top, small pills
2. Title — monospace, uppercase, larger
3. Description — secondary font, sentence case, gray text
4. Metadata — small, light gray (date, score, etc.)

Card hover state:

- Subtle shadow increase, or
- Border color darkens slightly, or
- Background shifts to off-white
- Avoid dramatic transforms or animations

Card variants:
Compact: reduced padding (16px), smaller title, single line description
Featured: larger title, more padding, optional image/icon
List item: horizontal layout, minimal height, for dense lists

## CATEGORY TAGS / PILLS

Structure:

- Small, inline elements
- Background: accent color at 15-25% opacity
- Text: accent color at full or near-full opacity (darker shade)
- Alternative: white background with accent color border

Typography:

- Monospace font
- Uppercase
- Size: 10-12px
- Letter-spacing: 0.05em
- Font-weight: 500 (medium)

Dimensions:

- Padding: 4-6px vertical, 8-12px horizontal
- Border-radius: 4px (subtle) or 9999px (full pill)

Multiple tags:

- Horizontal arrangement
- Gap: 8px
- Limit to 2-3 tags per item for scannability

## FILTER / CATEGORY CHIPS

For filtering database views — larger, more interactive than tags.

Structure:

- Horizontal row of options
- One or more can be selected
- Clear visual distinction between selected and unselected

Unselected state:

- Background: white or light gray
- Border: 1px solid medium gray
- Text: dark gray

Selected state:

- Background: black
- Border: 1px solid black
- Text: white

Typography:

- Monospace, uppercase
- Size: 12-14px
- Letter-spacing: 0.05em

Dimensions:

- Padding: 8-12px vertical, 16-20px horizontal
- Border-radius: 4px or 9999px (pill)
- Gap between chips: 8-12px

## LEADERBOARD / RANKING LISTS

Purpose: display sorted items with scores or rankings.

Structure:

- Vertical stack of rows
- Each row contains: rank indicator, item info, score visualization

Rank indicator:

- Circular badge with number
- Background: amber/yellow (#F59E0B) or gray for non-top ranks
- Text: black or white, bold
- Size: 32-40px diameter

Item info section:

- Title: monospace, uppercase
- Subtitle/tags: below title, smaller, with category pills
- Aligned left

Score visualization:

- Horizontal bar chart
- Bar color: accent (teal/green works well)
- Numerical score displayed right of bar
- Score font: monospace or tabular figures

Row styling:

- Background: white with subtle border or separator line
- Padding: 16-20px
- Hover: slight background color shift

## TABLES

Use for dense, comparable data.

Header row:

- Background: light gray (#F5F5F5) or white
- Text: monospace, uppercase, smaller size, medium gray
- Bottom border: 1px, slightly darker

Body rows:

- Alternating background optional (white / #FAFAFA)
- Text: secondary font, sentence case
- Border-bottom: 1px light gray

Cell alignment:

- Text: left-aligned
- Numbers: right-aligned
- Actions: right-aligned

Row hover: subtle background color shift

Responsive behavior:

- Horizontal scroll for wide tables
- Or collapse to card layout on mobile

## FORMS AND INPUTS

Text inputs:

- Border: 1px solid #E5E5E5
- Border-radius: 4px
- Background: white
- Padding: 12-16px
- Font: secondary sans-serif
- Placeholder: light gray (#999999)
- Focus state: border color darkens to black or blue

Labels:

- Monospace, uppercase, small (12px)
- Color: dark gray
- Position: above input
- Gap: 8px

Submit buttons:

- Use primary button styling
- Full width or auto width based on context

Error states:

- Border: red accent
- Error message below: small text, red

## SEARCH BAR

Prominent search for database interfaces.

Structure:

- Large input field
- Search icon (magnifying glass) inside, left side
- Optional: filter controls adjacent

Styling:

- Border: 1px solid light gray
- Border-radius: 4-8px
- Height: 48-56px
- Padding-left: 48px (to accommodate icon)
- Placeholder: monospace, "Search compounds..." or similar

Focus state:

- Border darkens
- Optional subtle shadow

================================================================================
PART VI: IMAGERY AND VISUAL ELEMENTS
================================================================================

## DECORATIVE IMAGERY

What to use:

- Technical diagrams (chemical structures, molecular diagrams)
- Simple line illustrations of scientific concepts
- Abstract geometric patterns (minimal use)
- Data visualizations as decoration (charts, graphs, node networks)

What to avoid:

- Stock photography
- Illustrations with human figures
- 3D renders and gradients
- Generic SaaS illustration styles (blobs, abstract shapes)
- Anything that feels "designed" or "agency-produced"

Chemical/molecular structures:

- Line drawing style (2D structural formulas)
- Single color (black or gray)
- Can be used as hero imagery or subtle background elements
- Should feel like they belong in a textbook or research paper

## ICONOGRAPHY

Style:

- Simple line icons
- Consistent stroke width (1.5-2px)
- Rounded or square corners (pick one, be consistent)
- Single color (match text color)

Size:

- Small (inline with text): 16-20px
- Medium (buttons, navigation): 20-24px
- Large (feature highlights): 32-48px

Recommended icon sets:

- Lucide
- Feather Icons
- Heroicons (outline variant)
- Phosphor Icons

Usage:

- Navigation items (optional)
- Category indicators
- Action buttons
- Empty states
- Feature lists

Do not over-use icons. This aesthetic favors text labels over icon-only
interfaces.

## DIVIDERS AND BORDERS

Horizontal rules:

- Thickness: 1px
- Color: light gray (#E5E5E5)
- Often used below page headings
- Margin: 16-24px vertical

Card borders:

- Thickness: 1px
- Color: light gray
- Radius: 4-8px

Accent borders (category indicators):

- Thickness: 3-4px
- Position: left edge of card
- Color: category accent color
- Radius: match card radius on left corners

Dividers in lists:

- Thickness: 1px
- Color: lightest gray (#EEEEEE)
- Full width or indented based on content hierarchy

================================================================================
PART VII: INTERACTION AND MOTION
================================================================================

## GENERAL PHILOSOPHY

Motion should be functional, not decorative. Avoid animations that exist
purely to delight — this aesthetic values efficiency and clarity.

When to use motion:

- Indicating state changes (hover, active, selected)
- Showing/hiding content (collapse, expand, modal)
- Providing feedback (loading, success, error)
- Smooth scrolling (when navigating long pages)

When not to use motion:

- Page transitions
- Elaborate scroll-triggered animations
- Decorative flourishes
- Staggered loading animations for content grids

## HOVER STATES

Cards:

- Subtle shadow increase, or
- Background color shift (white → off-white), or
- Border color darkens
- Transition: 150-200ms ease

Buttons:

- Opacity reduction (0.9), or
- Background color shift
- No scale transforms
- Transition: 100-150ms ease

Links:

- Underline appears on hover, or
- Color shifts to accent
- Transition: 100ms ease

Navigation items:

- Underline slides in, or
- Background highlight
- Transition: 150ms ease

## TRANSITIONS

Duration:

- Instant feedback (button presses): 100ms
- Hover states: 150ms
- Expand/collapse: 200-300ms
- Modal appear/disappear: 200ms
- Page scroll: 300-400ms

Easing:

- Use ease-out for entering elements
- Use ease-in for exiting elements
- Use ease or ease-in-out for state changes

Avoid:

- Bounce effects
- Spring physics
- Delays longer than 50ms
- Durations longer than 400ms

## LOADING STATES

For data loading:

- Simple spinner (line style, not solid)
- Skeleton screens (gray placeholders matching content shape)
- Progress bar for known durations

Style:

- Spinner: thin line, 20-32px, black or gray
- Skeletons: light gray (#E5E5E5), subtle pulse animation
- Progress: thin bar, black or accent color

Avoid:

- Branded loading animations
- Elaborate multi-step loaders
- Anything that draws attention to the wait

================================================================================
PART VIII: COPYWRITING GUIDELINES
================================================================================

## VOICE AND TONE

The copy should sound like a knowledgeable peer sharing their research,
not a company marketing to customers.

Key attributes:

- First-person when appropriate ("I researched...", "I built this...")
- Direct and confident (not hedging with qualifiers)
- Assumes user sophistication (doesn't over-explain basics)
- Jargon-comfortable (uses technical terms without apology)
- Dry humor acceptable (never forced or clever)

Avoid:

- Marketing superlatives ("revolutionary", "game-changing", "best-in-class")
- Corporate speak ("leverage", "synergy", "empower")
- Excessive enthusiasm (too many exclamation points)
- Apologies or self-deprecation
- Gendered language or assumptions

## HEADLINES AND HEADINGS

Style: short, declarative, noun-phrase preferred

Good examples:

- "DATABASE"
- "PROTOCOL OVERVIEW"
- "COMPOUND RANKINGS"
- "LATEST ADDITIONS"

Avoid:

- Questions ("Ready to optimize?")
- Commands ("Start your journey")
- Vague promises ("The future of...")
- Long phrases (keep under 4-5 words)

## BODY COPY

Structure:

- Short paragraphs (2-4 sentences)
- One idea per paragraph
- Active voice preferred
- Concrete over abstract

Sentence length:

- Vary between short and medium
- Avoid long, complex sentences
- If a sentence has multiple clauses, break it up

Technical content:

- Include specific numbers, dosages, durations when relevant
- Cite sources or methodology when making claims
- Acknowledge uncertainty when appropriate ("results vary", "research ongoing")

## MICROCOPY

Buttons:

- Action-oriented verbs
- Uppercase, short (1-3 words)
- Examples: "SEARCH", "SUBSCRIBE", "VIEW ALL", "TRY DOPAI"

Placeholders:

- Helpful hints, not just labels
- Examples: "Search compounds...", "your@email.com"

Empty states:

- Brief explanation
- Suggest next action
- Example: "No results found. Try adjusting your filters."

Error messages:

- State what happened
- State how to fix it
- No blame, no jargon

================================================================================
PART IX: LAYOUT PATTERNS
================================================================================

## HOMEPAGE STRUCTURE

Typical flow:

1. Hero section

    - Large heading (monospace, uppercase)
    - Brief tagline or description
    - Primary CTA button
    - Optional: decorative technical illustration

2. Value proposition

    - One-liner explaining core benefit
    - Emphasize database/research angle

3. Featured content grid

    - Recent additions or popular items
    - 3-column card grid
    - Category tags visible on each card
    - "View all" link

4. Tool/feature highlights

    - If offering AI tools or special features
    - Side-by-side cards explaining each
    - Clear CTAs

5. Newsletter/subscription

    - Simple form: email input + submit
    - Minimal copy about what they'll receive

6. Footer
    - Navigation links
    - Legal links (privacy, terms)
    - Copyright

## DATABASE/CATALOG PAGE

Structure:

1. Search bar (prominent, top)

2. Filter controls

    - Horizontal chip row
    - All, plus category options
    - Item count indicator

3. Results grid

    - Cards with category accent borders
    - Category tags, titles
    - 3 columns desktop, responsive

4. Pagination or infinite scroll

## DETAIL PAGE

Structure:

1. Back navigation (optional breadcrumb)

2. Title section

    - Large heading (compound/item name)
    - Category tags
    - Key metadata

3. Overview/summary

    - Paragraph format
    - Most important information first

4. Detailed sections

    - Subheadings for each aspect
    - Can use subtle section dividers
    - Data tables where appropriate

5. Related items
    - Small grid of related content
    - Links to explore further

## LEADERBOARD PAGE

Structure:

1. Page title and explanation

2. Category filters (horizontal chips)

3. Ranked list

    - Numbered items
    - Score visualization
    - Tags and metadata

4. Optional: methodology note

================================================================================
PART X: IMPLEMENTATION CHECKLIST
================================================================================

Use this checklist to verify adherence to the design system:

TYPOGRAPHY
[ ] Primary interface font is monospace or technical
[ ] Body text uses neutral sans-serif
[ ] Headings are uppercase with letter-spacing
[ ] Tags and labels are uppercase
[ ] No more than 2 font families total

COLOR
[ ] Base palette is grayscale
[ ] Color is used only for categorization or primary actions
[ ] Each category has one assigned accent color
[ ] Accent colors used at low opacity for backgrounds
[ ] Primary buttons are black/white

SPACING
[ ] All spacing values divisible by 8 (or 4 for small gaps)
[ ] Generous whitespace between sections
[ ] Consistent card padding throughout
[ ] Proper hierarchy in spacing (larger gaps = higher hierarchy)

COMPONENTS
[ ] Navigation uses monospace uppercase
[ ] Buttons include arrow icon for CTAs
[ ] Cards have left accent border for categorization
[ ] Tags are small, uppercase pills
[ ] Forms are simple with clear focus states

IMAGERY
[ ] No stock photography
[ ] Technical diagrams used appropriately
[ ] Icons are simple line style
[ ] Decorative elements are minimal

COPY
[ ] Headlines are short and noun-based
[ ] Tone is direct and knowledgeable
[ ] Technical terms used confidently
[ ] No marketing superlatives

INTERACTION
[ ] Hover states are subtle
[ ] Transitions are fast (150-200ms)
[ ] No decorative animations
[ ] Loading states are simple

================================================================================
APPENDIX: QUICK REFERENCE PROMPT
================================================================================

For rapid communication of this aesthetic to AI tools or collaborators:

"Design in the scientific database aesthetic: a solo developer's research
tool made public.

Typography: Monospace for all UI (nav, headings, labels, tags) in uppercase
with wide letter-spacing. Clean sans-serif for body text only.

Color: Grayscale base. Color only for category coding (thin left borders
on cards, small tag backgrounds). Primary buttons are black.

Layout: Database-pattern grids. Filterable collections. Dense but organized.
Cards with left accent borders. Generous section spacing.

Feel: Clinical, earnest, information-first. Like Notion meets PubMed.
No stock photos, no gradients, no marketing polish. Trust through restraint."
