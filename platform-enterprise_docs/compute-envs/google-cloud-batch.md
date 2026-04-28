---
title: "Google Cloud Batch"
description: "Instructions to set up Google Cloud Batch in Seqera Platform"
date created: "2023-04-21"
last updated: "2026-04-16"
tags: [google, batch, gcp, compute environment]
---

# Google Cloud Batch

:::note
This guide assumes you have an existing Google Cloud account. Sign up for a free account [here](https://cloud.google.com/). Seqera Platform provides integration to Google Cloud via the [Batch API](https://cloud.google.com/batch/docs/reference/rest).
:::

The guide is split into two parts:

1. How to configure your Google Cloud account to use the Batch API.
2. How to create a Google Cloud Batch compute environment in Seqera.

## Configure Google Cloud

### Create a project

Go to the [Google Project Selector page](https://console.cloud.google.com/projectselector2) and select an existing project, or select **Create project**.

Enter a name for your new project, e.g., *tower-nf*.

If you are part of an organization, the location will default to your organization.

### Enable billing

See [here](https://cloud.google.com/billing/docs/how-to/modify-project) to enable billing in your Google Cloud account.

### Enable APIs

See [here](https://console.cloud.google.com/flows/enableapi?apiid=batch.googleapis.com%2Ccompute.googleapis.com%2Cstorage-api.googleapis.com) to enable the following APIs for your project:

* Batch API
* Compute Engine API
* Cloud Storage API

Select your project from the drop-down menu and select **Enable**.

Alternatively, you can enable each API manually by selecting your project in the navigation bar and visiting each API page:

* [Batch API](https://console.cloud.google.com/marketplace/product/google/batch.googleapis.com)
* [Compute Engine API](https://console.cloud.google.com/marketplace/product/google/compute.googleapis.com)
* [Cloud Storage API](https://console.cloud.google.com/marketplace/product/google/storage-api.googleapis.com)

### IAM

Seqera requires a service account with appropriate permissions to interact with your Google Cloud resources. As an IAM user, you must have access to the service account that submits Batch jobs.

:::caution
By default, Google Cloud Batch uses the default Compute Engine service account to submit jobs. This service account is granted the Editor (`roles/Editor`) role. While this service account has the necessary permissions needed by Seqera, this role is not recommended for production environments. Control job access using a custom service account with only the permissions necessary for Seqera to execute Batch jobs instead.
:::

#### Service account permissions

[Create a custom service account](https://cloud.google.com/iam/docs/service-accounts-create#creating) with at least the following permissions:

* Batch Agent Reporter (`roles/batch.agentReporter`) on the project
* Batch Job Editor (`roles/batch.jobsEditor`) on the project
* Logs Writer (`roles/logging.logWriter`) on the project (to let jobs generate logs in Cloud Logging)
* Service Account User (`roles/iam.serviceAccountUser`)
* Service Usage Consumer (`roles/serviceusage.serviceUsageConsumer`)

If your Google Cloud project does not require access restrictions on any of its Cloud Storage buckets, you can grant project Storage Admin (`roles/storage.admin`) permissions to your service account to simplify setup. To grant access only to specific buckets, add the service account as a principal on each bucket individually. See [Cloud Storage bucket](#cloud-storage-bucket) below.

#### User permissions

Ask your Google Cloud administrator to grant you the following IAM user permissions to interact with your custom service account:

* Batch Job Editor (`roles/batch.jobsEditor`) on the project
* Service Account User (`roles/iam.serviceAccountUser`) on the job's service account (default: Compute Engine service account)
* View Service Accounts (`roles/iam.serviceAccountViewer`) on the project

#### Authentication methods

Seqera supports two methods for authenticating with Google Cloud:

**Service account keys**

To authenticate using a service account key, create a [service account JSON key file](https://cloud.google.com/iam/docs/keys-list-get#get-key):

1. In the Google Cloud navigation menu, select **IAM & Admin > Service Accounts**.
2. Select the email address of the service account.

   :::note
   The Compute Engine default service account is not recommended for production environments due to its powerful permissions. To use a service account other than the Compute Engine default, specify the service account email address under **Advanced options** on the Seqera compute environment creation form.
   :::

3. Select **Keys > Add key > Create new key**.
4. Select **JSON** as the key type.
5. Select **Create**.

A JSON file is downloaded to your computer. This file contains the credential needed to configure the compute environment in Seqera.

You can manage your key from the **Service Accounts** page.

**Workload Identity Federation**

Workload Identity Federation (WIF) is the recommended authentication method for production and regulated environments because it eliminates the need for long-lived service account keys. WIF uses short-lived OIDC tokens for authentication, which are generated by Seqera Platform.

To authenticate using Workload Identity Federation, you must first configure a [Workload Identity Pool and Provider](https://cloud.google.com/iam/docs/workload-identity-federation-with-other-providers) in your Google Cloud project. 

WIF requires an OIDC signng key and for Seqera Platform's OIDC provider to  be configured. See [Cryptographic options](https://docs.seqera.io/platform-enterprise/enterprise/configuration/overview#cryptographic-options).

**Generate the OIDC signing key**

Generate a PEM keypair and configure Platform to use it:

```bash
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
cat private.pem public.pem > oidc.pem
```

Set `TOWER_OIDC_PEM_PATH` to the path of the `oidc.pem` file in your Platform deployment. For example:

`TOWER_OIDC_PEM_PATH=/path/to/oidc.pem`.

If you have not generated and set an RSA keypair as part of your Enterprise deployment, any authentication will fail with the message `WIF credentials require the OIDC provider to be configured (tower.oidc.pem.path)`. 

After setting up WIF in Google Cloud, you need the following information to create a credential in Seqera:

* **Service Account Email**: The email address of the Google Cloud service account that WIF will impersonate.
* **Workload Identity Provider**: The full resource path of the Workload Identity Provider (e.g., `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID`).
* **Token Audience** (optional): The intended audience for the OIDC token. Configure this if your Workload Identity Provider requires a specific audience value.

:::caution
If WIF authentication fails, verify that the Workload Identity Provider path is correctly formatted, the service account has the required permissions, and the Kubernetes service account is properly annotated for your deployment environment. Check your Seqera Platform logs for specific error details. A `400` error typically indicates an invalid provider format, while a `401` error indicates a token exchange failure.
:::

### Cloud Storage bucket

Google Cloud Storage is a type of **object storage**. To access files and store the results for your pipelines, create a **Cloud bucket** that your Seqera service account can access.

#### Create a Cloud Storage bucket

1. In the hamburger menu (**≡**), select **Cloud Storage**.
2. From the **Buckets** tab, select **Create**.
3. Enter a name for your bucket. You will reference this name when you create the compute environment in Seqera.
4. Select **Region** for the **Location type** and select the **Location** for your bucket. You'll reference this location when you create the compute environment in Seqera.

   :::note
   The Batch API is available in a limited number of [locations](https://cloud.google.com/batch/docs/locations). These locations are only used to store metadata about the pipeline operations. The storage bucket and compute resources can be in any region.
   :::

5. Select **Standard** for the default storage class.
6. To restrict public access to your bucket data, select the **Enforce public access prevention on this bucket** checkbox.
7. Under **Access control**, select **Uniform**.
8. Select any additional object data protection tools, per your organization's data protection requirements.
9. Select **Create**.

#### Assign bucket permissions

1. After the bucket is created, you are redirected to the **Bucket details** page.
2. Select **Permissions**, then **Grant access** under **View by principals**.
3. Copy the email address of your service account into **New principals**.
4. Select the **Storage Admin** role, then select **Save**.

:::tip
You've created a project, enabled the necessary Google APIs, created a bucket, and created credentials for your service account. You now have what you need to set up a new compute environment in Seqera.
:::

### Seqera compute environment

:::caution
Your Seqera compute environment uses resources that you may be charged for in your Google Cloud account. See [Cloud costs](https://docs.seqera.io/platform-enterprise/monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

After your Google Cloud resources have been created, create a new Seqera compute environment:

1. In a workspace, select **Compute Environments > New Environment**.
2. Enter a descriptive name for this environment, e.g., *Google Cloud Batch (europe-north1)*.
3. Select **Google Cloud Batch** as the target platform.

#### Credentials

1. From the **Credentials** drop-down, select existing Google credentials or select **+** to add new credentials. If you choose to use existing credentials, skip to the next section.
2. Enter a name for the credentials, e.g., *Google Cloud Credentials*.
3. Select the credential type:
   - **Google Service Account Key**: Paste the contents of the JSON key file created in the [service account keys](#authentication-methods) section.
   - **Google WIF**: Enter the **Service Account Email**, **Workload Identity Provider** path, and optionally the **Token Audience** as described in the [Workload Identity Federation](#authentication-methods) section.

#### Location and work directory

Select the **Location** where you will execute your pipelines. See [Location](https://cloud.google.com/compute/docs/regions-zones#available) to learn more.

In the **Pipeline work directory** field, enter your storage bucket URL, e.g., `gs://my-bucket`. This bucket must be accessible in the location selected in the previous step.

:::note
When you specify a Cloud Storage bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://docs.seqera.io/nextflow/cache-and-resume#cache-stores) by default. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
:::

#### Seqera features

Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers](https://docs.seqera.io/nextflow/wave) for more information.

Select **Enable Fusion v2** to allow access to your Google Cloud Storage data via the [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled. See [Fusion file system](../supported_software/fusion/overview) for configuration details.

Use Fusion v2

:::note
The compute recommendations below are based on internal benchmarking performed by Seqera. Benchmark runs of [nf-core/rnaseq](https://github.com/nf-core/rnaseq) used profile `test_full`, consisting of an input dataset with 16 FASTQ files and a total size of approximately 123.5 GB.
:::

1. Use Seqera Platform version 23.1 or later.
2. Use a Google Cloud Storage bucket as the pipeline work directory.
3. Enable **Wave containers** and **Fusion v2**.
4. Specify suitable virtual machine types and local storage settings, or accept the default machine settings listed below. An `n2-highmem-16-lssd` VM or larger is recommended for production use.

:::note
To specify virtual machine settings in Platform during compute environment creation, use the **Global Nextflow config** field to apply custom Nextflow process directives to all pipeline runs launched with this compute environment.

To specify virtual machine settings per pipeline run in Platform, or as a persistent configuration in your Nextflow pipeline repository, use Nextflow process directives. See [Google Cloud Batch process definition](https://docs.seqera.io/nextflow/google#process-definition) for more information.
:::

When Fusion v2 is enabled, the following virtual machine settings are applied:

* A 375 GB local NVMe SSD is selected for all compute jobs.
* If you do not specify a machine type, a VM from families that support local SSDs is selected.
* Any machine types you specify in the Nextflow config must support local SSDs.
* Local SSDs are only offered in multiples of 375 GB. You can increment the number of SSDs used per process with the `disk` directive to request multiples of 375 GB. To work with files larger than 100 GB, use at least two SSDs (750 GB or more).
* Fusion v2 can also use persistent disks for caching. Override the disk requested by Fusion using the `disk` directive and the `type: pd-standard`.
* The `machineType` directive can be used to specify a VM instance type, family, or custom machine type in a comma-separated list of patterns. For example, `c2-*`, `n1-standard-1`, `custom-2-4`, `n*`, `m?-standard-*`.

:::note
Wave containers and Fusion v2 are recommended features for added capability and improved performance, but neither are required to execute workflows in your compute environment.
:::

#### GCP resources

Enable **Spot** to use Spot instances, which have significantly reduced cost compared to On-Demand instances.

:::note
From Nextflow version 24.10, the default Spot reclamation retry setting changed to `0` on AWS and Google. By default, no internal retries are attempted on these platforms. Spot reclamations now lead to an immediate failure, exposed to Nextflow in the same way as other generic failures (returning for example, `exit code 1` on AWS). Nextflow will treat these failures like any other job failure unless you actively configure a retry strategy. For more information, see [Spot instance failures and retries](../troubleshooting_and_faqs/nextflow#spot-instance-failures-and-retries-in-nextflow).
:::

:::info
When a Spot instance is reclaimed by Google Cloud, Seqera Platform displays a human-readable description in the task details. Google Batch reserves exit codes in the 50001–59999 range for infrastructure events:

| Exit code | Description |
|-----------|-------------|
| 50001 | Spot instance was reclaimed by Google Cloud |
| 50002 | VM became unresponsive (host event or crash) |
| 50003 | VM unexpectedly rebooted during task execution |
| 50004 | Task reached unresponsive time limit and could not be cancelled |
| 50005 | Task exceeded maximum allowed runtime |

Exit codes 50006–59999 display a generic infrastructure failure message. Standard application exit codes (1–255) are displayed as before.
:::

Apply [**Resource labels**](../resource-labels/overview) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.

#### Scripting and environment variables

* Expand **Staging options** to include:

  + Optional [pre- or post-run Bash scripts](../advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
  + Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch.

  :::info
  Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](https://docs.seqera.io/platform-enterprise/launch/advanced#nextflow-config-file) for more information on configuration priority.
  :::

* Specify custom **Environment variables** for the head and compute jobs.

#### Advanced options

:::note
If you use VM instance templates for the head or compute jobs (see step 8 below), resource allocation and networking values specified in the templates override any conflicting values you specify while creating your Seqera compute environment.
:::

1. Enable **Use Private Address** to ensure that your Google Cloud VMs aren't accessible to the public internet.
2. Use **Boot disk size** to control the persistent disk size that each task and the head job are provided.
3. Use **Boot Disk Image** to select a specific boot disk image for the compute instances. The dropdown is populated with available images from the GCP Compute API and supports autocomplete filtering. This field is optional. If not set, Google Batch uses the default image.
4. Use **Instance Type** to select a specific machine type for the compute instances. The dropdown is populated with available instance types for the selected region and supports autocomplete filtering. This field is optional — if not set, Google Batch selects an appropriate machine type automatically.

   :::note
   The **Instance Type** field sets a default machine type at the compute environment level. You can override this for individual processes using the `machineType` [process directive](https://docs.seqera.io/nextflow/google#process-definition) in your Nextflow configuration.
   :::

5. Use **Head Job CPUs** and **Head Job Memory** to specify the CPUs and memory allocated for the head job.
6. Use **Service Account email** to specify a service account email address other than the Compute Engine default to execute workflows with this compute environment (recommended for production environments).
7. Use **VPC** and **Subnet** to specify the name of a VPC network and subnet to be used by this compute environment. You can apply network tags directly in the **Network Tags** field (see below) or through VM instance templates used for the Nextflow head and compute jobs.

   :::note
   You must specify both a **VPC** and **Subnet** for your compute environment to use either.
   :::

8. Use **Network Tags** to apply GCP network tags to the compute instances in this environment. Network tags control which firewall rules and routing policies apply to your instances within a VPC.

   Enter tags as free-text values. Tags must follow GCP format requirements: lowercase letters, numbers, and hyphens only, between 1 and 63 characters. You can add up to 64 tags per instance.

   :::note
   Network tags require a **VPC** and **Subnet** to be configured. This field is disabled when no VPC is set.
   :::

9. Use **Head job instance template** and **Compute jobs instance template** to specify the name or fully-qualified reference of a VM instance template, without the `template://` prefix, to use for the head and compute jobs. [VM instance templates](https://cloud.google.com/compute/docs/instance-templates) allow you to define the resources allocated to Batch jobs. Configuration values defined in a VM instance template override any conflicting values you specify while creating your Seqera compute environment.

   :::caution
   Seqera does not validate the VM instance template you specify in these fields. Generally, use templates that define only the machine type, network, disk, and configuration values that will not change across multiple VM instances and Seqera compute environments. See [Create instance templates](https://cloud.google.com/compute/docs/instance-templates/create-instance-templates) for instructions to create your instance templates.
   :::

   To prevent errors during workflow execution, ensure that the instance templates you use are suitably configured for your needs with an appropriate machine type. You can define multiple instance templates with varying machine type sizes in your Nextflow configuration using the `machineType` [process directive](https://docs.seqera.io/nextflow/google#process-definition) (e.g., `process.machineType = 'template://my-template-name'`). You can use [process selectors](https://docs.seqera.io/nextflow/config#config-process-selectors) to assign separate templates to each of your processes.

Select **Create** to finalize the compute environment setup.

:::info
See [Launch pipelines](https://docs.seqera.io/platform-enterprise/launch/launchpad) to start executing workflows in your Google Cloud Batch compute environment.
:::
