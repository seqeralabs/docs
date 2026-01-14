Let's design the docs repo automation side. This follows a similar pattern to the OpenAPI overlay workflow you already have.

  Current State Analysis

  tower-cli repo (source of truth):
  - ✅ cli-metadata.json - Extracted metadata with enriched descriptions
  - ✅ extract-cli-metadata.py - Extraction script
  - ✅ Enriched option descriptions in Java source

  docs repo (currently):
  - Manual CLI documentation at docs.seqera.io/platform/latest/cli/
  - Likely monolithic pages or limited command coverage
  - Manual examples mixed with reference content

  Proposed Docs Repo Workflow

  Architecture: Overlay Pattern (Like API Docs)

  docs-repo/
  ├── cli/
  │   ├── overlays/                           # Manual content (examples, guides)
  │   │   ├── pipelines-launch-examples.md
  │   │   ├── compute-envs-aws-guide.md
  │   │   └── runs-monitoring-examples.md
  │   │
  │   ├── reference/                          # Auto-generated from metadata
  │   │   ├── compute-envs/
  │   │   │   ├── add.md
  │   │   │   ├── list.md
  │   │   │   └── delete.md
  │   │   ├── pipelines/
  │   │   ├── runs/
  │   │   └── ...
  │   │
  │   ├── scripts/
  │   │   ├── generate-cli-docs.py           # Generator script
  │   │   ├── compare-metadata.py            # Version comparison
  │   │   └── merge-overlays.py              # Merge manual + generated
  │   │
  │   └── metadata/
  │       ├── cli-metadata-v0.9.2.json       # Versioned metadata snapshots
  │       ├── cli-metadata-v0.9.3.json
  │       └── cli-metadata-latest.json       # Symlink to current

  Trigger Workflow

  Option 1: GitHub Action on tower-cli Release (Recommended)

  # .github/workflows/update-cli-docs.yml (in docs repo)

  name: Update CLI Documentation

  on:
    repository_dispatch:
      types: [cli-release]
    workflow_dispatch:
      inputs:
        cli_version:
          description: 'CLI version to document (e.g., 0.9.3)'
          required: true

  jobs:
    update-cli-docs:
      runs-on: ubuntu-latest
      steps:
        - name: Checkout docs repo
          uses: actions/checkout@v4

        - name: Checkout tower-cli at release tag
          uses: actions/checkout@v4
          with:
            repository: seqeralabs/tower-cli
            ref: v${{ github.event.client_payload.version || github.event.inputs.cli_version }}
            path: tower-cli

        - name: Extract CLI metadata
          run: |
            python tower-cli/docs/scripts/extract-cli-metadata.py \
              tower-cli/src/main/java > \
              cli/metadata/cli-metadata-v${{ github.event.client_payload.version }}.json

        - name: Compare with previous version
          id: compare
          run: |
            python cli/scripts/compare-metadata.py \
              cli/metadata/cli-metadata-latest.json \
              cli/metadata/cli-metadata-v${{ github.event.client_payload.version }}.json \
              > comparison-report.md

        - name: Generate documentation
          run: |
            python cli/scripts/generate-cli-docs.py \
              --metadata cli/metadata/cli-metadata-v${{ github.event.client_payload.version }}.json \
              --overlays cli/overlays \
              --output cli/reference

        - name: Create PR
          uses: peter-evans/create-pull-request@v5
          with:
            token: ${{ secrets.GITHUB_TOKEN }}
            commit-message: |
              Update CLI documentation for v${{ github.event.client_payload.version }}

              Auto-generated from tower-cli metadata extraction.

              Changes detected:
              $(cat comparison-report.md)
            branch: cli-docs-v${{ github.event.client_payload.version }}
            title: "CLI Docs: Update for v${{ github.event.client_payload.version }}"
            body-path: comparison-report.md
            labels: |
              documentation
              cli
              auto-generated

  Trigger from tower-cli repo:

  # .github/workflows/publish-release.yml (in tower-cli repo)

  name: Publish Release

  on:
    release:
      types: [published]

  jobs:
    notify-docs-repo:
      runs-on: ubuntu-latest
      steps:
        - name: Trigger docs update
          uses: peter-evans/repository-dispatch@v2
          with:
            token: ${{ secrets.DOCS_REPO_PAT }}
            repository: seqeralabs/docs
            event-type: cli-release
            client-payload: |
              {
                "version": "${{ github.event.release.tag_name }}",
                "release_url": "${{ github.event.release.html_url }}"
              }

  Option 2: Scheduled Check (Backup)

  # .github/workflows/check-cli-updates.yml (in docs repo)

  name: Check for CLI Updates

  on:
    schedule:
      - cron: '0 10 * * *'  # Daily at 10 AM
    workflow_dispatch:

  jobs:
    check-updates:
      runs-on: ubuntu-latest
      steps:
        - name: Get latest tower-cli release
          id: cli-release
          run: |
            LATEST=$(curl -s https://api.github.com/repos/seqeralabs/tower-cli/releases/latest | jq -r .tag_name)
            echo "version=$LATEST" >> $GITHUB_OUTPUT

        - name: Check if already documented
          id: check
          run: |
            if [ -f "cli/metadata/cli-metadata-v${{ steps.cli-release.outputs.version }}.json" ]; then
              echo "exists=true" >> $GITHUB_OUTPUT
            else
              echo "exists=false" >> $GITHUB_OUTPUT
            fi

        - name: Trigger update workflow
          if: steps.check.outputs.exists == 'false'
          uses: peter-evans/repository-dispatch@v2
          with:
            event-type: cli-release
            client-payload: |
              {
                "version": "${{ steps.cli-release.outputs.version }}"
              }

  Documentation Generator Script

  # cli/scripts/generate-cli-docs.py

  """
  Generate CLI reference documentation from metadata JSON.

  Similar to OpenAPI overlay pattern:
  1. Parse cli-metadata.json
  2. Generate base markdown from metadata
  3. Merge with manual overlays
  4. Output final documentation
  """

  import json
  from pathlib import Path
  import argparse

  def generate_command_page(command_data, overlays_dir):
      """Generate markdown page for a single command."""

      name = command_data['name']
      full_path = command_data.get('fullPath', name)
      description = command_data.get('description', '')

      # Base template
      md = f"""---
  title: tw {full_path}
  description: {description}
  ---

  # `tw {full_path}`

  {description}

  ## Synopsis

  ```bash
  tw {full_path} [OPTIONS]

  """

  # Add options table
  if command_data.get('options'):
      md += "\n## Options\n\n"
      md += "| Option | Description | Required | Default |\n"
      md += "|--------|-------------|----------|----------|\n"

      for opt in command_data['options']:
          names = ', '.join([f"`{n}`" for n in opt['names']])
          desc = opt.get('description', '').replace('|', '\\|')
          required = '✓' if opt.get('required') else ''
          default = f"`{opt['defaultValue']}`" if opt.get('defaultValue') else ''
          md += f"| {names} | {desc} | {required} | {default} |\n"

  # Merge with overlay if exists
  overlay_file = overlays_dir / f"{full_path.replace(' ', '-')}-examples.md"
  if overlay_file.exists():
      md += "\n" + overlay_file.read_text()

  return md
  def generate_all_docs(metadata_path, overlays_dir, output_dir):
      """Generate documentation for all commands."""

  with open(metadata_path) as f:
      metadata = json.load(f)

  output_dir = Path(output_dir)
  output_dir.mkdir(parents=True, exist_ok=True)

  # Recursive function to process command tree
  def process_command(cmd, parent_path=''):
      full_path = f"{parent_path} {cmd['name']}".strip()
      cmd['fullPath'] = full_path

      # Generate page for this command
      family = cmd.get('family', 'misc')
      family_dir = output_dir / family
      family_dir.mkdir(exist_ok=True)

      page_name = full_path.replace(' ', '-').replace('tw-', '')
      page_path = family_dir / f"{page_name}.md"

      content = generate_command_page(cmd, overlays_dir)
      page_path.write_text(content)

      print(f"Generated: {page_path}")

      # Process subcommands
      for subcmd in cmd.get('subcommands', []):
          process_command(subcmd, full_path)

  # Start with root
  root = metadata.get('tw', {})
  for subcmd in root.get('subcommands', []):
      process_command(subcmd, 'tw')

  print(f"\n✓ Generated documentation in {output_dir}")
  if name == 'main':
      parser = argparse.ArgumentParser(description='Generate CLI docs from metadata')
      parser.add_argument('--metadata', required=True, help='Path to cli-metadata.json')
      parser.add_argument('--overlays', required=True, help='Directory with manual overlays')
      parser.add_argument('--output', required=True, help='Output directory')

  args = parser.parse_args()

  generate_all_docs(
      Path(args.metadata),
      Path(args.overlays),
      Path(args.output)
  )

  ### Comparison Script

  ```python
  # cli/scripts/compare-metadata.py

  """
  Compare two CLI metadata versions to identify changes.
  Outputs markdown report for PR description.
  """

  import json
  import sys
  from pathlib import Path
  from difflib import unified_diff

  def compare_metadata(old_path, new_path):
      """Compare two metadata files and generate report."""

      with open(old_path) as f:
          old = json.load(f)
      with open(new_path) as f:
          new = json.load(f)

      report = []
      report.append("## CLI Documentation Changes\n")

      # Count changes
      def count_commands(data, path='tw'):
          count = 1
          for subcmd in data.get('subcommands', []):
              count += count_commands(subcmd, f"{path} {subcmd['name']}")
          return count

      old_count = count_commands(old.get('tw', {}))
      new_count = count_commands(new.get('tw', {}))

      report.append(f"**Commands:** {old_count} → {new_count} ({new_count - old_count:+d})\n")

      # Find new commands
      def get_all_commands(data, path='tw'):
          commands = {path: data}
          for subcmd in data.get('subcommands', []):
              commands.update(get_all_commands(subcmd, f"{path} {subcmd['name']}"))
          return commands

      old_cmds = get_all_commands(old.get('tw', {}))
      new_cmds = get_all_commands(new.get('tw', {}))

      new_command_paths = set(new_cmds.keys()) - set(old_cmds.keys())
      removed_command_paths = set(old_cmds.keys()) - set(new_cmds.keys())

      if new_command_paths:
          report.append("\n### New Commands\n")
          for cmd_path in sorted(new_command_paths):
              report.append(f"- `{cmd_path}`\n")

      if removed_command_paths:
          report.append("\n### Removed Commands\n")
          for cmd_path in sorted(removed_command_paths):
              report.append(f"- `{cmd_path}`\n")

      # Find changed options
      report.append("\n### Changed Options\n")
      for cmd_path in sorted(set(old_cmds.keys()) & set(new_cmds.keys())):
          old_cmd = old_cmds[cmd_path]
          new_cmd = new_cmds[cmd_path]

          old_opts = {tuple(opt['names']): opt for opt in old_cmd.get('options', [])}
          new_opts = {tuple(opt['names']): opt for opt in new_cmd.get('options', [])}

          added_opts = set(new_opts.keys()) - set(old_opts.keys())
          removed_opts = set(old_opts.keys()) - set(new_opts.keys())
          changed_opts = []

          for opt_names in set(old_opts.keys()) & set(new_opts.keys()):
              if old_opts[opt_names] != new_opts[opt_names]:
                  changed_opts.append(opt_names)

          if added_opts or removed_opts or changed_opts:
              report.append(f"\n**`{cmd_path}`**:\n")
              if added_opts:
                  for names in added_opts:
                      report.append(f"  - ➕ Added: `{', '.join(names)}`\n")
              if removed_opts:
                  for names in removed_opts:
                      report.append(f"  - ➖ Removed: `{', '.join(names)}`\n")
              if changed_opts:
                  for names in changed_opts:
                      old_desc = old_opts[names].get('description', '')[:50]
                      new_desc = new_opts[names].get('description', '')[:50]
                      report.append(f"  - 📝 Updated: `{', '.join(names)}` (description changed)\n")

      return ''.join(report)

  if __name__ == '__main__':
      if len(sys.argv) != 3:
          print("Usage: compare-metadata.py <old-metadata.json> <new-metadata.json>")
          sys.exit(1)

      report = compare_metadata(sys.argv[1], sys.argv[2])
      print(report)

  Implementation Plan

  Phase 1: Setup Docs Repo Structure

  1. Create cli/overlays/ directory for manual examples
  2. Create cli/metadata/ for versioned metadata snapshots
  3. Add cli/scripts/ with generator and comparison scripts
  4. Set up initial cli/reference/ structure

  Phase 2: Manual Content Migration

  1. Extract existing manual examples from current CLI docs
  2. Convert to overlay markdown files
  3. Organize by command family

  Phase 3: Automation Setup

  1. Add GitHub Actions workflows to docs repo
  2. Configure repository dispatch from tower-cli
  3. Test with manual trigger first
  4. Enable automatic triggers on CLI releases

  Phase 4: Testing & Refinement

  1. Run generator on current CLI version
  2. Compare output with existing docs
  3. Iterate on templates and formatting
  4. Verify overlay merging works correctly

  Questions to Consider

  1. Docs repo structure: What's the current structure at docs.seqera.io for CLI docs?
  2. Deployment: How are docs deployed? (Docusaurus, MkDocs, custom?)
  3. Review process: Who reviews auto-generated PR updates?
  4. Versioning: Should docs support multiple CLI versions simultaneously?
  5. Examples: Where do existing CLI examples live? Can they be extracted?
