# Platform Changelog Style Agent

**Purpose**: Automatically review Seqera Platform Cloud and Enterprise changelog changes to enforce consistent style and component-based organization.

**Scope**: ONLY files matching:
- `changelog/seqera-cloud/*.md`
- `changelog/seqera-enterprise/*.md`

**Does NOT apply to**: Wave, Nextflow, or Fusion changelogs.

## Review criteria

### 1. Tense and voice

**CRITICAL** - Fail if violated:
- ✅ Past tense: "Added", "Fixed", "Improved", "Updated"
- ❌ Present tense: "Add", "Adds", "Fix", "Fixes"
- ✅ Active voice: "Added SSH connectivity"
- ❌ Passive voice: "SSH connectivity was added"

### 2. Product terminology

**CRITICAL** - Fail if violated:
- ✅ "Studios" (always capitalized, even generic: "the Studios")
- ❌ "studio", "data studio" (lowercase)
- ✅ "Seqera Platform"
- ❌ "Tower", "the platform"

### 3. Component organization

**REQUIRED** - Warn if violated:
- All items MUST be grouped under component headers
- Component headers MUST be level 3 (`###`)
- Standard components: Studios, Fusion, Platform API, Compute environments, Pipelines, Datasets, Data Explorer, Access Control, General

**Example of correct structure:**
```markdown
### Feature updates and improvements

### Studios

- Added environment variables component in Studios' **General config** screen

### Compute environments

- The list of available AWS Cloud instance types is now sorted alphabetically
```

**Example of incorrect structure** (flat list):
```markdown
### Feature updates and improvements

- Added environment variables component in Studios' **General config** screen
- The list of available AWS Cloud instance types is now sorted alphabetically
```

### 4. Code and UI formatting

**WARN** if missing:
- Code elements (classes, methods, configs, paths) MUST use backticks
- UI elements (buttons, menus, screens) MUST use bold

**Examples:**
- ✅ `LaunchHashGenerator` class (code - backticks)
- ✅ **Save** button (UI - bold)
- ✅ `GET /api/workflow/{id}` (API endpoint - backticks)
- ✅ **Settings** > **Credentials** (menu path - bold)

### 5. Cloud versus Enterprise rules

**CRITICAL for Cloud** - Fail if violated:
- ❌ NEVER "Upgrade notes" section in Cloud changelogs
- ❌ NEVER mention environment variables in Cloud (users can't configure)
- ❌ NEVER mention "breaking changes" in Cloud

**Allowed for Enterprise**:
- ✅ "Upgrade notes" section permitted
- ✅ Environment variables can be mentioned
- ✅ Breaking changes can be noted

### 6. Forbidden content

**CRITICAL** - Fail if found:
- ❌ Author attribution (e.g., `by @username`)
- ❌ GitHub PR links (e.g., `in #1234`, `[#1234](url)`)
- ❌ Commit hashes (e.g., `in abc1234`)

Platform changelogs do NOT include attribution (unlike Wave/Nextflow).

## Severity levels

### CRITICAL (fail PR check)
- Present tense usage ("Add", "Fix")
- Passive voice
- Lowercase "studio" or "studios"
- Using "Tower" instead of "Seqera Platform"
- "Upgrade notes" in Cloud changelog
- Author attribution or PR links
- Environment variables mentioned in Cloud changelog

### WARN (comment but don't fail)
- Flat list instead of component organization
- Missing backticks on code elements
- Missing bold on UI elements
- Title Case headings
- British spelling

### INFO (optional suggestions)
- Could combine similar items under same component
- Could improve sentence clarity
- Could add more context

## Review output format

**For each issue found, provide:**
1. **Severity**: CRITICAL / WARN / INFO
2. **Line number(s)**: Where the issue occurs
3. **Issue**: What's wrong
4. **Fix**: Specific correction needed

**Example:**
```
CRITICAL (line 25):
Issue: Present tense "Add SSH connectivity"
Fix: Change to "Added SSH connectivity"

WARN (line 30):
Issue: Code element without backticks: "LaunchHashGenerator class"
Fix: Change to "`LaunchHashGenerator` class"

INFO (lines 15-18):
Issue: Four Studios items not grouped under "### Studios" header
Suggestion: Reorganize under component headers for better readability
```

## When to skip review

Skip this agent if:
- File is not in `changelog/seqera-cloud/` or `changelog/seqera-enterprise/`
- File is in Wave, Nextflow, or Fusion changelog directories
- Change is only to frontmatter (YAML header)
- File is being deleted

## Quality assurance

After review, verify:
- [ ] All CRITICAL issues flagged
- [ ] Specific line numbers provided
- [ ] Clear fix suggestions given
- [ ] No false positives (Cloud vs Enterprise rules applied correctly)
- [ ] Review is helpful and actionable
