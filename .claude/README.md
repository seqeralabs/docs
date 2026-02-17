# Claude Code Configuration

This directory contains Claude Code agents, skills, and configuration for the Seqera Platform documentation repository.

## Overview

**What's in `.claude/`:**
- **Agents** - Editorial review assistants that check documentation quality
- **Skills** - Task-specific workflows for documentation automation
- **Configuration** - Settings for CLI and GitHub Actions integration

**Available to:**
- Claude Code CLI users working on this project
- Claude Desktop app (synced projects)
- GitHub Actions workflows via Claude API

## Skills

Skills are AI-powered workflows that automate specific documentation tasks.

### openapi-overlay-generator

Generates OpenAPI overlay files for Seqera Platform API documentation updates.

**Use when:**
- Analyzing Speakeasy comparison overlays
- Generating operations, parameters, or schemas overlay files
- Documenting new API endpoints or Platform version updates
- Validating overlay files against documentation standards

**Documentation:** See `skills/openapi-overlay-generator/SKILL.md`

**Invocation:** `/openapi-overlay-generator`

### review

Runs comprehensive editorial reviews on documentation files or directories.

**Use when:**
- Pre-commit review of changed files
- Directory-wide quality checks
- Targeted review (voice-tone only, terminology only)

**Invocation:**
```bash
/review <file-or-directory> [--profile=<profile>]
```

**Profiles:**
- `quick` - Voice-tone and terminology only
- `comprehensive` - All agents
- `new-content` - Includes structure checks

## Agents

Agents are specialized editorial reviewers that check documentation for specific quality criteria. They run automatically in GitHub Actions on PRs or manually via `/review`.

### voice-tone

Ensures documentation uses second person, active voice, and present tense.

**Configuration:** `.claude/agents/voice-tone.md`

**Checks:**
- Second person ("you") vs third person ("the user")
- Active vs passive voice
- Present vs future tense
- Hedging language ("may", "might", "could")

### terminology

Enforces consistent product names, feature names, and formatting.

**Configuration:** `.claude/agents/terminology.md`

**Checks:**
- Product names (Seqera Platform, Studios, Nextflow)
- Feature terminology (drop-down, compute environment)
- UI formatting (bold for buttons, backticks for code)
- RNA-Seq capitalization

**Special rules:**
- Tower: Acceptable in legacy contexts
- TowerForge: Always acceptable
- drop-down: Always hyphenated

### clarity

Improves readability by flagging complex sentences and jargon.

**Configuration:** `.claude/agents/clarity.md`

**Status:** Currently disabled in workflows

**Checks:**
- Sentence length (>30 words)
- Undefined jargon
- Complex constructions
- Missing prerequisites

### punctuation

Ensures consistent punctuation across documentation.

**Status:** Not yet implemented as separate agent

**Checks:**
- Oxford commas
- List punctuation
- Quotation marks
- Dash usage

## GitHub Actions integration

### Documentation review workflow

**File:** `.github/workflows/docs-review.yml`

**Triggers (GitHub Actions, on-demand only):**
- **PR comment:** Comment `/editorial-review` on any PR
- **Manual workflow dispatch:** Via GitHub Actions UI (see below)

Editorial review can also be run locally via Claude Code CLI using the `/editorial-review` command; this runs outside the `.github/workflows/docs-review.yml` workflow.
**NOT triggered by:**
- PR creation, updates, or commits (to conserve tokens)

**How it works:**
0. Validates bash script syntax (fails fast if scripts have errors)
1. Classifies PR as "rename" or "content" type
2. Runs agents based on PR type (rename PRs skip voice-tone & terminology)
3. Posts up to 60 inline suggestions per PR
4. Saves full report as downloadable artifact (30-day retention)

**Manual re-runs:**

After the initial review, re-run the workflow manually:

1. Go to **Actions** → **Documentation Review**
2. Click **Run workflow**
3. Select your PR branch
4. Enter the **PR number** (required for posting results)
5. Choose review type:
   - `all` - Run all checks
   - `voice-tone` - Only voice/tone
   - `terminology` - Only terminology
   - `clarity` - Only clarity _(currently disabled in CI)_
6. Click **Run workflow**

The workflow does NOT re-run automatically on subsequent commits (to conserve tokens).

**Outputs:**
- Inline suggestions on specific lines (click to apply)
- Comment with download link if >60 suggestions found
- Summary report with PR type and agent status

### Scripts

**`.github/scripts/post-inline-suggestions.sh`**
- Converts agent findings to GitHub inline suggestions
- Posts via GitHub Review API

**`.github/scripts/classify-pr-type.sh`**
- Analyzes git diff to determine PR type
- Outputs "rename" or "content" for workflow decisions

### Agent status

| Agent | Status | Used in CI |
|-------|--------|------------|
| voice-tone | ✅ Active | Yes |
| terminology | ✅ Active | Yes |
| punctuation | ✅ Active | No |
| clarity | ⚠️ Disabled | No |
| docs-fix | 📝 Local only | No |

## Agent output format

Agents output structured suggestions:

```
FILE: path/to/file.md
LINE: 42
ISSUE: Brief description
ORIGINAL: |
exact original text
SUGGESTION: |
corrected text
---
```

This format is parsed by `post-inline-suggestions.sh` and converted to GitHub's inline suggestion syntax.

## For contributors

### Working with API documentation

When working on API documentation:
1. Claude Code automatically detects and offers relevant skills
2. Skills provide specialized knowledge about documentation standards
3. Skills include scripts ensuring consistency across API docs

### Working with editorial content

**Local development (before PR):**
1. Make doc changes locally
2. Run `/editorial-review <file>` in Claude Code
3. Review findings and apply fixes
4. Commit and push

**PR review (on-demand):**
1. Open PR with documentation changes
2. Comment `/editorial-review` to trigger review
3. Review inline suggestions on affected lines
4. Apply fixes individually or batch-apply multiple
5. Comment `/editorial-review` again to verify fixes

### Testing changes locally

```bash
# Test specific agent
/review --profile=quick platform-enterprise_docs/quickstart.md

# Review entire directory
/review platform-cloud/docs/

# Test skill
/openapi-overlay-generator
```

## Development

### Modifying agents

1. Edit agent definition in `.claude/agents/<agent-name>.md`
2. Test locally with `/review`
3. Create PR (agents will review their own changes)
4. Merge after approval

### Adjusting suggestion limits

Current limit: 60 inline suggestions per PR

To change: Edit `.github/workflows/docs-review.yml` lines 268-284

### Adding new agents

1. Create `.claude/agents/<new-agent>.md`
2. Add to `.github/workflows/docs-review.yml`
3. Update documentation in `.claude/README.md` and `CLAUDE.md`
4. Test on sample content

## Maintenance

- Skills and agents are version-controlled with the repository
- Updates to skills should be reviewed like any other code change
- Test changes locally before committing
- Monitor the **Actions** tab in GitHub for workflow issues
- Artifacts auto-delete after 30 days

## Architecture

```
.claude/
├── README.md                    # This file
├── agents/
│   ├── voice-tone.md           # Agent definitions
│   ├── terminology.md
│   └── clarity.md
└── skills/
    └── openapi-overlay-generator/
        └── SKILL.md
```

## Resources

- **User Guide:** See `CLAUDE.md` in repository root
- **Workflows:** See `.github/workflows/docs-review.yml`
- **Scripts:** See `.github/scripts/`
