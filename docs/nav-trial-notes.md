# Navigation Bar Trial — Option A vs Option B

**Milestone 2 evidence.** Trello card: *"Build navigation bar (TRIAL 2 OPTIONS)"*

This supports the Merit criterion:
> *"effectively trialling multiple components and/or techniques"* and selecting
> those which are most suitable.

---

## The two options

| | **Option A** | **Option B** |
|---|---|---|
| File | `trials/nav-option-a.html` | `trials/nav-option-b.html` |
| Approach | Full link row — all 7 links always visible | Collapsed menu — links hidden behind a "Menu" button |
| Clicks to any page | 1 | 2 (open menu, then click) |
| Header height on mobile | Grows / wraps | Stays fixed |
| Site structure visible on arrival? | Yes | No |

Open both side by side, and resize each one from desktop width down to phone
width before deciding.

Note: the toggle is labelled with the word **Menu** rather than a `☰` icon.
It is the same disclosure pattern; the label is clearer for screen-reader users
and for anyone who does not recognise the three-line convention.

---

## ⚠️ You must fill this in yourself

Everything below needs **real feedback from real people**. This cannot be
invented — made-up testing evidence is not valid for the standard, and a marker
can usually tell. Ask at least **three** people in your target audience.

### Test task

Give each tester the same instruction, on each option:

> *"Find the page about the history of AI."*

Time them, and note any hesitation.

### Results

| Tester | Option A time | Option B time | Preferred | Comment |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Observations

*What did you notice while watching them? Did anyone miss the Menu button? Did
anyone comment on the header looking crowded in Option A?*

-
-
-

### Screenshots to capture

- [ ] Option A at desktop width
- [ ] Option A at phone width (~375px)
- [ ] Option B at desktop width, menu closed
- [ ] Option B at desktop width, menu open
- [ ] Option B at phone width

---

## Decision

**Option chosen:** _______________

**Justification** (2–3 sentences — say what the testing *told* you, not just
which one you liked):

>

---

## What was actually built, and why

The live site currently uses a **hybrid**: the full link row (Option A) on
screens wider than 860px, collapsing to the menu toggle (Option B) below that.

The reasoning: Option A's weakness is only ever a *narrow screen* problem, and
Option B's weakness — hiding the site's structure — only really costs you on a
*wide screen* where there was room to show it anyway. Each option fails exactly
where the other succeeds, so using each at the width where it is stronger keeps
both benefits.

If your user testing disagrees with this, **change it** — and say so here. A
documented change of direction based on testing evidence is worth more marks
than agreeing with the starting point, because it directly demonstrates
*"using information from testing and trialling to improve the functionality."*
