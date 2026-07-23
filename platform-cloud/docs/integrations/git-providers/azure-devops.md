---
title: "Azure DevOps"
description: "Connect Seqera Platform to private Azure DevOps repositories."
tags: [git, azure, azure-devops, integration]
---

Authenticate to Azure DevOps repositories using a [personal access token (PAT)](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows#about-pats).

## Create Azure DevOps credentials

After creating and copying your access token, create a new credential in Seqera:

1. From an organization workspace: Select **Credentials** > **Add Credentials**. From your personal workspace: Go to the user menu and select **Your credentials** > **Add credentials**.
1. Enter a **Name** for the new credentials.
1. Select **Azure DevOps** as the **Provider**.
1. Enter your **Username** and **Access token**.
1. (Recommended) Enter the **Repository base URL** to scope the credentials to a specific repository (e.g., `https://dev.azure.com/<your organization>/<your project>`).
