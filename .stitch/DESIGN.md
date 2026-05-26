# Design System: KonquerAI Landing
**Project ID:** 17613846549883618629

## 1. Visual Theme & Atmosphere

**Mood:** Trustworthy, airy, professional, warm. A clean canvas that breathes confidence without corporate coldness. Think: the clarity of a well-organized invoice, the warmth of a conversation between tradespeople. Light, spacious, mobile-first. Zero dark/gaming aesthetics. Zero generic "AI startup" look.

**Density:** Generous whitespace. Sections breathe. Text blocks never feel cramped. The page reads like a calm, well-lit office — not a cluttered desk.

**Philosophy:** "Serious but not intimidating." Every element earns its place. No decoration for decoration's sake. The design should pass the "Manuel test": a 55-year-old painter should feel this was made for someone like him, not for a tech founder.

## 2. Color Palette & Roles

- **Trustworthy Teal** (#00D1B2) — Primary brand color. Used for CTAs, key highlights, active states, the CTA-final gradient band, and trust accents. Conveys modernity + reliability.
- **Action Orange** (#FF8A00) — Secondary accent. Reserved for urgency: pricing callouts, guarantees, "beta fundadores" badges. Never dominant, always deliberate.
- **Pure Canvas** (#FFFFFF) — Primary page background. Maximizes sense of space and cleanliness.
- **Soft Mist** (#F6F8F9) — Alternate section background. Creates gentle rhythm between sections without harsh contrast.
- **Deep Ink** (#0B1F24) — Primary text color. Near-black with a warm teal undertone. Softer than pure black, high readability.
- **Quiet Slate** (#4B5563) — Secondary/body text. Relaxed weight for descriptions, subheads, and supporting copy.
- **Whisper Border** (#E5EAEC) — Borders, dividers, card outlines. Ultra-subtle structural definition.
- **Teal Gradient Band** — CTA final section: linear-gradient from #00D1B2 to #009B89. White text on gradient.

## 3. Typography Rules

- **Headlines (H1–H3):** Outfit — geometric, modern, with the solidity of a well-built structure. Bold (700) for H1, SemiBold (600) for H2–H3. Tight letter-spacing (-0.02em H1, -0.01em H2). Sizes: H1=48px desktop/36px mobile, H2=36px/28px, H3=24px/20px.
- **Body text:** Plus Jakarta Sans — warm, humanist, excellent readability at small sizes. Regular (400) for body, Medium (500) for emphasis. Body large=18px/28lh, Body base=16px/26lh, Body small=14px/22lh.
- **Eyebrow/label:** Plus Jakarta Sans, 13px, SemiBold (600), uppercase, letter-spacing 0.08em, color Teal or Quiet Slate.
- **Button text:** Plus Jakarta Sans, 16px, SemiBold (600).

## 4. Component Stylings

* **Buttons (Primary):** Trustworthy Teal (#00D1B2) background, white text. Gently rounded corners (8px). Min height 52px mobile, 48px desktop. Subtle shadow on hover (0 4px 14px rgba(0,209,178,0.3)). Smooth scale transition on hover (1.02).
* **Buttons (Secondary):** Transparent background, 1.5px Teal border, Teal text. Same roundness. On hover: light teal fill (rgba(0,209,178,0.08)).
* **Buttons (Ghost/Link):** No border, no background. Quiet Slate text with arrow (→). Hover: Teal text with subtle underline.
* **Cards/Containers:** White background on Soft Mist sections (or transparent on white sections). 1px Whisper Border. Gently rounded (12px). No shadow by default. On hover: whisper-soft shadow (0 8px 30px rgba(0,0,0,0.04)).
* **Section dividers:** No visible lines between sections. Rhythm created by alternating white/mist backgrounds.
* **Trust badges:** Inline horizontal strip. Text in Quiet Slate, small (13px). Dot separators (·).
* **FAQ Accordion:** Clean expand/collapse. 1px bottom border per item. Chevron icon rotates smoothly.
* **Pricing card:** Prominent center card with subtle shadow. Orange "Beta Fundadores" badge. Teal CTA button.

## 5. Layout Principles

- **Max width:** 1200px container, centered. Padding: 24px mobile, 32px tablet, 0 desktop (within container).
- **Section vertical spacing:** 96px desktop, 64px mobile between major sections.
- **Grid:** 12-column implicit grid. Most content uses 8-col centered on desktop. 3-column layouts for pillar cards, 2-column for comparatives.
- **Mobile-first:** Stack everything vertically. CTAs full-width. Minimum tap target 48px.
- **Hero:** Occupies 85–95% viewport height. Content left-aligned on desktop with visual right. Full-width stacked on mobile.
- **Imagery:** Lazy-loaded, proper aspect ratios, rounded corners (12px). Real product screenshots preferred; placeholders clearly marked.
