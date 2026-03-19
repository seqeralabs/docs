---
title: tw pipeline-schemas
description: Manage pipeline schemas
---

# tw pipeline-schemas

Run `tw pipeline-schemas -h` to view the list of supported operations.

Pipeline schemas let you persist a Nextflow parameter schema in Platform and reuse it when creating or updating saved pipelines.

## tw pipeline-schemas add

Add a pipeline schema.

```bash
tw pipeline-schemas add [OPTIONS]
```

#### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-c`, `--content` | Path to a file containing the pipeline schema content. | Yes | `null` |
| `-w`, `--workspace` | Workspace numeric identifier or reference in OrganizationName/WorkspaceName format (defaults to `TOWER_WORKSPACE_ID` environment variable, or personal workspace if not set) | No | `TOWER_WORKSPACE_ID` |

#### Example

Command:

```bash
tw pipeline-schemas add \
  -c ./nextflow_schema.json \
  -w 123456789012345
```

Example output:

```bash
New pipeline schema '98765' added at [my-organization / my-workspace] workspace
```

After uploading a schema, use the returned schema ID with `tw pipelines add --pipeline-schema-id` or `tw pipelines update --pipeline-schema-id` to attach the persisted schema to a saved pipeline.
