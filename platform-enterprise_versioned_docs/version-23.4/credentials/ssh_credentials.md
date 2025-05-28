---
title: "SSH credentials"
description: "Instructions to create SSH credentials in Seqera Platform."
date: "21 Apr 2023"
tags: [ssh, credentials]
---

SSH public key authentication relies on asymmetric cryptography to generate a public and private key pair. The public key remains on the target (remote) machine, while the private key (and passphrase) is stored in Seqera Platform as a credential. The key pair is used to authenticate a connection with your SSH-enabled environment.

:::note
All credentials are (AES-256) encrypted before secure storage and not exposed in an unencrypted way by any Seqera API.
:::

## Create an SSH key pair

To use SSH public key authentication:

- The remote system must have a version of SSH installed. This guide assumes the remote system uses OpenSSH. If you're using a different version of SSH, the key generation steps may differ.
- The SSH public key must be present on the remote system (usually in `~/.ssh/authorized_keys`).

To generate an SSH key pair:

1.  From the target machine, open a terminal window and run `ssh-keygen`.
2.  Follow the prompts to:
    - Specify a file path and name (or keep the default).
    - Specify a passphrase (recommended).
3.  Navigate to the target folder (default `/home/user/.ssh/id_rsa`) and open the private key file with a plain text editor.
4.  Copy the private key file contents before navigating to Seqera.

## Create an SSH credential in Seqera

1.  Add your credentials to your organization or personal workspace:

    - From an organization workspace: Go to **Credentials > Add Credentials**.
    - From your personal workspace: From the user menu, go to **Your credentials > Add credentials**.

2.  Complete the following fields:

    - **Name**: A unique name for the credentials using alphanumeric characters, dashes, or underscores. For example, `my-ssh-creds`.
    - **Provider**: Select **SSH**.
    - **SSH private key**: Paste the SSH private key file contents. Include the `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines.
    - **Passphrase**: The SSH private key passphrase (recommended). If your key pair was created without a passphrase, leave this blank.

3.  After you've completed all the form fields, select **Add**. The new credential is now listed under the **Credentials** tab.
