---
name: openapi-overlay-generator
description: Generate OpenAPI overlay files for Seqera Platform API documentation. Use when working with API documentation updates, analyzing comparison overlays from Speakeasy, creating operations/parameters/schemas overlay files, or updating API documentation for new Platform versions. Triggers include requests to generate overlays, document new API endpoints, analyze API changes, or work with Seqera Platform OpenAPI specifications.
---

# OpenAPI overlay generator for Seqera Platform API

This skill generates high-quality OpenAPI overlay files for documenting the Seqera Platform API according to established standards and conventions.

## When to use this skill

Use this skill when:
- Analyzing Speakeasy comparison overlays to identify API changes
- Generating operations, parameters, or schemas overlay files
- Documenting new API endpoints or controllers
- Updating API documentation for a new Platform version
- Validating overlay files against documentation standards
- Working with Seqera Platform OpenAPI specifications

## Core workflow

### Phase 1: Analysis

When given a Speakeasy comparison overlay, analyze it to identify changes:

```bash
# Run the analysis script
python scripts/analyze_comparison.py path/to/comparison-overlay.yaml
```

This generates:
- **Console output**: Human-readable summary of changes
- **JSON file**: Programmatic analysis for automation (`{filename}-analysis.json`)

The analysis categorizes changes by:
- New endpoints (requiring full documentation)
- Modified endpoints (requiring updates)
- New schemas (requiring property descriptions)
- Tag/controller grouping

### Phase 2: Generate overlay files

Based on the analysis, generate three overlay files for each affected feature area:

#### 1. Operations overlay

**Purpose**: Document endpoint summaries and descriptions

**Key principles**:
- Summaries use verb-entity pattern: "List datasets", "Create pipeline"
- Summaries are sentence case, no period
- Descriptions are full sentences with periods
- Include workspace scope context where applicable

**Example**:
```yaml
overlay: 1.0.0
info:
  title: Datasets operations overlay
  version: 1.89
actions:
  # ===== DATASETS - OPERATIONS =====

  - target: "$.paths./datasets.get.summary"
    update: "List datasets"

  - target: "$.paths./datasets.get.description"
    update: "Lists all datasets in a user context, enriched by `attributes`. Append `?workspaceId` to list datasets in a workspace context."
```

#### 2. Parameters overlay

**Purpose**: Document path, query, and request body parameters

**Key principles**:
- Use EXACT standard descriptions for common parameters (see `references/standards.md`)
- Always include defaults in backticks
- End all descriptions with periods
- Specify accepted values for enums

**CRITICAL**: These parameters MUST use standard descriptions:
- `workspaceId`: "Workspace numeric identifier."
- `offset`: "Number of results to skip for pagination. Default: `0`."
- `max`: "Maximum number of results to return. Default: `{value}`."

**Example**:
```yaml
overlay: 1.0.0
info:
  title: Datasets parameters overlay
  version: 1.89
actions:
  # ===== DATASETS PARAMETERS =====

  # ---- PATH PARAMETERS ----

  - target: "$.paths./datasets/{datasetId}.get.parameters[?(@.name=='datasetId')].description"
    update: "Dataset numeric identifier."

  # ---- QUERY PARAMETERS ----

  - target: "$.paths./datasets.get.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."

  - target: "$.paths./datasets.get.parameters[?(@.name=='max')].description"
    update: "Maximum number of results to return. Default: `20`."
```

#### 3. Schemas overlay

**Purpose**: Document request/response object properties

**Key principles**:
- Include validation rules (max length, format, etc.)
- Note nullable fields explicitly
- Describe enum values with all options
- Use "Array of" prefix for arrays
- Where it can be inferred from Platform API controller source code, add `required: true` key to every required field in a request body object

**Example**:
```yaml
overlay: 1.0.0
info:
  title: Datasets schemas overlay
  version: 1.89
actions:
  # ===== DATASETS SCHEMAS =====

  - target: "$.components.schemas.DatasetRequest.properties.name"
    update:
      type: string
      required: true
      description: "Dataset name. Maximum 255 characters."

  - target: "$.components.schemas.DatasetRequest.properties.description"
    update:
      type: string
      nullable: true
      description: "Optional dataset description. Can be `null`."
```

### Phase 3: Validation

After generating overlay files, validate them:

```bash
# Structural validation
python scripts/validate_overlay.py path/to/overlay.yaml

# Standards compliance
python scripts/check_consistency.py path/to/overlay.yaml
```

Fix any errors or warnings before proceeding.

## Documentation standards

**MUST READ**: See `references/standards.md` for complete style guide including:
- Terminology standards (data-links, resource path, Array of)
- Standard parameter descriptions (workspaceId, max, offset, etc.)
- Operation summary patterns (verb-entity format)
- Description formatting rules
- Enum and default value formatting

**MUST READ**: See `references/overlay-patterns.md` for:
- Template structures for each overlay type
- Common patterns for CRUD operations
- JSONPath targeting examples
- Complete examples of all property types

## Critical rules

### Summaries
- ✅ Sentence case: "List datasets"
- ❌ Title case: "List Datasets"
- ✅ No period at end
- ❌ With period: "List datasets."
- ✅ Verb-entity pattern: "Create pipeline"

### Descriptions
- ✅ Must end with period: "Lists all datasets."
- ❌ No period: "Lists all datasets"
- ✅ Full sentences with context
- ✅ Include scope info where applicable

### Standard parameters
- ✅ Use EXACT descriptions from standards.md
- ❌ Never invent new wording for workspaceId, max, offset, etc.
- ✅ Include defaults in backticks: "Default: `0`."

### Terminology
- ✅ "data-links" (not "datalinks" or "data links")
- ✅ "resource path" (not "bucket path")
- ✅ "Array of" (not "List of")
- ✅ "Workspace numeric identifier" (not "Workspace ID")

## Overlay file structure

### Naming convention

```
{resource}-{type}-overlay-{version}.yaml

Examples:
- datasets-operations-overlay-1.89.yaml
- datasets-parameters-overlay-1.89.yaml
- datasets-schemas-overlay-1.89.yaml
```

### File organization

Within each overlay file:

```yaml
overlay: 1.0.0
info:
  title: {Resource} {type} overlay
  version: {version}
actions:
  # ===== {FEATURE} - {TYPE} =====

  # ---- {SECTION NAME} ----

  - target: "$.paths.{endpoint}.{method}.{property}"
    update: "{value}"

  # ---- {NEXT SECTION} ----

  - target: "$.paths.{endpoint}.{method}.{property}"
    update: "{value}"
```

**Organization rules**:
- Group by resource/controller (===== markers)
- Separate by operation or schema (---- markers)
- Follow logical order (List → Get → Create → Update → Delete)
- Keep related targets together

## JSONPath patterns

### Common patterns

```yaml
# Operation summary
$.paths./datasets.get.summary

# Operation description
$.paths./datasets.get.description

# Path parameter by name
$.paths./datasets/{datasetId}.get.parameters[?(@.name=='datasetId')].description

# Query parameter by name
$.paths./datasets.get.parameters[?(@.name=='workspaceId')].description

# Request body description
$.paths./datasets.post.requestBody.description

# Schema property
$.components.schemas.DatasetRequest.properties.name

# Response description
$.paths./datasets.get.responses['200'].description
```

## Generating overlays from comparison

When analyzing a comparison overlay:

1. **Identify new endpoints**: These need ALL three overlay types (operations, parameters, schemas)
2. **Group by tag/controller**: Create one set of overlay files per resource (datasets, credentials, etc.)
3. **Check for standard parameters**: Use exact standard descriptions
4. **Follow patterns**: Use templates from overlay-patterns.md
5. **Maintain consistency**: Same entities use same phrasing throughout

## Quality checklist

Before finalizing overlay files:

- [ ] All summaries are sentence case
- [ ] No summaries end with periods
- [ ] All descriptions end with periods
- [ ] Standard parameters use exact standard descriptions
- [ ] Terminology is consistent (data-links, resource path, Array of)
- [ ] All defaults are in backticks: `0`, `20`, `false`
- [ ] All enum values are listed with backticks
- [ ] Deprecated endpoints have proper notices
- [ ] File names follow convention: {feature}-{type}-overlay-{version}.yaml
- [ ] JSONPath syntax is valid
- [ ] Validation scripts pass

## Scripts reference

### Analysis
- `scripts/analyze_comparison.py`: Parse comparison overlay and categorize changes
  - Input: Comparison overlay YAML
  - Output: Console report + JSON analysis file

### Validation
- `scripts/validate_overlay.py`: Check overlay structure and JSONPath syntax
  - Input: Overlay file
  - Output: Errors and warnings

- `scripts/check_consistency.py`: Verify standards compliance
  - Input: Overlay file
  - Output: Consistency issues

### Automation
- `scripts/update_sidebar.py`: Add new operations to sidebar.js
  - Input: sidebar.js + analysis JSON
  - Output: Updated sidebar with new entries

- `scripts/extract-api-tables.mjs`: Generate parameter tables for info pages
  - Input: Decorated spec (seqera-api-latest-decorated.yaml)
  - Output: YAML tables in docs/info/parameter-tables/

## Common mistakes to avoid

1. **Inconsistent parameter descriptions**: Always use standards.md exact wording
2. **Missing periods in descriptions**: Descriptions are sentences
3. **Title case summaries**: Use sentence case only
4. **Invented terminology**: Use established terms only
5. **Missing defaults**: Always specify default values in backticks
6. **Incomplete enum listings**: List all accepted values
7. **Vague descriptions**: Include specifics (max length, format, constraints)

## Working with permanent overlays

One overlay is applied to EVERY version:

1. **servers-overlay.yaml**: Adds servers block with API URLs

This lives in `scripts/specs/` and should not be moved to archives.

## Integration points

This skill integrates with:
- **Speakeasy CLI**: For overlay comparison and application
- **GitHub Actions**: Automated workflow triggering
- **Claude Code**: Local development and testing
- **Docusaurus**: Documentation regeneration
- **Platform repo**: Source of truth for base specs

## Next steps after generation

After generating overlay files:

1. **Validate**: Run validation scripts
2. **Review**: Manually check for accuracy and completeness
3. **Engineering review**: Get technical accuracy confirmation
4. **Consolidate**: Merge all overlays into single comprehensive file
5. **Apply**: Generate new decorated spec
6. **Regenerate**: Update MDX documentation files
7. **Update sidebar**: Add new operation entries
8. **Archive**: Move version-specific consolidated overlay file to overlay_archives/
9. **Clean up**: Remove the old base spec, individual overlays, and other ephemeral files, leaving only the decorated spec, latest base spec, and `servers-overlay.yaml` in the specs folder.
