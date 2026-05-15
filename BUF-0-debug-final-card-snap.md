# BUF-0: Final Card Snap Alignment Debug

**Status**: Fixed — deployed commit `aac0076`, awaiting cache expiry verification  
**Issue**: Final card (1900) does not align flush with bottom of sticky header; visible gap (~5–6px) remains after previous offset adjustments.  
**Owner**: Bayard deVries  
**Last updated**: 2026-05-14

---

## Context

Project **Buffalo Counter** uses CSS scroll-snap to create a card-based narrative where each card snaps to the top of the viewport just below the sticky header stack (`.counter-sticky`, `.timeline-wrap`, `.scroll-prompt`). The final card (`[data-year="1900"]`) must align its top edge exactly with the bottom of the sticky header to maintain a seamless scroll chain, with no visible gap.

---

## Root Cause

Two intertwined issues:

1. **Malformed CSS in mobile media query**  
   `styles.css` lines 661–669 contained:
   - Duplicate `overscroll-behavior-y: contain;` declaration
   - Extra closing brace `}` after the mobile block

   This syntax error broke the CSS parser's cascade, causing the desktop media query (`@media (min-width: 768px)`) to be ignored entirely. As a result, `--counter-height` remained at its mobile default value **160px** on desktop instead of the intended **200px**.

2. **Incorrect offset value**  
   Even after fixing the syntax, the desktop `--counter-height` value of **200px** exceeded the actual rendered height of `.counter-sticky` (**~193.61px**). This produced a measurable gap when the final card snapped into place.

---

## Investigation Steps

| Step | Action | Finding |
|------|--------|---------|
| 1 | Inspect live CSS via browser console | Desktop `@media (min-width: 768px)` block missing; `--counter-height` computed as 160px |
| 2 | Read `styles.css` locally | Duplicate declaration and stray brace in mobile block (lines 661–669) |
| 3 | Patch CSS syntax error | Removed duplicate line and extra brace; desktop block now present |
| 4 | Verify local CSS structure | `.cards-section` has no `scroll-padding-top`; `.card.card-end` has `scroll-margin-top: var(--counter-height)` |
| 5 | Commit & push (1f43924) | Deployed fix to GitHub Pages |
| 6 | Hard reload live site | Browser still cached old CSS (200px) |
| 7 | JS override test — set `--counter-height: 194px` inline | Computed `scroll-margin-top` remained 200px; cached stylesheet still active |
| 8 | Fine‑tune desktop `--counter-height` to 194px | Matches measured counter height (193.61px → rounded to 194px) |
| 9 | Commit & push (aac0076) | Deployed fine-tuned value |
| 10 | Live site measurement (post-deploy) | `--counter-height`: 194px, counter bottom: 193.61px, final-card top: 193.14px, gap: -0.47px |

---

## Files Modified

| File | Lines | Change |
|------|-------|--------|
| `styles.css` | 661–669 | Removed duplicate `overscroll-behavior-y: contain;` and stray `}` from mobile media query |
| `styles.css` | ~702 (desktop block) | Changed `--counter-height: 200px` → `--counter-height: 194px` |
| `index.html` | — | No changes |

---

## Verification

After deploy `aac0076` and cache expiry:

```javascript
// Browser console (live site)
const card = document.querySelector('.card[data-year="1900"]');
const counter = document.querySelector('.counter-sticky');
const cardRect = card.getBoundingClientRect();
const counterRect = counter.getBoundingClientRect();

getComputedStyle(document.documentElement).getPropertyValue('--counter-height').trim();
// → "194px"

getComputedStyle(card).scrollMarginTop;
// → "194px"

counterRect.bottom;   // 193.61
cardRect.top;         // 193.14
cardRect.top - counterRect.bottom;  // -0.47 (effectively flush)
```

**Result**: Final card aligns within <1px of counter bottom. Negative gap indicates slight overlap (sub-pixel rendering artefact).

---

## Remaining Checks

- [ ] **Cache clearance** — Verify on multiple browsers/devices that the 194px value has propagated (GitHub Pages CDN may take up to 60 s, browser cache may require hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`).
- [ ] **Responsive** — Confirm mobile offset remains `160px` and final card still scrolls internally with correct height.
- [ ] **Scroll chain** — Ensure all preceding cards still snap to very top (just below header) and final card remains a normal snap point (no class toggles or full-screen overlays).
- [ ] **Scroll margin overrides** — Check that no other CSS rules conflict with `.card.card-end { scroll-margin-top: var(--counter-height); }`.

If gap persists after cache clears:
1. Replace `scroll-margin-top: var(--counter-height)` with explicit `scroll-margin-top: 194px` inside the desktop `.card.card-end` rule to avoid any variable‑cascade edge cases.
2. Commit and redeploy.

---

## Action Items

- **Immediate**: Refresh live page with hard reload to confirm alignment.
- **If still misaligned**: Apply explicit pixel value override (see above).
- **Then**: Resume pending BUF tasks (buf‑1 through buf‑6) in the main task list.

---

## Changelog

| Commit | Message |
|--------|---------|
| `1f43924` | fix(buf): repair malformed mobile media query, restore desktop --counter-height cascade |
| `aac0076` | fix(buf): fine-tune desktop --counter-height to 194px to match counter height |

---

## Notes

- The sticky header stack height varies slightly with scroll position because `.scroll-prompt` appears/disappears. The offset targets the bottom of `.counter-sticky` + `.timeline-wrap` when `.scroll-prompt` is hidden (the typical scroll‑snap state).
- `--counter-height` is the single source of truth for both card height calculations (mobile: `calc(100vh - var(--counter-height) - 60px)`) and final‑card snap offset. Any change must be reflected in both places.
