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
├── overlays/                    # Manual content (examples, guides)
│   ├── tw-pipelines.md                     # Main command overlays
│   ├── tw-pipelines-launch-examples.md     # Subcommand overlays
│   ├── tw-compute-envs.md
│   └── ...
│
├── reference/                   # Auto-generated command reference (one file per main command)
│   ├── compute-envs.md          # All compute-envs subcommands in one file
│   ├── pipelines.md             # All pipelines subcommands in one file
│   ├── credentials.md
│   └── ...
│
├── scripts/
│   ├── generate-cli-docs.py     # Generates markdown from metadata
│   └── compare-metadata.py      # Compares metadata versions
│
└── metadata/
    ├── cli-metadata-v0.9.2.json # Versioned metadata snapshots
    ├── cli-metadata-v0.9.3.json
    └── cli-metadata-latest.json # Symlink to current version
```

## How It Works

### 1. Trigger

Two trigger mechanisms are available:

**Primary: Repository Dispatch**
- When a new release is published in the `seqeralabs/tower-cli` repository
- The tower-cli repo sends a `repository_dispatch` event to the docs repo
- Workflow: `.github/workflows/update-cli-docs.yml`

**Backup: Scheduled Check**
- Daily check at 10 AM UTC for new CLI releases
- Automatically triggers update if new version detected
- Workflow: `.github/workflows/check-cli-updates.yml`

### 2. Metadata Extraction

```bash
python tower-cli/docs/scripts/extract-cli-metadata.py \
  tower-cli/src/main/java > \
  cli/metadata/cli-metadata-v0.9.3.json
```

The extraction script (located in tower-cli repo) analyzes the picocli annotations in the Java source code to produce a structured JSON file containing:
- Command names and hierarchies
- Option names, descriptions, defaults, and requirements
- Command families and categorization

### 3. Version Comparison

```bash
python cli/scripts/compare-metadata.py \
  cli/metadata/cli-metadata-latest.json \
  cli/metadata/cli-metadata-v0.9.3.json
```

Generates a markdown report showing:
- New commands
- Removed commands
- Modified options (added, removed, or changed)
- Summary statistics

This report is included in the PR description for reviewer visibility.

### 4. Documentation Generation

```bash
python cli/scripts/generate-cli-docs.py \
  --metadata cli/metadata/cli-metadata-v0.9.3.json \
  --overlays cli/overlays \
  --output cli/reference
```

For each main command in the metadata:
1. Generates a single markdown page containing all subcommands as sections
2. Looks for main command overlays (e.g., `tw-pipelines.md`) to add after the intro
3. Looks for subcommand-specific overlays (e.g., `tw-pipelines-launch-examples.md`) to add to specific sections
4. Writes to `cli/reference/{command}.md` (e.g., `cli/reference/pipelines.md`)

### 5. Pull Request Creation

The workflow automatically:
- Creates a new branch: `cli-docs-v0.9.3`
- Commits the generated documentation
- Opens a PR with the comparison report in the description
- Adds labels: `documentation`, `cli`, `auto-generated`

## Manual Testing

You can manually trigger the workflow:

```bash
# Using GitHub CLI
gh workflow run update-cli-docs.yml -f cli_version=0.9.3

# Or via GitHub UI
# Actions → Update CLI Documentation → Run workflow
```

## Adding Manual Content (Overlays)

There are two types of overlays:

### Main Command Overlays
Add content that applies to the entire command (appears after the intro, before subcommands):

1. Create a markdown file: `tw-{command}.md`
   - Example: `tw-pipelines.md`
2. Add overview, common workflows, or general guidance
3. Content appears at the top of the main command page

### Subcommand Overlays
Add content specific to individual subcommands:

1. Create a markdown file: `tw-{command}-{subcommand}-examples.md`
   - Example: `tw-pipelines-launch-examples.md`
2. Add examples, tips, or specific guidance for that subcommand
3. Content appears within that subcommand's section

**Overlay naming conventions:**
- Use hyphens to separate command parts
- Include `-examples`, `-guide`, or similar suffix for subcommand overlays
- Main command overlays have no suffix (e.g., `tw-compute-envs.md`)
- Subcommand overlays must match the full command path (e.g., `tw-compute-envs-add-examples.md`)

## Script Usage

### generate-cli-docs.py

```bash
python scripts/generate-cli-docs.py \
  --metadata metadata/cli-metadata-v0.9.3.json \
  --overlays overlays \
  --output reference
```

**Arguments:**
- `--metadata`: Path to CLI metadata JSON file (required)
- `--overlays`: Directory containing manual overlay files (required)
- `--output`: Output directory for generated docs (required)

### compare-metadata.py

```bash
python scripts/compare-metadata.py \
  metadata/cli-metadata-v0.9.2.json \
  metadata/cli-metadata-v0.9.3.json
```

**Arguments:**
- First argument: Old metadata file
- Second argument: New metadata file

Outputs a markdown report to stdout.

## Maintenance

### Updating Generator Templates

The page template is defined in `generate-cli-docs.py` in the `generate_command_page()` function. To modify the structure of generated pages:

1. Edit the template string
2. Test locally with an existing metadata file
3. Review generated output before committing changes

### Troubleshooting

**Workflow fails during metadata extraction:**
- Ensure the tower-cli repository structure hasn't changed
- Verify the extraction script path: `tower-cli/docs/scripts/extract-cli-metadata.py`

**Generated docs are missing information:**
- Check the metadata JSON file for completeness
- Verify that picocli annotations in tower-cli are properly enriched

**Overlays not appearing:**
- Verify file naming matches the command path exactly
- Check that overlay files are in the `overlays/` directory

## Future Enhancements

- [ ] Support for multiple CLI versions in docs (versioned documentation)
- [ ] Automated tests for generated markdown quality
- [ ] Integration with docs build system
- [ ] Enhanced overlay merge strategies (section-specific insertion)
- [ ] Validation of generated markdown against style guide

## Related Documentation

- Tower CLI repository: https://github.com/seqeralabs/tower-cli
- OpenAPI overlay workflow: `.github/workflows/update-api-docs.yml` (similar pattern)
- Metadata extraction: `tower-cli/docs/scripts/extract-cli-metadata.py`
