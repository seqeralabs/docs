---
title: "Troubleshooting"
description: Platform Enterprise troubleshooting guidance
date: "21 Apr 2023"
tags: [troubleshooting]
---

## Networking

### 503 errors during pipeline execution

A 503 error indicates that one or more services that Seqera Enterprise contacts during workflow execution are unavailable. [Database](./configuration/overview#seqera-and-redis-databases) connectivity is a common cause.

To resolve, ensure all required services are running and available.

### Error: `SocketTimeoutException: connect timed out` with self-hosted Git servers

You might see connection timeout errors when launching workflows from a self-hosted Git server, such as Bitbucket or GitLab. If you configured the correct Git credentials in Seqera Enterprise, this error means the `backend/cron` container can't connect to the Git remote host, often because of a missing or incorrect proxy configuration.

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

To resolve, update the HTTP proxy configuration in the `backend` and `cron` environment with your proxy details:

```bash
export http_proxy="http://PROXY_SERVER:PORT"
export https_proxy="https://PROXY_SERVER:PORT"
```

## Database

### Error: `java.sql.SQLException` (server time zone) on login

After login authentication, Seqera presents an _Unexpected error while processing_ error, with _java.sql.SQLException_ errors related to the server time zone in the backend log:

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

Seqera can't connect to the database because the JDBC client doesn't specify a time zone. Set it with the `serverTimezone` property.

To resolve, append `serverTimezone` to [`TOWER_DB_URL`](./configuration/overview#seqera-and-redis-databases). For the `Europe/Amsterdam` time zone:

```bash
export TOWER_DB_URL="jdbc:mysql://<YOUR_DATABASE_IP>:3306/tower?permitMysqlScheme=true&serverTimezone=Europe/Amsterdam"
```

### Error: `java.io.IOException: Unsupported protocol version 252` (runs stuck as in progress)

When a service is restarted or otherwise interrupted, it can create invalid entries that corrupt your installation's Redis cache. Completed or terminated runs then display as in progress. To resolve, delete the key with the invalid entry (replace `container-name` with your container name):

```bash
## Check if the key exists
docker exec -ti [container-name] redis-cli keys \* | grep workflow

## Show the hash contents of the key
docker exec -ti [container-name] redis-cli hgetall "workflow/modified"

## Delete the key
docker exec -ti [container-name] redis-cli del "workflow/modified"
```

## Authentication

### OpenID Connect (OIDC) login fails with a 500 error in the frontend logs

The OIDC callback request can contain large HTTP headers that exceed the buffer size, which causes login failures:

```bash

  *8317 upstream sent too big header while reading response header from upstream, client: 10.170.157.186, server: localhost, request: "GET /oauth/callback

```

To resolve, rebuild the frontend container and add the following proxy directives to `/etc/nginx/nginx.conf`:

```conf
proxy_buffer_size          128k;
proxy_buffers              4 256k;
proxy_busy_buffers_size    256k;
```

### OIDC callback failure

OIDC callbacks can fail for several reasons. To investigate:

- Set the authentication logging level environment variable to `TOWER_SECURITY_LOGLEVEL=DEBUG`.
- Ensure your `TOWER_OIDC_CLIENT`, `TOWER_OIDC_SECRET`, and `TOWER_OIDC_ISSUER` environment variables all match the values specified in your OIDC provider application.
- Ensure your network infrastructure allows the necessary egress and ingress traffic.

### OIDC `redirect_url` set to HTTP instead of HTTPS

This can occur for several reasons. Verify the following:

- Your `TOWER_SERVER_URL` environment variable uses the `https://` prefix.
- Your `tower.yml` has `micronaut.ssl.enabled` set to `true`.
- Any Load Balancer instance that sends traffic to Seqera Enterprise is configured to use HTTPS as its backend protocol rather than HTTP/TCP.

### Error: `Exhausted available authentication methods` (on-premises HPC)

This error indicates a problem with the SSH credentials that authenticate Seqera to your HPC cluster (such as LSF or Slurm), such as an invalid SSH key or incorrect permissions on the user directory. Check the following:

- Ensure the SSH key is still valid. If not, create new SSH keys and [re-create the compute environment](../compute-envs/hpc) in Seqera with the updated credentials.

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
