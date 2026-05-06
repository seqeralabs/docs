---
name: docs-state-assessment
description: >
  Assess the documentation state of a Seqera product area by cross-referencing GitHub PRs, Jira backlog,
  published docs on docs.seqera.io, and internal repo documentation. Produces a gap analysis showing what's
  shipped but undocumented, what's in flight and will need docs, what's planned, and what published docs
  may already be stale. Use this skill whenever the user asks to: assess documentation gaps, audit doc
  coverage for a project, compare what's shipped vs. what's documented, produce a "state of the docs"
  report, do a doc gap analysis, check what PRs need docs, figure out what's missing from the published
  docs, or says anything like "what docs do we need" or "how do the docs stack up". Also trigger when the
  user provides a GitHub repo URL and a Jira project and wants to understand documentation coverage or
  priorities. This skill focuses on the state of the work — what exists, what's in flight, what's missing —
  not on personas, information architecture, or where content should live in the doc site.
---
 
# Docs State Assessment
 
Produce a structured gap analysis for a Seqera product area by pulling from four sources and cross-referencing them.
 
## Why this skill exists
 
Documentation teams working across multiple product areas need to quickly answer: "What's the current state of docs for this project?" Doing this manually means opening GitHub, scanning PRs, checking Jira, reading the published docs, and browsing the repo — then holding all of that in your head while you figure out the deltas. This skill turns that into a repeatable process with a consistent output format.
 
## The four data sources
 
Every assessment pulls from these four layers. Each one answers a different question:
 
| Source | Question it answers | How to access it |
|--------|-------------------|------------------|
| **Published docs** (docs.seqera.io) | What do customers see today? | `web_fetch` the product area's doc index page, then fetch each subpage |
| **GitHub PRs** (open) | What's shipping soon that may need docs? | Browse the repo's open PRs via Claude in Chrome, or use `gh` CLI if available |
| **Jira backlog** | What's planned that will create doc needs? | `searchJiraIssuesUsingJql` — filter out security issues and Done items |
| **Internal repo docs** | What source material exists that isn't published? | Browse the repo's `docs/` directory (or equivalent) via Chrome or filesystem |
 
The power is in the cross-referencing. Any single source gives you a partial picture. The assessment finds the gaps between them.
 
## Before you start
 
Gather these inputs from the user (or from conversation context):
 
1. **GitHub repo** — the repository to assess (e.g., `seqeralabs/portal`)
2. **Jira project key** — the Jira project tracking work for this product (e.g., `SH`)
3. **Published docs URL** — the root URL of the product's section on docs.seqera.io (e.g., `https://docs.seqera.io/platform-cloud/seqera-ai/`)
4. **Jira Cloud ID** — typically the Atlassian site URL (e.g., `seqera.atlassian.net`)
If the user doesn't provide all four, ask for what's missing. Often the repo and Jira project are enough — you can infer the docs URL from the product area name, and the Cloud ID from the Jira URL.
 
## Practical notes on tooling
 
**Private repos**: If the GitHub repo is private, `web_fetch` will return 404. Use Claude in Chrome to browse the repo instead — navigate to the PRs page and read the page text. This is the most reliable approach for private Seqera repos.
 
**Large Jira result sets**: The SH project (Seqera AI) has thousands of issues. Always filter out security issues and Done/Canceled items in the JQL query. If results still exceed token limits, the output gets saved to a file — use `jq` or Python to extract just the fields you need (key, summary, status, issuetype, priority, assignee).
 
**Parallelize where possible**: Steps 1 (published docs) and 3 (Jira) don't depend on each other. Fetch them in parallel. Step 2 (PRs) requires browser navigation, so it runs sequentially. Step 4 (internal docs) can run in parallel with Step 2 if you have filesystem access to the repo.
 
## The assessment process
 
Work through these steps in order. Each step builds on the previous one.
 
### Step 1: Inventory the published docs
 
Fetch the product area's index page on docs.seqera.io. Extract:
- The full page list from the sidebar navigation
- For each page: title, URL, and a brief note on what it covers
Then fetch 3-5 of the most substantive pages (not just the index) to understand the depth of coverage. You're looking for: how detailed are they? Do they cover setup, configuration, advanced usage, troubleshooting? Or are they surface-level overviews?
 
Record this as a table with columns: Page, Coverage depth (overview / moderate / detailed), Key topics covered.
 
### Step 2: Scan the GitHub PRs
 
Navigate to the repo's open PRs page. Read through all pages (repos with active development often have 50-100+ open PRs). For each PR, note:
- PR number and title
- Scope prefix (feat, fix, docs, chore, etc.)
- Status (Draft, Review required, Approved, Changes requested)
- Priority labels if any (ship-this-week, next-sprint, backlog)
Filter out noise: dependency bumps (renovate/dependabot), security patches, and pure CI/tooling changes rarely need docs. Focus on `feat()`, `fix()` that changes user-facing behavior, and `docs()` PRs.
 
Group the remaining PRs by theme — features that relate to each other often imply the same doc page or section. Common groupings: authentication, new commands/features, UI changes, API changes, performance/reliability.
 
### Step 3: Query the Jira backlog
 
Search for non-security, non-Done issues:
 
```
project = <KEY> AND issuetype NOT IN ("Security Issue") AND status NOT IN (Done, Canceled) ORDER BY created DESC
```
 
Request fields: summary, status, issuetype, priority, assignee, labels, components.
 
If the result set is too large for context, it will be saved to a file. Extract the essentials with a script:
 
```python
import json, sys
data = json.load(sys.stdin)
for item in data:
    inner = json.loads(item.get('text', '{}'))
    for issue in inner.get('issues', []):
        key = issue['key']
        f = issue['fields']
        status = f.get('status', {}).get('name', '')
        itype = f.get('issuetype', {}).get('name', '')
        summary = f.get('summary', '')
        assignee = (f.get('assignee') or {}).get('displayName', 'Unassigned')
        print(f'{key} | {itype} | {status} | {assignee} | {summary}')
```
 
From the results, extract:
- **Epics** — these represent large initiatives, each potentially implying an entire doc set
- **Stories/Tasks with doc implications** — new features, migrations, integrations
- **In-progress items** — these are shipping soonest and need docs coordination
- **Bugs that affect doc accuracy** — behavioral changes that make current docs wrong
Skip: internal tooling tasks, eval/benchmark work, and items that are purely backend optimization with no user-facing change.
 
### Step 4: Scan internal repo docs
 
Browse the repo's documentation directory (usually `docs/`, sometimes scattered across component READMEs). Inventory what exists:
- Design specs / PRDs (contain source material for customer-facing docs)
- Architecture docs (internal reference)
- Setup/onboarding guides (internal dev audience)
- Process docs (internal workflows)
The key question: does the repo contain information that should be in the published docs but isn't? Design specs are the most common source of this gap — they describe features in detail for the engineering team but that information never makes it to customer-facing documentation.
 
### Step 5: Cross-reference and produce the gap analysis
 
This is where the four sources come together. Produce four delta categories:
 
**1. Shipped but not documented** — Features or capabilities that exist in the product (merged to main, available to users) but have no corresponding published documentation. These are found by comparing internal repo docs and recent merged PRs against the published doc inventory. Severity: Critical or High.
 
**2. In flight — will need docs soon** — Open PRs that are approved, in review, or labeled as shipping soon. Cross-reference with any Jira items they link to. For each, note what published doc page needs updating or whether a new page is needed. Severity: varies by ship timeline.
 
**3. Planned — will create future doc needs** — Jira epics and stories in the backlog that will require documentation when they ship. These help the docs team plan capacity. Note estimated doc scope (new page, new section, update to existing page, entirely new doc set).
 
**4. Published docs that may be stale** — Existing published pages where open PRs or Jira items suggest the behavior is changing. For example, if there's an auth hardening PR shipping this week, the published authentication page is at risk of becoming inaccurate.
 
## Output format
 
Produce a markdown document with this structure:
 
```markdown
# [Product Area]: Documentation State Assessment
*Generated: [date]*
 
## Published docs inventory
[Table of what exists on docs.seqera.io with coverage depth]
 
## Open PRs with doc implications
[Grouped by theme, filtered to only doc-relevant PRs]
 
## Jira backlog with doc implications
[Epics, stories, and bugs that affect docs — separated by type]
 
## Gap analysis
 
### Shipped but not documented
[Table: Feature | Source | Gap severity]
 
### In flight — needs docs soon
[Table: Feature | PR(s) | Jira | Doc action needed]
 
### Planned — future doc needs
[Table: Initiative | Jira | Doc impact estimate]
 
### Published docs at risk of staleness
[Table: Published page | Risk level | Source of drift]
 
## Recommended priorities
[Ordered list: what to do this week, next sprint, next quarter]
```
 
## Important guidance
 
**Be specific about what's missing, not vague.** "Web UI docs are missing" is less useful than "The web UI has a sandbox file explorer (PR #872), an explain-failure action (PR #873), and a code selector (PR #835), but zero published documentation for any web UI feature."
 
**Severity matters.** A missing config reference page for an enterprise product is more urgent than a missing page about an exploration-labeled prototype. Use the PR labels and Jira statuses to gauge urgency.
 
**Don't boil the ocean.** If the repo has 200 open PRs, you don't need to analyze all of them. Focus on `feat()` and `fix()` scopes, skip renovate/dependabot, skip exploration-labeled items unless they're unusually significant. Call out how many you filtered and why.
 
**Cross-reference by keyword, not just by ticket number.** A Jira epic about "background agents" and a PR titled "add trigger-session endpoint for background AI sessions" are related even if the PR doesn't reference the Jira key. Connect them.
 
**The output is a working document, not a final report.** It should be useful in a planning session — scannable tables, clear severity ratings, and actionable next steps. Keep prose minimal; let the tables do the talking.
