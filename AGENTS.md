# AGENTS.md

## Project Overview

**The Buffalo Counter** is an interactive visualization of the catastrophic decline of the North American buffalo population from 60 million in 1800 to fewer than 1,000 by 1900.

**Live URL:** https://bayarddevries.github.io/buffalo-counter/

**Repository:** https://github.com/Bayarddevries/buffalo-counter

**Tech Stack:** Pure HTML/CSS/JavaScript (no frameworks, no build step)

**Design Philosophy:** "High concept, low effort" — brilliant concept, fast implementation

---

## Quick Start for Future Agents

### 1. Understand the Project

This is a single-page visualization with:
- A live counter showing buffalo population
- A timeline scrubber (1800-1900)
- Play/pause animation
- Interactive event markers on the timeline
- Full accessibility (WCAG AA compliant)

### 2. File Structure

```
buffalo-counter/
├── index.html              # HTML structure only (~147 lines)
├── styles.css              # All styles and design tokens (~706 lines)
├── app.js                  # All JavaScript logic (~732 lines)
├── README.md               # User-facing documentation
├── AGENTS.md               # This file — agent instructions
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

### 3. Key Files to Edit

- **index.html** — HTML structure, containers, semantic markup
- **styles.css** — All styling, design tokens, responsive rules
- **app.js** — All JavaScript logic, data, event handling

### 4. Deployment

The project uses GitHub Actions for automatic deployment:

```bash
# Make changes
git add .
git commit -m "Your message"
git push

# GitHub Actions automatically deploys to GitHub Pages
# Check status with: gh run list
```

**Live URL:** https://bayarddevries.github.io/buffalo-counter/

---

## Architecture Decisions

### Why Separate Files?

Originally a single `index.html` file, but refactored into three files:
- **index.html** — Structure only
- **styles.css** — All styles
- **app.js** — All logic

**Reason:** Better maintainability, code quality, and separation of concerns while still adhering to "no build step" constraint.

### Why No Frameworks?

- Pure HTML/CSS/JavaScript
- No build step
- No dependencies
- Easy to understand and modify
- Fast to implement

### Why GitHub Actions?

The `gh repo edit --enable-pages` CLI command failed with "unknown flag" error, so we use a GitHub Actions workflow instead.

---

## Code Patterns

### Data Structure

**Population Data** (in `app.js`):
```javascript
const BUFFALO_DATA = [
  { year: 1800, population: 60000000 },
  { year: 1850, population: 30000000 },
  { year: 1870, population: 5000000 },
  { year: 1880, population: 200000 },
  { year: 1890, population: 1000 },
  { year: 1900, population: 500 }
];
```

**Event Data** (in `app.js`):
```javascript
const EVENTS_DATA = [
  { year: 1830, title: "The Hide Trade Begins", description: "Buffalo robes become fashionable in Europe and eastern US" },
  { year: 1860, title: "Railroads Reach the Plains", description: "Railroads enable mass slaughter from train windows" },
  { year: 1870, title: "The Great Collapse", description: "Population drops from 30M to 5M in a decade" },
  { year: 1874, title: "US Army Campaigns", description: "Military deliberately destroys herds to force Indigenous onto reservations" },
  { year: 1883, title: "The Last of the Herds", description: "Fewer than 1,000 buffalo remain" }
];
```

### Animation Loop

Uses `requestAnimationFrame` for smooth animation:

```javascript
function animate() {
  if (!isPlaying) return;
  
  currentYear += animationSpeed;
  if (currentYear > 1900) {
    currentYear = 1900;
    isPlaying = false;
    updatePlayButton();
  }
  
  updateDisplay();
  requestAnimationFrame(animate);
}
```

### Accessibility Features

- **ARIA labels** on all interactive elements
- **Live regions** for screen reader announcements
- **Keyboard navigation** (Arrow keys, Home, End, Space, Escape)
- **Focus management** with visible indicators
- **Semantic HTML** with proper landmarks
- **Color contrast** WCAG AA compliant

### Event Markers

Event markers are positioned using percentage-based CSS:

```javascript
function createTimelineEventMarkers() {
  EVENTS_DATA.forEach(event => {
    const percentage = ((event.year - 1800) / 100) * 100;
    // Create marker at percentage position
  });
}
```

---

## Common Tasks

### Adding a New Event

1. Add to `EVENTS_DATA` in `app.js`:
```javascript
{ year: 1845, title: "Your Event", description: "Your description" }
```

2. No other changes needed — markers auto-generate!

### Changing Population Data

1. Update `BUFFALO_DATA` in `app.js`
2. The interpolation logic handles everything automatically

### Adjusting Animation Speed

Change `animationSpeed` in `app.js`:
```javascript
const animationSpeed = 0.1; // Years per frame
```

### Changing Colors

Edit CSS custom properties in `styles.css`:
```css
:root {
  --color-primary: #8B4513; /* SaddleBrown */
  --color-accent: #DAA520; /* GoldenRod */
  --color-danger: #DC143C; /* Crimson */
  /* ... */
}
```

---

## Testing Checklist

Before deploying, verify:

- [ ] No console errors
- [ ] Timeline scrubber works
- [ ] Play/pause button works
- [ ] Keyboard navigation works (Arrow keys, Home, End, Space)
- [ ] Event markers appear at correct positions
- [ ] Tooltips show on hover
- [ ] Clicking markers jumps to year
- [ ] Counter turns red below 1 million
- [ ] Mobile responsive (test on phone)
- [ ] Accessibility (screen reader announces changes)
- [ ] GitHub Actions deployment succeeds

### Verification Commands

```bash
# Check deployment status
gh run list

# Navigate to live site
# https://bayarddevries.github.io/buffalo-counter/

# Check console for errors
# (Use browser DevTools)
```

---

## Known Issues & Limitations

### None Currently

The project is in good shape with no known issues.

---

## Future Enhancement Ideas

### Low Effort
- Add more historical events to the timeline
- Add a "Reset" button to return to 1800
- Add a "Share" button to copy URL with current year

### Medium Effort
- Add sound effects (buffalo sounds, train whistles)
- Add a map showing buffalo range shrinking
- Add quotes from historical figures

### High Effort
- Add 3D visualization of buffalo herds
- Add VR experience
- Add multiplayer mode

---

## User Preferences

### Design Philosophy
- "High concept, low effort" — brilliant concepts, fast implementation
- Values automation and clear communication
- Prefers human, conversational copy over corporate buzzwords
- Avoids: "multidisciplinary", "end-to-end", "bridge the gap", "resilient and scalable", "orchestrated agentic", "high-fidelity", "authentic"

### Technical Preferences
- Pure HTML/CSS/JavaScript (no frameworks)
- No build step
- GitHub Pages for deployment
- Accessibility as a core principle
- Mobile responsive

### Communication Style
- Direct, plain language with real voice
- Transparent about background processes
- Clear about what's happening

---

## Context from Memory

### Related Projects
- **Project Heimdall** — 56-case UFO map, similar data visualization approach
- **Métis Homeland Map** — V8, Métis heritage project
- **Shoebox V2** — React/TS project
- **Devries Dynamics** — Portfolio website

### User Background
- Bayard deVries, GPU PC, local models
- 150+ employees across 8 leader teams at Shaw
- Métis heritage focus
- Values automation and clear documentation

### Tech Environment
- WSL on Windows
- 8GB RAM
- GitHub org: Bayarddevries
- 11 repos, 3 archived

---

## Contact & Support

### GitHub Issues
Report bugs or request features: https://github.com/Bayarddevries/buffalo-counter/issues

### Live Site
https://bayarddevries.github.io/buffalo-counter/

### Repository
https://github.com/Bayarddevries/buffalo-counter

---

## Deployment History

### Initial Deployment
- Date: May 12, 2026
- Status: Live and verified
- URL: https://bayarddevries.github.io/buffalo-counter/

### Major Updates
1. **Initial commit** — Single HTML file with full functionality
2. **Refactoring** — Separated into index.html, styles.css, app.js
3. **Accessibility improvements** — ARIA labels, keyboard navigation, screen reader support
4. **Timeline event markers** — Interactive markers with tooltips

### Verification
- GitHub Actions: ✅ Completed successfully
- Console errors: ✅ 0 errors
- Functionality: ✅ All features working
- Accessibility: ✅ WCAG AA compliant

---

## Quick Reference

### Keyboard Shortcuts
- Arrow Left/Right — Move timeline by 1 year
- Shift + Arrow — Move by 10 years
- Home — Jump to 1800
- End — Jump to 1900
- Space/Enter — Play/Pause
- Escape — Stop animation

### File Locations
- Working directory: `/tmp/buffalo-counter`
- Branch: `master`
- Remote: `origin` (https://github.com/Bayarddevries/buffalo-counter.git)

### Key Functions (app.js)
- `updateDisplay()` — Update counter and timeline
- `animate()` — Animation loop
- `createTimelineEventMarkers()` — Generate event markers
- `showTooltip()` — Show event tooltip
- `jumpToYear()` — Jump to specific year
- `updateTimelineEventMarkers()` — Update marker active states

---

## End of AGENTS.md

This document is maintained for future agents working on The Buffalo Counter project. Update it when making significant changes to architecture, deployment, or workflows.
