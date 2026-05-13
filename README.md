# The Buffalo Counter

**A visualization of the Great Buffalo Collapse, 1800-1900**

> 60,000,000 buffalo in 1800 → fewer than 1,000 by 1900

---

## Overview

The Buffalo Counter is a single-page interactive visualization that shows the catastrophic decline of the North American plains buffalo over the 19th century. Users can scrub through a timeline from 1800 to 1900 and watch the population collapse from 60 million to near-zero.

The collapse wasn't natural — it was deliberate. Commercial hunting, military campaigns, and government policy combined to destroy the foundation of Plains Indigenous life. The Métis, who depended on buffalo for food, clothing, and trade, watched their world disappear in a single lifetime.

## Features

- **Live counter** — Watch the population tick down in real-time
- **Timeline scrubber** — Drag to any year between 1800-1900
- **Play/Pause** — Watch the collapse unfold automatically
- **Historical events** — Key moments that drove the decline
- **Visual feedback** — Counter turns red as population drops below 1 million

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
- **Google Fonts** — Crimson Text (serif), Space Grotesk (sans-serif)
- **Responsive design** — Works on mobile and desktop

## Running Locally

```bash
# Just open the file in a browser
open index.html

# Or serve with Python
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Deployment

Deploy to GitHub Pages:

```bash
git init
git add index.html
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/buffalo-counter.git
git push -u origin main
```

Then enable GitHub Pages in repo settings → source: main branch.

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

## License

CC0 1.0 Universal — Public Domain

## Credits

Created by Bayard deVries as part of the Métis heritage project suite.

Historical population estimates compiled from:
- Isenberg, Andrew C. "The Destruction of the Bison"
- Flores, Dan. "American Serengeti"
- Government reports and contemporary accounts

---

*This visualization is dedicated to the memory of the 60 million buffalo, and to the Métis people who survived their loss.*
