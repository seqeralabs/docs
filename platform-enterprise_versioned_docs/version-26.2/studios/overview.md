---
title: "Overview"
description: "Interactive analysis environments in Seqera Platform"
date created: "2025-02-06"
last updated: "2026-09-30"
tags: [studios, containers, image, sessions, interactive, analysis]
---

Studios provides interactive analysis environments that pair a container image with a compute environment and your preferred tools, such as JupyterLab, an R-IDE, Visual Studio Code, or Xpra remote desktops. Each Studio session runs as an individual interactive environment for live data analysis.

:::note
Studios in Enterprise is not enabled by default. To enable it, see [Deploy Studios in Seqera Platform](../enterprise/install-studios).
:::

- [Container image templates](./container-images): Provided templates for JupyterLab, R-IDE, Visual Studio Code, and Xpra.
- [Custom environments](./custom-envs): Augment the Seqera-provided images with Conda packages or your own base container template image.
- [Add a Studio](./add-studio): Configuration options for creating, running, and customizing Studio sessions.
- [Manage Studios](./managing): Manage Studios and collaborator access.
- [Connect changelog](./connect): Release notes for the Seqera Connect client.

:::note
Studios supports [AWS Cloud][aws-cloud], [Azure Cloud][azure-cloud], [Google Cloud][google-cloud], and [AWS Batch][aws-batch] compute environments that **do not** have Fargate enabled.
:::

## Networking

The Seqera Connect client inside a Studio session opens a tunnel outward to the Connect server and registers the session over it. All session traffic, including SSH when enabled, travels over that outbound connection. **No inbound path to the session VM is required.** Users reach a Studio through the Connect proxy rather than by connecting to the VM, so you do not need inbound rules or source-IP allow-lists for dynamically launched Studio VMs.

This applies to every compute environment that supports Studios. If you run Studios inside a private network, see the networking guidance on your compute environment page for the outbound connectivity to allow: [AWS Cloud][aws-cloud-networking], [Google Cloud][google-cloud-networking], or [AWS Batch][aws-batch-networking]. For the ports and directions to configure on your firewall, see [Firewall configuration](../enterprise/advanced-topics/firewall-configuration).

## Workload identity federation

By default, a Studio session uses the credentials of the compute environment it runs on, such as the AWS Batch job role or the Google Cloud service account. Every Studio and pipeline on that compute environment shares those credentials. With [workload identity federation][wif], a Studio session gets its own cloud identity instead. Platform signs a short-lived token that names the session's workspace. Your cloud provider exchanges that token for temporary credentials for the role or service account on the credential. Fusion, the Seqera Connect client, and the tools you run in the session all use those credentials. No long-lived secret enters the container.

A Studio session federates when the following are true:

- Workload identity federation is enabled for your workspace. It is enabled for every workspace unless an administrator restricts it with `TOWER_IDENTITY_FEDERATION_ALLOWED_WORKSPACES`. See [Opt-in Seqera features][features].
- The compute environment is an AWS or Google Cloud compute environment whose credential uses workload identity federation. Sessions on AWS credentials with access keys or an assumed role, on Google Cloud credentials with a service account key, and on Azure compute environments keep the compute environment's credentials.
- The Studio's container image includes Seqera Connect client 0.14.0 or later, which supports workload identity federation. Earlier Connect clients ignore the federation settings, and the session keeps the compute environment's credentials.
- Your installation runs Connect server and proxy version 0.12.2 or later.

:::note
For Connect server, proxy, and client releases, see the [Connect changelog](./connect).
:::

You configure nothing on the Studio. Platform decides at each start whether the session federates, and passes the settings to the Connect client with the session's launch credentials.

### Identity and permissions

A Studio session presents the `studio` workload subject, `org:{orgId}:wsp:{workspaceId}:studio`, and assumes the same role or service account that the credential uses for every other workload. Your trust policy must admit the `studio` subject, and your permission policy must grant that subject the buckets the Studio mounts. See [Permission policies][wif-permissions]. On Google Cloud, the session impersonates the credential's service account.

When the session starts, the Connect client exchanges the token once and confirms the identity it received before Fusion mounts any data. If the exchange fails, for example because the trust policy does not admit the `studio` subject, the session fails to start. A federated session never falls back to the compute environment's credentials.

To confirm that a session on AWS federated, run the following command from a terminal in the session. The returned Amazon Resource Name (ARN) contains the credential's role and the session name `seqera-studio`:

```bash
aws sts get-caller-identity
```

Inside a federated session, the Connect client removes the environment variables that would otherwise authenticate a tool as the compute environment, such as `AWS_ACCESS_KEY_ID`, `AWS_PROFILE`, and `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI` on AWS, or `GOOGLE_CREDENTIALS` and `CLOUDSDK_AUTH_ACCESS_TOKEN` on Google Cloud. It points the cloud SDKs at the session's identity with `AWS_WEB_IDENTITY_TOKEN_FILE` and `AWS_ROLE_ARN`, or with `GOOGLE_APPLICATION_CREDENTIALS`. The Connect client does not remove a credentials profile in `~/.aws/config` or `~/.aws/credentials`. A tool that reads a profile first can still authenticate as something else.

### Credential lifetime

The Connect client refreshes the session's identity token for as long as the session runs, and the cloud SDKs exchange it for temporary credentials on their own schedule. By default, Platform limits a session's workload identity to three days from when the session first obtains it. Set `TOWER_OIDC_WORKLOAD_IDENTITY_MAX_CREDENTIAL_LIFESPAN` in seconds to change the limit, or `0` to remove it. A session that runs longer keeps its current temporary cloud credentials until they expire, then loses cloud access. Stop and start the session to give it a new identity.

When a session stops, Platform revokes its workload identity. Temporary credentials the session already obtained remain valid until they expire, up to approximately one hour.

### Audit attribution

A federated Studio session always identifies its workspace in your cloud audit log. Whether it also names a person depends on whether the Studio is private:

| Studio | Attributed to |
| --- | --- |
| Private, shared with one user | The user you shared it with |
| Private, shared with nobody | Its creator |
| Not private | Nobody |

A shared session outlives the request that started it, and anyone with workspace access can reconnect to it. No single name stays true for the whole session. A private Studio has exactly one user for its whole life. An administrator who does not use the Studio typically creates a private Studio shared with one user, on that user's behalf. The session names that user, not whoever starts it.

Platform decides attribution at each start. If you share a private Studio, the next session names the user you shared it with. If you unshare it, the session after that names the creator again. The attribution stays with the session through every credential refresh.

On AWS, an attributed session carries the `seqera:principal-id` and `seqera:principal-email` session tags and a source identity on every request. Every session carries `seqera:org`, `seqera:workspace`, and `seqera:workload` with the value `studio`. On Google Cloud, the acting user reaches the audit log only through the `google.subject` attribute mapping, which appends `:usr:{userId}` to the subject of an attributed session. See [Cloud audit attribution][wif-audit].

:::caution
Sharing a private Studio does not remove the creator's access to it. The creator can still open the session while its cloud audit trail names the user you shared it with. Treat the attributed user as who the Studio is for, not as proof of who performed an action. Do not grant access on `aws:PrincipalTag/seqera:principal-id` or `aws:SourceIdentity` for a shared private Studio.
:::

:::note
On Google Cloud, a `principal://` binding on the exact subject `org:{orgId}:wsp:{workspaceId}:studio` does not match an attributed session, because the mapped subject ends in `:usr:{userId}`. Bind the whole pool or `attribute.workspace` instead. See [Attribute mapping][wif-mapping].
:::

For startup and access problems in a federated session, see [Studios troubleshooting][studios-troubleshooting].

{/* links */}
[aws-cloud]: ../compute-envs/aws-cloud
[azure-cloud]: ../compute-envs/azure-cloud
[aws-cloud-networking]: ../compute-envs/aws-cloud#networking
[aws-batch]: ../compute-envs/aws-batch
[aws-batch-networking]: ../compute-envs/aws-batch#networking
[google-cloud]: ../compute-envs/google-cloud
[google-cloud-networking]: ../compute-envs/google-cloud#networking
[contact]: https://support.seqera.io/
[wif]: ../credentials/workload_identity
[wif-permissions]: ../credentials/workload_identity#permission-policies
[wif-audit]: ../credentials/workload_identity#cloud-audit-attribution
[wif-mapping]: ../credentials/workload_identity#attribute-mapping
[features]: ../enterprise/configuration/overview#opt-in-seqera-features
[studios-troubleshooting]: ../troubleshooting_and_faqs/studios_troubleshooting#workload-identity-federation
