# designdotmd.directory submission draft — gstack

**Captured:** 2026-04-24
**Target directory:** [designdotmd.directory](https://designdotmd.directory/)
**Directory maintainer:** Rodrigo Figueroa (`@bidah` on X/Twitter; `rodrigofigueroa.name@gmail.com` via npm registry)
**CLI / package:** [`designdotmd` on npm](https://www.npmjs.com/package/designdotmd) — Apache-2.0

## What I found about the submission path

Short version: **there is no public submission PR flow.** All 156 entries in the directory are authored by "Rofi" (the maintainer). The directory is a solo-curated catalog.

Evidence (all captured 2026-04-24):

| Check | Result |
|:------|:-------|
| `GET /api/designs` — author field across all 156 entries | Every entry has `author: "Rofi"` — no community contributors yet |
| npm package `designdotmd` repository/homepage/bugs fields | All `null` — source code is not publicly hosted |
| GitHub search for `designdotmd` repos | No public repository found |
| `OPTIONS /api/designs` CORS headers | `access-control-allow-methods: GET, POST, OPTIONS` — POST exists but is not documented for public use |
| CLI's `add` command accepts a `<token>` arg described as *"a private access token from your commission email"* | Confirms the paid-commission path; no documented public submission path |
| Hash routes tested (`#/submit`, `#/contribute`, `#/apply`, `#/new`, `#/contact`, `#/commission`) | All return the SPA shell (hash routing); no visible server-side endpoint |

## Implications for gstack

Three realistic paths, ranked by effort vs. likelihood of success:

### Path A — Direct outreach to the maintainer (recommended)

Email or DM asking whether community submissions are being accepted. Keep it short, link to gstack's already-spec-compliant DESIGN.md, mention it passes `npx @google/design.md lint` cleanly. @bidah is an active builder; solo maintainers of growing directories often welcome a first community entry because it converts them from "personal project" to "registry" in one move.

### Path B — Commission the inclusion (paid)

The private-token mechanism exists. If the maintainer accepts commissioned additions (unclear from public materials), paying for a listing would be fast but inverts the relationship — you become a customer rather than a community contributor. Probably wrong signal for gstack, whose whole point is "open-source AI engineering team."

### Path C — Wait for a public submission flow

The CORS `POST /api/designs` hint suggests infrastructure exists. A `/submit` page or GitHub contribution flow may land in a future release. Re-check quarterly. Not actionable today.

## Recommendation

**Path A, with Path C as a fallback.** Send the outreach below to `@bidah` (Twitter/X DM is likely faster than email for a directory of this stage). If it lands, gstack becomes the first community entry — a genuine story beat, not just a listing.

## Outreach draft — Twitter/X DM to @bidah

> Hi — love what you're building with designdotmd.directory. I noticed every entry is authored by you; is the directory accepting community submissions yet?
>
> I run [gstack](https://github.com/shekerkamma/gstack), an open-source CLI that turns Claude Code into an engineering team. We just migrated our DESIGN.md to the Google Labs spec and it passes `npx @google/design.md lint` cleanly: 0 errors, 19 colors, 10 typography scales, 12 components. Industrial/utilitarian aesthetic (Satoshi + DM Sans + JetBrains Mono, amber-on-near-black — would slot naturally into the Technical + Dark + Mono cluster alongside terminal, obsidian, graphite).
>
> Happy to format however you need (PR, YAML snippet, fork, whatever). If you'd prefer to keep the directory solo-authored for now, totally understood — I'll watch for a community submission process down the line.
>
> File: https://github.com/shekerkamma/gstack/blob/main/DESIGN.md

## Outreach draft — email fallback

**To:** rodrigofigueroa.name@gmail.com
**Subject:** designdotmd.directory — community submission inquiry (gstack)

> Hi Rodrigo,
>
> I'm writing about designdotmd.directory — genuinely useful work, the categorization and the CLI install flow both feel well-judged.
>
> I noticed all 156 entries are authored by you. I wanted to ask whether the directory is accepting community submissions yet, or whether that's a future-phase intent.
>
> Context: I maintain [gstack](https://github.com/shekerkamma/gstack), an Apache-2.0 CLI that installs Claude Code skills for building virtual engineering teams. We recently migrated our DESIGN.md to the Google Labs spec (alpha) and it lints clean. The aesthetic would fit the Technical + Dark + Mono cluster — specifically it's differentiated from terminal/obsidian/graphite in one way worth flagging: our `primary` is a warm amber accent (`#F59E0B`) rather than the near-white all five neighbors use. It's a deliberate brand-as-primary choice, not a drift.
>
> If you're open to community submissions, I can deliver whatever format fits your workflow — a PR to a private repo, a YAML snippet, or a hosted URL you can mirror. If you'd rather keep the directory first-party only for now, no issue at all — I'll keep an eye out for a future community flow.
>
> DESIGN.md: https://github.com/shekerkamma/gstack/blob/main/DESIGN.md
> Repo: https://github.com/shekerkamma/gstack
> Lint result: 0 errors, 7 unused-token warnings (all intentional light-mode/scale tokens kept for future components)
>
> Thanks for making the spec more tangible through the directory.
>
> — Sheker Kamma

## Metadata packet (ready to send if the maintainer asks for a structured payload)

If the maintainer responds asking for a structured entry, send this YAML + the DESIGN.md file URL:

```yaml
id: gstack
name: gstack
author: Sheker Kamma / gstack maintainers
tags:
  - Technical
  - Dark
  - Mono
tagline: Industrial amber-on-near-black for a CLI that turns Claude Code into an engineering team.
source_url: https://github.com/shekerkamma/gstack/blob/main/DESIGN.md
license: Apache-2.0
lint_status:
  tool: "@google/design.md"
  version: alpha
  errors: 0
  warnings: 7
  warnings_type: unused-token (all intentional — light-mode/scale tokens)
category_position:
  closest_peers: [terminal, obsidian, graphite, zed-dev, devops-graphite]
  deliberate_divergence: |
    Only entry in Technical + Dark category using a warm accent
    (#F59E0B amber) as `primary`; all five peers use near-white as
    `primary`. Intentional brand-as-primary choice.
```

## What this file is

A record of the submission attempt — captured here so that if/when a community flow opens, the work to submit is already drafted. If the outreach succeeds, update this file with the outcome; if it doesn't, keep it as documentation of why gstack isn't in the directory yet.
