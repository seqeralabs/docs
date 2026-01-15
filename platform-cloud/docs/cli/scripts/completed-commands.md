# Completed CLI Commands - Ready to Run

**Workspace Used**: seqeratest_kitorg1/seqeratest_kitspace1 (ID: 235786397748080)
**Organization**: seqeratest_kitorg1 (ID: 249242354779282)

**Important**: This workspace is specifically for testing CLI commands. All operations are safe here!

---

## Actions (6 commands)

### tw actions list
**Command**:
```bash
tw actions list -w 235786397748080
```
**Notes**: Lists all actions in the test workspace. Should return 1 action: "Testy".

---

### tw actions view
**Command**:
```bash
tw actions view -n Testy -w 235786397748080
```
**Notes**: Views details for the "Testy" action including its endpoint and configuration.

---

### tw actions add
**Command**:
```bash
tw actions add tower -n example-hello-action -p 222831045090141 -w 235786397748080
```
**Notes**: Creates a new Tower launch action named "example-hello-action" using the nextflow-hello-saved pipeline (ID: 222831045090141). This is a test action that can be deleted later.

---

### tw actions update
**Command**:
```bash
tw actions update -n example-hello-action --status active -w 235786397748080
```
**Notes**: Updates the status of the "example-hello-action" to active. Run this after creating the action above.

---

### tw actions delete
**Command**:
```bash
tw actions delete -n example-hello-action -w 235786397748080
```
**Notes**: Deletes the "example-hello-action" created above. Safe to run after capturing examples.

---

### tw actions labels
**Command**:
```bash
tw actions labels -n Testy -l "environment=test,type=example" -w 235786397748080
```
**Notes**: Applies labels to the "Testy" action.

---

## Compute Environments (6 commands)

### tw compute-envs list
**Command**:
```bash
tw compute-envs list -w 235786397748080
```
**Notes**: Lists all compute environments. Should return 6 environments: AWS-EKS, AWSBatchCE, AWSCloud, GCPBatch, gke-ce, and GKE-CE2.

---

### tw compute-envs view
**Command**:
```bash
tw compute-envs view -n AWSBatchCE -w 235786397748080
```
**Notes**: Views details for the "AWSBatchCE" compute environment (ID: 2UIQR46b2dghUWzaphD2AW).

---

### tw compute-envs update
**Command**:
```bash
tw compute-envs update -n AWSCloudCE2 --new-name AWSCloud-primary -w 235786397748080
```
**Notes**: Renames the "AWSCloud" compute environment to "AWSCloud-renamed". Safe to test in this workspace.

---

### tw compute-envs primary
**Command**:
```bash
tw compute-envs primary -n AWSBatchCE -w 235786397748080
```
**Notes**: Sets "AWSBatchCE" as the primary compute environment.

---

### tw compute-envs export
**Command**:
```bash
tw compute-envs export -n AWSCloud-primary -w 235786397748080 > /tmp/cloudce-export.json
```
**Notes**: Exports the configuration of "AWSBatchCE" compute environment to JSON format.

---

### tw compute-envs import
**Command**:
```bash
tw compute-envs export -n AWSCloud-primary -w 235786397748080 > /tmp/cloudce-export.json
tw compute-envs import -n example-imported-ce /tmp/cloudce-export.json -w 235786397748080
```
**Notes**: Exports then imports a compute environment with a new name "example-imported-ce". This creates a test CE that can be deleted.

---

## Credentials (1 command)

### tw credentials update
**Command**:
```bash
tw credentials update aws -n aws-credentials --new-name aws-credentials-updated -w 235786397748080
```
**Notes**: Renames AWS credentials from "aws-credentials" to "aws-credentials-updated". Credential ID: 11gg7Owxx6VyhZTbx50c3B

---

## Datasets (1 command)

### tw datasets url
**Command**:
```bash
# First, create a dataset since none exist yet
tw datasets add -n example-test-dataset -w 235786397748080 --description "Test dataset for CLI examples"
# Then get the URL (you'll need the dataset ID from the add command output)
tw datasets url -i <DATASET_ID_FROM_ADD> -w 235786397748080
```
**Notes**: **NO DATASETS EXIST YET** - Must create one first with `tw datasets add`. Then use its ID to get the URL.

---

## Labels (1 command)

### tw labels update
**Command**:
```bash
# First, apply a label to get a label ID
tw pipelines labels -n nextflow-hello-saved -l "test=example" -w 235786397748080
# Then update the label (requires label ID from pipeline inspection)
tw labels update -i <LABEL_ID> -n test -v updated-value -w 235786397748080
```
**Notes**: Requires creating a label first, then finding its ID to update it. This is a multi-step process.

---

## Members (1 command)

### tw members leave
**Command**:
```bash
tw members leave -o seqeratest_kitorg1 -u sai-user
```
**Notes**: DESTRUCTIVE - Removes user "sai-user" from the "seqeratest_kitorg1" organization. Only run if you want to actually leave this test organization.

---

## Organizations (4 commands)

### tw organizations list
**Command**:
```bash
tw organizations list
```
**Notes**: Lists all organizations you have access to. Should show seqeralabs, community, seqeratest_kitorg1, and others.

---

### tw organizations view
**Command**:
```bash
tw organizations view -o seqeratest_kitorg1
```
**Notes**: Views details for the "seqeratest_kitorg1" organization (ID: 249242354779282).

---

### tw organizations update
**Command**:
```bash
tw organizations update -o seqeratest_kitorg1 --new-name seqeratest_kitorg1-updated
```
**Notes**: Renames the "seqeratest_kitorg1" organization. Safe to test since you own this organization.

---

### tw organizations delete
**Command**:
```bash
tw organizations delete -o HackHackyHackHack
```
**Notes**: DESTRUCTIVE - Deletes the "HackHackyHackHack" organization (ID: 152179288340814). Only run if you want to remove this test organization.

---

## Participants (2 commands)

### tw participants delete
**Command**:
```bash
tw participants delete -n <USERNAME> -w 235786397748080
```
**Notes**: DESTRUCTIVE - Removes a participant from the workspace. Requires specific username to remove. Use with caution.

---

### tw participants leave
**Command**:
```bash
tw participants leave -w 235786397748080
```
**Notes**: DESTRUCTIVE - Removes yourself from the seqeratest_kitspace1 workspace. Only run if you actually want to leave this workspace.

---

## Pipelines (6 commands)

### tw pipelines list
**Command**:
```bash
tw pipelines list -w 235786397748080
```
**Notes**: Lists all pipelines in the test workspace. Should return 6 pipelines including nextflow-hello-saved, nf-core-rnaseq, and several rnaseq test variants.

---

### tw pipelines view
**Command**:
```bash
tw pipelines view -n nextflow-hello-saved -w 235786397748080
```
**Notes**: Views details for the "nextflow-hello-saved" pipeline (ID: 222831045090141) including its repository and configuration.

---

### tw pipelines delete
**Command**:
```bash
tw pipelines delete -n rnaseq4 -w 235786397748080
```
**Notes**: Deletes the "rnaseq4" pipeline (ID: 111250478007869). This is a test pipeline that's safe to delete.

---

### tw pipelines export
**Command**:
```bash
tw pipelines export -n nextflow-hello-saved -w 235786397748080
```
**Notes**: Exports the "nextflow-hello-saved" pipeline configuration to JSON format.

---

### tw pipelines import
**Command**:
```bash
tw pipelines export -n nextflow-hello-saved -w 235786397748080 > /tmp/pipeline-export.json
tw pipelines import -n example-hello-imported /tmp/pipeline-export.json -w 235786397748080
```
**Notes**: Exports then imports the hello pipeline with a new name "example-hello-imported". Creates a test pipeline that can be deleted.

---

### tw pipelines labels
**Command**:
```bash
tw pipelines labels -n nextflow-hello-saved -l "environment=test,pipeline=demo" -w 235786397748080
```
**Notes**: Applies labels to the "nextflow-hello-saved" pipeline.

---

## Runs (4 commands)

### tw runs cancel
**Command**:
```bash
tw runs cancel -i 8YlZlGbpabKYJ -w 235786397748080
```
**Notes**: Attempts to cancel the workflow run "desperate_lorenz" (ID: 8YlZlGbpabKYJ). Note: This run is already FAILED, so cancel may not work. Better to test with an actually running workflow.

---

### tw runs delete
**Command**:
```bash
tw runs delete -i 3Lw5Wr5fwTYB36 -w 235786397748080
```
**Notes**: Deletes the failed workflow run "tiny_mcnulty" (ID: 3Lw5Wr5fwTYB36).

---

### tw runs relaunch
**Command**:
```bash
tw runs relaunch -i 3c8Znkdnj3gjQM -w 235786397748080
```
**Notes**: Relaunches the successful "astonishing_legentil" run (ID: 3c8Znkdnj3gjQM) from nf-core/rnaseq.

---

### tw runs labels
**Command**:
```bash
tw runs labels -i 3c8Znkdnj3gjQM -l "rerun=true,test=kitspace" -w 235786397748080
```
**Notes**: Applies labels to the workflow run with ID "3c8Znkdnj3gjQM".

---

## Secrets (5 commands)

### tw secrets add
**Command**:
```bash
tw secrets add -n example-test-secret -v "test-value-123" -w 235786397748080
```
**Notes**: **RUN THIS FIRST** - Creates a new secret named "example-test-secret". NO SECRETS EXIST YET in this workspace.

---

### tw secrets list
**Command**:
```bash
tw secrets list -w 235786397748080
```
**Notes**: Lists all secrets. Will be empty until you run `tw secrets add` above.

---

### tw secrets view
**Command**:
```bash
tw secrets view -n example-test-secret -w 235786397748080
```
**Notes**: Views the "example-test-secret" (run this after creating it above).

---

### tw secrets update
**Command**:
```bash
tw secrets update -n example-test-secret -v "updated-test-value-456" -w 235786397748080
```
**Notes**: Updates the value of "example-test-secret".

---

### tw secrets delete
**Command**:
```bash
tw secrets delete -n example-test-secret -w 235786397748080
```
**Notes**: Deletes the "example-test-secret" created above. Safe to run after capturing examples.

---

## Studios (3 commands)

### tw studios templates
**Command**:
```bash
tw studios templates -w 235786397748080
```
**Notes**: Lists available studio templates in the test workspace.

---

### tw studios checkpoints
**Command**:
```bash
tw studios checkpoints -i <STUDIO_ID> -w 235786397748080
```
**Notes**: Lists checkpoints for a studio. Note: Requires an existing studio ID. May need to create a studio first or use one from another workspace.

---

### tw studios add-as-new
**Command**:
```bash
tw studios add-as-new -i <STUDIO_ID> -n cloned-studio-example -w 235786397748080
```
**Notes**: Clones an existing studio with a new name. Requires an existing studio ID.

---

## Teams (1 command)

### tw teams members
**Command**:
```bash
tw teams members -t <TEAM_NAME> -o seqeratest_kitorg1
```
**Notes**: Lists members of a team in the seqeratest_kitorg1 organization. Requires a valid team name. May need to create a team first.

---

## Workspaces (4 commands)

### tw workspaces view
**Command**:
```bash
tw workspaces view -i 235786397748080
```
**Notes**: Views details for the seqeratest_kitspace1 workspace.

---

### tw workspaces update
**Command**:
```bash
tw workspaces update -i 235786397748080 --new-name seqeratest_kitspace1-updated
```
**Notes**: Renames the workspace to "seqeratest_kitspace1-updated". Safe to test.

---

### tw workspaces delete
**Command**:
```bash
tw workspaces delete -i 235786397748080
```
**Notes**: DESTRUCTIVE - Deletes the seqeratest_kitspace1 workspace. Only run if you want to remove this test workspace permanently.

---

### tw workspaces leave
**Command**:
```bash
tw workspaces leave -i 235786397748080
```
**Notes**: DESTRUCTIVE - Removes yourself from the workspace. Only run if you actually want to leave.

---

## Execution Order Recommendation

### Phase 1: Safe Read-Only Commands (Run First)
1. Organizations list/view
2. Workspaces view
3. Pipelines list/view/export
4. Compute-envs list/view/export
5. Actions list/view
6. Credentials list (if that command exists)

### Phase 2: Create Test Resources (REQUIRED BEFORE SOME LIST COMMANDS)
1. **Secrets add** (MUST run before secrets list/view/update)
2. **Datasets add** (MUST run before datasets url)
3. Actions add (creates example-hello-action)
4. Pipelines import (creates example-hello-imported)

### Phase 3: Safe Commands That Need Existing Resources
1. Secrets list
2. Secrets view
3. Runs relaunch
4. Runs labels
5. Datasets url (after creating dataset)

### Phase 4: Test Updates
1. Actions update
2. Actions labels
3. Secrets update
4. Pipelines labels
5. Compute-envs update
6. Credentials update

### Phase 5: Cleanup (Run Last)
1. Runs delete
2. Actions delete
3. Secrets delete
4. Pipelines delete

### Phase 6: Destructive Commands (Optional - Use with Extreme Caution)
Only run these if you actually want to perform these actions:
- members leave
- participants delete/leave
- workspaces update (if renaming)
- workspaces delete
- workspaces leave
- organizations update (if renaming)
- organizations delete

---

## Important Notes

### Resources That Need Creation First:
- **Secrets**: Workspace has NO secrets yet → Run `tw secrets add` before `tw secrets list`
- **Datasets**: Workspace has NO datasets yet → Run `tw datasets add` before `tw datasets url`
- **Labels**: Need to create labels via pipeline/action/run labels commands before updating them
- **Studios**: May need to create or reference studios from another workspace
- **Teams**: May need to create teams before listing members

### Existing Resources (Safe to Use):
- **6 Pipelines**: nextflow-hello-saved, nf-core-rnaseq, rnaseq2, rnaseq3, rnaseq4, rnaseqapitest
- **6 Compute Environments**: AWS-EKS, AWSBatchCE, AWSCloud, GCPBatch, gke-ce, GKE-CE2
- **1 Action**: Testy
- **7 Workflow Runs**: Mix of succeeded and failed runs
- **6 Credentials**: aws-credentials, aws-eng-playground-credentials, GCPSA, gke-creds, gke-creds-2, k8s-cluster

### Workspace Safety:
✅ **Safe**: This is YOUR test workspace - all operations are safe here!
✅ **No customer impact**: Not used for demos or production
✅ **Easy cleanup**: Can delete test resources without consequences
