# The Buffalo Counter

**A scroll-driven visualization of the Great Buffalo Collapse, 1800–1900**

> 30 million buffalo in 1800 → fewer than 500 by 1900

---

## Overview

The Buffalo Counter is an interactive, scroll-driven narrative that shows the catastrophic decline of the North American plains buffalo over the 19th century. Scroll through 8 historical snapshots from 1800 to 1900 and watch the population collapse from 30 million to near-zero.

The collapse wasn't natural — it was deliberate. Commercial hunting, railroad expansion, and US military policy combined to destroy the foundation of Plains Indigenous life. The Métis, who depended on buffalo for food, clothing, and trade, watched their world disappear in a single lifetime.

## Features

- **Scroll-driven narrative** — Full-page CSS scroll-snap cards. Scroll to advance through history
- **Live counter** — Population ticks down as you scroll, displayed in IM Fell English typeface
- **8 historical snapshots** — 1800 (abundance) → 1825 (pressure builds) → 1850 (commercial exploitation) → 1865 (railroads enable mass killing) → 1870 (collapse) → 1880 (scavenging bones) → 1889 (last herds) → 1900 (functional extinction)
- **Color-coded counter** — Green (stable) → gold (declining) → orange (warning) → red (critical) → dark red (extinct)
- **Timeline bar** — Drains from full to empty as the population falls. Color shifts with population level. Pulse animation at critical (<100K) and extinction (<10K) thresholds
- **Citation system** — Every factual claim has an inline citation. Click any `[1]` marker to see the source
- **Sources panel** — 9 academic references with DOI links, collapsible at the bottom of the page
- **Splash intro** — Historical context overlay with period photograph, dismissed on click
- **Responsive** — Works on mobile and desktop with touch scroll
- **Accessible** — ARIA live regions for screen readers, semantic HTML, focus management

## How It Works

The visualization uses linear interpolation between published historical population estimates:

| Year | Population |
|------|------------|
| 1800 | 30,000,000 |
| 1850 | 20,000,000 |
| 1865 | 13,500,000 |
| 1870 | 5,500,000 |
| 1880 | 395,000 |
| 1889 | 653 |
| 1900 | 500 |

The exact pre-contact number is debated (Seton's ~60M vs. Flores' ~30M). This site uses Flores' 30M estimate. The scale of collapse is undisputed regardless of which estimate you use.

## Tech Stack

- **Pure HTML/CSS/JavaScript** — No build step, no frameworks
- **CSS Custom Properties** — Design tokens for theming
- **CSS scroll-snap** — Card-based scroll navigation
- **Google Fonts** — IM Fell English (counter/headings), IBM Plex Sans (body)
- **Responsive design** — Works on mobile and desktop

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

1. **Commercial hide trade** (1830s+) — Buffalo robes became fashionable in Europe and the eastern US. For every robe that reached market, several more buffalo were killed and left to rot — the trade's full toll was far higher than robe counts alone suggest. The robe trade peaked at 250,000 per year by the 1870s.

2. **Railroad expansion** (1860s+) — Railroads enabled mass slaughter. Hunters shot from train windows, leaving carcasses to rot. Hides were shipped east by the trainload.

3. **US military campaigns** (1870s) — The US Army deliberately destroyed buffalo herds as a strategy to force Indigenous peoples onto reservations. "Kill the buffalo, save the man."

4. **Disease** — Cattle brought bovine diseases like brucellosis and Texas fever that spread to buffalo herds, compounding the decline from hunting.

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
├── AGENTS.md               # AI agent instructions
├── CHANGELOG.md            # Version history
├── images/                 # Historical photos
├── scripts/                # Helper scripts
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

## Sources

Every data point and claim in this visualization is sourced from published academic and historical works:

### Population Data
- **Seton, E. T. (1909).** *Life-Histories of Northern Animals*, Vol. 1. Scribner's. — Origin of the ~60 million estimate.
- **Isenberg, A. C. (2000).** *The Destruction of the Bison: An Environmental History, 1750–1920*. Cambridge University Press. [DOI: 10.1017/CBO9780511549861](https://doi.org/10.1017/CBO9780511549861)
- **Flores, D. (2016).** *American Serengeti: The Last Big Animals of the Great Plains*. University of Oklahoma Press. — Estimated ~30 million; carrying capacity analysis.
- **Roe, F. G. (1951).** *The North American Buffalo: A Critical Study of the Species in Its Wild State*. University of Toronto Press.
- **Hornaday, W. T. (1889).** "The Extermination of the American Bison." *Annual Report of the Smithsonian Institution*, pp. 367–548. — First systematic count; documented the crash. (Note: the 1900 population figure of ~500 is from conservation-era records, not Hornaday's 1889 survey.)

### Historical Events & Mechanisms
- **Isenberg (2000).** Ch. 2–5: hide trade, railroads, military campaigns.
- **Brown, D. (1970).** *Bury My Heart at Wounded Knee*. Holt, Rinehart and Winston. Ch. 1–8: railroad slaughter.
- **U.S. Congress (1874).** *Congressional Globe*, 43rd Congress, 1st Session. — Sherman anti-buffalo bill debates, Gen. Sheridan's testimony.

### Métis History & Culture
- **Peterson, J. (1985).** "Many Roads to Red River." *The People in Between*. Gabriel Dumont Institute.
- **Barkwell, L. J., ed. (2011).** *The Métis Homeland*. Louis Riel Institute.
- **Payant, C. (2003).** *The Métis: The People, the History, the Culture*. Fitzhenry & Whiteside.

Population data points shown are linear interpolations between published estimates. The 1900 data point (~500) is estimated from conservation-era records, not from Hornaday's 1889 survey. The exact pre-contact number is debated (Seton's 60M vs. Flores' 30M) — the scale of collapse, however, is undisputed.