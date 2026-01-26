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
- **page-structure**: Heading hierarchy, H1 usage, content flow

### Automated PR reviews

When you open a PR with documentation changes, GitHub Actions automatically runs all agents and posts review comments. To apply fixes, comment `@claude fix` on the PR.

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

Key directories in `/Users/justine.geffen/work/docs/`:

- `platform-enterprise_docs/` - Main enterprise documentation
- `platform-cloud/` - Cloud platform docs
- `fusion_docs/` - Fusion documentation
- `multiqc_docs/` - MultiQC documentation
- `wave_docs/` - Wave documentation
- `changelog/` - Release notes

## Review output format

Review markdown files using the Google developers guide:

**REVIEW FORMAT REQUIREMENT**: Provide corrections in this exact format, make the Line attribute linked to the line in the file it is referencing:

```diff
+ Line X: [original text]
- Issue: [description of problem]
+ Correction: [corrected text]
- Reason: [Google style guide principle or grammar rule]

+ Line Y: [original text]
- Issue: [description of problem]
+ Correction: [corrected text]
- Reason: [Google style guide principle or grammar rule]
```

Review the following markdown file for:

1. **Typos and Grammar**
   - Spelling errors
   - Grammar mistakes
   - Non-american spelling
   - Punctuation issues
   - Word choice improvements

2. **Markdown Formatting**
   - Proper heading hierarchy (H1 → H2 → H3, etc.)
   - Consistent list formatting
   - Code block syntax and language specification
   - Link formatting and validity
   - Image alt text and proper syntax
   - Table structure and alignment

3. **Googl Guide Compliance**
   - **Headings**: Use sentence case (capitalize only first word and proper nouns)
   - **Voice**: Use active voice, second person ("you"), present tense
   - **Tone**: Conversational but professional, helpful and inclusive
   - **Lists**: Use parallel structure, start with action verbs when appropriate
   - **Code**: Format code elements with backticks, use descriptive variable names
   - **Links**: Use descriptive link text (avoid "click here" or "read more")
   - **Accessibility**: Include alt text for images, use descriptive headings
   - **Inclusive language**: Use gender-neutral pronouns, avoid ableist language
   - **Consistency**: Maintain consistent terminology throughout

4. **Structure and Organization**
   - Logical flow of information
   - Clear section breaks
   - Appropriate use of callouts/notes/warnings
   - Scannable content with good use of whitespace

5. **Code blocks**
   - Format code elements with backticks, use descriptive variable names
   - Use a language definition for code blocks
   - Ensure code is indented correctly
   - Use ALL_CAPS with underscores for variable placeholders, do not use possessive adjective

6. **Front matter fields**
   - Use title in page front matter (title: "[page title]")
   - Use description in page front matter (description: "[brief page description]")
   - Use date for the date the page was created in page front matter (date: "[YYYY-MM-DD"]")
   - Use last_update for the date the page was last updated in page front matter (last_update: "[YYYY-MM-DD"]")
   - Use tags in page front matter (tags: "[2-5 relevant tags]")

Provide:
- Specific line-by-line corrections
- Suggestions for improvement
- Explanations of Google style guide principles
- A revised version if requested
