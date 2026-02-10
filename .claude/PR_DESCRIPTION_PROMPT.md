# PR Description Generator Prompt

Use this prompt to generate comprehensive PR descriptions. Copy and paste it into Claude Code (or any Claude interface) when you need a PR description.

---

## Prompt

```
Analyze this pull request and generate a comprehensive description following this exact format:

## Summary
[1-2 sentence overview of what this PR accomplishes - be specific about the business value]

## What changed

### [Primary category] (X files/items)
- [Specific change 1 with file reference]
- [Specific change 2 with file reference]
- [Continue...]

### [Secondary category] (X files/items)
- [Specific change 1]
- [Specific change 2]
- [Continue...]

[Add more categories as needed]

## Improvements

**Before:**
- [Specific problem or limitation 1]
- [Specific problem or limitation 2]
- [Continue...]

**After:**
- [Specific improvement or solution 1]
- [Specific improvement or solution 2]
- [Continue...]

**Quality enhancements:**
- [Specific enhancement with metrics/details]
- [Another enhancement]
- [Continue...]

**Coverage:**
- X files changed, Y insertions(+), Z deletions(-)
- [Other relevant statistics]

## What to review

All changes are in [directory/category]:

### [Section 1]
- [filename.ext](path/to/file.ext) - [What this file does]
- [filename2.ext](path/to/file2.ext) - [What this file does]

### [Section 2]
- [filename3.ext](path/to/file3.ext) - [What this file does]

**Focus on:**
- [Specific area requiring attention]
- [Important consideration or trade-off]
- [Security/performance/architecture concern if applicable]

---

To generate this description:

1. Run: `git log master..HEAD --oneline` to see all commits on this branch
2. Run: `git diff master...HEAD --stat` to see file changes with statistics
3. Run: `git diff master...HEAD --name-status` to see added/modified/deleted files
4. Run: `git diff master...HEAD --shortstat` to get total line changes
5. Identify the main changes and group them logically (not just by file type)
6. Use relative file paths for all markdown links (e.g., `.claude/agents/voice-tone.md`)
7. Include concrete metrics (file counts, line counts, number of items)
8. Make "What changed" section detailed and specific with examples
9. In "Improvements" section, clearly show before/after contrast
10. Highlight any breaking changes, architectural decisions, or security implications
11. Keep language professional, clear, and value-focused

Output ONLY the formatted markdown description, nothing else.
```

---

## Usage

### In Claude Code CLI:
1. Navigate to your repo: `cd /path/to/docs`
2. Checkout the PR branch: `git checkout your-branch-name`
3. Open Claude Code
4. Copy the prompt above and paste it
5. Claude will analyze and generate the description
6. Copy the output and paste into your PR description

### In Claude.ai:
1. Run the git commands locally to get the data:
   ```bash
   git log master..HEAD --oneline > /tmp/commits.txt
   git diff master...HEAD --stat > /tmp/changes.txt
   git diff master...HEAD --name-status > /tmp/files.txt
   git diff master...HEAD --shortstat > /tmp/stats.txt
   ```
2. Go to https://claude.ai
3. Paste the prompt along with the output from those files
4. Get the generated description

### Quick one-liner for Claude Code:
```
@claude analyze this PR with git log master..HEAD and git diff master...HEAD --stat, then create a comprehensive PR description with: Summary (1-2 sentences), What changed (grouped by category with file counts), Improvements (before/after with metrics), and What to review (file links with focus areas). Use the format from similar PRs in this repo.
```

## Tips

- **Better commits = better descriptions**: Write clear commit messages
- **Review before posting**: Generated descriptions are starting points - refine as needed
- **Adjust categories**: Group changes in ways that make sense for your specific PR
- **Add context**: Include any manual testing, migration steps, or deployment notes
- **Link to issues**: Reference any related issues or tickets

## Example Usage

```
@claude I need a PR description. Run git log and git diff to see what changed, then create a comprehensive description following the format: Summary, What changed (with categories), Improvements (before/after), What to review (with file links). Include statistics and focus on the value this brings.
```
