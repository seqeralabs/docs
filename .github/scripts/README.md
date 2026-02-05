# GitHub Actions Scripts

## post-inline-suggestions.sh

Converts Claude agent review findings into GitHub inline suggestions that can be applied with a single click.

### Usage

```bash
./post-inline-suggestions.sh <review-file> <pr-number>
```

### Input Format

The script expects a review file with this format:

```
FILE: path/to/file.md
LINE: 42
ISSUE: Brief description of the problem
ORIGINAL: |
exact original text from the file
SUGGESTION: |
corrected text here
---

FILE: path/to/another-file.md
LINE: 15
ISSUE: Another issue description
ORIGINAL: |
text to replace
SUGGESTION: |
replacement text
---
```

### Output

The script posts a GitHub review with inline suggestions on each specified line. Each suggestion appears as:

```
**Issue description**

```suggestion
corrected text here
```
```

Users can then click "Commit suggestion" to apply the fix directly from the PR interface.

### How It Works

1. Parses the structured review file
2. Groups suggestions by file and line
3. Creates GitHub review comments with suggestion blocks
4. Posts all suggestions as a single review using GitHub API

### Requirements

- `gh` CLI tool (GitHub CLI)
- `jq` for JSON processing
- `GITHUB_TOKEN` environment variable with PR write permissions
