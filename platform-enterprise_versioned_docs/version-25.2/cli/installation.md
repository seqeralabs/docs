---
title: "Installation"
description: "Seqera Platform CLI installation and configuration instructions."
date created: "2024-07-16"
last updated: "2025-08-01"
tags: [cli, platform, installation, configuration]
---

1. Download the latest [version][releases] for your OS from the CLI GitHub repository.
1. Rename the file and and make it executable:

    ```bash
    mv tw-* tw
    chmod +x ./tw
    ```

1. Move the file to a directory accessible to your `$PATH` variable:

    ```bash
    sudo mv tw /usr/local/bin/
    ```

### Configuration

The CLI requires an access token to interact with your Seqera Platform instance. Select **User tokens** from the user menu in the [Platform UI](https://cloud.seqera.io), then select **Add token** to create a new token.

Copy the access token value and use it with the CLI in one of two ways:

- **Environment variable**:

  1. Export the token as a shell variable directly into your terminal:

    ```bash
    export TOWER_ACCESS_TOKEN=<your access token>
    ```

  2. Add the `export` command to your `.bashrc`, `.zshrc`, or `.bash_profile` file for it to be permanently added to your environment.

- **tw command flag**:

  Provide the access token directly in your `tw` command with `--access-token`:

  ```bash
  tw --access-token=<your access token> <other options>
  ```

If required, configure the following optional environment variables using the same methods above:

- `TOWER_WORKSPACE_ID`: Workspace ID. Default: Your user workspace.
- `TOWER_API_ENDPOINT`: Seqera API URL. Default: `api.cloud.seqera.io`.

:::tip
Find your `TOWER_WORKSPACE_ID` from the **Workspaces** tab on your organization page. Alternatively, list all the workspaces your token can access with `tw workspaces list` and copy the workspace ID from the command output.
:::

### Health check

Confirm the installation, configuration, and connection:

```bash
tw info

    Details
    -------------------------+----------------------
     Tower API endpoint      | <TOWER_API_ENDPOINT>
     Tower API version       | 1.25.0               
     Tower version           | 24.2.0_cycle22       
     CLI version             | 0.9.4 (f3e846e)      
     CLI minimum API version | 1.15                 
     Authenticated user      | <username>  
     
    System health status
    ---------------------------------------+------------------
     Remote API server connection check    | OK
     Tower API version check               | OK
     Authentication API credential's token | OK
```

### Commands

See [Commands](./commands) for detailed instructions to use the CLI.

### Autocompletion

Activate autocompletion in your current session with this command:

```bash
source <(tw generate-completion)
```

### Custom SSL certificate authority store

If you are using a Private CA SSL certificate not recognized by the default Java certificate authorities, use a [custom](https://www.baeldung.com/jvm-certificate-store-errors) `cacerts` store:

```bash
tw -Djavax.net.ssl.trustStore=/absolute/path/to/cacerts -Djavax.net.ssl.trustStorePassword=<your-password> info
```

Replace `<your-password>` with your keystore password. If you did not set a password when creating the keystore, include the default keystore password `changeit` in the command above. 

You can also rename the binary to `tw-binary` and create a `tw` script to automatically include the custom `cacerts` store in every session:

```bash
#!/usr/bin/env bash
tw-binary -Djavax.net.ssl.trustStore=/absolute/path/to/cacerts -Djavax.net.ssl.trustStorePassword=<your-password> $@
```

### Build binary development versions

tw CLI is a platform binary executable created by a native compilation from Java GraalVM. To compile and build a development version of the binary:

1. If necessary, install [SDKMan!](https://sdkman.io/)
1. From the root of the tower-cli project, install GraalVM:

    ```bash
    sdk env install
    ```

    This ensures that SDKMan uses the tower-cli project-specific `.sdkmanrc` configuration.

1. Install `native-image`:

    ```bash
    gu install native-image
    ```

1. Export your GitHub credentials. GitHub requires authentication for public packages (the token only requires the `read:packages` scope):

    ```bash
    export GITHUB_USERNAME=...
    export GITHUB_TOKEN=...
    ```

1. Create the native client:

    ```bash
    ./gradlew nativeCompile
    ```

    This will install a locally compiled version of `tw` in the nativeCompile directory:

    ```bash
    Produced artifacts:
     <tower-cli-repository-root>/build/native/nativeCompile/tw (executable)
    ========================================================================================================================
    Finished generating 'tw' in 1m 6s.
    [native-image-plugin] Native Image written to: <tower-cli-repository-root>/build/native/nativeCompile
    
    BUILD SUCCESSFUL in 1m 8s
    6 actionable tasks: 2 executed, 4 up-to-date
    ```

1. Run `tw`:

    ```bash
    ./build/native/nativeCompile/tw
    ```

### Non-binary development versions

Run a non-binary development version by executing the [`./tw`](https://github.com/seqeralabs/tower-cli/blob/master/tw) script in the root of the CLI repository.

### License

[Mozilla Public License v2.0](https://github.com/seqeralabs/tower-cli/blob/master/LICENSE.txt)

[releases]: https://github.com/seqeralabs/tower-cli/releases
