---
title: "Google Cloud credentials"
description: "Generate a service account JSON key and add Google Cloud credentials to Seqera Platform."
tags: [gcp, google, credentials, integration]
---

Seqera authenticates to Google Cloud using a service account JSON key file. The same procedure applies to both Google Cloud Batch and Google Cloud compute environments.

## Generate a service account JSON key

After creating a [custom service account with the required IAM roles](./iam), generate a JSON key:

1. In the Google Cloud navigation menu, select **IAM & Admin > Service Accounts**.
1. Select the email address of the service account.

    :::note
    The Compute Engine default service account is not recommended for production due to its powerful permissions. To use a service account other than the Compute Engine default, specify the service account email address under **Advanced options** on the Seqera compute environment creation form.
    :::

1. Select **Keys > Add key > Create new key**.
1. Select **JSON** as the key type.
1. Select **Create**.

A JSON file downloads to your computer. This file contains the credential needed for the Seqera compute environment.

You can manage your key from the **Service Accounts** page.

## Add credentials in Seqera

1. From the **Credentials** drop-down on the compute environment creation form, select **+** to add new credentials.
1. Enter a name (e.g., `Google Cloud Credentials`).
1. Paste the contents of the JSON file in the **Service account key** field.

## Next steps

- Create the [Google Cloud Batch](/platform-cloud/compute-envs/google-cloud-batch) or [Google Cloud](/platform-cloud/compute-envs/google-cloud) compute environment.
- [Set up Cloud Storage bucket access](./storage-access).
