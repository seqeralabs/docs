# Workflow Decision Log

This file tracks significant changes and decisions made to the GitHub Actions workflows in this directory.

---

## 2026-01-05: Apply Overlays Workflow Improvements

**File:** `apply-overlays-and-regenerate.yml`
**Session:** Phase 3 workflow debugging and enhancement

### Context
During initial testing, the workflow reported success for each step but failed validation. Investigation revealed that steps were exiting early or creating invalid files while still reporting success, making debugging difficult.

### Changes Made

#### 1. **Support for both .yaml and .yml extensions**
**Decision:** Make all file detection and processing handle both YAML file extensions.

**Rationale:**
- Platform repo may use `.yml` extension while docs repo standardizes on `.yaml`
- Prevents silent failures when file extensions don't match expectations
- Future-proofs against inconsistent file naming

**Implementation:**
- Version detection: `ls -t seqera-api-*.yaml seqera-api-*.yml 2>/dev/null`
- Regex pattern updated: `sed -E 's/seqera-api-(.*)\.ya?ml/\1/'`
- All file loops now check both extensions
- Decorated spec detection checks both extensions

**Files affected:**
- Detect version step
- Extract overlays step
- Consolidate overlays step
- Apply overlays step
- Archive overlays step
- Clean up old base specs step

---

#### 2. **Removed redundant overlay sections**
**Decision:** Remove servers-overlay and healthcheck-overlay handling from consolidation step.

**Rationale:**
- These overlays are now permanently fixed in the decorated spec
- No longer need to be applied via overlays in future updates
- Reduces complexity and potential failure points

**Implementation:**
- Removed servers-overlay check and append logic (lines 82-86)
- Removed healthcheck-overlay check and append logic (lines 88-91)
- Simplified consolidation to only handle version-specific overlays

---

#### 3. **Added YAML overlay extraction from markdown**
**Decision:** Automatically extract YAML overlay files from `claude-generated-overlays.md` in Phase 3.

**Rationale:**
- Keeps Phase 2 simple: one markdown file for human review
- Eliminates manual extraction step between Phase 2 and Phase 3
- Reduces human error and streamlines the approval workflow

**Implementation:**
- New step: "Extract overlay files from markdown" (lines 66-141)
- Python script parses markdown for YAML code blocks
- Looks for filenames in various formats: `**filename.yaml**`, `# filename.yaml`, etc.
- Normalizes all extracted files to `.yaml` extension
- Sets `has_overlays` output variable for conditional execution
- Exits with error if YAML blocks found but no filenames detected

**Edge cases handled:**
- Missing markdown file: exits gracefully with warning
- No YAML blocks found: exits with error
- YAML blocks without filenames: reports warning but continues

---

#### 4. **Comprehensive error handling and logging**
**Decision:** Add detailed diagnostic output to every step that processes files.

**Rationale:**
- Initial run showed steps reporting success while silently failing
- Difficult to debug which step actually failed and why
- Need visibility into what files exist, what's being searched for, and what's being found

**Implementation:**

**Extract overlay files step:**
- Added `id: extract` for conditional step execution
- Shows directory contents if markdown file not found
- Corrected error message: Phase 1 (not Phase 2) creates markdown
- Reports count of extracted files
- Sets output variable for downstream conditional execution

**Consolidate overlay files step:**
- Lists current directory and all files at start
- Shows search pattern being used
- Lists which overlay files were found before processing
- Shows consolidated filename being created
- Counts and logs each file being added
- Reports final consolidated file size in lines
- Fails with clear error if no overlay files found

**Apply overlays to decorated spec step:**
- Shows consolidated overlay file location and size
- Shows decorated spec file and size before applying
- Displays exact speakeasy command being executed
- Verifies output file was created before proceeding
- Shows decorated spec size after applying overlay
- Added conditional: only runs if `has_overlays=true`

**Validate decorated spec step:**
- Shows spec file location and size before validation
- Displays exact speakeasy validation command
- Clear success/failure messages
- Added conditional: only runs if `has_overlays=true`

---

#### 5. **Safety backup for decorated spec**
**Decision:** Preserve old decorated spec until validation passes.

**Rationale:**
- Original flow immediately overwrote the old (working) spec before validation
- If validation failed, the working spec was lost
- Need rollback capability if validation fails

**Implementation:**
- Before replacing decorated spec, rename old one to `-old.yaml`:
  ```bash
  mv seqera-api-latest-decorated.yaml seqera-api-latest-decorated-old.yaml
  ```
- Move new spec into place only after backup complete
- If validation fails, old spec is still available
- Archive step cleans up `-old.yaml` backup after all steps succeed
- Supports both `.yaml` and `.yml` extensions for cleanup

**Flow:**
1. Apply overlay → create `seqera-api-latest-decorated-new.yaml`
2. Backup → `mv seqera-api-latest-decorated.yaml → seqera-api-latest-decorated-old.yaml`
3. Replace → `mv seqera-api-latest-decorated-new.yaml → seqera-api-latest-decorated.yaml`
4. Validate new spec
5. If all succeeds, cleanup old backup in archive step

---

#### 6. **Enhanced archive/cleanup step**
**Decision:** Archive all intermediate files and clean up backup spec.

**Rationale:**
- Keep specs directory clean after workflow completes
- Preserve historical files for debugging in archive
- Remove backup only after complete success

**Implementation:**
- Archives `claude-generated-overlays.md` after extraction
- Archives all `*-analysis.json` files
- Removes `seqera-api-latest-decorated-old.yaml` backup
- Supports both `.yaml` and `.yml` extensions throughout

---

### Testing Notes

**Issue identified during first run:**
- 3 overlay files were successfully extracted from markdown
- But consolidated file and decorated spec updates were not visible
- Validation was failing on decorated spec

**Root cause (suspected):**
- Consolidation step may have been creating invalid overlay structure
- Empty or malformed consolidated overlay applied to decorated spec
- Decorated spec validation failed due to invalid overlay application

**New logging will reveal:**
- Exact file counts at each step
- File sizes before/after operations
- Whether files actually exist when expected
- Which speakeasy commands are executed and their output

---

### Future Considerations

1. **Validation of extracted overlays**: Consider adding validation of individual overlay files before consolidation
2. **Diff reporting**: Could add step to show diff between old and new decorated spec
3. **Rollback automation**: If validation fails, could automatically restore the `-old.yaml` backup
4. **Overlay format validation**: Verify consolidated overlay has proper structure before applying
5. **Speakeasy error capture**: Currently only checks if output file exists, could capture and log speakeasy errors

---

### Related Files
- `generate-openapi-overlays.yml` - Phase 2 workflow that creates the markdown file
- `platform-api-docs/scripts/specs/` - Directory containing all spec and overlay files
- `.claude/skills/openapi-overlay-generator/` - Skill that generates overlays via Claude API

---

### References
- OpenAPI Overlay Specification: https://github.com/OAI/Overlay-Specification
- Speakeasy CLI docs: https://github.com/speakeasy-api/speakeasy
