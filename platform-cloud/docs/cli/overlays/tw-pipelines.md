## Overview

The `tw pipelines` commands allow you to manage and execute Nextflow pipelines in Seqera Platform. Use these commands to add pipelines to your workspace, launch pipeline runs with custom configurations, and manage pipeline resources.

## Common Workflows

### Quick Start: Running Your First Pipeline

1. Add a pipeline to your workspace:
   ```bash
   tw pipelines add \
     --name "My nf-core pipeline" \
     --url "https://github.com/nf-core/rnaseq"
   ```

2. Launch the pipeline:
   ```bash
   tw pipelines launch --id <pipeline-id>
   ```

3. Monitor the execution:
   ```bash
   tw runs view --id <run-id>
   ```

### CI/CD Integration

For automated pipeline execution in continuous integration:

```bash
#!/bin/bash
# Launch and monitor pipeline
RUN_ID=$(tw pipelines launch \
  --id $PIPELINE_ID \
  --params-file params.json \
  --output json | jq -r '.runId')

tw runs view --id $RUN_ID --wait
```

## Best Practices

- **Test in dev first**: Always test pipeline configurations in a development workspace before production runs
- **Use compute environment labels**: Organize resources by project or cost center using labels
- **Tag your runs**: Apply consistent tags to pipeline runs for easier tracking and reporting
- **Version your parameters**: Keep parameter files in version control alongside your analysis code
- **Monitor costs**: Use workspace insights to track compute costs per pipeline

## Pipeline Organization

Consider organizing pipelines by:
- **Project**: Group related analyses together
- **Stage**: Separate development, staging, and production pipelines
- **Team**: Organize by research group or department
- **Frequency**: Distinguish one-time analyses from recurring pipelines
