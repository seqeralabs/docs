---
title: "Google Cloud IAM"
description: "Project, APIs, and service account IAM roles for Seqera Platform on Google Cloud."
tags: [gcp, google, iam, integration]
---

Seqera Platform requires a Google Cloud project with the right APIs enabled and a service account with the right IAM roles. This page covers both compute environment types: Google Cloud Batch and Google Cloud (preview).

## Create a project

Go to the [Google Project Selector page](https://console.cloud.google.com/projectselector2) and select an existing project, or select **Create project**.

Enter a name (e.g., `tower-nf`). If you are part of an organization, the location will default to your organization.

## Enable billing

See [Modify a project's billing settings](https://cloud.google.com/billing/docs/how-to/modify-project) to enable billing in your Google Cloud account.

## Enable APIs

[Enable the following APIs](https://console.cloud.google.com/flows/enableapi?apiid=batch.googleapis.com%2Ccompute.googleapis.com%2Cstorage-api.googleapis.com) for your project:

- Batch API
- Compute Engine API
- Cloud Storage API

Or enable each manually:

- [Batch API](https://console.cloud.google.com/marketplace/product/google/batch.googleapis.com)
- [Compute Engine API](https://console.cloud.google.com/marketplace/product/google/compute.googleapis.com)
- [Cloud Storage API](https://console.cloud.google.com/marketplace/product/google/storage-api.googleapis.com)

## Service account permissions

Seqera requires a service account with appropriate permissions to interact with Google Cloud resources. As an IAM user, you must have access to the service account that submits Batch jobs.

:::caution
By default, Google Cloud Batch uses the default Compute Engine service account, which is granted the Editor (`roles/Editor`) role. While this is sufficient for Seqera, this role is not recommended for production. Control job access using a custom service account with only the permissions necessary for Seqera.
:::

### Google Cloud Batch permissions

[Create a custom service account](https://cloud.google.com/iam/docs/service-accounts-create#creating) with at least:

- Batch Agent Reporter (`roles/batch.agentReporter`) on the project
- Batch Job Editor (`roles/batch.jobsEditor`) on the project
- Logs Writer (`roles/logging.logWriter`) on the project (for jobs to generate Cloud Logging logs)
- Logs Viewer (`roles/logging.logViewer`) on the project (to view and retrieve Cloud Logging logs)
- Service Account User (`roles/iam.serviceAccountUser`)

If your Google Cloud project does not require access restrictions on Cloud Storage buckets, grant project Storage Admin (`roles/storage.admin`) to your service account to simplify setup. To grant access only to specific buckets, add the service account as a principal on each bucket individually. See [Storage access](./storage-access).

### Google Cloud permissions

For the Google Cloud (preview) compute environment, the service account requires:

- Compute Instance Admin (`roles/compute.instanceAdmin.v1`)
- Project IAM Admin (`roles/resourcemanager.projectIamAdmin`)
- Service Account Admin (`roles/iam.serviceAccountAdmin`)
- Service Account User (`roles/iam.serviceAccountUser`)
- Service Usage Consumer (`roles/serviceusage.serviceUsageConsumer`)

If your Google Cloud project does not require access restrictions on Cloud Storage buckets, grant project Storage Admin (`roles/storage.admin`) to simplify setup.

For each Google Cloud compute environment created in Seqera, a separate service account is created with the necessary permissions to launch pipelines and Studios.

### User permissions

Ask your Google Cloud administrator to grant you the following IAM user permissions to interact with the custom service account:

- Batch Job Editor (`roles/batch.jobsEditor`) on the project
- Service Account User (`roles/iam.serviceAccountUser`) on the job's service account
- View Service Accounts (`roles/iam.serviceAccountViewer`) on the project

## Next steps

- [Generate a service account JSON key and add credentials in Seqera](./credentials).
- [Create a Cloud Storage bucket](./storage-access) for the work directory.
