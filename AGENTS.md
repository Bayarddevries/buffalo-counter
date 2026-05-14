# AGENTS.md — The Buffalo Counter

## Project Overview

**The Buffalo Counter** is an interactive visualization of the catastrophic decline of the North American buffalo population from 30 million in 1800 to fewer than 500 by 1900.

**Live URL:** https://bayarddevries.github.io/buffalo-counter/

**Repository:** https://github.com/Bayarddevries/buffalo-counter

**Tech Stack:** Pure HTML/CSS/JavaScript (no frameworks, no build step)

**Design Philosophy:** "High concept, low effort" — brilliant concept, fast implementation

---

## Current Architecture (as of 2026-05-13)

### Interaction Model: Scroll-Driven Snap Cards

The site uses **full-page CSS scroll-snap cards** as the primary interaction model. Users scroll through events, and a sticky counter at the top updates in real-time via scroll position interpolation. Auto-play/timer model was abandoned in favor of user-controlled scroll.

### File Structure

```
buffalo-counter/
├── index.html              # HTML: splash, counter, timeline, scroll-snap cards, sources bar
├── styles.css              # All styles, design tokens, scroll-snap rules, responsive
├── app.js                  # JS: IntersectionObserver, scroll interpolation, counter logic
├── README.md               # User-facing documentation
├── AGENTS.md               # This file
├── CHANGELOG.md            # Version history
├── images/                 # Historical photos (lazy-loaded in card images)
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

### How Scroll-Driven Counter Works

1. **CSS scroll-snap**: `scroll-snap-type: y mandatory` on `.cards-section`, each `.card` has `scroll-snap-align: start`
2. **IntersectionObserver**: Watches cards, adds/removes `.active` class at threshold 0.5
3. **Scroll interpolation**: On scroll events (rAF-throttled), finds the two cards the viewport center is between, calculates `clampedProgress`, and linearly interpolates year + population between their data points
4. **Counter color**: Dynamically maps population to CSS classes — green (`stable`) → yellow (`warning`) → red/deep red (`critical`/`extinct`)

### Key Files

- **index.html** — DOM structure: splash overlay, sticky counter, timeline, 8 snap cards (1800, 1825, 1850, 1865, 1870, 1880, 1889, 1900), collapsible sources bar
- **styles.css** — Design tokens, scroll-snap container rules, card animations, dynamic counter color classes, IM Fell English typography for counter value
- **app.js** — `DATA_POINTS` array (7 data points), `setupCardObserver()` (IntersectionObserver), `setupScrollInterpolation()` (scroll math), `updateFromYear()` (counter + color + timeline), `setupSplash()`, `setupSources()`

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

### Content Rules

- **No em dashes** — use colons or commas instead
- **Past tense only** — all copy is historical narration
- **Canadian flag** (🇨🇦) required on Canadian event cards
- **Metis as victims** — framing Metis communities as victims of buffalo destruction caused by commercial hunting, military policy, and government action — never as perpetrators
- Conversational, direct voice — no corporate buzzwords

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
| `144203c` | feat: switch to scroll-driven snap layout matching scroll prototype | 2026-05-13 |
| `321cd66` | feat: merge Option D layout with scroll-snap cards, Color A, and new typography | 2026-05-13 |
| `54e9968` | fix: prevent double-remove of splash overlay on close | 2026-05-13 |
| `dadf64b` | Humanize copy: remove em dashes, past tense, conversational voice | 2026-05-12 |
| `6ee8886` | Add splash intro overlay, remove historical context section | 2026-05-12 |
| `49cc447` | Add historical images and collapsible sources bar | 2026-05-12 |
| `3a3941a` | Peer review fixes: historical corrections, accessibility, performance | 2026-05-12 |
| `d1629bd` | Add comprehensive project summary | 2026-05-12 |
| `d0625ea` | Redesign: mobile-first responsive layout with sticky counter | 2026-05-12 |
| `64c1c89` | Add event markers to timeline with tooltips | 2026-05-12 |
| `a41b478` | Initial commit: The Buffalo Counter | 2026-05-12 |

---

## Keyboard Shortcuts (Legacy — auto-play model)

Old keyboard shortcuts (Arrow keys, Space, Home, End) from the auto-play model are **NOT implemented** in the current scroll-driven version. Scroll is the only control.

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
- WSL on Windows, 8GB RAM
- GitHub org: Bayarddevries
- Local path: `/root/buffalo-counter`
- Preview copy: `/mnt/c/Users/bayar/Desktop/buffalo-counter-preview/`
