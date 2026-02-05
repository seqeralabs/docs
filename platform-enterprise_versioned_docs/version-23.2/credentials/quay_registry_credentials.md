---
title: "Quay container registry credentials"
description: "Instructions to create Quay container registry credentials in Nextflow Tower."
date: "21 Apr 2023"
tags: [quay, credentials]
---

## Container registry credentials

From version 22.3, Tower supports the configuration of credentials for the Nextflow Wave container service to authenticate to private and public container registries. For more information on Wave containers, see [here](https://www.nextflow.io/docs/latest/wave.html).

:::note
Container registry credentials are only leveraged by the Wave containers service. In order for your pipeline execution to leverage Wave containers, add `wave { enabled=true }` either to the **Nextflow config** field on the launch page, or to your nextflow.config file.
:::

### Quay repository access

For Quay repositories, we recommend using [robot accounts](https://docs.quay.io/glossary/robot-accounts.html) with **Read** access permissions for authentication:

1. Sign in to [quay.io](https://quay.io/).
2. From the user or organization view, select the **Robot Accounts** tab.
3. Select **Create Robot Account**.
4. Enter a robot account name. The username for robot accounts have the format `namespace+accountname`, where `namespace` is the user or organization name and `accountname` is your chosen robot account name.
5. Grant the robot account repository **Read** permissions from **Settings -> User and Robot Permissions** in the repository view.
6. Select the robot account in your admin panel to retrieve the token value.

### Add credentials to Tower

- From an organization workspace: navigate to the Credentials tab and select **Add Credentials**.

- From your personal workspace: select **Your credentials** from the user top-right menu, then select **Add credentials**.

![](./_images/container_registry_credentials_blank.png)

| Property        | Description                                                                             | Example                      |
| --------------- | --------------------------------------------------------------------------------------- | ---------------------------- |
| Name            | A unique name for the credentials using alphanumeric characters, dashes, or underscores | `my-registry-creds`          |
| Provider        | Credential type                                                                         | Container registry           |
| User name       | Robot account username (`namespace+accountname`)                                        | `mycompany+myrobotaccount`   |
| Password        | Robot account access token                                                              | `PasswordFromQuayAdminPanel` |
| Registry server | The container registry hostname                                                         | `quay.io`                    |

Once the form is complete, select **Add**. The new credential is now listed under the **Credentials** tab.
