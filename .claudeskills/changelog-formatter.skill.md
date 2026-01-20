# Changelog Formatter Skill

## Description
Format and style-check Seqera product changelogs (Platform, Wave, Nextflow, Fusion) to ensure consistency in voice, tone, formatting, and structure.

## When to use
Use this skill when:
- User asks to "format a changelog" or "check changelog style"
- User mentions "Wave changelog" or "Nextflow changelog" formatting
- User provides a changelog file that needs style corrections
- User asks to ensure changelog consistency with Seqera standards

## Process

### 1. Read the changelog file
Read the changelog file provided by the user or specified in their request.

### 2. Identify the product type
Determine which Seqera product this changelog is for:
- **Wave/Nextflow**: Requires author attribution and GitHub links
- **Platform**: Component-based organization, no attribution
- **Fusion/Other**: Follow Wave/Nextflow pattern unless specified otherwise

### 3. Apply universal style rules

Check and correct ALL of the following (apply to ALL products):

#### Tense
- ✅ Use past tense: "Added", "Fixed", "Improved", "Updated"
- ❌ Never: "Add", "Adds", "Fix", "Fixes"

#### Voice
- ✅ Use active voice: "Added SSH connectivity"
- ❌ Never passive: "SSH connectivity was added"

#### Sentence structure
- Start with action verbs (Added, Fixed, Improved, Updated, Removed)
- Keep concise (1 sentence ideal, 2 maximum)
- Pattern: `[Action verb] [what changed] [optional: benefit/context]`

#### Headings
- ✅ Sentence case: "Feature updates and improvements"
- ❌ Never Title Case: "Feature Updates And Improvements"
- ✅ Spell out: "and", "versus"
- ❌ Never: "&", "vs", "vs."

#### Code elements
Use backticks for ALL code:
- Class names: `LaunchHashGenerator`, `VersionedHash`
- Methods: `Remove()`, `getResources()`
- Config keys: `aws.batch.terminateUnschedulableJobs`
- File paths: `src/main/groovy/`
- Instance types: `m5d.large`, `g6e`
- API endpoints: `GET /api/admin/orgs/{orgId}/roles`
- Environment variables: `TOWER_ENABLE_PLATFORMS`

#### Product names
ALWAYS capitalize:
- Nextflow (not "nextflow")
- Wave (not "wave")
- Fusion (not "fusion")
- Studio (not "studio" - ALWAYS capitalized, even "the Studio")
- AWS Batch, Kubernetes, Docker, GitHub

#### Punctuation
- ✅ Periods for complete sentences
- ❌ No periods for short phrases (< 5 words)
- Use semicolons to separate related actions in one bullet
- Use American English spelling

### 4. Apply format-specific requirements

#### For Wave/Nextflow changelogs:

**Required elements**:
- Frontmatter (title, date, tags)
- Author attribution for each entry
- GitHub PR or commit links
- Full changelog link at bottom

**Process**:
a) Extract PR/commit information:
   - If entry has PR number `(#123)`, fetch PR to get author
   - If entry has commit hash `[abc123]`, fetch commit to get author
   - Use WebFetch in parallel for multiple items

b) Format each entry:
   - For PRs: `- Description by @username in [#123](https://github.com/org/repo/pull/123)`
   - For commits: `- Description by @username in [hash](https://github.com/org/repo/commit/fullhash)`
   - Remove commit hashes from descriptions (e.g., remove `[1073a1da]`)
   - Keep special labels like `[experimental]`, `[PREVIEW]`, `[BETA]`

c) Add full changelog link:
```markdown
**Full changelog**: https://github.com/org/repo/releases/tag/vX.X.X
```

**Template**:
```markdown
---
title: Product vX.X.X
date: YYYY-MM-DD
tags: [product]
---

## Feature updates and improvements

- Added new feature by @username in [#123](https://github.com/org/repo/pull/123)
- Improved performance by @username in [abc123](https://github.com/org/repo/commit/abc123)

## Bug fixes

- Fixed issue with X by @username in [#456](https://github.com/org/repo/pull/456)

**Full changelog**: https://github.com/org/repo/releases/tag/vX.X.X
```

#### For Platform changelogs:

**Required elements**:
- Component-based organization (Studios, Compute environments, Pipelines, etc.)
- No author attribution
- No PR numbers in descriptions

**Sections**:
- Feature updates and improvements (grouped by component)
- Bug fixes
- Upgrade notes (Enterprise only - skip for Cloud releases)
- Internal changes (optional, for team visibility)

**Template**:
```markdown
## Seqera Platform vX.X.X-cycleYY
Month Day, Year

## Feature updates and improvements

**Studios**
- Added SSH connectivity toggle to Studio forms.

**Compute environments**
- Fixed compute environment listing failures for legacy `SeqeraComputeBatchConfig` instances.

**General**
- Upgraded Angular to latest patch version to fix 12 high-severity npm vulnerabilities.

## Bug fixes

- Fixed "Open in new tab" functionality for workflow reports.
```

### 5. Run quality checks

Verify ALL of the following:
- [ ] All entries use past tense
- [ ] All entries use active voice
- [ ] Headings are sentence case
- [ ] No ampersands (&) - "and" is spelled out
- [ ] No "vs" - "versus" is spelled out
- [ ] Code elements have backticks
- [ ] Product names properly capitalized
- [ ] "Studio" always capitalized (even "the Studio")
- [ ] Periods at end of complete sentences
- [ ] No periods for short phrases
- [ ] Each bullet starts with action verb
- [ ] Concise (1-2 sentences max)
- [ ] Professional, direct tone (no marketing language)
- [ ] American English spelling

**Wave/Nextflow specific**:
- [ ] All entries have author attribution
- [ ] All PR/commit links correct
- [ ] Commit hashes removed from descriptions
- [ ] Full changelog link at bottom
- [ ] Frontmatter present

**Platform specific**:
- [ ] Grouped by component
- [ ] No author attribution
- [ ] Cloud releases have NO "Upgrade notes"

### 6. Report changes made

Provide summary of corrections:
- List tense corrections (e.g., "Adds" → "Added")
- List voice corrections (e.g., passive → active)
- List formatting corrections (missing backticks, capitalization)
- List structural changes (reorganization, attribution added)
- Note any entries that need manual review

### 7. Output formatted changelog

Write the corrected changelog either:
- To the original file (overwrite with corrections)
- To a new file with `-formatted` suffix
- Display in conversation for user review

## Reference Documentation

For detailed style rules, examples, and rationale, see:
`seqera-changelog-style-guide.md`

This skill applies those rules programmatically to format changelogs.

## Important Notes

- **Fetch author info in parallel**: Use multiple WebFetch calls in a single message for efficiency
- **Never skip attribution**: For Wave/Nextflow, always fetch and add author info
- **Preserve content**: Only change style/format, not the substance of changes
- **Apply all rules**: Every bullet point must pass all quality checks
- **Professional tone**: No marketing language, be factual and direct

## Examples

### Before formatting:
```markdown
## Features
- Add support for new caching (#123)
- Improves performance of builds [abc123]
- nextflow integration was enhanced
```

### After formatting:
```markdown
## Feature updates and improvements
- Added support for new caching by @johndoe in [#123](https://github.com/org/repo/pull/123)
- Improved performance of builds by @janedoe in [abc123](https://github.com/org/repo/commit/abc123)
- Enhanced Nextflow integration by @bobsmith in [#124](https://github.com/org/repo/pull/124)
```

### Changes made:
- ✅ "Add" → "Added" (past tense)
- ✅ "Improves" → "Improved" (past tense)
- ✅ "was enhanced" → "Enhanced" (active voice)
- ✅ "nextflow" → "Nextflow" (capitalization)
- ✅ Added author attribution
- ✅ Added GitHub links
- ✅ Removed commit hash from description
- ✅ Changed section name to standard "Feature updates and improvements"
