# The Buffalo Counter — Animated Short

## Narrative Arc

60 million animals. Gone in a century. Not by climate, not by natural disaster — by design.

The "aha moment" isn't just the numbers. It's **the speed**: in one human lifetime, a species that defined an entire continent was reduced to a rounding error. We show the herd as dots at first — then watch them vanish.

**Misconception we correct**: People hear "buffalo were overhunted" and imagine a slow decline. The reality was rapid, coordinated destruction. The animation must feel visceral, not academic.

## Scene List

### Scene 1: "They Were Here First" (8s)
- Title card. Background starts empty. Buffalo silhouettes fade in across the screen, dozens of them, until the frame is full.
- Text: *"Before 1800, the Great Plains were the largest congregation of large land mammals on Earth."*
- Big number slams in: **60,000,000**
- The dots slowly pulse alive.

### Scene 2: "The Slide Begins" (15s)
- The dots become a counter at center screen, reading **60,000,000** in warm golden color.
- A year counter starts at 1800 and ticks upward.
- We animate the population dropping to the data points from the counter: 30M (1850), 5M (1870).
- Each major event appears as a label on a timeline bar at the bottom:
  - 1830: "Hide Trade"
  - 1860: "Railroads"
  - 1870: "Great Collapse"
- The counter color shifts from golden → amber → orange.

### Scene 3: "The Collapse" (18s) — THE AHA MOMENT
- The number turns **CRIMSON**. Everything dims except the counter.
- 5,000,000 → 200,000 → 1,000.
- The year counter races through 1870-1890.
- We show how many were killed PER DAY to make this happen: a stat appears.
- Event labels for "US Army Campaigns" and "Last of the Herds"
- The number slows... stops... at around **500**.
- 3 second silence.

### Scene 4: "The Counter Today" (10s)
- The number stays at ~500. Text fades in: *"This wasn't nature. This was policy."*
- Then: *"Today ~500,000 buffalo exist, all on private ranches. None are truly wild."*
- Credit line: *"bayarddevries.github.io/buffalo-counter — interactive version"*
- Fade to black.

## Color Palette

Modified from the project's warm earth tones:
- **BG**: `#1A1A1A` (very dark, like the web version)
- **PRIMARY (buffalo)**: `#D4A574` (warm tan, derived from SaddleBrown #8B4513 lightened for dark bg)
- **SECONDARY (timeline)**: `#DAA520` (GoldenRod, matching the web's accent)
- **DANGER (warning/final)**: `#DC143C` (Crimson, matching the web's danger color)
- **DIM / CONTEXT**: `#666666`
- **WHITE**: `#EAEAEA`

## Typography

Monospace throughout (Menlo / fallback DejaVu Sans Mono):
- Titles: font_size=48, weight=BOLD
- Numbers: font_size=36-42, weight=BOLD
- Event labels: font_size=20
- Body / context: font_size=22-24
