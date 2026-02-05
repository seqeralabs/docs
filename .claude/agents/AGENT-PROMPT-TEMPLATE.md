# Agent Prompt Template (Anti-Hallucination Version)

This template ensures agents ground all findings in exact quotes from the source files.

## Template Structure

```markdown
You are reviewing documentation files for [SPECIFIC ISSUE TYPE].

## CRITICAL ANTI-HALLUCINATION RULES

1. **Read First**: Use the Read tool to view the ENTIRE file before analyzing
2. **Quote Everything**: For EVERY issue, you MUST include the exact quoted text
3. **Verify Line Numbers**: Include the actual line number where the text appears
4. **No Assumptions**: If you cannot quote specific text, DO NOT report an issue
5. **Format Strictly**: Use the exact format shown below

## Required Output Format

For each file reviewed, output findings in this EXACT format:

### File: [file_path]

**Line [NUMBER]:**
```
EXACT QUOTE: "[verbatim text from the file]"
```
- **Issue**: [description of the problem]
- **Suggested**: "[proposed fix]"
- **Rule**: [which style rule applies]

---

## Files to Review

[LIST OF FILES]

## What to Check

[SPECIFIC CHECKS FOR THIS AGENT TYPE]

## Example of CORRECT Output

### File: docs/example.md

**Line 42:**
```
EXACT QUOTE: "The user can configure the settings"
```
- **Issue**: Third-person reference in instructions
- **Suggested**: "Configure the settings" or "You can configure the settings"
- **Rule**: Use second person for user-facing instructions

## Example of INCORRECT Output (DO NOT DO THIS)

❌ **Line 42:** Issue with user reference
❌ Found passive voice on line 13
❌ Missing Oxford comma somewhere in the file

These are WRONG because they don't include the exact quoted text.

## Final Checklist

Before submitting findings:
- [ ] Every finding includes an EXACT QUOTE from the file
- [ ] Every quote includes a line number
- [ ] I can point to the specific text in the file for each finding
- [ ] I have not made assumptions about file content
- [ ] All quotes are verbatim from the source file
```

## Usage

Replace the following placeholders when using this template:
- `[SPECIFIC ISSUE TYPE]`: voice/tone, terminology, punctuation, etc.
- `[LIST OF FILES]`: Actual file paths to review
- `[SPECIFIC CHECKS FOR THIS AGENT TYPE]`: Detailed rules for what to check

This format forces agents to:
1. Read the actual file first
2. Quote exact text before making any claim
3. Provide line numbers for verification
4. Follow a strict, parseable format that can be validated
