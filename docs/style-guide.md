# Style Reference — Understanding AI

**Milestone 1 deliverable.** Component type: *Content* — "Logo, colour palette,
and fonts consistent with an AI/tech theme."

> **Revised.** The first version of this site used a dark navy and cyan
> "tech" palette with gradient headings and a grid of icon cards. It was
> replaced because it looked like every other AI website — the design carried
> no information and made no argument. This document describes the
> replacement and the reasoning behind it.

---

## Design direction: clean modern reading UI

> **Second revision.** The editorial version (paper ground, serif prose, oxide
> red accent, hairline rules) was replaced with a modern interface built for
> reading on screens. The content, page structure, URLs and navigation labels
> are unchanged.

The site is mostly explanatory prose for students, so the interface has to
disappear into the reading while still feeling designed. The language is a
cool neutral ground, one emerald accent, a single sans family with a mono
companion, soft corners, and photographs used as real content.

| Decision | Reasoning |
|---|---|
| Light and dark both designed | Follows the visitor's system setting; every pairing verified in both |
| One sans family (Geist) + Geist Mono for numbers | Fewer faces, clearer hierarchy; mono marks years and section numbers |
| One accent (emerald) | Marks links, state and the primary action only |
| One shape system | 20px for media and large surfaces, 12px for small ones, full pill for anything you press |
| Bento contents instead of a text list | Four cells for four sections; two photographs, one tint, one inverted |
| Sticky label rail on long pages | Keeps the reader oriented; replaces the old decorative margin labels |
| Motion with a job | Load-in hierarchy, hover and press feedback, reading-progress bar. Nothing loops. All of it stops under `prefers-reduced-motion` |

---

## Colour palette

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#F5F6F7` | `#0D0F11` | Page ground |
| `--surface` | `#FBFBFC` | `#14171A` | Raised surfaces |
| `--surface-2` | `#ECEEF0` | `#1B1F23` | Tinted surfaces, asides |
| `--ink` | `#101214` | `#ECEEEF` | Body text, headings |
| `--ink-2` | `#43494F` | `#B4BAC0` | Secondary text |
| `--ink-3` | `#5B636B` | `#8D959D` | Metadata, captions |
| `--accent` | `#0B7A55` | `#4FD6A3` | Links, active nav, primary button |
| `--accent-soft` | `#DDF0E8` | `#12261F` | Quiet accent surfaces |

### Contrast verification (WCAG 2.1)

Every text pairing in both modes meets AA (4.5:1). Re-run the check with:

```bash
python3 docs/check-contrast.py
```

Screenshot that output as evidence for Milestone 6, Test 2 of 4.

---

## Typography

| Role | Typeface | Why |
|---|---|---|
| Headings and prose | **Geist** (variable) | A clean screen-first sans that stays legible at small sizes and holds up at display sizes with tight tracking |
| Numbers, years, section numbers | **Geist Mono** (variable) | Fixed-width for anything that indexes |

Both are **self-hosted** in `/fonts` rather than loaded from Google Fonts, so
no visitor's IP address is sent to a third party and the typography works
offline. Latin and Latin Extended subsets only; Latin Extended carries the
macron vowels used in te reo Maori. Both are SIL Open Font License 1.1; the
licence files sit beside the fonts.

- The measure is capped at `40rem` (about 65 characters).
- `text-wrap: pretty` on paragraphs and `balance` on headings prevent orphans.

---

## Logo / wordmark

There is no pictorial logo. The wordmark is the site name set in semibold Geist.

This is deliberate. The previous version used a hand-drawn "neural network"
SVG — three dots and some connecting lines — which is the single most generic
possible mark for an AI project. A typographic wordmark is honest about what
the site is, needs no image file, stays sharp at any size, and cannot be
mistaken for a stock icon.

---

## Layout

Long pages use a two-column grid (`.spread`): a sticky label rail and a wide
content column, collapsing to one column below 800px. The homepage uses an
asymmetric split hero and a four-cell bento. The gallery uses a six-column
grid for rhythm. The header is sticky, one line at desktop, and collapses to a
labelled Menu button below 960px.

---

## Accessibility decisions built in from the start

Record these in the Milestone 6 implications write-up:

- **Contrast verified before building**, not audited afterwards.
- **Skip link** as the first focusable element.
- **Visible focus ring** on every interactive element; never removed.
- **`aria-current="page"`** on the active nav link — the current page is not
  signalled by colour alone.
- **`aria-expanded`** kept in sync on the menu toggle; Escape closes the menu
  and returns focus to the button.
- **Menu button labelled with a word**, not a `☰` glyph, which is clearer to
  screen readers and to anyone unfamiliar with the convention.
- **`prefers-reduced-motion`** respected.
- **Table captions** provided via a visually-hidden class.
- **Print stylesheet**, so the guide can be read on paper.
