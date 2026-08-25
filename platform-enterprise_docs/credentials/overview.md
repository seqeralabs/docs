---
title: "Credentials Overview"
description: "Overview of credentials in Seqera Platform."
date: "21 Apr 2023"
tags: [credentials]
---

Configure **workspace credentials** in Seqera Platform to store the access keys and tokens for your [compute environments][compute], [data repositories][data], and [Git hosting services][git].

From version 22.3, you can configure **container registry credentials** to be used by the [Wave container service][wave] to authenticate to private and public container registries like Docker Hub, Google Artifact Registry, Quay, etc.

See the **Container registry credentials** section for registry-specific instructions.

:::note
All credentials are (AES-256) encrypted before secure storage and not exposed in an unencrypted way by any Seqera API.
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
  curl -X DELETE "$TOWER_API_ENDPOINT/credentials/<credentialsId>?workspaceId=<workspaceId>&checked=true" \
    -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"
  ```

- **Past runs lose their logs and their work directory view.** After deletion, the Nextflow log, the task logs, and the Data Explorer view of the work directory fail for every completed run on that compute environment.

Platform does not delete your run data. The data remains in your cloud storage. Only access through Platform is lost.

### Role-based and federated credentials

AWS credentials that use an assume-role Amazon Resource Name (ARN) or OpenID Connect (OIDC) workload identity, and Google credentials that use workload identity federation, hold no long-lived secret. They store only the role ARN or the provider and service account references. To revoke access, change the role's trust policy or delete the role.

### Restore a compute environment

To repair a compute environment in the `Associated credentials have been deleted` state, point it at a replacement credential. You cannot make this change in the Platform UI. Use the API:

```bash
curl -X PUT "$TOWER_API_ENDPOINT/compute-envs/<computeEnvId>?workspaceId=<workspaceId>" \
  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"credentialsId":"<newCredentialsId>"}'
```

Platform revalidates the compute environment against the replacement credential and returns it to the `AVAILABLE` state. This restores log and work directory access for past runs.

Note the following constraints:

- Use a credential for the same cloud provider, with access to the same buckets and compute resources. Platform rejects the change if validation fails.
- You can only repair a compute environment while it still references the deleted credential. After you attach a working credential, Platform rejects further credential changes.
- You cannot update compute environments that authenticate with a [managed identity][managed] this way.

{/* links */}

[compute]: ../compute-envs/overview
[data]: ../data/data-explorer
[git]: ../git/overview
[wave]: https://docs.seqera.io/wave/provisioning
[managed]: ./managed_identities
