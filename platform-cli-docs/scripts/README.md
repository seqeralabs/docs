# CLI Documentation Automation

This directory contains the automated CLI documentation system for Seqera Platform CLI (tower-cli).

## Overview

The automation follows an **overlay pattern** similar to the OpenAPI documentation workflow:
- **Base documentation** is auto-generated from CLI metadata extracted from the tower-cli repository
- **Manual overlays** (examples, guides) are maintained separately and merged during generation
- **GitHub Actions** automate the update process when new CLI versions are released

## Directory Structure

```
cli/
├── commands-reference.md        # Command reference landing page (replaces commands.md)
│
├── reference/                   # Auto-generated command reference (one file per main command)
│   ├── actions.md
│   ├── compute-envs.md
│   ├── credentials.md
│   ├── datasets.md
│   └── ... (18 command pages)
│
├── overlays/                    # Manual content (examples, guides)
│   ├── tw-actions-list.md
│   ├── tw-compute-envs-add-aws-batch.md
│   ├── tw-credentials-add.md
│   └── ... (80+ overlay files)
│
├── metadata/
│   ├── cli-metadata-v0.9.2.json # Versioned metadata snapshots
│   ├── cli-metadata-v0.9.3.json
│   └── cli-metadata-latest.json # Symlink to current version
│
└── scripts/
    ├── generate-cli-docs.py     # Generates markdown from metadata + overlays
    ├── compare-metadata.py      # Compares metadata versions
    ├── MAINTENANCE.md           # Detailed maintenance guide
    ├── final-phase-plan.md      # Architecture decisions
    └── progress.md              # Implementation history
```

## Documentation Architecture

### Single Source of Truth

**Primary location:** `platform-cli-docs/`

- Platform CLI docs are now a standalone docset at `/platform-cli`
- Platform Cloud and Enterprise docs link to CLI docs externally
- CLI versioning (0.9.x) is independent from Platform versioning

See [MAINTENANCE.md](MAINTENANCE.md) for details on the single docset strategy.

### Sidebar Integration

The CLI docs are organized in a two-tier structure:

```
CLI
├── Overview
├── Installation
└── Command Reference (landing page + dropdown)
    ├── Info
    ├── Credentials
    ├── Compute-envs
    └── ... (all 18 command pages)
```

The `commands-reference.md` page acts as both:
- A landing page with command categories and quick reference
- The redirect target for legacy `/cli/commands` URLs

## How It Works

### 1. Trigger

The workflow can be triggered in two ways:

**Manual Dispatch:**
```bash
# Using GitHub CLI
gh workflow run update-cli-docs.yml -f cli_version=0.9.3

# Or via GitHub UI
# Actions → Update CLI Documentation → Run workflow
```

**Repository Dispatch:**
- When a new release is published in `seqeralabs/tower-cli`
- The tower-cli repo sends a `repository_dispatch` event to the docs repo
- Workflow: `.github/workflows/update-cli-docs.yml`

### 2. Metadata Extraction

```bash
cd tower-cli
./gradlew extractCliMetadata
cd ..
cp tower-cli/docs/cli-metadata.json \
  platform-cli-docs/metadata/cli-metadata-v0.9.3.json
```

The extraction is performed by a Java class (`CliMetadataExtractor.java`) in the tower-cli repo that uses reflection to analyze picocli annotations. It produces structured JSON containing:
- Command names and hierarchies
- Option names, descriptions, defaults, and requirements
- Command families and categorization
- Metadata version and extraction timestamp

**Method:** The tower-cli Gradle task `extractCliMetadata` compiles the project and runs the extractor, outputting to `docs/cli-metadata.json`.

**Note:** The extractor lives in the tower-cli repo at `src/main/java/io/seqera/tower/cli/utils/metadata/CliMetadataExtractor.java`.

### 3. Version Comparison (Optional)

```bash
python platform-cli-docs/scripts/compare-metadata.py \
  platform-cli-docs/metadata/cli-metadata-latest.json \
  platform-cli-docs/metadata/cli-metadata-v0.9.3.json
```

Generates a markdown report showing:
- New commands
- Removed commands
- Modified options (added, removed, or changed)
- Summary statistics

This report is included in the PR description for reviewer visibility.

### 4. Documentation Generation

```bash
python platform-cli-docs/scripts/generate-cli-docs.py \
  --metadata platform-cli-docs/metadata/cli-metadata-v0.9.3.json \
  --overlays platform-cli-docs/overlays \
  --output platform-cli-docs/reference
```

For each main command in the metadata:
1. Generates a single markdown page containing all subcommands as sections
2. Merges with overlay content (examples, guides) from the overlays directory
3. Writes to `cli/reference/{command}.md`

**The generation script handles overlay merging automatically** - no separate sanitization step needed.

### 5. Pull Request Creation

The workflow automatically:
- Creates a new branch: `cli-docs-v0.9.3`
- Commits the generated documentation
- Opens a PR with the comparison report
- Adds labels: `documentation`, `cli`, `auto-generated`

## Adding Manual Content (Overlays)

Overlays are markdown files that add examples, guides, or additional context to specific commands.

### Subcommand Overlays

Add examples or guidance for individual subcommands:

**File naming:** `tw-{command}-{subcommand}.md`

Examples:
- `tw-credentials-add-aws.md` - Adds content to the `tw credentials add aws` section
- `tw-compute-envs-add-aws-batch.md` - Adds content to the `tw compute-envs add aws-batch` section
- `tw-pipelines-launch.md` - Adds content to the `tw pipelines launch` section

**Format:**
```markdown
## Example

\`\`\`bash
tw credentials add aws -n my-creds -a AKIAIOSFODNN7EXAMPLE

# Output:
  Credentials 'my-creds' added for user-name user
\`\`\`

:::tip
Additional guidance or tips here
:::
```

### Main Command Overlays

Add overview content for an entire command family:

**File naming:** `tw-{command}.md`

Examples:
- `tw-credentials.md` - Overview content for credentials commands
- `tw-compute-envs.md` - Overview content for compute-envs commands

This content appears after the command description, before the subcommands.

### Example Sanitization

**CRITICAL:** All examples must sanitize real data:
- Replace real workspace IDs → `123456789012345`
- Replace real emails → `user@example.com`
- Replace real names → `user-name`, `org-name`
- Replace real credentials → Sanitized placeholders

See [MAINTENANCE.md](MAINTENANCE.md) for complete sanitization guidelines.

## Script Reference

### generate-cli-docs.py

Generates reference documentation from metadata JSON, merging with manual overlays.

```bash
python generate-cli-docs.py \
  --metadata <metadata.json> \
  --overlays <overlays-dir> \
  --output <output-dir>
```

**Arguments:**
- `--metadata`: Path to CLI metadata JSON file (required)
- `--overlays`: Directory containing manual overlay files (required)
- `--output`: Output directory for generated docs (required)

**Features:**
- Generates one .md file per main command
- Automatically merges overlay content
- Creates proper frontmatter with title and description
- Formats options as tables
- Handles nested subcommands

### compare-metadata.py

Compares two metadata versions and generates a change report.

```bash
python compare-metadata.py <old-metadata.json> <new-metadata.json>
```

**Arguments:**
- First argument: Old metadata file
- Second argument: New metadata file

**Output:** Markdown report to stdout showing:
- New commands added
- Commands removed
- Options changed
- Summary statistics

## Maintenance

See [MAINTENANCE.md](MAINTENANCE.md) for:
- Complete maintenance procedures
- Manual update process
- Troubleshooting guide
- Version compatibility strategy
- Sidebar management
- Description enrichment workflow

## Troubleshooting

### Workflow fails during metadata extraction

- Ensure the tower-cli repository structure hasn't changed
- Verify Java 17+ is available in the workflow environment
- Check that the Gradle task `extractCliMetadata` exists in tower-cli's `build.gradle`
- Verify the output path: `tower-cli/docs/cli-metadata.json`
- Check that the tower-cli release tag exists

### Generated docs are missing information

- Check the metadata JSON file for completeness
- Verify that picocli annotations in tower-cli are properly enriched
- Review the Java source files for command descriptions

### Overlays not appearing

- Verify file naming matches the command path exactly (use hyphens, not spaces)
- Check that overlay files are in the `overlays/` directory
- Test locally by running generate-cli-docs.py manually

### Examples contain unsanitized data

- Review overlay files for real IDs, emails, or credentials
- Update overlays with sanitized placeholders
- Regenerate docs with updated overlays

## Version Compatibility

The CLI is designed to be backward compatible across Platform versions:

| CLI Version | Platform Cloud | Platform Enterprise |
|-------------|----------------|---------------------|
| 0.9.x       | ✅ All         | 23.1 and later      |
| 0.8.x       | ✅ All         | 22.x and later      |

CLI docs are only versioned when:
- Breaking changes occur
- New CLI version requires specific Platform version features
- Major CLI release (e.g., 1.0.0)

## Related Documentation

- **MAINTENANCE.md** - Comprehensive maintenance guide
- **final-phase-plan.md** - Architecture decisions and strategies
- **progress.md** - Implementation history and phase documentation
- Tower CLI repository: https://github.com/seqeralabs/tower-cli
- Metadata extractor: `tower-cli/src/main/java/io/seqera/tower/cli/utils/metadata/CliMetadataExtractor.java`
- Gradle task: `./gradlew extractCliMetadata` (in tower-cli repo)
