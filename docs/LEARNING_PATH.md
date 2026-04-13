# gstack learning path

Eight phases, each builds on the last. Roughly 6-8 hours of focused reading
and hands-on. At the end you should be able to locate any feature of gstack
in under ten seconds and extend any subsystem without guessing.

Each phase has:
- A **goal** — the mental model you're building.
- **Files to read**, in order.
- A **check** — a question you should be able to answer before moving on.

Check the boxes as you go. Skip nothing; the phases layer.

---

## Phase 1 — What gstack is and why it exists

**Goal.** Internalize the framing before touching code. gstack is a skills
collection plus a runtime for AI coding agents — not a library, not a
product. Its thesis: workflows belong in disciplined, testable templates,
not ad-hoc prompts.

- [ ] Read [../README.md](../README.md) top to bottom.
- [ ] Read [../ETHOS.md](../ETHOS.md). This is the philosophical core: Boil
      the Lake, Search Before Building, the Completeness Principle.
- [ ] Read [../CLAUDE.md](../CLAUDE.md). Note the sections on SKILL workflow,
      platform-agnostic design, CHANGELOG style, and the E2E eval blame
      protocol.

**Check.** Why do skills use `.tmpl` files at all instead of writing SKILL.md
directly? (Hint: multi-host output + generator-driven placeholders + a single
source of truth that survives voice/tone edits.)

---

## Phase 2 — Anatomy of one skill

**Goal.** See how a single skill is built, from template to runtime output.

Pick [../checkpoint/](../checkpoint/) — self-contained, no external binaries,
read-only.

- [ ] Read [../checkpoint/SKILL.md.tmpl](../checkpoint/SKILL.md.tmpl).
- [ ] Read [../checkpoint/SKILL.md](../checkpoint/SKILL.md) and diff it
      mentally against the template. What did the pipeline add?
- [ ] Identify the frontmatter fields: `name`, `preamble-tier`, `version`,
      `description`, `allowed-tools`. Each matters.
- [ ] Note the placeholders: `{{PREAMBLE}}`, `{{SLUG_SETUP}}`. These are the
      hooks into the generator.

**Check.** What does `preamble-tier: 2` do, and where is it resolved?

---

## Phase 3 — The generation pipeline

**Goal.** Understand how `.tmpl` becomes `.md`. This is the central machine
of gstack.

- [ ] Read [../scripts/gen-skill-docs.ts](../scripts/gen-skill-docs.ts),
      specifically `processTemplate()` around line 412. The whole pipeline
      is in one function.
- [ ] Read [../scripts/discover-skills.ts](../scripts/discover-skills.ts).
      Templates are auto-discovered by directory — no central registry.
- [ ] List [../scripts/resolvers/](../scripts/resolvers/). Each file handles
      one `{{PLACEHOLDER}}`. Read
      [../scripts/resolvers/index.ts](../scripts/resolvers/index.ts) and one
      real resolver.
- [ ] Run `bun run gen:skill-docs --host claude` and watch the token budget
      summary at the end.

**Check.** If you wanted to add a new `{{MY_PLACEHOLDER}}`, where exactly
would you register it, and what function signature does it need?

---

## Phase 4 — Multi-host architecture

**Goal.** Understand how one template renders eight different ways for eight
different AI agents.

- [ ] Read [../hosts/index.ts](../hosts/index.ts). This is the registry.
- [ ] Diff [../hosts/claude.ts](../hosts/claude.ts) against
      [../hosts/codex.ts](../hosts/codex.ts). Note `frontmatter.mode`
      (`denylist` vs `allowlist`), `pathRewrites`, `toolRewrites`.
- [ ] Read [../scripts/host-config.ts](../scripts/host-config.ts). This is
      the interface every host must satisfy.
- [ ] Run `bun run gen:skill-docs --host all` and watch all eight hosts
      regenerate.
- [ ] Read [ADDING_A_HOST.md](ADDING_A_HOST.md) for the contributor workflow.

**Check.** Why does Codex use allowlist frontmatter mode and Claude use
denylist?

---

## Phase 5 — The runtime binaries

**Goal.** gstack isn't just prompts — it ships real compiled binaries. You
need to know what they do and when skills call them.

- [ ] Read [../browse/SKILL.md.tmpl](../browse/SKILL.md.tmpl) and skim the
      command list.
- [ ] Read [../browse/src/commands.ts](../browse/src/commands.ts). Single
      source of truth for what `browse` can do.
- [ ] Read [../browse/src/snapshot.ts](../browse/src/snapshot.ts). The
      `SNAPSHOT_FLAGS` array is what QA and design-review rely on.
- [ ] Skim [../design/](../design/) — the GPT Image API wrapper. Much
      smaller than browse.
- [ ] Try it: `bun run dev goto https://example.com` then `bun run dev
      snapshot`.

**Check.** When [../qa/](../qa/) runs, which binary does it call and what
does it get back?

---

## Phase 6 — Composition: skills chaining into workflows

**Goal.** The real value of gstack is that skills compose into workflows.
This is where Phase 1's philosophy becomes concrete.

- [ ] Read [../autoplan/SKILL.md.tmpl](../autoplan/SKILL.md.tmpl). It runs
      `/plan-ceo-review` → `/plan-design-review` → `/plan-eng-review` →
      `/plan-devex-review` sequentially with auto-decisions.
- [ ] Read [../ship/SKILL.md.tmpl](../ship/SKILL.md.tmpl). Merge-base → test
      → review → CHANGELOG → commit → PR.
- [ ] Read [../land-and-deploy/SKILL.md.tmpl](../land-and-deploy/SKILL.md.tmpl).
      Takes over after `/ship`, watches CI, verifies deploy via canary.
- [ ] Trace one end-to-end flow mentally:
      `/office-hours` → `/autoplan` → code → `/ship` → `/land-and-deploy` →
      `/canary` → `/document-release` → `/retro`.

**Check.** Why does `/ship` not include `/canary` itself? What's the
separation of concerns?

---

## Phase 7 — Testing, evals, and quality gates

**Goal.** Understand how gstack knows it's not broken. This is the gate
between "works on my machine" and shippable.

- [ ] Read [../test/skill-validation.test.ts](../test/skill-validation.test.ts).
      Tier 1: free, under one second, static validation.
- [ ] Run `bun test test/skill-validation.test.ts`.
- [ ] Read [../test/helpers/touchfiles.ts](../test/helpers/touchfiles.ts).
      This is the diff-based test selector. Study `E2E_TIERS` — gate vs
      periodic.
- [ ] Read [../test/helpers/llm-judge.ts](../test/helpers/llm-judge.ts).
      LLM-as-judge scoring.
- [ ] Read [../test/helpers/eval-store.ts](../test/helpers/eval-store.ts).
      Persistence and auto-comparison of eval runs.
- [ ] Run `bun run eval:select` to preview what would run for the current
      diff.

**Check.** If you modify [../scripts/gen-skill-docs.ts](../scripts/gen-skill-docs.ts),
why do ALL E2E tests get selected?

---

## Phase 8 — Extend it: add a skill from scratch

**Goal.** Prove you understand the system by shipping something through it.

[../standup/](../standup/) is a live reference — a small read-only skill
added end-to-end. Walk through what happened:

1. Created `standup/SKILL.md.tmpl`. That's it for source.
2. Ran `bun run gen:skill-docs --host all`. Discovery was automatic; all
   eight hosts got their outputs with zero registration.
3. `bun test` caught freshness drift on external hosts before regeneration.
4. Zero changes to `setup`, `hosts/*.ts`, `scripts/gen-skill-docs.ts`, or the
   test files.

- [ ] Read [../standup/SKILL.md.tmpl](../standup/SKILL.md.tmpl) as your
      shape reference.
- [ ] Pick a small gap — `/triage`, `/deps-audit`, something you wish
      existed — and build it end-to-end yourself.
- [ ] Run `bun test` after adding it and name the three tests that
      exercised your new template without you writing any test code.

**Check.** When your new skill shows up in the token budget summary but
fails the Cursor freshness check, what's the one command that fixes it?

---

## What to skip on first pass

These are real and important, but they overload first-time readers. Come
back when you need them.

- [../extension/](../extension/) — Chrome extension for sidebar and CSS
  inspector. Read [designs/SIDEBAR_MESSAGE_FLOW.md](designs/SIDEBAR_MESSAGE_FLOW.md)
  before touching any sidebar file.
- [../openclaw/](../openclaw/), [../hosts/factory.ts](../hosts/factory.ts),
  and other external hosts beyond Codex. The pattern is visible from
  `claude` plus `codex`; the rest is variations.
- Older files in [designs/](designs/) — historical, useful for archaeology,
  not onboarding.

---

## Test of comprehension

After Phase 8, you should be able to answer *"where does X live?"* for any
feature of gstack within ten seconds. If you can't, go back to whichever
phase contains X. The phases are the mental scaffolding — the code is
small once you see its boundaries.
