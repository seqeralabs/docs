---
title: "Google Cloud"
description: "Instructions to set up an Google Cloud CE in Seqera Platform"
date created: "2025-07-15"
last updated: "2026-07-07"
tags: [cloud, vm, google, compute environments]
---

:::note
This compute environment type is currently in public preview. Consult this guide for the latest information on recommended configuration and limitations. This guide assumes you already have a GCP account with a valid subscription.
:::

Many of the current implementations of compute environments for cloud providers rely on the use of batch services such as AWS Batch, Azure Batch, and Google Batch for the execution and management of submitted jobs, including pipelines and Studio session environments. Batch services are suitable for large-scale workloads, but they add management complexity. In practical terms, the currently used batch services result in some limitations:

- **Long launch delay**: When you launch a pipeline or Studio in a batch compute environment, there's a delay of several minutes before the pipeline or Studio session environment is in a running state. This is caused by the batch services that need to provision the associated compute service to run a single job.
- **Complex setup**: Standard batch services require complex identity management policies and configuration of multiple components including batch job definitions, task specifications, resource policies, etc.

The Google Cloud compute environment addresses these pain points with:

- **Faster startup time**: By eliminating the per-task overhead of VM provisioning, environment bootstrapping, and container image pulling that occurs with traditional batch, Nextflow pipelines reach a `Running` status and Studio sessions connect in under a minute (a 4x improvement compared to classic GCP Batch compute environments).
- **Simplified configuration**: Fewer configurable options, with opinionated defaults, provide the best Nextflow pipeline and Studio session execution environment, with both Wave and Fusion enabled.
- **Fewer GCP dependencies**: Direct use of Compute Engine eliminates the reliance on Google Batch APIs and reduces the required IAM permissions to core services (Compute Engine, Cloud Storage, and IAM), resulting in a simpler architecture with fewer potential points of failure.

This type of compute environment is best suited to run Studios and small to medium-sized pipelines. It offers more predictable compute pricing, given the fixed instance types. It spins up a standalone Google Compute Engine instance and executes a Nextflow pipeline or Studio session with a local executor on the Google Compute Engine machine. At the end of the execution, the instance is terminated.

## Limitations

The Nextflow pipeline will run entirely on a single Google Compute Engine instance. If the instance does not have sufficient resources, the pipeline execution will fail. For this reason, the number of tasks Nextflow can execute in parallel is limited by the number of cores of the instance type selected. If you need more computing resources, you must create a new compute environment with a larger instance type. This makes the compute environment less suited for larger, more complex pipelines.

## Supported locations

The following locations are currently supported:

- `asia-east1`
- `asia-east2`
- `asia-northeast1`
- `asia-northeast2`
- `asia-northeast3`
- `asia-south1`
- `asia-south2`
- `asia-southeast1`
- `asia-southeast2`
- `australia-southeast1`
- `australia-southeast2`
- `europe-central2`
- `europe-north1`
- `europe-southwest1`
- `europe-west1`
- `europe-west2`
- `europe-west3`
- `europe-west4`
- `europe-west6`
- `europe-west8`
- `europe-west9`
- `europe-west10`
- `europe-west12`
- `me-central1`
- `me-west1`
- `northamerica-northeast1`
- `northamerica-northeast2`
- `southamerica-east1`
- `southamerica-west1`
- `us-central1`
- `us-east1`
- `us-east4`
- `us-east5`
- `us-south1`
- `us-west1`
- `us-west2`
- `us-west3`
- `us-west4`

## Requirements

### Platform credentials

To create and launch pipelines or Studio sessions with this compute environment type, you must attach Seqera credentials for the cloud provider. Some permissions are mandatory for the compute environment to be created and function correctly; others are used to pre-fill Platform options, which are optional.

### Required permissions

#### Service account permissions​

[Create a custom service account](https://cloud.google.com/iam/docs/service-accounts-create#creating) with at least the following permissions:

- Compute instance admin (`roles/compute.instanceAdmin.v1`)
- Project IAM admin (`roles/resourcemanager.projectIamAdmin`)
- Service Account Admin (`roles/iam.serviceAccountAdmin`)
- Service Account User (`roles/iam.serviceAccountUser`)
- Service Usage Consumer (`roles/serviceusage.serviceUsageConsumer`)

If your Google Cloud project does not require access restrictions on any of its Cloud Storage buckets, you can grant project Storage Admin (`roles/storage.admin`) permissions to your service account to simplify setup. To grant access only to specific buckets, add the service account as a principal [on each bucket individually](https://docs.seqera.io/platform-cloud/compute-envs/google-cloud-batch#cloud-storage-bucket). For each Google Cloud compute environment created in the Seqera platform, a separate service account is created with the necessary permissions to launch pipelines/studios.

:::caution
On shared GCP projects, `roles/resourcemanager.projectIamAdmin` allows the service account to grant any role to any principal on the project — a compromised credential can escalate to any project-level role. Similarly, `roles/iam.serviceAccountAdmin` grants create and delete access to any service account in the project. As an advanced hardening option, add an [IAM condition](https://cloud.google.com/iam/docs/conditions-overview) to the `roles/iam.serviceAccountAdmin` binding to restrict it to service accounts whose names start with `towerforge-`.
:::

#### Userdata script error detection (optional)

Platform can retrieve the serial port output of the Compute Engine instance to detect errors in the userdata script that bootstraps the VM during instance startup. This capability is included in the `roles/compute.instanceAdmin.v1` role listed above. If you use a custom role instead, include the `compute.instances.getSerialPortOutput` permission. Without this permission, userdata script failures are not detected, and no warning is shown.

### Authentication methods

Seqera supports two methods for authenticating with Google Cloud:

#### Service account keys

To authenticate using a service account key, create a [service account JSON key file](https://cloud.google.com/iam/docs/keys-list-get#get-key):

1. In the Google Cloud navigation menu, select **IAM & Admin > Service Accounts**.
2. Select the email address of the service account.
3. Select **Keys > Add key > Create new key**.
4. Select **JSON** as the key type.
5. Select **Create**.

A JSON file is downloaded to your computer. This file contains the credential needed to configure the compute environment in Seqera.

#### Workload Identity Federation

Workload Identity Federation (WIF) is the recommended authentication method for production and regulated environments because it eliminates the need for long-lived service account keys. WIF uses short-lived OIDC tokens for authentication, which are generated by Seqera Platform.

Platform's OIDC issuer is the issuer value advertised at `https://cloud.seqera.io/api/.well-known/openid-configuration`.

##### Enable APIs

Before setting up WIF, enable the following APIs for your Google Cloud project:

- [Cloud Resource Manager API](https://console.cloud.google.com/marketplace/product/google/cloudresourcemanager.googleapis.com) (`cloudresourcemanager.googleapis.com`)
- [IAM API](https://console.cloud.google.com/marketplace/product/google/iam.googleapis.com) (`iam.googleapis.com`)
- [IAM Service Account Credentials API](https://console.cloud.google.com/marketplace/product/google/iamcredentials.googleapis.com) (`iamcredentials.googleapis.com`)
- [Cloud Logging API](https://console.cloud.google.com/marketplace/product/google/logging.googleapis.com) (`logging.googleapis.com`)
- [Security Token Service API](https://console.cloud.google.com/marketplace/product/google/sts.googleapis.com) (`sts.googleapis.com`)

:::note
The Compute Engine, Cloud Storage, and Secret Manager APIs (`compute.googleapis.com`, `storage.googleapis.com`, `secretmanager.googleapis.com`) are also required. Enable them if not already active in your project.
:::

##### Set up WIF in the GCP Console

Setting up WIF requires the following steps in the GCP Console:

1. Create a [Workload Identity Pool and Provider](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers) in your Google Cloud project.
2. Set Seqera as an OIDC provider within the pool. Set the **Issuer URL** to `https://cloud.seqera.io/api`.
3. Set the **Allowed audiences**. If left empty, GCP derives a default audience from the provider resource path in the format `//iam.googleapis.com/projects/{PROJECT}/locations/global/workloadIdentityPools/{POOL}/providers/{PROVIDER}`. If you specify a custom value, it must match exactly what you enter in the **Token audience** field when creating the WIF credential in Seqera.
4. Define an attribute mapping and condition. At a minimum, set `google.subject=assertion.sub`. This maps the subject claim from Seqera's JWT to GCP's identity space. For more information, see [Attribute mappings and conditions](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers#mappings-and-conditions). You may see a pop-up asking to configure your application and provide an OIDC ID token path — dismiss it.
5. Grant `roles/iam.workloadIdentityUser` on the service account that WIF will impersonate to the Workload Identity Pool principal. This can be scoped to all pool identities or to a specific workspace:
   - **All identities in the pool**: `principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/*`
   - **Specific workspace only**: `principal://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/subject/org:{ORG_ID}:wsp:{WORKSPACE_ID}:workflow`

   If you have not yet created a service account, do so following the guidelines under [Service account permissions](#service-account-permissions).

6. (Optional) If you use the same WIF credential for [Data Explorer][data-explorer], grant `roles/iam.serviceAccountTokenCreator` on the service account to the Workload Identity Pool principal:

   ```bash
   gcloud iam service-accounts add-iam-policy-binding SA_EMAIL \
     --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/*" \
     --role="roles/iam.serviceAccountTokenCreator"
   ```

   Replace `SA_EMAIL`, `PROJECT_NUMBER`, and `POOL_ID` with your values. Without this role, viewing or downloading file contents in Data Explorer fails. Seqera Platform logs the underlying error as `SigningException: Failed to sign the provided bytes` caused by `Permission 'iam.serviceAccounts.signBlob' denied`. Running pipelines is not affected.

   To scope this binding to a specific workspace, replace the `principalSet` wildcard with `principal://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/subject/org:{ORG_ID}:wsp:{WORKSPACE_ID}:workflow`.

##### Configure WIF credentials in Seqera

After setting up WIF in the GCP Console, you need the following information to create a WIF credential in Seqera Platform:

1. **Service Account Email**: The email address of the Google Cloud service account that WIF will impersonate.
2. **Workload Identity Provider**: The full resource path of the Workload Identity Provider, e.g., `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID`.
3. **Token Audience** (optional): The intended audience for the OIDC token. Configure this only if your Workload Identity Provider requires a specific audience value. Ensure this matches the **Allowed audiences** value configured in the GCP console.

:::caution
If WIF authentication fails at runtime, verify that:

- The service account has the required roles (see [Service account permissions](#service-account-permissions)).
- The Workload Identity Pool principal has `roles/iam.workloadIdentityUser` on the service account.
- The Issuer URL configured in the WIF provider matches Platform's OIDC issuer URL (`https://cloud.seqera.io/api`).
- The Token Audience in the credential (if set) matches the Allowed audiences in the WIF provider.
:::

## Advanced options

- **Use an ARM64 architecture instance**: Select this option to enable an ARM architecture instance to be created for your compute workload. This option defaults to using a [C4A machine series](https://cloud.google.com/compute/docs/general-purpose-machines#c4a_series) VM with Google's ARM-based Axion™ processor.
- **User GPU-enabled instance**: Select this option to enable a GPU-enabled instance to be created for your compute workload. This option defaults to using an [A2 machine series](https://cloud.google.com/compute/docs/gpus) VM with an NVIDIA A100 GPU.
- **Instance type**: The Compute Engine machine type used by the compute environment. Choosing the instance type will directly allocate the CPU and memory available for computation. See the [machine resource type documentation](https://cloud.google.com/compute/docs/machine-resource) for a comprehensive list of instance types and their resource limitations.
 :::note
 It is not possible to specify instance templates with predefined machine types, storage, bootstrapped, etc.
 :::
- **Image**: The image defining the operating system and pre-installed software for the VM. Currently only [Ubuntu LTS](https://cloud.google.com/compute/docs/images/os-details#ubuntu_lts) Google public image project images are available and supported. For GPU-enabled instances, a Deep Learning VM base image with CUDA pre-installed is automatically selected (See [Google Deep Learning VM Images](https://cloud.google.com/deep-learning-vm/docs/images#base_versions) for more details). Optimized, Seqera-owned custom images will be available in a future release.
- **Boot disk size**: The size of the boot disk for the Compute Engine instance. A standard persistent disk (`pd-standard`) is used. If undefined, a default 50 GB volume will be used.
- **Zone**: The [zone](https://cloud.google.com/compute/docs/regions-zones) within the selected region where the VM will be provisioned (defaults to the first zone in the alphabetical list).

[data-explorer]: ../data/data-explorer
