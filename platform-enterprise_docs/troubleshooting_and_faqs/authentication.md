---
title: "Authentication"
description: "Authentication troubleshooting with Seqera Platform."
date created: "2026-07-14"
last updated: "2026-07-14"
tags: [faq, help, authentication, sso, scim, troubleshooting]
---

When configuring authentication for Seqera Platform, you might encounter the following issues.

## SCIM provisioning

These issues apply to SCIM group provisioning with [Okta](../enterprise/configuration/authentication/idp-delegation/group-catalog/scim-okta) and [Entra ID](../enterprise/configuration/authentication/idp-delegation/group-catalog/scim-entra-id).

#### Groups appear in the identity provider but not in Platform

This issue occurs when the bearer token configured in your identity provider doesn't match the current Platform token. Generating a new token in Platform revokes the previous one. To resolve, confirm the token in your identity provider matches the current Platform token, and replace it if necessary.

#### `401 Unauthorized` in provisioning logs

This error occurs when the bearer token is invalid or expired. To resolve, generate a new token in Platform and replace it in your identity provider.

#### `409 Conflict` on a specific group

This error occurs when a group with the same display name already exists in another organization on the same Enterprise instance. See [Multi-organization routing](../enterprise/configuration/authentication/idp-delegation/multi-org-routing) for the cross-organization uniqueness rule and conflict resolution.

#### Catalog shows GUID-style identifiers instead of group names

This issue occurs when Entra ID emits group object IDs rather than display names. To resolve, configure Entra ID to emit display names. See [Group display names vs. object IDs](../enterprise/configuration/authentication/idp-delegation/group-catalog/scim-entra-id#group-display-names-vs-object-ids).

#### A group assigned in Entra ID doesn't sync

This issue occurs when the provisioning scope excludes the group. To resolve, set the scope to **Sync only assigned users and groups** and confirm the group is listed directly under **Users and groups**, not nested inside another assigned group.

## OpenID Connect

#### OpenID Connect (OIDC) login fails with a 500 error in the frontend logs

The OIDC callback request can contain large HTTP headers that exceed the buffer size, which causes login failures:

```console
*8317 upstream sent too big header while reading response header from upstream, client: 10.170.157.186, server: localhost, request: "GET /oauth/callback
```

To resolve, rebuild the frontend container and add the following proxy directives to `/etc/nginx/nginx.conf`:

```nginx
proxy_buffer_size          128k;
proxy_buffers              4 256k;
proxy_busy_buffers_size    256k;
```

#### OIDC callback failure

OIDC callbacks can fail for several reasons. To investigate:

- Set the authentication logging level environment variable to `TOWER_SECURITY_LOGLEVEL=DEBUG`.
- Ensure your `TOWER_OIDC_CLIENT`, `TOWER_OIDC_SECRET`, and `TOWER_OIDC_ISSUER` environment variables all match the values specified in your OIDC provider application.
- Ensure your network infrastructure allows the necessary egress and ingress traffic.

#### OIDC `redirect_url` set to HTTP instead of HTTPS

This can occur for several reasons. Verify the following:

- Your `TOWER_SERVER_URL` environment variable uses the `https://` prefix.
- Your `tower.yml` has `micronaut.ssl.enabled` set to `true`.
- Any Load Balancer instance that sends traffic to Seqera Enterprise is configured to use HTTPS as its backend protocol rather than HTTP/TCP.

## HPC cluster authentication

#### `Exhausted available authentication methods` with HPC clusters

This error indicates a problem with the SSH credentials that authenticate Seqera to your HPC cluster (such as LSF or Slurm), such as an invalid SSH key or incorrect permissions on the user directory. Check the following:

- Ensure the SSH key is still valid. If not, create new SSH keys and [re-create the compute environment](../compute-envs/hpc) in Seqera with the updated credentials.

- Check the backend logs for a stack trace similar to the following:

  <details>
    <summary>Error log</summary>

    ```console
    [io-executor-thread-2] 10.42.0.1 ERROR i.s.t.c.GlobalErrorController - Unexpected error while processing - Error ID: 5d7rDpS8pByF8YqfUVPvB4
    net.schmizz.sshj.userauth.UserAuthException: Exhausted available authentication methods
        at net.schmizz.sshj.SSHClient.auth(SSHClient.java:227)
        at net.schmizz.sshj.SSHClient.authPublickey(SSHClient.java:342)
        at net.schmizz.sshj.SSHClient.authPublickey(SSHClient.java:360)
        at io.seqera.tower.service.platform.ssh.SSHClientFactory.createClient(SSHClientFactory.groovy:110)
    ..
    ..
    Caused by: net.schmizz.sshj.userauth.UserAuthException: Problem getting public key from PKCS5KeyFile{resource=[PrivateKeyStringResource]}
        at net.schmizz.sshj.userauth.method.KeyedAuthMethod.putPubKey(KeyedAuthMethod.java:47)
        at net.schmizz.sshj.userauth.method.AuthPublickey.buildReq(AuthPublickey.java:62)
        at net.schmizz.sshj.userauth.method.AuthPublickey.buildReq(AuthPublickey.java:81)
        at net.schmizz.sshj.userauth.method.AbstractAuthMethod.request(AbstractAuthMethod.java:68)
        at net.schmizz.sshj.userauth.UserAuthImpl.authenticate(UserAuthImpl.java:73)
        at net.schmizz.sshj.SSHClient.auth(SSHClient.java:221)
        ... 91 common frames omitted
    Caused by: net.schmizz.sshj.userauth.keyprovider.PKCS5KeyFile$FormatException: Length mismatch: 1152 != 1191
        at net.schmizz.sshj.userauth.keyprovider.PKCS5KeyFile$ASN1Data.<init>(PKCS5KeyFile.java:248)
    ```

  </details>

- Enable SSH library log tracing with the following environment variable in your `tower.env` file for verbose debug logging of the SSH connection:

  ```bash
  TOWER_SSH_LOGLEVEL=TRACE
  ```

- Check the permissions of the `/home` directory of the user tied to the cluster's SSH credentials. `/home/<user>` should be `chmod 755`, whereas `/home/<user>/.ssh` requires `chmod 700`:

  ```console
  $ pwd ; ls -ld .
  /home/user
  drwxr-xr-x 41 user user 20480

  $ pwd; ls -ld .
  /home/user/.ssh
  drwx------ 2 user user 4096
  ```
