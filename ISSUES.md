# Project Issues & Task Tracker

This file tracks the current state of the project, including bugs, feature requests, and design polish.

## Open Issues

| ID | Task | Priority | Status | Notes |
|:---|:---|:---:|:---:|:---|
| BUF-6 | Final panel closing animation | Medium | Pending | Full-screen experience to make the end feel final. Needs a concluding animation or overlay on the 1900 card. |
| BUF-7 | Scroll-snap not working on mobile | High | Pending | Cards don't snap properly on mobile viewports. Also reported as not working correctly on desktop scroll. Needs investigation. |
| BUF-8 | Timeline bar invisible on desktop | Medium | Pending | The 6px year-linear bar is nearly invisible against `#111` background, and hidden behind splash overlay on initial load. Needs pop-proportional redesign for visibility + accuracy. |

## Completed

- [x] BUF-0 — Fix final card snap alignment (CSS `--counter-height` mismatch, malformed mobile media query)
- [x] BUF-1 — Remove emojis from all cards
- [x] BUF-2 — Re-integrate inline citations for all numbers/historical claims (citation toast bar with clickable `<a class="cite">` links)
- [x] BUF-3 — Replace Metis brigades map image with better alternative (Paul Kane painting, LAC Boundary Commission photo)
- [x] BUF-4 — Add impactful final image to 1900 card (Glenbow skull pile photo, ca. 1890)
- [x] BUF-5 — Splash page fade transition (0.6s ease opacity, will-change: opacity)
- [x] Initial MVP Deployment
- [x] Scroll-driven snap architecture
- [x] Mobile responsiveness
- [x] Historical image integration
- [x] Fixed desktop aspect ratio cutoff
- [x] Scroll position side indicators (side rail gold dots instead of horizontal slider dots)
- [x] Bar drain direction (right-anchor, fill drains from left → right)
- [x] Counter snaps to active card year instead of interpolating between years
- [x] Cards internally scrollable to prevent text cutoff on last pane
