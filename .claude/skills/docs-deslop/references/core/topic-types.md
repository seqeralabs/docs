# Topic types

Every page of technical documentation should be classifiable as one of the following types, which the style guide calls **CTRT** (Concept, Task, Reference, Troubleshooting). A Tutorial is a fifth page-level type, used for end-to-end walkthroughs.

Classifying the input is the first job. Apply the type-specific rules in addition to the general anti-slop rules. A doc that mixes types should be split: a concept paragraph followed by a task is fine on one page, but they obey different rules and the rewrite should treat them as separate topics.

## How to classify

Ask which question the doc is trying to answer:

| Type            | The doc answers...                            | Tells                                                                  |
| --------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| Concept         | What is this? Why would I use it?             | Explanatory prose, no numbered steps, defines a feature or idea        |
| Task            | How do I do this one thing?                   | Numbered steps, imperative verbs, prerequisites, leads to a single outcome |
| Reference       | What are the values / fields / options?       | Tables, lists of settings, flags, fields, return values                |
| Troubleshooting | What's the error and how do I fix it?         | Symptom → cause → workaround/resolution structure; often contains error strings |
| Tutorial        | How do I do this end-to-end scenario?         | Multiple combined tasks, named outcome, often spans features           |

Common technical-doc inputs and their usual classification:

- README intro / "what is X" section → **Concept**
- "How to install / configure / migrate" → **Task**
- API reference, CLI reference, config reference, env-var list → **Reference**
- Release note entries → usually **Reference** (each entry is a typed lookup item). Format each entry as a bulleted list item (change + magnitude + issue/PR number), not a table — see Example 6. Reserve tables for parallel attributes like config options; release notes are a chronological list, not a row-per-attribute lookup.
- On-call runbook → **Troubleshooting** (organized around named failure modes)
- Step-by-step "Build a thing from scratch" guide → **Tutorial**
- "Getting started" guides → usually a Concept followed by a Task or Tutorial

If a doc has more than one type, name each section by its type in the change summary and apply the rules per section.

## Type-specific rules

### Concept

A concept answers **what** and **why**. It does not tell the reader **how**. The "how" belongs in a task.

Rules:

- **Title is a noun or noun phrase**, not a verb. `Pipeline settings`, not `Configure pipelines`. Avoid `-ing` forms in titles (use `Data migration`, not `Migrating data`).
- **Avoid the titles `Overview`, `Introduction`, `How it works`, `Use cases`** — these are non-specific. Replace with a noun someone would actually search for.
- **Each concept covers exactly one concept.** If the prose starts describing a second concept, split it into a separate concept and link.
- **Don't include task steps.** If you find yourself writing `1. Click...`, you're writing a task, not a concept. Move it.
- **Don't include links to related tasks inside the concept body.** Navigation handles that.
- **Length:** a paragraph or two. If a concept is more than ~5 paragraphs, it's probably trying to be a concept + reference or concept + task.

Common AI slop patterns in concepts:

- Marketing puffery instead of an actual definition ("a powerful, comprehensive solution that empowers teams...")
- Self-referential opener ("This guide explains...")
- Vague benefits stack instead of a specific definition

### Task

A task gives the steps to complete one procedure.

Rules:

- **Title is `active verb + noun`**: `Launch a pipeline`, `Configure the compute environment`, `Delete a workspace`. Not `Pipeline launch` (that would be a concept).
- **Lead with context**: "Do this task when you want to..." — one sentence on why the reader would do this.
- **Prerequisites** (if any) as a bulleted list. Don't write `Ensure that...` or `You must have...` — the list is the assertion. **For Seqera Platform docs, follow the `docs-structure` skill's prerequisites convention** (`references/core/prerequisites.md`): wrap them in a `:::info[**Prerequisites**]` admonition with a `You need the following:` lead-in and noun-phrase bullets, not a plain `Prerequisites:` heading. For non-Seqera docs, use the heading `Prerequisites:` (always plural).
- **Steps** as a numbered list. Each step is one action. Use the pattern **location, then action**: "In the top bar, select **Search or go to** and find your project."
- **One step → unordered list item**, not a numbered list of one.
- **Imperative verbs**: "Select", "Create", "Run". Not "You should select", "You can run".
- **Match UI text exactly**, including casing, in bold for buttons/menu items.
- **No "Conclusion" or "Summary" section.** End on the task result if useful ("The issue is created.") or just stop.
- **If multiple ways exist to do the task**, document the primary way only. If you must document several, use subsection titles and list them in descending order of likelihood.

Common AI slop patterns in tasks:

- Pedagogical scaffolding around each step ("Now that you've done X, you'll want to do Y")
- Repetition of "you" / "you'll need to" at the start of every step instead of imperative verbs
- Conclusion paragraphs that restate what the task accomplished
- Optional "context" paragraphs between steps that should be in the lead or cut

### Reference

A reference is lookup material. Think dictionary or settings table.

Rules:

- **Title is a noun**: `Pipeline settings`, `Configuration options`, `API endpoints`.
- **Avoid the titles `Important notes`, `Limitations`** — fold these into the relevant fields or list as `Known issues` if they really stand alone.
- **Use a table** only when the items share the *same* parallel attributes and you want a row-per-item lookup (Name | Description | Default | Required). One row per item.
- **Use a definition list or bulleted list** when each item just has a name and a description, or when the entries don't share a fixed set of attributes.
- **Do not put a table around content that isn't a parallel-attribute lookup.** A table is the wrong shape for a chronological list (release notes, changelogs), a sequence of steps, a single field, or prose that happens to be Reference-typed. When in doubt, use a bulleted list — a table you have to pad with empty/`—` cells or one-off columns is a signal you didn't need a table. Release notes specifically are a bulleted list (see line above and Example 6), never a table.
- **Each entry is self-contained.** A reader who lands on a single row should be able to understand it without reading the rest.
- **One sentence per cell**, ideally. If you need a paragraph, the field probably needs its own concept page.
- **No prose narrative** between table rows. If you have to explain a relationship between fields, that's a concept.

Common AI slop patterns in references:

- Mixing reference rows with prose paragraphs explaining "why" (that belongs in a concept)
- Marketing intros above the table ("Our comprehensive set of options gives you the power to...")
- Inconsistent row formatting — some rows full sentences, others fragments
- Trailing summary paragraphs

### Troubleshooting

Troubleshooting documents named failure modes and their fixes.

Rules:

- **Move troubleshooting topics to the troubleshooting pages** when the product has them. Troubleshooting content does not stay inline on concept, task, or reference pages — move it to the product's dedicated troubleshooting destination (for example, `platform-cloud/docs/troubleshooting_and_faqs/`), no matter how few entries, and leave a one-line pointer on the source page. The `docs-structure` skill owns placement: its `references/core/troubleshooting.md` covers identifying and formatting an entry, and the detected product's `references/products/<product>.md` gives the destination and the existing-vs-new-page rule. Some products (MultiQC, Nextflow) have no destination — leave troubleshooting inline for those. Hand off per step 6 of SKILL.md.
- **Three valid sub-types:**
  - **Introductory** topic (a sentence introducing the section: "When working with X, you might encounter the following issues.")
  - **Troubleshooting task** — title is active verb + noun ("Verify the compute environment", "Check the run logs")
  - **Troubleshooting reference** — title contains the error message or a description of it; body explains cause and fix
- **Use the exact terms `workaround` (temporary) and `resolution` / `resolve` (permanent).** Consistency matters because readers search for these.
- **If the title contains an error message:**
  - State the severity at the start: `Error:`, `Warning:`
  - Wrap the message in backticks
  - If the message is long, use an ellipsis to truncate, and include the full message in the body
- **Body structure:** the symptom (often the exact error), then the cause ("This issue occurs when..."), then the workaround or resolution.
- **If multiple causes or fixes exist**, use a table.

Common AI slop patterns in troubleshooting:

- Generic openers ("Don't worry, these things happen") — error docs should be informative under stress, not chatty
- Hedging on the cause ("This might be due to a variety of factors") — name the cause
- Missing the actual error message
- A "Conclusion" paragraph restating the doc

### Tutorial

A tutorial is an end-to-end walkthrough combining multiple tasks toward a named outcome.

Rules:

- **Title starts with `Tutorial:`** followed by an active verb: `Tutorial: Launch your first pipeline`, `Tutorial: Run nf-core/rnaseq on AWS Batch`.
- **Open with the goal**: one paragraph explaining what the reader will build and the expected outcome.
- **Optionally list the steps** at the top so the reader sees the shape. For short tutorials, omit.
- **"Before you begin" section** for prerequisites — friendlier framing than the `Prerequisites:` of a task. **On Seqera Platform docs, use the `docs-structure` skill's prerequisites convention instead** (`references/core/prerequisites.md`: `:::info[**Prerequisites**]` admonition with a `You need the following:` lead-in and noun-phrase bullets), for consistency with the rest of the docs.
- **Sections are tasks**, each starting with `## Do the first task` style headings using active verbs.
- **Voice is friendlier than other types.** Light future tense is OK ("Next, you'll add the pipeline to the Launchpad"). Encouraging phrases between sections are OK. Be more conversational — but no marketing puffery.
- **Tutorials do not introduce new features.** They combine existing ones into a working example.
- **Screenshots are more welcome** in tutorials than in other docs (they help the reader keep their place in a long walkthrough).

Common AI slop patterns in tutorials:

- Overly chatty openers ("In this exciting tutorial, we'll embark on a journey...")
- Inflated stakes ("This will fundamentally transform your workflow")
- Conclusion sections that restate the steps
- Patronizing analogies in step intros ("Think of it like baking a cake")

## Pages and topics to avoid

Across all types:

- **Pages that are exclusively links to other pages**, except top-level navigation pages.
- **Topics that have only one or two sentences.** Either fold the content into another topic, or, if the sentence is a link to another page, use a `Related topics` link.
- **Hyphens as title separators** ("Compute environments - Architecture"). Rewrite as "Compute environment architecture" or "Architecture of compute environments".

## Topic title guidelines (all types)

- Clear and direct. Make every word count.
- Under 70 characters when possible.
- Use sentence case (`Configure the compute environment`, not `Configure The Compute Environment`).
- Don't repeat text from earlier topic titles on the same page (if the page is "Compute environments", a subsection should be "Troubleshooting", not "Troubleshooting compute environments").
- Follow the type-specific title rule: noun for concept/reference, active verb + noun for task/tutorial, error message for troubleshooting reference.

## What the change summary should say about topic type

When the rewrite reclassifies a topic or splits one, name it explicitly:

- "Classified as **Concept** — removed the embedded task steps (split into a separate Task section)"
- "Classified as **Task** — renamed title from `Pipeline Launch` to `Launch a pipeline`; converted the prerequisite prose into a `Prerequisites:` list"
- "Classified as **Troubleshooting reference** — moved the error message into the title; restructured body as symptom → cause → resolution"
- "Page mixed Concept and Reference — kept both but separated them with explicit headings"

---

### Attribution

The CTRT topic-type model and the per-type rules in this file come from the [GitLab documentation topic types](https://docs.gitlab.com/development/documentation/topic_types/) reference, with light adaptation for use outside that project. See also the per-type pages for [concept](https://docs.gitlab.com/development/documentation/topic_types/concept/), [task](https://docs.gitlab.com/development/documentation/topic_types/task/), [reference](https://docs.gitlab.com/development/documentation/topic_types/reference/), [troubleshooting](https://docs.gitlab.com/development/documentation/topic_types/troubleshooting/), and [tutorial](https://docs.gitlab.com/development/documentation/topic_types/tutorial/).
