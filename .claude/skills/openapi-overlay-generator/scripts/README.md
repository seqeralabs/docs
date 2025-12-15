# Scripts Directory

This directory contains automation scripts for the OpenAPI overlay generation workflow.

## Python Scripts

### analyze_comparison.py

**Purpose**: Analyzes a Speakeasy comparison overlay to categorize and summarize API changes.

**Usage**:
```bash
python scripts/analyze_comparison.py <comparison-overlay.yaml>
```

**Outputs**:
- Console report with human-readable summary
- JSON file: `{filename}-analysis.json` for programmatic use

**What it does**:
- Identifies new endpoints by tag/controller
- Categorizes new vs modified schemas
- Detects changes requiring documentation
- Flags new categories needing manual sidebar intervention

---

### validate_overlay.py

**Purpose**: Validates overlay file structure and JSONPath syntax.

**Usage**:
```bash
python scripts/validate_overlay.py <overlay-file.yaml>
```

**Exit codes**:
- `0`: Validation passed
- `1`: Validation failed (errors found)

**Checks**:
- YAML syntax correctness
- Required overlay fields (overlay, info, actions)
- JSONPath syntax validity
- Action structure completeness

---

### check_consistency.py

**Purpose**: Verifies overlay content against Seqera documentation standards.

**Usage**:
```bash
python scripts/check_consistency.py <overlay-file.yaml>
```

**Exit codes**:
- `0`: All checks passed
- `1`: Consistency issues found

**Checks**:
- Standard parameter descriptions (workspaceId, max, offset, etc.)
- Deprecated terminology (data-link vs datalink)
- Sentence formatting (capitalization, periods)
- Verb-entity pattern for summaries

---

### update_sidebar.py

**Purpose**: Automatically adds new operation entries to the custom sidebar.js file.

**Usage**:
```bash
python scripts/update_sidebar.py <sidebar.js> <analysis.json>
```

**What it does**:
- Parses existing sidebar structure
- Maps new endpoints to sidebar categories by tag
- Generates properly formatted sidebar entries
- Creates backup before modifying
- Reports entries requiring manual intervention

**Output**:
- Updated sidebar.js with new operations
- Backup file: sidebar.js.backup
- Console report of changes made

---

## Workflow Integration

These scripts integrate into the automation workflow as follows:

```
1. Comparison overlay generated
   ↓
2. analyze_comparison.py
   → Identifies changes
   → Generates analysis.json
   ↓
3. Claude generates overlay files
   ↓
4. validate_overlay.py + check_consistency.py
   → Verify quality
   ↓
5. Human review + engineering approval
   ↓
6. Overlays consolidated + permanent overlays added
   ↓
7. Apply to decorated spec
   ↓
8. extract-api-tables.mjs
   → Update info page tables
   ↓
9. Docusaurus gen-api-docs
   → Generate MDX files
   ↓
10. update_sidebar.py
    → Add new entries to sidebar
```

---

## Dependencies

### Python Scripts
- PyYAML: `pip install pyyaml`
- Python 3.7+

### JavaScript Scripts
- Node.js 16+
- Dependencies in platform-api-docs:
  - yaml
  - (others from package.json)

---

## Development Notes

### Adding New Validation Rules

To add new validation rules to `check_consistency.py`:

1. Create a new check function:
   ```python
   def check_new_rule(overlay_path: Path) -> List[Tuple[str, str]]:
       issues = []
       # Your validation logic
       return issues
   ```

2. Add to the checks list in `main()`:
   ```python
   checks = [
       # ...existing checks...
       ("New Rule Name", check_new_rule),
   ]
   ```

### Extending Sidebar Mapping

To add new tag-to-category mappings in `update_sidebar.py`:

Edit the `tag_to_category` dictionary in `map_tag_to_category()`:
```python
tag_to_category = {
    'existing-tag': 'Existing Category',
    'new-tag': 'New Category',  # Add here
}
```

---

## Troubleshooting

### validate_overlay.py fails with JSONPath errors

**Cause**: Invalid target paths in overlay

**Solution**: Check that:
- Paths start with `$.`
- Bracket syntax is balanced: `[` matches `]`
- Filter expressions use correct syntax: `[?(@.name=='value')]`

### check_consistency.py reports parameter mismatch

**Cause**: Parameter description doesn't match standard

**Solution**: Copy the exact standard description from `references/standards.md`

### update_sidebar.py can't find category

**Cause**: New controller/tag not mapped to existing sidebar category

**Solution**: Either:
1. Add mapping in `map_tag_to_category()` function
2. Manually create new category in sidebar.js

### extract-api-tables.mjs can't find spec

**Cause**: Decorated spec not at expected location

**Solution**: Ensure `scripts/specs/seqera-api-latest-decorated.yaml` exists
