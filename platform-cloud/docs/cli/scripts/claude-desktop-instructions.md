# Instructions for Claude Desktop with Seqera MCP

## Task Overview

I need to generate 45 CLI command examples for Seqera Platform documentation. The commands are in `command-templates.md` with placeholders like `<WORKSPACE_ID>`, `<PIPELINE_ID>`, etc.

## What I Need You To Do

Using your Seqera MCP connector:

1. **Pick a consistent workspace** - Choose one workspace to use for all examples
2. **Retrieve resource IDs** - Get actual IDs for:
   - Workspaces
   - Organizations
   - Pipelines
   - Compute environments
   - Actions
   - Runs
   - Secrets
   - Studios
   - Teams
   - Datasets
   - Labels
   - Credentials

3. **Replace placeholders** - In the command templates, replace:
   - `<WORKSPACE_ID>` → actual workspace ID
   - `<PIPELINE_ID>` → actual pipeline ID
   - `<ORGANIZATION_NAME>` → actual org name
   - etc.

4. **Output format** - Give me a markdown file with:
   - One section per command
   - The complete, ready-to-run command
   - Brief note about what it will do

## Important Notes

### Safe vs Destructive Commands

**Safe (run first)**:
- All `list` commands - just list resources
- All `view` commands - just view a resource
- All `export` commands - export configuration

**Needs test resources**:
- `add` commands - will create new resources (use names like "example-action", "test-secret")
- `delete` commands - will remove resources (use test resources only!)
- `update` commands - will modify resources (use test resources!)
- `leave` commands - will remove memberships (careful!)

### Strategy

1. Start with list commands to discover available resources
2. Use view commands to inspect specific resources
3. For add/delete examples, create test resources with obvious names
4. For destructive operations, use resources you're okay deleting

### Example Output Format

```markdown
## tw actions list

**Command**:
```bash
tw actions list -w 123456789
```

**Notes**: Lists all actions in workspace "MyWorkspace" (ID: 123456789). Should return 3 actions.

---

## tw pipelines view

**Command**:
```bash
tw pipelines view -n nf-core-rnaseq -w 123456789
```

**Notes**: Views details for the "nf-core-rnaseq" pipeline in MyWorkspace.

---
```

## Output File

Save the completed commands to: `completed-commands.md`

Then I'll take that file, run each command, and capture the outputs to create the documentation examples.
