# Review Command

## Command
`/review [path] [--profile=<profile>] [--format=<format>]`

## Description
Run comprehensive editorial review on documentation files using specialized SME agents.

## Parameters
- **path** (optional): File or directory to review. Defaults to current directory
- **--profile** (optional): Review profile (quick|comprehensive|new-content). Defaults to comprehensive
- **--format** (optional): Output format (dev|github). Defaults to dev

## Examples

### Review current directory comprehensively
```
/review
```

### Review specific file quickly
```
/review docs/getting-started.md --profile=quick
```

### Review directory for new content
```
/review platform-cloud/docs/pipelines/ --profile=new-content
```

### Review for GitHub PR comment
```
/review --format=github
```

## Behavior

This command uses the `editorial-review` skill to:

1. **Identify files** to review based on the path parameter
2. **Select appropriate agents** based on the profile
3. **Execute review** using specialized SME agents in parallel
4. **Generate structured report** in the specified format

## Review Profiles

### quick
- **Agents:** voice-tone, terminology
- **Focus:** Critical and important issues only
- **Use case:** Pre-commit checks, minor content changes

### comprehensive (default)
- **Agents:** voice-tone, terminology, punctuation, clarity
- **Focus:** All issue severities
- **Use case:** Major content changes, thorough review

### new-content
- **Agents:** page-structure, voice-tone, terminology, punctuation
- **Focus:** Structural and editorial issues
- **Use case:** New pages, major content restructuring

## Output Formats

### dev (default)
Detailed report optimized for development workflow with file-by-file breakdown and priority actions.

### github
Structured markdown optimized for GitHub PR comments with tables and summary statistics.

## Integration

This command integrates with:
- **Local Claude Code CLI** for pre-commit reviews
- **Claude Desktop** when working on synced documentation projects
- **GitHub Actions** via the claude-code-action (uses editorial-review skill directly)

## Implementation

The command delegates to the `editorial-review` skill:

```javascript
const result = await runSkill('editorial-review', {
  scope: path || process.cwd(),
  profile: profile || 'comprehensive',
  format: format || 'dev'
});

console.log(result);
```
