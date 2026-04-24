---
version: alpha
name: gstack
description: Industrial/utilitarian design system for gstack — a CLI tool that turns Claude Code into a virtual engineering team. Dark mode is default.

colors:
  primary: "#F59E0B"
  primary-accent: "#FBBF24"
  on-primary: "#0C0C0C"

  primary-light: "#D97706"
  primary-accent-light: "#B45309"

  neutral-50: "#FAFAFA"
  neutral-400: "#A1A1AA"
  neutral-600: "#52525B"
  neutral-800: "#27272A"

  base: "#0C0C0C"
  surface: "#141414"
  border: "#262626"

  base-light: "#FAFAF9"
  surface-light: "#FFFFFF"
  border-light: "#E7E5E4"

  success: "#16A34A"
  warning: "#F59E0B"
  error: "#DC2626"
  info: "#2563EB"

typography:
  hero:
    fontFamily: Satoshi
    fontSize: 72px
    fontWeight: "900"
    lineHeight: 72px
    letterSpacing: -0.03em
  h1:
    fontFamily: Satoshi
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.02em
  h2:
    fontFamily: Satoshi
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.015em
  h3:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  h4:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: "600"
    lineHeight: 28px
  body:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  caption:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: "500"
    lineHeight: 18px
  micro:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    fontFeature: "'tnum' on"
  nano:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
    fontFeature: "'tnum' on"

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
  max-content: 1200px

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

components:
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral-50}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-light:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.neutral-800}"
    rounded: "{rounded.lg}"
    padding: 24px

  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-accent}"

  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-accent}"
    rounded: "{rounded.md}"
    padding: 12px

  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral-50}"
    rounded: "{rounded.md}"
    padding: 8px

  badge:
    backgroundColor: "{colors.neutral-800}"
    textColor: "{colors.neutral-50}"
    typography: "{typography.nano}"
    rounded: "{rounded.full}"
    padding: 4px
  badge-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.base}"
  badge-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.base}"
  badge-error:
    backgroundColor: "{colors.error}"
    textColor: "{colors.neutral-50}"
  badge-info:
    backgroundColor: "{colors.info}"
    textColor: "{colors.neutral-50}"

  skill-bar:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    height: 4px
---

# Design System — gstack

## Overview

gstack is a CLI tool that turns Claude Code into a virtual engineering team. The community website is a **dashboard + marketing site hybrid** aimed at developers discovering gstack and existing community members. Its peers are Linear, Raycast, Warp, and Zed.

**Direction — Industrial/Utilitarian.** Function-first, data-dense, with monospace as the personality font. The CLI heritage *is* the brand. Serious tool built by someone who cares about craft. Warm, not cold.

**Decoration level — Intentional, not maximal.** A subtle grain texture lives on every surface to prevent generic-SaaS-template flatness. Animation is reserved for comprehension aids (the live feed IS the motion).

**Reference points:** formulae.brew.sh (the competitor we're beating on interactivity), Linear (dark + restrained), Warp (warm accents on a terminal).

## Colors

The palette is restrained by design — the amber accent is rare and meaningful, used only where interaction happens. Dashboard data carries the color; the chrome stays neutral.

- **Primary (`#F59E0B` amber-500 / `#D97706` amber-600 in light mode):** Warm, energetic — reads as "terminal cursor." The sole driver for CTAs and dashboard highlights. amber-500 works against near-black; amber-600 is the sweet spot against white (amber-500 is too bright/washed; amber-700 is too umber).
- **Primary accent (`#FBBF24` amber-400 / `#B45309` amber-700 in light mode):** For primary-colored *text*, which needs slightly different contrast than surfaces.
- **Neutrals (cool zinc grays, `#FAFAFA` → `#27272A`):** All structural chrome — backgrounds, borders, body copy. Cool rather than warm so the amber reads even warmer by contrast.
- **Semantic (`success #16A34A`, `warning #F59E0B`, `error #DC2626`, `info #2563EB`):** Used sparingly in badges and toasts. Tuned to the 600-tier so white text on a semantic fill passes WCAG AA contrast. Note that `warning` intentionally shares the primary amber — warnings and primary actions are visually aligned because both demand attention.

**Dark mode is default.** Base `#0C0C0C`, surface cards `#141414`, borders `#262626`. **Light mode** uses a warm stone base (`#FAFAF9`) with white surface cards and stone borders (`#E7E5E4`). The amber accent *shifts* between modes — don't use `primary` in both; use `primary` on dark and `primary-light` on light.

## Typography

Three typefaces, each with a deliberate role.

- **Display / Hero — Satoshi (Black 900 / Bold 700).** Geometric with warmth, distinctive letterforms (the lowercase `a` and `g` carry the brand). Not Inter. Not Geist. Loaded from Fontshare.
- **Body / UI — DM Sans (Regular 400 / Medium 500 / Semibold 600).** Clean, readable, slightly friendlier than a pure geometric display face.
- **Data / Labels / Code — JetBrains Mono (Regular 400 / Medium 500).** The personality font. Monospace should be *prominent* — it does not hide in code blocks. Tabular numerals (`'tnum' on`) are mandatory for all numeric data.

**Loading strategy:** Google Fonts for DM Sans + JetBrains Mono, Fontshare for Satoshi. All with `display=swap`.

**Scale logic:** Display sizes (`hero` / `h1` / `h2`) use Satoshi with negative letter-spacing. Mid-scale (`h3` / `h4` / `body`) uses DM Sans. Small sizes (`micro` / `nano`) drop to JetBrains Mono — when text is this small, monospace reads better than a proportional face.

## Layout

**Grid-disciplined for the dashboard, editorial-hero for the landing page.** Two different strategies because two different goals — a dashboard is information-dense and benefits from a strict 12-column grid; a landing page benefits from asymmetric editorial composition.

- **Grid:** 12 columns at `lg+` breakpoints, single-column at mobile.
- **Max content width:** `1200px` (6xl) — wider feels like a marketing site, narrower feels cramped for data.
- **Base unit:** `4px`. All spacing is a multiple (see `spacing` tokens).
- **Density:** Comfortable. Not Bloomberg Terminal cramped, not marketing-site spacious.

## Elevation & Depth

Depth is conveyed through **tonal layering** plus a materiality overlay — not drop shadows. Flat surfaces with subtle texture differentiation.

- **Surface hierarchy:** `base` (page) → `surface` (cards) → border contrast. No shadows required; the tonal step does the work.
- **Grain texture:** A subtle SVG noise overlay (via `feTurbulence` filter) on every page, applied as a fixed-position `body::after` pseudo-element.
  - Dark mode opacity: `0.03`
  - Light mode opacity: `0.02`
  - `pointer-events: none`, `z-index: 9999`
- **Why grain:** Without it, flat dark surfaces look like every other SaaS. With it, surfaces read as *material* — a matte finish rather than a generic CSS gradient.

## Shapes

Rounded corners signal the element's *role*, not its size.

- **Cards / panels** → `rounded.lg` (12px) — comfortable, approachable container.
- **Buttons / inputs** → `rounded.md` (8px) — crisp but not sharp.
- **Badges / pills** → `rounded.full` (9999px) — fully rounded, signals a status or count.
- **Skill bars** → `rounded.sm` (4px) — subtle, utilitarian bars.

Never mix these — a 12px-rounded button in a sea of 8px buttons breaks the system.

## Components

See YAML tokens for precise values. Component design rules:

- **Buttons:** Primary uses `primary` fill with `on-primary` text (near-black on amber). Hover uses `primary-accent`. Secondary uses `surface` fill with `primary-accent` text — *never* the inverse.
- **Inputs:** Background matches `surface` (not `base`) so inputs sit *in* cards, not *on* the page.
- **Badges:** Neutral badges use `neutral-800` fill. Semantic badges (`badge-success`, `badge-warning`, `badge-error`, `badge-info`) use the semantic color as fill. Badge text uses `nano` typography — always tabular-mono.
- **Skill bars:** Fixed 4px height, primary fill. The fill animation (`600ms ease-out`) is the signature motion.

## Do's and Don'ts

**Do:**
- Use `primary` amber sparingly — CTAs, active states, live data indicators.
- Let monospace be visible. JetBrains Mono in badges, labels, data tables — not hidden in code blocks.
- Apply the grain texture globally. It's foundational to the materiality.
- Use `rounded.full` for badges and pills to signal status/count semantics.

**Don't:**
- Don't use `primary` on light-mode surfaces — use `primary-light` instead.
- Don't add drop shadows. Depth comes from tonal layering + grain.
- Don't mix corner radii within a single component family (all buttons = 8px).
- Don't use warm-neutral grays. The neutrals are *cool zinc* — warm grays will clash with the amber accent.
- Don't use Inter, Geist, or any other geometric sans in place of Satoshi. The distinctive `a` and `g` are the brand.

## Motion

*Non-standard section — preserved per spec rule on unknown sections.*

**Approach — minimal-functional.** Only transitions that aid comprehension. The dashboard's live feed IS the motion; nothing else should compete.

- **Easing:** enter `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out), exit `ease-in`, move `ease-in-out`.
- **Duration:** micro `50–100ms`, short `150ms`, medium `250ms`, long `400ms`.
- **Animated elements:** live feed dot pulse (2s infinite), skill bar fill (600ms ease-out), hover states (150ms).

## Decisions Log

*Non-standard section — preserved per spec rule on unknown sections.*

| Date | Decision | Rationale |
|:-----|:---------|:----------|
| 2026-03-21 | Initial design system | Created by `/design-consultation`. Industrial aesthetic, warm amber accent, Satoshi + DM Sans + JetBrains Mono. |
| 2026-03-21 | Light mode amber-600 | amber-500 too bright/washed against white; amber-700 too brown/umber. amber-600 is the sweet spot. |
| 2026-03-21 | Grain texture | Adds materiality to flat dark surfaces. Prevents the "generic SaaS template" sameness. |
| 2026-04-24 | Migrated to DESIGN.md spec (Google Labs, alpha) | Tokens moved to YAML front matter for machine-readable consumption. Prose kept as rationale. Enables `npx @google/design.md lint`. |
| 2026-04-24 | Semantic colors moved to 600-tier | Spec lint flagged WCAG AA contrast failures on `badge-error` (3.61:1) and `badge-info` (3.52:1). Darkened `error` `#EF4444` → `#DC2626` and `info` `#3B82F6` → `#2563EB`; also moved `success` to `#16A34A` for consistency. All badge text/fill pairs now pass AA. |
