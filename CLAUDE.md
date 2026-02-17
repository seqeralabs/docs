# Documentation Maintenance with Claude

This guide covers documentation standards, editorial workflows, and Claude-powered automation for the Seqera Platform documentation repository.

## Quick start

- **Editorial review** → Use `/editorial-review` command → Agents review docs and provide feedback
- **Local review** → Use `/review <file-or-directory>` → See issues before committing
- **Apply fixes** → Address issues directly in files based on agent feedback

> **Important:** Editorial reviews are **on-demand only**. They do NOT run automatically on PR creation or commits. You must explicitly trigger them by:
> - Running `/editorial-review` locally in Claude Code
> - Commenting `/editorial-review` on a PR
> - Manually dispatching the docs editorial review GitHub Actions workflow

## Workflows and architecture

This repository uses two main Claude-powered workflows:

### Editorial workflow

**Purpose:** On-demand quality checks for documentation content

**Components:**
- **Skill**: `/editorial-review`
- **Agents**: voice-tone, terminology, clarity (disabled), punctuation (planned)
- **Workflow**: `.github/workflows/docs-review.yml`
- **Scripts**: `classify-pr-type.sh` (PR classification), `post-inline-suggestions.sh` (GitHub API integration)
- **Triggers**: `/editorial-review` command (Claude Code or PR comment), manual workflow dispatch

### API workflow

**Purpose:** Generate OpenAPI overlay files for API documentation updates

**Components:**
- **Skill**: `/openapi-overlay-generator`
- **Workflow**: `.github/workflows/generate-openapi-overlays.yml`
- **Scripts**: `analyze_comparison.py` (change analysis), `validate_overlay.py` (structure validation), `check_consistency.py` (standards compliance), `update_sidebar.py` (sidebar updates)
- **Output**: YAML overlay files following OpenAPI overlay specification
- **Triggers**: Repository dispatch from Platform repository, manual workflow dispatch

## Editorial reviews with `/editorial-review`

### How it works

Use the `/editorial-review` command to run specialized agents on your documentation. This command works in two contexts:

**In Claude Code (local):**
1. Run the command in your terminal
2. Agents analyze files directly
3. Review findings in the conversation
4. Apply fixes to files manually

**In GitHub PR (CI):**
1. Comment `/editorial-review` on any PR
2. Workflow triggers automatically
3. Agents analyze changed files
4. Results posted as inline PR suggestions

### Usage

**Local review (Claude Code):**
```bash
# Review all changed files in current branch
/editorial-review

# Review specific file
/editorial-review platform-enterprise_docs/getting-started/quickstart.md

# Review entire directory
/editorial-review platform-cloud/docs/pipelines/

# Specify which agents to run
/editorial-review --agents voice-tone,terminology
```

**PR review (GitHub):**
```
# Comment this on any PR to trigger review
/editorial-review
```

The workflow will:
- Acknowledge the command immediately
- Run all agents (voice-tone, terminology, punctuation)
- Post up to 60 inline suggestions
- Provide downloadable artifact with full list

### What gets reviewed

The editorial review runs multiple specialized agents:

- **voice-tone**: Second person, active voice, present tense, confidence
- **terminology**: Product names, feature names, formatting conventions
- **punctuation**: List punctuation, Oxford commas, quotation marks, dashes
- **clarity**: Sentence length, jargon, complexity (currently disabled)

### Review output

The agents provide a structured report with:

- **Priority categorization**: Critical, important, minor issues
- **File and line references**: Easy navigation to issues
- **Specific suggestions**: Clear guidance on fixes
- **Context**: Why each issue matters

### Applying fixes

**From Claude Code:**
1. Open the files with issues
2. Navigate to the specific line numbers
3. Apply the suggested changes
4. Re-run `/editorial-review` to verify fixes

**From PR suggestions:**
1. Click "Commit suggestion" on individual inline comments
2. Or select multiple suggestions and click "Commit suggestions"
3. Comment `/editorial-review` again to verify fixes

**If 60+ suggestions found:**
1. Go to the workflow run (link in PR comment)
2. Download the `all-editorial-suggestions` artifact
3. Review full list in `all-suggestions-full.txt`
4. Apply remaining suggestions manually

## Local review with `/review`

Run editorial reviews locally before opening a PR:

```bash
# Review specific file
/review platform-enterprise_docs/getting-started/quickstart.md

# Review entire directory
/review platform-cloud/docs/pipelines/

# Quick pre-commit check (voice-tone and terminology only)
/review --profile=quick

# Review new content with structure checks
/review new-page.md --profile=new-content
```

## Editorial agents

### voice-tone
Checks for:
- Second person usage ("you" vs "the user")
- Active voice (not passive)
- Present tense (not future)
- No hedging language ("may", "might", "could")

### terminology
Checks for consistent product names, feature terminology, and formatting conventions.

**For detailed terminology rules, see:** `.claude/agents/terminology.md`

### clarity (disabled)
Checks for:
- Sentence length (flag >30 words)
- Undefined jargon
- Complex constructions
- Missing prerequisites

### punctuation
Checks for:
- Oxford commas
- List punctuation consistency
- Quotation marks
- Dash usage

## Documentation directory structure

All directories support editorial review via `/editorial-review` command:

| Directory | Description | File count |
|-----------|-------------|------------|
| `platform-enterprise_docs/` | Main enterprise docs | ~129 files |
| `platform-cloud/docs/` | Cloud platform docs | ~114 files |
| `platform-enterprise_versioned_docs/` | Versioned docs | Variable |
| `platform-api-docs/docs/` | API documentation | ~218 files |
| `fusion_docs/` | Fusion docs | ~24 files |
| `multiqc_docs/` | MultiQC docs | ~212 files |
| `wave_docs/` | Wave docs | ~43 files |
| `changelog/` | Release notes | ~232 files |

## Troubleshooting

**Q: Too many suggestions?**
- Focus on critical and important issues first
- Apply fixes incrementally
- Re-run `/editorial-review` to verify changes
- Consider splitting large reviews into smaller batches

**Q: Agents flagged something incorrectly?**
- Context matters - some terminology is acceptable in legacy docs
- Agents provide suggestions, not requirements
- Report false positives to improve agent rules

**Q: How do I review just specific files?**
- In Claude Code: `/editorial-review <file-path>` or `/editorial-review <directory-path>`
- In PR comments: `/editorial-review` reviews all changed files (cannot specify subset)

**Q: Does `/editorial-review` in PR comments run on every comment?**
- No, it only runs when you explicitly comment `/editorial-review`
- No automatic triggers on PR creation or updates
- Completely manual and on-demand

## Related documentation

- **Agent Implementation**: See `.claude/README.md` for technical details
- **Agent Definitions**: See `.claude/agents/*.md` for agent prompts
- **Scripts**: See `.github/scripts/` for workflow scripts
- **Skills**: See `.claude/skills/` for available skills
