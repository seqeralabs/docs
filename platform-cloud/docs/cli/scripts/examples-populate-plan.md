# Plan: Integrate CLI Test Examples into Reference Documentation

## Context

We have 151 "success" category CLI examples extracted from Java test files (`cli-examples.json`) that need to be integrated into the reference documentation. However, this is **not a straightforward lift-and-shift** because:

1. Test examples are minimal command strings without output or context
2. Current overlays have rich formatting with output, explanations, and groupings
3. Test examples have technical names; overlays have user-friendly descriptions
4. Many examples already exist in overlays - we need to complement, not duplicate

## Problem Analysis

### What We Have

**From cli-examples.json (151 success examples):**
- Raw command strings (e.g., `tw runs list --offset 1 --max 2`)
- Test metadata (test_method: "testListWithOffset", description: "List With Offset")
- Command family mapping (e.g., "runs", "pipelines", "compute-envs")
- No output, no context, no explanations

**From existing overlays (77 files):**
- Rich examples with realistic output
- Descriptive headings and explanations
- "This command will:" breakdowns for complex commands
- Grouped variations (basic → advanced)
- Admonitions (:::note, :::tip)
- Cross-references to related commands

### Key Challenges

1. **Deduplication**: Many test examples overlap with existing overlay examples (e.g., `tw credentials add aws`)
2. **Context generation**: Test method names need transformation (testListWithOffset → "List runs with pagination offset")
3. **Output generation**: Test examples lack output; need decision on whether to generate/mock output
4. **Organizational structure**: Need to group related test examples meaningfully
5. **Preservation**: Must not overwrite existing rich overlay content

## Proposed Approach

### Strategy: Intelligent Augmentation, Not Replacement

Create a script that:
1. **Analyzes both sources** - compares test examples with existing overlay content
2. **Identifies gaps** - finds test examples that demonstrate patterns not in overlays
3. **Groups examples** - clusters similar test examples by operation and pattern
4. **Generates context** - creates user-friendly descriptions from test metadata
5. **Produces overlay supplements** - creates new overlay sections or files for gaps

### Implementation Plan

#### Phase 1: Analysis Script (`analyze-example-coverage.py`)

Create a script to analyze overlap between test examples and existing overlays:

```python
def analyze_coverage(cli_examples_json, overlays_dir):
    """
    Compare test examples with existing overlay content.

    Output:
    - List of test examples already covered in overlays
    - List of test examples representing new patterns
    - Suggestions for grouping uncovered examples
    """

    # Load test examples (filter category == "success")
    test_examples = load_test_examples(cli_examples_json)

    # Parse existing overlays to extract commands
    overlay_commands = extract_commands_from_overlays(overlays_dir)

    # Compare and categorize
    covered = []
    gaps = []

    for example in test_examples:
        if is_similar_to_overlay(example['command'], overlay_commands):
            covered.append(example)
        else:
            gaps.append(example)

    # Group gaps by pattern (pagination, workspace-scoped, CRUD, etc.)
    grouped_gaps = group_by_pattern(gaps)

    return {
        'covered': covered,
        'gaps': grouped_gaps,
        'stats': generate_stats(covered, gaps)
    }
```

**Output**: `example-coverage-report.json` with:
- Coverage percentage per command family
- List of unique patterns in test examples not in overlays
- Recommendations for which examples to add

#### Phase 2: Example Generator Script (`generate-example-overlays.py`)

Create a script to generate overlay content from uncovered test examples:

```python
def generate_example_section(examples, command_family):
    """
    Generate overlay markdown for a group of related test examples.

    Input: List of test examples for same command/pattern
    Output: Formatted markdown with:
    - H4 headings from test descriptions
    - Code blocks with commands
    - Brief context from test names
    - Proper grouping by pattern
    """

    markdown = []

    # Group by operation (list, add, update, delete, etc.)
    by_operation = group_by_operation(examples)

    for operation, examples_list in by_operation.items():
        # Generate heading
        heading = generate_heading_from_operation(operation)
        markdown.append(f"#### {heading}")
        markdown.append("")

        # For each variation
        for example in examples_list:
            # Generate description from test method name
            description = humanize_test_name(example['test_method'])

            # Add command in code block
            markdown.append("```bash")
            markdown.append(example['command'])
            markdown.append("```")
            markdown.append("")

            # Add brief context
            context = generate_context(example)
            if context:
                markdown.append(context)
                markdown.append("")

    return "\n".join(markdown)
```

**Features**:
- Transforms test method names to user-friendly descriptions
  - `testListWithOffset` → "List with pagination offset"
  - `testAddWithOverwrite` → "Add with overwrite flag"
  - `testUpdateComputeEnv` → "Update compute environment"
- Groups similar examples (all pagination examples together)
- Adds minimal context without hallucinating output
- Uses H4 headings matching overlay patterns

#### Phase 3: Integration Strategy

**Option A: Create Supplementary Overlay Files** (Recommended)
- Generate new files like `tw-runs-variations.md`, `tw-pipelines-pagination.md`
- These files contain only the uncovered patterns from test examples
- Keep existing overlay files unchanged
- Generator merges both during doc generation

**Option B: Append to Existing Overlays**
- Parse existing overlay files
- Identify appropriate insertion points (e.g., after "### Examples" section)
- Append new examples with clear divider
- Risk: More complex, could break existing formatting

**Recommendation: Option A** - Safer, preserves manual content, easier to review

#### Phase 4: Documentation Pattern Templates

Create templates for different example patterns:

**Template 1: Pagination Examples**
```markdown
### Pagination Examples

#### List with offset-based pagination

```bash
tw runs list --offset 1 --max 2
```

Returns a subset of results starting from the second item (offset 1), showing a maximum of 2 results.

#### List with page-based pagination

```bash
tw runs list --page 1 --max 2
```

Returns the second page of results with 2 items per page.
```

**Template 2: Workspace-Scoped Operations**
```markdown
### Workspace-Scoped Operations

#### Add with workspace context

```bash
tw participants add -w 75887156211589 -n julio -t MEMBER
```

Adds a participant to a specific workspace using the workspace ID.
```

**Template 3: Flag Variations**
```markdown
### Advanced Options

#### Add with overwrite flag

```bash
tw credentials add aws --overwrite -n aws -a access_key -s secret_key
```

Adds AWS credentials with the `--overwrite` flag to replace existing credentials with the same name.
```

## Critical Files

### Files to Create
1. `/scripts/analyze-example-coverage.py` - Coverage analysis script
2. `/scripts/generate-example-overlays.py` - Example generation script
3. `/scripts/cli-examples.json` - Copy from source (already exists)

### Files to Read/Analyze
1. `/scripts/cli-examples.json` - Source test examples
2. `/overlays/*.md` - Existing overlay files (77 files)
3. `/reference/*.md` - Generated reference docs (18 files)

### Files to Potentially Create
- `/overlays/tw-<command>-variations.md` - Supplementary example files for gaps

## Verification Plan

### Step 1: Run Coverage Analysis
```bash
cd /Users/llewelyn-van-der-berg/Documents/GitHub/docs/platform-cloud/docs/cli
python scripts/analyze-example-coverage.py \
  --examples scripts/cli-examples.json \
  --overlays overlays \
  --output example-coverage-report.json
```

**Expected Output**:
- JSON report showing coverage percentage
- List of unique patterns not in overlays
- Recommendations for which examples to add

### Step 2: Review Coverage Report
- Review `example-coverage-report.json`
- Identify which command families have the biggest gaps
- Decide which patterns are valuable enough to document

### Step 3: Generate Supplementary Overlays
```bash
python scripts/generate-example-overlays.py \
  --examples scripts/cli-examples.json \
  --coverage-report example-coverage-report.json \
  --overlays overlays \
  --output overlays-generated
```

**Expected Output**:
- New overlay files in `overlays-generated/` directory
- Files like `tw-runs-pagination.md`, `tw-credentials-variations.md`
- Markdown formatted following existing patterns

### Step 4: Manual Review
- Review generated overlays for quality
- Check for:
  - Appropriate headings and grouping
  - Meaningful descriptions
  - No duplicate content
  - Consistent formatting

### Step 5: Integrate and Regenerate
```bash
# Copy approved generated overlays to main overlays directory
cp overlays-generated/*.md overlays/

# Regenerate reference docs
python scripts/generate-cli-docs.py \
  --metadata metadata/cli-metadata.json \
  --overlays overlays \
  --output reference

# Apply fixes
python scripts/fix-reference-docs.py --input reference
```

### Step 6: Verify Integration
- Open reference docs (e.g., `reference/runs.md`, `reference/credentials.md`)
- Verify new examples appear in appropriate sections
- Check formatting consistency
- Ensure no duplication with existing examples

### Step 7: Commit Results
```bash
git add overlays/tw-*-variations.md scripts/analyze-example-coverage.py scripts/generate-example-overlays.py reference/
git commit -m "Add test-derived example variations to reference docs"
```

## Trade-offs and Decisions

### Decision 1: Output Generation
**Question**: Should we generate mock output for test examples?

**Options**:
- **A**: Don't generate output - show commands only
  - Pro: Accurate, no hallucination risk
  - Con: Less useful than examples with output

- **B**: Generate generic output patterns
  - Pro: More complete examples
  - Con: Risk of showing incorrect/outdated output

**Recommendation**: Option A for Phase 1. Test examples show command variations and patterns; existing overlays already have rich output examples. Focus on documenting command syntax variations, not output.

### Decision 2: Deduplication Strategy
**Question**: How aggressive should deduplication be?

**Options**:
- **A**: Strict - exclude any test example similar to overlay example
  - Pro: No redundancy
  - Con: May miss valuable variations

- **B**: Lenient - include test examples with different flags/patterns
  - Pro: More comprehensive coverage
  - Con: Some overlap

**Recommendation**: Option B. A test example like `tw credentials add aws --overwrite ...` adds value even if `tw credentials add aws ...` exists, because it demonstrates the `--overwrite` pattern.

### Decision 3: Organization
**Question**: Where should test-derived examples go?

**Options**:
- **A**: Separate files (`tw-runs-variations.md`)
- **B**: Append to existing overlays
- **C**: Create dedicated "Advanced Examples" or "Additional Patterns" section

**Recommendation**: Option A initially. Easier to review and maintain separation between manually curated and auto-generated content.

## Success Criteria

1. **Coverage report generated** showing current state and gaps
2. **No duplication** - test examples complement existing overlays, don't replace
3. **Quality formatting** - generated examples follow existing overlay patterns
4. **User value** - new examples demonstrate useful patterns (pagination, flags, workspace-scoping)
5. **Maintainability** - clear separation between manual and generated content
6. **Verified integration** - generated docs include new examples without breaking existing content

## Next Steps After Approval

1. Create `analyze-example-coverage.py` script
2. Run coverage analysis and review gaps
3. Create `generate-example-overlays.py` script
4. Generate supplementary overlays for top gaps
5. Manual review and refinement
6. Integrate and verify in reference docs
7. Commit and document the integration approach
