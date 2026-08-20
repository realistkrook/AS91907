#!/usr/bin/env python3
"""
WCAG 2.1 contrast checker for the Understanding AI palette.

Run it and screenshot the output as evidence for Milestone 6,
"Test 2 of 4: Usability & accessibility".

    python3 docs/check-contrast.py

AA  requires 4.5:1 for normal text, 3:1 for large text (>=24px, or >=19px bold).
AAA requires 7:1 for normal text.
"""


def luminance(hex_colour):
    """Relative luminance of a hex colour, per the WCAG 2.1 definition."""
    h = hex_colour.lstrip("#")
    channels = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    channels = [
        c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        for c in channels
    ]
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def contrast_ratio(fg, bg):
    """Contrast ratio between two hex colours, from 1:1 to 21:1."""
    lighter, darker = sorted([luminance(fg), luminance(bg)], reverse=True)
    return (lighter + 0.05) / (darker + 0.05)


PAPER = "#FAF9F6"   # --paper
BAND = "#F2EFE7"    # --band  (tinted section background)
INK = "#16150F"     # --ink
ACCENT = "#9C3418"  # --accent

# (label, foreground, background, required ratio)
PAIRINGS = [
    ("Ink on paper",              INK,       PAPER,  4.5),
    ("Secondary ink on paper",    "#55524A", PAPER,  4.5),
    ("Tertiary ink on paper",     "#6E6A60", PAPER,  4.5),
    ("Tertiary ink on band",      "#6E6A60", BAND,   4.5),
    ("Accent on paper",           ACCENT,    PAPER,  4.5),
    ("Accent on band",            ACCENT,    BAND,   4.5),
    ("Paper on ink (skip link)",  PAPER,     INK,    4.5),
    ("Paper on accent (button)",  PAPER,     ACCENT, 4.5),
]


def main():
    print("WCAG 2.1 contrast check — Understanding AI palette")
    print("=" * 62)
    print(f"{'Pairing':<30}{'Ratio':>9}{'AA':>8}{'AAA':>8}")
    print("-" * 62)

    all_pass = True
    for label, fg, bg, required in PAIRINGS:
        ratio = contrast_ratio(fg, bg)
        aa = "PASS" if ratio >= required else "FAIL"
        aaa = "PASS" if ratio >= 7.0 else "—"
        if ratio < required:
            all_pass = False
        print(f"{label:<30}{ratio:>7.2f}:1{aa:>8}{aaa:>8}")

    print("-" * 62)
    print("RESULT:", "All pairings meet WCAG 2.1 AA."
          if all_pass else "One or more pairings FAIL AA — fix before building.")


if __name__ == "__main__":
    main()
