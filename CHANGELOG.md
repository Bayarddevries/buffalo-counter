# Changelog — The Buffalo Counter

All notable changes to this project are documented here.
 
 ## [2026-05-21] v1.8 — Repository Cleanup
 
 - **chore**: Remove development artifacts (test scripts, video/still prototypes, sprite generation files)
 - **chore**: Remove unused `media/` and `scripts/` directories
 - **chore**: Clean repository root of prototype clutter (improves maintainability)
 
## [2026-05-16] v1.7 — Dynamic Timeline Colors & Image Refresh

- **img**: Swap 1800 card image — pc005127.jpg (Bell Photo, Buffalo National Park herd) replaces buffalo-trade-illustration.webp
- **img**: Swap 1825 card image — e000009381.jpg (Métis freighting brigade with Red River cart) replaces Paul Kane painting
- **img**: Swap 1850 card image — Gull-Lake-Sasketchewan-1890-768x637.jpg (bone pile at Gull Lake, Saskatchewan) replaces e000009381.jpg
- **img**: Swap 1865 card image — 6-4-768x572.jpg (CPR boxcar with buffalo bones) replaces bison-skull-pile.jpg
- **fix**: Reverted fill metric to time-linear (year-proportional) — pop ratio felt deceptive, steady year-based drain preferred
- **feat**: Dynamic timeline fill color — green (stable) → gold (declining) → orange (warning) → red (critical) → dark red (extinct), transitions smoothly with population level
- **feat**: Pulse animation on timeline fill at critical (< 100K) — pulsing red glow, 1.8s cycle
- **feat**: Fade-out pulse on timeline fill at extinction (< 10K) — slow 2.5s dimming pulse, box-shadow fades
- **chore**: Cache-bust styles.css to v10

## [2026-05-14] v1.6 — Citation Toast, Scroll Fixes & Side Timeline Dots

- **feat**: Implement strict inline citations — `<a class="cite" data-source="...">` on all historical claims, clickable citation toast bar with 4s auto-hide
- **feat**: Add impactful final image to 1900 card — Glenbow skull pile photo (ca. 1890)
- **img**: Replace Metis brigades & hide trade images — Paul Kane painting and LAC Boundary Commission photo
- **fix**: Replace IntersectionObserver with scroll-driven active card sync — resolves 1889 snap issue
- **fix**: Restore 1889 card image link (use existing bison-skull-pile.jpg)
- **fix**: Stabilize card heights with `aspect-ratio`; prevent image cutoff and scroll-snap drift
- **fix**: Make cards internally scrollable; resolve last pane overflow issue
- **fix**: Disable snap on final card, add bottom padding, allow full scroll to conclusion
- **fix**: Change `scroll-snap-type` to `proximity` to allow free scroll past final card
- **fix**: Override `scroll-snap-stop` on final card
- **fix**: Bottom text cutoff — add 15vh padding to cards-section container
- **fix**: Stale `$section` reference crash — remove broken closure reference in scroll handler
- **style**: Smooth splash fade transition (0.6s ease, `will-change: opacity`)
- **ux**: Move timeline dots to side rail as scroll-position indicators (fixed right, vertical, gold dots)
- **ux**: Remove slide dots, restore CSS timeline labels
- **ux**: Fix bar drain direction — right-anchor so fill drains from the left (empty→full reversed to full→empty)
- **ux**: Snap counter year to active card instead of interpolating (avoids showing partial years between data points)
- **chore**: Cache-bust styles.css on deploy (v3→v4)
- **chore**: Add BUF-0 debug document for final-card snap alignment investigation

## [2026-05-13] v1.5 — Scroll-Driven Snap Layout (Current Production)

- **MAJOR**: Replaced schedule-driven auto-play animation with scroll-snap card layout
- CSS `scroll-snap-type: y mandatory` for full-page snap cards
- `IntersectionObserver` for card activation at threshold 0.5
- Scroll position interpolation (rAF-throttled) for smooth counter updates between cards
- Timeline fill width tracks scroll progress
- Dynamic population color: green (stable, 30M) → yellow/orange (declining) → red (critical) → dark red (extinct, <1000)
- Counter value font: IM Fell English (17th century printing press aesthetic)
- Body font: IBM Plex Sans
- Splash overlay removed on click with transitionend cleanup
- Collapsible sources bar at bottom of page
- 8 snap cards: 1800, 1825, 1850, 1865, 1870, 1880, 1889, 1900

## [2026-05-13] v1.4 — Copy Humanization & Splash Polish

- Humanize copy: remove em dashes, past tense, conversational voice
- Add splash intro overlay with historical context, hide intro image, fade-out animation
- Remove historical context section from main page (content moved to splash)
- Remove accidental `metis-brigades.jpg` inclusion from US Army Campaigns event
- Fix splash double-remove: use `removed` flag + rAF fallback instead of competing `transitionend` + `setTimeout`

## [2026-05-13] v1.3 — Historical Images & Sources Bar

- Add historical images with captions to event data
- Add collapsible sources bar at bottom of page
- Add `image` and `imageCaption` fields to `EVENTS_DATA` in `app.js`

## [2026-05-13] v1.2 — Peer Review Pass

- Historical corrections based on peer review
- Accessibility improvements (WCAG AA)
- Performance optimizations
- Add comprehensive project summary to `PROJECT_SUMMARY.md`

## [2026-05-12] v1.1 — Interactive Timeline Events

- Add clickable event markers on timeline
- Show tooltips on hover with event description
- Event markers positioned correctly on timeline
- Clicking markers jumps visualization to that year

## [2026-05-12] v1.0 — Initial Release

- Live counter showing buffalo population 1800–1900
- Play/pause animation with configurable speed (slow/normal/fast)
- Timeline scrubber with drag-to-seek
- Population turns red below 1 million
- Status messages for screen readers
- WCAG AA accessibility (keyboard nav, ARIA labels, focus management)
- Responsive mobile-first design
- GitHub Actions deployment to GitHub Pages
