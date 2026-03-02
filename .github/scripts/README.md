# GitHub Actions scripts

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
