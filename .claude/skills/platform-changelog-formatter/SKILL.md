---
name: platform-changelog-formatter
description: "Format and style-check Seqera Platform changelogs (Cloud and Enterprise only) for consistency in voice, tense, component-based organization, and formatting conventions. Use when formatting a Platform changelog, checking changelog style for Cloud or Enterprise releases, or working with files in changelog/seqera-cloud/ or changelog/seqera-enterprise/. Does not apply to Wave, Nextflow, or Fusion changelogs — use os-changelog-formatter for those."
---

# Process

## 1. Verify scope and read the changelog

Confirm the file is in `changelog/seqera-cloud/*.md` or `changelog/seqera-enterprise/*.md`. If not, stop and inform the user this skill is Platform-only (Wave/Nextflow/Fusion use a different format with attribution and PR links).

## 2. Apply universal style rules

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
- Must use level 3 headers (`###`) for sections and components

#### Code elements
Use backticks for ALL code:
- Class names: `LaunchHashGenerator`, `VersionedHash`
- Methods: `Remove()`, `getResources()`
- Config keys: `aws.batch.terminateUnschedulableJobs`
- Environment variables: `NXF_HOME`, `TOWER_ENABLE_PLATFORMS`
- File paths: `nextflow.config`, `/path/to/file`
- API endpoints: `GET /api/workflow/{id}`
- Parameters: `maxLength`, `--profile`

#### UI elements
Use bold for UI elements:
- Buttons: **Save**, **Launch**, **Add**
- Menu paths: **Settings** > **Credentials**
- Screen names: **General config**, **Advanced settings**
- Tabs: **Overview**, **Parameters**

#### Product names
- ✅ "Studios" (ALWAYS capitalized, even when generic: "the Studios", "a Studio session")
- ✅ "Seqera Platform" (never "Tower" or "the platform")
- ✅ "Fusion", "Wave", "Nextflow" (capitalized)
- ✅ "compute environment" (lowercase when not a proper noun)

#### Spelling
- ✅ American English: "optimization", "behavior", "organization"
- ❌ Never British: "optimisation", "behaviour", "organisation"

#### Links
- ✅ Descriptive: `[managed identity and managed credentials endpoint](URL)`
- ❌ Never: `[here](URL)` or `[click here](URL)`

## 3. Apply Platform-specific component organization

Platform changelogs MUST use component-based organization:

**Required structure:**
```markdown
## Feature updates and improvements

### Studios

- [Studios features...]

### Compute environments

- [Compute features...]

### Pipelines

- [Pipeline features...]

### [Other components as needed]

- [Component items...]

### General

- [Miscellaneous items...]

## Bug fixes

### Studios

- [Studios bug fixes...]

### [Other components as needed]

- [Bug fixes...]
```

**Component categories** (in this order):
1. Studios
2. Fusion
3. Platform API
4. Compute environments
5. Pipelines
6. Datasets
7. Data Explorer
8. Access Control
9. Monitoring and observability
10. Security and dependencies
11. General (catch-all)

**Categorization rules:**
- Group all items by component using level 3 headers (`###`)
- Use keyword matching to assign items to components (see categorization guide)
- Default to "General" if unclear
- NO author attribution (unlike Wave/Nextflow)
- NO GitHub links to PRs/commits (unlike Wave/Nextflow)

## 4. Cloud versus Enterprise specifics

**Seqera Cloud changelogs:**
- ❌ NEVER include "Upgrade notes" section (Cloud auto-upgrades)
- ❌ NEVER mention environment variables (users can't configure)
- ❌ NEVER mention breaking changes (Cloud has none)

**Seqera Enterprise changelogs:**
- ✅ May include "Upgrade notes" section
- ✅ May mention environment variables
- ✅ May mention breaking changes if applicable

## 5. Preserve important content

**DO preserve:**
- Frontmatter (YAML headers with title, date, tags)
- Special announcements (auth updates, major changes)
- All changelog items (nothing lost)
- Links to documentation
- Version numbers, ticket IDs

**DON'T add:**
- Author attributions (`by @username`)
- GitHub PR links (`in #1234`)
- Commit hashes
- New content not in original

## 6. Quality checks

Before outputting, verify:
- [ ] Past tense throughout
- [ ] Active voice
- [ ] Studios capitalized
- [ ] Code elements in backticks
- [ ] UI elements in bold
- [ ] Component headers are level 3 (`###`)
- [ ] Items grouped by component
- [ ] No "Upgrade notes" for Cloud
- [ ] No author attribution
- [ ] American spelling
- [ ] Descriptive link text
- [ ] Frontmatter unchanged

## 7. Output formatted changelog

Write the formatted changelog to the same file or a new file as requested. Provide a summary: tense corrections, backticks added, items reorganized, and any difficult categorizations.

## Example transformation

### Before (incorrect)
```markdown
### Feature updates and improvements

- Add SSH connectivity to studio forms
- The list of available AWS Cloud instance types is now sorted alphabetically
- Pipeline parameters input form now supports JSON schema draft 2020-12
- Updated container max-width from 1120px to 1672px
```

### After (correct)
```markdown
### Feature updates and improvements

### Studios

- Added SSH connectivity to Studios forms

### Compute environments

- The list of available AWS Cloud instance types is now sorted alphabetically

### Pipelines

- Pipeline parameters input form now supports JSON schema draft 2020-12

### General

- Updated container max-width from `1120px` to `1672px`
```

## Key constraints

- Only reorganize and format — never add or remove information
- Default to "General" rather than miscategorize
- Ask for confirmation before overwriting files
