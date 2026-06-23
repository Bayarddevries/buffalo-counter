# Audit — Buffalo Counter v2 (June 2026)

> Full visual audit document (rendered HTML, with scorecard and A/B/C options) lives externally at:
> `~/buffalo-audit/buffalo-counter-v2-audit.html`
>
> This file is the prose summary used by the v2.1 fix plan. Bug IDs match.

**Audit date:** 2026-06-23
**Auditor:** Hermes (brutal-honesty mode per user preference)
**Live URL audited:** https://bayarddevries.github.io/buffalo-counter-v2/
**Source reviewed against:** live `app.js`, `styles.css`, `index.html`, `data/timeline.json`, `data/images.json`

---

## Headline take

The counter is the most ambitious interactive-theater project the user has shipped, and the most impressive in *concept*. The April-2026 v1 (standalone counter) worked in a narrow slice; this v2 release finally gives the counter a narrative canvas to live inside. The infrastructure — scroll-snap cards, atmospheric background crossfade, three-tier citation system (inline `[n]` → toast → categorized source panel) — is largely right-shape.

The reason for the audit is the codebase: a 669-line single-file `app.js`, a duplicate `.card` CSS rule in the production stylesheet, a counter that interpolates between events (producing invented years), and a doc floor that lies about the data, URL, and code contract. Ship-ready after triage; not "done."

**Recommended verdict:** ship after a 2-sprint triage (Phase 0–4B in `~/buffalo-audit/plans/buffalo-counter-v2-fix-plan.md`). Stop expanding; re-evaluate in 60 days against real reader signal.

---

## Findings — 16 total

### Critical / Major (5)

| ID | Location | Finding | Fix phase |
|---|---|---|---|
| **B1** | `app.js:431` | Counter year interpolates between data points (e.g., shows `1826, 1827, …` between 1825→1850). AGENTS.md v1.6 design contract required snapping; v2 drifted. | P1A |
| **B2** | `styles.css:379, 395` | `.card` declared twice. First declaration is silently overridden by the second. Empty `.card.active { }` rule at line 389 makes it stickier. | P1B |
| **B3** | `styles.css:104, 532-548` | `.atmo-overlay { z-index: 0; background: rgba(10,10,10,0.85) }` overlays all cards (which have `z-index: 1`). On mobile, stacks with `.card { opacity: 0.35 }` for inactive cards → cards look black. | P3A |
| **B4** | `data/timeline.json` (1880 event) | Population curve goes up: 1877 (150k) → 1880 (395k). Counter is supposed to show monotonically collapsing numbers. Methodologically defensible (different herd counted), but reads as a bug. | P2A |
| **B5** | `AGENTS.md` | Doc lies about v2: (1) URL points at v1 `/buffalo-counter/`, (2) "7 data points" — v2 has 11, (3) "Snaps counter year" claim contradicted by actual interpolation, (4) "Four unmerged design prototypes" — those were merged/archived long ago. | P0 |

### Minor (4)

| ID | Location | Finding | Fix phase |
|---|---|---|---|
| **N1** | `data/timeline.json` (1874 event) | Card body is 577 chars; every other card is 220–370. Bottlenecks read rhythm. | P2B |
| **N2** | `data/timeline.json` (all cards) | Voice inconsistent: third-person reportage in some cards, verbatim quotes in others, splash uses first-person plural. The user's Metis Trail V2 has a strict 1PP contract; this project does not — and the inconsistency shows at the splash→card handoff. | **P4A (gate)** |
| **N3** | `AGENTS.md` content-rules section | Documents a "Canadian flag (🇨🇦) required" rule that no card follows. The rule itself is dead — flagging the existence of unused rules as the smell, not the flag. | **P4A (gate)** |
| **N4** | `data/timeline.json` (sources array) | Sources `[7]`, `[8]`, `[9]`, `[10]`, `[11]`, `[12]` are listed in the panel but never anchored to any claim. | **P4B (gate)** |
| **U1** | `app.js:480-486` | Splash has `transitionend` AND `setTimeout(600)` both calling `remove()`. Individually guarded, harmless, redundant. | Sprint 2 |
| **U2** | `app.js` (no element) | No "Back to 1800" affordance after the last card. Keyboard↑ works (good) but undiscoverable. | Sprint 2 |
| **U3** | `app.js:588-597` | Keyboard nav gates on sources-open, not on any-modal-open. Pre-splash arrow-key skip is possible (edge case). | Sprint 2 |
| **U4** | `index.html:11` | `styles.css?v=30` cache-buster is decorative; v=5, v=15, v=20, v=30 all return identical content. | P3 (Phase 3 in plan originally split; merged into P3A in execution) |

### Strengths (4)

- **W1.** Counter shape (large serif digits, top-anchored, status label, drain 4 orders of magnitude) is *the right move* for this subject. Pulsing-red timeline bar at extinction threshold earns its descriptive role.
- **W2.** Citation infrastructure is the right decision: inline tokens → toast → categorized panel. Every claim auditable in 2 clicks.
- **W3.** Atmospheric-bg crossfade (dual `.atmo-bg-current` / `.atmo-bg-next`, z-index swap, 1.2s opacity) is right technique. Asset pipeline sound (17 images, 11 used, all serve 200).
- **W4.** Choice of restraint — scroll-snap cards with a counter, no parallax/audio/particles. Right call for audience and budget.

---

## Scorecard

| Dimension | Grade | Notes |
|---|---|---|
| Concept & intent | A | Counter-as-spine is the strongest pattern. |
| Historical accuracy & sourcing | B | 12 sources / 11 events, structural rigour. Cite the unused sources or prune. |
| Counter mechanics | C | Bug B1 + B4 undercut its credibility. Aesthetic right; integrity isn't. |
| Codebase health | C | B2, B5, U4 — all fixable in one hour, do before sharing. |
| Visual finish | B | Typography (IM Fell English + IBM Plex) is a strong independent choice. Mobile opacity wrong. |
| Narrative rhythm & voice | C | 1874 breaks rhythm (N1). Voice unstable (N2). |
| Sustainability / extensibility | C | 669-line single `app.js`. One hardcoded DATA_POINTS array. |
| **Overall** | **B−** | Solid concept, shippable artefact, three bugs to fix before claiming done. |

---

## A/B/C options offered in audit

- **A — Ship as-is, mark maintenance-mode.** Fix the three defects (B1, B2, B4) over the weekend. No new feature requests for 30 days.
- **B — Two-week polish + launch properly.** *(user's choice)* All Phase 0–4 fixes, deliberate public push, classroom PDF export.
- **C — Refactor first, ship second.** Split `app.js` into modules; add typed schemas; smoke tests; then add features.

The user picked **Option B** with a 2-sprint execution window. The fix plan at `~/buffalo-audit/plans/buffalo-counter-v2-fix-plan.md` documents the phase breakdown.

---

## Reproduction commands (for future audits)

```bash
# Live site
curl -sIL https://bayarddevries.github.io/buffalo-counter-v2/
curl -sL https://bayarddevries.github.io/buffalo-counter-v2/data/timeline.json -o timeline.json
curl -sL https://bayarddevries.github.io/buffalo-counter-v2/data/images.json -o images.json

# Source-of-truth
ls -la ~/buffalo-counter/{app.js,index.html,styles.css}

# Verify claim counts
python3 -c "import json; d=json.load(open('timeline.json')); print(len(d['events']), len(d['sources']))"
```
