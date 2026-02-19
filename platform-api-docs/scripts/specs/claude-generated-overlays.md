# API Documentation Overlays for v1.109.0

Generated overlay files for Seqera Platform API v1.109.0 update (from v1.102.0).

## Summary

- **13 new endpoints** across 5 controllers
- **18 new schemas**
- **17 modified schemas**
- **2 modified endpoints**

## Generated Overlay Files

### SSH Keys (New Controller - 6 endpoints)

**ssh-keys-operations-overlay-1.109.0.yaml**
- List SSH keys
- Create SSH key
- Validate SSH key
- Validate SSH key name
- Describe SSH key
- Delete SSH key

**ssh-keys-parameters-overlay-1.109.0.yaml**
- Path parameters: keyId
- Query parameters: key, name
- Request body descriptions

**ssh-keys-schemas-overlay-1.109.0.yaml**
- CreateSshKeyRequest
- CreateSshKeyResponse
- DescribeSshKeyResponse
- ListSshKeysResponse
- UserSshPublicKeyDto
- StudioSshDetailsDto

### Pipeline Versions (New Controller - 4 endpoints)

**pipeline-versions-operations-overlay-1.109.0.yaml**
- List pipeline versions
- Validate pipeline version name
- Update pipeline version
- Manage pipeline version

**pipeline-versions-parameters-overlay-1.109.0.yaml**
- Path parameters: pipelineId, versionId
- Query parameters: workspaceId, max, offset, search, isPublished, name
- Request body descriptions

**pipeline-versions-schemas-overlay-1.109.0.yaml**
- CreatePipelineVersionRequest
- ListPipelineVersionsResponse
- PipelineVersionFullInfoDto
- PipelineVersionManageRequest
- PipelineMinInfoResponse
- PipelineMinInfoResponse.PipelineVersionMinInfoResponse

### Pipeline Schemas (New Controller - 1 endpoint)

**pipeline-schemas-operations-overlay-1.109.0.yaml**
- Create pipeline schema

**pipeline-schemas-parameters-overlay-1.109.0.yaml**
- Query parameters: workspaceId
- Request body description

**pipeline-schemas-schemas-overlay-1.109.0.yaml**
- CreatePipelineSchemaRequest
- CreatePipelineSchemaResponse
- PipelineSchemaDbDto

### Credentials (1 new endpoint)

**credentials-operations-overlay-1.109.0.yaml**
- Get encrypted credentials

**credentials-parameters-overlay-1.109.0.yaml**
- Path parameters: credentialsId
- Query parameters: workspaceId, pairingId

**credentials-schemas-overlay-1.109.0.yaml**
- GetCredentialsKeysResponse

### Workspaces (1 new endpoint)

**workspaces-operations-overlay-1.109.0.yaml**
- Delete workspace user

**workspaces-parameters-overlay-1.109.0.yaml**
- Path parameters: orgId, workspaceId, userId

### Pipelines Modifications

**pipelines-modifications-overlay-1.109.0.yaml**
- Updated summary for PUT /pipelines/{pipelineId}
- New versionId query parameter for launch and schema endpoints

## Next Steps

1. **Validate overlays**: Run validation scripts on all generated overlay files
2. **Engineering review**: Confirm technical accuracy with Platform team
3. **Consolidate**: Merge all overlays into comprehensive overlay file
4. **Apply**: Generate new decorated spec with all changes
5. **Regenerate**: Update MDX documentation files
6. **Update sidebar**: Add new operation entries for ssh-keys and pipeline-versions controllers

## Notes

- All overlay files follow Seqera Platform API documentation standards
- Standard parameter descriptions used for workspaceId, max, offset, etc.
- Summaries follow verb-entity pattern (sentence case, no period)
- Descriptions are complete sentences with periods
- Schema properties include validation rules and format specifications
