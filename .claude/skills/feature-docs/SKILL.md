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

Turn feature sources into Seqera Platform documentation updates. This skill takes a mix of inputs — Jira epics, PRDs, design docs, GitHub PRs, doc expectation contracts, and the current published docs — and produces structured documentation outputs: gap analyses, draft content, full drop-in replacement files, a change summary, and (by default) an open pull request against the docs repo.

## Before you start

Read the `seqera-brand-guidelines` skill (SKILL.md) for Seqera product terminology and tone. The brand skill covers naming conventions (e.g., "Seqera Platform" not "Tower", "Nextflow" capitalization) and visual identity. This skill covers doc structure and content workflow.

Also read `references/docusaurus-conventions.md` in this skill's directory for Seqera-specific formatting patterns (admonitions, link references, frontmatter, heading hierarchy).

**Confirm the PR target repo before doing anything else.** Ask the user which repo the eventual PR should target. Default to `seqeralabs/docs`, but offer alternatives like `seqeralabs/platform-enterprise_docs`, a fork, or a feature-specific repo. Hold onto the answer — you'll need it in Phase 6. Also confirm the base branch (default: `master` or `main`, whichever the repo uses).

## How the skill works

The workflow has six phases. Not every run needs all six — the user might just want a gap analysis, or they might want the full pipeline through to a PR. Ask if unclear, but default to running all six phases, producing all artifacts, and opening a PR at the end.

### Phase 1: Gather and read all sources

The user will provide some combination of:

- **Doc expectation contract** (optional) — If a PM has run the `doc-expectation-contract` skill on the epic, there will be a structured comment on the epic titled "Documentation Expectation Contract". This gives you a head start: it lists platform areas impacted, config changes, env vars, content types needed, breaking changes, and open questions. Use it to guide your source gathering and gap analysis — but don't depend on it. This skill works fine without a contract.
- **Jira epic or ticket URLs** — Use the Jira MCP tools (`searchJiraIssuesUsingJql`, `getJiraIssue`) to read the epic, its child issues, acceptance criteria, and status. Extract feature names, scope, and what's been completed.
- **PRD / Design Doc** — These may be uploaded as PDFs, shared as Google Doc links (use the browser to read them), or pasted into the conversation. Extract requirements, acceptance criteria, API field names, behavioral specifications, and out-of-scope items.
- **GitHub PRs** — Use the browser to read PR descriptions and diffs. Focus on what changed, what fields were added, and what the PR description says about user-facing behavior. Check both open and merged PRs under the epic.
- **Published docs (URLs)** — Fetch the current live documentation. This is your baseline. If the URL points to a raw markdown file on GitHub, that's the actual source of truth for the doc structure.
Read everything before writing anything. The value of this skill is in the cross-referencing — catching things that one source mentions but another doesn't.

**Using the doc expectation contract:** If a contract exists on the epic, treat it as a checklist of areas to investigate — not as a source of truth. The contract is generated early (often before development is complete) and many fields may say "Unclear". Cross-reference contract claims against the PRD, PRs, and code. If the contract flags env vars or config changes, verify them in the actual implementation. The contract's "Open questions" section is especially useful — these are known gaps the PM flagged that you should try to resolve through the other sources.

**Practical tips for source gathering:**
- Jira child issue queries can return huge results. If the response is too large, save it to a file and extract summaries programmatically.
- Google Docs may need to be accessed via the browser's authenticated session. If `get_page_text` doesn't return the document body, try using `fetch()` with the `/export?format=txt` endpoint from within the page context.
- GitHub PR pages can be very large. Use `document.querySelector('.markdown-body')?.innerText` via the JavaScript tool to extract just the PR description.
- Some content may be blocked by browser content filters (especially text containing credentials or keys). Extract in smaller sections or use alternative methods.
### Phase 2: Gap analysis

Compare what the current docs say against what the sources say should be true. For each gap, document:

1. **What the current docs say** (quote the specific text)
2. **What reality is now** (cite the source — which Jira ticket, which PR, which section of the PRD, or the contract entry it traces back to)
3. **What needs to change** (specific, actionable — not vague)
4. **Where in the doc** (section heading and approximate location)
Organize gaps by severity: Critical (docs are actively wrong/misleading), Important (significant feature not documented), Minor (wording tweaks, label changes).

Also flag **open questions** — things where the sources disagree or are ambiguous, where you'd need engineering or product confirmation. If a contract was used in Phase 1, fold its unresolved "Open questions" into this list and mark which ones you were able to resolve from the other sources.

### Phase 3: Draft content

For each gap, draft the replacement content. Write it in the voice and format of the existing doc — match heading levels, step numbering style, admonition usage, and link reference patterns. See `references/docusaurus-conventions.md` for the specific patterns.

Key principles:
- **Preserve what works.** Don't rewrite sections that don't need changing. Surgically insert, replace, or remove content.
- **Match the existing voice.** Seqera docs are instructional and direct. Steps use imperative mood ("Select...", "Enter..."). Explanatory text is concise but not terse.
- **Use admonitions purposefully.** `:::note` for supplementary info, `:::info` for important context, `:::caution` for things that could cost money or break something, `:::tip` for best practices.
- **API field names go in backticks.** E.g., `managedIdentityClientId`, `jobMaxWallClockTime`.
- **Link references go at the bottom of the file.** Use descriptive names, not short abbreviations.
### Phase 4: Produce the output

All artifacts for a single run go into a dedicated subfolder of the outputs directory:

```
outputs/feature-docs/{page-name}-{YYYY-MM-DD}/
```

For example: `outputs/feature-docs/azure-batch-2026-05-07/`. Use the slugified name of the doc page being updated (e.g., `azure-batch`, `data-studios-overview`). If the run touches multiple pages, use the feature/epic slug instead (e.g., `outputs/feature-docs/managed-identities-2026-05-07/`).

Write every artifact into that folder so the user can find everything from one run together.

Depending on what the user asked for (or defaulting to all of the below):

**Mode A: Gap analysis only**
- A markdown file listing all gaps, organized by severity, with source citations and recommended changes.
**Mode B: Gap analysis + draft content**
- Everything in Mode A, plus drafted replacement text for each gap (but not assembled into the full doc).
**Mode C: Full drop-in replacement**
- A complete markdown file that can replace the current published doc. Every change applied in context, all existing content preserved where it doesn't need updating. This is the file a tech writer can diff against the original and use directly. **This is the file that gets committed to the PR in Phase 6.**
**Mode D: Change summary**
- A structured changelog document organized section-by-section: what was added, removed, or changed, and why. Useful for doc review and for understanding the scope of changes at a glance. **This file gets embedded in the PR description in Phase 6.**
The default output when the user says "draft docs for this feature" or similar is **Mode C + Mode D** — a full replacement file plus a change summary — followed by Phase 5 verification and a Phase 6 PR.

### Phase 5: Cross-reference verification

After producing the output, verify it against every source. For each requirement or acceptance criterion in the PRD and design doc — and every line item in the doc expectation contract, if one was used — check whether the updated docs reflect it. Produce a verification checklist:

- ✅ Requirement is fully reflected in the updated docs
- ⚠️ Partially reflected or acceptable omission (explain why)
- ❌ Missing — needs to be added
Flag anything that needs engineering/product confirmation (e.g., "Design doc mentions field X but it's unclear if it's user-facing").

This phase catches things you missed in the initial pass. It's the most important quality gate, and it's the gate before Phase 6 — do not open a PR if any ❌ items remain unresolved.

### Phase 6: Open the PR

Once Phase 5 verification passes, open a PR against the target repo confirmed in "Before you start". Use the GitHub MCP tools to do this without leaving the session.

**Steps:**

1. **Pick a branch name.** Use `docs/{page-name}-{short-feature-slug}` (e.g., `docs/azure-batch-managed-identities`). Keep it human-readable and prefix with `docs/` so reviewers know what it is.
2. **Push the updated doc(s).** Use `push_file` (from the GitHub MCP) to commit the Mode C drop-in replacement file(s) onto the new branch in the target repo. The destination path inside the repo should match where the published doc lives (e.g., `platform-enterprise_docs/enterprise/compute-envs/azure-batch.mdx`). Confirm the path with the user if you're not sure — pushing to the wrong path is the most common mistake here.
3. **Open the PR.** Use `create_pr` against the base branch (default `master` or `main`, whichever the repo uses). Title: a concise summary of what changed (e.g., `docs(azure-batch): document managed identity support`). Body: include the Mode D change summary verbatim, plus a "Sources" section with links to the Jira epic, PRD, doc expectation contract (if used), and any GitHub PRs the docs were drafted from, plus the Phase 5 verification checklist.
4. **Do not commit gap analysis or verification artifacts to the repo.** Those stay in the local outputs folder. Only the Mode C file(s) belong in the PR; the change summary and verification checklist belong in the PR description.
5. **Share the PR link with the user** along with a one-line summary of what landed and what (if anything) still needs human confirmation.
**When to stop short of a PR:**
- The user explicitly asked for gap analysis only (Mode A) or draft-only output.
- Phase 5 verification has open ❌ items that you can't resolve from the available sources — surface these and ask the user how to proceed before pushing.
- The user hasn't confirmed the target repo or in-repo file path. Ask, don't guess.
## Naming conventions for output files

All artifacts for a run live in `outputs/feature-docs/{page-name}-{YYYY-MM-DD}/`. Inside that folder, use descriptive names based on the doc being updated:

- `{page-name}-gap-analysis.md` — Gap analysis (Mode A/B)
- `{page-name}-updated.md` — Full replacement (Mode C) — this is what the PR commits
- `{page-name}-change-summary.md` — Change summary (Mode D) — this becomes the PR body
- `{page-name}-verification.md` — Phase 5 verification checklist
- `{page-name}-pr-metadata.md` — Branch name, target repo, in-repo file path, and the final PR URL once opened
For example, a run updating the Azure Batch page on 2026-05-07 produces:

```
outputs/feature-docs/azure-batch-2026-05-07/
  azure-batch-gap-analysis.md
  azure-batch-updated.md
  azure-batch-change-summary.md
  azure-batch-verification.md
  azure-batch-pr-metadata.md
```

## When things go wrong

- **Can't access a source**: Tell the user which source you couldn't read and why. Ask them to upload it as a PDF or paste the relevant content. Don't silently skip sources.
- **Sources contradict each other**: Flag the contradiction explicitly in the gap analysis. Don't guess — list both versions and mark it as needing confirmation. If the contract conflicts with the PRD or PRs, prefer the PRD/PRs and note that the contract is stale.
- **Not sure if a feature is user-facing**: Include it in the gap analysis as an open question. Better to flag something unnecessary than to miss something important.
- **Doc is very long**: Work section by section. Read the full original first, then build the replacement iteratively rather than trying to produce it all at once.
- **`push_file` or `create_pr` fails**: Don't retry blindly. Common causes: wrong repo, wrong base branch, missing write access, or the in-repo path doesn't exist. Surface the error to the user, confirm the repo/branch/path, and ask before retrying.
- **PR opens but CI fails**: Note the failure in your message but don't try to fix CI from this skill — that's outside scope. Hand off to the user with the PR link and the failure summary.
