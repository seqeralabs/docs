# CLI Documentation Maintenance Guide

This guide explains how to maintain and update the CLI reference documentation.

## Documentation Strategy

### Single Source of Truth

**Primary location:** `platform-cloud/docs/cli/`

The CLI documentation follows a **single docset strategy**:
- Platform Cloud uses `docs/cli/` as the primary source
- Platform Enterprise current copies CLI docs from Cloud during builds
- Versioned Enterprise docs include CLI snapshots only when necessary

**Why this approach?**
- CLI versioning (0.9.x) is independent from Platform versioning (23.1, 24.1, etc.)
- CLI is backward compatible across multiple Platform versions
- Reduces maintenance burden and prevents docs from getting out of sync

### Documentation Structure

```
cli/
├── overview.md              # CLI introduction
├── installation.md          # Installation instructions
├── commands-reference.md    # Command reference landing page (replaces commands.md)
├── reference/               # Individual command reference pages
│   ├── actions.md
│   ├── compute-envs.md
│   ├── credentials.md
│   ├── datasets.md
│   ├── data-links.md
│   ├── info.md
│   ├── labels.md
│   ├── launch.md
│   ├── members.md
│   ├── organizations.md
│   ├── participants.md
│   ├── pipelines.md
│   ├── runs.md
│   ├── secrets.md
│   ├── studios.md
│   ├── teams.md
│   └── workspaces.md
├── metadata/                # CLI metadata JSON files
│   ├── cli-metadata-v0.9.x.json
│   └── cli-metadata-latest.json (symlink)
├── overlays/                # Manual examples and enhancements
│   ├── tw-actions-list.md
│   ├── tw-compute-envs-add-aws-batch.md
│   └── ...
└── scripts/                 # Automation scripts
    ├── generate-cli-docs.py     # Generates docs from metadata + overlays
    ├── compare-metadata.py      # Compares CLI versions
    ├── MAINTENANCE.md           # This guide
    ├── README.md                # Workflow overview
    ├── final-phase-plan.md      # Architecture decisions
    └── progress.md              # Implementation history
```

## Automated Updates

### GitHub Actions Workflow

The CLI docs are automatically updated when a new CLI version is released.

**Location:** `.github/workflows/update-cli-docs.yml`

**Trigger:** Manual dispatch or repository dispatch from tower-cli releases

**Process:**
1. Extract metadata from tower-cli Java source
2. Generate reference documentation
3. Inject examples from overlays
4. Validate generated docs
5. Copy to enterprise docs
6. Create pull request for review

### Manual Update Process

If you need to manually update the docs:

```bash
cd platform-cloud/docs/cli

# 1. Extract metadata from tower-cli repo
python /path/to/tower-cli/docs/scripts/extract-cli-metadata.py \
  /path/to/tower-cli/src/main/java \
  > metadata/cli-metadata-v0.9.x.json

# 2. Generate reference documentation (includes overlay merging)
python scripts/generate-cli-docs.py \
  --metadata metadata/cli-metadata-v0.9.x.json \
  --overlays overlays \
  --output reference/

# 3. Copy to enterprise docs
cp -r reference/ ../../../platform-enterprise_docs/cli/
cp commands-reference.md ../../../platform-enterprise_docs/cli/

# 4. Review changes
git status
git diff

# 5. Create PR
git checkout -b cli-docs-update-v0.9.x
git add .
git commit -m "Update CLI docs for v0.9.x"
git push origin cli-docs-update-v0.9.x
```

## Adding Examples to Commands

Examples are stored separately in the `overlays/` directory and injected during generation.

### Adding a New Example

1. Create or edit the overlay file for the command:

```bash
# Example: Add example to tw credentials add aws
vi overlays/tw-credentials-add-aws.md
```

2. Add the example in the overlay format:

```markdown
## Example

\`\`\`bash
tw credentials add aws -n my-aws-creds -a AKIAIOSFODNN7EXAMPLE -s wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Output:
  Credentials 'my-aws-creds' added for user-name user
\`\`\`
```

3. Regenerate docs to merge the example:

```bash
python scripts/generate-cli-docs.py \
  --metadata metadata/cli-metadata-latest.json \
  --overlays overlays \
  --output reference/
```

### Example Sanitization

**CRITICAL:** All examples must be sanitized to remove real data:

**Replace:**
- Real workspace IDs → `123456789012345`
- Real emails → `user@example.com`
- Real names → `user-name`, `org-name`, `workspace-name`
- Real AWS keys → `AKIAIOSFODNN7EXAMPLE`
- Real credentials → `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- Real API tokens → Sanitized placeholder tokens
- Real pipeline IDs → Sanitized IDs

**Sanitize manually in overlay files before adding them.** The generation script merges overlays as-is.

## Updating Command Descriptions

Command descriptions come from the Java source files in tower-cli.

### Where to Update

**DO NOT** edit descriptions in the generated reference docs directly. They will be overwritten.

**DO** update descriptions in the tower-cli Java source:

```java
@Command(
    name = "add",
    description = "Add AWS Batch compute environment"  // Update here
)
public class AddCmd extends BaseAddCmd {
    // ...
}
```

### Description Quality Standards

Follow the [CLI Docs Style Guide](research/cli-docs-style-guide.md):

1. **Commands:** Imperative verb + object (e.g., "Add AWS Batch compute environment")
2. **Options:** Present tense, descriptive (e.g., "Workspace numeric identifier")
3. **Capitalization:** Sentence case for all descriptions
4. **Punctuation:** Period for complete sentences, omit for fragments
5. **Platform terms:** Use correct capitalization (Studio, Platform, workspace, compute environment)

### Enrichment Process

See [Description Standards](../../research/cli-docs-style-guide.md) for detailed guidelines on improving descriptions.

## CLI Versioning Strategy

### Version Compatibility

The CLI is designed to be backward compatible across Platform versions:

| CLI Version | Platform Cloud | Platform Enterprise |
|-------------|----------------|---------------------|
| 0.9.x       | ✅ All         | 23.1 and later      |
| 0.8.x       | ✅ All         | 22.x and later      |

### When to Version CLI Docs

Only snapshot CLI docs for Enterprise versions when:

1. New CLI version requires Platform features from that Enterprise version
2. CLI has breaking changes incompatible with older Platform versions
3. Major CLI release (e.g., 1.0.0)

**Default:** Enterprise versions reference Cloud's CLI docs (copied during build)

### Version Indicators

Add version information to command descriptions when relevant:

```markdown
:::info CLI Version
This command is available in CLI version 0.9.0 and later. Platform Enterprise 23.1+ required.
:::
```

## Sidebar Management

### Sidebar Structure

Both Cloud and Enterprise sidebars use the same CLI structure:

```json
{
  "type": "category",
  "label": "CLI",
  "collapsed": true,
  "items": [
    "cli/overview",
    "cli/installation",
    {
      "type": "category",
      "label": "Command Reference",
      "link": {"type": "doc", "id": "cli/commands-reference"},
      "collapsed": true,
      "items": [
        "cli/reference/info",
        "cli/reference/credentials",
        "cli/reference/compute-envs",
        // ... all reference pages
      ]
    }
  ]
}
```

**Command Reference:** Acts as both a landing page and a category dropdown.

**Order:** Commands are listed in the order they appear in the original commands.md guide.

### Updating Sidebar

When adding a new command:

1. Generate the new reference page
2. Add the page to both sidebars:
   - `platform-cloud/cloud-sidebar.json`
   - `platform-enterprise_docs/enterprise-sidebar.json`
3. Update the `commands-reference.md` landing page

## Troubleshooting

### Docs not updating?

Check:
1. Is the GitHub Actions workflow enabled?
2. Did the workflow run successfully? Check Actions tab
3. Are the Python scripts executable?
4. Is the metadata file generated correctly?

### Links broken?

- Check that all reference pages exist in `cli/reference/`
- Verify sidebar.json includes all pages
- Check that `commands-reference.md` exists
- Ensure enterprise docs are copied correctly

### Examples not showing?

- Check that overlay files exist in `overlays/`
- Verify overlay file naming matches command path exactly (use hyphens)
- Regenerate docs with the generate script to merge overlays
- Look for ERROR logs in the script output

## Scripts Reference

### extract-cli-metadata.py

**Location:** `tower-cli/docs/scripts/extract-cli-metadata.py` (in tower-cli repo)

Extracts CLI command metadata from Java source files.

**Usage:**
```bash
python tower-cli/docs/scripts/extract-cli-metadata.py <java-source-dir> > output.json
```

**Output:** JSON with full command hierarchy, options, and descriptions

### generate-cli-docs.py

**Location:** `platform-cloud/docs/cli/scripts/generate-cli-docs.py`

Generates Markdown reference docs from metadata JSON and merges with overlay files.

**Usage:**
```bash
python generate-cli-docs.py \
  --metadata <metadata.json> \
  --overlays <overlays-dir> \
  --output <output-dir>
```

**Features:**
- Generates one `.md` file per main command
- Automatically merges overlay content from overlays directory
- Creates proper frontmatter with title and description
- Formats options as tables

**Output:** One `.md` file per command group in the output directory

### compare-metadata.py

**Location:** `platform-cloud/docs/cli/scripts/compare-metadata.py`

Compares two CLI metadata versions and generates a change report.

**Usage:**
```bash
python compare-metadata.py <old-metadata.json> <new-metadata.json>
```

**Output:** Markdown report showing new/removed commands, changed options, and statistics

## Contact & Support

For questions or issues:
- Check the [Progress Tracker](progress.md) for implementation history
- Review the [Final Phase Plan](final-phase-plan.md) for architecture decisions
- See [README.md](README.md) for workflow overview

**Maintainers:** Seqera Documentation Team
