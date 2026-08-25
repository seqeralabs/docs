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

## Delete credentials

:::caution
Deleting a credential is permanent. Platform erases its stored copy of the secret, and every past run on the compute environments that used the credential loses its logs and its work directory view. Read this section before you delete a credential.
:::

### What deletion changes

- **Platform erases the stored secret.** Deletion removes the encrypted secret from Platform storage. There is no undo and no recovery. To restore access, create a new credential and enter the access keys again.
- **Platform does not revoke the credential at your cloud provider.** Deletion makes no call to AWS, Azure, or Google. The access key, service account key, or storage key remains valid. If your goal is to revoke access, also delete or disable it in the provider console.
- **Compute environments that use the credential become invalid.** Platform sets their status message to `Associated credentials have been deleted`. You cannot launch runs on them.
- **Data links that use the credential are marked `INVALID`.**
- **Active runs and Studios that use the credential are cancelled.** To detect them before you delete, call the API with `checked=true`. Platform then returns `409` with the list of conflicts instead of deleting the credential:

  ```bash
  curl -X DELETE "$TOWER_API_ENDPOINT/credentials/<credentialsId>?workspaceId=<workspaceId>&checked=true" \
    -H "Authorization: Bearer $TOWER_ACCESS_TOKEN"
  ```

- **Past runs lose their logs and their work directory view.** Platform resolves the credential from the compute environment each time you open a run — a run keeps no copy of its own. Once the credential is gone, the Nextflow log, the task logs, and the Data Explorer view of the work directory all fail for every completed run on that compute environment.

Your run data is not deleted. It remains in your cloud storage, and only access through Platform is lost. You can still read the files with a different credential — through Data Explorer with a data link backed by another credential, or with your cloud provider's CLI.

### Role-based and federated credentials

AWS credentials that use an assume-role ARN or OIDC workload identity, and Google credentials that use workload identity federation, hold no long-lived secret. They store only the role ARN or the provider and service account references. Deleting one destroys nothing you cannot re-enter, and there is nothing to revoke at the provider — to revoke access, change the role's trust policy or delete the role.

Everything else is the same. Platform still invalidates the compute environments and data links that use the credential, and past runs on those compute environments still lose their logs and their work directory view. Those consequences follow from the broken link between the compute environment and the credential, not from the secret.

### Restore a compute environment after credential deletion

A compute environment left in the `Associated credentials have been deleted` state can be repaired by pointing it at a replacement credential. This is only possible through the API:

```bash
curl -X PUT "$TOWER_API_ENDPOINT/compute-envs/<computeEnvId>?workspaceId=<workspaceId>" \
  -H "Authorization: Bearer $TOWER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"credentialsId":"<newCredentialsId>"}'
```

Platform revalidates the compute environment against the replacement credential and returns it to the `AVAILABLE` state. Log and work directory access for past runs is restored, because Platform resolves the new credential when you open a run.

Note the following constraints:

- Use a credential for the same cloud provider, with access to the same buckets and compute resources. Platform revalidates the compute environment and rejects the change if validation fails.
- The repair only applies while the compute environment still references the deleted credential. Once you attach a working credential, further credential changes are rejected.
- Compute environments that authenticate with a [managed identity][managed] cannot be updated this way.

{/* links */}

[compute]: ../compute-envs/overview
[data]: ../data/data-explorer
[git]: ../git/overview
[wave]: https://docs.seqera.io/wave/provisioning
[managed]: ./managed_identities
