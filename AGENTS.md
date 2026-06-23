# AGENTS.md — The Buffalo Counter

## Project Overview

**The Buffalo Counter** is an interactive visualization of the catastrophic decline of the North American buffalo population from 30 million in 1800 to fewer than 500 by 1900.

**Live URL:** https://bayarddevries.github.io/buffalo-counter/

**Repository:** https://github.com/Bayarddevries/buffalo-counter

**Tech Stack:** Pure HTML/CSS/JavaScript (no frameworks, no build step)

**Design Philosophy:** "High concept, low effort" — brilliant concept, fast implementation

---

**Current Architecture (as of 2026-06-23)** — v2.1 in progress; **deployment division**: shipped code lives in this `master` branch at `~/buffalo-counter/`, served on alternate path `bayarddevries.github.io/buffalo-counter/` (v1). Production rewrite v2 is served on `bayarddevries.github.io/buffalo-counter-v2/` from a parallel deployment and is structurally identical to this codebase; see `docs/audit-v2.md` for the v2 audit and `~/buffalo-audit/plans/` for the v2.1 fix plan.

> If a sentence below still describes v1 behavior or v2 already contradicts it, the audit doc is more recent than this file. Trust the audit + plan docs for v2.1 state until this file is rewritten post-fix.

### Interaction Model: Scroll-Driven Snap Cards

The site uses **full-page CSS scroll-snap cards** as the primary interaction model. Users scroll through events, and a sticky counter at the top updates based on the active card. Auto-play/timer model was abandoned in favor of user-controlled scroll.

### Atmospheric Backgrounds (v1.9)

Three fixed-position elements sit behind the card stack to create an immersive historical atmosphere:

- **`.atmo-bg`** — Full-bleed, fixed, `z-index: -1`. A historical photo fills the screen and changes as the user scrolls through eras (JS swaps `background-image` in `app.js` based on active card year).
- **`.atmo-overlay`** — Fixed, `z-index: 0`, `pointer-events: none`. Radial gradient vignette: transparent at center → `rgba(10,10,10,0.85)` at edges. Darkens the background photo so card text remains readable.
- **`.atmo-side-left` / `.atmo-side-right`** — Fixed side panels, `backdrop-filter: blur(24px)`, `background: rgba(10,10,10,0.3)`. Visible on wide viewports (>1200px), they add atmospheric depth without obscuring content.

**CSS containment:** `html` and `body` have `height: 100%` + `overflow: hidden` so only `.cards-section` (which has `overflow-y: auto`) scrolls. This prevents the double-scrollbar bug where the outer page scroll competed with the card snap container.

### File Structure

```
buffalo-counter/
├── index.html              # HTML: splash, counter, timeline, scroll-snap cards, sources bar, atmospheric background elements (.atmo-bg, .atmo-overlay, .atmo-side-*)
├── styles.css              # All styles, design tokens, scroll-snap rules, atmospheric backgrounds (v1.9), responsive, citation toast, side indicators
├── app.js                  # JS: scroll interpolation, counter logic, splash, sources, citation toast, era-based background image switching
├── README.md               # User-facing documentation
├── AGENTS.md               # This file
├── CHANGELOG.md            # Version history
├── ISSUES.md               # Project issue tracker
├── BUF-0-debug-final-card-snap.md  # Debug document for final-card snap alignment fix
├── images/                 # Historical photos (lazy-loaded in card images)
├── docs/                   # Generated docs / deployment artifacts
├── scripts/                # Helper scripts
├── media/                  # Unused media prototypes
├── option-a.html through option-d.html  # Unmerged design prototypes
├── scroll-prototype.html, design-review.html, design-showcase.html  # Prototypes
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

### How Scroll-Driven Counter Works

1. **CSS scroll-snap**: `scroll-snap-type: y proximity` on `.cards-section`, each `.card` has `scroll-snap-align: start`. Final card uses `scroll-snap-stop: always` disabled to allow free scroll past the end.
2. **Scroll event listener** (rAF-throttled): `updateFromScroll()` finds the two cards bracketing the viewport center, calculates `clampedProgress`, and picks the closer card as `activeCard`.
3. **Year snapping (v1.6)**: Counter snaps to the **active card's year** (e.g., `1880`) instead of interpolating between data points. This avoids displaying partial years (e.g., `1874.3`) that don't correspond to any real data.
4. **Bar drain direction**: Timeline fill bar is right-anchored — it drains from 100% (full, 1800) to 0% (empty, 1900), matching the depletion concept.
5. **Counter color**: Dynamically maps population to CSS classes — green (`stable`, 30M) → yellow (`declining`) → orange (`warning`) → red (`critical`) → dark red (`extinct`, <1000).
6. **Side rail scroll-position indicators (v1.6)**: Fixed right rail with vertical gold dots, one per card. Active dot highlights based on current card.

### Key Files

- **index.html** — DOM structure: splash overlay, sticky counter, timeline, 8 snap cards (1800, 1825, 1850, 1865, 1870, 1880, 1889, 1900), collapsible sources bar, citation links in card copy
- **styles.css** — Design tokens, scroll-snap container rules, card animations, dynamic counter color classes, IM Fell English typography, citation toast styles, side rail indicator styles
- **app.js** — `DATA_POINTS` array (7 data points), `setupScrollInterpolation()` (scroll math, active card detection), `updateFromYear()` (counter + color + timeline), `setupSplash()`, `setupSources()`, `setupCitationToast()`
- **PROJECT_SUMMARY.md** — Complete project summary (legacy, may be outdated)
- **BUF-0-debug-final-card-snap.md** — Investigation document for the final-card CSS alignment fix

### Population Data (`DATA_POINTS` in app.js)

```javascript
[
  { year: 1800, pop: 30000000 },
  { year: 1850, pop: 20000000 },
  { year: 1865, pop: 13500000 },
  { year: 1870, pop: 5500000 },
  { year: 1880, pop: 395000 },
  { year: 1889, pop: 653 },
  { year: 1900, pop: 500 },
]
```

### Design Tokens

- `--color-bg: #0a0a0a` — Background
- `--color-accent: #c49a3a` — Gold accent (years, headings, timeline)
- `--color-success: #2d6a4f` — Green (high population, stable)
- `--color-warning: #e76f51` — Orange (declining population)
- `--color-danger: #c41e3a` — Red (critical population)
- `--color-danger-dark: #8b0000` — Dark red (extinction)
- `--font-heading`: IM Fell English (counter value, card years)
- `--font-body`: IBM Plex Sans (body text)

### Open Bugs (v2.1 — see `docs/audit-v2.md` and fix plan)

Tracked in `~/buffalo-audit/plans/buffalo-counter-v2-fix-plan.md`. Bug IDs match `docs/audit-v2.md`.

| ID | Status | Target phase | File / line |
|---|---|---|---|
| B1 — counter year interpolation | open | P1A (Sprint 1) | `app.js:431, 127` |
| B2 — duplicate `.card` CSS rule | open | P1B (Sprint 1) | `styles.css:379, 395` |
| B3 — mobile inactive-card opacity | open | P3A (Sprint 1) | `styles.css:532-548` |
| B4 — 1880 methodological rebound | open | P2A (Sprint 1) | `data/timeline.json` (1880 event) |
| N1 — 1874 card too long | open | P2B (Sprint 1) | `data/timeline.json` (1874 event) |
| N2 — voice inconsistency | open — **user gate** | P4A (Sprint 2) | `data/timeline.json` (all events) |
| N4 — citation drift (sources [7]–[12] unreferenced) | open — **user gate** | P4B (Sprint 2) | `data/timeline.json` (sources array) |
| U4 — fake cache-buster | open | P3A (Sprint 1) | `index.html:11` |

Resolved during v2.1:
- **B5** — `AGENTS.md` doc rot: resolved in P0 (this version).

---

## Content Rules

- **No em dashes** — use colons or commas instead
- **Past tense only** — all copy is historical narration
- **Metis as victims** — framing Metis communities as victims of buffalo destruction caused by commercial hunting, military policy, and government action — never as perpetrators
- Conversational, direct voice — no corporate buzzwords

*(Removed: "Canadian flag (🇨🇦) required on Canadian event cards" — was unused; deleted per audit N3.)*

---

## Unfinished Work (Picking Up Later)

### Design Options Evaluation

Four design prototypes were created but NOT merged into production. They remain as untracked files in the repo:

- **option-a.html** — Filmstrip events (horizontal scroll, 2-col desktop grid). Has play/reset buttons.
- **option-b.html** — Compact HUD with expandable event cards
- **option-c.html** — Mobile-first bottom sheet for events
- **option-d.html** — High-fidelity full redesign (25KB)

**Current production** uses scroll-snap cards (not any of the above options). The scroll-driven architecture was chosen over auto-play/schedule-driven models. These four options are alternative UI approaches that may be merged or discarded later.

### Image Integration

Historical images exist in `/images/` and are referenced in the scroll-snap cards, but the option prototypes contain alternative image layouts that haven't been finalized.

### Repository Cleanup

Numerous untracked prototype files exist that should be archived or removed:
- `option-a.html`, `option-b.html`, `option-c.html`, `option-d.html`
- `scroll-prototype.html` (desktop copy: `/mnt/c/Users/bayar/Desktop/Buffalo Counter - Scroll Prototype.html`)
- `design-review.html`, `design-showcase.html`
- `media/`, `images/`, `scripts/`
- `all_stills.png`, `still_scene1.png`, `still_scene2.png`, `still_scene3.png`
- `concat.txt`, `final.mp4`, `outbox.mp4`, `plan.md`
- `research-phillips.pdf`, `research-phillips.txt`

---

## Deployment

```bash
cd /root/buffalo-counter
git add .
git commit -m "message"
git push
# GitHub Actions deploys automatically to GitHub Pages
```

**Live URL:** https://bayarddevries.github.io/buffalo-counter/

---

## Deployment History

| Commit | Message | Date |
|--------|---------|------|
| `8b7316a` | fix: add missing atmo CSS + prevent double scrollbar with overflow hidden on html/body | 2026-05-21 |
| `6c72f44` | feat(design): add atmospheric side panels + full-bleed era backgrounds; cache-bust; restore .gitignore and workflow | 2026-05-21 |
| `9110a97` | Snap counter year to active card instead of interpolating | 2026-05-14 |
| `a534fea` | Fix bar drain direction: right-anchor so fill drains from left | 2026-05-14 |
| `6dddf41` | Fix crash: remove stale $section reference that broke scroll handler | 2026-05-14 |
| `cc174d9` | Remove slide dots, restore CSS timeline labels | 2026-05-14 |
| `dbf3a1e` | Move timeline dots to side as scroll-position indicators | 2026-05-14 |
| `aa0e23b` | Fix bottom text cutoff: add 15vh padding to cards-section container | 2026-05-14 |
| `ed2ddfb` | chore: bump cache-buster to v4 for CSS | 2026-05-14 |
| `60bf6b2` | fix: restore broken link tag after cache-bust update | 2026-05-14 |
| `c596ef0` | chore: cache-bust styles.css on deploy (v3) | 2026-05-14 |
| `baf5196` | fix: change scroll-snap-type to proximity for free scroll past final card | 2026-05-14 |
| `824cf9f` | fix: override scroll-snap-stop on final card | 2026-05-14 |
| `94b9ae0` | fix: disable snap on final card, add bottom padding, allow full scroll | 2026-05-14 |
| `8b30e20` | fix: make cards internally scrollable; resolve last pane overflow | 2026-05-14 |
| `5db1e0c` | fix: stabilize card heights with aspect-ratio; prevent cutoff | 2026-05-14 |
| `3502ef6` | style: smooth splash fade transition (0.6s ease) | 2026-05-14 |
| `15836fe` | fix: restore 1889 card image link | 2026-05-14 |
| `691c2a6` | fix: replace IntersectionObserver with scroll-driven active card sync | 2026-05-14 |
| `b13b0f7` | feat: add impactful final image to 1900 card (Glenbow skull pile) | 2026-05-14 |
| `4a2e59e` | img: replace Metis brigades & hide trade images | 2026-05-14 |
| `7709e70` | feat: implement strict inline citations for academic rigor | 2026-05-14 |
| `144203c` | feat: switch to scroll-driven snap layout | 2026-05-13 |
| `321cd66` | feat: merge Option D layout with scroll-snap cards | 2026-05-13 |
| `54e9968` | fix: prevent double-remove of splash overlay on close | 2026-05-13 |
| `dadf64b` | Humanize copy: remove em dashes, past tense | 2026-05-12 |
| `6ee8886` | Add splash intro overlay, remove historical context | 2026-05-12 |
| `49cc447` | Add historical images and collapsible sources bar | 2026-05-12 |
| `3a3941a` | Peer review fixes: historical corrections, accessibility | 2026-05-12 |
| `d1629bd` | Add comprehensive project summary | 2026-05-12 |
| `d0625ea` | Redesign: mobile-first responsive layout with sticky counter | 2026-05-12 |
| `64c1c89` | Add event markers to timeline with tooltips | 2026-05-12 |
| `a41b478` | Initial commit: The Buffalo Counter | 2026-05-12 |

---

## Keyboard Shortcuts (Legacy — auto-play model)

Old keyboard shortcuts (Arrow keys, Space, Home, End) from the auto-play model are **NOT implemented** in the current scroll-driven version. Scroll is the only control.

---

## Engineering Discipline (from Karpathy's CLAUDE.md)

Bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that *your* changes made unused.
- Don't remove pre-existing dead code unless asked.

**Test:** Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Context

### Related Projects
- **Project Heimdall** — 56-case UFO map, similar data visualization approach
- **Métis Homeland Map** — V8, Métis heritage project
- **Devries Dynamics** — Portfolio website

### User Background
- Bayard deVries, WSL on Windows, local models
- Canadian focus, Métis heritage
- Prefers "high concept, low effort" — direct, human conversational copy

### Tech Environment
- Linux (Pop!_OS), 8GB RAM, GTX 1070 8GB (CPU-only for local models)
- GitHub org: Bayarddevries
- Local path: `/home/bayarddevries/buffalo-counter`
- Preview copy: `/mnt/c/Users/bayar/Desktop/buffalo-counter-preview/`
