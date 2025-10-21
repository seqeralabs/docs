---
title: "Quay container registry credentials"
description: "Instructions to create Quay container registry credentials in Seqera Platform."
date: "21 Apr 2023"
tags: [quay, credentials]
---

Quay container registry credentials allow the Wave container service to authenticate and pull container images from your Quay repositories. Quay uses [robot accounts](https://docs.quay.io/glossary/robot-accounts.html) with read access permissions for secure programmatic authentication.

:::note
Container registry credentials are only used by the Wave container service. Add `wave { enabled=true }` to the **Nextflow config** field on the launch page, or to your `nextflow.config` file, for your pipeline execution to use Wave containers.
:::

**Create a Quay robot account**

1. Sign in to [quay.io](https://quay.io/).
2. From the user or organization view, select the **Robot Accounts** tab.
3. Select **Create Robot Account**.
4. Enter a robot account name. The username for robot accounts have the format `namespace+accountname`, where `namespace` is the user or organization name and `accountname` is your chosen robot account name.
5. Grant the robot account repository **Read** permissions from **Settings > User and Robot Permissions** in the repository view.
6. Select the robot account in your admin panel to retrieve the token value.

## Add credentials to Seqera

1.  Add your credentials to your organization or personal workspace:
    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: Specify a unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-registry-creds`.
    - **Provider**: Select **Container registry**.
    - **User name**: Specify your robot account username. For example, `namespace+accountname`.
    - **Password**: Specify your robot account access token. For example, `PasswordFromQuayAdminPanel`.
    - **Registry server**: Specify your container registry hostname. For example, `quay.io`.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.
