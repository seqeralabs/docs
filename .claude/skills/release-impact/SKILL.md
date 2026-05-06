---
name: release-impact-assessment
description: >
  Triage the doc impact of a single Seqera release against three surfaces: environment variables
  (does the change add/rename/remove/alter a var listed in seqeralabs/docs under
  platform-enterprise_docs/enterprise/configuration?), visual assets (do UI screenshots, recorded
  videos, or brand marks in the docs go stale?), and internal doc links (are page renames, moves,
  removals, or anchor changes breaking cross-page links?). Always use when the user gives a PR URL,
  Jira key, or changelog entry and asks what it breaks in the docs, or says: "check impact of this
  release", "run an impact check", "does this PR break docs", "is this a rebrand", "what docs does
  this affect", "what needs updating after this change", or "impact assessment". Also trigger on
  descriptions of a UI refresh, rebrand, env var change, page rename, or page removal. Prefer this
  over docs-state-assessment (broad audit) and feature-docs (drafts new content) for single-release
  triage.
---
 
# Release Impact Assessment
 
Given a single release — a PR, a Jira ticket, or a changelog entry — produce a focused impact
report telling a tech writer what needs to be touched in the Seqera docs. The skill checks three
specific surfaces. It does not draft replacement content; it finds and classifies impact so the
writer can act.
 
## Why this skill exists
 
Most releases don't trigger a full doc audit, but many of them quietly break something:
an env var gets renamed, a UI panel gets restyled and a screenshot goes stale, a page gets
renamed and the five pages that linked to it now 404. Those three categories — env vars,
visual assets, and internal links — are the ones we keep getting burned by, and they're
mechanical enough that Claude can triage them reliably if it knows where to look.
 
This skill is narrower than `docs-state-assessment` (which audits a whole product area over
time) and narrower than `feature-docs` (which drafts full doc rewrites). Reach for it when you
have *one* change and want to know *what it breaks*.
 
## Where things live (baked in)
 
The skill assumes the Seqera docs repo:
 
- **Docs repo (primary):** `https://github.com/seqeralabs/docs` (public, master branch)
- **Live site (fallback):** `https://docs.seqera.io`
- **Env vars reference directory:** `https://github.com/seqeralabs/docs/tree/master/platform-enterprise_docs/enterprise/configuration`
If the user is clearly working against a different repo (e.g., a forward-looking branch or a
different product doc set), ask before switching. Otherwise stick to the paths above.
 
## Inputs the skill accepts
 
Any one of these, or a mix:
 
- **A GitHub PR URL** (or several PRs against the product repo — not the docs repo). The PR is
  the richest source; the diff, the title, and the description usually tell you all three
  categories of impact at once.
- **A Jira key or URL** (e.g., `PLAT-1234`). Read the ticket, its acceptance criteria, and any
  linked PRs.
- **Release notes / changelog entry** as pasted text or a file. Lowest-fidelity — you'll often
  need to infer PRs from it to get concrete detail. If a PR is obviously referenced, fetch it.
If the user gives you only a vague description ("we just rebranded"), ask for at least one of
the above. The value of the skill is precision, and precision needs a concrete artifact.
 
## The three-surface check
 
Run all three in parallel where tooling allows. Each has its own reference doc with the
specific commands, patterns, and edge cases.
 
### 1. Env var impact — see `references/env-vars-check.md`
 
Diff the change against every file under `platform-enterprise_docs/enterprise/configuration`.
Flag: added env vars missing from the reference, renamed/removed env vars still listed there,
default-value changes, scope or applicability changes (e.g., "now only honored in standalone
deployments").
 
### 2. Visual asset impact — see `references/visual-assets-check.md`
 
Decide whether the change touches the UI, the logo, or the brand palette. If yes, enumerate
every image, video, or brand reference in the docs repo and classify which ones are plausibly
stale. Group by page so the writer can triage in one pass.
 
### 3. Internal link impact — see `references/internal-links-check.md`
 
If the change renames, moves, or removes a page or a heading anchor, scan the docs repo for
every markdown link pointing at it. Return the source files and line numbers so the writer can
fix or redirect them.
 
## How to work the inputs
 
Read everything before writing anything. Even if the user only wants one of the three checks,
read the full change first — the three surfaces overlap more than they look. A rebrand PR often
also renames config keys; a UI refresh PR sometimes changes URL paths.
 
Practical notes:
 
- **PR diffs can be large.** For env var check, filter the diff to files matching
  `*.{yaml,yml,java,kt,ts,tsx,js,jsx,go,py,env,properties,conf}` and anything mentioning
  `System.getenv`, `process.env`, `os.environ`, or the string `TOWER_` / `SEQERA_` (common
  env var prefixes). For UI check, filter to `.tsx`, `.jsx`, `.css`, `.scss`, and anything
  under a `theme/`, `brand/`, `assets/`, or `components/` directory. For link check, the PR
  itself rarely tells you — you derive the question from what the PR renamed/moved.
- **Jira tickets may not describe the change precisely.** Chase linked PRs. If there are none,
  say so in the output and mark those sections of the report as "cannot assess — no PR linked".
- **Private repos:** if `web_fetch` can't read a PR, fall back to Claude in Chrome's
  authenticated session. Don't silently skip.
- **Parallelize:** the three checks are independent. Spawn them in parallel as subagents or
  tool calls where possible.
## Output format
 
Produce a single markdown file in the outputs directory named
`release-impact-{pr-or-jira-id}.md`. If the user gave you only changelog text with no ID, use
a short slug derived from the first few words.
 
Use this exact structure so the report is scannable and diffable across releases:
 
```markdown
# Release impact: {title}
*Generated: {date}*
*Source: {PR URL / Jira key / "changelog entry"}*
 
## Summary
{2–4 sentences: what the change is, and a one-line verdict per surface —
"Env vars: 2 additions, 1 rename. Visual assets: no impact. Internal links: 1 page moved, 4 inbound links to fix."}
 
## Env var impact — {Critical | Important | Minor | None}
{Table: Env var | Change type (added/renamed/removed/altered) | Reference file | Action needed}
 
## Visual asset impact — {Critical | Important | Minor | None}
{Table: Asset path | Page it appears on | Reason it's likely stale | Action needed}
 
## Internal link impact — {Critical | Important | Minor | None}
{Table: Source file:line | Broken target | Suggested fix}
 
## Open questions
{Anything you couldn't determine without eng/product confirmation —
e.g., "PR removes the `TOWER_OLD_VAR` env var, but it's referenced in the migration guide
with no deprecation timeline. Is there a sunset date?"}
```
 
Severity guide:
 
- **Critical** — docs will be actively wrong or broken the moment the release ships (a removed
  env var still listed as supported; a 404 link from a landing page).
- **Important** — docs will be out of date or visually inconsistent but still usable (a renamed
  button in a screenshot; a new env var not yet documented).
- **Minor** — cosmetic or low-traffic drift (a new internal link in a rarely-visited reference
  page; a subtle palette change on a screenshot).
- **None** — the surface is unaffected. Say so explicitly; a clean bill of health is a real
  finding.
## What to skip
 
- **Drafting replacement docs.** That's `feature-docs`' job. This skill only flags impact.
- **External references** (blog posts, GitHub READMEs outside the docs repo). Out of scope.
- **The whole product area's state.** If the user wants a broad audit, suggest
  `docs-state-assessment` instead.
## When sources are thin
 
If the user gives you only a changelog line like "rebranded Studios UI", do the best you can:
 
1. Assume full visual-asset impact and enumerate every image/video/brand reference under the
   Studios section of the docs.
2. Mark env vars and links as "cannot assess without a PR — please provide one if you want
   this surface covered."
3. Deliver the partial report and explicitly list what's missing in the "Open questions"
   section.
A partial report is still useful. Don't block on perfect inputs.
