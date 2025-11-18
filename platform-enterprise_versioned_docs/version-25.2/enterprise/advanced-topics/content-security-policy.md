---
title: "Custom Content Security Policy headers"
description: Seqera Platform Content Security Policy headers
date created: "2025-03-17"
last updated: "2025-11-12"
tags: [data, explorer, content, security, policy, deployment]
---

## Introduction

HTTP security headers are an important part of a website's security posture. They protect against different types of attacks including cross-site scripting (XSS), SQL injection, and clickjacking. Object storage is external to Seqera Platform, and read and write access is strictly limited to a selected group of object storage providers. These select providers are explicitly defined in the Content Security Policy (CSP).

## Supported object storage providers

Data Explorer can read from, and write to, the following object storage providers by default:

- [Amazon S3][aws-s3]
- [Google Cloud Object Storage][gcp-os]
- [Azure Blob Storage][azure-bs]
- [OCI Object Storage][oci-os]
- [Cloudflare R2][cloudflare-r2]
- [LakeFS Cloud][lakefs]

## Subdomain support

If your object storage provider and Seqera deployment share the same subdomain (e.g. `minio.janedoepharma.com` and `platform.janedoepharma.com`) then communication between Seqera and provider works **without** additional customization. However, if your object storage provider and subdomain don't match, the CSP headers need to be customized.

## Connecting additional providers

Accessing new object storage providers in [Data Explorer][data-explorer] requires updating the NGINX web server template directives to include the domain to access. To update the platform configuration, edit the `nginx-unprivileged.conf.template` `$base_child_src` directive.

   ```bash
   map $host $base_child_src {
      default "'self' https://www.google.com https://*.$host https://*.$lower_lvl_domain https://*.amazonaws.com https://storage.googleapis.com https://*.blob.core.windows.net https://*.oci.customer-oci.com https://*.r2.cloudflarestorage.com https://*.lakefscloud.io blob:";
   }
   ```

Append the list of entries with your object storage provider domain (for example, `https://*.min.io`):

   ```bash
   map $host $base_child_src {
      default "'self' https://www.google.com https://*.$host https://*.$lower_lvl_domain https://*.amazonaws.com https://storage.googleapis.com https://*.blob.core.windows.net https://*.oci.customer-oci.com https://*.r2.cloudflarestorage.com https://*.lakefscloud.io blob: https://*.min.io";
   }
   ```

:::info
If your object storage is accessed on a port other than port **80**, include the port in the address (e.g. `https://myobjectstorage.min.io:9000`).
:::

{/* links */}
[aws-s3]: https://aws.amazon.com/s3/
[gcp-os]: https://cloud.google.com/storage
[azure-bs]: https://azure.microsoft.com/en-us/products/storage/blobs
[oci-os]: https://www.oracle.com/cloud/storage/object-storage/
[cloudflare-r2]: https://www.cloudflare.com/developer-platform/products/r2/
[lakefs]: https://lakefs.io/
[data-explorer]: ../../data/data-explorer.md
