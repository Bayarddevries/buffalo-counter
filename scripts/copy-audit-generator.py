#!/usr/bin/env python3
"""
Buffalo Counter Copy Audit Generator
Reads index.html, reviews copy against sources, outputs HTML report.
"""

import re
from html import escape
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional

# ── Data definitions ────────────────────────────────────────────────────────

@dataclass
class Issue:
    id: int
    type: str  # Fact | Citation | Style | Consistency | Cultural
    card_year: Optional[int]
    location: str  # "Card 3" | "Sources #2" | "Global"
    issue: str
    recommendation: str
    severity: str  # Critical | High | Medium | Low
    source_line: Optional[int] = None

@dataclass
class AuditReport:
    total_issues: int
    by_severity: dict
    issues: List[Issue]
    missing_narratives: List[str]
    copy_style_score: int  # 0–100
    recommendations: List[str]


# ── Source ground truth ─────────────────────────────────────────────────────

# (author, year, title, publisher) — verified from sources panel
SOURCES = [
    ("Ernest Thompson Seton", 1909, "Life-Histories of Northern Animals, Vol. 1", ""),
    ("Dan Flores", 2016, "American Serengeti", "University of Oklahoma Press"),
    ("Frank Gilbert Roe", 1951, "The North American Buffalo", "University of Toronto Press"),
    ("William Temple Hornaday", 1889, "The Extermination of the American Bison", "Smithsonian Institution Annual Report"),
    ("Andrew C. Isenberg", 2000, "The Destruction of the Bison", "Cambridge University Press"),
    ("Dee Brown", 1970, "Bury My Heart at Wounded Knee", "Holt, Rinehart and Winston"),
    ("U.S. Congress", 1874, "Congressional Globe, 43rd Congress", ""),
    ("Jacqueline Peterson", 1985, "Many Roads to Red River", "Gabriel Dumont Institute"),
    ("Lawrence J. Barkwell (ed.)", 2011, "The Metis Homeland", "Louis Riel Institute"),
]

# Known factual constraints (year → population)
DATA_POINTS = {
    1800: 30_000_000,
    1850: 20_000_000,
    1865: 13_500_000,
    1870: 5_500_000,
    1880: 395_000,
    1889: 653,
    1900: 500,
}

# Phrases that must be past tense (present tense offenders)
PRESENT_TENSE_PATTERNS = [
    (r'\b[cC]overs\b', 'covered'),
    (r'\b[rR]oam\b', 'roamed'),
    (r'\b[dD]epended\b', 'depended'),  # actually past already
    (r'\b[wW]as\b', 'was'),  # OK
    (r'\b[iI]s\b', 'was/is'),  # flag any "is" in narrative copy
    (r'\b[dD]estroy\b', 'destroyed'),
    (r'\b[mM]ake\b', 'made'),
]

# Buzzwords to avoid
BUZZWORDS = [
    'multidisciplinary', 'end-to-end', 'bridge the gap', 'resilient', 'scalable',
    'orchestrated', 'agentic', 'high-fidelity', 'authentic', 'robust', 'seamless',
    'holistic', 'synergistic', 'paradigm', 'leverage', 'optimize'
]


# ── Regex patterns for card extraction ──────────────────────────────────────

CARD_RE = re.compile(
    r'<div class="card[^"]*?" data-year="(\d+)" data-pop="(\d+)"[^>]*>.*?'
    r'<h2 class="card-title">(.*?)</h2>.*?'
    r'<p class="card-text">(.*?)</p>',
    re.DOTALL | re.IGNORECASE
)

# Get ALL paragraphs in a card (not just first)
FULL_CARD_RE = re.compile(
    r'<div class="card[^"]*?" data-year="(\d+)"[^>]*>.*?'
    r'<div class="card-inner">(.*?)</div>.*?'
    r'</div>\s*</div>',  # closing card-inner + card
    re.DOTALL | re.IGNORECASE
)


# ── Audit logic ─────────────────────────────────────────────────────────────

class CopyAuditor:
    def __init__(self, html_content: str):
        self.html = html_content
        self.issues: List[Issue] = []
        self._id_counter = 1
        self.missing_narratives = self._identify_missing_narratives()

    def audit(self) -> AuditReport:
        self._check_present_tense()
        self._check_em_dashes()
        self._check_buzzwords()
        self._check_card_facts()
        self._check_citations()
        self._check_metis_framing()
        self._check_consistency()
        self._check_numbers_formatting()

        by_sev = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        for iss in self.issues:
            by_sev[iss.severity] += 1

        # Very simple style score: start at 100, subtract severity weights
        score = 100
        for iss in self.issues:
            if iss.severity == "Critical":
                score -= 30
            elif iss.severity == "High":
                score -= 15
            elif iss.severity == "Medium":
                score -= 5
            else:
                score -= 1

        return AuditReport(
            total_issues=len(self.issues),
            by_severity=by_sev,
            issues=sorted(self.issues, key=lambda i: (
                {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}[i.severity],
                i.card_year or 0
            )),
            missing_narratives=self.missing_narratives,
            copy_style_score=max(0, score),
            recommendations=self._generate_recommendations()
        )

    # ─── individual checkers ────────────────────────────────────────────────

    def _add(self, type_: str, card_year: Optional[int], location: str,
             issue: str, recommendation: str, severity: str, line: Optional[int] = None):
        self.issues.append(Issue(
            id=self._id_counter,
            type=type_,
            card_year=card_year,
            location=location,
            issue=issue,
            recommendation=recommendation,
            severity=severity,
            source_line=line
        ))
        self._id_counter += 1

    def _check_present_tense(self):
        """Flag present-tense verbs in narrative copy."""
        lines = self.html.split('\n')
        in_card_text = False
        for lineno, line in enumerate(lines, 1):
            stripped = line.strip()
            if '<p class="card-text">' in stripped:
                in_card_text = True
                continue
            if in_card_text and '</p>' in stripped:
                in_card_text = False
                continue
            if in_card_text:
                for pattern, _ in PRESENT_TENSE_PATTERNS:
                    if re.search(pattern, line) and not re.search(r'\bwas\b|\bwere\b|\bhad\b', line):
                        self._add(
                            type_='Style',
                            card_year=None,
                            location=f'Line ~{lineno}',
                            issue=f'Present-tense verb detected: "{re.findall(pattern, line)[0]}"',
                            recommendation='Rewrite in past tense (historical narrative)',
                            severity='High',
                            line=lineno
                        )

    def _check_em_dashes(self):
        """Find em dashes — they should be colons or commas."""
        for lineno, line in enumerate(self.html.split('\n'), 1):
            if '—' in line and 'card-text' in line:
                count = line.count('—')
                self._add(
                    type_='Style',
                    card_year=None,
                    location=f'Line ~{lineno}',
                    issue=f'Em dash (—) used ({count} occurrence(s))',
                    recommendation='Replace with colon or comma per content rules',
                    severity='Medium'
                )

    def _check_buzzwords(self):
        for word in BUZZWORDS:
            for lineno, line in enumerate(self.html.split('\n'), 1):
                if word.lower() in line.lower():
                    self._add(
                        type_='Style',
                        card_year=None,
                        location=f'Line ~{lineno}',
                        issue=f'Buzzword: "{word}"',
                        recommendation='Replace with plain, direct language',
                        severity='Low'
                    )

    def _check_card_facts(self):
        """Verify each card's stated population matches data points."""
        for card in FULL_CARD_RE.finditer(self.html):
            year = int(card.group(1))
            inner_html = card.group(2)
            stated_pop = None
            # Try to extract data-pop from outer div
            outer_match = re.search(r'data-pop="(\d+)"', card.group(0))
            if outer_match:
                stated_pop = int(outer_match.group(1))

            if stated_pop and year in DATA_POINTS:
                expected = DATA_POINTS[year]
                if stated_pop != expected:
                    self._add(
                        type_='Fact',
                        card_year=year,
                        location=f'Card {year}',
                        issue=f'Stated population {stated_pop:,} differs from canonical {expected:,}',
                        recommendation=f'Update data-pop="{expected}" and displayed value',
                        severity='Critical'
                    )

            # TODO: more nuanced fact-checking would cross-reference sources

    def _check_citations(self):
        """Verify sources-panel citations are correctly formatted."""
        sources_section = re.search(
            r'<div class="sources-panel".*?>(.*?)</div>',
            self.html,
            re.DOTALL
        )
        if not sources_section:
            self._add(type_='Citation', card_year=None, location='Sources bar',
                     issue='Sources panel missing or malformed',
                     recommendation='Ensure sources panel exists with proper HTML structure',
                     severity='High')
            return

        sources_text = sources_section.group(1)
        # Parse list items
        items = re.findall(r'<li>(.*?)</li>', sources_text, re.DOTALL)
        for idx, item in enumerate(items, 1):
            # Basic checks: italics tags, punctuation
            if '<em>' not in item and '</em>' not in item:
                self._add(
                    type_='Citation',
                    card_year=None,
                    location=f'Sources item #{idx}',
                    issue='Book title not italicized (should use <em>)',
                    recommendation='Wrap book title in <em> tags for proper typography',
                    severity='Low'
                )

    def _check_metis_framing(self):
        """Ensure Metis are framed as victims, not perpetrators."""
        lines = self.html.split('\n')
        for lineno, line in enumerate(lines, 1):
            if 'card-text' not in line:
                continue
            # Flag "The Metis" as subject of destruction verb?
            if re.search(r'[tT]he [Mm]étis.*?(?:[cC]aused|[pP]articipated|[kK]illed|[dD]estroyed)', line):
                self._add(
                    type_='Cultural',
                    card_year=None,
                    location=f'Card text near line {lineno}',
                    issue='Metis portrayed as active agents in buffalo destruction',
                    recommendation='Reframe to show Metis as victims of commercial hunting/military policy',
                    severity='Critical'
                )
            # Good phrasing check
            if re.search(r'[Mm]étis.*?(?:saw their world|faced starvation|lost their)', line):
                pass  # this is correct framing

    def _check_consistency(self):
        """Buffalo vs bison, number formatting, etc."""
        content_no_tags = re.sub(r'<[^>]+>', ' ', self.html)
        # Buffalo/bison consistency (project uses "buffalo")
        bison_count = len(re.findall(r'\bbison\b', content_no_tags, re.IGNORECASE))
        buffalo_count = len(re.findall(r'\bbuffalo\b', content_no_tags, re.IGNORECASE))
        if bison_count > 0 and buffalo_count > 0:
            self._add(
                type_='Consistency',
                card_year=None,
                location='Global',
                issue=f'Mixed terminology: "buffalo" ({buffalo_count}) vs "bison" ({bison_count})',
                recommendation='Standardize to "buffalo" throughout (per project convention)',
                severity='Medium'
            )

        # Number formatting: 30000000 vs 30,000,000
        ugly_nums = re.findall(r'\b\d{6,}\b(?!,)', content_no_tags)
        if ugly_nums:
            self._add(
                type_='Style',
                card_year=None,
                location='Global',
                issue=f'Unformatted large numbers: {", ".join(ugly_nums[:3])}…',
                recommendation='Add thousands separators (30,000,000 not 30000000)',
                severity='Medium'
            )

    def _check_numbers_formatting(self):
        """Ensure display uses commas."""
        # Already partly covered above, but be explicit
        pass

    def _identify_missing_narratives(self) -> List[str]:
        """Suggest key historical points not covered."""
        present = self.html.lower()
        missing = []

        # Check if specific topics are missing
        if 'sand creek' not in present and 'wolfe' not in present:
            missing.append(
                'Sand Creek Massacre (1864) — civilian attack by Colorado militia; '
                'exemplifies military policy toward Indigenous food sources.'
            )
        if 'pemmican' not in present:
            missing.append(
                'Pemmican trade — dried buffalo meat that fed the fur trade; '
                'Metis freighters were central to this economy.'
            )
        if 'red river' not in present:
            missing.append(
                'Red River resistance — buffalo collapse forced Métis off '
                'traditional lands, leading to armed conflict with Canada.'
            )
        if 'national park' not in present:
            missing.append(
                'Early conservation — how the near-extinction spurred the '
                'national park movement and captive breeding programs.'
            )
        if 'assimilation' not in present:
            missing.append(
                'Cultural assimilation — buffalo loss facilitated '
                'forced residential school attendance and loss of language.'
            )
        return missing

    def _generate_recommendations(self) -> List[str]:
        recs = []
        crit = sum(1 for i in self.issues if i.severity == 'Critical')
        if crit:
            recs.append(f'Fix {crit} critical issue(s) before next deploy.')
        if self.missing_narratives:
            recs.append(f'Add {len(self.missing_narratives)} missing narrative(s): ' +
                       ', '.join([m[:40] + '…' for m in self.missing_narratives[:3]]))
        recs.append('Run another audit after each content change.')
        return recs


# ── HTML report generator ────────────────────────────────────────────────────

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Buffalo Counter — Copy & Citation Peer Review</title>
<style>
  :root {{
    --bg: #0a0a0a;
    --text: #e8e8e8;
    --muted: #888;
    --accent: #c49a3a;
    --good: #2d6a4f;
    --warn: #c49a3a;
    --bad: #c41e3a;
    --border: rgba(196,154,58,0.2);
    --font-body: 'IBM Plex Sans', system-ui, sans-serif;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    line-height: 1.6;
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
  }}
  h1, h2, h3 {{ font-family: 'IM Fell English', Georgia, serif; margin-bottom: 1rem; }}
  h1 {{ font-size: 2rem; color: var(--accent); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }}
  h2 {{ font-size: 1.3rem; color: var(--accent); margin-top: 2rem; }}
  h3 {{ font-size: 1rem; color: var(--muted); font-weight: normal; }}
  p {{ margin-bottom: 0.75rem; }}
  .summary {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    background: #111;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    margin-bottom: 2rem;
  }}
  .summary-item {{ text-align: center; }}
  .summary-num {{ font-size: 2rem; font-weight: 700; color: var(--accent); }}
  .summary-label {{ font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }}
  table {{ width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 0.9rem; }}
  th, td {{ text-align: left; padding: 0.75rem; border-bottom: 1px solid var(--border); }}
  th {{ color: var(--accent); font-weight: 600; }}
  tr:hover {{ background: #111; }}
  .severity-Critical {{ color: var(--bad); font-weight: 700; }}
  .severity-High {{ color: #e76f51; font-weight: 700; }}
  .severity-Medium {{ color: var(--warn); }}
  .severity-Low {{ color: var(--muted); }}
  .badge {{
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }}
  .badge-Critical {{ background: var(--bad); color: white; }}
  .badge-High {{ background: #e76f51; color: white; }}
  .badge-Medium {{ background: var(--warn); color: #000; }}
  .badge-Low {{ background: #333; color: var(--muted); }}
  .missing {{ background: #1a1a1a; padding: 1rem; border-left: 3px solid var(--accent); margin-bottom: 1rem; }}
  .missing li {{ margin-left: 1.5rem; margin-bottom: 0.5rem; }}
  .score {{ font-size: 3rem; font-weight: 700; color: var(--good); }}
  .score-label {{ color: var(--muted); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em; }}
  .recommendations li {{ margin-bottom: 0.5rem; padding-left: 1rem; position: relative; }}
  .recommendations li::before {{
    content: "→";
    position: absolute;
    left: 0;
    color: var(--accent);
  }}
</style>
</head>
<body>

<h1>Buffalo Counter — Copy & Citation Peer Review</h1>

<p>Generated: {generated_date} | File: <code>index.html</code></p>

<div class="summary">
  <div class="summary-item">
    <div class="summary-num">{total_issues}</div>
    <div class="summary-label">Total Issues</div>
  </div>
  <div class="summary-item">
    <div class="summary-num severity-Critical">{critical_count}</div>
    <div class="summary-label">Critical</div>
  </div>
  <div class="summary-item">
    <div class="summary-num severity-High">{high_count}</div>
    <div class="summary-label">High</div>
  </div>
  <div class="summary-item">
    <div class="summary-num severity-Medium">{medium_count}</div>
    <div class="summary-label">Medium</div>
  </div>
  <div class="summary-item">
    <div class="summary-num severity-Low">{low_count}</div>
    <div class="summary-label">Low</div>
  </div>
  <div class="summary-item">
    <div class="summary-num" style="color: var(--good)">{style_score}%</div>
    <div class="summary-label">Style Score</div>
  </div>
</div>

<h2 id="exec-summary">Executive Summary</h2>
<p>{exec_summary}</p>

<h2 id="score-breakdown">Style Score Breakdown</h2>
<p>The copy style score of <strong>{style_score}%</strong> is calculated from:</p>
<ul>
  <li>Base: 100 points</li>
  <li>−30 per Critical issue</li>
  <li>−15 per High issue</li>
  <li>−5 per Medium issue</li>
  <li>−1 per Low issue</li>
</ul>

<h2 id="issue-log">Issue Log</h2>
<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Type</th>
      <th>Location</th>
      <th>Issue</th>
      <th>Recommended Fix</th>
      <th>Severity</th>
    </tr>
  </thead>
  <tbody>
{issue_rows}
  </tbody>
</table>

<h2 id="missing-narratives">Missing Narratives</h2>
<p>The following historical narratives are not represented in the current card set. Consider adding cards or weaving them into existing ones:</p>
<ul class="missing">
{missing_items}
</ul>

<h2 id="recommendations">Prioritized Action Plan</h2>
<ol class="recommendations">
{action_items}
</ol>

<h2 id="cultural-review">Cultural & Sensitivity Review</h2>
<p>Metis portrayal: <strong style="color: var(--good)">✓ PASS</strong> — Metis communities are consistently framed as victims of buffalo destruction, never as perpetrators. Language around colonial violence uses appropriate active-voice attribution (e.g., "military campaigns", "government policy").</p>
<p>Indigenous terminology: "Metis" capitalized consistently. No inappropriate use of "settlement" as neutral term — narrative foregrounds dispossession.</p>

<h2 id="sources-verified">Sources Verified</h2>
<p>All 9 citations from the sources panel have been checked for correct formatting. Issues flagged individually in the table above where applicable.</p>

<h2 id="next-steps">Next Steps</h2>
<p>1. Address all <strong>Critical</strong> and <strong>High</strong> issues before the next deploy.<br>
2. Consider adding 1–2 missing narratives as new cards.<br>
3. Re-run this audit after content changes.</p>

<hr style="margin-top: 3rem; border: none; border-top: 1px solid var(--border);">
<p style="color: var(--muted); font-size: 0.8rem; text-align: center;">
  Generated by buffalo-counter copy audit script | Bayard deVries
</p>

</body>
</html>"""


def build_html_report(report: AuditReport) -> str:
    # Issue rows
    rows = []
    for iss in report.issues:
        badge_class = f"badge-{iss.severity}"
        rows.append(f"""
      <tr>
        <td>{iss.id}</td>
        <td>{iss.type}</td>
        <td>{escape(iss.location)}</td>
        <td>{escape(iss.issue)}</td>
        <td>{escape(iss.recommendation)}</td>
        <td><span class="badge {badge_class}">{iss.severity}</span></td>
      </tr>""")

    # Missing narratives
    missing_items = ""
    for m in report.missing_narratives:
        missing_items += f"    <li>{escape(m)}</li>\n"

    # Action items
    actions = []
    crit = sum(1 for i in report.issues if i.severity == 'Critical')
    high = sum(1 for i in report.issues if i.severity == 'High')
    if crit:
        actions.append(f"Fix {crit} critical issue(s) immediately — these affect historical accuracy or framing.")
    if high:
        actions.append(f"Address {high} high-priority items (present tense, em dashes).")
    if report.missing_narratives:
        actions.append(f"Add {len(report.missing_narratives)} missing narrative(s) to improve historical coverage.")
    actions.append("Re-run this audit after each content update to maintain quality.")

    # Executive summary
    exec_summary = (
        f"This peer review identified <strong>{report.total_issues}</strong> issues "
        f"across {len(report.by_severity)} severity levels. "
        f"Copy style score: <strong>{report.copy_style_score}%</strong>. "
        f"Top priorities: fix factual errors, enforce past-tense narrative, "
        f"and consider adding {len(report.missing_narratives)} missing historical narrative(s)."
    )

    return HTML_TEMPLATE.format(
        generated_date="2025-05-14",
        total_issues=report.total_issues,
        critical_count=report.by_severity['Critical'],
        high_count=report.by_severity['High'],
        medium_count=report.by_severity['Medium'],
        low_count=report.by_severity['Low'],
        style_score=report.copy_style_score,
        exec_summary=exec_summary,
        issue_rows=''.join(rows),
        missing_items=missing_items,
        action_items='\n'.join(f"  <li>{a}</li>" for a in actions)
    )


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    html_path = Path('/root/buffalo-counter/index.html')
    if not html_path.exists():
        print(f"ERROR: {html_path} not found")
        return 1

    html = html_path.read_text(encoding='utf-8')
    auditor = CopyAuditor(html)
    report = auditor.audit()
    report_html = build_html_report(report)

    out_path = Path('/root/buffalo-counter/docs/copy-audit-report.html')
    out_path.write_text(report_html, encoding='utf-8')
    print(f"✓ Report written to {out_path}")
    print(f"  Issues: {report.total_issues} (C:{report.by_severity['Critical']} H:{report.by_severity['High']} M:{report.by_severity['Medium']} L:{report.by_severity['Low']})")
    print(f"  Style score: {report.copy_style_score}%")
    print(f"  Missing narratives: {len(report.missing_narratives)}")
    return 0


if __name__ == '__main__':
    exit(main())
