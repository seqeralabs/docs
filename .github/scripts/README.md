# GitHub Actions scripts

This directory contains scripts invoked by [.pre-commit-config.yaml](../../.pre-commit-config.yaml) or by the GitHub Actions workflows under [.github/workflows/](../workflows/). See the [README's "Workflows and actions audit"](../../README.md#workflows-and-actions-audit) section for how each workflow uses these.

## bump-last-updated.py

Two-mode utility for keeping frontmatter `last updated:` current on `.md` / `.mdx` files. Used as a **checker** by the [pre-commit hook](../../.pre-commit-config.yaml) (fails with an invocable command, doesn't modify files) and as a **fixer** by the [pre-commit-fix.yaml](../workflows/pre-commit-fix.yaml) CI workflow (rewrites files in place).

### Modes

**Check mode** (`--check`): used by the pre-commit hook on `git commit`. Reports any changed file whose `last updated:` is stale (or missing on a file that declares `date created:`), prints the exact fix command, exits 1. No files modified.

**Fix mode** (default): rewrites files in place. Sets `last updated:` to today's date. If the file declares `date created:` but lacks `last updated:`, inserts the field immediately after `date created:`. Files without `date created:` (changelog entries, partials) are skipped.

### Invocation

**Check (what the pre-commit hook does):**

```bash
python3 .github/scripts/bump-last-updated.py --check path/to/file.md ...
```

**Fix (what you run when the check fails):**

```bash
python3 .github/scripts/bump-last-updated.py path/to/file.md ...
```

The check-mode failure message includes a paste-ready fix invocation listing exactly the stale files.

### Exit codes

| Mode | `0` | `1` |
|---|---|---|
| `--check` | No staleness detected | One or more files have stale `last updated:` (workflow / commit aborts; user runs the fixer) |
| default (fix) | Nothing to change | At least one file was modified (signals pre-commit to re-stage if invoked via the hook) |

### Why two modes

Following the same pattern as [check-doc-tags.py](check-doc-tags.py): the local hook should fail explicitly and tell the contributor what to run, not silently rewrite their working tree. The CI workflow then invokes the fixer on changed files so fork contributors and skipped local hooks still merge with a current `last updated:`.

### Scope

Excluded by `.pre-commit-config.yaml`:
- `platform-enterprise_versioned_docs/` — frozen release snapshots; their `last updated:` should reflect when the snapshot was cut.
- `changelog/` — entries don't follow the `date created:` / `last updated:` convention.
- Standard build/vendor dirs (`node_modules/`, `build/`, `dist/`, `.git/`).

---

## verify-agent-findings.py

Validates agent output by checking that quoted text actually exists at the claimed line numbers, preventing hallucinations from being reported.

### Usage

```bash
python3 .github/scripts/verify-agent-findings.py <findings-file> [repo-root] [agent-name] [output-file]
```

### Parameters

- `findings-file`: Path to file containing agent findings (JSON or Markdown format)
- `repo-root`: Path to repository root (default: current directory)
- `agent-name`: Name of agent that produced findings (default: 'unknown')
- `output-file`: Path to write verified findings (default: stdout)

### Example

```bash
# Verify voice-tone agent findings
python3 .github/scripts/verify-agent-findings.py \
  /tmp/voice-tone-findings.md \
  /Users/you/work/docs \
  voice-tone \
  /tmp/verified-findings.md
```

### Input formats

#### Markdown format
```markdown
### File: path/to/file.md

**Line 42:**
\```
EXACT QUOTE: "The user can configure"
\```
- **Issue**: Third person reference
- **Suggested**: "You can configure"
- **Rule**: Use second person
- **Confidence**: HIGH
```

#### JSON format
```json
{
  "agent": "voice-tone",
  "files": [{
    "path": "path/to/file.md",
    "findings": [{
      "line_number": 42,
      "exact_quote": "The user can configure",
      "issue_description": "Third person",
      "suggested_fix": "You can configure",
      "rule": "Use second person",
      "confidence": "HIGH"
    }]
  }]
}
```

### Verification logic

1. **File exists**: Hallucination if file doesn't exist
2. **Valid line number**: Hallucination if line number out of range
3. **Exact match**: Checks if quote matches actual line content
4. **Fuzzy match**: Checks case-insensitive substring match
5. **Nearby lines**: Checks ±2 lines for off-by-one errors

### Output

- ✅ Verified findings in clean markdown format
- ❌ Hallucinations filtered out with actual line content shown
- 📊 Summary statistics (total, verified %, hallucination %)

### Exit codes

- `0`: Success (verified findings output, even if some hallucinations found)
- `1`: Error (file not found, parse error)

---

## post-inline-suggestions.sh

Converts Claude agent review findings into GitHub inline suggestions that can be applied with a single click.

### Usage

```bash
./post-inline-suggestions.sh <review-file> <pr-number>
```

### Input format

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

### How it works

1. Parses the structured review file
2. Groups suggestions by file and line
3. Creates GitHub review comments with suggestion blocks
4. Posts all suggestions as a single review using GitHub API

### Requirements

- `gh` CLI tool (GitHub CLI)
- `jq` for JSON processing
- `GITHUB_TOKEN` environment variable with PR write permissions
