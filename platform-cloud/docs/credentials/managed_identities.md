---
title: "Managed identities"
description: "Configure managed identities in Seqera Platform."
date: "12 Jun 2024"
tags:
  [
    organizations,
    administration,
    managed identities,
    clusters,
    ssh,
    credentials,
  ]
---

Managed identities offer significant advantages for high performance computing (HPC) environments by enabling granular access control for individual workspace users. Unlike traditional SSH credentials that grant all workspace users access to HPC clusters using the same set of credentials, managed identities ensure each user’s activity is logged under their own credentials. This preservation of user identity is crucial as it naturally inherits the HPC system's fair usage queue policies, mitigates the noisy neighbor problem, and reduces the long wait times associated with First-In-First-Out (FIFO) queues common with shared SSH credentials.

Traditional SSH credentials, while simplifying access control to computing resources, result in all user activities on the HPC cluster being logged under the same user credentials. This means all Seqera workspace users have the same access permissions on your HPC cluster, leading to indistinguishable user activities.

Managed identities resolve these limitations by allowing administrators to configure a managed identity at the organizational level for access to supported HPC compute environments. This managed identity is selected for authentication similarly to traditional credentials, but contains multiple user credentials each tied to a unique Seqera user. This setup preserves the identity of the user launching workflows on the compute environment and improves traceability and adherence to data access policies.

Moreover, with managed identities, users only have the access permissions that their system administrators have granted, minimizing the risk of unauthorized read/write operations in restricted folders. In contrast, shared SSH credentials provide all workspace users with the same access level on the HPC side, which is often more extensive than what an individual user typically needs. By grouping individual user SSH credentials into a single element, managed identities allow administrators to streamline user login and compute environment access while maintaining visibility into data access and compute resource usage for each user.

## Create a managed identity

Organization owners can create managed identities at the organization level. A managed identity with user credentials can be used as a credential in HPC clusters for the same provider.

1. From your organization page, select the **Managed identities** tab, then **Add managed identity**.
1. Enter the details of your cluster:
   - A unique **Cluster name** of your choice using alphanumeric, dash, and underscore characters.
   - Select a cluster **Provider** from the dropdown.
   - The fully qualified cluster **Hostname** to be used to connect to the cluster via SSH. This is usually the cluster login node.
   - The SSH **Port** number for the login connection. The default is port 22.
1. Select **Add cluster**. The new cluster is now listed under your organization's managed identities.

Select **Edit** next to a managed identity in the list to edit its details and add user credentials.

:::note
If the managed identity is already in use on a compute environment, editing its details may lead to errors when using the compute environment.
:::

## Add user credentials

Organization owners can grant individual users access to managed identities by adding each user's credentials to the managed identity. You must add user credentials to a managed identity before it can be used in a compute environment.

Organization members can add, edit, and delete their own user credentials in a managed identity.

:::caution
All managed identity users must be a part of the same Linux user group. The group must have access to the HPC compute environment work directory.

Set group permissions for the work directory as follows (replace `sharedgroupname` and `<WORKDIR>` with your group name and work directory):

```bash
chgrp -R sharedgroupname <WORKDIR>
chmod -R g+wxs <WORKDIR>
setfacl -Rdm g::rwX <WORKDIR>
```

These commands change the group ownership of all files and directories in the work directory to `sharedgroupname`, ensure new files inherit the directory's group, and apply default ACL entries to allow the group read, write, and execute permissions for new files and directories. This setup facilitates shared access and consistent permissions management in the directory.
:::

1. From the **Managed identities** tab, select **Edit** next to the cluster in question, then select the **Users** tab.
1. The members of the organization are prepopulated in the **Users** list. Users without credentials are listed with a **Missing** credentials status. Add a user's credentials by selecting **Add credentials** from the user action menu, or the **Add credentials** button.
1. Enter the credential details in the **Add credentials** window:
   - The member's **Linux username** used to access the cluster.
   - Paste the contents of the **SSH private key** file for the user's SSH key pair, including the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines. Ensure no additional lines or spaces are included.
   - The SSH private key **Passphrase**, if the key has a passphrase. Otherwise, leave this blank.
1. Select **Add credentials**. The Linux username for the user is now populated in the list, and the **Credentials** status is changed to **Added**.

Edit existing user credentials by selecting **Edit credentials** from the **Actions** menu next to a user name in the list.
