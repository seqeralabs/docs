---
title: "Workload identity federation"
description: "Authenticate Seqera Platform to AWS and Google Cloud without long-lived credentials."
date created: "2026-09-17"
last updated: "2026-09-30"
tags: [credentials, aws, google cloud, oidc, workload identity]
---

With workload identity federation, Seqera Platform securely connects to your cloud provider account without storing a long-lived workspace credential. Seqera Platform mints a short-lived, signed OpenID Connect (OIDC) token that names your organization, workspace, and the kind of work in progress. Your cloud provider exchanges that token for temporary credentials against a role you control.

Workload identity federation is an authentication mode on the AWS and Google Cloud credentials, not a separate credential type. You select it when you create the credential. Seqera Platform stores only a role reference: an Identity and Access Management (IAM) role Amazon Resource Name (ARN) for AWS, or a workload identity provider path and service account email for Google Cloud. You have no access key, service account key, or secret to rotate.

:::info
Workload identity federation is available for AWS and Google Cloud. Azure is not supported.
:::

## Enable workload identity federation

Workload identity federation requires Seqera Platform Enterprise 26.2 or later. It is enabled in every organization workspace by default, and works once your instance is configured as follows:

- Set `TOWER_OIDC_PEM_PATH` to an RSA keypair. This variable turns on the OIDC provider in Seqera Platform. With it unset, Seqera Platform serves no JSON Web Key Set (JWKS) endpoint and no token exchange can complete. See [Cryptographic options][crypto-options].
- Optionally, set `TOWER_IDENTITY_FEDERATION_ALLOWED_WORKSPACES` to a comma-separated list of workspace IDs to restrict workload identity federation to those workspaces. If you omit the variable or set it empty, every workspace can use it.
- Set `TOWER_OIDC_REGISTRATION_INITIAL_ACCESS_TOKEN` to a random value. Setting `TOWER_OIDC_PEM_PATH` also opens the OIDC client registration endpoint, and without this token anyone who can reach the API can register a client. See [Data features][data-features].
- Serve Seqera Platform over public HTTPS. AWS and Google Cloud both fetch `{issuer}/.well-known/openid-configuration` and `{issuer}/.well-known/jwks.json` directly. Neither works against a host it cannot reach. Workload identity federation cannot run on `localhost`.

:::info
Personal workspaces cannot use the workload identity federation credential mode, regardless of configuration.
:::

To generate the keypair:

```bash
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
cat private.pem public.pem > oidc.pem
```

Platform signs every federation token with RS256 using this keypair, and gives it the audience your cloud provider expects. `TOWER_AUTH_TOKEN_SIGNING_RS256_ENABLED`, `TOWER_OIDC_ACCESS_TOKEN_AUDIENCE`, and `TOWER_OIDC_AUDIENCE_ENFORCEMENT_ENABLED` apply to Platform's own session and access tokens. Workload identity federation does not need them.

If you have not set an RSA keypair, authentication fails. On Google Cloud, the error is `WIF credentials require the OIDC provider to be configured (tower.oidc.pem.path)`. On AWS, it is `AWS OIDC workload identity requires the OIDC provider to be configured (tower.oidc.pem.path)`.

## What Platform sends to your cloud provider

Platform does not store a cloud credential. For each call, it mints a short-lived token and exchanges it with your cloud provider for temporary credentials. Your trust policy and permissions decide what those credentials can do. Every organization sets this up differently, so this section describes exactly what Platform sends. The setup sections that follow show one way to configure it.

### AWS

Platform calls `sts:AssumeRoleWithWebIdentity` with the following values:

| Field | Value |
| --- | --- |
| `RoleArn` | The role ARN in the credential |
| `RoleSessionName` | `seqera-{workload}`, for example `seqera-data` or `seqera-studio` |
| `WebIdentityToken` | A JSON Web Token (JWT) that Platform signs with RS256. It is valid for 300 seconds by default. |

The token carries the following claims:

| Claim | Value | Present |
| --- | --- | --- |
| `iss` | Your Platform URL followed by `/api`, for example `https://seqera.example.com/api` | Always |
| `sub` | The subject. See [Subjects and attribution](#subjects-and-attribution). | Always |
| `aud` | `sts.amazonaws.com` | Always |
| `iat`, `exp`, `jti` | Issue time, expiry, and a unique token ID | Always |
| `principal_id` | The acting user's ID | When a user is acting |
| `principal_email` | The acting user's email address | When a user is acting and has an address |
| `https://aws.amazon.com/tags` | The session tags below, all marked transitive | Always |
| `https://aws.amazon.com/source_identity` | The acting user's email address, or their ID when the address does not meet AWS's source identity rules | When a user is acting |

AWS turns the tags claim into these session tags:

| Tag | Value | Present |
| --- | --- | --- |
| `seqera:org` | Organization ID | Organization workspaces |
| `seqera:workspace` | Workspace ID | Organization workspaces |
| `seqera:principal-id` | The acting user's ID | When a user is acting |
| `seqera:principal-email` | The acting user's email address | When a user is acting and the address fits AWS's tag character set |
| `seqera:workload` | `platform`, `data`, `studio`, or `workflow` | Always |

Credential validation sends the fixed source identity `seqera-validation` instead of a user. This checks, when you save the credential, that the trust policy allows `sts:SetSourceIdentity`. Without the check, a credential could validate and then fail on its first call that names a user.

### Google Cloud

Platform exchanges the token with the Google Cloud Security Token Service for a federated token. It then impersonates the service account with `generateAccessToken`, requesting the `https://www.googleapis.com/auth/cloud-platform` scope.

The token carries the same `iss`, `sub`, `iat`, `exp`, and `jti` claims as on AWS, plus `principal_id` and `principal_email` when a user is acting. Its `aud` is the provider resource name, `//iam.googleapis.com/projects/{PROJECT_NUMBER}/locations/global/workloadIdentityPools/{POOL}/providers/{PROVIDER}`, unless you set a custom token audience in the credential.

Google Cloud has no session tags or source identity. The acting user reaches Google Cloud Audit Logs only through the `google.subject` mapping. See [Attribute mapping][attribute-mapping].

For a workspace that is not in `TOWER_IDENTITY_FEDERATION_ALLOWED_WORKSPACES`, Platform sends the legacy `workflow` subject on every Google Cloud call, so existing trust configurations keep matching. A change to the allow list takes effect once Platform's cached client for the credential expires.

## Subjects and attribution

Every token Seqera Platform generates carries a subject (`sub`) that names the tenant and the kind of work making the request:

| Scope | Subject |
| --- | --- |
| Organization workspace | `org:{orgId}:wsp:{workspaceId}:{workload}` |
| Personal workspace | `usr:{userId}:{workload}` |

The trailing segment is the workload type. The following table shows the subject each call presents, and who it is attributed to in `principal_id`, the user session tags, and the source identity. Platform makes every call except a Studio's own mounts and SDK calls, which the Studio container makes through its own token exchange.

| Call | Subject | Attributed to |
| --- | --- | --- |
| Data Explorer bucket list, cached and refreshed in the background | `data` | Unattributed |
| Data Explorer browsing, previews, downloads, and uploads | `data` | The browsing user |
| Studio mount dialog | `data` | As for Data Explorer |
| Studio checkpoints and data-link cache refresh | `data` | Unattributed |
| A shared Studio's mounts and SDK calls | `studio` | Unattributed |
| A private Studio's mounts and SDK calls | `studio` | The allow-listed user, or the creator if the allow list is empty. Unattributed if more than one user is allowed. |
| Credential validation | `platform` | Unattributed. On AWS, the source identity is `seqera-validation`. |
| Compute environment describe and provisioning, Forge, job submission, log reads, and Secrets Manager | `platform` | Unattributed |
| Pipeline launch bucket probe | `workflow` | The launching user |
| The pipeline run itself | Not used | See [Pipeline runs](#pipeline-runs) and [Pipeline runs on Google Cloud](#pipeline-runs-on-google-cloud). |

Platform decides a private Studio's attribution each time the Studio starts, because its privacy and allow list can change between sessions.

One credential presents all four subjects. Write your trust policy and IAM bindings to admit all of them. A condition that matches only one subject breaks the rest of the product.

The acting user is not part of the subject for organization workspaces, because a trust policy is scoped to a workspace. Per-user information travels separately, in session tags and source identity. See [Cloud audit attribution][cloud-audit-attribution].

## Configure AWS

:::info[**Prerequisites**]

You need the following:

- An AWS account with permission to create IAM identity providers and roles.
- A Seqera Platform organization workspace with workload identity federation enabled.

:::

Seqera Platform shows the values to copy into AWS under **Credentials > AWS > Workload identity**: the issuer, all four subjects, and the session tag keys.

1. In the AWS console, go to **IAM > Identity providers > Add provider > OpenID Connect**.
1. Set **Provider URL** to `${TOWER_SERVER_URL}/api` and **Audience** to `sts.amazonaws.com`.
1. Select **Create role > Web identity**, then select the provider you created.
1. Replace the trust policy with the template in [Trust policy](#trust-policy).
1. Attach an inline permission policy. See [Permission policies](#permission-policies).
1. In Seqera Platform, create an AWS credential, select **Workload identity**, and enter the role ARN.

### Trust policy

Replace `{{ACCOUNT_ID}}` with your AWS account ID, `{{ISSUER_HOST}}` with your Platform host and its `/api` path, without the scheme (for example, `seqera.example.com/api`), and `{{ORG_ID}}` and `{{WORKSPACE_ID}}` with the values Platform shows in the credential form. Wildcard the workload segment so that one role serves every subject:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::{{ACCOUNT_ID}}:oidc-provider/{{ISSUER_HOST}}"
      },
      "Action": [
        "sts:AssumeRoleWithWebIdentity",
        "sts:TagSession",
        "sts:SetSourceIdentity"
      ],
      "Condition": {
        "StringEquals": {
          "{{ISSUER_HOST}}:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "{{ISSUER_HOST}}:sub": "org:{{ORG_ID}}:wsp:{{WORKSPACE_ID}}:*"
        }
      }
    }
  ]
}
```

:::note
The template uses the `aws` partition. In GovCloud or China, replace `arn:aws:` with `arn:aws-us-gov:` or `arn:aws-cn:` in both the `Federated` principal and the role ARN. The partition must match the one your role is in.
:::

Each part of the trust policy is required:

- `sts:AssumeRoleWithWebIdentity` performs the exchange.
- `sts:TagSession` is required because every token carries session tags. Without it, AWS rejects the entire exchange rather than dropping the tags.
- `sts:SetSourceIdentity` is required because tokens for a user's actions carry a source identity, and credential validation tests for it. Without it, AWS rejects the entire exchange.
- The `aud` condition accepts only tokens minted for STS.
- The tenant prefix in the `sub` condition is the security boundary. Without it, any organization or workspace on the same installation could assume the role. The trailing `*` admits every workload type, because one role serves all four. To let one role serve several workspaces, list each workspace's prefix in the condition.

### Permission policies

Grant the role the combined permissions of every workload it serves. The trust policy's tenant prefix keeps other organizations and workspaces out, so the permission policy does not need to repeat it. Credential validation needs nothing beyond the AWS Security Token Service (STS), so a credential can validate successfully and still have no data access.

| Workload | Needs |
| --- | --- |
| `platform` | Describe and job submission permissions for your compute environment, `s3:ListBucket` and `s3:GetObject` on the work directory, and the [Forge permissions](#batch-forge-and-cloud-forge) if Forge creates the environment |
| `data` | `s3:ListAllMyBuckets`, plus object access on the buckets Data Explorer shows and on the work directory, where Studio checkpoints are stored |
| `studio` | Object access on the buckets your Studios mount and on the work directory |
| `workflow` | `s3:ListBucket` on the work directory and the compute environment's allowed buckets, for the [launch probe](#pipeline-launch-bucket-probe) |

Grant bucket discovery on its own. Because `s3:ListAllMyBuckets` has no resource dimension, a denial fails the whole listing instead of returning fewer buckets:

```json
{
  "Sid": "ListBuckets",
  "Effect": "Allow",
  "Action": "s3:ListAllMyBuckets",
  "Resource": "*"
}
```

Grant object access on each bucket Data Explorer shows, each bucket your Studios mount, and the work directory:

```json
{
  "Sid": "Buckets",
  "Effect": "Allow",
  "Action": [
    "s3:ListBucket",
    "s3:GetBucketAcl",
    "s3:GetObject",
    "s3:PutObject",
    "s3:DeleteObject",
    "s3:AbortMultipartUpload"
  ],
  "Resource": [
    "arn:aws:s3:::BUCKET",
    "arn:aws:s3:::BUCKET/*"
  ]
}
```

`s3:GetBucketAcl` only lets Data Explorer mark public buckets. Without it, every bucket shows as private.

:::caution
When the trust policy is correct but the permission policy has no matching statement, the exchange succeeds and every request is denied afterwards. Inside a Studio, this surfaces as Fusion reporting `store not found`, and the message names no bucket, API call, or credential. If a Studio starts but its data does not mount, check the permission policy first.
:::

For compute environments, grant the describe permissions:

```json
{
  "Sid": "PlatformDescribe",
  "Effect": "Allow",
  "Action": [
    "ec2:Describe*",
    "batch:Describe*",
    "batch:List*",
    "ecs:Describe*",
    "ecs:List*",
    "eks:DescribeCluster",
    "eks:ListClusters",
    "iam:ListRoles",
    "logs:DescribeLogGroups",
    "logs:DescribeLogStreams",
    "logs:GetLogEvents"
  ],
  "Resource": "*"
}
```

When you create an AWS Batch compute environment, Platform checks that the work directory is in the environment's region, which needs `s3:ListBucket`. Platform reads task logs and files from the work directory, which needs `s3:GetObject`. The `Buckets` statement covers both when it includes the work directory.

To submit runs, add `batch:RegisterJobDefinition`, `batch:SubmitJob`, `batch:TerminateJob`, `batch:TagResource`, and `iam:PassRole`. Platform registers a job definition on the first launch that has no matching one. A role without `batch:RegisterJobDefinition` fails on its first run. AWS Batch compute environments need no EC2 launch permissions because Batch scales the environment with its own service role. AWS Cloud compute environments launch and terminate EC2 instances directly under the `platform` subject. Grant them the EC2 permissions listed in [AWS Cloud][aws-cloud-permissions] as well.

#### Narrow access by workload or user

The permissions above apply to every workload the role serves. To restrict a statement to one workload type, add a condition on the `seqera:workload` session tag, for example `"StringEquals": {"aws:PrincipalTag/seqera:workload": "data"}`. The `{{ISSUER_HOST}}:sub` condition key works too, because AWS keeps the `sub` claim available for the whole session. To restrict a statement by user, condition it on `seqera:principal-id`. See [Per-user access control](#per-user-access-control).

### Batch Forge and Cloud Forge

Batch Forge and Cloud Forge run under workload identity and present the `platform` subject. Grant IAM write permissions scoped to the `TowerForge-*` name prefix, and the compute permissions Forge uses to build the environment:

```json
{
  "Sid": "Forge",
  "Effect": "Allow",
  "Action": [
    "iam:CreateRole", "iam:DeleteRole", "iam:GetRole", "iam:TagRole", "iam:PassRole",
    "iam:AttachRolePolicy", "iam:DetachRolePolicy", "iam:ListAttachedRolePolicies",
    "iam:PutRolePolicy", "iam:DeleteRolePolicy", "iam:ListRolePolicies",
    "iam:CreateInstanceProfile", "iam:DeleteInstanceProfile", "iam:GetInstanceProfile",
    "iam:TagInstanceProfile",
    "iam:AddRoleToInstanceProfile", "iam:RemoveRoleFromInstanceProfile"
  ],
  "Resource": [
    "arn:aws:iam::{{ACCOUNT_ID}}:role/TowerForge-*",
    "arn:aws:iam::{{ACCOUNT_ID}}:instance-profile/TowerForge-*"
  ]
},
{
  "Sid": "ForgeCompute",
  "Effect": "Allow",
  "Action": [
    "batch:*ComputeEnvironment", "batch:*JobQueue", "batch:Describe*", "batch:TagResource",
    "ec2:CreateLaunchTemplate", "ec2:DeleteLaunchTemplate", "ec2:Describe*",
    "ssm:GetParameters",
    "elasticfilesystem:*", "fsx:*"
  ],
  "Resource": "*"
}
```

:::caution
Keep the resource scope. A principal that can call both `iam:CreateRole` and `iam:PassRole` without a resource scope can create a role more privileged than itself and then pass it. Forge names what it creates `{prefix}-{id}-{RoleKind}`, where the prefix defaults to `TowerForge` and is set by `TOWER_FORGE_PREFIX`. If your deployment overrides that variable, scope the policy to your own prefix instead. A policy scoped to `TowerForge-*` denies every Forge role creation on an installation that renamed it.
:::

Remove `elasticfilesystem:*` and `fsx:*` if the environment mounts neither. Cloud Forge needs the `Forge` statement and only the `ec2` actions from `ForgeCompute`.

### Pipeline runs

Workload identity federation authenticates Platform's own calls: compute environment setup, job submission, Data Explorer, and Studios. A pipeline run does not use it yet. The Nextflow head job and every task it launches read the EC2 instance role from instance metadata, so the workload identity role plays no part once the job starts. Before the launch, though, Platform checks that the run's buckets are reachable, under the `workflow` subject and attributed to the launching user. See [Pipeline launch bucket probe](#pipeline-launch-bucket-probe).

The instance role needs the permissions Nextflow uses. On AWS Batch, that is S3 on the work-directory bucket, plus Batch, ECS, EC2, and CloudWatch Logs. Do not condition these grants on `:sub`, because an instance-profile session presents no OIDC subject. On a compute environment that Forge creates, Forge writes these grants. On one you create manually, add them to the instance role yourself.

:::caution
Leave `TOWER_WIF_FORGE_LEGACY_MODE_ENABLED` at its default, `true`. With `false`, Forge grants the instance role no data access, and a compute environment it creates for a workload identity credential cannot run a pipeline, because the head job starts with no credentials. Studios and compute environment provisioning are unaffected. The variable applies to the whole installation. Forge reads it when it creates a compute environment, so changing it does not affect existing ones.
:::

## Configure Google Cloud

:::info[**Prerequisites**]

You need the following:

- A Google Cloud project with permission to create workload identity pools and service accounts.
- A Seqera Platform organization workspace with workload identity federation enabled.

:::

Seqera Platform shows the values to copy into Google Cloud under **Credentials > Google > Workload Identity**: the OIDC issuer URL, the `google.subject` mapping, and the recommended attribute condition.

:::note
Platform treats the project in the **Workload identity provider** path, the project that hosts the pool, as the credential's project. Credential validation and Data Explorer list buckets in that project. Compute environments run their jobs and VMs there, and Platform creates pipeline secrets and reads Cloud Logging there. The service account can live in another project, but it needs its roles on the pool's project. Google recommends keeping pools in a [dedicated project][gcp-wif-dedicated-project]. With Platform, that dedicated project is also where these calls go.
:::

1. In the project that will host the pool, enable the IAM, Resource Manager, Service Account Credentials, and Security Token Service APIs. See [Configure Workload Identity Federation][gcp-wif-configure].
1. In the Google Cloud console, go to the **New workload provider and pool** page. Under **Create an identity pool**, enter a **Name** and **Description**, then select **Continue**. The name is also the pool ID, and you can't change it later.
1. Under **Configure provider settings**, in **Select a provider**, select **OpenID Connect (OIDC)**. Enter a **Provider name**, which is also the provider ID, and set **Issuer URL** to `${TOWER_SERVER_URL}/api`. See [Create a workload identity pool and provider][gcp-wif-pool].
1. Under **Audiences**, keep **Default audience**. The console shows it as `https://iam.googleapis.com/projects/{PROJECT_NUMBER}/locations/global/workloadIdentityPools/{POOL}/providers/{PROVIDER}`. Platform sends the same path without the scheme, `//iam.googleapis.com/projects/{PROJECT_NUMBER}/locations/global/workloadIdentityPools/{POOL}/providers/{PROVIDER}`, and the default audience accepts both forms. If you select **Allowed audiences** instead, add the `//iam.googleapis.com/...` form to the list. Select **Continue**.
1. Under **Configure provider attributes**, set the `google.subject` mapping. Under **Attribute conditions**, enter the recommended condition. Select **Save**. See [Attribute mapping][attribute-mapping].
1. Create or select a service account, and set up the two grants that [credential validation](#credential-validation) needs before you continue. They are on different tabs of the service account's page:
   - **Permissions** tab, for what the service account can access: select **Manage access** and add Storage Bucket Viewer (`roles/storage.bucketViewer`). This grants the role on the service account's own project, so it only works when that is also the pool's project. Otherwise, grant it on the pool project's **IAM** page, with the service account as the principal.
   - **Principals with access** tab, for who can act as the service account: select **Grant access**, enter the pool's principal, and add Workload Identity User (`roles/iam.workloadIdentityUser`). Without it, Platform cannot use the service account at all. Don't add this role on the **Permissions** tab or in the create flow. Those grant roles to the service account itself, which does not let the pool act as it.

   Without both, Platform saves the credential but marks it `INVALID`. IAM changes can take a few minutes to apply. For the principal to enter and the permissions each workload needs, see [Impersonation and permissions][impersonation-and-permissions].
1. In Seqera Platform, create a Google credential, select **Workload Identity**, and enter:
   - **Workload identity provider**: The provider resource name, in the form `projects/{PROJECT_NUMBER}/locations/global/workloadIdentityPools/{POOL}/providers/{PROVIDER}`. Use the project number, not the project ID. See [Identifying projects][gcp-project-number].
   - **Service account email**: The service account to impersonate, in the form `NAME@PROJECT_ID.iam.gserviceaccount.com`.
   - **Token audience** (optional): Leave it empty, so that Platform uses the provider path as the audience.

   The credential uses workload identity federation only when both **Service account email** and **Workload identity provider** are set. Saving the credential runs [credential validation](#credential-validation).

:::caution
A pool or provider resource ID is immutable. To change one, create a replacement rather than renaming it.
:::

### Attribute mapping

Set the `google.subject` mapping on the OIDC provider:

```
assertion.sub + (has(assertion.principal_id) ? ':usr:' + assertion.principal_id : '')
```

This mapping appends the acting user to the tenant subject. The subject Google records in its audit logs then identifies a specific user, for example `org:{{ORG_ID}}:wsp:{{WORKSPACE_ID}}:data:usr:{{USER_ID}}`. The `has()` guard keeps background tokens valid. Background tokens carry no `principal_id` and fall back to the tenant-only subject. Without the guard, their exchange fails with `Could not obtain a value for google.subject`. See [Mappings and conditions][gcp-wif-mappings].

:::caution
Map the user through `google.subject`, not a custom `attribute.user`. Custom attributes work in IAM conditions and `principalSet` bindings, but Google never writes them to audit logs. Only `google.subject` reaches the log.
:::

Set the attribute condition Platform recommends in the credential form:

```
assertion.sub.startsWith('org:{{ORG_ID}}:wsp:{{WORKSPACE_ID}}:')
```

Without this condition, a whole-pool impersonation binding accepts subjects minted for any other tenant on the same Platform installation. Use a prefix rather than an exact match, because every workload type must pass, including the `workflow` subject Platform sends for workspaces where federation is not enabled.

### Impersonation and permissions

Allow the pool's identities to impersonate the service account. Grant the pool's principal the Workload Identity User role (`roles/iam.workloadIdentityUser`) on the service account itself, not on the project. A project-level grant [applies to every service account in the project][gcp-sa-project-grants]. See [Service account impersonation][gcp-wif-impersonation].

Build the principal from the credential's **Workload identity provider** value. Drop the `/providers/PROVIDER` segment, prefix `principalSet://iam.googleapis.com/`, and end with `/*` for every identity in the pool, or with `/attribute.workspace/WORKSPACE_ID` for one workspace:

| | Value |
| --- | --- |
| **Workload identity provider** | `projects/123456789012/locations/global/workloadIdentityPools/seqera-pool/providers/seqera-oidc` |
| Principal for every identity in the pool | `principalSet://iam.googleapis.com/projects/123456789012/locations/global/workloadIdentityPools/seqera-pool/*` |
| Principal for one workspace | `principalSet://iam.googleapis.com/projects/123456789012/locations/global/workloadIdentityPools/seqera-pool/attribute.workspace/67890` |

The principal uses the pool's project number and pool ID, not the project ID or the pool's display name. See [Principal identifiers][gcp-principal-identifiers].

To grant the role in the Google Cloud console:

1. Go to the **Service Accounts** page, select the service account's project, and select the service account's email address.
1. Open the **Principals with access** tab and select **Grant access**.
1. Enter the principal.
1. Assign the **Workload Identity User** role, then select **Save**.

See [Grant a single role][gcp-sa-grant-role]. Service Account User (`roles/iam.serviceAccountUser`) does not work here. It lacks `iam.serviceAccounts.getAccessToken`, so Google denies impersonation.

To grant it with the gcloud CLI:

```bash
gcloud iam service-accounts add-iam-policy-binding SA_EMAIL \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL/*"
```

The whole-pool principal admits every identity that passes the provider's attribute condition, which is one workspace with the recommended condition. If one pool serves several workspaces, Google recommends [against granting access to all members of a pool][gcp-wif-avoid-all-members]. Add the attribute mapping `attribute.workspace = assertion.sub.extract("wsp:{workspace}:")`, and bind each workspace's service account to its one-workspace principal. One such binding covers all of that workspace's workloads.

:::caution
Do not bind an exact subject (`principal://.../POOL/subject/SUBJECT`) or an `attribute.workload` value. Both break when a subject changes shape. Use a pool-wide or `attribute.workspace` binding.
:::

Platform signs presigned download URLs through the IAM `signBlob` API, which needs `roles/iam.serviceAccountTokenCreator` on the service account bound to itself:

```bash
gcloud iam service-accounts add-iam-policy-binding SA_EMAIL \
  --role=roles/iam.serviceAccountTokenCreator \
  --member="serviceAccount:SA_EMAIL"
```

Without this binding, viewing or downloading file contents in Data Explorer fails with a signing error. Pipeline runs are unaffected.

Grant the service account the combined permissions of every workload it serves. Every workload impersonates the same service account, and Google Cloud evaluates the service account as the principal, so a grant applies to every workload type.

| Workload | Needs |
| --- | --- |
| `platform` | `storage.buckets.list` on the pool's project, for [credential validation](#credential-validation) and the compute environment form. Object read on the work directory, for run logs and reports. The describe, job submission, and log permissions for your compute environment. See [Pipeline runs on Google Cloud](#pipeline-runs-on-google-cloud). |
| `data` | `storage.buckets.list` on the pool's project, plus the Data Explorer permissions below on the buckets Data Explorer shows and on the work directory, where Studio checkpoints are stored |
| `studio` | Object access on the buckets your Studios mount and on the work directory |
| `workflow` | `storage.objects.list` on the work-directory bucket, for the [launch probe](#pipeline-launch-bucket-probe) |

For Data Explorer, the service account needs both bucket-level and object-level permissions:

| Permission | Needed for |
| --- | --- |
| `storage.buckets.list` | Listing the buckets in the pool's project that Data Explorer shows |
| `storage.buckets.get` | Opening a bucket or adding one to Data Explorer. Platform reads the bucket's metadata before each listing. |
| `storage.objects.list`, `storage.objects.get` | Browsing and downloading |
| `storage.objects.create` | Uploading |
| `storage.objects.delete` | Deleting |

Object roles such as `roles/storage.objectViewer` include no bucket permissions, so with only those, the service account can't list or open buckets in Data Explorer. Grant these two roles:

- `roles/storage.bucketViewer` on the pool's project, to list and open buckets. Listing buckets is a project-level action, so a grant on a single bucket isn't enough.
- `roles/storage.objectAdmin` on each bucket, to browse, download, upload, and delete.

Data Explorer discovers buckets in the pool's project only. To browse a bucket in another project, add it with **Add data repository**, and grant the service account `storage.buckets.get` and object access on it. See [Add data repository links][data-explorer-add].

### Credential validation

Platform validates the credential when you save it, and re-checks a valid credential about every 12 hours. The check presents the `platform` subject, or `workflow` in a workspace that `TOWER_IDENTITY_FEDERATION_ALLOWED_WORKSPACES` leaves out. It runs the whole chain: it exchanges a token with the Security Token Service, impersonates the service account, and lists buckets in the pool's project. It passes only when all of the following are true:

- The provider accepts the token: the issuer URL, audience, and attribute condition all match.
- The pool's principal holds the Workload Identity User role on the service account.
- The service account holds the `storage.buckets.list` permission on the pool's project, for example through `roles/storage.bucketViewer`.

Unlike on AWS, where validation needs nothing beyond the token exchange, a Google credential with a correct trust setup still fails validation without `storage.buckets.list` on the pool's project.

A failed check marks the credential `INVALID`, with a reason that starts with `Cannot validate Google WIF Security Keys, reason:`. Throttling and Google server errors leave the status unchanged. Platform does not re-check an `INVALID` credential on its own. After you fix the cause, select **Validate** on the credential. See [Validate a credential manually][preflight-validate]. IAM changes typically take 2 minutes to apply, and sometimes 7 minutes or longer. See [Access change propagation][gcp-iam-propagation].

### Pipeline runs on Google Cloud

As on AWS, a pipeline run does not use workload identity federation. The Nextflow head job and its tasks authenticate as the service account attached to their VMs.

On Google Cloud Batch, that is the compute environment's **Service account email**. If you leave it empty, Platform sets it to the credential's own service account, so the head job and every task run as that service account. It then needs the [Google Cloud Batch service account permissions][gcp-batch-sa-permissions], and its Service Account User role (`roles/iam.serviceAccountUser`) must cover itself, because Platform submits the jobs as the same account. Google requires Service Account User on a job's service account to create the job. See [Control access for a job using a custom service account][gcp-batch-custom-sa].

For Platform's own calls under the `platform` subject, the service account also needs the following on the pool's project:

- `roles/compute.viewer`, for the zones, machine types, images, and networks in the compute environment form.
- `roles/logging.viewer`, to read Google Cloud Batch job logs from Cloud Logging. It includes `resourcemanager.projects.get`, which Platform needs to resolve the project name from its number.
- `roles/secretmanager.admin`, if your pipelines use secrets. Platform creates and deletes pipeline secrets in the pool's project.

On Google Cloud compute environments, Cloud Forge creates a service account for the VM, under the `platform` subject. With `TOWER_WIF_FORGE_LEGACY_MODE_ENABLED` at its default, `true`, Forge grants it `roles/storage.objectAdmin` on the work-directory bucket, and `roles/logging.logWriter`, `roles/monitoring.metricWriter`, `roles/storage.bucketViewer`, and `roles/storage.objectViewer` on the pool's project. With `false`, Forge grants only `roles/logging.logWriter` and `roles/monitoring.metricWriter`, and the VM has no storage access of its own. The caution in [Pipeline runs](#pipeline-runs) applies. The credential's service account needs the [Google Cloud permissions][gcp-cloud-permissions] that Forge uses to create these resources.

### Existing Google Cloud credentials

Before workload identity federation, a Google workload identity credential always presented the `workflow` subject. The credential now presents `platform`, `data`, `studio`, or `workflow`, depending on the request.

:::caution
If you already use a Google workload identity credential, check your impersonation bindings before you upgrade. Workload identity federation is on in every organization workspace by default, so the subject fans out when you upgrade. A binding against the exact subject (`principal://.../POOL/subject/org:{{ORG_ID}}:wsp:{{WORKSPACE_ID}}:workflow`) or against an `attribute.workload` value then stops matching, and the workspace loses access. Move those bindings to a pool-wide (`POOL/*`) or `attribute.workspace` form first. Both read the tenant part of the subject, which does not change. To keep a workspace on the `workflow` subject while you move its bindings, set `TOWER_IDENTITY_FEDERATION_ALLOWED_WORKSPACES` to a list that leaves it out. See [Google Cloud](#google-cloud).
:::

## Cloud audit attribution

Workload identity sessions carry the acting user's identity into your cloud provider's audit log. You can attribute a request to a specific Seqera user. The two providers record the identity differently:

| | What the audit log records | What it takes |
| --- | --- | --- |
| **AWS** | The assumed IAM role on every entry, plus the acting user as session tags on the exchange event and as a source identity on every request in the session | Only the trust policy. Platform always attaches the tags, and a source identity whenever a user is acting. The trust policy must grant `sts:TagSession` and `sts:SetSourceIdentity` or the exchange fails outright |
| **Google Cloud** | The mapped subject, which carries the acting user only if the `google.subject` mapping appends `principal_id` | The guarded mapping in [Attribute mapping][attribute-mapping], and Data Access audit logs, which are off by default and billed separately |

The identifier differs by provider. On AWS, the source identity is the user's email where one is known, and their ID otherwise. On Google Cloud, `principal_id` is always an internal numeric ID.

### AWS

Every session carries the session tags in [What Platform sends to your cloud provider](#aws), and a source identity when a user is behind the request.

Use tags to authorize a request and source identity to trace it. `aws:PrincipalTag/*` matches tags. CloudTrail records them as `principalTags` on the `AssumeRoleWithWebIdentity` event only, never on the requests made afterwards. CloudTrail records source identity on every request in the session, in `userIdentity.sessionContext.sourceIdentity`. Source identity is the only way to determine who read a given object.

The role session name is `seqera-{workload}`, so CloudTrail shows the workload type in every assumed-role ARN.

To scope one role across many workspaces, use the workspace tag as a policy variable:

```json
{
  "Sid": "PerWorkspaceBucket",
  "Effect": "Allow",
  "Action": [
    "s3:ListBucket",
    "s3:GetObject"
  ],
  "Resource": [
    "arn:aws:s3:::wsp-${aws:PrincipalTag/seqera:workspace}",
    "arn:aws:s3:::wsp-${aws:PrincipalTag/seqera:workspace}/*"
  ]
}
```

#### Per-user access control

Workload identity federation resolves to one role per workspace, not one role per user. Every user in the workspace assumes the same role and, by default, has the same cloud permissions.

Per-user access control comes from your IAM policy, not from Platform. Condition a statement on the `seqera:principal-id` tag, and your cloud provider decides what that user can reach. An explicit `Deny` beats every `Allow`. To deny one person access to a bucket:

```json
{
  "Sid": "BlockUser",
  "Effect": "Deny",
  "Action": "s3:*",
  "Resource": [
    "arn:aws:s3:::BUCKET",
    "arn:aws:s3:::BUCKET/*"
  ],
  "Condition": {
    "StringEquals": {
      "aws:PrincipalTag/seqera:principal-id": "{{USER_ID}}"
    }
  }
}
```

:::caution
A deny list allows every new user by default. Allow-listing by team is not possible because Platform does not emit team membership as a session tag. Plan your policies around denying named users rather than admitting named teams.

A `seqera:principal-id` condition also has no effect inside a Studio shared with the workspace. A shared session carries no acting user. The tag is absent, and the session reaches whatever the `studio` statement grants. To limit what a shared Studio can reach, scope the `Studios` statement's `Resource` to those buckets instead.
:::

Note the following when you write policies against these values:

- Platform asserts the tag values. AWS trusts the provider and does not verify them.
- Condition on `seqera:principal-id`, which is stable. Use `seqera:principal-email` for reading only. Addresses are mutable and reassignable, and absent for service accounts.
- A condition on an absent tag does not match. A statement requiring `seqera:principal-id` denies every `platform` session and all background work, such as cache refresh and job polling.
- Renaming these keys is a breaking change, because they appear in your IAM policies.

### Google Cloud

Google Cloud Audit Logs record only the mapped `google.subject`. Custom claims and attributes never reach the log. Organization, workspace, and workload type are traceable because they are part of the base subject. The acting user is traceable only if the `google.subject` mapping appends `principal_id`. See [Attribute mapping][attribute-mapping].

Cloud Storage reads and writes are Data Access audit logs, which are off by default. Enable them on the project or service account to see Data Explorer activity. Previews and downloads use a URL signed by the service account, so Cloud Storage logs them as the service account. The token exchange and impersonation entries need Data Access **Admin Read** for the Security Token Service and IAM Service Account Credentials APIs.

`principal_id` is an internal numeric user ID, not an email address.

### Requests with no acting user

Background work (data link cache refresh, Studio checkpoints, and job polling) carries no acting user. Neither does a Studio shared with the workspace, because no single person operates a shared session for its whole life. Those entries show the tenant subject with no per-user attribution.

## Pipeline launch bucket probe

When the preflight check is enabled, compute environments that use workload identity probe the work directory before a launch. A run that cannot reach its work directory fails immediately instead of part-way through.

On AWS, the probe performs a fresh, uncached token exchange with the `workflow` subject, then calls `ListObjectsV2` with `maxKeys=1` against the work directory and each of the compute environment's allowed buckets. Grant `s3:ListBucket` on each of those buckets under the `workflow` subject.

On Google Cloud, the probe lists the root of the work-directory bucket rather than the work-directory prefix, and it does not check allowed buckets. Grant `storage.objects.list` on the bucket itself. A grant conditioned on the work-directory prefix is denied.

An explicit `AccessDenied` refuses the launch with `WORK_DIR_INVALID`, naming the subject and the bucket. When AWS refuses the token exchange itself, the message names the subject only, because no bucket was reached. A trust policy that does not admit the `workflow` subject fails the same way. The token exchange returns `AccessDenied`, and the launch is refused rather than allowed. Inconclusive responses (throttling, quota, billing, and timeouts) log a warning and allow the launch. Platform does not probe credentials that use access keys or an assumed role.

:::note
The Google Cloud probe runs from your Platform instance's network location. VPC Service Controls or organization policies can deny that request even when a Batch job inside the permitted perimeter could reach the bucket.
:::

## Credential revocation

Platform briefly caches the temporary cloud credentials it derives from a workload identity credential. Editing or deleting the credential, or removing a user from the workspace, drops the affected cache entries immediately across all nodes.

Platform cannot recall access it has already handed out:

- On AWS, a presigned URL embeds the temporary credential and stays valid until that credential expires, up to approximately one hour.
- On Google Cloud, a presigned URL is signed by the service account and stays valid for the Data Explorer URL duration, one day by default, regardless of the credential's lifetime.
- A running Studio keeps renewing its workload identity until it stops, for up to three days by default. Deleting the credential or removing the user does not end a running session's access. To cut it off, stop the Studio, or change the role's trust policy or the service account's impersonation binding.

## Limitations

- Azure is not supported. Azure federated identity credentials match the subject claim by exact string. That would require one federated credential per workspace per workload type, against a cap of 20 per identity. Flexible federated identity credentials solve this with wildcard matching, but only for a fixed list of Microsoft-supported issuers that Platform cannot join.
- You cannot change an AWS credential's mode after creation. To move an existing AWS credential to workload identity, create a new credential. Google credentials have no mode field, and you can update them in place.
- On AWS, Data Explorer omits buckets the credential cannot reach rather than showing them as inaccessible, so you cannot distinguish an omitted bucket from one that does not exist. This applies to every AWS credential type, not only workload identity federation.
- The credential form accepts only `arn:aws:` role ARNs. To use a role in the `aws-us-gov` or `aws-cn` partition, create the credential through the API.
- You can create AWS workload identity credentials through version 1 of the API only. Google workload identity credentials are available in both versions.
- [Data lineage][data-lineage] does not support workload identity credentials. Platform builds its lineage bucket and SNS topic clients without a workload identity, so lineage works only with key-based or role-based AWS credentials.
- A trust policy error does not prevent credential creation. Saving runs the token exchange, but a failed exchange does not roll back the create. Read the credential's status to confirm the exchange succeeded.

For token exchange, permission, and audit attribution failures, see [Workload identity troubleshooting][wif-troubleshooting].

[crypto-options]: ../enterprise/configuration/overview#cryptographic-options
[data-features]: ../enterprise/configuration/overview#data-features
[data-lineage]: ../data/data-lineage
[gcp-wif-pool]: https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#create-pool-provider
[gcp-wif-mappings]: https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#mappings-and-conditions
[gcp-wif-configure]: https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#configure
[gcp-wif-impersonation]: https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#impersonation
[gcp-wif-dedicated-project]: https://cloud.google.com/iam/docs/best-practices-for-using-workload-identity-federation#dedicated-project
[gcp-wif-avoid-all-members]: https://cloud.google.com/iam/docs/best-practices-for-using-workload-identity-federation#avoid-all-members
[gcp-principal-identifiers]: https://cloud.google.com/iam/docs/principal-identifiers#allow
[gcp-project-number]: https://cloud.google.com/resource-manager/docs/view-update-projects#identifying_projects
[gcp-sa-project-grants]: https://cloud.google.com/iam/docs/best-practices-service-accounts#project-folder-grants
[gcp-sa-grant-role]: https://cloud.google.com/iam/docs/manage-access-service-accounts#grant-single-role
[gcp-iam-propagation]: https://cloud.google.com/iam/docs/access-change-propagation
[gcp-batch-custom-sa]: https://cloud.google.com/batch/docs/create-run-job-custom-service-account#before-you-begin
[gcp-batch-sa-permissions]: ../compute-envs/google-cloud-batch#service-account-permissions
[gcp-cloud-permissions]: ../compute-envs/google-cloud#required-permissions
[preflight-validate]: ../compute-envs/preflight-checks#validate-a-credential-manually
[data-explorer-add]: ../data/data-explorer#add-data-repository-links
[aws-cloud-permissions]: ../compute-envs/aws-cloud#required-permissions
[wif-troubleshooting]: ../troubleshooting_and_faqs/workload_identity_troubleshooting
[cloud-audit-attribution]: #cloud-audit-attribution
[trust-policy]: #trust-policy
[permission-policies]: #permission-policies
[attribute-mapping]: #attribute-mapping
[impersonation-and-permissions]: #impersonation-and-permissions
