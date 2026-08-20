# Style Reference — Understanding AI

**Milestone 1 deliverable.** Component type: *Content* — "Logo, colour palette,
and fonts consistent with an AI/tech theme."

> **Revised.** The first version of this site used a dark navy and cyan
> "tech" palette with gradient headings and a grid of icon cards. It was
> replaced because it looked like every other AI website — the design carried
> no information and made no argument. This document describes the
> replacement and the reasoning behind it.

---

## Design direction — editorial / Swiss information design

The reference points are printed explanatory writing: a broadsheet long-read,
a well-set textbook, Edward Tufte's page layouts.

The argument for it: this site is almost entirely prose whose job is to
explain something. It should therefore be built like an object made to be
*read*, not like a product landing page. A secondary benefit is thematic —
a guide arguing that AI is widely misunderstood is more credible when it does
not dress itself in the visual clichés of AI marketing.

Rules that follow:

| Decision | Reasoning |
|---|---|
| Paper ground, not dark mode | Long-form reading is easier on a light background |
| Serif for prose, mono for labels | Serif for the argument, mono for anything that indexes or numbers it |
| Hairline rules, not cards | A numbered index states reading order; equal boxes cannot |
| One accent colour only | An accent that appears everywhere stops being an accent |
| No gradients, shadows or rounded corners | None of them carry information here |
| No icon per heading | Decorative icons add visual noise and no meaning |

---

## Colour palette

| Token | Hex | Used for |
|---|---|---|
| `--paper` | `#FAF9F6` | Page ground |
| `--band` | `#F2EFE7` | Tinted band for set-apart sections and sidenotes |
| `--ink` | `#16150F` | Body text, headings, rules |
| `--ink-2` | `#55524A` | Secondary text, standfirsts |
| `--ink-3` | `#6E6A60` | Labels, metadata, captions |
| `--accent` | `#9C3418` | Oxide red — section numbers, links in prose, active nav |
| `--rule` | `#DDD9CF` | Hairline dividers |
| `--rule-mid` | `#C4BFB2` | Slightly stronger dividers |

The accent is the red of printers' ink rather than of software. It appears
only on section numbers, prose links, and the current nav item — never as a
background fill or decoration.

### Contrast verification (WCAG 2.1)

Checked **before** any page was built. AA requires 4.5:1 for normal text and
3:1 for large text; AAA requires 7:1.

| Pairing | Ratio | AA | AAA |
|---|---|---|---|
| Ink on paper | **17.37:1** | Pass | Pass |
| Secondary ink on paper | **7.41:1** | Pass | Pass |
| Tertiary ink on paper | **5.12:1** | Pass | — |
| Tertiary ink on band | **4.69:1** | Pass | — |
| Accent on paper | **6.84:1** | Pass | — |
| Accent on band | **6.26:1** | Pass | — |
| Paper on ink (skip link) | **17.37:1** | Pass | Pass |
| Paper on accent | **6.84:1** | Pass | — |

Every pairing meets AA.

> **This check caught a real failure.** The tertiary grey was first chosen by
> eye as `#8A867C`, which measures **3.45:1** and fails AA outright. It was
> darkened to `#6E6A60` before a single page was written. Finding this in
> Milestone 6 instead would have meant restyling every page.

Re-run the check with:

```bash
python3 docs/check-contrast.py
```

Screenshot that output as evidence for Milestone 6, Test 2 of 4.

---

## Typography

| Role | Typeface | Why |
|---|---|---|
| Headings and prose | **Newsreader** | A screen-first editorial serif with a genuine italic. Reads well at length and gives the site a printed character. |
| Labels, numbers, navigation, metadata | **IBM Plex Mono** | Fixed-width for anything that indexes, numbers or labels. Creates a clear split between *the argument* and *the apparatus around it*. |

Two families, each with one job. Both fall back to a system stack, so the site
still renders sensibly with no network — relevant to the Milestone 6
cross-browser test.

- Headings use `clamp()` so type scales smoothly rather than jumping at breakpoints.
- The measure is capped at `34rem` (≈65 characters), the comfortable range for reading.
- `text-wrap: pretty` on paragraphs and `balance` on headings prevent orphans.

---

## Logo / wordmark

There is no pictorial logo. The wordmark is the site name set in letterspaced
mono capitals.

This is deliberate. The previous version used a hand-drawn "neural network"
SVG — three dots and some connecting lines — which is the single most generic
possible mark for an AI project. A typographic wordmark is honest about what
the site is, needs no image file, stays sharp at any size, and cannot be
mistaken for a stock icon.

---

## Layout

A two-column editorial grid (`.spread`): a narrow margin column for labels and
section numbers, and a wide column for content. The margin column is what makes
the layout read as a document rather than a web page. It collapses to a single
column below 800px.

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
