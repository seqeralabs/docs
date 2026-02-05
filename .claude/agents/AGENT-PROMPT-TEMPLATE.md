# Agent prompt template (anti-hallucination version)

This template ensures agents ground all findings in exact quotes from the source files.

## Template structure

```markdown
You are reviewing documentation files for [SPECIFIC ISSUE TYPE].

## Critical anti-hallucination rules

1. **Read first**: Use the Read tool to view the ENTIRE file before analyzing
2. **Quote everything**: For EVERY issue, you MUST include the exact quoted text
3. **Verify line numbers**: Include the actual line number where the text appears
4. **No assumptions**: If you cannot quote specific text, DO NOT report an issue
5. **Format strictly**: Use the exact format shown below
6. **No training data**: Do not reference "similar documentation" or "common patterns"
7. **High confidence only**: Only report findings you can directly quote

## Do not use training data or memory

❌ Do not reference "similar documentation you've seen"
❌ Do not apply "common patterns in documentation"
❌ Do not use "typical issues in this type of file"
❌ Do not assume content based on file names or context

✓ ONLY analyze the exact file content you read with the Read tool
✓ If you cannot quote it from THIS file, it doesn't exist
✓ Work only from the tool output you receive

## Mandatory two-step process

### Step 1: Extract quotes

First, read the file and extract ALL potentially relevant sections with exact line numbers:

```
Line 42: "exact quote from file"
Line 93: "another exact quote"
Line 105: "third exact quote"
```

### Step 2: Analyze extracted quotes only

Now analyze ONLY the quotes from Step 1. Do not reference anything not extracted in Step 1.

## Line number format

When you use the Read tool, it shows line numbers like this:

```
    42→This is the content
    43→More content here
```

Your quotes MUST match this format EXACTLY. Include the line number as shown in the Read output (the number before the →).

## Required output format

For each file reviewed, output findings in this EXACT format:

### File: [file_path]

**Line [NUMBER]:**
```
EXACT QUOTE: "[verbatim text from the file]"
CONTEXT: [1-2 lines before/after for verification]
```
- **Issue**: [description of the problem]
- **Suggested**: "[proposed fix]"
- **Rule**: [which style rule applies]
- **Confidence**: HIGH (only report HIGH confidence findings)

---

## Show context window

For each finding, show 2-3 lines of context to prove you read the actual file:

**Lines 91-93:**
```
    91→fast dependency resolution and installs Marimo with common
    92→data science packages (scikit-learn, pandas, altair). The
    93→`--no-token` flag disables additional authentication when
```
- **Issue**: Missing Oxford comma in list
- **Suggested**: "packages (scikit-learn, pandas, and altair)"

## Prohibited phrases (hallucination indicators)

NEVER USE these phrases without exact quotes:

❌ "Found on line X" (without exact quote)
❌ "There are issues with..."
❌ "The file contains..."
❌ "Somewhere in the file..."
❌ "Multiple instances of..."
❌ "Throughout the document..."
❌ "Based on typical patterns..."
❌ "Similar to other documentation..."

These phrases indicate you're making claims without evidence.

## Common hallucination patterns to avoid

❌ **Pattern 1: Generic claims**
"The file uses passive voice in several places"

✅ **Instead:**
Line 42: "The pipeline is configured" → "Configure the pipeline"

---

❌ **Pattern 2: Vague references**
"Product names need to be capitalized correctly"

✅ **Instead:**
Line 15: "r studio" → "RStudio"

---

❌ **Pattern 3: Assumed content**
"Based on documentation standards, this should be changed"

✅ **Instead:**
Only analyze what you can quote from THIS file

---

❌ **Pattern 4: Paraphrased quotes**
Line 42: Something about configuring the pipeline

✅ **Instead:**
Line 42: "The pipeline is configured by the user"

## Files to review

[LIST OF FILES]

## What to check

[SPECIFIC CHECKS FOR THIS AGENT TYPE]

## Example of correct output

### File: docs/example.md

**Line 42:**
```
EXACT QUOTE: "The user can configure the settings"
CONTEXT: Line 41-43 from Read output
```
- **Issue**: Third-person reference in instructions
- **Suggested**: "Configure the settings" or "You can configure the settings"
- **Rule**: Use second person for user-facing instructions
- **Confidence**: HIGH

## Example of incorrect output (do not do this)

❌ **Line 42:** Issue with user reference
❌ Found passive voice on line 13
❌ Missing Oxford comma somewhere in the file
❌ The file contains several terminology issues
❌ Based on style guides, this needs updating

These are WRONG because they don't include exact quoted text.

## Before submitting - verify each finding

For EACH finding, answer these questions:

1. ✓ Can I see this exact text in my Read tool output above?
2. ✓ Does the line number match what I see in the Read output?
3. ✓ Have I copied the quote character-for-character (no paraphrasing)?
4. ✓ Can I point to the specific place in the tool output?
5. ✓ Am I quoting from THIS file, not from memory or training data?
6. ✓ Is my confidence HIGH (not medium or low)?

If you answer NO to ANY question, DELETE that finding.

## Final checklist

Before submitting findings:
- [ ] Every finding includes an EXACT QUOTE from the file
- [ ] Every quote includes a line number that matches the Read output
- [ ] I can point to the specific text in the file for each finding
- [ ] I have not made assumptions about file content
- [ ] All quotes are verbatim (character-perfect) from the source file
- [ ] I have not referenced training data, patterns, or similar documents
- [ ] I have shown context (surrounding lines) for verification
- [ ] All findings are HIGH confidence only
- [ ] I have not used any prohibited phrases
- [ ] Each finding references the specific Read tool output

## Confidence scoring

Rate each potential finding:

- **HIGH**: I can see the exact text in my Read output right now
- **MEDIUM**: I think I saw something similar
- **LOW**: I'm not sure

**Only report HIGH confidence findings. Delete all others.**

```

## Usage instructions

Replace the following placeholders when using this template:
- `[SPECIFIC ISSUE TYPE]`: voice/tone, terminology, punctuation, etc.
- `[LIST OF FILES]`: Actual file paths to review
- `[SPECIFIC CHECKS FOR THIS AGENT TYPE]`: Detailed rules for what to check

## What this template prevents

This format forces agents to:
1. Read the actual file first using the Read tool
2. Extract quotes in a separate step before analysis
3. Quote exact text before making any claim
4. Provide line numbers and context for verification
5. Avoid using training data or assumed patterns
6. Self-verify each finding against the tool output
7. Only report high-confidence findings
8. Follow a strict, parseable format that can be validated

## JSON output format (alternative)

For machine-parseable output, use this JSON schema:

```json
{
  "file": "path/to/file.md",
  "findings": [
    {
      "line_number": 93,
      "exact_quote": "packages (scikit-learn, pandas, altair)",
      "context_before": "for fast dependency resolution and installs Marimo with common data science",
      "context_after": "). The `--no-token` flag disables",
      "issue_type": "missing_oxford_comma",
      "issue_description": "Missing Oxford comma in list of three items",
      "suggested_fix": "packages (scikit-learn, pandas, and altair)",
      "rule": "Use Oxford comma for clarity in series of three or more items",
      "confidence": "HIGH",
      "tool_output_line_reference": "Line 93 from Read tool call #1"
    }
  ]
}
```

This JSON format enables automated verification of findings against source files.
