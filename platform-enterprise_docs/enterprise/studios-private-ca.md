---
title: "Configure a private certificate authority for Studios"
description: Allow Studio sessions in a private network to trust certificates issued by your organization's internal certificate authority in Seqera Platform Enterprise.
date created: "2026-08-18"
last updated: "2026-08-27"
tags: [studios, connect, tls, certificates, enterprise, administration]
---

Studio sessions open outbound TLS connections to the Connect proxy and to Seqera Platform. In a private network, those endpoints often present certificates issued by an internal certificate authority (CA) rather than a publicly-trusted one. By default a Studio session trusts only the public CAs in its container image's system trust store, so the session fails to establish its tunnel and never reaches **running** status.

Configure a custom CA to add your organization's CA to the trust store of every Studio session. This is a Seqera Platform Enterprise deployment setting, available in Enterprise only.

This also applies if your organization inspects HTTPS traffic at the network boundary, because interception presents a certificate issued by an internal CA.

<span id="prerequisites" />

:::info[**Prerequisites**]

You need the following:

- [Connect client](../studios/connect) version `0.13.0` or later. Earlier clients have no custom CA support.
- Studio container images rebuilt against a `0.13.0` or later client.
- Access to the Seqera Platform deployment configuration.
- The root CA certificate in PEM format.

:::

## How Platform provisions the CA

You supply the CA once, at the deployment level. Platform distributes it to sessions automatically. There is no per-workspace or per-compute-environment step.

1. Mount your CA certificate into the Platform container and set `TOWER_SSL_CUSTOM_CA_CERT_FILE` to its path.
2. Platform reads the file, validates that it contains a PEM certificate, and base64-encodes it. This happens once per Platform process, the first time a Studio session launches.
3. When a Studio session launches, Platform passes the encoded certificate to the session as `TOWER_CONNECT_CA_CERT_BASE64`.
4. The Connect client installs the certificate at the operating system level inside the session container.

Installing the certificate at the OS level makes it available to the tunnel connection, the Connect client, the interactive tool, Fusion, and the AWS SDK.

This setting covers Studio sessions only. It doesn't add your CA to Platform's own Java trust store — trust for infrastructure that Platform itself reaches, such as private Git repositories, is configured separately. See [SSL/TLS](./configuration/ssl_tls).

Platform sets `TOWER_CONNECT_CA_CERT_BASE64` on every session, across all compute platforms. Users cannot override it: if a Studio's environment variables include `TOWER_CONNECT_CA_CERT_BASE64`, Platform removes the user-supplied value before launch.

## Configuration settings

| Environment variable | Set by | Description |
| :------------------- | :----- | :---------- |
| `TOWER_SSL_CUSTOM_CA_CERT_FILE` | Administrator | Path to a PEM file containing your internal CA certificate, mounted into the Platform container. Unset by default, which disables custom CA provisioning. |
| `TOWER_CONNECT_CA_CERT_BASE64` | Platform | The base64-encoded CA that the Connect client installs in the session. Platform derives this from `TOWER_SSL_CUSTOM_CA_CERT_FILE`. Don't set it by hand. |
| `TOWER_CONNECT_CA_KEEP_DEFAULT` | Connect client | Whether the session keeps the container image's public CAs alongside your CA. Defaults to `true`. Platform doesn't set this variable, and the Studio form rejects environment variable names beginning with `TOWER_`, so changing the trust model isn't self-service. Contact your Seqera account executive. See [Choose a trust model](#choose-a-trust-model). |

## Supply the CA to Platform

Provide the certificate to the Platform container, then point `TOWER_SSL_CUSTOM_CA_CERT_FILE` at it.

For a Kubernetes deployment, store the certificate in a `ConfigMap` and mount it:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: seqera-custom-ca
data:
  internal-ca.pem: |
    -----BEGIN CERTIFICATE-----
    MIIDdzCCAl+gAwIBAgIEAgAAuTANBgkqhkiG9w0BAQUFADBaMQswCQYDVQQGEwJJ
    ...
    -----END CERTIFICATE-----
```

Mount the `ConfigMap` into the Platform container and set the environment variable to the mounted path:

```yaml
env:
  - name: TOWER_SSL_CUSTOM_CA_CERT_FILE
    value: /etc/seqera/certs/internal-ca.pem
volumeMounts:
  - name: custom-ca
    mountPath: /etc/seqera/certs
    readOnly: true
volumes:
  - name: custom-ca
    configMap:
      name: seqera-custom-ca
```

For a Docker Compose deployment, mount the certificate as a volume and set the variable in your environment file:

```bash
TOWER_SSL_CUSTOM_CA_CERT_FILE=/etc/seqera/certs/internal-ca.pem
```

Restart Platform to apply the change. Platform reads the certificate only at startup.

:::note
Supply the **root** CA certificate. Platform forwards the encoded certificate in the session launch environment, and on AWS cloud compute environments that environment is subject to a size limit shared with everything else Platform injects. A single root certificate is well within that limit; a large chain or full bundle might not be.
:::

Sessions must be restarted to pick up the certificate. Running sessions are unaffected.

## Choose a trust model

`TOWER_CONNECT_CA_KEEP_DEFAULT` controls whether your CA is added to the image's public CAs or replaces them.

| Value | Trust anchors in the session | When to use |
| :---- | :--------------------------- | :---------- |
| `true` (default) | Your CA and the image's public CAs | Private routing without TLS interception, where some endpoints — for example, object storage — still present publicly-trusted certificates. |
| `false` | Your CA only | A fully private network where an egress proxy re-signs all traffic with your internal CA. |

:::warning
Setting `TOWER_CONNECT_CA_KEEP_DEFAULT=false` breaks connections to any endpoint that presents a publicly-trusted certificate. Use it only when every endpoint a session reaches — including object storage and package indexes — is signed by your internal CA.
:::

Full closure applies to the Connect client and Fusion. It does not extend to the interactive tool or to Node-based tooling, both of which keep the container image's public roots. Treat `false` as a way to force internal traffic through your CA, not as a guarantee that nothing in the session can reach a publicly-trusted endpoint.

## What the CA reaches

Most tooling in a session reads the operating system trust store and is covered automatically. Runtimes that ship their own certificate list are pointed at the same certificate:

| Consumer | How it picks up the CA |
| :------- | :--------------------- |
| `curl`, `wget`, `git`, `openssl`, Python's standard library | The session's system trust store. |
| Go programs, including `dockerd` | The system trust store. Registry pulls performed by `dockerd` work. |
| Node tooling, including the VS Code extension marketplace client | Added to Node's built-in roots. Node's roots are compiled into the binary, so your CA can be added to them but not replace them. |
| Python `requests` and `pip` | Pointed at the same certificate instead of their bundled store. |
| Java, including Nextflow | A generated keystore is mounted over the runtime's default trust store. No environment variable is involved, so it works with Nextflow, whose launcher discards `JAVA_TOOL_OPTIONS`. |

Studio sessions run Linux containers, and the mechanism relies on standard Linux trust store paths and TLS environment variables.

## Limitations

- **Java runtimes installed mid-session.** Java runtimes are discovered once, when the session starts. If you install a JDK during a session — for example, with `micromamba install openjdk nextflow` — that session does not pick up the CA and Java TLS to internal endpoints fails. The install is captured in the session checkpoint, so stopping and starting the session resolves it. Where possible, use a Studio image that already includes the Java runtime you need.
- **Nested containers.** Containers launched from inside a session with `dockerd` don't inherit the CA, because each has its own image filesystem and environment. To give a nested container the CA, add it to that container's image or mount it in at `docker run` time.
- **Full closure doesn't reach every process.** See [Choose a trust model](#choose-a-trust-model).
- **Browser trust is separate.** See [Browser trust is separate](#browser-trust-is-separate).

:::note
Behavior in specific private-network topologies is still being verified under [PLAT-6506](https://seqera.atlassian.net/browse/PLAT-6506). Contact your Seqera account executive if a session behaves differently from what's described here.
:::

{/* TODO: revisit once PLAT-6506 closes — field-verified topology behavior may add or remove
     limitations. AWS EC2 user-data size ceiling is tracked separately as PLAT-6380. */}

## Browser trust is separate

Configuring the CA in Platform allows the *session* to establish its outbound connections. It does not affect the user's browser. To open a Studio whose Connect endpoint uses an internal certificate, the internal CA must also be present in the trust store of the user's own machine or browser. Distributing the CA to users is a separate decision from this setting.

## Troubleshoot a private CA configuration

Symptoms a Studio user sees are covered in [Studios troubleshooting](../troubleshooting_and_faqs/studios_troubleshooting). The following are errors you're likely to meet while configuring the CA.

#### Error: `Custom CA certificate file not found or not readable`

Studio sessions fail to launch and Platform logs the configured path. This issue occurs when `TOWER_SSL_CUSTOM_CA_CERT_FILE` points at a path that does not exist in the Platform container, or that the Platform process cannot read. Platform itself starts normally — the error surfaces the first time a Studio session launches.

To resolve, confirm the volume or `ConfigMap` is mounted at the path the variable names, and that the file is readable by the Platform user.

#### Error: `Custom CA certificate file does not contain a PEM certificate`

Studio sessions fail to launch after Platform finds the file. This issue occurs when the file is not PEM-encoded — for example, a DER or PKCS#12 certificate, or a key file supplied by mistake. As above, Platform starts normally and the error surfaces at the first session launch.

To resolve, convert the certificate to PEM so that it contains a `BEGIN CERTIFICATE` block, then restart Platform.

#### Error: `x509: certificate signed by unknown authority`

A session fails to establish its tunnel and does not reach **running** status. This issue occurs when the Connect client does not trust the certificate the endpoint presents.

Check the following:

1. The Studio image runs a Connect client of version `0.13.0` or later. Earlier clients ignore the provisioned certificate.
2. `TOWER_SSL_CUSTOM_CA_CERT_FILE` is set and Platform was restarted after it was set.
3. The certificate supplied is the CA that issued the endpoint's certificate.

If the client is older than `0.13.0` and cannot be updated, the workaround is to build a custom Studio image with your CA added to the image's trust store. See [Custom container images](../studios/container-images).

#### Error: `PKIX path building failed`

A Java process inside the session — commonly Nextflow reporting to Platform with `-with-tower`, or reaching an internal Git server or S3-compatible storage — can't verify a certificate that the rest of the session trusts. Public endpoints keep working, because Java ships its own public roots. This issue occurs when the Java runtime was installed after the session started, so it wasn't present when the session configured Java trust.

To resolve, stop and start the session. The installed runtime is captured in the session checkpoint, so it's present the next time trust is configured. Where possible, use a Studio image that already includes the Java runtime you need.

If the error persists on a restarted session, the runtime is in a layout the session didn't recognize. As a workaround, import the CA into that runtime's default keystore, and run the import from a startup script so that it's re-applied each session rather than frozen into the checkpoint when your CA rotates:

```bash
keytool -delete -alias connect-custom-ca -keystore "$JAVA_HOME/lib/security/cacerts" \
  -storepass changeit 2>/dev/null || true
keytool -importcert -trustcacerts -noprompt -alias connect-custom-ca \
  -keystore "$JAVA_HOME/lib/security/cacerts" -storepass changeit -file /path/to/ca.pem
```

Don't set `JAVA_TOOL_OPTIONS` for Nextflow. Its launcher clears that variable, so it's silently ignored. Use `NXF_OPTS` if you prefer a separate trust store over importing into the default one.

#### Error: `SELF_SIGNED_CERT_IN_CHAIN`

A Node-based tool inside the session, such as the VS Code extension marketplace client, rejects a certificate issued by your CA.

Node's trusted roots are compiled into the binary, so the session adds your CA through the `NODE_EXTRA_CA_CERTS` environment variable rather than through the system trust store. This issue occurs when a tool doesn't read that variable, or when the tool is configured to use its own proxy or certificate settings.

To resolve, confirm the tool honors `NODE_EXTRA_CA_CERTS`, and check whether a tool-specific proxy or certificate setting overrides it. Contact your Seqera account executive if a Node-based tool in a session can't reach an internal endpoint.
