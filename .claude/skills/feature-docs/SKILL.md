---
name: feature-docs
description: >
  Turn feature sources (Jira epics, PRDs, design docs, GitHub PRs) into documentation updates
  for Seqera Platform docs. Use this skill whenever the user wants to: write docs for a new feature,
  update existing docs based on a Jira epic or ticket, draft doc changes from a PRD or design doc,
  review PRs and write matching documentation, do a gap analysis between current docs and shipped features,
  create a change summary or changelog for doc reviewers, or says anything like "I need to do doc updates
  for this feature" or "can you draft docs from these sources". Also use when the user provides a mix of
  Jira links, Google Doc links, GitHub PR links, or uploaded PDFs and wants documentation produced from them.
---
 
# Feature Docs
 
Turn feature sources into Seqera Platform documentation updates. This skill takes a mix of inputs — Jira epics, PRDs, design docs, GitHub PRs, and the current published docs — and produces structured documentation outputs: gap analyses, draft content, full drop-in replacement files, and change summaries.
 
## Before you start
 
Read the `seqera-brand-guidelines` skill (SKILL.md) for Seqera product terminology and tone. The brand skill covers naming conventions (e.g., "Seqera Platform" not "Tower", "Nextflow" capitalization) and visual identity. This skill covers doc structure and content workflow.
 
Also read `references/docusaurus-conventions.md` in this skill's directory for Seqera-specific formatting patterns (admonitions, link references, frontmatter, heading hierarchy).
 
## How the skill works
 
The workflow has five phases. Not every run needs all five — the user might just want a gap analysis, or they might want the full pipeline. Ask if unclear, but default to running all five phases and producing all outputs.
 
### Phase 1: Gather and read all sources
 
The user will provide some combination of:
 
- **Jira epic or ticket URLs** — Use the Jira MCP tools (`searchJiraIssuesUsingJql`, `getJiraIssue`) to read the epic, its child issues, acceptance criteria, and status. Extract feature names, scope, and what's been completed.
- **PRD / Design Doc** — These may be uploaded as PDFs, shared as Google Doc links (use the browser to read them), or pasted into the conversation. Extract requirements, acceptance criteria, API field names, behavioral specifications, and out-of-scope items.
- **GitHub PRs** — Use the browser to read PR descriptions and diffs. Focus on what changed, what fields were added, and what the PR description says about user-facing behavior. Check both open and merged PRs under the epic.
- **Published docs (URLs)** — Fetch the current live documentation. This is your baseline. If the URL points to a raw markdown file on GitHub, that's the actual source of truth for the doc structure.
Read everything before writing anything. The value of this skill is in the cross-referencing — catching things that one source mentions but another doesn't.
 
**Practical tips for source gathering:**
- Jira child issue queries can return huge results. If the response is too large, save it to a file and extract summaries programmatically.
- Google Docs may need to be accessed via the browser's authenticated session. If `get_page_text` doesn't return the document body, try using `fetch()` with the `/export?format=txt` endpoint from within the page context.
- GitHub PR pages can be very large. Use `document.querySelector('.markdown-body')?.innerText` via the JavaScript tool to extract just the PR description.
- Some content may be blocked by browser content filters (especially text containing credentials or keys). Extract in smaller sections or use alternative methods.
### Phase 2: Gap analysis
 
Compare what the current docs say against what the sources say should be true. For each gap, document:
 
1. **What the current docs say** (quote the specific text)
2. **What reality is now** (cite the source — which Jira ticket, which PR, which section of the PRD)
3. **What needs to change** (specific, actionable — not vague)
4. **Where in the doc** (section heading and approximate location)
Organize gaps by severity: Critical (docs are actively wrong/misleading), Important (significant feature not documented), Minor (wording tweaks, label changes).
 
Also flag **open questions** — things where the sources disagree or are ambiguous, where you'd need engineering or product confirmation.
 
### Phase 3: Draft content
 
For each gap, draft the replacement content. Write it in the voice and format of the existing doc — match heading levels, step numbering style, admonition usage, and link reference patterns. See `references/docusaurus-conventions.md` for the specific patterns.
 
Key principles:
- **Preserve what works.** Don't rewrite sections that don't need changing. Surgically insert, replace, or remove content.
- **Match the existing voice.** Seqera docs are instructional and direct. Steps use imperative mood ("Select...", "Enter..."). Explanatory text is concise but not terse.
- **Use admonitions purposefully.** `:::note` for supplementary info, `:::info` for important context, `:::caution` for things that could cost money or break something, `:::tip` for best practices.
- **API field names go in backticks.** E.g., `managedIdentityClientId`, `jobMaxWallClockTime`.
- **Link references go at the bottom of the file.** Use descriptive names, not short abbreviations.
### Phase 4: Produce the output
 
Depending on what the user asked for (or defaulting to all of the below):
 
**Mode A: Gap analysis only**
- A markdown file listing all gaps, organized by severity, with source citations and recommended changes.
**Mode B: Gap analysis + draft content**
- Everything in Mode A, plus drafted replacement text for each gap (but not assembled into the full doc).
**Mode C: Full drop-in replacement**
- A complete markdown file that can replace the current published doc. Every change applied in context, all existing content preserved where it doesn't need updating. This is the file a tech writer can diff against the original and use directly.
**Mode D: Change summary**
- A structured changelog document organized section-by-section: what was added, removed, or changed, and why. Useful for doc review and for understanding the scope of changes at a glance.
The default output when the user says "draft docs for this feature" or similar is **Mode C + Mode D** — a full replacement file plus a change summary.
 
All output files go in the outputs directory so the user can access them.
 
### Phase 5: Cross-reference verification
 
After producing the output, verify it against every source. For each requirement or acceptance criterion in the PRD and design doc, check whether the updated docs reflect it. Produce a verification checklist:
 
- ✅ Requirement is fully reflected in the updated docs
- ⚠️ Partially reflected or acceptable omission (explain why)
- ❌ Missing — needs to be added
Flag anything that needs engineering/product confirmation (e.g., "Design doc mentions field X but it's unclear if it's user-facing").
 
This phase catches things you missed in the initial pass. It's the most important quality gate.
 
## Naming conventions for output files
 
Use descriptive names based on the doc being updated:
 
- `{page-name}-gap-analysis.md` — Gap analysis (Mode A/B)
- `{page-name}-updated.md` — Full replacement (Mode C)
- `{page-name}-change-summary.md` — Change summary (Mode D)
For example: `azure-batch-gap-analysis.md`, `azure-batch-updated.md`, `azure-batch-change-summary.md`.
 
## When things go wrong
 
- **Can't access a source**: Tell the user which source you couldn't read and why. Ask them to upload it as a PDF or paste the relevant content. Don't silently skip sources.
- **Sources contradict each other**: Flag the contradiction explicitly in the gap analysis. Don't guess — list both versions and mark it as needing confirmation.
- **Not sure if a feature is user-facing**: Include it in the gap analysis as an open question. Better to flag something unnecessary than to miss something important.
- **Doc is very long**: Work section by section. Read the full original first, then build the replacement iteratively rather than trying to produce it all at once.
