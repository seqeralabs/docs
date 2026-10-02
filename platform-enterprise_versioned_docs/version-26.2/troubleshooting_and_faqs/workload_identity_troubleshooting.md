---
title: "Workload identity"
description: "Troubleshoot workload identity federation in Seqera Platform."
date created: "2026-09-17"
last updated: "2026-09-30"
tags: [faq, help, credentials, workload identity, troubleshooting]
---

When working with [workload identity federation][wif], you might encounter the following issues.

Before you change a trust policy or an Identity and Access Management (IAM) binding, establish whether the token exchange or the request that followed it failed:

- **The exchange failed.** Your cloud provider refused to issue temporary credentials because the trust policy or the impersonation binding does not admit the subject Platform presented. The error names the resolved subject. The fix needs an administrator on the cloud account.
- **The exchange succeeded, but the permission policy is too narrow.** Your cloud provider issued credentials, then denied the request those credentials made. By design, the error does not name the subject. Widen the permission policy for that workload.

## Instance configuration

#### `…requires the OIDC provider to be configured (tower.oidc.pem.path)`

Authentication fails with one of these errors:

- Google Cloud: `WIF credentials require the OIDC provider to be configured (tower.oidc.pem.path)`
- AWS: `AWS OIDC workload identity requires the OIDC provider to be configured (tower.oidc.pem.path)`

This issue occurs when `TOWER_OIDC_PEM_PATH` is not set. Without it, the Seqera Platform OIDC provider is off.

To resolve, set `TOWER_OIDC_PEM_PATH` to the path of a PEM file that holds an RSA keypair. See [Enable workload identity federation][wif-enable].

## AWS

#### The compute environment form shows `AccessDenied` throughout

Every field on the compute environment form fails to populate, and each failure reports `AccessDenied`.

This issue occurs when the permission policy grants only `data`-subject permissions. Compute environment describe calls present the `platform` subject.

To resolve, add the `platform` workload's permissions to the permission policy. See [Permission policies][wif-permission-policies].

#### Data Explorer shows no buckets at all

The credential is valid, but Data Explorer lists nothing.

This issue occurs when AWS denies the bucket discovery call itself. Data Explorer calls `ListBuckets` once to find the buckets it can show. A denial fails the whole listing rather than returning fewer buckets.

To resolve, grant `s3:ListAllMyBuckets` on `*`. Because the action has no resource dimension, you cannot scope it to individual buckets.

#### Data Explorer is missing some buckets

Data Explorer lists some buckets but not others, and the missing ones exist in the account.

This issue occurs when AWS denies the per-bucket reachability probe for those buckets. Data Explorer omits unreachable buckets silently. An omitted bucket is indistinguishable from one that does not exist.

To resolve, grant `s3:ListBucket` on each missing bucket under the `data` subject.

#### A Studio starts but its data does not mount

The Studio session reaches a running state, and Fusion reports `store not found` without naming a bucket, an API call, or a credential.

This issue occurs when the trust policy is correct but the permission policy has no statement for the `studio` subject. The token exchange succeeds, and AWS denies every request the session makes afterwards.

To resolve, add a permission-policy statement for the `studio` subject covering the buckets the Studio mounts. See [Permission policies][wif-permission-policies].

#### A pipeline launch is refused with `WORK_DIR_INVALID`

The launch fails before the run starts, and the error names the subject and the bucket. If AWS refused the token exchange itself, the message names the subject only.

This issue occurs when AWS denies the [launch bucket probe][wif-probe]. Either the trust policy does not admit the `workflow` subject, or the permission policy does not grant bucket listing for that subject. In the first case, the token exchange returns `AccessDenied`.

To resolve, confirm the trust policy wildcards the workload segment, then grant `s3:ListBucket` under the `workflow` subject on the work-directory bucket and every allowed bucket.

#### Forge fails with `iam:CreateRole` or `iam:PassRole` denied

Batch Forge or Cloud Forge fails to create the compute environment, and the error names `iam:CreateRole` or `iam:PassRole`.

This issue occurs when the role has no Forge statement. Forge presents the `platform` subject.

To resolve, add the Forge statement and keep the resource scope on your Forge prefix (`TowerForge-*` by default, or the value of `TOWER_FORGE_PREFIX`). See [Batch Forge and Cloud Forge][wif-forge].

#### No user appears in CloudTrail

A CloudTrail event carries no source identity and no per-user tags.

This is expected for a `platform`-subject session, for a Studio shared with the workspace, and for background work such as data link cache refresh and job polling. These sessions have no acting user to record.

#### Presigned URLs expire sooner than configured

A presigned download or upload URL stops working before the expiry you configured.

This is expected. A presigned URL cannot outlive the AWS Security Token Service (STS) session that signed it, and that session lasts up to approximately one hour.

## Google Cloud

#### A credential is `INVALID` with `Cannot validate Google WIF Security Keys`

The credential's status is `INVALID`, and its reason starts with `Cannot validate Google WIF Security Keys, reason:`.

Credential validation exchanges a token with the Security Token Service, impersonates the service account, and lists buckets in the pool's project. The rest of the reason shows which step failed:

- `Unable to refresh sourceCredentials`: the Security Token Service rejected the token. Check the provider's issuer URL, audience, and attribute condition, and that the credential's **Workload identity provider** uses the project number and its **Token audience** is empty.
- `Error requesting access token`: Google denied impersonation. Check that the pool's principal holds Workload Identity User (`roles/iam.workloadIdentityUser`) on the service account's **Principals with access** tab, and that the principal uses the pool's project number and pool ID. The same role on the service account's **Permissions** tab, or Service Account User, does not allow impersonation.
- A message that names `storage.buckets.list`: impersonation succeeded, but the service account cannot list buckets in the pool's project. Grant `roles/storage.bucketViewer` on that project.

To resolve, fix the cause, allow a few minutes for the IAM change to apply, and select **Validate** on the credential. Platform does not re-check an `INVALID` credential on its own. Then validate each compute environment that became `INVALID` with it. See [Credential validation][wif-validation] and [Validate a compute environment manually][ce-validate].

#### The compute environment form cannot load buckets, zones, or machine types

The form reports `Unable to retrieve Google buckets`, `Unable to retrieve Google zones`, `Unable to retrieve Google machine types`, `Unable to retrieve Google machine images`, or `Unable to retrieve Google VPC networks and subnetworks`.

This issue occurs when the service account cannot list resources in the pool's project. The form's calls present the `platform` subject.

To resolve, grant `roles/storage.bucketViewer` and `roles/compute.viewer` on the pool's project.

#### Data Explorer cannot open or add a bucket

Opening or adding a bucket fails with `Insufficient permissions to access bucket 'BUCKET'. Ensure the credentials have the 'storage.buckets.get' permission.`

This issue occurs when the service account holds object-level roles only. Platform reads the bucket's metadata before each listing, and neither `roles/storage.objectViewer` nor `roles/storage.objectAdmin` includes `storage.buckets.get`.

To resolve, grant `roles/storage.bucketViewer` on the bucket or its project.

#### Data Explorer shows no buckets, or not the ones you expect

The credential is valid, but Data Explorer lists no buckets or omits buckets you know exist.

This issue occurs when the service account lacks `storage.buckets.list` on the pool's project, or when the bucket is in another project. Data Explorer discovers buckets in the pool's project only. After a failed listing, Platform retries after 10 minutes, then after 20 minutes, then once a day. Updating the credential clears the cached list and lists again.

To resolve, grant `storage.buckets.list` on the pool's project. To show a bucket from another project, add it with **Add data repository**.

#### Previews and downloads fail in Data Explorer

You can browse a bucket, but previewing or downloading a file fails.

This issue occurs when the service account cannot sign URLs as itself. Platform signs preview and download URLs through the IAM `signBlob` API, and the service account makes that call on itself.

To resolve, bind `roles/iam.serviceAccountTokenCreator` on the service account to itself. See [Impersonation and permissions][wif-impersonation].

#### Batch job logs do not load

Log views for a Google Cloud Batch run fail, and Platform's log shows `Unable to resolve GCP project name for project number`.

This issue occurs when the service account cannot read the pool's project. Platform resolves the project name from its number before it queries Cloud Logging.

To resolve, grant `roles/logging.viewer` on the pool's project. It includes `resourcemanager.projects.get` and the log read permission.

#### A pipeline launch is refused with `WORK_DIR_INVALID`

The launch fails before the run starts, and the error names the subject and the bucket.

This issue occurs when Google Cloud denies the [launch bucket probe][wif-probe]. The probe lists the root of the work-directory bucket, not the work-directory prefix. A grant conditioned on the work-directory prefix is denied. VPC Service Controls or organization policies can also deny the probe, because it runs from your Platform instance's network location.

To resolve, grant the service account `storage.objects.list` on the work-directory bucket itself.

#### Google requests fail once workload identity federation applies to the workspace

Credential validation reports `Error requesting access token`, and the compute environment form, Data Explorer, and log views fail. By default this starts when you upgrade to Seqera Platform Enterprise 26.2, or when you add the workspace to `TOWER_IDENTITY_FEDERATION_ALLOWED_WORKSPACES`.

This issue occurs when the impersonation binding names one subject or one `attribute.workload` value. In a workspace where federation does not apply, every Google request presents the `workflow` subject. Federation applies to every organization workspace by default, and then requests present `platform`, `data`, or `studio`, which that binding does not admit. A bucket binding cannot cause this, because Cloud Storage sees the service account, not the subject.

To resolve, bind the whole pool or `attribute.workspace` rather than a specific subject or workload. See [Existing Google Cloud credentials][wif-existing-gcp].

[wif]: ../credentials/workload_identity
[wif-enable]: ../credentials/workload_identity#enable-workload-identity-federation
[wif-probe]: ../credentials/workload_identity#pipeline-launch-bucket-probe
[wif-permission-policies]: ../credentials/workload_identity#permission-policies
[wif-forge]: ../credentials/workload_identity#batch-forge-and-cloud-forge
[wif-validation]: ../credentials/workload_identity#credential-validation
[wif-impersonation]: ../credentials/workload_identity#impersonation-and-permissions
[wif-existing-gcp]: ../credentials/workload_identity#existing-google-cloud-credentials
[ce-validate]: ../compute-envs/preflight-checks#validate-a-compute-environment-manually
