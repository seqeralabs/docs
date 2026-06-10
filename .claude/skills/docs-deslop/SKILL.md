---
name: docs-deslop
description: Rewrite technical product documentation to strip AI slop and conform to the CTRT topic-type model (Concept, Task, Reference, Troubleshooting) plus Tutorial. Use whenever the user wants to deslop, tighten, edit, or rewrite technical docs — concept pages, task / how-to pages, reference material (API, CLI, config tables), troubleshooting pages, runbooks, tutorials, release notes, or product README sections. Trigger on phrases like "deslop", "make this doc less AI-sounding", "edit this docs page", "tighten my draft", or "rewrite this in CTRT", whether the user pastes prose or points at a file (.md, .mdx, .rst, .adoc, .txt, .docx). Scope is product/technical documentation only — do not use for marketing copy, blog posts, social posts, or general prose. Default behavior is to classify the input by topic type, then apply a heavy rewrite per the type-specific rules. Supports an optional passive mode (light-touch: word- and sentence-level fixes only, no restructuring — trigger on "passive", "light-touch", "words only", "don't restructure") and an optional verbose mode (change summary shows each edit as a before/after pair with the rule that triggered it — trigger on "verbose", "explain each change", "show before/after"); the two modes combine. Always return the rewritten text plus a short summary naming the topic type(s) and the changes made.
---

# Deslop for technical documentation

Strip AI patterns from technical product documentation and bring each topic in line with the CTRT topic-type model: Concept, Task, Reference, Troubleshooting (plus Tutorial as a fifth page-level type). The goal is documentation that a tired engineer can scan at 11pm and act on.

This skill is **opinionated** and **aggressive**. The default mode is a heavy rewrite — restructure freely, split mistyped topics, cut hard. Lean on the rules below; deviate only when the source meaning would be lost.

Two optional modes adjust this default: **passive mode** limits the rewrite to safe word- and sentence-level fixes (no restructuring), and **verbose mode** expands the change summary into per-edit before/after pairs. See [Modes](#modes) before starting — the mode changes which rules you apply and how you report them.

## Scope: this is for technical documentation only

Use this skill on:

- Concept pages ("what is X")
- Task / how-to pages ("how to do Y")
- Reference material (API, CLI, config option tables, env vars, flags, fields)
- Troubleshooting pages and on-call runbooks
- Tutorials (end-to-end walkthroughs)
- README sections that describe a product
- Release note entries (each entry is essentially a reference-style item)

Do **not** use this skill on:

- Marketing copy, landing pages, sales pages
- Blog posts (technical blog posts included — they have different conventions)
- Social media posts, email drafts, internal memos
- General creative or persuasive writing
- Tweets about engineering culture

If the user asks to deslop something that is clearly marketing or a blog post, say so and stop. The catalog of rules below is calibrated for documentation voice, not for prose that is supposed to persuade or entertain.

## Modes

deslop runs in **full mode** by default — the aggressive in-place heavy rewrite this file describes. Two optional modes change that behavior. Detect the mode from the user's request, and name the active mode in the first line of the change summary (`Mode: passive`, `Mode: verbose`, `Mode: passive + verbose`, or nothing for full mode). The two modes are independent and combine.

### Passive mode

Trigger phrases: "passive", "passive mode", "light-touch", "light touch", "safe edits only", "words only", "don't restructure", "--passive".

Passive mode still edits the file in place, but limits the rewrite to **word- and sentence-level fixes that cannot change the document's meaning, structure, or navigation.** Use it when the user wants the prose cleaned up without the page reshaped — for example, on a doc that is already correctly typed and well-organized but reads like an LLM wrote it.

**Apply (the safe set):**

- Cut slop phrases, throat-clearing, hedges, padding, filler adverbs, and nominalizations (`phrases.md`)
- Swap marketing adjectives and sales verbs for plain words (`phrases.md`, `style-guide.md`)
- Fix passive → active voice, future → present tense, and product-as-subject → customer perspective (`style-guide.md`)
- Fix loose connectors and punctuation: `, so` / `, which means` joins, semicolons, mid-sentence colons, decorative em-dashes, Unicode decoration (`structures.md`)
- Split sentences over ~30 words (`clarity.md`)
- Correct terminology, product-name spelling, and bold-vs-backticks in place (`terminology.md`)

**Do not (the structural set — full mode only):**

- Split a mistyped topic into separate typed sections
- Rename a title (no active-verb + noun rewrite, no `Tutorial:` prefix, no body-H1 removal)
- Convert prose to a table or a table to a list, or reshape a body into symptom → cause → fix
- Move or reformat content: no troubleshooting moves, no prerequisites reformat, no hoisting prose out of a reference
- Add, remove, reorder, or cut whole headings or sections (including a "Conclusion" or "Summary" section)

When passive mode suppresses a change that full mode would make, **flag it in the change summary as a recommendation** instead of doing it — for example, "Recommend (full mode): split the embedded numbered steps into a separate Task section." Step 5 (the `docs-structure` skill handoff) becomes detect-and-recommend only: name what should move or reformat, but leave it in place.

The cut-hard expectation (core rule 6) still holds for the words within a sentence, but passive mode will usually cut less than full mode because it can't drop whole sections. Don't manufacture structural changes to hit a cut target.

### Verbose mode

Trigger phrases: "verbose", "verbose mode", "explain each change", "show before/after", "--verbose".

Verbose mode changes **only Artifact 2**, not what you edit. Instead of the scannable 3–7 category bullets, list each significant change as a `before → after` pair with the rule that triggered it, grouped by reference file or change category:

> **Mode: verbose** · Classified as **Task**
>
> _Active voice (`style-guide.md`):_
> - "The job is submitted by the runner" → "The runner submits the job"
>
> _Sales verbs (`phrases.md`):_
> - "leverage the API" → "use the API"
>
> _Loose connector (`structures.md`):_
> - "The token expires hourly, so refresh it" → "The token expires hourly. Refresh it before each run."

Keep the classification line, and still report every summary-only obligation (glossary candidates, dropped unsupported claims, renamed-heading anchor flags). Collapse trivial repeated swaps into one entry with a count (`cut "just" ×6`) rather than listing each occurrence. The goal is a complete accounting of the edits, not noise.

## The five-step workflow

**1. Read the source.** If the user pasted text, use it. If they referenced a file path, read the **entire** file before editing — an in-place rewrite must not drop content it never saw. For .docx, follow the docx skill's reading guidance.

**Scope:** if the user pointed at a specific section, heading, or line selection, rewrite only that. Leave the surrounding prose untouched. Rewrite the whole file only when the user asks for the whole file. A heavy rewrite is about depth on the in-scope text, not breadth across the page.

**2. Classify the topic type(s).** Decide which of Concept / Task / Reference / Troubleshooting / Tutorial each section of the input is. A short doc is often one type; a longer doc usually mixes types and should be split into typed sections during the rewrite. See `references/topic-types.md` for the classification rules and the question each type answers.

**3. Apply the rewrite.** Use the general anti-slop rules below plus the type-specific rules from `references/topic-types.md`. Only touch prose. Keep the following exactly as written, byte-for-byte: code blocks, command examples, file paths, version numbers, proper nouns, `import`/`export` statements, JSX/MDX components and tags, admonition markers (`:::note`, `:::warning`), and partial includes. When editing a file in place, prefer targeted edits over a full-file overwrite so these elements can't be dropped, and never delete content you don't understand — if a line isn't prose, leave it.

**Frontmatter is two things, not one.** Preserve the structure and all non-prose values exactly: the `---` fences, every key, and machine-read values like `slug`, `id`, `tags`, `sidebar_position`, `date created`, and `last updated`. But the prose-bearing values **are** in scope — `title:` and `description:` are the page's real title and summary, so apply the title rules (`topic-types.md`) and anti-slop rules to them. For these docs the page title usually lives in frontmatter `title:` with no H1 in the body, so renaming "the title" means editing that value. Leave the `title:`/`description:` keys, quoting, and surrounding fields untouched — change only the text inside.

**When the page title lives outside the body, the body gets no H1.** If frontmatter `title:` exists, or the user states that the page title supplies the H1, apply any title rename to that supplied title and **remove** the body H1 rather than renaming it. The title-rename rules (active verb + noun, `Tutorial:` prefix, etc.) never justify keeping or adding a body H1 — start the body at H2.

**4. Return two artifacts.** First the rewritten text, then a short change summary that names the topic type(s) and the categories of changes. Exact output format is below.

**5. Format with the `docs-structure` skill.** On Seqera pages, two structural conventions are owned by the `docs-structure` skill, and deslop must delegate both — **invoke it** (Skill tool, `skill: "docs-structure"`) whenever either element is in scope:

- **Prerequisites** — a prerequisites list, or a top-of-page block that mixes the intro with prerequisites, is reformatted in place per the `docs-structure` skill's `references/prerequisites.md`: a `:::info[**Prerequisites**]` admonition, a `You need the following:` lead-in, and noun-phrase bullets. Never use deslop's generic `Prerequisites:` heading on a Seqera page.
- **Troubleshooting placement** — inline troubleshooting content (a `## Troubleshooting` section, error/symptom → cause → fix entries, "If you see…" recovery procedures) moves **off** concept, task, reference, and tutorial pages to the product's dedicated troubleshooting pages per the `docs-structure` skill's `references/troubleshooting.md` (for example, `platform-cloud/docs/troubleshooting_and_faqs/`), leaving a one-line pointer on the source page. There is no minimum size — a single inline entry triggers the move. This **overrides** the generic "split out at five or more entries" rule in `topic-types.md`.

This step is mandatory, not optional polish — do not skip it because the section looks small, the page is "mostly fine", or you already read one of the `docs-structure` references. Read **both** of the `docs-structure` skill's reference files that apply before deciding nothing needs to move. If the Skill tool is unavailable in the current environment, apply the conventions inline yourself as a fallback. Either way, report the conversions, moves, and any removed anchors in the change summary (artifact 2), extending it if it was already delivered.

**In passive mode**, this step is detect-and-recommend only: identify the prerequisites and inline troubleshooting that should be reformatted or moved, name them in the change summary as recommendations, but leave the content in place. Don't invoke the `docs-structure` skill to perform the moves (see [Modes](#modes)).

## The core rewrite rules

These apply to every topic type. The type-specific rules layer on top.

**In passive mode**, apply only the word- and sentence-level rules (rules 2, 4, part of 6, 7, 8). Rule 1 still runs — classify, because the type drives word choice and the recommendations you flag — but its structural consequences (splitting, renaming, hoisting) are suppressed. Rule 3 applies only to the loose-connector and punctuation fixes, not to reshaping paragraphs. Rule 5 becomes recommend-only. See [Modes](#modes).

### 1. Classify before rewriting

State the classification to yourself (in your reasoning, not in the output) before touching the prose. The classification drives most of the structural decisions:

- A **Concept** that contains numbered steps needs the steps lifted into a separate Task section.
- A **Task** with a noun-only title (`Issue creation`) needs to be renamed to `active verb + noun` (`Create an issue`).
- A **Reference** with paragraphs of explanatory prose between rows needs the prose hoisted into an introductory concept or cut.
- A **Troubleshooting** entry without the error message in the title needs the message lifted up.
- A **Tutorial** without the `Tutorial:` prefix and without a stated outcome in the lead needs both added.

If the input is several topics mashed together, split them and tag each one.

### 2. Cut the slop phrases and AI tropes

LLM drafts are full of throat-clearing openers ("Here's the thing:"), filler transitions ("It's worth noting that"), pedagogical hand-holding ("Let's dive into"), meta-commentary ("In this section, we'll explore..."), marketing puffery (*powerful, robust, seamless, comprehensive*), and sales-deck verbs (*leverage, utilize, empower, harness*).

See `references/phrases.md` for the full catalog.

### 3. Break formulaic AI structures

The dead giveaways are binary contrasts ("Not because X. Because Y."), negative listings ("Not a bug. Not a feature. A design flaw."), dramatic fragmentation ("Speed. That's it."), self-posed rhetorical questions ("The result? Devastating."), bold-first bullets ("**Security**: We use..."), em-dash addiction, and false ranges.

See `references/structures.md` for the catalog and fixes.

### 4. Apply the style guide rules

The cross-cutting style rules — active voice, present tense, customer perspective, no marketing language, no self-referential writing, "use" not "utilize", "select" not "click", sentence-case headings, no "and so on", contractions only in conversational/tutorial content — apply to every topic type.

See `references/style-guide.md` for the full set with examples. The style-guide rules are product-agnostic; for Seqera Platform docs specifically, also apply `references/terminology.md` (product names, pipeline vs workflow, bold vs backticks, UI names).

### 5. Apply the topic-type rules

Each type has its own structural and stylistic conventions. These are the highest-leverage edits because they often involve splitting, renaming, or reshaping topics, not just word swaps.

See `references/topic-types.md` for the per-type rules.

**Prerequisites and troubleshooting are special on Seqera docs — hand off to the `docs-structure` skill.** Deslop's job is to detect them and delegate; the `docs-structure` skill owns both conventions and is the single source of truth. Prerequisites are reformatted in place; inline troubleshooting moves off the page entirely, no matter how few entries it has. See step 5 of the workflow for the full handoff rules.

### 6. Cut hard

A heavy rewrite of a slop-heavy draft typically removes 20–40% of the words. Treat that as the expected outcome for bloated input, not a quota to hit on every input. If the source is already tight — a clean sentence, a well-built reference table, the small scoped selection from step 1 — the right cut may be zero (see rule 7 and Example 8). Don't pad, reorder, or paraphrase good prose just to register a change. When the input *is* bloated, the biggest sources of LLM bloat in docs are:

- A "Conclusion" or "Summary" section that restates the doc
- Restating the same point in three different ways (one-point dilution)
- Triple-synonym lists ("fast, efficient, and performant")
- Padding phrases ("in order to" → "to", "due to the fact that" → "because")
- Marketing intros above task steps or reference tables

### 7. Keep what's already good

If a sentence is direct, specific, and active, leave it alone. If a paragraph reads like a competent engineer wrote it, ship it as-is.

This skill is aggressive, so guard against over-correction: some precise words read like slop but aren't. Before swapping a word for a "plainer" one, check the okay list at the top of `references/phrases.md` — it names words (such as *augment*, *recommended*, *additional*) that earn their place and should not be replaced.

### 8. Never invent facts

If you do not know what a flag, command, or term does, leave the original wording. Do not paraphrase technical content into vagueness. If a claim seems wrong, flag it in the change summary rather than silently fixing it.

## Quick checks before delivering

Run these against **your rewritten output**, not the input — a heavy rewrite routinely introduces fresh slop (a new `, so` join, a table that doesn't fit, a semicolon) while compressing the original. Read your own draft as if someone else wrote it. Any "yes" answer means another revision.

Do this as a **plain read of every sentence**, not only a match against the word lists. The catalogs in `phrases.md` and `structures.md` are not exhaustive — colloquial verbs (`grab`, `spin up`, `hit`, `dig into`) and other informal register slip past a list-only scan. Read the whole file, **including admonition blocks** (`:::tip`, `:::note`, `:::info`), which are easy to skip because they look like settled asides.

**In passive mode**, the structural checks below (classification split, renamed headings, body-H1 removal, marketing intros above tables, prerequisites reformat, table-vs-list reshape) become "did you *flag* this as a recommendation?" rather than "did you *do* it?" — passive mode reports the structural problem, it doesn't fix it. The word- and sentence-level checks (slop phrases, connectors, punctuation, voice, tense, terminology, abbreviations) apply unchanged. **In verbose mode**, also confirm Artifact 2 lists each significant edit as a before → after pair with its triggering rule.

- Did you classify each section into one of Concept / Task / Reference / Troubleshooting / Tutorial?
- Did you actually deliver **both** artifacts — the rewritten text **and** the change summary (Artifact 2)? The summary is required every time, including short pasted snippets. Delivering the rewrite alone is an incomplete response.
- For a file input, did you edit the original file in place (not create a separate copy)?
- Did you preserve all non-prose exactly — frontmatter structure and machine-read values (`slug`, `id`, `tags`, `sidebar_position`, dates), `import`/`export` lines, JSX/MDX components, admonition markers, and code blocks? (The `title:`/`description:` *values* are prose and may be rewritten.)
- If you renamed any heading, did you flag it in the change summary so inbound anchor links (`page.md#old-anchor`) and in-page TOC links can be updated? (Renaming a heading changes its auto-generated anchor and breaks existing links to it.)
- If the page title is supplied outside the body (frontmatter `title:`, or the user said the title supplies the H1), did you remove the body H1 instead of renaming it?
- Did the change summary carry every **summary-only obligation**? These produce no visible change in the rewrite text, so they're easy to drop: glossary candidates for recurring undefined terms (`clarity.md`), any claim you dropped as unsupported (the never-invent rule), and renamed-heading anchor flags.
- For a slop-heavy input, is the rewrite the same length or longer than the original? (You did not cut enough.) For already-tight or small scoped input, no cut is fine — don't manufacture one.
- If the user supplied specific facts (a "Facts:" block, stand-in values), does every supplied fact appear in the rewrite? Deleting a vague claim whose specifics were supplied is over-cutting — substitute, don't cut.
- Does the title match its topic type (noun for concept/reference, active verb + noun for task/tutorial, error message for troubleshooting reference)?
- Are there numbered steps inside a concept? (They belong in a task.)
- Are there marketing intros above a reference table? (Cut them or move to a concept.)
- For Seqera guides/tutorials with prerequisites: are they in a `:::info[**Prerequisites**]` admonition with a `You need the following:` lead-in and noun-phrase bullets (not a numbered list, not a plain `Prerequisites:` heading)? (Step 5; the `docs-structure` skill's `references/prerequisites.md`.)
- Did you wrap a table around content that isn't a parallel-attribute lookup? Release notes, changelogs, and chronological lists are bulleted lists, not tables. (See `topic-types.md`.)
- Are there em-dashes used as decorative pauses?
- Are two clauses joined with ", so" (or ", which means", ", thus")? Split them or lead with the cause.
- Are there semicolons, or colons used mid-sentence (not introducing a list, steps, or label)? Replace with periods.
- Is any technical term used before it's defined on the page, or any sentence over ~30 words? (See `clarity.md`.)
- Are there any phrases from `references/phrases.md` still present?
- Are there colloquial or informal verbs (`grab`, `spin up`, `hit`, `dig into`, `kick off`)? Swap for the plain verb — and check inside admonition blocks, not just body prose. (See "Colloquial / informal verbs" in `phrases.md`.)
- Is there passive voice where an actor could be named?
- Is there future tense ("will create") where present tense works ("creates")?
- Is anything described in vague marketing terms ("powerful", "robust", "seamless")?
- Are there any "X allows you to", "this guide explains", "in conclusion", "it's worth noting"?
- Are product names and terms correct (`Seqera Platform` not `Tower`, `pipeline` vs `workflow`), and are UI elements bold while code is in backticks? (See `terminology.md`.)
- When a product name is misspelled (NextFlow, multiQC), did you correct it in place rather than rephrase the mention away?
- Is every abbreviation spelled out on first use **with the abbreviation in parentheses** — for example, role-based access control (RBAC), high-performance computing (HPC)?

## Output format

Return the two artifacts below, in this order.

### Artifact 1 — the rewritten text

**If the input was a file**, edit the original file in place with the rewritten text. Do not create a separate copy. Rely on version control (git) to preserve the original for diffing and review. For .docx inputs, follow the docx skill's guidance.

**If the input was pasted text**, return the rewritten text in a fenced code block (or as prose if the user clearly wants it inline).

If the rewrite splits the input into multiple typed topics, use clear `##` headings for each topic in the rewritten file and tag them by type in the change summary.

### Artifact 2 — the change summary

A scannable list of three to seven bullets. The first bullet **must** name the topic type(s) you classified the input as. The rest name the categories of change, with counts where possible.

When a mode is active, prefix the summary with a mode line (`Mode: passive`, `Mode: verbose`, or `Mode: passive + verbose`). **In passive mode**, add the structural changes you suppressed as a `Recommend (full mode):` block so the user knows what a full rewrite would do. **In verbose mode**, replace the category bullets with per-edit `before → after` pairs grouped by triggering rule — see the example in [Modes](#modes).

The summary is also where the **summary-only obligations** live — items that change nothing in the rewrite text but must still be reported: glossary candidates for terms that recur undefined (`clarity.md`), claims dropped as unsupported rather than reworded (the never-invent rule), and renamed headings whose anchors will break inbound links.

Good shape:

> - Classified as **Task** (was untyped; the original was titled `Configuration` and mixed concept + task content)
> - Renamed title from `Configuration` to `Add an AWS Batch compute environment` (active verb + noun, per Task rules)
> - Moved the two paragraphs of "why compute environments matter" into a separate `## Compute environments` Concept section above the task
> - Converted "Ensure that you have..." prose into a `Prerequisites:` list (3 items)
> - Cut 8 marketing adjectives (powerful, comprehensive, seamless, etc.)
> - Cut the "In conclusion" paragraph
> - Reduced length 34% (820 → 540 words)

Bad shape:

- Made the doc clearer
- Improved structure
- Removed slop

If you spotted a likely factual issue but did not change it (per rule 8), flag it under a "Flagged for review:" line.

## Quick inline examples

**Example 1 — mistyped Concept (a README intro):**

Before (title: `Getting Started with Seqera Platform`; body is half marketing, half launch steps):

> Seqera Platform is a powerful, comprehensive solution that empowers scientific teams to seamlessly run their pipelines at scale.
>
> In this guide, we'll walk you through how to launch your first pipeline. First, select a pipeline on the Launchpad. Then, choose a compute environment. Finally, launch the run.

After (split into a Concept and a Task):

```markdown
# Seqera Platform

Seqera Platform runs Nextflow pipelines on cloud and HPC compute environments. It provides a Launchpad for launching pre-configured pipelines, real-time run monitoring, and shared workspaces for teams.

## Launch a pipeline

To launch a pipeline from the Launchpad:

1. In your workspace, select **Launchpad**, then select a pipeline.
2. Select a compute environment.
3. Set the run parameters and work directory.
4. Select **Launch**.
```

Change summary: Split into a **Concept** (`Seqera Platform`, noun title) and a **Task** (`Launch a pipeline`, active verb + noun). Removed marketing intro and self-referential framing. Converted "First, ... Then, ... Finally" prose into a numbered steps list.

**Example 2 — Reference with a sales intro:**

Before (title: `Compute Environment Options`):

> Our comprehensive set of compute environment options gives you the flexibility and power to run pipelines on any infrastructure. Whether you're optimizing for cost or speed, we've got you covered.
>
> The following options are available:
>
> - `region`: The AWS region.
> - `workDir`: The work directory.
> - `maxCpus`: The maximum CPUs.

After:

```markdown
# AWS Batch compute environment settings

| Setting             | Type    | Default | Description                                                         |
| ------------------- | ------- | ------- | ------------------------------------------------------------------- |
| `region`            | string  | —       | AWS region where Batch runs jobs, for example `us-east-1`.          |
| `workDir`           | string  | —       | S3 bucket path for pipeline scratch and intermediate files.         |
| `provisioningModel` | string  | `SPOT`  | EC2 provisioning model. One of `SPOT`, `EC2` (on-demand).           |
| `maxCpus`           | integer | `256`   | Maximum vCPUs Batch provisions across all jobs in this environment. |
```

Change summary: Classified as **Reference**. Cut the marketing intro paragraph entirely. Converted the bulleted list into a four-column table (`Setting | Type | Default | Description`), the standard Reference shape.

**Example 3 — Troubleshooting without the error in the title:**

Before (title: `Launch Issues`):

> Sometimes you might run into problems when launching a pipeline. Don't worry — these things happen! If you see something like an access denied error, you can try a few things.

After:

```markdown
# Error: `AccessDenied (Service: S3, Status Code: 403)` when launching a run

This error occurs when the compute environment's credentials do not have write access to the pipeline work directory bucket.

To resolve:

1. Confirm the work directory points to a bucket you own: `tw compute-envs view --name <ce-name>`.
2. Verify the credentials' IAM policy allows `s3:PutObject` and `s3:GetObject` on that bucket.
3. Relaunch the run.
```

Change summary: Classified as **Troubleshooting reference**. Moved the actual error message into the title with `Error:` prefix. Cut the friendly opener. Restructured body as symptom → cause → numbered resolution steps. Replaced "you can try a few things" with three concrete diagnostic actions.

See `references/examples.md` for more before/after passages.

## Reference files

Read these as needed. Pull in the ones relevant to the topic type and the patterns you see.

- `references/topic-types.md` — **read first** for classification and per-type rules (Concept, Task, Reference, Troubleshooting, Tutorial)
- `references/phrases.md` — the okay list (precise words **not** to replace) plus slop phrases, hedges, weak confidence words, marketing adjectives, padding, nominalizations, and non-inclusive language to cut or replace
- `references/structures.md` — formulaic AI sentence and paragraph structures, loose connectors (`, so`, `;`), and punctuation, with fixes
- `references/clarity.md` — readability: defining terms on first use, sentence length, nested clauses, glossary candidates
- `references/style-guide.md` — the cross-cutting technical writing style rules (active voice, present tense, customer perspective, word choice)
- `references/terminology.md` — **Seqera Platform-specific** terminology and formatting (product/tool names, lowercase feature nouns, pipeline vs workflow, run vs task, bold vs backticks, UI names, env vars)
- `references/examples.md` — longer before/after passages across the topic types

**Related skill:** for Seqera docs, two structural conventions are owned by the `docs-structure` skill, and deslop must delegate both (Skill tool, `skill: "docs-structure"`; see step 5 of the workflow): **prerequisites** (`references/prerequisites.md`: a `:::info[**Prerequisites**]` admonition with a `You need the following:` lead-in and noun-phrase bullets, never deslop's generic `Prerequisites:` heading) and **troubleshooting placement** (`references/troubleshooting.md`: inline troubleshooting moves off feature pages to the product's `troubleshooting_and_faqs/` pages with a pointer link left behind — even a single entry).

## A note on judgment

The rules are guides, not laws. A well-placed em-dash, a single "comprehensive", a soft opener — any of these can be the right choice if the author chose it deliberately. The question to ask each time is: *is this word doing work, or is it filler?*

When in doubt, lean toward cutting. The user asked for a heavy rewrite. They can always tell you to back off.
