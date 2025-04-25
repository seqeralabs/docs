---
title: "Google registry credentials"
description: "Instructions to create Google Cloud registry credentials in Seqera Platform."
date: "21 Apr 2023"
tags: [google, container, registry, artifact, credentials]
---

From version 22.3, Seqera Platform supports the configuration of credentials for the Nextflow Wave container service to authenticate to private and public container registries. For more information on Wave containers, see the [Nextflow documentation](https://www.nextflow.io/docs/latest/wave.html).

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

## Google Cloud registry access

:::note
Although Google Cloud Container Registry is still available and supported as a [Google Enterprise API](https://cloud.google.com/blog/topics/inside-google-cloud/new-api-stability-tenets-govern-google-enterprise-apis), new features will only be available in Artifact Registry. Container Registry will only receive critical security fixes. Google recommends using Artifact Registry for all new registries moving forward.
:::

Google Cloud Artifact Registry and Container Registry are fully integrated with Google Cloud services and support various authentication methods. Seqera requires programmatic access to your private registry using [long-lived service account keys](https://cloud.google.com/artifact-registry/docs/docker/authentication#json-key) in JSON format.

Create dedicated service account keys that are only used to interact with your repositories. Seqera requires the [Artifact Registry Reader](https://cloud.google.com/artifact-registry/docs/access-control#permissions) or [Storage Object Viewer](https://cloud.google.com/container-registry/docs/access-control#permissions) role.

## Create a Google service account with registry access

**Google Cloud Artifact Registry**

Administrators can create a service account from the Google Cloud console:

1. Go to the [Create service account](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts/create?walkthrough_id=iam--create-service-account) page.
2. Select a Cloud project.
3. Enter a service account name and (optional) description.
4. Select **Create and continue**.
5. From the **Role** drop-down menu under step 2, select **Artifact Registry > Artifact Registry Reader**, then select **Continue**.
6. (Optional) Grant other users and admins access to this service account.
7. Select **Done**.
8. From the project service accounts page, select the three dots menu icon under **Actions** for the service account you just created, then select **Manage keys**.
9. On the **Keys** page, select **Add key**.
10. On the **Create private key** popup, select **JSON** and then **Create**. This triggers a download of a JSON file containing the service account private key and service account details.
11. Base-64 encode the contents of the JSON key file:

```bash
        #Linux
        base64 KEY-FILE-NAME > NEW-KEY-FILE-NAME

        #macOS
        base64 -i KEY-FILE-NAME -o NEW-KEY-FILE-NAME

        #Windows
        Base64.exe -e KEY-FILE-NAME > NEW-KEY-FILE-NAME
```

**Google Cloud Container Registry**

Administrators can create a service account from the Google Cloud console:

1. Navigate to the [Create service account](https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts/create?walkthrough_id=iam--create-service-account) page.
2. Select a Cloud project.
3. Enter a service account name and an optional description.
4. Select **Create and continue**.
5. From the **Role** drop-down menu under step 2, search for and select **Storage Object Viewer**, then select **Continue**.
6. (Optional) Grant other users and admins access to this service account under step 3.
7. Select **Done**.
8. From the project service accounts page, select the three dots menu icon under **Actions** for the service account you just created, then select **Manage keys**.
9. On the **Keys** page, select **Add key**.
10. On the **Create private key** popup, select **JSON** and then **Create**. This triggers a download of a JSON file containing the service account private key and service account details.

## Add credentials to Seqera

1.  Add your credentials to your organization or personal workspace:
    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-registry-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify the service account key type:
      - Container registry: `_json_key`
      - Artifact Registry: `_json_key_base64`
    - **Password**: Specify the JSON key file content. This content is base64-encoded for Artifact Registry. You must remove any line breaks or trailing spaces. For example, `wewogICJ02...9tIgp9Cg==`.
    - **Registry server**: Specify the container registry hostname, excluding the protocol. For example, `<location>-docker.pkg.dev`.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.
