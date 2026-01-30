# Documentation Maintenance with Claude

This guide covers documentation standards, editorial workflows, and Claude-powered automation for the Seqera Platform documentation repository.

## Quick Start

- **New PR created** → Agents automatically review changed docs → Inline suggestions appear
- **Local review** → Use `/review <file-or-directory>` → See issues before committing
- **Apply fixes** → Click "Commit suggestion" or batch-apply multiple → Done

## Automated PR Reviews

### How it works

When you open a PR that modifies documentation files, GitHub Actions automatically:

1. **Classifies the PR** (rename vs content change)
2. **Runs specialized agents** (voice-tone, terminology)
3. **Posts inline suggestions** (up to 60 per PR)
4. **Saves full report** (downloadable artifact)

### PR Classification

**Rename PRs** (>70% file renames, <5 significant content changes):
- Skips voice-tone and terminology checks
- Minimal suggestions posted
- Marked as 🏷️ "rename" type

**Content PRs** (everything else):
- All agents run (voice-tone, terminology)
- Up to 60 inline suggestions
- Full list available as artifact
- Marked as 📝 "content" type

### Applying Suggestions

**Individual fixes:**
1. Click "Commit suggestion" on any inline comment
2. Suggestion applies immediately to PR

**Batch apply:**
1. Select multiple suggestions using checkboxes
2. Click "Commit suggestions"
3. All selected fixes apply in one commit

### Handling 60+ Suggestions

If agents find more than 60 issues, a comment explains how to access the full list:

1. Go to the workflow run (link provided in comment)
2. Download the `all-editorial-suggestions` artifact
3. Open `all-suggestions-full.txt` to see all issues
4. Apply remaining suggestions manually or in bulk

**Note:** After applying 60 suggestions, the workflow re-runs automatically and may surface more issues.

### Manual Re-run

To re-run editorial review without making changes:

1. Go to **Actions** → **Documentation Review**
2. Click **Run workflow**
3. Select your PR branch
4. Click **Run workflow**

Or use the manual trigger with specific review type:
- `all` - Run all checks
- `voice-tone` - Only voice/tone
- `terminology` - Only terminology
- `clarity` - Only clarity (currently disabled)

## Local Review with `/review`

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

## Editorial Agents

### voice-tone
Checks for:
- Second person usage ("you" vs "the user")
- Active voice (not passive)
- Present tense (not future)
- No hedging language ("may", "might", "could")

### terminology
Checks for:
- Product names (Seqera Platform, not Tower*)
- Feature names (Studios capitalized)
- Formatting (bold for UI, backticks for code)
- RNA-Seq capitalization rules

*Tower is acceptable in legacy contexts - see [Terminology Standards](#terminology-standards)

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

## Terminology Standards

### Product Names

| Correct | Incorrect | Notes |
|---------|-----------|-------|
| Seqera Platform | the platform, Tower | Use full name (see Tower exceptions) |
| Studios | studio, Studio | Always capitalized |
| Nextflow | NextFlow, nextflow | Capital N, one word |
| Wave | wave, WAVE | Title case |
| MultiQC | multiQC, multiqc | Exact capitalization |
| Fusion | fusion, FUSION | Title case |
| TowerForge | N/A | Always acceptable |
| drop-down | dropdown, drop down | Always hyphenated |

### Tower Usage

**"Tower" is acceptable in:**
- Legacy documentation (older versions)
- Historical references ("formerly known as Tower")
- TowerForge (product name)
- Community/external content

**Use "Seqera Platform" for:**
- New documentation
- Current features
- Marketing/official communications

**Important:** If unsure about Tower usage, agents will ask but won't flag as critical.

### RNA-Seq Capitalization

**Capitalized "RNA-Seq":**
- Headings: `# RNA-Seq Analysis`
- Pipeline names: `nf-core-RNA-Seq`
- Scientific contexts: `RNA-Seq experiment`

**Lowercase "rna-seq":**
- Commands: `--input rna-seq-data`
- File paths: `/data/rna-seq/`
- Config: `rna-seq.config`
- Variables: `rna_seq_samples`

### UI Elements

Always match exact UI text and capitalization:
- **Launchpad** (not "Launch Pad")
- **Data Explorer** (not "data explorer")
- **Runs** (not "Executions")

## Documentation Directory Structure

### Automated PR Reviews

These directories trigger automated agent reviews:

| Directory | Description | File Count |
|-----------|-------------|------------|
| `platform-enterprise_docs/` | Main enterprise docs | ~129 files |
| `platform-cloud/docs/` | Cloud platform docs | ~114 files |
| `platform-enterprise_versioned_docs/` | Versioned docs | Variable |

### Manual Review Only

Use `/review` command for these directories:

| Directory | Description | File Count |
|-----------|-------------|------------|
| `platform-api-docs/docs/` | API documentation | ~218 files |
| `fusion_docs/` | Fusion docs | ~24 files |
| `multiqc_docs/` | MultiQC docs | ~212 files |
| `wave_docs/` | Wave docs | ~43 files |
| `changelog/` | Release notes | ~232 files |

## Troubleshooting

**Q: Too many suggestions (100+)?**
- Download the artifact for the full list
- Apply high-priority fixes first
- Re-run review to get next batch
- Consider a cleanup PR after main PR merges

**Q: Agents flagged Tower incorrectly?**
- Context matters - Tower is acceptable in legacy docs
- Agents should ask, not flag as critical
- Report false positives to improve agent rules

**Q: Workflow not running on my PR?**
- Check if PR modifies files in `platform-*` directories
- Workflow files must exist on master branch first
- Check Actions tab for errors

**Q: Want to adjust suggestion limit?**
- Current limit: 60 inline suggestions
- Full list always available via artifact
- To change: modify `.github/workflows/docs-review.yml` line 247

## Related Documentation

- **Agent Implementation**: See `.claude/README.md` for technical details
- **Agent Definitions**: See `.claude/agents/*.md` for agent prompts
- **Scripts**: See `.github/scripts/` for workflow scripts
- **Skills**: See `.claude/skills/` for available skills
