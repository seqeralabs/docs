---
title: "Troubleshooting"
description: Platform Enterprise troubleshooting guidance
date: "21 Apr 2023"
tags: [troubleshooting]
---

## Networking

**503 errors during pipeline execution**

Error 503 suggests that one or more of the services being contacted by Seqera Enterprise as part of workflow execution are unavailable. Ensure all required services are running and available. [Database](./configuration/overview.mdx#seqera-and-redis-databases) connectivity is often the culprit for `503` errors.

**_SocketTimeoutException: connect timed out_ errors with self-hosted Git servers**

You may encounter connection timeout issues while trying to launch workflows from a self-hosted Git server (BitBucket, GitLab, etc.). If you configured the correct Git credentials in Seqera Enterprise, this error signals that the `backend/cron` container cannot connect to the Git remote host. This can be caused by a missing or incorrect proxy configuration.

<details>
  <summary>Error log</summary>

  ```bash

  ERROR i.s.t.c.GlobalErrorController - Unexpected error while processing - Error ID: 6h3HBUkaPe03vgzoDPc5HO
  java.net.SocketTimeoutException: connect timed out
          at java.base/java.net.PlainSocketImpl.socketConnect(Native Method)
          at java.base/java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:399)
          at java.base/java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:242)
          at java.base/java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:224)
          at java.base/java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
          at java.base/java.net.Socket.connect(Socket.java:609)
          at java.base/sun.security.ssl.SSLSocketImpl.connect(SSLSocketImpl.java:289)
          at java.base/sun.net.NetworkClient.doConnect(NetworkClient.java:177)
          at java.base/sun.net.www.http.HttpClient.openServer(HttpClient.java:474)
          at java.base/sun.net.www.http.HttpClient.openServer(HttpClient.java:569)
          at java.base/sun.net.www.protocol.https.HttpsClient.<init>(HttpsClient.java:265)
          at java.base/sun.net.www.protocol.https.HttpsClient.New(HttpsClient.java:372)
          at java.base/sun.net.www.protocol.https.AbstractDelegateHttpsURLConnection.getNewHttpClient(AbstractDelegateHttpsURLConnection.java:203)
          at java.base/sun.net.www.protocol.http.HttpURLConnection.plainConnect0(HttpURLConnection.java:1187)
          at java.base/sun.net.www.protocol.http.HttpURLConnection.plainConnect(HttpURLConnection.java:1081)
          at java.base/sun.net.www.protocol.https.AbstractDelegateHttpsURLConnection.connect(AbstractDelegateHttpsURLConnection.java:189)
          at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream0(HttpURLConnection.java:1592)
          at java.base/sun.net.www.protocol.http.HttpURLConnection.getInputStream(HttpURLConnection.java:1520)
          at java.base/java.net.HttpURLConnection.getResponseCode(HttpURLConnection.java:527)
          at java.base/sun.net.www.protocol.https.HttpsURLConnectionImpl.getResponseCode(HttpsURLConnectionImpl.java:334)
          at nextflow.scm.RepositoryProvider.checkResponse(RepositoryProvider.groovy:167)
          at nextflow.scm.RepositoryProvider.invoke(RepositoryProvider.groovy:136)
          at nextflow.scm.RepositoryProvider.memoizedMethodPriv$invokeAndParseResponseString(RepositoryProvider.groovy:218)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
          at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
          at java.base/java.lang.reflect.Method.invoke(Method.java:566)
          at org.codehaus.groovy.reflection.CachedMethod.invoke(CachedMethod.java:107)
          at groovy.lang.MetaMethod.doMethodInvoke(MetaMethod.java:323)
          at groovy.lang.MetaClassImpl.invokeMethod(MetaClassImpl.java:1259)
          at groovy.lang.MetaClassImpl.invokeMethod(MetaClassImpl.java:1026)
          at org.codehaus.groovy.runtime.InvokerHelper.invokePogoMethod(InvokerHelper.java:1029)
          at org.codehaus.groovy.runtime.InvokerHelper.invokeMethod(InvokerHelper.java:1012)
          at org.codehaus.groovy.runtime.InvokerHelper.invokeMethodSafe(InvokerHelper.java:101)
          at nextflow.scm.RepositoryProvider$_closure2.doCall(RepositoryProvider.groovy)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
          at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
          at java.base/java.lang.reflect.Method.invoke(Method.java:566)
          at org.codehaus.groovy.reflection.CachedMethod.invoke(CachedMethod.java:107)
          at groovy.lang.MetaMethod.doMethodInvoke(MetaMethod.java:323)
          at org.codehaus.groovy.runtime.metaclass.ClosureMetaClass.invokeMethod(ClosureMetaClass.java:263)
          at groovy.lang.MetaClassImpl.invokeMethod(MetaClassImpl.java:1026)
          at groovy.lang.Closure.call(Closure.java:412)
          at org.codehaus.groovy.runtime.memoize.Memoize$MemoizeFunction.lambda$call$0(Memoize.java:137)
          at org.codehaus.groovy.runtime.memoize.ConcurrentCommonCache.getAndPut(ConcurrentCommonCache.java:137)
          at org.codehaus.groovy.runtime.memoize.ConcurrentCommonCache.getAndPut(ConcurrentCommonCache.java:113)
          at org.codehaus.groovy.runtime.memoize.Memoize$MemoizeFunction.call(Memoize.java:136)
          at groovy.lang.Closure.call(Closure.java:428)
          at nextflow.scm.RepositoryProvider.invokeAndParseResponse(RepositoryProvider.groovy)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
          at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
          at java.base/java.lang.reflect.Method.invoke(Method.java:566)
          at org.codehaus.groovy.runtime.callsite.PlainObjectMetaMethodSite.doInvoke(PlainObjectMetaMethodSite.java:43)
          at org.codehaus.groovy.runtime.callsite.PogoMetaMethodSite$PogoCachedMethodSiteNoUnwrapNoCoerce.invoke(PogoMetaMethodSite.java:193)
          at org.codehaus.groovy.runtime.callsite.PogoMetaMethodSite.callCurrent(PogoMetaMethodSite.java:61)
          at org.codehaus.groovy.runtime.callsite.AbstractCallSite.callCurrent(AbstractCallSite.java:185)
          at nextflow.scm.BitbucketRepositoryProvider.getCloneUrl(BitbucketRepositoryProvider.groovy:114)
          at nextflow.scm.AssetManager.memoizedMethodPriv$getGitRepositoryUrl(AssetManager.groovy:394)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
          at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
          at java.base/java.lang.reflect.Method.invoke(Method.java:566)
          at org.codehaus.groovy.reflection.CachedMethod.invoke(CachedMethod.java:107)
          at groovy.lang.MetaMethod.doMethodInvoke(MetaMethod.java:323)
          at groovy.lang.MetaClassImpl.invokeMethod(MetaClassImpl.java:1259)
          at groovy.lang.MetaClassImpl.invokeMethod(MetaClassImpl.java:1026)
          at org.codehaus.groovy.runtime.InvokerHelper.invokePogoMethod(InvokerHelper.java:1029)
          at org.codehaus.groovy.runtime.InvokerHelper.invokeMethod(InvokerHelper.java:1012)
          at org.codehaus.groovy.runtime.InvokerHelper.invokeMethodSafe(InvokerHelper.java:101)
          at nextflow.scm.AssetManager$_closure1.doCall(AssetManager.groovy)
          at nextflow.scm.AssetManager$_closure1.doCall(AssetManager.groovy)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
          at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
          at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
          at java.base/java.lang.reflect.Method.invoke(Method.java:566)
          at org.codehaus.groovy.reflection.CachedMethod.invoke(CachedMethod.java:107)
          at groovy.lang.MetaMethod.doMethodInvoke(MetaMethod.java:323)
          at org.codehaus.groovy.runtime.metaclass.ClosureMetaClass.invokeMethod(ClosureMetaClass.java:263)
          at groovy.lang.MetaClassImpl.invokeMethod(MetaClassImpl.java:1026)
          at groovy.lang.Closure.call(Closure.java:412)
          at org.codehaus.groovy.runtime.memoize.Memoize$MemoizeFunction.lambda$call$0(Memoize.java:137)
          at org.codehaus.groovy.runtime.memoize.ConcurrentCommonCache.getAndPut(ConcurrentCommonCache.java:137)
          at org.codehaus.groovy.runtime.memoize.ConcurrentCommonCache.getAndPut(ConcurrentCommonCache.java:113)
          at org.codehaus.groovy.runtime.memoize.Memoize$MemoizeFunction.call(Memoize.java:136)
          at groovy.lang.Closure.call(Closure.java:406)
          at nextflow.scm.AssetManager.getGitRepositoryUrl(AssetManager.groovy)

  ```

</details>

Update the HTTP proxy configuration in the `backend` and `cron` environment with your proxy details:

    ```bash
    export http_proxy="http://PROXY_SERVER:PORT"
    export https_proxy="https://PROXY_SERVER:PORT"
    ```

## Database

**Login failures: _java.sql.SQLException_ in the backend logs**

After Seqera login authentication, an _Unexpected error while processing_ error is presented, with _java.sql.SQLException_ errors related to server time zone in the backend log:

<details>
  <summary>Error log</summary>

  ```
  io.micronaut.transaction.exceptions.CannotCreateTransactionException: Could not open Hibernate Session for transaction
  …
  Caused by: org.hibernate.exception.GenericJDBCException: Unable to acquire JDBC Connection
  …
  java.sql.SQLException: The server time zone value 'CEST' is unrecognized or represents more than one time zone. You must configure either the server or JDBC driver (via the 'serverTimezone' configuration property) to use a more specific time zone value if you want to utilize time zone support.
  …
  ```

</details>

This error means that Seqera is unable to connect to the database and the `JDBC` client must specify the time zone value via `serverTimezone`.

To resolve this issue for `Europe/Amsterdam` time zone, append `serverTimezone` to the value of [`TOWER_DB_URL`](./configuration/overview.mdx#tower-and-redis-databases):

```bash
export TOWER_DB_URL": "jdbc:mysql://<YOUR_DATABASE_IP>:3306/tower?serverTimezone=Europe/Amsterdam"
```

**_java.io.IOException: Unsupported protocol version 252_ error while completed or terminated runs display as in progress on Seqera**

When a service is restarted or otherwise interrupted, this may result in invalid entries which corrupt the cache of your installation's Redis instance. Manually delete the key with the invalid entry to restore expected behavior (replace `container-name` with your container name in the commands below):

```bash
## Check if the key exists
docker exec -ti [container-name] redis-cli keys \* | grep workflow

## Show the hash contents of the key
docker exec -ti [container-name] redis-cli hgetall "workflow/modified"

## Delete the key
docker exec -ti [container-name] redis-cli del "workflow/modified"
```

## Authentication

**Login failures with OpenID Connect (OIDC): 500 error code in the frontend logs**

When using OpenID Connect, the callback request may contain large HTTP headers that exceed buffer size, causing login failures.

```bash

  *8317 upstream sent too big header while reading response header from upstream, client: 10.170.157.186, server: localhost, request: "GET /oauth/callback

```

Rebuild the frontend container and add the following proxy directives to the `/etc/nginx/nginx.conf` file:

```conf
proxy_buffer_size          128k;
proxy_buffers              4 256k;
proxy_busy_buffers_size    256k;
```

**OIDC callback failure**

Callbacks could fail for many reasons. To investigate the problem:

- Set the authentication logging level environment variable to `TOWER_SECURITY_LOGLEVEL=DEBUG`.
- Ensure your `TOWER_OIDC_CLIENT`, `TOWER_OIDC_SECRET`, and `TOWER_OIDC_ISSUER` environment variables all match the values specified in your OIDC provider application.
- Ensure your network infrastructure allows the necessary egress and ingress traffic.

**OIDC `redirect_url` set to HTTP instead of HTTPS**

This can occur for several reasons. Verify the following:

- Your `TOWER_SERVER_URL` environment variable uses the `https://` prefix.
- Your `tower.yml` has `micronaut.ssl.enabled` set to `true`.
- Any Load Balancer instance that sends traffic to Seqera Enterprise is configured to use HTTPS as its backend protocol rather than HTTP/TCP.

**On-prem HPC compute environments: _Exhausted available authentication methods_ error**

This error points to an issue with the SSH credentials used to authenticate Seqera to your HPC cluster (LSF, Slurm, etc.), such as an invalid SSH key or inappropriate permissions on the user directory. Check the following:

- Ensure the SSH key is still valid. If not, create new SSH keys and [re-create the compute environment](../compute-envs/hpc.mdx) in Seqera with the updated credentials.

- Check the backend logs for a stack trace similar to the following:

<details>
  <summary>Error log</summary>

  ```
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

  ```env
  TOWER_SSH_LOGLEVEL=TRACE
  ```

- Check the permissions of the `/home` directory of the user tied to the cluster's SSH credentials. `/home/[user]` should be `chmod 755`, whereas `/home/[user]/ssh` requires `chmod 700`:

  ```bash
  $ pwd ; ls -ld .
  /home/user
  drwxr-xr-x 41 user user 20480

  $ pwd; ls -ld .
  /home/user/.ssh
  drwx------ 2 user user 4096

  ```
