---
name: vertical-scorer
preamble-tier: 3
version: 1.0.0
description: |
  Score an AI vertical or business idea against established VC frameworks (Sequoia, Emergence,
  YC). Produces a structured scorecard with intelligence ratio, outsourcing readiness, TAM,
  Mirage PMF risk, and an overall GO/WAIT/PASS verdict. Use when the user wants to evaluate
  a vertical, compare opportunities, or prioritize which AI-native service to build. (gstack)
argument-hint: "[vertical to score -- e.g., 'AI-native accounting', 'AI legal services']"
allowed-tools:
  - Bash
  - Read
  - Write
  - WebSearch
  - WebFetch
  - AskUserQuestion
---

# Vertical Scorer

Score an AI vertical against established VC frameworks and produce a structured scorecard.

## Task

Given one or more verticals, run focused research and output a scored evaluation that helps the user decide where to invest time and capital.

## Scoring Framework

### The 7 Dimensions

Each dimension is scored 1-5 with a brief justification:

| # | Dimension | What to measure | Source |
|---|-----------|----------------|--------|
| 1 | **Intelligence Ratio** | % of work that is pattern recognition vs. novel judgment | Emergence Capital framework |
| 2 | **Outsourcing Readiness** | % of this work already outsourced to humans (BPOs, contractors) | Market data, industry reports |
| 3 | **TAM Accessibility** | Total addressable market that AI can realistically capture in 3 years | Analyst reports, VC estimates |
| 4 | **Data Moat Potential** | Can a proprietary dataset be built through operations? | Competitive analysis |
| 5 | **Regulatory Friction** | How much regulation slows AI adoption (inverse: 5 = low friction) | Industry compliance landscape |
| 6 | **Incumbent Vulnerability** | Are incumbents slow, fragmented, or tech-averse? | Market structure analysis |
| 7 | **Mirage PMF Risk** | Risk that early traction is false signal (inverse: 5 = low risk) | Failure case analysis |

### Scoring Guide

```
5 = Exceptional — clear structural advantage for AI
4 = Strong — favorable conditions with minor caveats
3 = Moderate — mixed signals, execution-dependent
2 = Weak — significant headwinds
1 = Poor — structural barriers to AI disruption
```

## Research Protocol

For each vertical, run these searches in parallel:

1. **"[vertical] AI startup funding 2024 2025"** -- Who is getting funded?
2. **"[vertical] outsourcing BPO market size"** -- How much is already outsourced?
3. **"[vertical] AI regulation compliance"** -- What are the regulatory barriers?
4. **"[vertical] AI failure pivot shutdown"** -- What has failed?
5. **"[vertical] market size TAM"** -- How big is the opportunity?

Collect 5-8 sources per vertical. Speed over exhaustiveness.

## Output Format

### Single Vertical

Output directly to the conversation as a formatted scorecard:

```
VERTICAL SCORECARD: {VERTICAL NAME}
══════════════════════════════════════

  Dimension              Score   Signal
  ─────────────────────  ─────   ──────────────────────────────
  Intelligence Ratio     X/5     {one-line justification}
  Outsourcing Readiness  X/5     {one-line justification}
  TAM Accessibility      X/5     {one-line justification}
  Data Moat Potential    X/5     {one-line justification}
  Regulatory Friction    X/5     {one-line justification}
  Incumbent Vulnerability X/5    {one-line justification}
  Mirage PMF Risk        X/5     {one-line justification}
  ─────────────────────  ─────
  COMPOSITE SCORE        XX/35

  VERDICT: {GO / CONDITIONAL / WAIT / PASS}
  Rationale: {2-3 sentences on why}

  Copilot → Autopilot Path:
  {describe the progression from human-assisted to fully autonomous}

  Key Risk: {single biggest thing that could kill this}

  Sources: [1] ... [2] ... [3] ...
```

### Multi-Vertical Comparison

When scoring 2+ verticals, also generate a comparison table:

```
VERTICAL COMPARISON MATRIX
══════════════════════════════════════════════════════════════

Dimension            | Vertical A | Vertical B | Vertical C
─────────────────────|────────────|────────────|───────────
Intelligence Ratio   |    4/5     |    3/5     |    5/5
Outsourcing Ready    |    3/5     |    5/5     |    2/5
TAM Accessibility    |    4/5     |    4/5     |    3/5
Data Moat            |    3/5     |    2/5     |    4/5
Regulatory Friction  |    4/5     |    2/5     |    5/5
Incumbent Vuln.      |    5/5     |    3/5     |    4/5
Mirage PMF Risk      |    3/5     |    4/5     |    3/5
─────────────────────|────────────|────────────|───────────
COMPOSITE            |   26/35    |   23/35    |   26/35
VERDICT              |    GO      | CONDITIONAL|    GO

RECOMMENDATION: {which vertical to prioritize and why}
```

### Optional: Save to File

If the user requests, save the scorecard as:
- `{vertical-slug}-scorecard-{month}{year}.md` for single vertical
- `vertical-comparison-{month}{year}.md` for multi-vertical

## Composite Score Interpretation

| Range | Verdict | Meaning |
|-------|---------|---------|
| 30-35 | **GO** | Strong structural fit. Execute now. |
| 24-29 | **CONDITIONAL** | Promising but execution-dependent. Identify the 1-2 weak dimensions and plan mitigations. |
| 17-23 | **WAIT** | Headwinds outweigh tailwinds. Monitor for structural changes. |
| 7-16 | **PASS** | Structural barriers too high. Look elsewhere. |

## Notes

- Scores must be justified with evidence, not vibes
- Always include at least one failure case in Mirage PMF assessment
- For multi-vertical, explicitly state which vertical to prioritize
- The Copilot-to-Autopilot path is critical -- verticals that can't articulate this path score lower on Intelligence Ratio
- Keep the output scannable -- this is a decision tool, not a report
