---
title: "Data repositories"
description: "Instructions for adding data repositories to Seqera Platform"
date: "15 Oct 2025"
tags: [data explorer, aws, azure, gcp, s3-compatible, api, credentials]
---

Data Explorer requires programmatic access via valid credentials to browse and interact with remotely hosted private data repositories.

To automatically connect to one or more data repositories, create a new credential that includes **Name** and **Provider**. Specific data repositories require additional information to connect.

## AWS Simple Storage Service (S3) object storage 

Add an **Access key**, and **Secret key**. You can optionally provide an IAM role for temporary access - this must be a fully qualified AWS role ARN. S3 object storage buckets are prefixed with an AWS icon and `s3://` in Data Explorer.

:::note
Seqera Compute uses AWS S3 object storage, and are prefixed with a Seqera icon and the `s3://` namespace in Data Explorer.
:::

## Azure Blob Storage

Select between different credential types: a **Shared key**, **Entra**, or **Cloud**.

- **Shared key:** Access your Azure accounts directly using primary or secondary access keys.
- **Entra:** Authenticate via an Azure Entra service principal for enhanced security and identity management.
- **Cloud:** Authenticate via an Azure Entra service principal for Azure Cloud.

:::info
Select Entra for modern, identity-based access control. Select Cloud for Entra identity-based access control with Cloud specializations. Select Shared key for full, direct account access.
:::

Add a **Batch account name**, **Batch account key**, **Blob Storage account name**, and **Blob Storage account key**.

Azure Blob Storage are prefixed with an Azure icon and `az://` in Data Explorer.

## GCP object storage

Add the contents of the **Service account key** JSON file. GCP object storage buckets are prefixed with a GCP icon and `gs://` in Data Explorer.

## S3-compatible storage

This includes cloud-provider and on-premise based storage solutions with an S3-compatible API. Examples include [Cloudflare R2][cloudflare], [MinIO][minio], and [Oracle Cloud Infrastructure][oci].

Add an **Access key**, **Secret key**, **Server base URL**, and optionally select path-style URL access. Refer to your S3-compatible storage provider documentation to determine if path-style URL access is applicable.

:::info
OCI has specific object-storage endpoints that are [S3-compatible][oci-s3-compatible], and include `.compat.` in the server base URL. These are in the form `https://<object_storage_namespace>.compat.objectstorage.<region>.oci.customer-oci.com`.
:::

S3-compatible storage are prefixed with a S3-compatible storage icon and `s3://` in Data Explorer.

{/* Links */}

[cloudflare]: https://www.cloudflare.com/developer-platform/products/r2/
[minio]: https://min.io
[oci]: https://www.oracle.com/cloud/
[oci-s3-compatible]: https://docs.oracle.com/en-us/iaas/api/#/en/s3objectstorage
