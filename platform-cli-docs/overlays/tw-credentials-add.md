Run `tw credentials add -h` to view a list of providers.

Run `tw credentials add <provider> -h` to view the required fields for your provider.

:::note
You can add multiple credentials from the same provider in the same workspace.
:::

### Compute environment credentials

Platform requires credentials to access your cloud compute environments. See the [compute environment page][compute-envs] for your cloud provider for more information.

Command:

```bash
tw credentials add aws --name=my_aws_creds --access-key=<aws access key> --secret-key=<aws secret key>
```

Example output:

```bash
New AWS credentials 'my_aws_creds (1sxCxvxfx8xnxdxGxQxqxH)' added at user workspace
```

### Git credentials

Platform requires access credentials to interact with pipeline Git repositories. See [Git integration][git-integration] for more information.

Command:

```bash
tw credentials add github -n=my_GH_creds -u=<GitHub username> -p=<GitHub access token>
```

Example output:

```bash
New GITHUB credentials 'my_GH_creds (xxxxx3prfGlpxxxvR2xxxxo7ow)' added at user workspace
```

### Container registry credentials

Configure credentials for the Nextflow Wave container service to authenticate to private and public container registries. See the **Container registry credentials** section under [Credentials][credentials] for registry-specific instructions.

:::note
Container registry credentials are only used by the Wave container service. See [Wave containers][wave-docs] for more information.
:::
