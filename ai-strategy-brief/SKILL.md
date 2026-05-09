---
name: ai-strategy-brief
preamble-tier: 3
version: 1.0.0
description: |
  Generate a one-page executive brief for an AI strategy topic. Same research depth as
  ai-strategy-researcher but condensed into a decision-ready memo format. Use when the user
  wants a quick strategy summary, executive brief, or decision memo rather than a full
  30-page document. (gstack)
argument-hint: "[topic or vertical -- e.g., 'AI-native insurance brokerage']"
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - WebSearch
  - WebFetch
  - AskUserQuestion
---

# AI Strategy Brief

Generate a concise, one-page executive decision memo for an AI strategy topic.

## Task

Given a topic or vertical, conduct focused research and produce a single-page Word document (.docx) that a CEO or investor can read in 2 minutes and act on.

## Research (Compressed)

Run these searches in parallel — collect signal, not exhaustive data:

1. **Market signal** -- What just happened? (largest recent fundraise, acquisition, or partnership)
2. **Competitive proof** -- Who is winning and at what scale? (top 3 companies, ARR/valuation)
3. **VC thesis** -- What are Sequoia/a16z/Emergence saying about this space?
4. **Risk signal** -- What has failed and why?

Aim for 8-12 high-quality sources. Depth over breadth.

## Document Format

Generate a single-page Word document with this exact structure:

### Layout: Decision Memo

```
EXECUTIVE BRIEF: {TOPIC}
Date: {date} | Sources: {count} references

---

THE SIGNAL
One paragraph (3-4 sentences). What just happened in this market
and why it matters now. Lead with the biggest number or event.

THE OPPORTUNITY
- Bullet 1: TAM / market size with source
- Bullet 2: Growth rate or adoption curve
- Bullet 3: Key structural advantage for AI-native players

WHO IS WINNING
| Company | Stage | Key Metric | Moat |
|---------|-------|------------|------|
| ...     | ...   | ...        | ...  |
(Top 3-5 companies, one row each)

THE RISK
2-3 sentences on Mirage PMF risk and primary failure mode.
What looks like product-market fit but isn't?

FRAMEWORK FIT
- Copilot vs Autopilot: {where this lands and why}
- Intelligence Ratio: {high/medium/low} -- {one-line justification}
- Verdict: {GO / CONDITIONAL / WAIT} with one-line rationale

REFERENCES (compact)
[1] Source Name -- URL
[2] Source Name -- URL
...
```

### Document Standards
- Single page -- max 500 words of body content
- `Calibri` font, `Pt(11)` body
- One table only (Who Is Winning)
- No cover page, no TOC -- this is a memo, not a report
- Bold section headers, tight spacing
- References as numbered footnotes at bottom

### File Output
- Save as: `{topic-slug}-brief-{month}{year}.docx`
- Example: `ai-native-insurance-brief-may2026.docx`
- Clean up Python generator script after creation

## Python Dependencies

```bash
pip install python-docx
```

## Quality Checklist

Before delivering:
- [ ] Fits on one printed page (under 500 words body)
- [ ] THE SIGNAL paragraph has a concrete number or event
- [ ] WHO IS WINNING table has 3+ companies with real metrics
- [ ] Framework verdict is one of: GO / CONDITIONAL / WAIT
- [ ] 8+ referenced URLs
- [ ] No fluff, no filler, every sentence carries signal
