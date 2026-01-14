# CLI Overlays

This directory contains manual content that gets merged with auto-generated CLI reference documentation.

## Purpose

Overlays provide:
- **Examples**: Real-world usage examples for commands
- **Guides**: Step-by-step instructions for common workflows
- **Context**: Additional explanations beyond the generated reference

## Naming Convention

There are two types of overlay files:

### Main Command Overlays

Content that applies to the entire main command (added after intro, before subcommands):

```
tw-{command}.md
```

**Examples:**
- `tw-pipelines.md` → Merged at the top of the pipelines page
- `tw-compute-envs.md` → Merged at the top of the compute-envs page
- `tw-credentials.md` → Merged at the top of the credentials page

### Subcommand Overlays

Content specific to individual subcommands (added to that subcommand's section):

```
tw-{command}-{subcommand}-{type}.md
```

**Examples:**
- `tw-pipelines-launch-examples.md` → Merged into `tw pipelines launch` section
- `tw-compute-envs-add-guide.md` → Merged into `tw compute-envs add` section
- `tw-runs-view-examples.md` → Merged into `tw runs view` section

**Type suffixes for subcommand overlays:**
- `-examples.md`: Usage examples
- `-guide.md`: Step-by-step guides
- `-notes.md`: Additional notes or caveats

## Content Structure

### Main Command Overlay Example

For `tw-pipelines.md` (main command level):

```markdown
## Overview

The pipelines commands allow you to manage and execute Nextflow pipelines in Seqera Platform.

## Common Workflows

### Basic Pipeline Execution Flow

1. Add a pipeline: `tw pipelines add`
2. Launch the pipeline: `tw pipelines launch`
3. Monitor execution: `tw runs view`

## Best Practices

- Always test pipelines in a development workspace first
- Use compute environment labels to organize resources
- Tag pipeline runs for better tracking
```

### Subcommand Overlay Example

For `tw-pipelines-launch-examples.md` (subcommand level):

```markdown
### Examples

#### Launch a pipeline with default parameters

\`\`\`bash
tw pipelines launch --id 1234567890
\`\`\`

#### Launch with custom parameters

\`\`\`bash
tw pipelines launch \
  --id 1234567890 \
  --params-file params.json \
  --compute-env my-aws-batch-env
\`\`\`

### Tips

- Always specify the workspace explicitly when working with multiple workspaces
- Use `--wait` flag to monitor pipeline completion in CI/CD environments
```

## Best Practices

1. **Keep it focused**: Each overlay should enhance one command
2. **Use real examples**: Show actual command syntax that works
3. **Explain why**: Don't just show what to do, explain when and why
4. **Link related commands**: Reference other commands when relevant
5. **Update regularly**: Keep examples current with CLI changes

## Testing Overlays

After creating an overlay, test the merge locally:

```bash
python scripts/generate-cli-docs.py \
  --metadata metadata/cli-metadata-latest.json \
  --overlays overlays \
  --output /tmp/test-output

# Review the merged output
cat /tmp/test-output/{family}/{command}.md
```

## Sample Overlays

See the following templates:
- `tw-pipelines.md` - Main command overlay template
- `tw-pipelines-launch-examples.md` - Subcommand overlay template
