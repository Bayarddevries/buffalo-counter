# Goal Prompt: Buffalo Counter Copy & Citation Audit

**Project:** The Buffalo Counter (buffalo-counter repo)  
**Live URL:** https://bayarddevries.github.io/buffalo-counter/  
**Files to Review:** `index.html` (main content), `sources-bar` citations

---

## Objective
Perform a comprehensive copy audit focused on **historical accuracy, citation integrity, clarity, and consistency**. Deliver a structured report with specific recommendations for any issues found.

---

## Review Scope

### 1. Text Content Review (`index.html` card text)
Scan every card's paragraph copy and identify:

- **Factual accuracy**: population numbers, dates, event descriptions, locations
- **Historical nuance**: ensure causal relationships are correctly stated (e.g., not oversimplifying complex events)
- **Metis framing**: verify Metis are consistently portrayed as victims of buffalo destruction, never as perpetrators
- **Present-tense leakage**: ensure all copy is past tense (narrative historical)
- **Em dash detection**: flag any em dashes (`—`) — should use colons or commas instead
- **Buzzword scan**: remove corporate/contemporary phrasing (multidisciplinary, end-to-end, bridge the gap, resilient, scalable, orchestrated, high-fidelity, authentic, etc.)
- **Sentence structure**: flag run-on sentences or unclear antecedents
- **Repetition**: check for redundant phrasing across cards

### 2. Citation Verification (`sources-bar` panel)
For each citation listed under "Population Estimates & Data", "Historical Events & Mechanisms", and "Metis History & Culture":

- Verify author names, publication years, and titles are accurate
- Confirm each citation actually supports the claims it's paired with in the card text
- Check formatting consistency (italics, punctuation, spacing)
- Identify any missing critical sources (key books/papers on buffalo collapse)
- Flag any dead/obsolete links (though these are display-only text refs)

### 3. Cross-Card Consistency
- Terminology: "buffalo" vs "bison" usage — should be consistent (currently uses "buffalo")
- Date formatting: all years as 4-digit numbers, no ranges without clarification
- Geographic naming: Canada vs Canadian, US vs American, province/state naming
- Number formatting: population figures should be consistently grouped (commas for thousands, no decimal approximations)

### 4. Readability Tone Check
Ensure copy matches "high-concept, low-effort" philosophy:
- Direct, conversational voice — no academic stiffness
- One main idea per paragraph
- Historical present avoided (strictly past tense)
- Emotional resonance without melodrama

---

## Output Format

Produce a structured report with these sections:

```
# Buffalo Counter: Copy & Citation Audit Report

## Executive Summary
- Total issues found: X
- By severity: [Critical: Y, Moderate: Z, Minor: N]
- Quick wins: 2-3 top recommendations

## Issue Log (table)
| # | Type | Location (card/year) | Issue | Recommendation | Severity |
|---|------|---------------------|-------|----------------|----------|
| 1 | Fact | Card 3 (1850) | "250,000 robes/year by 1870s" — cites Flores but exact figure may be mid-1870s peak, not sustained | Change to "peaked at ~250,000 per year by the mid-1870s" | Medium |
| 2 | Citation | Sources, Item 2 | Flores 2016 publisher listed as "University of Oklahoma Press" — correct | ✓ OK | — |
| ... | ... | ... | ... | ... | ... |

## Factual Accuracy Concerns
List any population figures, dates, or causal claims that need verification against source material.

## Citation Health
- Broken/incorrect citations: list
- Missing key sources: list + suggested additions
- Formatting fixes needed: list

## Copy Style Recommendations
- Phrases to replace (buzzwords → plain language)
- Sentence rewrites for clarity
- Tense corrections
- Em dash replacements

## Cultural & Sensitivity Review
- Metis portrayal check: PASS / issues noted
- Indigenous terminology consistency
- Colonial framing language (avoid "settlement" as neutral when discussing dispossession)

## Prioritized Action Plan
1. [Critical] Fix factual error in Card X (citation Y)
2. [High] Replace Z em dashes with commas
3. [Medium] Add clarifying clause to Card N sentence
4. [Low] Tighten phrasing in Card M

## Optional Enhancements
- Suggest 1-2 additional primary sources to cite
- Recommend image caption improvements (if needed)
- Accessibility note: any text needing alt-text or ARIA labels
```

---

## Process Notes

**Sources to consult for verification:**
- Seton, Ernest Thompson. (1909). *Life-Histories of Northern Animals*, Vol. 1.
- Flores, Dan. (2016). *American Serengeti*. University of Oklahoma Press.
- Roe, Frank Gilbert. (1951). *The North American Buffalo*. University of Toronto Press.
- Hornaday, William Temple. (1889). "The Extermination of the American Bison." *Smithsonian Institution Annual Report*.
- Isenberg, Andrew C. (2000). *The Destruction of the Bison*. Cambridge University Press.
- Brown, Dee. (1970). *Bury My Heart at Wounded Knee*.
- U.S. Congress. (1874). *Congressional Globe*, 43rd Congress.
- Peterson, Jacqueline. (1985). "Many Roads to Red River." *The People in Between*. Gabriel Dumont Institute.
- Barkwell, Lawrence J., ed. (2011). *The Metis Homeland*. Louis Riel Institute.

**Focus on high-impact, quick fixes first.**  
Flag anything that would change a reader's understanding if incorrect.

---

**Run this audit whenever copy feels stale or before major design revisions.**
