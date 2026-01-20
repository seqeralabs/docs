# API Docs v1.102.0 Overlay Workflow Troubleshooting Progress

## Context

Working on PR for API docs v1.102.0 updates. The workflow `apply-overlays-and-regenerate.yml` is triggered by adding the `overlays-approved` label to a PR. It should:
1. Extract overlay files from `claude-generated-overlays.md`
2. Consolidate them into one overlay file
3. Apply to `seqera-api-latest-decorated.yaml`
4. Validate and regenerate docs

## Branch

`api-docs-v1.102.0`

## Files Involved

- `.github/workflows/apply-overlays-and-regenerate.yml` - Main workflow
- `platform-api-docs/scripts/specs/claude-generated-overlays.md` - Source of truth for overlays
- `platform-api-docs/scripts/specs/base-1.95-to-1.102.0-changes.yaml` - Speakeasy comparison overlay
- `platform-api-docs/scripts/specs/seqera-api-latest-decorated.yaml` - Target spec file
- `.claude/skills/openapi-overlay-generator/SKILL.md` - Skill for generating overlays

## Issues Fixed This Session

### 1. Empty overlay file breaking workflow ✅ FIXED
**Problem**: Workflow failed with "overlay must define at least one action"
**Root cause**: `data-links-schemas-overlay-1.102.0.yaml` had empty actions list (only comments)
**Fix**:
- Removed empty overlay from `claude-generated-overlays.md`
- Updated openapi-overlay-generator skill to NEVER create empty overlay files
- Added rule in both `~/.claude/skills/openapi-overlay-generator/SKILL.md` and `.claude/skills/openapi-overlay-generator/SKILL.md`

### 2. Workflow regex couldn't handle backticks in YAML ✅ FIXED
**Problem**: Extraction regex `[^`]+` stopped at first backtick in overlay content
**Root cause**: Overlay descriptions contain backticks like `` `computeEnvId` `` and `` `false` ``
**Fix**: Changed regex pattern from `[^`]+` to `.*?` with proper boundaries: `r'```(?:yaml|yml)\s*\n(.*?)\n```'`
**Commit**: `33aa7ca5`

### 3. Wrong filename matching in extraction ✅ FIXED
**Problem**: Used `re.search()` which found FIRST match, not closest
**Fix**: Changed to `re.findall()` and take last match (closest to code block)
**Commit**: `33aa7ca5`

### 4. Version detection picking up decorated spec ✅ FIXED
**Problem**: Workflow detected version as "latest-decorated" instead of "1.102.0"
**Root cause**: `ls -t` sorted by modification time, and `seqera-api-latest-decorated.yaml` was most recent
**Impact**: Consolidation looked for `*-overlay-latest-decorated.yaml` files (don't exist), created empty consolidated overlay
**Fix**:
- Only match base spec files: `seqera-api-[0-9]*.yaml`
- Sort by semantic version number instead of modification time
- Extract version from highest numbered spec
**Commit**: `a3f5828f`

### 5. Inconsistent .yaml/.yml handling ✅ FIXED
**Problem**: Some parts of workflow used `.yml`, others used `.yaml`
**Fix**: Updated all files to handle both extensions:
- Workflow: All steps now check for both `.yaml` and `.yml`
- `extract-api-tables.mjs`: Checks for both extensions
- `docusaurus.config.js`: Updated to use `.yaml` (current file extension)
- Cleanup step: Now sorts by version, handles both extensions
**Commit**: `a3f5828f`

### 6. Validation too verbose, exceeded log size ✅ FIXED
**Problem**: Speakeasy validation output 1262KB of INFO hints about missing examples, exceeded 1024KB GitHub limit
**Fix**:
- Capture output to file instead of dumping to logs
- Count errors/warnings/hints separately
- Only fail on actual ERROR-level issues
- Continue if only hints/warnings
**Commit**: `72febe35`

### 7. Added debugging and artifact upload ✅ FIXED
**Problem**: Hard to diagnose failures in CI
**Fix**:
- List extracted overlay files before consolidation
- Show first 30 lines of consolidated overlay
- Count action items
- Upload all overlay files as artifacts on failure (7 day retention)
**Commits**: `c0516714`, `a3f5828f`

## Current Issue ⚠️ IN PROGRESS

### Validation errors on applied spec

**Status**: After applying overlays, validation shows 4 ERROR-level issues:

```
ERROR: [line 1456] path-params - parameter path must be used in path /data-links/{dataLinkId}/browse
ERROR: [line 1706] path-params - parameter filePath must be used in path /data-links/{dataLinkId}/download
ERROR: [line 1884] path-params - parameter dirPath must be used in path /data-links/{dataLinkId}/upload
ERROR: [line 1950] path-params - parameter dirPath must be used in path /data-links/{dataLinkId}/upload/finish
```

**Root Cause Discovery**:
- The `base-1.95-to-1.102.0-changes.yaml` file contains `remove: true` actions that delete the entire parameters array before replacing it
- The `claude-generated-overlays.md` file (generated from the comparison overlay by the skill) only contains description updates
- It does NOT include the parameter removal/replacement actions
- Therefore: overlays are ADDING descriptions to existing (bad) parameters, not REPLACING the parameter array

**Example from base-1.95-to-1.102.0-changes.yaml**:
```yaml
- target: $["paths"]["/data-links/{dataLinkId}/browse"]["get"]["parameters"][*]
  remove: true
- target: $["paths"]["/data-links/{dataLinkId}/browse"]["get"]["parameters"]
  update:
    - name: dataLinkId
      in: path
      description: Data-link string identifier
      required: true
      schema:
        type: string
    # ... more params
```

**Example from data-links-parameters-overlay-1.102.0.yaml** (extracted from claude-generated-overlays.md):
```yaml
- target: "$.paths./data-links/{dataLinkId}/browse.get.parameters[?(@.name=='dataLinkId')].description"
  update: "Data-link string identifier."
# Only description updates, NO removal action
```

**What's Wrong**:
The openapi-overlay-generator skill is not including the parameter array removal/replacement actions when generating overlays from the comparison file. It's only extracting description changes.

**What Should Happen**:
When the skill sees a `remove: true` + full parameter array replacement in the comparison overlay, it should:
1. First remove the entire parameters array
2. Then add the new array with enriched descriptions

**Note from User**:
> "If memory serves, we even added lines to the SKILL.md telling Claude that it's crucial to remove an array of params before updating it, so as not to duplicate additively"

## Next Steps

1. Check if the openapi-overlay-generator SKILL.md has instructions about parameter array removal
2. If not, add explicit instructions about handling `remove: true` + array replacement patterns
3. Regenerate `claude-generated-overlays.md` using the skill to include removal actions
4. Test locally with consolidated overlay including removals
5. Commit updated overlays
6. Re-run workflow

## Workflow Invocation

The workflow can be triggered via `workflow_dispatch`:
1. Go to GitHub Actions → "Apply Overlays and Regenerate Docs"
2. Click "Run workflow"
3. **Select branch**: `api-docs-v1.102.0` (important! uses workflow from this branch)
4. Enter PR number
5. Click "Run workflow"

## Local Testing Commands

```bash
cd /Users/llewelyn-van-der-berg/Documents/GitHub/docs/platform-api-docs/scripts/specs

# Extract overlays from markdown
python3 - <<'PYTHON_SCRIPT'
import re
from pathlib import Path

md_file = Path("claude-generated-overlays.md")
content = md_file.read_text()

pattern = r'```(?:yaml|yml)\s*\n(.*?)\n```'
filename_pattern = r'(?:^|\n)(?:#+\s*)?(?:\*\*)?([a-zA-Z0-9_-]+-overlay-[0-9.]+\.ya?ml)(?:\*\*)?'

blocks = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
extracted_count = 0
current_pos = 0

for block in blocks:
    yaml_content = block.group(1).strip()
    text_before = content[current_pos:block.start()]
    filename_matches = re.findall(filename_pattern, text_before, re.MULTILINE | re.IGNORECASE)

    if filename_matches:
        filename = filename_matches[-1]
        filename = re.sub(r'\.yml$', '.yaml', filename)
        Path(filename).write_text(yaml_content + '\n')
        print(f"✅ Extracted: {filename}")
        extracted_count += 1
    current_pos = block.end()

print(f"\n✅ Successfully extracted {extracted_count} overlay file(s)")
PYTHON_SCRIPT

# Consolidate overlays
cat > all-changes-overlay-1.102.0.yaml <<'EOF'
overlay: 1.0.0
info:
  title: Consolidated overlay for v1.102.0
  version: 0.0.0
actions:
EOF

echo "  # ===== VERSION 1.102.0 OVERLAYS =====" >> all-changes-overlay-1.102.0.yaml

for overlay in *-overlay-1.102.0.yaml; do
  if [ -f "$overlay" ] && [ "$overlay" != "all-changes-overlay-1.102.0.yaml" ]; then
    echo "Adding $overlay"
    sed -n '/^actions:/,$ p' "$overlay" | tail -n +2 >> all-changes-overlay-1.102.0.yaml
  fi
done

# Apply overlay
speakeasy overlay apply \
  -s seqera-api-latest-decorated.yaml \
  -o all-changes-overlay-1.102.0.yaml \
  > seqera-api-latest-decorated-new-test.yaml

# Validate
speakeasy validate openapi -s seqera-api-latest-decorated-new-test.yaml > validation-output.txt 2>&1

ERROR_COUNT=$(grep -c "ERROR" validation-output.txt 2>/dev/null || echo "0")
echo "Errors: $ERROR_COUNT"

if [ "$ERROR_COUNT" -gt 0 ]; then
  grep "ERROR" validation-output.txt | head -20
fi
```

## Key Commits

- `33aa7ca5` - Fix overlay extraction regex to handle backticks
- `c6062bb2` - Update openapi-overlay-generator skill and remove empty overlay
- `a3f5828f` - Support both .yaml and .yml extensions throughout entire workflow
- `72febe35` - Make validation less verbose and more lenient
- `c0516714` - Add debugging output and artifact upload on failure

## Skills Updated

Both copies of the openapi-overlay-generator skill were updated:
- `~/.claude/skills/openapi-overlay-generator/SKILL.md`
- `.claude/skills/openapi-overlay-generator/SKILL.md` (in repo)

Added critical rules:
- NEVER create overlay files with empty actions lists
- Empty overlays break workflow automation
