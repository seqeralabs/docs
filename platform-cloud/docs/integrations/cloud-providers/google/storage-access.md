---
title: "Google Cloud storage access"
description: "Cloud Storage bucket creation and permissions for Seqera Platform on Google Cloud."
tags: [gcp, google, storage, gcs, integration]
---

Google Cloud Storage is a type of **object storage**. Create a Cloud Storage bucket that your Seqera service account can access to use as the Nextflow work directory and to store input/output data.

## Create a Cloud Storage bucket

1. In the Google Cloud Console hamburger menu (**≡**), select **Cloud Storage**.
1. From the **Buckets** tab, select **Create**.
1. Enter a name for your bucket. You will reference this name in the Seqera compute environment.
1. Select **Region** for the **Location type** and select the **Location** for your bucket. You'll reference this location in the Seqera compute environment.

    :::note
    The Batch API is available in a [limited number of locations](https://cloud.google.com/batch/docs/locations). These locations are only used to store metadata about the pipeline operations — the storage bucket and compute resources can be in any region.
    :::

1. Select **Standard** as the default storage class.
1. To restrict public access, select the **Enforce public access prevention on this bucket** checkbox.
1. Under **Access control**, select **Uniform**.
1. Select any additional object data protection tools per your organization's data protection requirements.
1. Select **Create**.

## Assign bucket permissions

After the bucket is created, you are redirected to the **Bucket details** page.

1. Select **Permissions**, then **Grant access** under **View by principals**.
1. Copy the email address of your service account into **New principals**.
1. Select the **Storage Admin** role, then select **Save**.

:::tip
You've created a project, enabled the necessary Google APIs, created a bucket, and created a service account JSON key file with the required credentials. You now have what you need to set up a new compute environment in Seqera.
:::

## Next steps

- [Add credentials in Seqera](./credentials).
- Create the [Google Cloud Batch](/platform-cloud/compute-envs/google-cloud-batch) or [Google Cloud](/platform-cloud/compute-envs/google-cloud) compute environment.
