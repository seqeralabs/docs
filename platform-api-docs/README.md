# Platform API Documentation

Automated workflow for maintaining Seqera Platform API documentation using Claude Skills, GitHub Actions, and Speakeasy overlays.

## 🎯 Overview

This documentation system uses a multi-phase automation approach to keep API docs in sync with Platform backend changes. **This branch implements Phase 2** of the automation system (overlay generation). Phase 3 (applying overlays and regenerating docs) will be added in a future PR.

### Automation Phases

```
┌─────────────────────────────────────┐
│ Phase 1: Platform Repo (Future)    │
│ Detects API spec changes            │
│ Triggers docs repo workflow         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Phase 2: Generate Overlays (✅)     │
│ - Copies flattened base spec        │
│ - Runs Speakeasy comparison         │
│ - Analyzes changes                  │
│ - Calls Claude API with skill       │
│ - Creates draft PR for review       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Phase 3: Apply Overlays (Future)    │
│ - Consolidates overlays             │
│ - Applies to decorated spec         │
│ - Regenerates MDX docs              │
│ - Updates sidebar                   │
└─────────────────────────────────────┘
```

## 🚀 Current Workflow (Phase 2)

### Prerequisites

- **Speakeasy CLI**: For overlay comparison and application
- **Node.js/npm**: For Docusaurus commands
- **GitHub Actions**: Automated workflow execution
- **Claude Skill**: OpenAPI overlay generator (in `.claude/skills/`)

### Automated Overlay Generation

The `generate-openapi-overlays.yml` workflow automates the initial documentation work:

#### Workflow Trigger

**Manual trigger** (via GitHub Actions UI):
1. Go to Actions → "Generate API Documentation Overlays"
2. Click "Run workflow"
3. Enter the API version (e.g., `1.95`)
4. The workflow will create a draft PR with generated overlay files

**Future**: Will be triggered automatically by Platform repo changes.

#### What the Workflow Does

1. **Copies flattened base spec** from Platform repo:
   ```bash
   platform-repo/tower-backend/src/main/resources/META-INF/openapi/seqera-api-latest-flattened.yml
   ```

2. **Finds previous version** (handles both `.yml` and `.yaml` extensions)

3. **Generates comparison overlay** using Speakeasy:
   ```bash
   speakeasy overlay compare -b <previous> -a <new> > comparison.yaml
   ```

4. **Analyzes changes** using Python script:
   ```bash
   python3 .claude/skills/openapi-overlay-generator/scripts/analyze_comparison.py
   ```

5. **Generates overlay files** using Claude API with the skill context:
   - Reads standards from `.claude/skills/openapi-overlay-generator/references/standards.md`
   - Reads patterns from `.claude/skills/openapi-overlay-generator/references/overlay-patterns.md`
   - Generates operations, parameters, and schemas overlays
   - Follows documentation standards automatically

6. **Creates draft PR** with all generated files for review

### Claude Skill Integration

The workflow uses the **openapi-overlay-generator** skill located at `.claude/skills/openapi-overlay-generator/`:

**Skill Contents**:
- `SKILL.md`: Core workflow and instructions
- `references/standards.md`: Complete documentation style guide
- `references/overlay-patterns.md`: Templates and examples
- `scripts/analyze_comparison.py`: Change analysis automation
- `scripts/validate_overlay.py`: Overlay validation
- `scripts/check_consistency.py`: Standards compliance checking
- `scripts/healthcheck-overlay.yaml`: Permanent overlay for /service-info

**How It's Used**:
1. Workflow calls `analyze_comparison.py` to categorize changes
2. Workflow reads `standards.md` and `overlay-patterns.md` into Claude's context
3. Claude API generates overlay files following the standards
4. Human reviews and refines the generated overlays
5. Engineering team validates technical accuracy

### Human Review Process

After the workflow creates a draft PR:

1. **Review Claude-generated overlays** in `claude-generated-overlays.md`
2. **Extract overlay files** from markdown into separate YAML files:
   - `{feature}-operations-overlay-{version}.yaml`
   - `{feature}-parameters-overlay-{version}.yaml`
   - `{feature}-schemas-overlay-{version}.yaml`
3. **Edit overlays** for accuracy and completeness
4. **Run validation**:
   ```bash
   python3 .claude/skills/openapi-overlay-generator/scripts/validate_overlay.py <file>
   python3 .claude/skills/openapi-overlay-generator/scripts/check_consistency.py <file>
   ```
5. **Request engineering review** from appropriate team
6. **Once approved**, Phase 3 workflow will handle application (coming in future PR)

## 📁 File Organization

### Specs Directory (`platform-api-docs/scripts/specs/`)

**Base specs** (version-specific):
- `seqera-api-{version}.yaml` (e.g., `seqera-api-1.95.yaml`)
- Keep only the latest 2 versions

**Decorated spec** (consistent filename for Docusaurus):
- `seqera-api-latest-decorated.yml`

**Permanent overlays** (not archived):
- `servers-overlay.yaml`: Adds API server URLs
- `healthcheck-overlay.yaml`: Fixes /service-info endpoint

**Generated overlays** (version-specific):
- `base-{old}-to-{new}-changes.yaml`: Speakeasy comparison output
- `{feature}-operations-overlay-{version}.yaml`
- `{feature}-parameters-overlay-{version}.yaml`
- `{feature}-schemas-overlay-{version}.yaml`

**Archives** (`overlays_archive/`):
- Old overlays after they're applied

## 📋 Documentation Standards

The Claude skill enforces these standards automatically:

### Format Rules

- ✅ **Summaries**: Sentence case, no period (e.g., "List datasets")
- ✅ **Descriptions**: Full sentences with periods
- ✅ **Defaults**: In backticks (e.g., "Default: `0`.")
- ✅ **Standard parameters**: Consistent descriptions across all endpoints

### Terminology

- **data-links** (not "datalinks" or "data links")
- **resource path** (not "bucket path" or "URI")
- **Array of** (not "List of")
- **Workspace numeric identifier** (consistent phrasing)

### Common Parameter Descriptions

| Parameter | Standard Description |
|-----------|---------------------|
| `workspaceId` | Workspace numeric identifier. |
| `max` | Maximum number of results to return. Default: `{value}`. |
| `offset` | Number of results to skip for pagination. Default: `0`. |
| `search` | Free-text search filter to match against {field names}. |

See `.claude/skills/openapi-overlay-generator/references/standards.md` for complete guide.

## 🛠 Local Development with Claude Code

With Claude Code and the skill available:

```bash
# Analyze changes
/openapi-overlay-generator "Analyze the comparison overlay"

# Generate overlays
/openapi-overlay-generator "Generate overlay files for version 1.95"

# Validate overlays
/openapi-overlay-generator "Validate all overlay files"
```

The skill provides context-aware assistance for all API documentation tasks.

## 🔄 Manual Workflow (Fallback)

If automation is unavailable, follow the manual process:

### 1. Get Base Spec from Platform Repo

```bash
# Copy flattened spec from Platform repo
cp platform-repo/tower-backend/src/main/resources/META-INF/openapi/seqera-api-latest-flattened.yml \
   platform-api-docs/scripts/specs/seqera-api-{version}.yaml
```

### 2. Generate Comparison

```bash
cd platform-api-docs/scripts/specs

speakeasy overlay compare \
  -b seqera-api-{old-version}.yaml \
  -a seqera-api-{new-version}.yaml \
  > base-{old}-to-{new}-changes.yaml
```

### 3. Analyze and Generate Overlays

```bash
# Analyze changes
python3 ../../.claude/skills/openapi-overlay-generator/scripts/analyze_comparison.py \
  base-{old}-to-{new}-changes.yaml

# Review analysis.json output
# Create overlay files manually or with Claude assistance
```

### 4. Validate Overlays

```bash
python3 ../../.claude/skills/openapi-overlay-generator/scripts/validate_overlay.py \
  {feature}-operations-overlay-{version}.yaml
```

### 5. Consolidate and Apply

```bash
# Manually consolidate all overlay files into:
# all-changes-overlay-{version}.yaml

# Apply consolidated overlay
speakeasy overlay apply \
  -s seqera-api-latest-decorated.yml \
  -o all-changes-overlay-{version}.yaml \
  > seqera-api-latest-decorated-new.yml

# Replace old decorated spec
mv seqera-api-latest-decorated-new.yml seqera-api-latest-decorated.yml
```

### 6. Validate Output

```bash
speakeasy validate openapi -s seqera-api-latest-decorated.yml
```

### 7. Regenerate Documentation

```bash
cd ../..

# Clean and regenerate API docs
npx docusaurus clean-api-docs all
npx docusaurus gen-api-docs all
```

### 8. Update Sidebar (Future)

The `update_sidebar.py` script will be included in Phase 3:

```bash
python3 .claude/skills/openapi-overlay-generator/scripts/update_sidebar.py \
  platform-api-docs/docs/sidebar/sidebar.js \
  platform-api-docs/scripts/specs/analysis.json
```

### 9. Clean Up

```bash
cd platform-api-docs/scripts/specs

# Move overlays to archive
mv *-overlay-{version}.yaml overlays_archive/

# Delete old base spec (keep latest 2)
rm seqera-api-{old-version}.yaml
```

## 🐛 Troubleshooting

### Workflow Fails

**Missing secrets**: Verify GitHub secrets are set:
- `PLATFORM_REPO_PAT`: Read access to Platform repo
- `ENG_ANTHROPIC_API_KEY`: Claude API access

**Workflow not triggering**: See docs about GitHub Actions workflow recognition issues.

### Claude API Call Fails

**Rate limits**: Check Anthropic API quota and status.

**Invalid context**: Ensure skill files exist in `.claude/skills/openapi-overlay-generator/`.

### Overlay Application Errors

**JSONPath issues**: Verify target paths exist in base spec.

**YAML syntax**: Check indentation and quotes in overlay files.

### Validation Failures

Run validation scripts for detailed error messages:

```bash
python3 .claude/skills/openapi-overlay-generator/scripts/validate_overlay.py <file>
python3 .claude/skills/openapi-overlay-generator/scripts/check_consistency.py <file>
```

## 📚 Resources

### Full Automation System

See **README-AUTOMATION-SYSTEM.md** (available separately) for:
- Complete 3-phase automation architecture
- Platform repo trigger workflow (Phase 1)
- Apply overlays workflow (Phase 3)
- Advanced troubleshooting
- Performance metrics

### Documentation

- [Speakeasy Overlays](https://speakeasy.com/docs/overlay)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0)
- [Google Developer Style Guide](https://developers.google.com/style)
- [GitHub Actions](https://docs.github.com/en/actions)

### Skill Documentation

See `.claude/skills/openapi-overlay-generator/SKILL.md` for:
- Detailed workflow instructions
- Overlay pattern examples
- Standards reference
- Script usage

## ✨ Benefits

### Time Savings
- **Before**: 4-6 hours per API update
- **After (Phase 2 only)**: 2-3 hours of review time
- **After (Full automation)**: 30-60 minutes of review time

### Quality Improvements
- ✅ Consistent terminology enforced by Claude skill
- ✅ Standard descriptions for common parameters
- ✅ Automatic validation against style guide
- ✅ Reduced human error

### Developer Experience
- ✅ Clear workflow with automated generation
- ✅ Human review at critical checkpoints
- ✅ Engineering validation before application
- ✅ Claude Code for local development

## 🔮 Coming Soon (Phase 3)

The next PR will add:
- `apply-overlays-and-regenerate.yml` workflow
- Automatic overlay consolidation
- Decorated spec application
- MDX docs regeneration
- Sidebar updates
- Archive management
- Ready-for-review automation

---

**Current Status**: Phase 2 (Generate Overlays) implemented ✅

**Next Step**: Implement Phase 3 (Apply Overlays and Regenerate)
