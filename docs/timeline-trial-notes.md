# Timeline Trial — Static vs Interactive

**Milestone 4 evidence.** Trello card: *"Build 'History of AI' timeline
(TRIAL static vs interactive)"*

This supports the Merit criterion:
> *"effectively using information from testing and trialling to improve the
> functionality of the digital technologies outcome."*

This is the second of the project's two component trials. The first was the
[navigation bar](nav-trial-notes.md).

---

## The two options

| | **Option A — Static** | **Option B — Interactive** |
|---|---|---|
| File | `trials/timeline-static.html` | `trials/timeline-interactive.html` |
| Approach | All 14 entries fully visible | Entries collapse to a headline; era filters |
| Page length on arrival | Long | About a third as long |
| Clicks to read everything | 0 | 14 |
| Found by Ctrl + F | Yes | No — collapsed text is `hidden` |
| Printed output | Complete | Headlines only |
| Works with JavaScript off | Yes | No |

---

## ⚠️ You must fill this in yourself

The measurements above are facts about the code and can be stated. **What
readers prefer cannot be.** Ask at least three people.

### Test tasks

Give each tester both versions, in a different order for each person so the
order does not bias the result.

1. *"Find out what happened in 1973."* &mdash; time them on each version.
2. *"Roughly how many major events are on this page?"* &mdash; ask after five
   seconds of looking, before they read properly.
3. *"Read the whole thing."* &mdash; watch for signs of effort or giving up.

Task 2 is the interesting one: Option B makes the *count* obvious but hides
the *content*, and Option A does the reverse.

### Results

| Tester | Task 1 (static) | Task 1 (interactive) | Task 2 accurate? | Preferred | Comment |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

### Observations

*Did anyone not realise entries could be expanded? Did anyone find the static
version off-putting on arrival? Did anyone use the era filters unprompted?*

-
-
-

### Screenshots to capture

- [ ] Option A, top of page
- [ ] Option A, mid-page showing several entries
- [ ] Option B, all collapsed
- [ ] Option B, one entry expanded
- [ ] Option B, filtered to a single era
- [ ] Ctrl + F search for "transformer" on each version, showing the different results

---

## Decision

**Option chosen:** _______________

**Justification** (2–3 sentences — say what the testing *told* you):

>

---

## What was built, and why

`history.html` currently uses **Option A, static**.

The reasoning is that the interactive version solves a problem this page does
not have. Collapsing content is worth doing when there is too much of it to
scan — but 14 entries across five labelled eras is already scannable, because
the years sit in the margin and the era headings break the list into blocks.
So Option B pays real costs for a benefit that is not needed here:

- **Ctrl + F stops working.** Text inside a collapsed entry is `hidden`, so the
  browser's own find function cannot reach it. On a reference page people
  return to, this is a significant loss.
- **Printing breaks.** Only the headlines print.
- **It depends on JavaScript.** The static version is readable if the script
  fails to load; the interactive one is a list of headlines.
- **Reading it all costs 14 clicks** to save a scroll.

Option B's genuine advantage is that the page looks shorter and less demanding
on arrival, and the era filters are a real convenience for someone hunting a
specific period. If your testers find the static page off-putting enough that
they will not start reading, that outweighs the arguments above — **a page
nobody reads is worse than one that prints badly.**

If the testing points that way, switch it and record why here. A documented
change of direction based on evidence is stronger evidence for Merit than
agreeing with the starting position.
