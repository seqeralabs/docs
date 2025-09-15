# Instructions for documentation maintenance

## Overview

This is the master instruction file for working with the documentation repository. It covers linting, content standards, and workflows for maintaining high-quality documentation.

## Linting process

### Primary linting tool

**Location**: `../Claude/Linting/claude-md-linter.js`

**Purpose**: Context-aware markdown linter that catches issues Vale often misses or gives false positives for.

### How to run linting from docs/ directory

**Quick Command**: Use the `./lint` shortcut

```bash
# From /Users/justine.geffen/work/docs/

# Lint current directory and all subdirectories
./lint

# Lint specific documentation sections
./lint platform-enterprise_docs/
./lint fusion_docs/
./lint multiqc_docs/

# Lint multiple directories at once
./lint platform-enterprise_docs/ fusion_docs/ multiqc_docs/
```

**Full Command** (if needed):
```bash
node ../Claude/Linting/claude-md-linter.js [options] [directories...]
```

### What actually happens when you run the linter

#### 1. File discovery phase
- The linter recursively scans the specified directory/directories
- Identifies all files with `.md` and `.mdx` extensions
- Ignores non-markdown files automatically

#### 2. File processing phase
For each markdown file found:
- Reads the file content line by line
- Applies context-aware rules for RNA-Seq usage
- Checks heading capitalization patterns
- Records any issues found with line numbers

#### 3. Output phase
- Groups all issues by file path
- Displays errors (❌) and warnings (⚠️)
- Shows the problematic line content for context
- Returns exit code (0 = success, 1 = errors found)

#### 4. Your action phase
**YOU then need to:**
- Review each flagged issue
- Edit the files manually to fix problems
- Re-run the linter to verify fixes
- Commit your changes

### RNA-Seq context rules

#### Use "RNA-Seq" (capitalized) when:
- In headings: `# RNA-Seq Analysis Guide`
- Pipeline names: `nf-core-RNA-Seq pipeline`
- Tutorial titles: `RNA-Seq Tutorial`
- Scientific contexts: `RNA-Seq experiment design`
- Data descriptions: `RNA-Seq samples`

#### Allow "rna-seq" (lowercase) when:
- Command parameters: `--input rna-seq-data`
- File paths: `/data/rna-seq/results`
- Configuration: `rna-seq.config`
- Variable names: `rna_seq_samples`
- Technical identifiers: `tag: rna-seq`

### Linting options

```bash
# Focus only on RNA-Seq issues
./lint --no-heading-case platform-enterprise_docs/

# Focus only on heading issues  
./lint --no-rna-seq platform-enterprise_docs/

# Detailed output
./lint --verbose platform-enterprise_docs/

# Combine options
./lint --no-heading-case --verbose .
```

## Example workflow

### Daily documentation work

1. **Make your edits** to markdown files
2. **Run the linter**:
   ```bash
   ./lint platform-enterprise_docs/
   ```
3. **Review output** and note file paths and line numbers with issues
4. **Edit files** to fix flagged problems:
   - Open each flagged file
   - Go to the specific line numbers mentioned
   - Make the suggested changes
5. **Re-run linter** to confirm fixes:
   ```bash
   ./lint platform-enterprise_docs/
   ```
6. **Commit when clean**:
   ```bash
   git add -A
   git commit -m "Fix documentation linting issues"
   ```

### Example linter output and response

**Linter shows:**
```
📄 platform-enterprise_docs/getting-started/rnaseq.md
  ❌ Line 15: Should use "RNA-Seq" (capitalized) in this context: # rna-seq Analysis
     # rna-seq Analysis Guide
  ⚠️ Line 23: Consider using "RNA-Seq" (capitalized): The rna-seq pipeline
     The rna-seq pipeline processes your data
```

**You then:**
1. Open `platform-enterprise_docs/getting-started/rnaseq.md`
2. Go to line 15, change `# rna-seq Analysis Guide` to `# RNA-Seq Analysis Guide`
3. Go to line 23, change `The rna-seq pipeline` to `The RNA-Seq pipeline`
4. Save the file
5. Re-run linter to verify

### Integration with other tools

#### Before running Vale
```bash
# Run our linter first to catch context issues
./lint platform-enterprise_docs/

# Fix any issues found, then run Vale
vale platform-enterprise_docs/
```

#### Git workflow integration
```bash
# Before committing changes
./lint
echo $?  # Should be 0 (no errors) before committing
```

## Directory structure context

When running from `/Users/justine.geffen/work/docs/`, these are the key directories to lint:

- `platform-enterprise_docs/` - Main enterprise documentation
- `platform-cloud/` - Cloud platform docs
- `changelog/` - Release notes (lower priority for linting)

## Common commands reference

```bash
# Quick daily check of enterprise docs
./lint platform-enterprise_docs/

# Comprehensive check of all main docs
./lint platform-enterprise_docs/ platform-cloud/ fusion_docs/ multiqc_docs/ wave_docs/

# Focus on RNA-Seq issues only (fastest)
./lint --no-heading-case platform-enterprise_docs/

# Check single file you're working on
./lint platform-enterprise_docs/getting-started/rnaseq.md

# Lint everything in current directory
./lint
```

## Troubleshooting

### If linter finds too many issues
- Start with one directory: `./lint platform-enterprise_docs/getting-started/`
- Focus on errors first (❌), warnings (⚠️) can wait
- Use `--no-heading-case` to focus only on RNA-Seq issues

### If you disagree with a finding
- Check the context rules above
- Consider if the usage is actually incorrect
- If it's a false positive, the rules can be customized (see Claude/Linting/CLAUDE.md)

### Performance with large directories
- Lint specific subdirectories rather than entire repo
- Use focused checks (`--no-heading-case` or `--no-rna-seq`)


Review markdown files using the google developers guide:

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
