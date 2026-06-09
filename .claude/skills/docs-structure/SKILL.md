---
name: docs-structure
description: Apply Seqera docs house structural conventions to a documentation page or selection — page introductions, prerequisites, troubleshooting placement, admonitions, and other structural elements. Use when the user asks to format, clean up, standardize, restructure, or fix the structure of a docs page, or when writing a new guide/tutorial that needs to follow house format. Each structural area has its own reference file under references/.
---

# Structure skill

## Description

This skill applies the Seqera docs house formatting conventions to a page or a
selected region. It standardizes the structural, repeatable parts of a page —
how the introduction is written, how prerequisites are presented, which
admonition syntax to use — so pages look and read consistently across the docs.

This skill is about **structure**, not prose quality. To strip AI
slop and tighten wording, use the `docs-deslop` skill; the two compose (deslop owns
voice and cuts, `docs-structure` owns structure). When `docs-deslop` runs on a Seqera page
with prerequisites or inline troubleshooting, it applies this skill's conventions.

**Scope**: Seqera docs (`platform-cloud/`, `platform-enterprise_docs/`, versioned
docs, `fusion_docs/`, `wave_docs/`, `multiqc_docs/`). Markdown/MDX pages.

## When to use

Use this skill when:
- The user asks to format, clean up, standardize, or fix the structure of a page.
- Writing a new guide or tutorial that must follow house format.
- A page's structure drifts from house conventions (non-standard admonitions, a
  mixed intro/prerequisites block, prerequisites as numbered steps, etc.).

## Formatting areas

Each area has a reference file under `references/`. Read the reference for the
area you're working on and apply its spec.

| Area            | Reference                       | Covers                                                                       |
| --------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| Prerequisites   | `references/prerequisites.md`   | The `:::info[**Prerequisites**]` admonition, lead-in, bullet phrasing         |
| Troubleshooting | `references/troubleshooting.md` | Moving inline troubleshooting sections to the product's troubleshooting pages |

(More areas will be added over time — page introductions, admonition types,
image/asset conventions, and so on. Add a row here and a reference file when you
codify a new convention.)

## Process

1. **Read the page.** Use the file the user named, the file in focus, or the
   changed files in the branch. Read the whole file before editing so an in-place
   change can't drop content it never saw.
2. **Identify the in-scope region.** If the user pointed at a section or
   selection, format only that. Otherwise format the whole page.
3. **Pick the relevant formatting areas** for what's in scope, and read each
   area's reference file.
4. **Apply each area's spec** with surgical Edits — touch only the region the
   convention governs; leave the rest of the page byte-for-byte unchanged.
5. **Preserve non-prose exactly**: frontmatter keys and machine-read values,
   code blocks, `import`/`export` lines, JSX/MDX components, links, and anchors.
   Never drop a link, anchor, or list item — only restructure.
6. **Summarize**: name each formatting area you applied and the change made, and
   flag any judgment call (e.g. a heading rename that affects inbound anchors) for
   the user to confirm.

## Important notes

- **Format, not prose**: this skill standardizes structure. For wording and slop,
  defer to `docs-deslop`.
- **Surgical edits**: change only the regions the conventions govern.
- **Preserve content**: never drop a prerequisite, link, anchor, or list item.
- **Ask before overwriting** when a change involves a judgment call the user
  should weigh in on (e.g. rewriting an introduction).