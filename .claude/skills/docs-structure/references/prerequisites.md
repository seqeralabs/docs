# Prerequisites

How to write and format prerequisites in Seqera guides and tutorials. When a page
requires the reader to have something in place before they begin, the
prerequisites must follow this one standard format.

Common problems this fixes:

- A top-of-page admonition that mixes the introduction with a prerequisites list.
- Prerequisites written as imperative steps or numbered lists.
- Prerequisites with no lead-in sentence.
- Prerequisites under a plain `## Prerequisites` heading or a non-standard
  admonition type.

## The format

Prerequisites always use this exact structure:

```markdown
:::info[**Prerequisites**]

You need the following:

- <prerequisite>
- <prerequisite>
- <prerequisite>

:::
```

Rules:

1. **Admonition**: always `:::info[**Prerequisites**]`. Never `:::note`, a bare
   `:::info Prerequisites`, or a `## Prerequisites` heading. This matches the
   dominant repo convention (60+ pages).
2. **Lead-in sentence**: always include `You need the following:` on its own line
   before the list. (If the prerequisites are conditional or vary, a more specific
   lead-in is fine — for example, "To follow this tutorial, you need the
   following:" — but keep it to one sentence ending in a colon.)
3. **List type**: use unordered bullet points (`-`), never a numbered list — even
   for setup that happens in sequence. Prerequisites are a checklist of states,
   not ordered steps.
4. **Bullet phrasing**: write each bullet as a noun phrase describing the thing the
   reader must already have, to agree with "You need the following:". Do NOT use
   imperative verbs.
   - ✅ `An organization and workspace`
   - ✅ `A workspace compute environment for your cloud or HPC infrastructure`
   - ❌ `Set up an organization and workspace`
   - ❌ `Create a workspace compute environment`
   Keep any links — move the link onto the relevant words or append a "See …"
   reference: `An organization and workspace. See [Set up your workspace](...)`.
5. **Placement**: the prerequisites admonition comes immediately after the page's
   introduction, before the first section heading.

## Relationship to the introduction

The introduction is plain prose (not inside an admonition), directly under the
frontmatter and H1. If you are fixing a page where the intro was trapped inside
the prerequisites admonition:

- Pull the intro sentence out into a standalone paragraph.
- Rewrite it to lead with what the reader accomplishes on the page — not "This
  tutorial provides an introduction to…".
- If the page already has a strong intro paragraph, merge or drop the trapped
  sentence rather than duplicating it.
- Keep it to 1–3 sentences; cut hedging and filler.

## Process

1. **Find or gather the prerequisites.** Look for an existing prerequisites list
   (often inside a top-of-page admonition), or, when writing new content, identify
   what the reader must have in place.
2. **Fix the introduction** (if a prerequisites/intro block is mixed): extract and
   rewrite the intro as plain prose per the rules above.
3. **Convert each prerequisite** from an imperative step to a noun phrase, preserve
   its link, and switch numbered lists to bullets.
4. **Assemble** the standard structure: frontmatter → H1 → intro paragraph →
   `:::info[**Prerequisites**]` admonition → rest of page (unchanged).
5. **Write** the result with surgical Edits — touch only the intro/prerequisites
   region; leave the rest of the page byte-for-byte unchanged.

## Example

### Before

```markdown
:::info
This tutorial provides an introduction to launching pipelines in Seqera Platform.

**Prerequisites:**
1. [Set up an organization and workspace](../workspace-setup).
1. Create a workspace [compute environment](../../compute-envs/overview) for your cloud or HPC compute infrastructure.
1. [Add a pipeline](./add-pipelines) to your workspace.
1. [Add your pipeline input data](./add-data).
:::

From the Launchpad in every workspace, you create and share Nextflow pipelines...
```

### After

```markdown
From the Launchpad in every workspace, you create and share Nextflow pipelines
that run on any supported infrastructure. This tutorial walks you through
launching the nf-core/rnaseq pipeline.

:::info[**Prerequisites**]

You need the following:

- An organization and workspace. See [Set up your workspace](../workspace-setup).
- A workspace [compute environment](../../compute-envs/overview) for your cloud or HPC compute infrastructure.
- A [pipeline](./add-pipelines) added to your workspace.
- [Pipeline input data](./add-data) added to your workspace.

:::
```

## Important notes

- **Always** `:::info[**Prerequisites**]` with a `You need the following:` lead-in
  and bullet points.
- **Bullets are noun phrases**, not imperative steps — they describe what the
  reader already has.
- **Preserve content**: never drop a prerequisite, link, or anchor — only
  reorganize and rephrase.
- **Surgical edits**: change only the intro/prerequisites region.
- **Ask before overwriting** if the intro rewrite involves a judgment call the
  user should weigh in on.