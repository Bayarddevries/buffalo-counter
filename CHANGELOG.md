# Changelog — The Buffalo Counter

All notable changes to this project are documented here.

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