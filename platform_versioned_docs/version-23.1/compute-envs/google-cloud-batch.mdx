---
title: "Google Cloud Batch"
description: "Instructions to set up Google Cloud Batch in Nextflow Tower"
date: "21 Apr 2023"
tags: [google, batch, gcp, compute environment]
---

This guide assumes you have an existing Google Cloud account. Sign-up for a free account [here](https://cloud.google.com/).

Tower provides integration to Google Cloud via the [Batch API](https://cloud.google.com/batch/docs/reference/rest).

The guide is split into two parts:

1. How to configure your Google Cloud account to use the Batch API.

2. How to create a Google Cloud Batch compute environment in Tower.

## Configure Google Cloud

### Create a project

Navigate to the [Google Project Selector page](https://console.cloud.google.com/projectselector2) and select an existing project or select **Create project**.

Enter a name for your new project, e.g., "tower-nf".

If you are part of an organization, the location will default to your organization.

### Enable billing

See [these instructions](https://cloud.google.com/billing/docs/how-to/modify-project) to enable billing in your Google Cloud account.

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

### Create a service account key

1. In the navigation menu, select **IAM & Admin**, then **Service Accounts**.

2. Select the email address of the **Compute Engine default service account**.

3. Select **Keys**, then **Add key**, then **Create new key**.

4. Select **JSON** as the key type.

5. Select **Create**.

A JSON file will be downloaded to your computer. This file contains the credential needed to configure the compute environment in Tower.

You can manage your key from the **Service Accounts** page.

### Create a Cloud Storage bucket

1. In the navigation menu (**≡**), select **Cloud Storage**, then **Create bucket**.

2. Enter a name for your bucket. You will reference this name when creating the compute environment in Tower.

   :::caution
   Do not use underscores (`_`) in your bucket name. Use hyphens (`-`) instead.
   :::

3. Select **Region** for the **Location type** and select the **Location** for your bucket. You will reference this location when creating the compute environment in Tower.

4. Select **Standard** for the default storage class.

5. Select **Uniform** for the **Access control**.

   :::note
   The Batch API is available in a limited number of [locations](https://cloud.google.com/batch/docs/locations). These locations are only used to store metadata about the pipeline operations. The storage bucket and compute resources can be in any region.
   :::

6. Select **Create**.

7. Once the bucket is created, you will be redirected to the **Bucket details** page.

8. Select **Permissions**, then **+ Add**.

9. Copy the email address of the Compute Engine default service account into **New principals**.

10. Select the following roles:

- Storage Admin
- Storage Legacy Bucket Owner
- Storage Legacy Object Owner
- Storage Object Creator

:::tip
You have created a project, enabled the necessary Google APIs, created a bucket, and created a JSON file with the required credentials. You are now ready to set up a new compute environment in Tower.
:::

### Compute environment

:::caution
The following guide to configure Tower assumes you have (1) a service account key for a Google Cloud account and (2) the name and location of a Cloud Storage bucket.
:::

To create a new compute environment for Google Cloud in Tower:

1. In a workspace, select **Compute Environments** and then **New Environment**.

2. Enter a descriptive name for this environment, e.g., "Google Cloud Batch (europe-north1)".

3. Select **Google Cloud Batch** as the target platform.

4. From the **Credentials** drop-down, select existing Google credentials, or select **+** to add new credentials. If you have existing credentials, skip to step 7.

5. Enter a name for the credentials, e.g. "Google Cloud Credentials".

6. Enter the **Service account key** [created previously](#create-a-service-account-key).

7. Select the [**Location**](https://cloud.google.com/compute/docs/regions-zones#available) where you wish to execute pipelines.

8. In the **Pipeline work directory** field, enter your storage bucket URL, e.g., `gs://my-bucket`. This bucket should be accessible in the location selected in the previous step.

9. Select **Enable Wave containers** to facilitate access to private container repositories and provision containers in your pipelines using the Wave containers service. See [Wave containers](https://www.nextflow.io/docs/latest/wave.html) for more information.

10. Select **Enable Fusion v2** to allow access to your GCS-hosted data via the [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system. This speeds up most data operations. The Fusion v2 file system requires Wave containers to be enabled (see above). <!--(re-added once we have GCP Fusion instructions) See [Fusion file system](../supported_software/fusion/fusion.mdx) for configuration details.-->

11. Enable **Spot** to use Spot instances, which have significantly reduced cost compared to On-Demand instances.

12. Apply [**Resource labels**](../resource-labels/overview.mdx) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.

13. Expand **Staging options** to include optional pre- or post-run Bash scripts that execute before or after the Nextflow pipeline execution in your environment.

14. You can use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

15. Configure any advanced options described below, as needed.

16. Select **Create** to finalize the compute environment setup.

Jump to the documentation for [launching pipelines](../launch/launchpad.mdx).

### Advanced options

<!--Needs elaboration, try with Esha-->

- Enable **Use Private Address** to ensure that your Google Cloud VMs aren't accessible to the public internet.

- Use **Boot disk size** to control the boot disk size of VMs.

- Use **Head Job CPUs** and **Head Job Memory** to specify the CPUs and memory allocated for head jobs.

<!-- Reach out to Esha, Maxime, and Marcel for their Nextflow-on-GCP-Batch?-->
