# Platform OpenAPI documentation workflow

## Prerequisites

### Cloned repos
- **seqeralabs/platform**
- **seqeralabs/docs**

### Tools
- **Speakeasy CLI**: For overlay comparison and application
- **Node.js/npm**: For Docusaurus commands

### File Naming Conventions
- Base specs: `seqera-api-{version}.yaml` (e.g., `seqera-api-1.85.0.yaml`)
- Decorated specs: `seqera-api-latest-decorated.yaml` (consistent name for Docusaurus)
- Comparison overlays: `base-{old-version}-to-{new-version}-changes-overlay.yaml`
- Documentation overlays: `{feature}-{type}-overlay-{version}.yaml`
  - Types: `operations`, `parameters`, `schemas`
  - Example: `datasets-operations-overlay-1.85.yaml`

---

## Workflow

### Step 1: Get New Base Spec from Platform Repo

1. In Platform repo, switch to `master` branch and pull from origin:
   ```bash
   cd /path/to/tower-backend
   git checkout master
   git pull origin master
   ```

2. From Platform repo root, run `make update-api-docs`:
   ```bash
   make update-api-docs
   ```
   **IMPORTANT**: When prompted, **DO NOT INCREMENT VERSION**

3. Copy new base spec from Platform repo:
   ```bash
   # Base spec will be at:
   tower-backend/build/classes/groovy/main/META-INF/swagger/seqera-api-*.yml
   ```

4. Move new base spec to docs repo:
   ```bash
   cp tower-backend/build/classes/groovy/main/META-INF/swagger/seqera-api-*.yml \
      /path/to/docs-repo/platform-api-docs/specs/
   ```

### Step 2: Generate Base Comparison Overlay

Compare old and new base specs to identify all changes:

```bash
cd /path/to/docs-repo/platform-api-docs/specs

speakeasy overlay compare \
  -o seqera-api-1.66.0.yaml \
  -n seqera-api-1.85.0.yaml \
  > base-1.66-to-1.85-changes-overlay.yaml
```

**What this does**: Creates an overlay file showing every difference between the two base specs (new endpoints, changed parameters, added schemas, etc.).

### Step 3: Analyze Changes

Review the comparison overlay to identify:
- **New endpoints**: Need complete documentation (operations, parameters, schemas)
- **Modified endpoints**: Need updated descriptions
- **New schemas**: Need property descriptions
- **Deprecated endpoints**: Need deprecation notices

Group changes by feature area (datasets, data-links, pipelines, compute environments, etc.) for organized overlay creation.

### Step 4: Create Documentation Overlays

For each feature area with changes, create separate overlay files in the `specs` folder:

#### Operations Overlay
Covers endpoint summaries and descriptions.

**File**: `{feature}-operations-overlay-{version}.yaml`

**Format**:
```yaml
overlay: 1.0.0
info:
  title: {Feature} operations overlay
  version: 0.0.0
actions:
  # ===== {FEATURE} - OPERATIONS =====
  
  # ---- {OPERATION NAME} ----
  
  - target: "$.paths./{endpoint}.{method}.summary"
    update: "{Verb} {entity}"
  
  - target: "$.paths./{endpoint}.{method}.description"
    update: "{Full description with context and usage guidance.}"
```

**Conventions**:
- Summaries: Sentence case, verb-entity format (e.g., "List datasets", "Create pipeline")
- Descriptions: Full sentences with periods, include context about user/workspace scope
- Deprecated operations: Lead with "(Deprecated)" in summary, include link to new endpoint

#### Parameters Overlay
Covers path, query, and request body parameter descriptions.

**File**: `{feature}-parameters-overlay-{version}.yaml`

**Format**:
```yaml
overlay: 1.0.0
info:
  title: {Feature} parameters overlay
  version: 0.0.0
actions:
  # ===== {FEATURE} PARAMETERS - PATH, QUERY, AND REQUEST BODY =====
  
  # ---- PATH PARAMETERS ----
  
  - target: "$.paths./{endpoint}.{method}.parameters[?(@.name=='{paramName}')].description"
    update: "{Parameter description with type and context.}"
  
  # ---- QUERY PARAMETERS ----
  
  - target: "$.paths./{endpoint}.{method}.parameters[?(@.name=='workspaceId')].description"
    update: "Workspace numeric identifier."
  
  # ---- REQUEST BODY DESCRIPTIONS ----
  
  - target: "$.paths./{endpoint}.{method}.requestBody.description"
    update: "{Request body description.}"
```

**Conventions**:
- Consistent descriptions for repeated parameters (workspaceId, max, offset, search, etc.)
- Always include defaults in backticks: "Default: `0`"
- Specify accepted values: "Accepts `value1`, `value2`, or `value3`"
- End all descriptions with periods

#### Schemas Overlay
Covers request/response object property descriptions.

**File**: `{feature}-schemas-overlay-{version}.yaml`

**Format**:
```yaml
overlay: 1.0.0
info:
  title: {Feature} schemas overlay
  version: 0.0.0
actions:
  # ===== {FEATURE} SCHEMAS - REQUEST/RESPONSE OBJECTS =====
  
  # ---- REQUEST SCHEMAS ----
  
  - target: "$.components.schemas.{SchemaName}.properties.{propertyName}"
    update:
      type: string
      description: "{Property description with validation rules and constraints.}"
  
  # ---- RESPONSE SCHEMAS ----
  
  - target: "$.components.schemas.{SchemaName}.properties.{propertyName}"
    update:
      description: "{Property description.}"
```

**Conventions**:
- Include validation rules (max length, format requirements, etc.)
- Note nullable fields explicitly
- Describe enum values clearly
- Document array item types

### Step 5: Engineering Review

Before applying overlays, raise a **draft PR** for engineering review:

1. Commit all new overlay files in the `specs` folder to a feature branch
2. Create a draft PR with the overlay files
3. Request review from the appropriate Platform squad:
   - **Data team**: data-links, datasets, studios
   - **Unified compute team**: compute environments (all platforms)
   - **Pipelines team**: pipelines, workflows, launch operations
   - **Core team**: admin, organizations, workspaces, users, and everything else
4. **What to review**: Ask engineering to review the overlay files directly for technical accuracy
5. Iterate on feedback and update overlay files as needed
6. Once approved, proceed to Step 6

### Step 6: Consolidate Overlays

After engineering approval, consolidate all individual overlay files into one comprehensive overlay:

1. Create a new file: `all-changes-overlay-{version}.yaml`
2. Copy contents from all individual overlay files into this single file:
   - Keep sections clearly labeled (operations, parameters, schemas)
   - Maintain all target paths and updates
3. Move individual overlay files to archive:
   ```bash
   mv *-overlay-{version}.yaml overlays_archive/
   ```
   **Note**: Keep the individual files in `overlays_archive` for reference and future updates

### Step 7: Apply Consolidated Overlay

Apply the single comprehensive overlay to your decorated spec, using the consistent naming convention:

```bash
cd /path/to/docs-repo/platform-api-docs/specs

speakeasy overlay apply \
  -s seqera-api-latest-decorated.yaml \
  -o all-changes-overlay-1.85.yaml \
  > seqera-api-latest-decorated-new.yaml

# Replace old decorated spec with new one
mv seqera-api-latest-decorated-new.yaml seqera-api-latest-decorated.yaml
```

**Note**: By keeping the same filename (`seqera-api-latest-decorated.yaml`), Docusaurus config doesn't need updating.

### Step 8: Validate Output

Verify the decorated spec:
1. Check that all new endpoints have complete documentation
2. Verify parameter descriptions are consistent
3. Confirm schema properties are documented
4. Test that the spec is valid OpenAPI 3.0/3.1

```bash
# Validate with Speakeasy
speakeasy validate openapi -s seqera-api-latest-decorated.yaml
```

### Step 9: Update Docusaurus Config and Regenerate Documentation

Before regenerating docs, verify Docusaurus is pointing to the correct spec:

1. **Check `docusaurus.config.js`**:
   
   Open the config file and locate the `docs_platform_openapi` plugin configuration:
   
   ```javascript
   const docs_platform_openapi = [
     "docusaurus-plugin-openapi-docs",
     {
       id: "api", // plugin id
       docsPluginId: "classic", // configured for preset-classic
       config: {
         platform: {
           specPath: "platform-api-docs/scripts/seqera-api-latest-decorated.yaml",
           outputDir: "platform-api-docs/docs",
           sidebarOptions: {
             groupPathsBy: "tag",
           },
         },
       },
     },
   ];
   ```
   
   **Verify**: The `specPath` should point to `seqera-api-latest-decorated.yaml`. Since we use a consistent filename, this should not require changes.

2. **Regenerate documentation** from the decorated spec using Docusaurus:

   ```bash
   cd /path/to/docs-repo

   # Clean existing API docs
   npx docusaurus clean-api-docs all

   # Generate new API docs from decorated spec
   npx docusaurus gen-api-docs all
   ```

This will regenerate documentation tables and "Try it out" functionality based on your updated decorated spec.

### Step 10: Clean Up and Finalize PR

After regenerating docs, clean up the `specs` folder and prepare for final review:

1. Delete old base spec (keep only the latest):
   ```bash
   cd /path/to/docs-repo/platform-api-docs/specs
   rm seqera-api-1.66.0.yaml  # Delete old version
   ```

2. Move all used overlays to archive:
   ```bash
   mv base-1.66-to-1.85-changes-overlay.yaml overlays_archive/
   mv all-changes-overlay-1.85.yaml overlays_archive/
   ```

3. Verify `specs` folder contents:
   - ✅ Latest base spec (e.g., `seqera-api-1.85.0.yaml`)
   - ✅ Decorated spec with consistent name (`seqera-api-latest-decorated.yaml`)
   - ✅ `servers-overlay.yaml` (kept for reuse in future updates)
   - ❌ No old specs or temporary overlay files

4. Push changes to your PR:
   ```bash
   git add .
   git commit -m "Update API docs to version 1.85.0"
   git push origin your-feature-branch
   ```

5. Mark PR as **ready for review** (remove draft status)

---

## Documentation Standards

### Terminology Consistency

**Standard terms**:
- "data-links" (not "datalinks" or "data links")
- "resource path" (for bucket URLs, not "bucket path" or "URI")
- "Array of" (not "List of")
- "Workspace numeric identifier" (consistent across all endpoints)
- "Number of results to skip for pagination. Default: `0`." (standard offset description)

**Cloud provider terms**:
- Use "Azure Blob Storage containers" (not just "containers")
- Distinguish between "simple labels" and "resource labels"

### Style Guidelines

Follow **US English** and **Google Developer Style Guide**:
- Sentence case for summaries (not title case)
- Full sentences with periods for descriptions
- Active voice preferred over passive
- Use backticks for code values: `workspaceId`, `default`, `null`
- Use "Accepts X, Y, or Z" for listing options

### Common Parameter Descriptions

**Reuse these descriptions for consistency**:

| Parameter | Description |
|-----------|-------------|
| `workspaceId` (query) | Workspace numeric identifier. |
| `workspaceId` (path) | Workspace numeric identifier. |
| `max` | Maximum number of results to return. Default: `{value}`. |
| `offset` | Number of results to skip for pagination. Default: `0`. |
| `search` | Free-text search filter to match against {field names}. |
| `sortBy` | Field to sort results by. Accepts `{value1}`, `{value2}`, or `{value3}`. Default: `{value}`. |
| `sortDir` | Sort direction for results. Accepts `asc` (ascending) or `desc` (descending). Default: `{value}`. |

---

## Special Cases

### Deprecated Endpoints

For deprecated endpoints:

1. **Update summary**: Prefix with "(Deprecated)"
   ```yaml
   - target: "$.paths./old-endpoint.get.summary"
     update: "(Deprecated) List items"
   ```

2. **Update description**: Lead with deprecation notice and link to replacement
   ```yaml
   - target: "$.paths./old-endpoint.get.description"
     update: "**This endpoint is deprecated. See [New operation name](https://docs.seqera.io/platform-api/new-operation-slug) for the current endpoint.**\n\n{Original description of what this endpoint does.}"
   ```

### HPC Compute Configurations

Properties previously inherited from `AbstractGridConfig` now require explicit descriptions on each scheduler type (LSF, Slurm, Altair PBS, Moab, Univa). Duplicate property descriptions across all five scheduler configs.

### Discriminator Properties

When cleaning up schemas:
- Remove incorrect `readOnly` flags from discriminator properties
- Remove unnecessary `description` fields from discriminators
- Preserve the discriminator properties themselves (don't remove entirely)

---

## Quality Checks

Before finalizing, verify:

- ✅ All new endpoints have summaries and descriptions
- ✅ All parameters have descriptions with proper formatting
- ✅ All schema properties are documented
- ✅ Consistent terminology throughout
- ✅ All descriptions end with periods
- ✅ Defaults are specified in backticks
- ✅ Deprecated endpoints have proper notices
- ✅ Spec validates successfully
- ✅ Docusaurus config points to correct spec path
- ✅ "Try it out" functionality works (servers block preserved)
- ✅ `specs` folder contains only latest specs and `servers-overlay.yaml`
- ✅ Old specs and used overlays moved to `overlays_archive`

---

## Troubleshooting

### Missing servers block

If the `servers` block (containing API server URLs) is lost during updates:

1. Use the existing `servers-overlay.yaml` in the `specs` folder:
   ```yaml
   overlay: 1.0.0
   info:
     title: Servers block preservation
     version: 0.0.0
   actions:
     - target: "$.servers"
       update:
         - url: "https://api.platform.example.com"
           description: "Platform API endpoint"
   ```

2. Include it in your consolidated overlay file or apply separately

**Note**: `servers-overlay.yaml` is kept in `specs` folder (not archived) for reuse in every update.

### Overlay application errors

If overlays fail to apply:
- Check JSONPath syntax in `target` fields
- Verify all referenced schemas/paths exist in source spec
- Ensure overlay files are valid YAML
- Review Speakeasy error messages for specific issues

---

## Resources

- **Speakeasy Documentation**: [https://speakeasy.com/docs](https://speakeasy.com/docs)
- **OpenAPI Specification**: [https://spec.openapis.org/oas/v3.1.0](https://spec.openapis.org/oas/v3.1.0)
- **Google Developer Style Guide**: [https://developers.google.com/style](https://developers.google.com/style)

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-28 | Initial workflow documentation | Llewellyn vd Berg |

---