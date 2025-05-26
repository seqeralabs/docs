---
title: "Google Cloud Batch"
description: "Instructions to set up Google Cloud Batch in Seqera Platform"
date: "21 Apr 2023"
tags: [google, batch, gcp, compute environment]
---

:::note
This guide assumes you have an existing Google Cloud account. Sign up for a free account [here](https://cloud.google.com/). Seqera Platform provides integration to Google Cloud via the [Batch API](https://cloud.google.com/batch/docs/reference/rest).
:::

The guide is split into two parts:

1. How to configure your Google Cloud account to use the Batch API.
2. How to create a Google Cloud Batch compute environment in Seqera.

## Configure Google Cloud

### Create a project

Go to the [Google Project Selector page](https://console.cloud.google.com/projectselector2) and select an existing project, or select **Create project**.

Enter a name for your new project, e.g., _tower-nf_.

If you are part of an organization, the location will default to your organization.

### Enable billing

See [here](https://cloud.google.com/billing/docs/how-to/modify-project) to enable billing in your Google Cloud account.

### Enable APIs

See [here](https://console.cloud.google.com/flows/enableapi?apiid=batch.googleapis.com%2Ccompute.googleapis.com%2Cstorage-api.googleapis.com) to enable the following APIs for your project:

- Batch API
- Compute Engine API
- Cloud Storage API

Select your project from the dropdown menu and select **Enable**.

Alternatively, you can enable each API manually by selecting your project in the navigation bar and visiting each API page:

- [Batch API](https://console.cloud.google.com/marketplace/product/google/batch.googleapis.com)

- [Compute Engine API](https://console.cloud.google.com/marketplace/product/google/compute.googleapis.com)

- [Cloud Storage API](https://console.cloud.google.com/marketplace/product/google/storage-api.googleapis.com)

### IAM

Seqera requires a service account with appropriate permissions to interact with your Google Cloud resources. As an IAM user, you must have access to the service account that will be submitting Batch jobs.

:::caution
By default, Google Cloud Batch uses the default Compute Engine service account to submit jobs. This service account is granted the Editor (`roles/Editor`) role. While this service account has the necessary permissions needed by Seqera, this role is not recommended for production environments. Control job access using a custom service account with only the permissions necessary for Seqera to execute Batch jobs instead.
:::

#### Service account permissions

[Create a custom service account][create-sa] with at least the following permissions:

- Batch Agent Reporter (`roles/batch.agentReporter`) on the project
- Batch Job Editor (`roles/batch.jobsEditor`) on the project
- Logs Writer (`roles/logging.logWriter`) on the project (to let jobs generate logs in Cloud Logging)
- Service Account User (`roles/iam.serviceAccountUser`)

If your Google Cloud project does not require access restrictions on any of its Cloud Storage buckets, you can grant project Storage Admin (`roles/storage.admin`) permissions to your service account to simplify setup. To grant access only to specific buckets, add the service account as a principal on each bucket individually. See [Cloud Storage bucket](#cloud-storage-bucket) below.

#### User permissions

Ask your Google Cloud administrator to grant you the following IAM user permissions to interact with your custom service account:

- Batch Job Editor (`roles/batch.jobsEditor`) on the project
- Service Account User (`roles/iam.serviceAccountUser`) on the job's service account (default: Compute Engine service account)
- View Service Accounts (`roles/iam.serviceAccountViewer`) on the project

To configure a credential in Seqera, you must first create a [service account JSON key file][get-json]:

1. In the Google Cloud navigation menu, select **IAM & Admin > Service Accounts**.
2. Select the email address of the service account.

    :::note
    The Compute Engine default service account is not recommended for production environments due to its powerful permissions. To use a service account other than the Compute Engine default, specify the service account email address under **Advanced options** on the Seqera compute environment creation form.
    :::

3. Select **Keys > Add key > Create new key**.
4. Select **JSON** as the key type.
5. Select **Create**.

A JSON file will be downloaded to your computer. This file contains the credential needed to configure the compute environment in Seqera.

You can manage your key from the **Service Accounts** page.

### Cloud Storage bucket

Google Cloud Storage is a type of **object storage**. To access files and store the results for your pipelines, create a **Cloud bucket** that your Seqera service account can access.

#### Create a Cloud Storage bucket

1. In the hamburger menu (**≡**), select **Cloud Storage**.
2. From the **Buckets** tab, select **Create**.
3. Enter a name for your bucket. You will reference this name when you create the compute environment in Seqera.
4. Select **Region** for the **Location type** and select the **Location** for your bucket. You'll reference this location when you create the compute environment in Seqera.

    :::note
    The Batch API is available in a limited number of [locations][batch-locations]. These locations are only used to store metadata about the pipeline operations. The storage bucket and compute resources can be in any region.
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
You've created a project, enabled the necessary Google APIs, created a bucket, and created a service account JSON key file with the required credentials. You now have what you need to set up a new compute environment in Seqera.
:::

### Seqera compute environment

:::caution
Your Seqera compute environment uses resources that you may be charged for in your Google Cloud account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

After your Google Cloud resources have been created, create a new Seqera compute environment:

1. In a workspace, select **Compute Environments > New Environment**.
2. Enter a descriptive name for this environment, e.g., _Google Cloud Batch (europe-north1)_.
3. Select **Google Cloud Batch** as the target platform.

#### Credentials

1. From the **Credentials** drop-down, select existing Google credentials or select **+** to add new credentials. If you choose to use existing credentials, skip to the next section.
2. Enter a name for the credentials, e.g., _Google Cloud Credentials_.
3. Paste the contents of the JSON file created previously in the **Service account key** field.

#### Location and work directory

Select the **Location** where you will execute your pipelines. See [Location][location] to learn more.

In the **Pipeline work directory** field, enter your storage bucket URL, e.g., `gs://my-bucket`. This bucket must be accessible in the location selected in the previous step.

:::note
When you specify a Cloud Storage bucket as your work directory, this bucket is used for the Nextflow [cloud cache](https://www.nextflow.io/docs/latest/cache-and-resume.html#cache-stores) by default. You can specify an alternative cache location with the **Nextflow config file** field on the pipeline [launch](../launch/launchpad#launch-form) form.
:::

#### Seqera features

Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers][wave-docs] for more information.

Select **Enable Fusion v2** to allow access to your GCS-hosted data via the [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled in the previous step. See [Fusion file system][platform-fusion-docs] for configuration details.

:::note
Wave containers and Fusion v2 are recommended features for added capability and improved performance, but neither are required to execute workflows in your compute environment.
:::

#### GCP resources

Enable **Spot** to use Spot instances, which have significantly reduced cost compared to On-Demand instances.

Apply [**Resource labels**][resource-labels] to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.

#### Scripting and environment variables

Expand **Staging options** to include optional [pre- or post-run Bash scripts][pre-post-run-scripts] that execute before or after the Nextflow pipeline execution in your environment.

Specify custom **Environment variables** for the head and compute jobs.

#### Advanced options

:::note
If you use VM instance templates for the head or compute jobs (see step 6 below), resource allocation and networking values specified in the templates override any conflicting values you specify while creating your Seqera compute environment.
:::

1. Enable **Use Private Address** to ensure that your Google Cloud VMs aren't accessible to the public internet.
2. Use **Boot disk size** to control the boot disk size of VMs.
3. Use **Head Job CPUs** and **Head Job Memory** to specify the CPUs and memory allocated for head jobs.
4. Use **Service Account email** to specify a service account email address other than the Compute Engine default to execute workflows with this compute environment (recommended for productions environments).
5. Use **VPC** and **Subnet** to specify the name of a VPC network and subnet to be used by this compute environment. If your organization's VPC architecture relies on network tags, you can apply network tags to VM instance templates used for the Nextflow head and compute jobs (see below).

    :::note
    You must specify both a **VPC** and **Subnet** for your compute environment to use either.
    :::

6. Use **Head job instance template** and **Compute jobs instance template** to specify the name or fully-qualified reference of a VM instance template, without the `template://` prefix, to use for the head and compute jobs. [VM instance templates][gcp-vm-instance-template] allow you to define the resources allocated to Batch jobs. Configuration values defined in a VM instance template override any conflicting values you specify while creating your Seqera compute environment.

    You can use network tags in VM instance templates to enable cross-network and cross-project distribution of compute resources. This is useful if your head and compute instances must reside in different GCP projects or across isolated networking infrastructures. Note that the use of network tags does not affect the resource labels applied to your compute environment.

    :::caution
    Seqera does not validate the VM instance template you specify in these fields. Generally, use templates that define only the machine type, network, disk, and configuration values that will not change across multiple VM instances and Seqera compute environments. See [Create instance templates](https://cloud.google.com/compute/docs/instance-templates/create-instance-templates) for instructions to create your instance templates.

    To prevent errors during workflow execution, ensure that the instance templates you use are suitably configured for your needs with an appropriate machine type. You can define multiple instance templates with varying machine type sizes in your Nextflow configuration using the `machineType` [process directive](https://www.nextflow.io/docs/latest/google.html#process-definition) (e.g., `process.machineType = 'template://my-template-name'`). You can use [process selectors](https://www.nextflow.io/docs/latest/config.html#config-process-selectors) to assign separate templates to each of your processes.
    :::

Select **Create** to finalize the compute environment setup.

See [Launch pipelines](../launch/launchpad) to start executing workflows in your Google Cloud Batch compute environment.

[batch-locations]: https://cloud.google.com/batch/docs/locations
[create-sa]: https://cloud.google.com/iam/docs/service-accounts-create#creating
[get-json]: https://cloud.google.com/iam/docs/keys-list-get#get-key
[location]: https://cloud.google.com/compute/docs/regions-zones#available
[wave-docs]: https://www.nextflow.io/docs/latest/wave.html
[platform-fusion-docs]: ../supported_software/fusion/overview
[pre-post-run-scripts]: ../launch/advanced#pre-and-post-run-scripts
[resource-labels]: ../resource-labels/overview
[gcp-vm-instance-template]: https://cloud.google.com/compute/docs/instance-templates
