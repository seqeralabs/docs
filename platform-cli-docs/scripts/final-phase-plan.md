# CLI Documentation - FINAL PHASE Plan

**Date:** 2026-01-15
**Session Focus:** Sidebar organization, single docset strategy, versioning, and CI/CD automation

---

## Current State Analysis

### Documentation Structure
- **Main CLI docs location:** `platform-cloud/docs/cli/`
- **Reference docs:** 16 generated `.md` files in `cli/reference/` covering all major command groups
  - actions.md, compute-envs.md, credentials.md, datasets.md, info.md, labels.md, launch.md, members.md, organizations.md, participants.md, pipelines.md, runs.md, secrets.md, studios.md, teams.md, workspaces.md
- **Supporting docs:**
  - `overview.md` - CLI introduction
  - `installation.md` - Installation instructions
  - `commands.md` - Comprehensive guide with workflows and examples (51KB)

### Current Sidebar Structure
Both `platform-cloud` and `platform-enterprise` sidebars reference:
```json
{
  "type": "category",
  "label": "CLI",
  "collapsed": true,
  "items": [
    "cli/overview",
    "cli/installation",
    "cli/commands"
  ]
}
```

**Issues:**
- No links to the 16 reference docs in `cli/reference/`
- Users can't discover command-specific reference pages via navigation
- Reference docs are "orphaned" - accessible only via direct URL or search

### Duplication Analysis

**Platform Cloud:**
- `docs/cli/` - Main CLI documentation

**Platform Enterprise:**
- `platform-enterprise_docs/cli/` - Separate copy (not symlinked)
- `platform-enterprise_versioned_docs/version-XX/cli/` - Versioned copies for each release

**Current duplication:** CLI docs are duplicated across:
1. Platform Cloud current
2. Platform Enterprise current
3. Each versioned Enterprise release (9+ versions)

---

## 1. Sidebar Organization Strategy

### Recommended Approach: Two-Tier Navigation

Keep the CLI section user-friendly by organizing into:
1. **Getting Started** - Overview, installation, commands guide
2. **Reference** - Individual command group pages

### Proposed Sidebar Structure

```json
{
  "type": "category",
  "label": "CLI",
  "collapsed": true,
  "items": [
    "cli/overview",
    "cli/installation",
    "cli/commands",
    {
      "type": "category",
      "label": "Reference",
      "collapsed": true,
      "items": [
        "cli/reference/actions",
        "cli/reference/compute-envs",
        "cli/reference/credentials",
        "cli/reference/datasets",
        "cli/reference/info",
        "cli/reference/labels",
        "cli/reference/launch",
        "cli/reference/members",
        "cli/reference/organizations",
        "cli/reference/participants",
        "cli/reference/pipelines",
        "cli/reference/runs",
        "cli/reference/secrets",
        "cli/reference/studios",
        "cli/reference/teams",
        "cli/reference/workspaces"
      ]
    }
  ]
}
```

### Alternative: Flat Structure with Categories

If you prefer grouping reference docs by resource type:

```json
{
  "type": "category",
  "label": "CLI",
  "collapsed": true,
  "items": [
    "cli/overview",
    "cli/installation",
    "cli/commands",
    {
      "type": "category",
      "label": "Reference",
      "collapsed": true,
      "items": [
        {
          "type": "category",
          "label": "Resources",
          "items": [
            "cli/reference/compute-envs",
            "cli/reference/credentials",
            "cli/reference/datasets",
            "cli/reference/labels",
            "cli/reference/secrets"
          ]
        },
        {
          "type": "category",
          "label": "Workflows",
          "items": [
            "cli/reference/actions",
            "cli/reference/launch",
            "cli/reference/pipelines",
            "cli/reference/runs"
          ]
        },
        {
          "type": "category",
          "label": "Organization",
          "items": [
            "cli/reference/members",
            "cli/reference/organizations",
            "cli/reference/participants",
            "cli/reference/teams",
            "cli/reference/workspaces"
          ]
        },
        {
          "type": "category",
          "label": "Development",
          "items": [
            "cli/reference/studios"
          ]
        },
        {
          "type": "category",
          "label": "Utilities",
          "items": [
            "cli/reference/info"
          ]
        }
      ]
    }
  ]
}
```

### Recommendation: Start with Simple Two-Tier

Use the simple two-tier approach first:
- ✅ Easy to navigate
- ✅ Clear separation between guides and reference
- ✅ Alphabetically sorted reference pages (predictable)
- ✅ No need to debate categorization

You can always add grouping later if user feedback suggests it's needed.

---

## 2. Single Docset Strategy

### Problem Statement

Currently, CLI docs are duplicated across:
- Platform Cloud docs
- Platform Enterprise docs (current)
- Platform Enterprise versioned docs (9+ versions)

**Issues with duplication:**
- Maintenance burden: Updates must be applied to multiple locations
- Consistency risk: Docs can drift out of sync
- Storage overhead: Identical content stored 10+ times
- CLI versioning doesn't align with Platform versioning

### Key Insight: CLI vs Platform Versioning

**CLI releases are independent from Platform releases:**
- CLI versioning: `0.x.x` (currently 0.9.x)
- Platform Cloud: Continuous deployment (no versions)
- Platform Enterprise: Major.minor versions (23.1, 23.2, 24.1, etc.)

**CLI compatibility:**
- Modern CLI versions work with multiple Platform versions
- Breaking changes are rare
- Most CLI features are backward compatible

### Recommended Strategy: Single Source of Truth

**Primary location:** `platform-cloud/docs/cli/`

**Approach:**
1. **Platform Cloud** uses `docs/cli/` directly
2. **Platform Enterprise current** uses a symlink to Cloud's CLI docs
3. **Platform Enterprise versioned docs** include version-specific snapshots only when needed

### Implementation Plan

#### Step 1: Establish Cloud as Primary Source

Platform Cloud already has the most up-to-date CLI docs with all reference pages.

**No action needed** - Cloud is already the primary.

#### Step 2: Convert Enterprise Current to Symlink

Replace `platform-enterprise_docs/cli/` with a symlink to Cloud:

```bash
cd platform-enterprise_docs
rm -rf cli
ln -s ../platform-cloud/docs/cli cli
```

**Benefits:**
- Enterprise "current" automatically gets CLI updates
- No manual sync needed
- Single source of truth for current docs

**Considerations:**
- Docusaurus must support symlinks (most static site generators do)
- Build process needs to follow symlinks or copy resolved content

#### Step 3: Version CLI Docs Only When Necessary

**Strategy for versioned Enterprise docs:**
- Don't duplicate CLI docs in every Platform Enterprise version
- Only snapshot CLI docs when there's a **breaking change** or **significant feature addition**
- Document CLI version compatibility in the overview

**Example compatibility note:**

```markdown
---
title: "CLI Overview"
---

## Version Compatibility

The Seqera Platform CLI is compatible with:
- **Platform Cloud:** All versions
- **Platform Enterprise:** 23.1 and later

This documentation reflects CLI version 0.9.x. For older CLI versions, refer to the CLI GitHub releases.
```

#### Step 4: Document CLI Versioning Separately

Create a `cli/versioning.md` page that explains:
- CLI release schedule
- Platform compatibility matrix
- How to check CLI version (`tw --version`)
- Where to find CLI changelogs (GitHub releases)

### Alternative: External CLI Docs (Future Consideration)

If the CLI becomes fully independent (used outside Seqera Platform context):

**Option:** Host CLI docs separately at `docs.seqera.io/cli/`
- Cloud and Enterprise link to external CLI docs
- CLI docs maintained in tower-cli repo
- Similar to how API docs are handled

**Not recommended now** because:
- CLI is tightly integrated with Platform
- Reference docs link to Platform concepts
- Additional infrastructure overhead

---

## 3. Versioning Approach

### Current CLI Version

Check the current CLI version in the tower-cli repository:

```bash
# In tower-cli repo
git tag --sort=-version:refname | head -5
```

**Current:** CLI is at 0.9.x (pre-1.0)

### Semantic Versioning for CLI

CLI follows semantic versioning:
- **Major (1.0):** Breaking changes (incompatible API changes)
- **Minor (0.x):** New features (backward compatible)
- **Patch (0.9.x):** Bug fixes

### Platform Compatibility Matrix

Document CLI compatibility in `cli/overview.md`:

```markdown
## CLI Version Compatibility

| CLI Version | Platform Cloud | Platform Enterprise |
|-------------|----------------|---------------------|
| 0.9.x       | ✅ All         | 23.1 and later      |
| 0.8.x       | ✅ All         | 22.x and later      |
| 0.7.x       | ✅ All         | 21.x and later      |

:::tip
Use `tw --version` to check your installed CLI version.
:::
```

### Versioning Strategy Recommendations

#### For Platform Cloud
- **Single version:** Always document the latest CLI
- **No versioning needed:** Cloud is continuously deployed
- **Update docs on CLI releases:** Use CI/CD to regenerate reference docs

#### For Platform Enterprise
- **Snapshot strategy:** Only version CLI docs when:
  1. New CLI version requires Platform features from that Enterprise version
  2. CLI has breaking changes incompatible with older Platform versions
  3. Major CLI release (e.g., 1.0.0)

- **Default behavior:** Enterprise versions point to Cloud's CLI docs (via symlink or link)
- **Version-specific docs:** Only create separate CLI docs when necessary

#### Documentation Version Indicators

Add version badges to reference pages:

```markdown
---
title: tw actions
description: Manage pipeline actions
cli_version: "0.9.0"
platform_version: "23.1+"
---

:::info CLI Version
This command is available in CLI version 0.9.0 and later. Platform Enterprise 23.1+ required.
:::
```

### Version-Specific Content Handling

Use Docusaurus version-specific content:

```markdown
{/* Cloud and Enterprise 24.1+ */}
import VersionedContent from '@site/src/components/VersionedContent';

<VersionedContent version="24.1+">

The `--new-flag` option is available in Platform Enterprise 24.1 and later.

</VersionedContent>
```

---

## 4. CI/CD Automation Strategy

### Goals

1. **Automatic updates:** Regenerate CLI reference docs on new CLI releases
2. **Quality assurance:** Validate generated docs before publishing
3. **Consistency:** Ensure docs match CLI code
4. **Minimal manual effort:** Automate the entire pipeline

### Architecture Overview

```
tower-cli Release
    ↓
GitHub Actions Trigger
    ↓
1. Extract metadata (extract-cli-metadata.py)
2. Enrich descriptions (source Java files already have enriched descriptions)
3. Generate reference docs (generate-cli-docs.py)
4. Inject examples (sanitize-and-inject.py)
5. Create PR to docs repo
    ↓
Human Review
    ↓
Merge to docs repo
    ↓
Deploy to docs.seqera.io
```

### Implementation Components

#### Component 1: GitHub Actions Workflow in tower-cli Repo

**Location:** `.github/workflows/update-docs.yml` in tower-cli repo

**Trigger:** On release published

```yaml
name: Update CLI Documentation

on:
  release:
    types: [published]

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout tower-cli
        uses: actions/checkout@v4
        with:
          path: tower-cli

      - name: Checkout docs repo
        uses: actions/checkout@v4
        with:
          repository: seqeralabs/docs
          token: ${{ secrets.DOCS_REPO_TOKEN }}
          path: docs

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Extract CLI metadata
        run: |
          cd docs/platform-cloud/docs/cli/scripts
          python extract-cli-metadata.py \
            ../../../../tower-cli/src/main/java \
            > ../metadata/cli-metadata.json

      - name: Generate reference docs
        run: |
          cd docs/platform-cloud/docs/cli/scripts
          python generate-cli-docs.py \
            ../metadata/cli-metadata.json \
            ../reference/

      - name: Sanitize and inject examples
        run: |
          cd docs/platform-cloud/docs/cli/scripts
          python sanitize-and-inject.py \
            ../reference/ \
            ../overlays/

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.DOCS_REPO_TOKEN }}
          path: docs
          branch: cli-docs-${{ github.event.release.tag_name }}
          title: "Update CLI docs for ${{ github.event.release.tag_name }}"
          body: |
            Automated CLI documentation update for release ${{ github.event.release.tag_name }}

            ## Changes
            - Updated CLI metadata from tower-cli@${{ github.event.release.tag_name }}
            - Regenerated all reference documentation
            - Applied example overlays

            ## Verification Checklist
            - [ ] All reference pages render correctly
            - [ ] Examples are sanitized (no real IDs/credentials)
            - [ ] Links to Platform docs are valid
            - [ ] New commands (if any) are documented

            ## Release Notes
            ${{ github.event.release.body }}
          labels: |
            documentation
            automated-pr
            cli
```

#### Component 2: Validation Script

**Location:** `docs/platform-cloud/docs/cli/scripts/validate-docs.py`

**Purpose:** Run quality checks before PR creation

**Checks:**
1. All reference files are valid Markdown
2. All internal links resolve
3. All command examples are sanitized
4. No placeholder text (TODO, FIXME)
5. Required frontmatter fields present
6. Example outputs follow format

```python
#!/usr/bin/env python3
"""
Validate generated CLI reference documentation
"""

import sys
import json
from pathlib import Path
import re

def validate_markdown(file_path):
    """Validate markdown file structure and content"""
    with open(file_path) as f:
        content = f.read()

    errors = []

    # Check frontmatter
    if not content.startswith('---\n'):
        errors.append("Missing frontmatter")

    # Check for placeholders
    placeholders = ['TODO', 'FIXME', 'XXX', 'PLACEHOLDER']
    for placeholder in placeholders:
        if placeholder in content:
            errors.append(f"Contains placeholder: {placeholder}")

    # Check for unsanitized data
    email_pattern = r'\b[A-Za-z0-9._%+-]+@seqera\.io\b'
    if re.search(email_pattern, content):
        errors.append("Contains unsanitized email address")

    # Check for proper example formatting
    if '# Output:' in content:
        # Verify output is indented or in code block
        pass

    return errors

def validate_all_docs(reference_dir):
    """Validate all reference documentation files"""
    reference_path = Path(reference_dir)
    all_errors = {}

    for md_file in reference_path.glob('*.md'):
        if md_file.name == '.gitkeep':
            continue

        errors = validate_markdown(md_file)
        if errors:
            all_errors[md_file.name] = errors

    return all_errors

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: validate-docs.py <reference_dir>")
        sys.exit(1)

    reference_dir = sys.argv[1]
    errors = validate_all_docs(reference_dir)

    if errors:
        print("❌ Validation failed:")
        for file, file_errors in errors.items():
            print(f"\n{file}:")
            for error in file_errors:
                print(f"  - {error}")
        sys.exit(1)
    else:
        print("✅ All documentation valid")
        sys.exit(0)
```

#### Component 3: Update GitHub Workflow

Add validation step:

```yaml
      - name: Validate generated docs
        run: |
          cd docs/platform-cloud/docs/cli/scripts
          python validate-docs.py ../reference/
```

#### Component 4: Notification Strategy

**On success:**
- Create PR with automated changeset
- Notify #docs-team Slack channel
- Assign reviewer automatically

**On failure:**
- Post error details to GitHub Actions log
- Notify #eng-team Slack channel
- Don't create PR

### Manual Override Process

For cases where automation fails or manual intervention needed:

**Manual regeneration:**
```bash
cd platform-cloud/docs/cli/scripts

# 1. Extract metadata
python extract-cli-metadata.py \
  /path/to/tower-cli/src/main/java \
  > ../metadata/cli-metadata.json

# 2. Generate reference docs
python generate-cli-docs.py \
  ../metadata/cli-metadata.json \
  ../reference/

# 3. Sanitize and inject examples
python sanitize-and-inject.py \
  ../reference/ \
  ../overlays/

# 4. Validate
python validate-docs.py ../reference/

# 5. Review changes
git status
git diff

# 6. Commit and push
git checkout -b cli-docs-update-manual
git add ../reference/
git commit -m "Update CLI reference docs"
git push origin cli-docs-update-manual
```

### Maintenance Documentation

Create `cli/scripts/README.md` documenting:
- How automation works
- How to manually regenerate docs
- How to add new examples to overlays
- How to enrich descriptions in Java source
- Troubleshooting common issues

---

## Implementation Roadmap

### Phase 1: Sidebar Integration (This Session)
**Time estimate:** 30 minutes

1. ✅ Analyze current structure
2. Update `platform-cloud/cloud-sidebar.json`
3. Update `platform-enterprise_docs/enterprise-sidebar.json`
4. Test navigation locally
5. Verify all links work
6. Create PR

### Phase 2: Single Docset Strategy (This Session)
**Time estimate:** 1 hour

1. Document versioning strategy in `cli/overview.md`
2. Create `cli/versioning.md` page
3. Convert Enterprise CLI to symlink (or document linking strategy)
4. Test Enterprise build with new structure
5. Update both sidebars if needed
6. Create PR

### Phase 3: CI/CD Automation (Next Session)
**Time estimate:** 2-3 hours

1. Create validation script
2. Test validation locally
3. Create GitHub Actions workflow
4. Set up secrets/tokens
5. Test workflow on test release
6. Document manual override process
7. Create PR to tower-cli repo

### Phase 4: Documentation & Handoff
**Time estimate:** 1 hour

1. Update `README-automation.md`
2. Create `scripts/README.md`
3. Document maintenance procedures
4. Create runbook for common issues
5. Record demo video (optional)

---

## Success Metrics

### Sidebar Integration
- ✅ All 16 reference pages accessible via navigation
- ✅ Navigation is intuitive and discoverable
- ✅ Links work in both Cloud and Enterprise docs

### Single Docset
- ✅ No duplicate CLI docs in Enterprise current
- ✅ Versioned docs only include CLI when necessary
- ✅ Version compatibility clearly documented

### CI/CD Automation
- ✅ Docs update automatically on CLI release
- ✅ Validation catches quality issues
- ✅ Manual intervention rarely needed
- ✅ PR review takes < 15 minutes

### Overall
- ✅ CLI docs maintainability improved 10x
- ✅ Time to update docs reduced from days to hours
- ✅ Documentation quality consistent
- ✅ No more outdated CLI docs

---

## Questions for Discussion

1. **Sidebar structure:** Simple two-tier or categorized reference?
2. **Enterprise strategy:** Symlink or documented linking?
3. **Versioning:** When to snapshot CLI docs for Enterprise versions?
4. **CI/CD priority:** Full automation now or manual process documented?
5. **Example maintenance:** Who owns overlay files when new commands added?

---

## Next Steps

Ready to proceed with:
1. **Sidebar integration** - Update both sidebar.json files
2. **Versioning docs** - Add version compatibility info
3. **Strategy documentation** - Document the single docset approach

Let's start with sidebar integration! 🚀
