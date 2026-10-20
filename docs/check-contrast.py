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


PAPER = "#F5F6F7"   # --bg (light)
BAND = "#ECEEF0"    # --surface-2 (light)
INK = "#101214"     # --ink (light)
ACCENT = "#0B7A55"  # --accent (light)
D_BG = "#0D0F11"    # --bg (dark)
D_S2 = "#1B1F23"    # --surface-2 (dark)

# (label, foreground, background, required ratio)
PAIRINGS = [
    ("Light: ink on bg",              INK,       PAPER,  4.5),
    ("Light: secondary ink on bg",    "#43494F", PAPER,  4.5),
    ("Light: tertiary ink on bg",     "#5B636B", PAPER,  4.5),
    ("Light: tertiary ink on tint",   "#5B636B", BAND,   4.5),
    ("Light: accent on bg",           ACCENT,    PAPER,  4.5),
    ("Light: accent on tint",         ACCENT,    BAND,   4.5),
    ("Light: bg on accent (button)",  PAPER,     ACCENT, 4.5),
    ("Light: text on accent-soft",    "#0A5B40", "#DDF0E8", 4.5),
    ("Light: bg on ink (inverted tile)", PAPER,  INK,    4.5),
    ("Dark: ink on bg",               "#ECEEEF", D_BG,   4.5),
    ("Dark: secondary ink on bg",     "#B4BAC0", D_BG,   4.5),
    ("Dark: tertiary ink on bg",      "#8D959D", D_BG,   4.5),
    ("Dark: tertiary ink on tint",    "#8D959D", D_S2,   4.5),
    ("Dark: accent on bg",            "#4FD6A3", D_BG,   4.5),
    ("Dark: ink on accent (button)",  "#07120E", "#4FD6A3", 4.5),
    ("Dark: text on accent-soft",     "#7BE3BC", "#12261F", 4.5),
]


def main():
    print("WCAG 2.1 contrast check — Understanding AI palette")
    print("=" * 62)
    print(f"{'Pairing':<36}{'Ratio':>9}{'AA':>8}{'AAA':>8}")
    print("-" * 62)

    all_pass = True
    for label, fg, bg, required in PAIRINGS:
        ratio = contrast_ratio(fg, bg)
        aa = "PASS" if ratio >= required else "FAIL"
        aaa = "PASS" if ratio >= 7.0 else "—"
        if ratio < required:
            all_pass = False
        print(f"{label:<36}{ratio:>7.2f}:1{aa:>8}{aaa:>8}")

    print("-" * 62)
    print("RESULT:", "All pairings meet WCAG 2.1 AA."
          if all_pass else "One or more pairings FAIL AA — fix before building.")


if __name__ == "__main__":
    main()
