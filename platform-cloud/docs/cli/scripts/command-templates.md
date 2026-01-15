# CLI Command Templates for Example Generation

## Context for Claude Desktop

I'm documenting 45 Seqera Platform CLI commands that need examples. Each command below has placeholders like `<WORKSPACE_ID>`, `<PIPELINE_ID>`, etc.

**Your task**: Use the Seqera MCP connector to:
1. Retrieve actual resource IDs from my Seqera Platform workspace
2. Replace placeholders with real values
3. Construct complete commands ready to run

**Requirements**:
- Use a consistent workspace (pick one with existing resources)
- Use existing resources where possible (for view/list/update/delete operations)
- For new resources, use descriptive names like "example-action", "test-secret"

---

## Actions (6 commands)

Actions enable event-based pipeline execution (e.g., trigger on GitHub webhook).

### tw actions list
```bash
tw actions list -w <WORKSPACE_ID>
```
**Resources needed**: A workspace ID with at least one action

### tw actions view
```bash
tw actions view -n <ACTION_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing action name

### tw actions add
```bash
# GitHub action example
tw actions add github -n <ACTION_NAME> -w <WORKSPACE_ID> -p <PIPELINE_ID> -c <COMPUTE_ENV_ID> --github-token <TOKEN>
```
**Resources needed**: Workspace ID, pipeline ID, compute environment ID
**Note**: This will create a new action - use a test name

### tw actions update
```bash
tw actions update -n <ACTION_NAME> --status active -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing action name

### tw actions delete
```bash
tw actions delete -n <ACTION_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, action name to delete (use a test action)

### tw actions labels
```bash
tw actions labels -n <ACTION_NAME> -l "environment=test,priority=high" -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing action name

---

## Compute Environments (6 commands)

### tw compute-envs list
```bash
tw compute-envs list -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID with at least one compute environment

### tw compute-envs view
```bash
tw compute-envs view -n <COMPUTE_ENV_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing compute environment name

### tw compute-envs update
```bash
tw compute-envs update -n <COMPUTE_ENV_NAME> --new-name <NEW_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing compute environment name
**Note**: This will rename the compute environment

### tw compute-envs primary
```bash
tw compute-envs primary -n <COMPUTE_ENV_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, compute environment name to set as primary

### tw compute-envs export
```bash
tw compute-envs export -n <COMPUTE_ENV_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing compute environment name

### tw compute-envs import
```bash
tw compute-envs import -n <NEW_COMPUTE_ENV_NAME> <JSON_FILE_PATH> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, path to exported compute env JSON file
**Note**: Use output from export command above

---

## Credentials (1 command)

### tw credentials update
```bash
tw credentials update aws -n <CREDENTIAL_NAME> --new-name <NEW_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing AWS credential name

---

## Datasets (1 command)

### tw datasets url
```bash
tw datasets url -i <DATASET_ID> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing dataset ID

---

## Labels (1 command)

### tw labels update
```bash
tw labels update -i <LABEL_ID> -n <NEW_LABEL_NAME> -v <NEW_VALUE> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing label ID

---

## Members (1 command)

### tw members leave
```bash
tw members leave -o <ORGANIZATION_NAME> -u <USERNAME>
```
**Resources needed**: Organization name, username to remove (use test user)
**Note**: This is destructive - use carefully

---

## Organizations (4 commands)

### tw organizations list
```bash
tw organizations list
```
**Resources needed**: None (lists all organizations you have access to)

### tw organizations view
```bash
tw organizations view -o <ORGANIZATION_NAME>
```
**Resources needed**: Organization name

### tw organizations update
```bash
tw organizations update -o <ORGANIZATION_NAME> --new-name <NEW_NAME>
```
**Resources needed**: Organization name
**Note**: This will rename the organization - use test org

### tw organizations delete
```bash
tw organizations delete -o <ORGANIZATION_NAME>
```
**Resources needed**: Organization name to delete (use test org)
**Note**: This is destructive - use test organization only

---

## Participants (2 commands)

### tw participants delete
```bash
tw participants delete -n <USERNAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, participant username to remove

### tw participants leave
```bash
tw participants leave -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID to leave
**Note**: This is destructive - removes you from workspace

---

## Pipelines (6 commands)

### tw pipelines list
```bash
tw pipelines list -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID with at least one pipeline

### tw pipelines view
```bash
tw pipelines view -n <PIPELINE_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing pipeline name

### tw pipelines delete
```bash
tw pipelines delete -n <PIPELINE_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, pipeline name to delete (use test pipeline)

### tw pipelines export
```bash
tw pipelines export -n <PIPELINE_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing pipeline name

### tw pipelines import
```bash
tw pipelines import -n <NEW_PIPELINE_NAME> <JSON_FILE_PATH> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, path to exported pipeline JSON file
**Note**: Use output from export command above

### tw pipelines labels
```bash
tw pipelines labels -n <PIPELINE_NAME> -l "environment=test,version=1.0" -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing pipeline name

---

## Runs (4 commands)

### tw runs cancel
```bash
tw runs cancel -i <RUN_ID> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, active run ID (run must be running/pending)

### tw runs delete
```bash
tw runs delete -i <RUN_ID> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, run ID to delete

### tw runs relaunch
```bash
tw runs relaunch -i <RUN_ID> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing run ID to relaunch

### tw runs labels
```bash
tw runs labels -i <RUN_ID> -l "experiment=test,batch=1" -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing run ID

---

## Secrets (5 commands)

Secrets store sensitive data (API keys, passwords) for pipeline access.

### tw secrets list
```bash
tw secrets list -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID with at least one secret

### tw secrets add
```bash
tw secrets add -n <SECRET_NAME> -v <SECRET_VALUE> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID
**Note**: Use a test secret name and non-sensitive value

### tw secrets view
```bash
tw secrets view -n <SECRET_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing secret name

### tw secrets update
```bash
tw secrets update -n <SECRET_NAME> -v <NEW_VALUE> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing secret name

### tw secrets delete
```bash
tw secrets delete -n <SECRET_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, secret name to delete (use test secret)

---

## Studios (3 commands)

### tw studios templates
```bash
tw studios templates -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID

### tw studios checkpoints
```bash
tw studios checkpoints -i <STUDIO_ID> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing studio ID

### tw studios add-as-new
```bash
tw studios add-as-new -i <STUDIO_ID> -n <NEW_STUDIO_NAME> -w <WORKSPACE_ID>
```
**Resources needed**: Workspace ID, existing studio ID to clone

---

## Teams (1 command)

### tw teams members
```bash
tw teams members -t <TEAM_NAME> -o <ORGANIZATION_NAME>
```
**Resources needed**: Organization name, existing team name

---

## Workspaces (4 commands)

### tw workspaces view
```bash
tw workspaces view -i <WORKSPACE_ID>
```
**Resources needed**: Workspace ID

### tw workspaces update
```bash
tw workspaces update -i <WORKSPACE_ID> --new-name <NEW_NAME>
```
**Resources needed**: Workspace ID
**Note**: This will rename the workspace - use test workspace

### tw workspaces delete
```bash
tw workspaces delete -i <WORKSPACE_ID>
```
**Resources needed**: Workspace ID to delete (use test workspace)
**Note**: This is destructive - use test workspace only

### tw workspaces leave
```bash
tw workspaces leave -i <WORKSPACE_ID>
```
**Resources needed**: Workspace ID to leave
**Note**: This is destructive - removes you from workspace

---

## Summary

**Total commands**: 45
**Resource types needed**:
- Workspace IDs (primary requirement)
- Organization names
- Pipeline IDs/names
- Compute environment IDs/names
- Action names
- Run IDs
- Secret names
- Dataset IDs
- Studio IDs
- Team names
- Credential names
- Label IDs

**Destructive commands** (use test resources):
- delete operations (actions, pipelines, runs, secrets, workspaces, organizations)
- leave operations (members, participants, workspaces)
- update/rename operations (use test resources)

**Recommended approach**:
1. Start with list/view commands (safe, read-only)
2. Use export commands to get JSON for import examples
3. Create test resources for add/delete examples
4. Use descriptive names: "example-action", "test-secret", "demo-pipeline"
