---
title: "Credentials overview"
description: "Learn about credentials in Seqera Platform."
date created: "2023-04-21"
last updated: "2026-07-29"
tags: [credentials, git, containers, registry]
---

Seqera Platform supports secure credential management for all your infrastructure and service integrations. Configure credentials to authenticate with:

- [Git hosting services][git]: Access private repositories from GitHub, GitLab, Bitbucket, and other Git providers.
- [Container registries][registry]: Authenticate the Wave container service with private registries like Docker Hub, AWS ECR, Azure Container Registry, and Google Artifact Registry.
- [Data repositories][data]: Connect to cloud storage services like AWS S3, Azure Blob Storage, and Google Cloud Storage.
- [Managed identities][managed]: Use cloud provider managed identities for secure, credential-free authentication.
- [SSH credentials][ssh]: Connect to HPC and on-premises compute environments.
- [Agent credentials][agent]: Authenticate Seqera Agents for hybrid and on-premises deployments.

:::note
Seqera Platform encrypts all credentials with AES-256 encryption before storing them. No Seqera API exposes credentials in an unencrypted way.
:::

## Credential deletion

:::note
This section applies only to cloud provider credentials.
:::

:::caution
Credential deletion is permanent. Past runs on the compute environments that used the credential lose their logs and their work directory view.
:::

Deleting a credential has the following effects:

- **Platform erases the stored secret.** To restore access, create a new credential and enter the access keys again.
- **Platform does not revoke the credential at your cloud provider.** The access key, service account key, or storage key remains valid. To revoke access, also delete or disable the key in your provider console.
- **Compute environments that use the credential become invalid.** Platform sets their status message to `Associated credentials have been deleted`. You cannot launch runs on them.
- **Platform marks data links that use the credential as `INVALID`.**
- **Platform cancels active runs and Studios that use the credential.** To detect them before you delete, call the API with `checked=true`. Platform returns `409` with the list of conflicts instead of deleting the credential:

  ```bash
  curl -X DELETE "https://api.cloud.seqera.io/credentials/<credentialsId>?workspaceId=<workspaceId>&checked=true" \
    -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"
  ```

- **Past runs lose their logs and their work directory view.** After deletion, the Nextflow log, the task logs, and the Data Explorer view of the work directory fail for every completed run on that compute environment.

Platform does not delete your run data. The data remains in your cloud storage. Only access through Platform is lost.

### Role-based and federated credentials

AWS credentials that use an assume-role Amazon Resource Name (ARN) or OpenID Connect (OIDC) workload identity, and Google credentials that use workload identity federation, hold no long-lived secret. They store only the role ARN or the provider and service account references. To revoke access, change the role's trust policy or delete the role.

### Restore a compute environment

To repair a compute environment in the `Associated credentials have been deleted` state, point it at a replacement credential. You cannot make this change in the Platform UI. Use the API:

```bash
curl -X PUT "https://api.cloud.seqera.io/compute-envs/<computeEnvId>?workspaceId=<workspaceId>" \
  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"credentialsId":"<newCredentialsId>"}'
```

Platform revalidates the compute environment against the replacement credential and returns it to the `AVAILABLE` state. This restores log and work directory access for past runs.

Note the following constraints:

- Use a credential for the same cloud provider, with access to the same buckets and compute resources. Platform rejects the change if validation fails.
- You can only repair a compute environment while it still references the deleted credential. After you attach a working credential, Platform rejects further credential changes.
- You cannot update compute environments that authenticate with a [managed identity][managed] this way.

[git]: ../git/overview
[registry]: ./container_registry_credentials
[data]: ./data_repositories
[managed]: ./managed_identities
[ssh]: ./ssh_credentials
[agent]: ./agent_credentials
