# Instructions for documentation maintenance

## Overview

This is the master instruction file for working with the documentation repository. It covers documentation quality standards, review processes, and workflows for maintaining high-quality documentation.

## Documentation review with Claude agents

### Review a file or directory

Use the `/review` command to run editorial reviews:

```bash
# Review a specific file
/review platform-enterprise_docs/getting-started/quickstart.md

# Review a directory (comprehensive check)
/review platform-cloud/docs/pipelines/

# Quick pre-commit check (voice-tone and terminology only)
/review --profile=quick

# Review new content with structure checks
/review new-page.md --profile=new-content
```

### What the agents check

The editorial review system uses specialized agents:

- **voice-tone**: Second person, active voice, present tense, no hedging
- **terminology**: Product names, feature names, formatting conventions
- **clarity**: Sentence length, jargon, readability, prerequisites
- **punctuation**: Oxford commas, list punctuation, quotation marks

### Automated PR reviews

When you open a PR with documentation changes, GitHub Actions automatically runs agents and posts **inline suggestions** directly on the affected lines.

**To apply suggestions:**
1. **Individual fixes**: Click the "Commit suggestion" button on any inline comment
2. **Batch commit**: Select multiple suggestions using checkboxes and commit them together

The agents format their findings as GitHub inline suggestions, making it easy to review and apply changes with a single click. Each suggestion shows the original text and the corrected version side-by-side.

## Terminology standards

### RNA-Seq context rules

**Use "RNA-Seq" (capitalized) when:**
- In headings: `# RNA-Seq Analysis Guide`
- Pipeline names: `nf-core-RNA-Seq pipeline`
- Tutorial titles: `RNA-Seq Tutorial`
- Scientific contexts: `RNA-Seq experiment design`
- Data descriptions: `RNA-Seq samples`

**Allow "rna-seq" (lowercase) when:**
- Command parameters: `--input rna-seq-data`
- File paths: `/data/rna-seq/results`
- Configuration: `rna-seq.config`
- Variable names: `rna_seq_samples`
- Technical identifiers: `tag: rna-seq`

### Product names
- ✅ "Seqera Platform" (never "Tower" or "the platform")
- ✅ "Studios" (ALWAYS capitalized, even when generic)
- ✅ "Fusion", "Wave", "Nextflow", "MultiQC" (capitalized)
- ✅ "compute environment" (lowercase when not a proper noun)

## Documentation directory structure

### Directories with automated PR reviews

These directories trigger automated agent reviews on pull requests:

- `platform-enterprise_docs/` - Main enterprise documentation (129 files)
- `platform-cloud/docs/` - Cloud platform docs (114 files)
- `platform-enterprise_versioned_docs/` - Versioned enterprise docs

### Other documentation directories

These directories exist but do not trigger automated PR reviews (use `/review` command manually):

- `platform-api-docs/docs/` - API documentation (218 files)
- `fusion_docs/` - Fusion documentation (24 files)
- `multiqc_docs/` - MultiQC documentation (212 files)
- `wave_docs/` - Wave documentation (43 files)
- `changelog/` - Release notes (232 files)
