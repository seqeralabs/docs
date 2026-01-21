# Enhanced Sidebar Update Script (v2)

## Overview

The `update_sidebar_v2.py` script extends the original `update_sidebar.py` with **rename detection** capabilities. This helps catch when OpenAPI documentation generators change their naming conventions for operation IDs.

## Problem It Solves

When regenerating API docs, sometimes operation IDs get renamed due to:
- Generator version updates
- Changes in naming conventions (e.g., `-1` suffix → `-with-path` suffix)
- Path parameter handling changes

The original script only **adds new entries** but doesn't detect when existing entries have been renamed, leading to broken sidebar links.

## Features

### 1. Validation Mode (`--validate`)
Checks all sidebar doc IDs against generated `.api.mdx` files and reports missing entries:

```bash
python update_sidebar_v2.py sidebar.js analysis.json --validate
```

**Output:**
```
🔍 Validating existing sidebar entries...

✅ Found 180/183 valid doc IDs

⚠️  MISSING DOC IDs (3):

  • explore-data-link-1
    → Suggestion: explore-data-link-with-path (90% match - Pattern: '-1' → '-with-path')

  • generate-data-link-upload-url-1
    → Suggestion: generate-data-link-upload-url-with-path (90% match - Pattern: '-1' → '-with-path')

  • finish-data-link-upload-1
    → Suggestion: finish-data-link-upload-with-path (90% match - Pattern: '-1' → '-with-path')

💡 Run with --auto-fix-renames to apply high-confidence renames automatically.
```

### 2. Auto-Fix Mode (`--auto-fix-renames`)
Automatically applies high-confidence renames (≥80% similarity):

```bash
python update_sidebar_v2.py sidebar.js analysis.json --auto-fix-renames
```

**Output:**
```
🔧 Applying 3 renames...

  ✓ explore-data-link-1 → explore-data-link-with-path
  ✓ generate-data-link-upload-url-1 → generate-data-link-upload-url-with-path
  ✓ finish-data-link-upload-1 → finish-data-link-upload-with-path

✅ Updated sidebar: platform-api-docs/docs/sidebar/sidebar.js
```

### 3. Rename Detection Algorithm

The script uses multiple strategies to find renames:

#### A. Pattern Detection (Highest Priority)
- `-1` suffix → `-with-path` suffix
- `-2` suffix → `-with-path` suffix
- Common prefixes with different suffixes

#### B. Fuzzy Matching
- Uses `difflib.SequenceMatcher` for similarity scoring
- Threshold: 60% similarity minimum
- Boosted scores for detected patterns

#### C. Multiple Suggestions
- Shows top 3 matches for each missing ID
- Includes similarity percentage and reason

## Usage Examples

### Basic Usage (Add New Entries Only)
```bash
python update_sidebar_v2.py sidebar.js analysis.json
```
Works exactly like the original script - no validation or rename detection.

### Validation Only
```bash
python update_sidebar_v2.py sidebar.js analysis.json --validate
```
Checks for missing IDs and suggests renames, but doesn't modify the file.

### Auto-Fix Renames
```bash
python update_sidebar_v2.py sidebar.js analysis.json --auto-fix-renames
```
Automatically applies high-confidence renames (≥80% match).

### Custom Docs Directory
```bash
python update_sidebar_v2.py sidebar.js analysis.json --validate --docs-dir=/path/to/docs
```

## Integration with Workflow

Update the workflow to use the enhanced script with validation:

```yaml
- name: Update sidebar with new operations
  run: |
    cd platform-api-docs/scripts/specs

    ANALYSIS_FILE=$(ls -t *-analysis.json 2>/dev/null | head -n 1)

    if [ -n "$ANALYSIS_FILE" ]; then
      python ../../../.claude/skills/openapi-overlay-generator/scripts/update_sidebar_v2.py \
        ../../docs/sidebar/sidebar.js \
        "$ANALYSIS_FILE" \
        --validate \
        --auto-fix-renames

      echo "✅ Updated sidebar with validation and auto-fix"
    else
      echo "⚠️  No analysis file found - sidebar not updated"
    fi
```

## Safety Features

1. **Backup Creation**: Always creates `.js.backup` before modifying
2. **High Confidence Threshold**: Only auto-fixes renames ≥80% similarity
3. **Manual Review Option**: Use `--validate` without `--auto-fix-renames` to review first
4. **Info Pages Excluded**: Skips validation for `info/*` pages (manually maintained)

## Common Rename Patterns

### Pattern 1: Numbered Suffixes → Descriptive Suffixes
```
explore-data-link-1        → explore-data-link-with-path
generate-upload-url-1      → generate-upload-url-with-path
finish-upload-1            → finish-upload-with-path
```

**Why**: OpenAPI generator changed from numeric suffixes to descriptive ones.

### Pattern 2: CamelCase → kebab-case
```
CreateWorkflow             → create-workflow
ListComputeEnvs           → list-compute-envs
```

**Why**: Generator convention changed.

### Pattern 3: Path Parameter Changes
```
browse-data-link           → browse-data-link-by-id
get-compute-env            → get-compute-env-details
```

**Why**: Generator became more explicit about path parameters.

## Comparison with Original Script

| Feature | `update_sidebar.py` | `update_sidebar_v2.py` |
|---------|-------------------|----------------------|
| Add new endpoints | ✅ | ✅ |
| Validate existing entries | ❌ | ✅ |
| Detect renames | ❌ | ✅ |
| Suggest replacements | ❌ | ✅ |
| Auto-fix renames | ❌ | ✅ |
| Pattern detection | ❌ | ✅ |
| Fuzzy matching | ❌ | ✅ |
| Backup creation | ✅ | ✅ |
| CLI options | Basic | Enhanced |

## Future Enhancements

### Planned Features
1. **Interactive mode**: Prompt user to confirm each rename
2. **Pattern learning**: Track and remember common rename patterns
3. **Batch rename history**: Log all applied renames for audit trail
4. **Confidence explanation**: Detailed breakdown of why a match was suggested
5. **Test mode**: Dry-run that shows changes without applying them

### Potential Improvements
- Support for more complex sidebar structures (nested categories)
- Integration with git diff to show what changed
- Webhook notification for manual review required
- JSON output mode for CI/CD integration

## Migration Guide

### From Original Script

1. **No changes required**: The v2 script is backwards compatible
2. **Test first**: Run with `--validate` to see what would change
3. **Apply fixes**: Use `--auto-fix-renames` when confident
4. **Update workflow**: Replace script path in workflow file

### Rollback

If you need to rollback:
1. Use the `.js.backup` file created automatically
2. Or switch back to `update_sidebar.py` (original script)

## Troubleshooting

### "No suggestions found"
- The doc might be genuinely removed (check OpenAPI spec)
- Try adjusting the similarity threshold in the code
- Manually add the entry if it's a new naming pattern

### "Multiple suggestions with similar scores"
- Review the suggestions manually
- Use `--validate` without `--auto-fix-renames` first
- Check the actual `.api.mdx` files to confirm

### "Category not found in sidebar"
- The API has a new tag/category
- Manually add the category to `sidebar.js`
- Update `map_tag_to_category()` function

## Contributing

To add support for new rename patterns:

1. Edit `detect_rename_patterns()` function
2. Add new pattern detection logic
3. Test with sample data
4. Update this README with the new pattern

Example:
```python
# Pattern: "v2" suffix added
if not missing_id.endswith('-v-2') and doc_id == missing_id + '-v-2':
    reason = "Pattern: added '-v-2' suffix"
    bonus = 0.2
```

## Questions?

For issues or questions:
1. Check the console output for detailed error messages
2. Review the `.js.backup` file to see what changed
3. Run with `--validate` first to preview changes
4. Open an issue in the docs repo
