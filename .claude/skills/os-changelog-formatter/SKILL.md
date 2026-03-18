---
name: 0s-changelog-formatter
description: Format and style-check open source Nextflow and Wave changelogs to ensure consistency in voice, tense, attribution, linking, and component-based organization. Use when formatting a changelog in changelog/nextflow/ or changelog/wave/.
---

# Changelog formatter skill

## Description

Format and style-check **Nextflow** and **Wave** changelogs to ensure consistency in voice, tense, formatting, attribution, and component-based organization.

**Scope**: ONLY Nextflow and Wave changelogs.
**Does NOT apply to**: Seqera Platform Cloud, Enterprise, Fusion, or MultiQC changelogs.

## Deployment

**CI/CD:** Not used | **Invocation:** Local manual use only

## When to use

Use this skill when:
- User asks to "format a changelog" for Nextflow or Wave
- User provides a Nextflow or Wave changelog file needing formatting
- User asks to check Nextflow or Wave changelog style
- File path contains `changelog/nextflow/` or `changelog/wave/`

## Process

### 1. Read the changelog file

Read the provided changelog file.

### 2. Verify scope

Confirm the file is in:
- `changelog/nextflow/*.md` OR
- `changelog/wave/*.md`

If NOT a Nextflow or Wave changelog, stop and inform the user that this skill only applies to Nextflow and Wave changelogs. Direct them to `/platform-changelog-formatter` for Seqera Platform changelogs.

### 3. Identify the product

**Wave changelog indicators:**
- File path: `changelog/wave/`
- Frontmatter title: `Wave vX.Y.Z`
- Frontmatter tags: `[wave]`
- Footer URL pattern: `https://github.com/seqeralabs/wave/compare/...`

**Nextflow changelog indicators:**
- File path: `changelog/nextflow/`
- Frontmatter title: `Nextflow X.Y.Z` or `Nextflow X.Y.Z-edge`
- Frontmatter tags: `[nextflow]`
- Footer URL pattern: `https://github.com/nextflow-io/nextflow/releases/tag/...`

### 4. Apply universal style rules

#### Frontmatter

Every changelog must have YAML frontmatter:

```yaml
---
title: <Product> <version>
date: YYYY-MM-DD
tags: [<product>]
---
```

- Wave title format: `Wave vX.Y.Z`
- Nextflow title format: `Nextflow X.Y.Z` (no `v` prefix) or `Nextflow X.Y.Z-edge`
- `tags` must be `[wave]` or `[nextflow]`
- Date must be `YYYY-MM-DD` format

#### Tense

- ✅ Use past tense: "Added", "Fixed", "Improved", "Updated", "Bumped", "Removed", "Changed"
- ❌ Never present tense: "Add", "Adds", "Fix", "Fixes", "Improve"

#### Voice

- ✅ Active voice: "Added support for CSI S3 driver"
- ❌ No passive: "Support for CSI S3 driver was added"

#### Sentence structure

- Start each item with a past-tense action verb
- Keep concise — one sentence per item
- Pattern: `- <Action verb> <what changed> [optional context] by @username in [link]`
- No trailing period

#### Section headings

Top-level sections use `##` in sentence case:
- `## Feature updates and improvements`
- `## Bug fixes`
- `## Dependencies` (Nextflow only — may be a top-level section)
- `## Migration notes` (Wave only — when breaking migrations required)

- ✅ Sentence case: `## Feature updates and improvements`
- ❌ Never title case: `## Feature Updates And Improvements`

#### Subsection headings

Component subsections use `###` in title case:
- ✅ `### Language features`, `### Container building`, `### General`
- ❌ Never `####` or deeper for components

#### Code elements

Use backticks for ALL technical identifiers:
- Config keys: `` `nextflow.config` ``, `` `aws.batch.terminateUnschedulableJobs` ``
- Commands: `` `nextflow inspect` ``, `` `wave.scan.enabled` ``
- Package names: `` `nf-amazon@3.4.3` ``, `` `libseqera` ``
- File paths and flags: `` `--profile` ``, `` `.exitcode` ``
- Class/method names: `` `LaunchHashGenerator` ``, `` `Remove()` ``

#### Attribution

Every item (except dependency bumps without a linked PR) must include:
- Author: `by @username`
- Link: `in [#1234](https://github.com/org/repo/pull/1234)` for PRs
- Link: `in [abc1234](https://github.com/org/repo/commit/full-hash)` for commits

Commit links use a short hash (7–9 chars) as display text, but link to the full hash URL.

If attribution is missing from the source and cannot be determined, preserve the item without attribution rather than fabricating it.

#### Spelling

- ✅ American English: "optimization", "behavior", "organization"
- ❌ Never British: "optimisation", "behaviour", "organisation"

#### Footer

Every changelog must end with a full changelog link on its own line:

- Wave: `**Full changelog**: https://github.com/seqeralabs/wave/compare/vOLD...vNEW`
- Nextflow: `**Full changelog**: https://github.com/nextflow-io/nextflow/releases/tag/vX.Y.Z`

Use `**Full changelog**:` (bold, with colon). If the incoming file has a bare URL, add the bold prefix.

### 5. Apply component organization

Both Wave and Nextflow use component-based subsections within each top-level section. Items must be grouped under a relevant `###` subsection — never listed directly under a `##` section without a subsection.

#### Wave component categories (in typical order)

1. Container building
2. Singularity
3. UI/UX
4. Dependencies
5. General (catch-all)

#### Nextflow component categories (in typical order)

1. Language features
2. Configuration
3. S3
4. AWS Batch
5. Google Batch
6. Azure
7. Kubernetes
8. Plugins
9. Fusion
10. Wave
11. General (catch-all)
12. Dependencies (may appear as subsection OR as top-level `##` section)

**Categorization rules:**
- Group all items by component using `###` subsection headers
- Use `### General` for any item that doesn't clearly belong to a specific component
- `### Dependencies` holds package version bumps (e.g., `Bumped nf-amazon@3.4.3`)
- Do NOT invent new component categories — use existing ones or `### General`

#### Dependencies placement

- **Wave**: Place dependency bumps under `### Dependencies` inside `## Feature updates and improvements`
- **Nextflow**: Dependencies may appear as `### Dependencies` subsection inside `## Feature updates and improvements`, OR as a standalone `## Dependencies` top-level section — match whatever pattern the incoming changelog uses, or use a standalone `## Dependencies` section if items are not clearly part of features

### 6. Preserve important content

**DO preserve:**
- Frontmatter (title, date, tags)
- All changelog items — never drop content
- Migration notes sections and their content (Wave)
- Existing PR and commit links
- Version numbers and package names

**DON'T add:**
- New content not present in the original
- Made-up PR numbers or commit hashes
- Author attribution that cannot be verified from the source

### 7. Quality checklist

Before outputting, verify:
- [ ] Frontmatter present and correct format
- [ ] Past tense throughout all items
- [ ] Active voice
- [ ] All items have `by @username in [link]` attribution (if source had it)
- [ ] Code elements in backticks
- [ ] All `##` section headings in sentence case
- [ ] All `###` subsection headings in title case
- [ ] No items listed directly under `##` without a `###` subsection
- [ ] `### General` used for uncategorized items
- [ ] No trailing periods on list items
- [ ] Footer present with `**Full changelog**:` prefix and correct URL
- [ ] American spelling
- [ ] Migration notes section preserved (Wave)

### 8. Output the formatted changelog

Write the formatted changelog to the same file, or a new file if the user requests it.

Provide a brief summary of changes made:
- Tense corrections
- Attribution or link fixes
- Subsection reorganizations
- Code backtick additions
- Anything ambiguous or that needs the user's attention

---

## Component keyword guide

Use these keywords to assign items to subsections:

| Subsection | Keywords / signals |
|---|---|
| Language features | DSL, workflow outputs, typed processes, closures, operators, `Channel::`, script syntax, type checking |
| Configuration | `nextflow.config`, `config`, config scope, `executor`, profile, manifest, `params` block |
| S3 | S3, AWS S3, multipart upload, `aws.s3`, S3 regional endpoint |
| AWS Batch | AWS Batch, `aws.batch`, SIGTERM, spot, job names |
| Google Batch | Google Batch, GCP, exit codes |
| Azure | Azure, AKS, SAS, Azure Blob |
| Kubernetes | K8s, Kubernetes, pod, `.command.log`, OOM, `k8s` |
| Plugins | plugin, `nf-` plugin, `Plugins.init()`, `PluginSpec` |
| Fusion | Fusion, `fusion`, JWT, Fusion license, FusionFS |
| Wave | Wave, container augmentation, wave build |
| Container building | container build, BuildKit, Dockerfile, Conda, Pixi, CRAN, build template, multi-platform |
| Singularity | Singularity, Apptainer, init container, `.sif` |
| UI/UX | UI, UX, web UI, build view, display, front-end |
| Dependencies | `Bumped`, version update, `libseqera`, security update, dependency |
| General | Anything that doesn't match above |

---

## Example transformations

### Missing frontmatter (before)

```markdown
### Feature updates and improvements

- Add support for CSI S3 driver in Wave by @munishchouhan in #875
```

### After

```markdown
---
title: Wave v1.25.0
date: 2025-09-02
tags: [wave]
---

## Feature updates and improvements

### General

- Added support for CSI S3 driver in Wave by @munishchouhan in [#875](https://github.com/seqeralabs/wave/pull/875)

**Full changelog**: https://github.com/seqeralabs/wave/compare/v1.24.0...v1.25.0
```

---

### Ungrouped items (before)

```markdown
## Feature updates and improvements

- Added exit code from pod to manage OOM in k8s by @jorgee in [#6442](https://github.com/nextflow-io/nextflow/pull/6442)
- Simplified S3 configuration options by @bentsherman in [#6496](https://github.com/nextflow-io/nextflow/pull/6496)
- Added publish-artifacts step to release process by @pditommaso in [75d8ebf](https://github.com/nextflow-io/nextflow/commit/75d8ebf9b)

## Bug fixes

- Fixed no secrets in AWS Batch jobs by @jorgee in [#6499](https://github.com/nextflow-io/nextflow/pull/6499)
```

### After

```markdown
## Feature updates and improvements

### Kubernetes

- Added exit code from pod to manage OOM in k8s by @jorgee in [#6442](https://github.com/nextflow-io/nextflow/pull/6442)

### S3

- Simplified S3 configuration options by @bentsherman in [#6496](https://github.com/nextflow-io/nextflow/pull/6496)

### General

- Added publish-artifacts step to release process by @pditommaso in [75d8ebf](https://github.com/nextflow-io/nextflow/commit/75d8ebf9b)

## Bug fixes

### AWS Batch

- Fixed no secrets in AWS Batch jobs by @jorgee in [#6499](https://github.com/nextflow-io/nextflow/pull/6499)
```

---

### Wrong tense and bare URL footer (before)

```markdown
## Bug fixes

### General

- Fix scan and mirror enabled flag bug by @munishchouhan in [#935](https://github.com/seqeralabs/wave/pull/935)

https://github.com/seqeralabs/wave/compare/v1.29.1...v1.30.0
```

### After

```markdown
## Bug fixes

### General

- Fixed scan and mirror enabled flag bug by @munishchouhan in [#935](https://github.com/seqeralabs/wave/pull/935)

**Full changelog**: https://github.com/seqeralabs/wave/compare/v1.29.1...v1.30.0
```

---

## Important notes

- **Scope**: This skill applies ONLY to Nextflow and Wave changelogs
- **Attribution**: Always preserve `by @username in [link]` — never fabricate or remove it
- **Preserve content**: Only reorganize and format — never add or remove information
- **General is fine**: Better to put an item in `### General` than to miscategorize it
- **Ask before overwriting**: Confirm before writing changes to the file
