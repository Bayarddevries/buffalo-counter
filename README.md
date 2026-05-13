# The Buffalo Counter

**A visualization of the Great Buffalo Collapse, 1800-1900**

> 60,000,000 buffalo in 1800 → fewer than 1,000 by 1900

---

## Overview

The Buffalo Counter is an accessible, interactive visualization that shows the catastrophic decline of the North American plains buffalo over the 19th century. Users can scrub through a timeline from 1800 to 1900 and watch the population collapse from 60 million to near-zero.

The collapse wasn't natural — it was deliberate. Commercial hunting, military campaigns, and government policy combined to destroy the foundation of Plains Indigenous life. The Métis, who depended on buffalo for food, clothing, and trade, watched their world disappear in a single lifetime.

## Features

- **Live counter** — Watch the population tick down in real-time
- **Timeline scrubber** — Drag or click to any year between 1800-1900
- **Keyboard navigation** — Full keyboard support (Arrow keys, Home, End, Space)
- **Play/Pause** — Watch the collapse unfold automatically
- **Touch support** — Works on mobile devices with touch gestures
- **Historical events** — Key moments that drive the decline
- **Visual feedback** — Counter turns red as population drops below 1 million
- **Status indicator** — Real-time status updates for screen readers
- **Accessible** — Full ARIA support, semantic HTML, keyboard navigation

## Accessibility

This project is designed with accessibility as a core principle:

- **ARIA labels and live regions** — Screen readers announce changes
- **Keyboard navigation** — Full keyboard support without a mouse
- **Semantic HTML** — Proper landmarks and heading hierarchy
- **Focus management** — Visible focus indicators
- **Color contrast** — WCAG AA compliant color ratios
- **Reduced motion** — Respects prefers-reduced-motion preference
- **Skip link** — Allows keyboard users to skip to main content

## How It Works

The visualization uses linear interpolation between historical population estimates:

| Year | Population |
|------|------------|
| 1800 | 60,000,000 |
| 1850 | 30,000,000 |
| 1870 | 5,000,000 |
| 1880 | 200,000 |
| 1890 | 1,000 |
| 1900 | 500 |

## Tech Stack

- **Pure HTML/CSS/JavaScript** — No build step, no frameworks
- **CSS Custom Properties** — Design tokens for theming
- **Google Fonts** — Crimson Text (serif), Space Grotesk (sans-serif)
- **Responsive design** — Works on mobile and desktop
- **Accessibility** — ARIA, semantic HTML, keyboard navigation

## Running Locally

```bash
# Clone the repository
git clone https://github.com/Bayarddevries/buffalo-counter.git
cd buffalo-counter

# Just open the file in a browser
open index.html

# Or serve with Python
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Keyboard Shortcuts

- **Arrow Left/Right** — Move timeline by 1 year (Shift + Arrow for 10 years)
- **Home** — Jump to 1800
- **End** — Jump to 1900
- **Space/Enter** — Play/Pause animation
- **Escape** — Stop animation

## Deployment

Deploy to GitHub Pages:

```bash
# The repository is already set up with GitHub Actions
# Just push to the master branch
git add .
git commit -m "Your message"
git push
```

The `.github/workflows/deploy.yml` workflow automatically deploys to GitHub Pages on every push to the master branch.

## Historical Context

The buffalo collapse was driven by multiple factors:

1. **Commercial hide trade** (1830s+) — Buffalo robes became fashionable in Europe and the eastern US. Each robe required 3-4 buffalo killed.

2. **Railroad expansion** (1860s+) — Railroads enabled mass slaughter. Hunters shot from train windows, leaving carcasses to rot. Hides were shipped east by the trainload.

3. **US military campaigns** (1870s) — The US Army deliberately destroyed buffalo herds as a strategy to force Indigenous peoples onto reservations. "Kill the buffalo, save the man."

4. **Disease** — Cattle brought diseases like Texas fever that devastated buffalo herds.

## Impact on Métis Communities

The Métis people of the Red River region depended entirely on buffalo:
- **Food** — Dried pemmican was their staple
- **Clothing** — Robes and moccasins
- **Trade** — Buffalo products were their economic foundation
- **Culture** — Buffalo hunts were central to social and spiritual life

When the buffalo disappeared, Métis communities faced starvation and economic collapse. This trauma is central to Métis history and identity.

## Project Structure

```
buffalo-counter/
├── index.html              # Main HTML file
├── styles.css              # All styles
├── app.js                  # All JavaScript
├── README.md               # This file
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages deployment
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

CC0 1.0 Universal — Public Domain

## Citation

Every data point and claim in this visualization is sourced from published academic and historical works:

### Population Data
- **Seton, E. T. (1909).** *Life-Histories of Northern Animals*, Vol. 1. Scribner's. — Origin of the ~60 million estimate.
- **Isenberg, A. C. (2000).** *The Destruction of the Bison: An Environmental History, 1750–1920*. Cambridge University Press. [DOI: 10.1017/CBO9780511549861](https://doi.org/10.1017/CBO9780511549861)
- **Flores, D. (2016).** *American Serengeti: The Last Big Animals of the Great Plains*. University of Oklahoma Press. — Estimated ~30 million; carrying capacity analysis.
- **Roe, F. G. (1951).** *The North American Buffalo: A Critical Study of the Species in Its Wild State*. University of Toronto Press.
- **Hornaday, W. T. (1889).** "The Extermination of the American Bison." *Annual Report of the Smithsonian Institution*, pp. 367–548. — First systematic count; documented the crash.

### Historical Events & Mechanisms
- **Isenberg (2000).** Ch. 2–5: hide trade, railroads, military campaigns.
- **Brown, D. (1970).** *Bury My Heart at Wounded Knee*. Holt, Rinehart and Winston. Ch. 1–8: railroad slaughter.
- **U.S. Congress (1874).** *Congressional Globe*, 43rd Congress, 1st Session. — Sherman anti-buffalo bill debates, Gen. Sheridan's testimony.

### Métis History & Culture
- **Peterson, J. (1985).** "Many Roads to Red River." *The People in Between*. Gabriel Dumont Institute.
- **Barkwell, L. J., ed. (2011).** *The Métis Homeland*. Louis Riel Institute.
- **Payant, C. (2003).** *The Métis: The People, the History, the Culture*. Fitzhenry & Whiteside.

Population data points shown are linear interpolations between published estimates. The exact pre-contact number is debated (Seton's 60M vs. Flores' 30M) — the scale of collapse, however, is undisputed.

---

## License
